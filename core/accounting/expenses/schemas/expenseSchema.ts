import { z } from 'zod';
import { ValidationMessages as ValMsgs } from '@ascencio/shared/i18n';
import { buildZodMessage as buildZodMsg } from '@ascencio/shared';

// Schema for form input (accepts strings that will be converted)
export const expenseFormSchema = z.object({
  id: z.string(),
  date: z.string().min(1, buildZodMsg(ValMsgs.REQUIRED)),
  merchant: z.string().min(1, buildZodMsg(ValMsgs.REQUIRED)),
  tax: z
    .string()
    .min(1, buildZodMsg(ValMsgs.REQUIRED))
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      },
      {
        message: buildZodMsg(ValMsgs.NUMBER).message,
      },
    ),
  total: z
    .string()
    .min(1, buildZodMsg(ValMsgs.REQUIRED))
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      },
      {
        message: buildZodMsg(ValMsgs.NUMBER).message,
      },
    ),
  imageUrl: z.string().optional(),
  notes: z.string().optional(),
  categoryId: z.string().min(1, buildZodMsg(ValMsgs.REQUIRED)),
  subcategoryId: z.string().optional(),
});

// Schema for API (numbers)
export const expenseSchema = z.object({
  id: z.string(),
  date: z.string().min(1, buildZodMsg(ValMsgs.REQUIRED)),
  merchant: z.string().min(1, buildZodMsg(ValMsgs.REQUIRED)),
  tax: z
    .number({
      message: buildZodMsg(ValMsgs.NUMBER).message,
    })
    .positive(buildZodMsg(ValMsgs.POSITIVE).message)
    .multipleOf(0.01),
  total: z
    .number({
      message: buildZodMsg(ValMsgs.NUMBER).message,
    })
    .positive(buildZodMsg(ValMsgs.POSITIVE).message)
    .multipleOf(0.01),
  imageUrl: z.string().optional(),
  notes: z.string().optional(),
  categoryId: z.string().min(1, buildZodMsg(ValMsgs.REQUIRED)),
  subcategoryId: z.string().optional(),
});

export type ExpenseFormInput = z.infer<typeof expenseFormSchema>;
export type ExpenseFormFields = z.infer<typeof expenseSchema>;
