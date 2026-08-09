import { Response } from 'express';

export const sendResponse = <T>(res: Response, statusCode: number, data: T) => {
  return res.status(statusCode).json({
    data,
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
};
