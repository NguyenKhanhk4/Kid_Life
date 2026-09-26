import type { NextFunction, Request, RequestHandler, Response } from 'express';
import mongoose from 'mongoose';

/**
 * Lỗi nghiệp vụ trả về client. Mọi lỗi API có dạng:
 *   { "error": { "code": "PET_NOT_FOUND", "message": "..." } }
 * `code` ổn định để frontend xử lý, `message` là tiếng Việt để hiển thị/debug.
 */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

/** Bọc handler async để lỗi được chuyển tới errorHandler thay vì làm treo request. */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: `Không có API ${req.method} ${req.path}` } });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: { code: err.code, message: err.message } });
    return;
  }
  if (err instanceof mongoose.Error.VersionError) {
    // 2 request cùng sửa 1 pet (vd. bấm cho ăn 2 lần cực nhanh) → client thử lại
    res.status(409).json({ error: { code: 'CONFLICT', message: 'Dữ liệu vừa thay đổi, hãy thử lại' } });
    return;
  }
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: err.message } });
    return;
  }
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: { code: 'INVALID_JSON', message: 'Body không phải JSON hợp lệ' } });
    return;
  }
  console.error(err);
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Lỗi máy chủ' } });
}
