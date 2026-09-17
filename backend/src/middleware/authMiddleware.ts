// authMiddleware — xác thực JWT, gắn req.user = { id, role }
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Mở rộng Express Request để thêm field user
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string };
    }
  }
}

function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Thiếu hoặc sai định dạng Authorization header',
      },
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'JWT_SECRET chưa được cấu hình' },
    });
    return;
  }

  try {
    const payload = jwt.verify(token, secret) as { id: string; role: string };
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (err: any) {
    const isExpired = err.name === 'TokenExpiredError';
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: isExpired ? 'Token đã hết hạn' : 'Token không hợp lệ',
      },
    });
  }
}

export default authMiddleware;
