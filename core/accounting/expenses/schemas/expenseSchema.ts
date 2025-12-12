import { z } from 'zod';
// import { ImagePickerAsset } from "expo-image-picker";

// const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB en bytes
// const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

// export const imageFileSchema = z
//   .custom<ImagePickerAsset | undefined>()
//   .refine((file) => file !== undefined, "Image is required.")
//   .refine(
//     (file) => file && file.fileSize && file.fileSize <= MAX_IMAGE_SIZE,
//     `The maximum file size is ${MAX_IMAGE_SIZE / (1024 * 1024)}MB.`
//   )
//   .refine(
//     (file) => file && file.type && ACCEPTED_IMAGE_TYPES.includes(file.type),
//     "Only .jpg, .jpeg, .png, and .webp files are allowed."
//   );

export const expenseSchema = z.object({
  id: z.string({ required_error: 'The id is required' }),
  date: z.string({ required_error: 'The date is required' }),
  merchant: z
    .string({ required_error: 'The merchant is required' })
    .min(1, 'Merchant is required'),
  tax: z.coerce
    .number({
      invalid_type_error: 'Only numbers with decimals are allowed',
      message: 'Only numbers with decimals are allowed',
    })
    .positive()
    .multipleOf(0.01),
  // .regex(/^\d+(\.\d+)?$/, 'Only numbers with decimals are allowed'),
  total: z.coerce.number().positive().multipleOf(0.01),
  // .regex(/^\d+(\.\d+)?$/, 'Only numbers with decimals are allowed'),
  imageUrl: z.string({ required_error: 'The image is required' }).optional(),
  notes: z.string({ required_error: 'The notes are required' }).optional(),
  categoryId: z.string({ required_error: 'The category is required' }),
  subcategoryId: z
    .string({ required_error: 'The subcategory is required' })
    .optional(),

  // Transient field for file upload. Not stored in the database.
  // imageFile: imageFileSchema.optional(),
});

export type ExpenseFormFields = z.infer<typeof expenseSchema>;
