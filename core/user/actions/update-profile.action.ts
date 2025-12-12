import { api } from '@/core/api/api';
import { UpdateProfileResponse } from '../interfaces/update-profile.interface';
import { UpdateProfileRequest } from '../schemas/update-profile.schema';

export const updateProfileAction = async ({
  lastName,
  firstName,
  password,
  phoneNumber,
}: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
  const { data } = await api.patch<UpdateProfileResponse>(
    'auth/update-profile',
    {
      lastName,
      firstName,
      password,
      phoneNumber,
    }
  );
  return data;
};
