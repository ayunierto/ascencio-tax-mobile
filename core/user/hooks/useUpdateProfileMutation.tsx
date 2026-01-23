import { useMutation } from '@tanstack/react-query';

import { ServerException } from '@/core/interfaces/server-exception.response';
import { AxiosError } from 'axios';
import { updateProfileAction } from '../actions/update-profile.action';
import { UpdateProfileResponse } from '../interfaces/update-profile.interface';
import { UpdateProfileRequest } from '@ascencio/shared';

export const useUpdateProfileMutation = () => {
  return useMutation<
    UpdateProfileResponse,
    AxiosError<ServerException>,
    UpdateProfileRequest
  >({
    mutationFn: updateProfileAction,
    onError: (error) => {
      console.error('Update Profile Error:', error);
    },
  });
};
