import { api } from '@/core/api/api';
import { AuthResponse } from '../interfaces';

export const checkAuthStatusAction = async (): Promise<AuthResponse> => {
  const { data } = await api.get<AuthResponse>('/auth/check-status');
  return data;
};
