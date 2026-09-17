// Helper functions tạo response chuẩn cho toàn bộ dự án KidLife
import { ApiResponse } from '../types/response.types';

export function successResponse<T>(
  data: T,
  message: string,
  statusCode: number = 200
): ApiResponse<T> {
  return {
    success: true,
    statusCode,
    message,
    data,
  };
}

export function errorResponse(
  message: string,
  statusCode: number = 500
): ApiResponse<null> {
  return {
    success: false,
    statusCode,
    message,
    data: null,
  };
}
