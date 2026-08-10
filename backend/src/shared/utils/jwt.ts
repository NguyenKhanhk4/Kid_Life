import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../../config/env';

export interface TokenPayload {
  userId: string;
  role: string;
}

export const signAccessToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: parseDuration(env.accessTokenExpiry) / 1000, // seconds
  };
  return jwt.sign(payload, env.jwtSecret, options);
};

export const signRefreshToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: parseDuration(env.refreshTokenExpiry) / 1000, // seconds
    jwtid: crypto.randomUUID(), // Unique per token — prevents same-second collision
  };
  return jwt.sign(payload, env.jwtSecret, options);
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.jwtSecret) as TokenPayload;
};

export const getRefreshTokenExpiry = (): Date => {
  const ms = parseDuration(env.refreshTokenExpiry);
  return new Date(Date.now() + ms);
};

function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000; // default 7d
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return 7 * 24 * 60 * 60 * 1000;
  }
}
