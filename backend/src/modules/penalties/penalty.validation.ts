// Zod validation schemas cho Penalty module
import { z } from 'zod';

export const createPenaltySchema = z.object({
  child_id: z
    .string({ required_error: 'child_id là bắt buộc' })
    .min(1, 'child_id không được để trống'),
  parent_id: z
    .string({ required_error: 'parent_id là bắt buộc' })
    .min(1, 'parent_id không được để trống'),
  reason: z
    .string({ required_error: 'Lý do không được để trống' })
    .min(1, 'Lý do không được để trống')
    .max(200, 'Lý do tối đa 200 ký tự'),
  penalty_xp: z
    .number({
      required_error: 'Số XP phạt là bắt buộc',
      invalid_type_error: 'Số XP phạt phải là số',
    })
    .min(1, 'Số XP phạt tối thiểu là 1')
    .max(500, 'Số XP phạt tối đa là 500'),
});
