// Global error handler middleware cho Express
import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/responseHelper';

function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.log('❌ Unhandled Error:', err.message);
  res.status(500).json(errorResponse('Internal server error', 500));
}

export default errorHandler;
