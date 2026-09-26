import type { z } from 'zod';
import { HttpError } from './http';

/** Parse dữ liệu bằng zod; sai → HttpError 400 để errorHandler trả về { error: { code, message } }. */
export function parseBody<T>(schema: z.ZodType<T>, body: unknown): T {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new HttpError(400, 'VALIDATION_ERROR', result.error.issues.map((i) => i.message).join(', '));
  }
  return result.data;
}
