// Middleware factory dùng Zod schema để validate request body
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { errorResponse } from '../utils/responseHelper';

function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errorMessage = result.error.issues
        .map((issue) => issue.message)
        .join(', ');
      res.status(400).json(errorResponse(errorMessage, 400));
      return;
    }
    next();
  };
}

export default validateRequest;
