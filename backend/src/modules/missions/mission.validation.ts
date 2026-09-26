// Zod validation schemas cho Mission module
import { z } from 'zod';

export const createMissionSchema = z.object({
  child_id: z.string({ required_error: 'child_id là bắt buộc' }).min(1, 'child_id không được để trống'),
  title: z.string({ required_error: 'Tiêu đề là bắt buộc' }).min(1, 'Tiêu đề không được để trống').max(100, 'Tiêu đề không được vượt quá 100 ký tự'),
  category: z.enum(['hoc_tap', 'nha_cua', 'the_chat', 'ky_nang', 'khac'], { required_error: 'Danh mục là bắt buộc', invalid_type_error: 'Danh mục không hợp lệ, phải là một trong: hoc_tap, nha_cua, the_chat, ky_nang, khac' }),
  reward_xp: z.number({ required_error: 'Điểm thưởng là bắt buộc', invalid_type_error: 'Điểm thưởng phải là số' }).min(1, 'Điểm thưởng tối thiểu là 1').max(500, 'Điểm thưởng tối đa là 500'),
  schedule_time: z.string().optional().default(''),
  subtasks: z.array(z.string().min(1, 'Tên bước không được để trống')).optional().default([]),
});

export const updateMissionSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  category: z.enum(['hoc_tap', 'nha_cua', 'the_chat', 'ky_nang', 'khac']).optional(),
  reward_xp: z.number().min(1).max(500).optional(),
  schedule_time: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'submitted', 'done']).optional(),
});
