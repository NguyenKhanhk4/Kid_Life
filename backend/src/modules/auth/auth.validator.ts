import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errors/AppError';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegister = (req: Request, _res: Response, next: NextFunction) => {
  const { email, password, fullName, role } = req.body;

  if (!email || !EMAIL_REGEX.test(email)) {
    return next(new AppError('Valid email is required', 400, 'INVALID_EMAIL'));
  }
  if (!password || typeof password !== 'string' || password.length < 8) {
    return next(new AppError('Password must be at least 8 characters', 400, 'INVALID_PASSWORD'));
  }
  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    return next(new AppError('Full name is required (min 2 characters)', 400, 'INVALID_NAME'));
  }
  const allowedRoles = ['PARENT', 'EXPERT'];
  if (!role || !allowedRoles.includes(role)) {
    return next(new AppError(`Role must be one of: ${allowedRoles.join(', ')}`, 400, 'INVALID_ROLE'));
  }
  next();
};

export const validateLogin = (req: Request, _res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !EMAIL_REGEX.test(email)) {
    return next(new AppError('Valid email is required', 400, 'INVALID_EMAIL'));
  }
  if (!password || typeof password !== 'string') {
    return next(new AppError('Password is required', 400, 'INVALID_PASSWORD'));
  }
  next();
};

export const validateChangePassword = (req: Request, _res: Response, next: NextFunction) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || typeof oldPassword !== 'string') {
    return next(new AppError('Current password is required', 400, 'INVALID_PASSWORD'));
  }
  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
    return next(new AppError('New password must be at least 8 characters', 400, 'INVALID_PASSWORD'));
  }
  if (oldPassword === newPassword) {
    return next(new AppError('New password must differ from current password', 400, 'SAME_PASSWORD'));
  }
  next();
};

export const validateResetPassword = (req: Request, _res: Response, next: NextFunction) => {
  const { token, newPassword } = req.body;
  if (!token || typeof token !== 'string') {
    return next(new AppError('Reset token is required', 400, 'INVALID_TOKEN'));
  }
  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
    return next(new AppError('New password must be at least 8 characters', 400, 'INVALID_PASSWORD'));
  }
  next();
};

export const validateForgotPassword = (req: Request, _res: Response, next: NextFunction) => {
  const { email } = req.body;
  if (!email || !EMAIL_REGEX.test(email)) {
    return next(new AppError('Valid email is required', 400, 'INVALID_EMAIL'));
  }
  next();
};

export const validateRefreshToken = (req: Request, _res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;
  if (!refreshToken || typeof refreshToken !== 'string') {
    return next(new AppError('Refresh token is required', 400, 'INVALID_TOKEN'));
  }
  next();
};
