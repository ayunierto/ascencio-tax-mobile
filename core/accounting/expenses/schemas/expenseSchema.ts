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
  id: z.string(),
  date: z.string(),
  merchant: z.string().min(1, 'Merchant is required'),
  tax: z.number().positive('Tax must be positive').multipleOf(0.01),
  total: z.number().positive('Total must be positive').multipleOf(0.01),
  imageUrl: z.string().optional(),
  notes: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  subcategoryId: z.string().optional(),
});

export type ExpenseFormFields = z.infer<typeof expenseSchema>;
