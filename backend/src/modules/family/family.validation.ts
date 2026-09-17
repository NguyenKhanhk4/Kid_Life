// Zod validation schemas cho module Family
import { z } from 'zod';

export const inviteMemberSchema = z.object({
  phone: z
    .string({ required_error: 'Số điện thoại là bắt buộc' })
    .regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ (10-11 chữ số)'),
  role: z.enum(['parent', 'grandparent'], {
    required_error: 'Vai trò là bắt buộc',
    invalid_type_error: "Vai trò phải là 'parent' hoặc 'grandparent'",
  }),
});

export const updateRoleSchema = z.object({
  role: z.enum(['parent', 'grandparent'], {
    required_error: 'Vai trò là bắt buộc',
    invalid_type_error: "Vai trò phải là 'parent' hoặc 'grandparent'",
  }),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
