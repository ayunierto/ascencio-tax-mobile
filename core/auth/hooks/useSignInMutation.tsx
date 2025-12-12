import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { ServerException } from '@/core/interfaces/server-exception.response';
import { AuthResponse } from '../interfaces';
import { SignInRequest } from '../schemas/sign-in.schema';
import { useAuthStore } from '../store/useAuthStore';

export const useSignInMutation = () => {
  const { signIn } = useAuthStore();

  return useMutation<AuthResponse, AxiosError<ServerException>, SignInRequest>({
    mutationFn: signIn,
    onError: (error) => {
      console.error(error);
    },
  });
};
