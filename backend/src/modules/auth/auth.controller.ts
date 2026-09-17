// Auth Controller — nhận request, gọi service, trả response chuẩn
import { Request, Response } from 'express';
import { registerService, loginService, refreshTokenService, changePasswordService } from './auth.service';
import { successResponse, errorResponse } from '../../utils/responseHelper';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const result = await registerService(req.body);
    res.status(201).json(successResponse(result, 'Đăng ký thành công', 201));
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: {
        code: err.code || 'REGISTER_ERROR',
        message: err.message || 'Đăng ký thất bại',
      },
    });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const result = await loginService(req.body);
    res.status(200).json(successResponse(result, 'Đăng nhập thành công'));
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: {
        code: err.code || 'LOGIN_ERROR',
        message: err.message || 'Đăng nhập thất bại',
      },
    });
  }
}

export async function refreshToken(req: Request, res: Response): Promise<void> {
  try {
    const { refreshToken: token } = req.body;
    const result = await refreshTokenService(token);
    res.status(200).json(successResponse(result, 'Cấp token mới thành công'));
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: {
        code: err.code || 'REFRESH_TOKEN_ERROR',
        message: err.message || 'Refresh token thất bại',
      },
    });
  }
}

export async function changePassword(req: Request, res: Response): Promise<void> {
  try {
    const result = await changePasswordService(req.user!.id, req.body);
    res.status(200).json(successResponse(result, 'Đổi mật khẩu thành công'));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: {
        code: err.code || 'CHANGE_PASSWORD_ERROR',
        message: err.message || 'Lỗi hệ thống khi đổi mật khẩu',
      },
    });
  }
}
