import { api } from '@/core/api/api';
import type { SignUpResponse } from '../interfaces/sign-up.response';
import { SignUpApiRequest } from '../schemas/sign-up.schema';

export const signUpAction = async (
  newUser: SignUpApiRequest
): Promise<SignUpResponse> => {
  newUser.email = newUser.email.toLocaleLowerCase().trim();

  const { data } = await api.post<SignUpResponse>('/auth/signup', newUser);
  return data;
};
