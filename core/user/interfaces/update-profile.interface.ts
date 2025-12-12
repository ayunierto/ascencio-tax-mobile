import { User } from '@/core/auth/interfaces';

export interface UpdateProfileResponse {
  message: string;
  user: User;
}
