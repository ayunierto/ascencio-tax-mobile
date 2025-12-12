import * as z from 'zod';

export const verifyCodeSchema = z.object({
  email: z.string({ required_error: 'Email is required.' }).email({
    message: 'Email must be a valid email.',
  }),
  code: z
    .string()
    .min(6, {
      message: 'Code must be at least 6 characters long.',
    })
    .max(6, {
      message: 'Code must be exactly 6 characters long.',
    }),
});

export type VerifyCodeRequest = z.infer<typeof verifyCodeSchema>;
