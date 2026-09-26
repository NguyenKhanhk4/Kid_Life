// Auth Service — xử lý business logic đăng ký, đăng nhập, refresh token
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from './user.model';
import { RegisterInput, LoginInput, ChangePasswordInput } from './auth.validation';
import { firebaseAdmin } from '../../config/firebase';
import crypto from 'crypto';

const SALT_ROUNDS = 10;
const ACCESS_TOKEN_EXPIRES = '15m';
const REFRESH_TOKEN_EXPIRES = '7d';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET chưa được cấu hình');
  return secret;
}

function getJwtRefreshSecret(): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error('JWT_REFRESH_SECRET chưa được cấu hình');
  return secret;
}

function generateAccessToken(payload: { id: string; role: string }): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: ACCESS_TOKEN_EXPIRES });
}

function generateRefreshToken(payload: { id: string; role: string }): string {
  return jwt.sign(payload, getJwtRefreshSecret(), {
    expiresIn: REFRESH_TOKEN_EXPIRES,
  });
}

function sanitizeUser(user: IUser) {
  return {
    id: user._id,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

// ─── Register ────────────────────────────────────────────────────────────────
export async function registerService(input: RegisterInput) {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    const err = new Error('Email đã được sử dụng');
    (err as any).code = 'EMAIL_ALREADY_EXISTS';
    (err as any).statusCode = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await User.create({
    email: input.email,
    passwordHash,
    fullName: input.fullName,
    phone: input.phone,
    role: 'parent',
  });

  const token = generateAccessToken({ id: String(user._id), role: user.role });
  const refreshToken = generateRefreshToken({
    id: String(user._id),
    role: user.role,
  });

  // Lưu refreshToken vào DB
  await User.findByIdAndUpdate(user._id, { refreshToken });

  return { user: sanitizeUser(user), token, refreshToken };
}

// ─── Login ───────────────────────────────────────────────────────────────────
export async function loginService(input: LoginInput) {
  // Lấy passwordHash (select: false nên phải select thủ công)
  const user = await User.findOne({ email: input.email }).select(
    '+passwordHash +refreshToken'
  );
  if (!user) {
    const err = new Error('Email hoặc mật khẩu không đúng');
    (err as any).code = 'INVALID_CREDENTIALS';
    (err as any).statusCode = 401;
    throw err;
  }

  if (user.status === 'locked') {
    const err = new Error('Tài khoản đã bị khóa');
    (err as any).code = 'ACCOUNT_LOCKED';
    (err as any).statusCode = 403;
    throw err;
  }

  const isMatch = await bcrypt.compare(input.password, user.passwordHash);
  if (!isMatch) {
    const err = new Error('Email hoặc mật khẩu không đúng');
    (err as any).code = 'INVALID_CREDENTIALS';
    (err as any).statusCode = 401;
    throw err;
  }

  const token = generateAccessToken({ id: String(user._id), role: user.role });
  const refreshToken = generateRefreshToken({
    id: String(user._id),
    role: user.role,
  });

  await User.findByIdAndUpdate(user._id, { refreshToken });

  return { user: sanitizeUser(user), token, refreshToken };
}

// ─── Google Login ─────────────────────────────────────────────────────────────
export async function loginWithGoogleService(idToken: string) {
  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const { email, name } = decodedToken;

    if (!email) {
      const err = new Error('Token không có email');
      (err as any).code = 'INVALID_GOOGLE_TOKEN';
      (err as any).statusCode = 400;
      throw err;
    }

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const passwordHash = await bcrypt.hash(randomPassword, SALT_ROUNDS);
      
      user = await User.create({
        email,
        passwordHash,
        fullName: name || 'Người dùng Google',
        role: 'parent',
      });
    } else if (user.status === 'locked') {
      const err = new Error('Tài khoản đã bị khóa');
      (err as any).code = 'ACCOUNT_LOCKED';
      (err as any).statusCode = 403;
      throw err;
    }

    const token = generateAccessToken({ id: String(user._id), role: user.role });
    const refreshToken = generateRefreshToken({ id: String(user._id), role: user.role });

    await User.findByIdAndUpdate(user._id, { refreshToken });

    return { user: sanitizeUser(user), token, refreshToken };
  } catch (error: any) {
    if (error.statusCode) throw error;
    const err = new Error('Xác thực Google thất bại');
    (err as any).code = 'GOOGLE_AUTH_FAILED';
    (err as any).statusCode = 401;
    throw err;
  }
}

// ─── Refresh Token ────────────────────────────────────────────────────────────
export async function refreshTokenService(incomingToken: string) {
  let payload: any;
  try {
    payload = jwt.verify(incomingToken, getJwtRefreshSecret());
  } catch {
    const err = new Error('refreshToken không hợp lệ hoặc đã hết hạn');
    (err as any).code = 'INVALID_REFRESH_TOKEN';
    (err as any).statusCode = 401;
    throw err;
  }

  const user = await User.findById(payload.id).select('+refreshToken');
  if (!user || user.refreshToken !== incomingToken) {
    const err = new Error('refreshToken không khớp');
    (err as any).code = 'INVALID_REFRESH_TOKEN';
    (err as any).statusCode = 401;
    throw err;
  }

  if (user.status === 'locked') {
    const err = new Error('Tài khoản đã bị khóa');
    (err as any).code = 'ACCOUNT_LOCKED';
    (err as any).statusCode = 403;
    throw err;
  }

  const newAccessToken = generateAccessToken({
    id: String(user._id),
    role: user.role,
  });

  return { token: newAccessToken };
}

// ─── ĐỔI MẬT KHẨU ─────────────────────────────────────────────────────────────
export async function changePasswordService(userId: string, input: ChangePasswordInput) {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('Tài khoản không tồn tại');
    (err as any).code = 'USER_NOT_FOUND';
    (err as any).statusCode = 404;
    throw err;
  }

  const isMatch = await bcrypt.compare(input.oldPassword, user.passwordHash);
  if (!isMatch) {
    const err = new Error('Mật khẩu cũ không chính xác');
    (err as any).code = 'INVALID_OLD_PASSWORD';
    (err as any).statusCode = 400;
    throw err;
  }

  const newHash = await bcrypt.hash(input.newPassword, SALT_ROUNDS);
  user.passwordHash = newHash;
  await user.save();

  return { success: true };
}
