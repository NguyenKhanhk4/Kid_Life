import crypto from 'crypto';
import { User, IUser } from './user.model';
import { hashPassword, comparePassword } from '../../shared/utils/password';
import { signAccessToken, signRefreshToken, verifyToken, getRefreshTokenExpiry } from '../../shared/utils/jwt';
import { AppError } from '../../shared/errors/AppError';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REFRESH_TOKENS = 5;

export class AuthService {
  /**
   * Register a new user (Parent or Expert)
   */
  static async register(data: { email: string; password: string; fullName: string; role: string }) {
    const existing = await User.findOne({ email: data.email.toLowerCase() });
    if (existing) {
      throw new AppError('Email already registered', 409, 'EMAIL_EXISTS');
    }

    const passwordHash = await hashPassword(data.password);
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      email: data.email.toLowerCase(),
      passwordHash,
      fullName: data.fullName.trim(),
      role: data.role,
      status: data.role === 'EXPERT' ? 'PENDING' : 'ACTIVE',
      emailVerificationToken,
    });

    return {
      userId: user._id,
      message: 'Registration successful. Please verify your email.',
    };
  }

  /**
   * Authenticate user and return token pair
   */
  static async login(email: string, password: string) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      const minutesLeft = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
      throw new AppError(`Account locked. Try again in ${minutesLeft} minutes.`, 423, 'ACCOUNT_LOCKED');
    }

    // Check account status
    if (user.status === 'LOCKED') {
      throw new AppError('Account has been locked by admin', 403, 'ACCOUNT_LOCKED');
    }
    if (user.status === 'PENDING') {
      throw new AppError('Account is pending approval', 403, 'ACCOUNT_PENDING');
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      // Increment login attempts
      user.loginAttempts += 1;
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
        user.loginAttempts = 0;
      }
      await user.save();
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // Reset login attempts on success
    user.loginAttempts = 0;
    user.lockUntil = undefined;

    // Generate token pair
    const tokenPair = this.generateTokenPair(user);

    // Store refresh token (keep max N tokens)
    user.refreshTokens.push({
      token: tokenPair.refreshToken,
      expiresAt: getRefreshTokenExpiry(),
      createdAt: new Date(),
    });

    // Prune old refresh tokens
    if (user.refreshTokens.length > MAX_REFRESH_TOKENS) {
      user.refreshTokens = user.refreshTokens.slice(-MAX_REFRESH_TOKENS);
    }
    // Remove expired
    user.refreshTokens = user.refreshTokens.filter(rt => rt.expiresAt > new Date());

    await user.save();

    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatarUrl: user.avatarUrl,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }

  /**
   * Refresh the access token using a valid refresh token
   */
  static async refresh(refreshToken: string) {
    let payload;
    try {
      payload = verifyToken(refreshToken);
    } catch {
      throw new AppError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      throw new AppError('User not found', 401, 'USER_NOT_FOUND');
    }

    // Check that this refresh token exists in the user's stored tokens
    const tokenIndex = user.refreshTokens.findIndex(rt => rt.token === refreshToken);
    if (tokenIndex === -1) {
      // Token not found — possible token reuse attack. Revoke all.
      user.refreshTokens = [];
      await user.save();
      throw new AppError('Refresh token revoked. Please login again.', 401, 'TOKEN_REVOKED');
    }

    // Rotate: remove old, issue new pair
    user.refreshTokens.splice(tokenIndex, 1);

    const newPair = this.generateTokenPair(user);
    user.refreshTokens.push({
      token: newPair.refreshToken,
      expiresAt: getRefreshTokenExpiry(),
      createdAt: new Date(),
    });

    await user.save();

    return {
      accessToken: newPair.accessToken,
      refreshToken: newPair.refreshToken,
    };
  }

  /**
   * Logout — revoke a specific refresh token
   */
  static async logout(refreshToken: string) {
    let payload;
    try {
      payload = verifyToken(refreshToken);
    } catch {
      // Token already expired — just return success
      return { message: 'Logged out successfully' };
    }

    const user = await User.findById(payload.userId);
    if (user) {
      user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
      await user.save();
    }

    return { message: 'Logged out successfully' };
  }

  /**
   * Change password (authenticated user)
   */
  static async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    const isMatch = await comparePassword(oldPassword, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Current password is incorrect', 401, 'INVALID_PASSWORD');
    }

    user.passwordHash = await hashPassword(newPassword);
    // Revoke all refresh tokens on password change
    user.refreshTokens = [];
    await user.save();

    return { message: 'Password changed successfully. Please login again.' };
  }

  /**
   * Forgot password — generate reset token
   */
  static async forgotPassword(email: string) {
    const user = await User.findOne({ email: email.toLowerCase() });
    // Always return success to prevent email enumeration
    if (!user) {
      return { message: 'If an account exists, a reset link has been sent.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // TODO: Send reset email (Phase 2 — email service)
    // For now, in development mode, include token in response
    return {
      message: 'If an account exists, a reset link has been sent.',
      ...(process.env.NODE_ENV === 'development' ? { _devResetToken: resetToken } : {}),
    };
  }

  /**
   * Reset password with token
   */
  static async resetPassword(token: string, newPassword: string) {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400, 'INVALID_RESET_TOKEN');
    }

    user.passwordHash = await hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.refreshTokens = [];
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    return { message: 'Password reset successful. Please login with your new password.' };
  }

  /**
   * Verify email with token
   */
  static async verifyEmail(token: string) {
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      throw new AppError('Invalid verification token', 400, 'INVALID_VERIFICATION_TOKEN');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    return { message: 'Email verified successfully' };
  }

  // --- Private helpers ---

  private static generateTokenPair(user: IUser) {
    const payload = { userId: user._id.toString(), role: user.role };
    return {
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload),
    };
  }
}
