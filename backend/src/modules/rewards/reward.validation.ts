// Zod validation schemas cho Reward module
import { z } from 'zod';

export const createRewardSchema = z.object({
  parent_id: z.string({ required_error: 'parent_id là bắt buộc' }).min(1, 'parent_id không được để trống'),
  title: z.string({ required_error: 'Tiêu đề phần thưởng là bắt buộc' }).min(1, 'Tiêu đề không được để trống').max(100, 'Tiêu đề không được vượt quá 100 ký tự'),
  cost_xp: z.number({ required_error: 'Điểm thưởng (XP) là bắt buộc', invalid_type_error: 'Điểm thưởng phải là số' }).min(1, 'Điểm thưởng tối thiểu là 1 XP'),
  category: z.enum(['vat_ly', 'trai_nghiem', 'gia_dinh', 'khac'], {
    required_error: 'Danh mục là bắt buộc',
    invalid_type_error: 'Danh mục không hợp lệ, phải là một trong: vat_ly, trai_nghiem, gia_dinh, khac',
  }),
  icon: z.string().optional().default(''),
});

export const updateRewardSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống').max(100, 'Tiêu đề không được vượt quá 100 ký tự').optional(),
  cost_xp: z.number({ invalid_type_error: 'Điểm thưởng phải là số' }).min(1, 'Điểm thưởng tối thiểu là 1 XP').optional(),
  category: z.enum(['vat_ly', 'trai_nghiem', 'gia_dinh', 'khac'], {
    invalid_type_error: 'Danh mục không hợp lệ, phải là một trong: vat_ly, trai_nghiem, gia_dinh, khac',
  }).optional(),
  icon: z.string().optional(),
  active: z.boolean({ invalid_type_error: 'Trạng thái active phải là boolean' }).optional(),
});

export const redeemSchema = z.object({
  reward_id: z.string({ required_error: 'reward_id là bắt buộc' }).min(1, 'reward_id không được để trống'),
  child_id: z.string({ required_error: 'child_id là bắt buộc' }).min(1, 'child_id không được để trống'),
});

export const approveRedemptionSchema = z.object({
  status: z.enum(['approved', 'rejected'], {
    required_error: 'Trạng thái phải là approved hoặc rejected',
    invalid_type_error: 'Trạng thái phải là approved hoặc rejected',
  }),
});
