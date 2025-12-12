import { api } from '@/core/api/api';
import { ForgotPasswordResponse } from '../interfaces/forgot-password.response';
import { ForgotPasswordRequest } from '../schemas/forgot-password.schema';

export const forgotPasswordAction = async ({
  email,
}: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
  const { data } = await api.post<ForgotPasswordResponse>(
    '/auth/forgot-password',
    { email }
  );

  return data;
};
