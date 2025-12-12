import { ServerException } from '@/core/interfaces/server-exception.response';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { SignUpResponse } from '../interfaces/sign-up.response';
import { SignUpApiRequest } from '../schemas/sign-up.schema';
import { useAuthStore } from '../store/useAuthStore';

export const useSignUpMutation = () => {
  const { signUp } = useAuthStore();

  return useMutation<
    SignUpResponse,
    AxiosError<ServerException>,
    SignUpApiRequest
  >({
    mutationFn: async (data) => {
      return await signUp(data);
    },
    onSuccess: () => {
      router.push('/auth/verify-email');
      Toast.show({
        type: 'success',
        text1: 'Sign up successful',
        text2: 'Please verify your email to continue.',
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Sign up failed',
        text2: error.message || 'An error occurred during sign up.',
      });
    },
  });
};
