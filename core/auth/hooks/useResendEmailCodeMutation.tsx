import { useMutation } from '@tanstack/react-query';

import Toast from 'react-native-toast-message';
import { resendCode } from '../actions/resend-code.action';

export interface ResendEmailCodeResponse {
  message: string;
  statusCode?: number;
  error?: string;
}

export const useResendEmailCodeMutation = () => {
  return useMutation<ResendEmailCodeResponse, Error, string>({
    mutationFn: async (email: string) => {
      return await resendCode(email);
    },
    onSuccess: (response) => {
      Toast.show({
        type: 'error',
        text1: 'Resend Email Code Error',
        text2: response.message,
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Resend Email Code Error',
        text2: error.message,
      });
    },
  });
};
