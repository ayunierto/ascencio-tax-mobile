import { api } from '@/core/api/api';

export const resendCode = async (email: string) => {
  const { data } = await api.post('/auth/resend-email-code', {
    email: email.toLocaleLowerCase().trim(),
  });

  return data;
};
