import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errors/AppError';

export const validateCreateSkill = (req: Request, _res: Response, next: NextFunction) => {
  const { name, description, ageRange } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return next(new AppError('Skill name must be at least 2 characters', 400, 'INVALID_NAME'));
  }
  if (!description || typeof description !== 'string' || description.trim().length < 5) {
    return next(new AppError('Description must be at least 5 characters', 400, 'INVALID_DESCRIPTION'));
  }
  if (!ageRange || typeof ageRange !== 'object') {
    return next(new AppError('Age range is required with min and max', 400, 'INVALID_AGE_RANGE'));
  }
  if (typeof ageRange.min !== 'number' || typeof ageRange.max !== 'number') {
    return next(new AppError('Age range min and max must be numbers', 400, 'INVALID_AGE_RANGE'));
  }
  if (ageRange.min < 0 || ageRange.max < ageRange.min) {
    return next(new AppError('Invalid age range (min must be >= 0, max >= min)', 400, 'INVALID_AGE_RANGE'));
  }
  next();
};
