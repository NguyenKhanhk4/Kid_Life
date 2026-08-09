export interface MongoServerError extends Error {
  name: string;
  code?: number;
  message: string;
}

export function isMongoServerError(error: unknown): error is MongoServerError {
  return typeof error === 'object' && error !== null && 'name' in error;
}
