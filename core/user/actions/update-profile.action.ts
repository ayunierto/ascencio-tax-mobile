import { api } from '@/core/api/api';
import { UpdateProfileRequest, UpdateProfileResponse } from '@ascencio/shared';

export const updateProfileAction = async (
  values: UpdateProfileRequest,
): Promise<UpdateProfileResponse> => {
  // Clean up the payload: remove undefined values and convert empty strings to undefined
  const cleanedValues: Partial<UpdateProfileRequest> = {
    firstName: values.firstName,
    lastName: values.lastName,
    countryCode: values.countryCode,
  };

  // Only include phoneNumber if it has a value
  if (values.phoneNumber && values.phoneNumber.trim() !== '') {
    cleanedValues.phoneNumber = values.phoneNumber;
  }

  // Only include password if it has a value
  if (values.password && values.password.trim() !== '') {
    cleanedValues.password = values.password;
  }

  const { data } = await api.patch<UpdateProfileResponse>(
    'auth/update-profile',
    cleanedValues,
  );
  return data;
};
