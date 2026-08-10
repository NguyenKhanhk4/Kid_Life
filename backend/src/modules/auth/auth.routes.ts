import { Router } from 'express';
import { AuthController } from './auth.controller';
import {
  validateRegister,
  validateLogin,
  validateChangePassword,
  validateResetPassword,
  validateForgotPassword,
  validateRefreshToken,
} from './auth.validator';
import { requireAuth } from '../../shared/middleware/auth';
import { loginRateLimiter } from '../../shared/middleware/rateLimiter';

const router = Router();

// Public routes (no auth required)
router.post('/register', validateRegister, AuthController.register);
router.post('/login', loginRateLimiter, validateLogin, AuthController.login);
router.post('/refresh', validateRefreshToken, AuthController.refresh);
router.post('/logout', validateRefreshToken, AuthController.logout);
router.post('/forgot-password', validateForgotPassword, AuthController.forgotPassword);
router.post('/reset-password', validateResetPassword, AuthController.resetPassword);
router.post('/verify-email', AuthController.verifyEmail);

// Protected route (requires auth)
router.put('/change-password', requireAuth, validateChangePassword, AuthController.changePassword);

export const authRoutes = router;
