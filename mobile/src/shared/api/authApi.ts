import { fetchApi } from './client';
import * as SecureStore from 'expo-secure-store';

// ─── Types ───
export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: 'PARENT' | 'CHILD' | 'EXPERT' | 'ADMIN';
  avatarUrl?: string;
  isEmailVerified: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface RegisterResponse {
  userId: string;
  message: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// ─── Token Storage ───
const ACCESS_TOKEN_KEY = 'user_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const storeTokens = async (accessToken: string, refreshToken: string) => {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
};

export const getAccessToken = async () => SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
export const getRefreshToken = async () => SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

export const clearTokens = async () => {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
};

// ─── API Calls ───
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const result = await fetchApi<LoginResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  await storeTokens(result.accessToken, result.refreshToken);
  return result;
};

export const register = async (data: {
  email: string;
  password: string;
  fullName: string;
  role: 'PARENT' | 'EXPERT';
}): Promise<RegisterResponse> => {
  return fetchApi<RegisterResponse>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const refreshTokens = async (): Promise<TokenPair> => {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token available');

  const result = await fetchApi<TokenPair>('/api/v1/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
  await storeTokens(result.accessToken, result.refreshToken);
  return result;
};

export const logout = async (): Promise<void> => {
  const refreshToken = await getRefreshToken();
  if (refreshToken) {
    try {
      await fetchApi('/api/v1/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // Ignore logout API errors — always clear local tokens
    }
  }
  await clearTokens();
};

export const forgotPassword = async (email: string) => {
  return fetchApi<{ message: string }>('/api/v1/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export const resetPassword = async (token: string, newPassword: string) => {
  return fetchApi<{ message: string }>('/api/v1/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
};

export const changePassword = async (oldPassword: string, newPassword: string) => {
  return fetchApi<{ message: string }>('/api/v1/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify({ oldPassword, newPassword }),
  });
};

export const verifyEmail = async (token: string) => {
  return fetchApi<{ message: string }>('/api/v1/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
};
