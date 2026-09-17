// Zod validation schemas cho module Auth
import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string({ required_error: 'Email là bắt buộc' })
    .email('Email không hợp lệ')
    .toLowerCase(),
  password: z
    .string({ required_error: 'Mật khẩu là bắt buộc' })
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  fullName: z
    .string({ required_error: 'Họ tên là bắt buộc' })
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .trim(),
  phone: z
    .string()
    .regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ')
    .optional(),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email là bắt buộc' })
    .email('Email không hợp lệ')
    .toLowerCase(),
  password: z
    .string({ required_error: 'Mật khẩu là bắt buộc' })
    .min(1, 'Mật khẩu không được để trống'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z
    .string({ required_error: 'refreshToken là bắt buộc' })
    .min(1, 'refreshToken không được để trống'),
});

export const changePasswordSchema = z.object({
  oldPassword: z
    .string({ required_error: 'Mật khẩu cũ là bắt buộc' })
    .min(1, 'Mật khẩu cũ không được để trống'),
  newPassword: z
    .string({ required_error: 'Mật khẩu mới là bắt buộc' })
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
