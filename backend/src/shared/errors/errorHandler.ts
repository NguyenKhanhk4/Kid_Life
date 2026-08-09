import { Request, Response, NextFunction } from 'express';
import { AppError } from './AppError';
import { isMongoServerError } from './MongoErrorGuard';

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: { code: err.errorCode, message: err.message }
    });
  }

  if (isMongoServerError(err)) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: err.message } });
    }
    if (err.name === 'CastError') {
      return res.status(400).json({ error: { code: 'INVALID_ID', message: 'Invalid ID format' } });
    }
    if (err.code === 11000) {
      return res.status(409).json({ error: { code: 'DUPLICATE_KEY', message: 'Resource already exists' } });
    }
  }

  console.error('Unhandled Exception:', err);

  return res.status(500).json({
    error: { code: 'INTERNAL_SERVER_ERROR', message: 'Internal Server Error' }
  });
};

