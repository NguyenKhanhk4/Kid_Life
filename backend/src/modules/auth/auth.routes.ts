// Auth Routes — mount tại /api/auth
import { Router } from 'express';
import { register, login, refreshToken, changePassword, googleLogin } from './auth.controller';
import validateRequest from '../../middleware/validateRequest';
import { registerSchema, loginSchema, refreshTokenSchema, changePasswordSchema } from './auth.validation';
import authMiddleware from '../../middleware/authMiddleware';

const router = Router();

// POST /api/auth/register — không cần auth
router.post('/register', validateRequest(registerSchema), register);

// POST /api/auth/login — không cần auth
router.post('/login', validateRequest(loginSchema), login);

// POST /api/auth/google - Login bằng Google
router.post('/google', googleLogin);

// POST /api/auth/refresh-token — không cần auth (dùng refreshToken để cấp lại)
router.post('/refresh-token', validateRequest(refreshTokenSchema), refreshToken);

// PUT /api/auth/change-password — Cần auth
router.put('/change-password', authMiddleware, validateRequest(changePasswordSchema), changePassword);

export default router;
