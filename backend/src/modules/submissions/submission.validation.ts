// Zod validation schemas cho Submission module
import { z } from 'zod';

export const createSubmissionSchema = z.object({
  mission_id: z.string({ required_error: 'mission_id là bắt buộc' }).min(1, 'mission_id không được để trống'),
  child_id: z.string({ required_error: 'child_id là bắt buộc' }).min(1, 'child_id không được để trống'),
});

export const updateSubtaskSchema = z.object({
  is_done: z.boolean({ required_error: 'is_done là bắt buộc', invalid_type_error: 'is_done phải là boolean' }),
});
