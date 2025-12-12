import { api } from '@/core/api/api';
import { VerifyCodeResponse } from '../interfaces/verify-code.response';
import { VerifyCodeRequest } from '../schemas/verify-email-code.schema';

export const verifyCodeAction = async ({
  code,
  email,
}: VerifyCodeRequest): Promise<VerifyCodeResponse> => {
  const { data } = await api.post<VerifyCodeResponse>(
    '/auth/verify-email-code',
    {
      code,
      email,
    }
  );

  return data;
};
