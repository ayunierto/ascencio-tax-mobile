import { api } from '@/core/api/api';
import { UpdateProfileResponse } from '../interfaces/update-profile.interface';
import { UpdateProfileRequest } from '@ascencio/shared';

export const updateProfileAction = async ({
  lastName,
  firstName,
  password,
  phoneNumber,
  countryCode,
}: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
  const { data } = await api.patch<UpdateProfileResponse>(
    'auth/update-profile',
    {
      lastName,
      firstName,
      password,
      phoneNumber,
      countryCode,
    }
  );
  return data;
};
