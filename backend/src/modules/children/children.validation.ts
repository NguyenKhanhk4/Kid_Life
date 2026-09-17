// Zod validation schemas cho module Children
import { z } from 'zod';

export const createChildSchema = z.object({
  name: z
    .string({ required_error: 'Tên bé là bắt buộc' })
    .min(2, 'Tên bé phải có ít nhất 2 ký tự')
    .max(50, 'Tên bé tối đa 50 ký tự')
    .trim(),
  age: z
    .number()
    .int('Tuổi phải là số nguyên')
    .min(1, 'Tuổi tối thiểu là 1')
    .max(18, 'Tuổi tối đa là 18')
    .optional(),
  avatar: z.string().optional(),
  pinCode: z
    .string({ required_error: 'Mã PIN là bắt buộc' })
    .regex(/^\d{4}$/, 'Mã PIN phải gồm đúng 4 chữ số'),
});

export const updateChildSchema = z.object({
  name: z
    .string()
    .min(2, 'Tên bé phải có ít nhất 2 ký tự')
    .max(50, 'Tên bé tối đa 50 ký tự')
    .trim()
    .optional(),
  age: z
    .number()
    .int('Tuổi phải là số nguyên')
    .min(1, 'Tuổi tối thiểu là 1')
    .max(18, 'Tuổi tối đa là 18')
    .optional(),
  avatar: z.string().optional(),
});

export const resetPinSchema = z.object({
  newPinCode: z
    .string({ required_error: 'Mã PIN mới là bắt buộc' })
    .regex(/^\d{4}$/, 'Mã PIN phải gồm đúng 4 chữ số'),
});

export type CreateChildInput = z.infer<typeof createChildSchema>;
export type UpdateChildInput = z.infer<typeof updateChildSchema>;
export type ResetPinInput = z.infer<typeof resetPinSchema>;
