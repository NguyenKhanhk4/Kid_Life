// Định nghĩa TypeScript interface chuẩn cho toàn bộ API response trong dự án KidLife
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
}
