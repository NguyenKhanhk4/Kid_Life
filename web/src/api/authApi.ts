import { fetchApi } from './client';

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

export const login = async (email: string, password: string) => {
  const result = await fetchApi<LoginResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem('access_token', result.accessToken);
  localStorage.setItem('refresh_token', result.refreshToken);
  return result;
};

export const registerExpert = async (data: { email: string; password: string; fullName: string }) => {
  return fetchApi<{ userId: string; message: string }>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({ ...data, role: 'EXPERT' }),
  });
};

export const logout = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (refreshToken) {
    try {
      await fetchApi('/api/v1/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // Ignore
    }
  }
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const getMe = async () => {
  return fetchApi<AuthUser>('/api/v1/users/me');
};
