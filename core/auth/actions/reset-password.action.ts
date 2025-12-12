import { api } from '@/core/api/api';
import { ResetPasswordResponse } from '../interfaces/reset-password.response';
import { ResetPasswordRequest } from '../schemas/reset-password.schema';

export const resetPasswordAction = async ({
  code,
  email,
  newPassword,
}: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
  const { data } = await api.post<ResetPasswordResponse>(
    '/auth/reset-password',
    { code, email, newPassword }
  );

  return data;
};
