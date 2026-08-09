import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../errors/AppError';

export const validateObjectId = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
      return next(new AppError(`Invalid format for ${paramName}`, 400, 'INVALID_ID'));
    }
    next();
  };
};

export const validateBodyObjectId = (fieldName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.body[fieldName] || !mongoose.Types.ObjectId.isValid(req.body[fieldName])) {
      return next(new AppError(`Invalid or missing format for ${fieldName}`, 400, 'INVALID_ID'));
    }
    next();
  };
};

export const validatePositiveIntegerBody = (fieldName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const val = req.body[fieldName];
    if (typeof val !== 'number' || !Number.isInteger(val) || val <= 0) {
      return next(new AppError(`${fieldName} must be a positive integer`, 400, 'INVALID_NUMBER'));
    }
    next();
  };
};

export const validatePagination = (req: Request, res: Response, next: NextFunction) => {
  const limit = req.query.limit;
  if (limit) {
    const numLimit = Number(limit);
    if (!Number.isInteger(numLimit) || numLimit <= 0 || numLimit > 100) {
      return next(new AppError('Limit must be an integer between 1 and 100', 400, 'INVALID_PAGINATION'));
    }
  }
  next();
};

export const validateEnumBody = (fieldName: string, allowedValues: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const val = req.body[fieldName];
    if (!val || !allowedValues.includes(val)) {
      return next(new AppError(`Invalid ${fieldName}, allowed values are: ${allowedValues.join(', ')}`, 400, 'INVALID_ENUM'));
    }
    next();
  };
};
