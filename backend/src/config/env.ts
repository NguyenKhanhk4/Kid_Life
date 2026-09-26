import 'dotenv/config';

/** Cấu hình đọc từ biến môi trường (file .env ở thư mục backend/). */
export const env = {
  port: Number(process.env.PORT ?? 3000),
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/kidlife',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  /** Origin của web được phép gọi API (Vite dev server) */
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  /** Múi giờ để tính "một ngày" (giới hạn cho ăn, streak). Mặc định Việt Nam UTC+7 = 420 phút. */
  tzOffsetMinutes: Number(process.env.TZ_OFFSET_MINUTES ?? 420),
};

export const isProduction = env.nodeEnv === 'production';
