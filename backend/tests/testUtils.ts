import { AppError } from '../src/shared/errors/AppError';

export function getErrorCode(error: unknown): string | undefined {
  if (error instanceof AppError) {
    return error.errorCode;
  }
  return undefined;
}
