import { create } from 'zustand';

import { StorageAdapter } from '@/core/adapters/storage.adapter';
import {
  checkAuthStatusAction,
  deleteAccountAction,
  forgotPasswordAction,
  resetPasswordAction,
  signInAction,
  signUpAction,
  verifyCodeAction,
} from '../actions';
import { AuthResponse } from '../interfaces/auth.response';
import { DeleteAccountResponse } from '../interfaces/delete-account.response';
import { ForgotPasswordResponse } from '../interfaces/forgot-password.response';
import { ResetPasswordResponse } from '../interfaces/reset-password.response';
import { SignUpResponse } from '../interfaces/sign-up.response';
import { User } from '../interfaces/user.interface';
import { VerifyCodeResponse } from '../interfaces/verify-code.response';
import { DeleteAccountRequest } from '../schemas/delete-account.schema';
import { ForgotPasswordRequest } from '../schemas/forgot-password.schema';
import { ResetPasswordRequest } from '../schemas/reset-password.schema';
import { SignInRequest } from '../schemas/sign-in.schema';
import { SignUpApiRequest } from '../schemas/sign-up.schema';
import { VerifyCodeRequest } from '../schemas/verify-email-code.schema';

type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading' | 'network-error';

export interface AuthState {
  // Properties
  authStatus: AuthStatus;
  access_token: string | null;
  user: User | null;
  tempEmail?: string; // For storing email during password reset

  // Getters
  isAdmin: () => boolean;

  // Methods
  signUp: (data: SignUpApiRequest) => Promise<SignUpResponse>;
  verifyCode: (data: VerifyCodeRequest) => Promise<VerifyCodeResponse>;
  signIn: (credentials: SignInRequest) => Promise<AuthResponse>;
  checkAuthStatus: () => Promise<boolean>;
  deleteAccount: (data: DeleteAccountRequest) => Promise<DeleteAccountResponse>;
  logout: () => Promise<void>;
  forgotPassword: (
    data: ForgotPasswordRequest
  ) => Promise<ForgotPasswordResponse>;
  resetPassword: (data: ResetPasswordRequest) => Promise<ResetPasswordResponse>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  access_token: null,
  user: null,
  authStatus: 'loading',
  tempEmail: undefined,

  isAdmin: () => {
    const roles = get().user?.roles || [];
    return roles.includes('admin');
  },

  checkAuthStatus: async () => {
    const access_token = await StorageAdapter.getItem('access_token');
    if (!access_token) {
      set({ authStatus: 'unauthenticated', user: null, access_token: null });
      return false;
    }

    try {
      const response = await checkAuthStatusAction();
      await StorageAdapter.setItem('access_token', response.access_token);
      set({
        user: response.user,
        access_token: response.access_token,
        authStatus: 'authenticated',
      });
      return true;
    } catch (error) {
      console.error(error);
      await StorageAdapter.removeItem('access_token');
      set({
        user: undefined,
        access_token: undefined,
        authStatus: 'unauthenticated',
      });
      return false;
    }
  },

  signUp: async (data: SignUpApiRequest) => {
    const response = await signUpAction(data);
    set({ tempEmail: data.email });
    return response;
  },

  verifyCode: async (data: VerifyCodeRequest) => {
    const response = await verifyCodeAction(data);
    return response;
  },

  signIn: async (credentials: SignInRequest) => {
    // Store the email temporarily for verification purposes
    set({ tempEmail: credentials.email });

    try {
      const response = await signInAction(credentials);
      await StorageAdapter.setItem('access_token', response.access_token);
      set({
        user: response.user,
        access_token: response.access_token,
        authStatus: 'authenticated',
      });
      return response;
    } catch (error) {
      await StorageAdapter.removeItem('access_token');
      set({ user: null, access_token: null, authStatus: 'unauthenticated' });
      throw error;
    }
  },

  deleteAccount: async (data: DeleteAccountRequest) => {
    const response = await deleteAccountAction(data);

    await StorageAdapter.removeItem('access_token'); // Clear token on account deletion
    set({ user: null, access_token: null, authStatus: 'unauthenticated' });
    return response;
  },

  logout: async () => {
    await StorageAdapter.removeItem('access_token');
    set({ user: null, access_token: null, authStatus: 'unauthenticated' });
  },

  forgotPassword: async (data: ForgotPasswordRequest) => {
    try {
      const response = await forgotPasswordAction(data);
      set({ tempEmail: data.email });
      return response;
    } catch (error) {
      console.error('Error sending forgot password request', error);
      throw error;
    }
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    try {
      const response = await resetPasswordAction(data);
      return response;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },
}));
