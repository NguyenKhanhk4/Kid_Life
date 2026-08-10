import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errors/AppError';

export const validateCreateChild = (req: Request, _res: Response, next: NextFunction) => {
  const { name, dateOfBirth, loginUsername, loginPassword } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 1) {
    return next(new AppError('Child name is required', 400, 'INVALID_NAME'));
  }
  if (!dateOfBirth) {
    return next(new AppError('Date of birth is required', 400, 'INVALID_DOB'));
  }
  const dob = new Date(dateOfBirth);
  if (isNaN(dob.getTime())) {
    return next(new AppError('Invalid date of birth format', 400, 'INVALID_DOB'));
  }
  // Check age 3-12 range
  const ageDiff = Date.now() - dob.getTime();
  const ageYears = ageDiff / (1000 * 60 * 60 * 24 * 365.25);
  if (ageYears < 3 || ageYears > 12) {
    return next(new AppError('Child age must be between 3 and 12', 400, 'INVALID_AGE'));
  }
  if (!loginUsername || typeof loginUsername !== 'string' || loginUsername.trim().length < 3) {
    return next(new AppError('Login username must be at least 3 characters', 400, 'INVALID_USERNAME'));
  }
  if (!loginPassword || typeof loginPassword !== 'string' || loginPassword.length < 4) {
    return next(new AppError('Login password must be at least 4 characters', 400, 'INVALID_PASSWORD'));
  }
  next();
};

export const validateUpdateChild = (req: Request, _res: Response, next: NextFunction) => {
  const { name, dateOfBirth } = req.body;

  if (name !== undefined && (typeof name !== 'string' || name.trim().length < 1)) {
    return next(new AppError('Child name must not be empty', 400, 'INVALID_NAME'));
  }
  if (dateOfBirth !== undefined) {
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) {
      return next(new AppError('Invalid date of birth format', 400, 'INVALID_DOB'));
    }
  }
  next();
};
