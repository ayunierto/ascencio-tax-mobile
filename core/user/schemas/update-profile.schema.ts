import { z } from 'zod';

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  countryCode: z.string().optional(),
  phoneNumber: z.string().optional(),
  password: z.string().optional(),
});

export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>;
