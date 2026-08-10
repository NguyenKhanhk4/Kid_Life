import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errors/AppError';

export const validateUpdateProfile = (req: Request, _res: Response, next: NextFunction) => {
  const { fullName, phone } = req.body;

  if (fullName !== undefined && (typeof fullName !== 'string' || fullName.trim().length < 2)) {
    return next(new AppError('Full name must be at least 2 characters', 400, 'INVALID_NAME'));
  }
  if (phone !== undefined && typeof phone !== 'string') {
    return next(new AppError('Phone must be a string', 400, 'INVALID_PHONE'));
  }
  next();
};
