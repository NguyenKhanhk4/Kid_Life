// Zod validation schemas cho VirtualBank module
import { z } from 'zod';

export const depositSchema = z.object({
  child_id: z
    .string({ required_error: 'child_id là bắt buộc' })
    .min(1, 'child_id không được để trống'),
  amount: z
    .number({
      required_error: 'amount phải là số',
      invalid_type_error: 'amount phải là số',
    })
    .min(1, 'Số XP gửi phải lớn hơn 0'),
});

export const withdrawSchema = z.object({
  child_id: z
    .string({ required_error: 'child_id là bắt buộc' })
    .min(1, 'child_id không được để trống'),
  amount: z
    .number({
      required_error: 'amount phải là số',
      invalid_type_error: 'amount phải là số',
    })
    .min(1, 'Số XP rút phải lớn hơn 0'),
});
