import * as z from 'zod';

export const availabilitySchema = z.object({
  serviceId: z.string().uuid({ message: 'Invalid service ID format' }),
  staffId: z.string().optional(),
  date: z.string({
    required_error: 'The date is required. Please select a date.',
  }),
  time: z
    .string({ required_error: 'The time is required. Please select a time.' })
    .min(4, 'The time is required. Please select a time.'),
  timeZone: z.string({
    required_error: 'The time zone is required. Please select a time zone.',
  }),
});

export type AvailabilityRequest = z.infer<typeof availabilitySchema>;
