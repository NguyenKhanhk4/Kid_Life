import { fetchApi } from './client';

export interface UserProfile {
  _id: string;
  email: string;
  fullName: string;
  role: 'PARENT' | 'CHILD' | 'EXPERT' | 'ADMIN';
  status: 'ACTIVE' | 'LOCKED' | 'PENDING';
  avatarUrl?: string;
  phone?: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface UserListResponse {
  users: UserProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Profile ───
export const getMe = () =>
  fetchApi<UserProfile>('/api/v1/users/me');

export const updateMe = (data: { fullName?: string; avatarUrl?: string; phone?: string }) =>
  fetchApi<UserProfile>('/api/v1/users/me', {
    method: 'PUT',
    body: JSON.stringify(data),
  });

// ─── Admin User Management ───
export const getUsers = (params?: { page?: number; limit?: number; role?: string; status?: string; search?: string }) => {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.role) query.set('role', params.role);
  if (params?.status) query.set('status', params.status);
  if (params?.search) query.set('search', params.search);
  return fetchApi<UserListResponse>(`/api/v1/users?${query.toString()}`);
};

export const updateUserStatus = (userId: string, status: 'ACTIVE' | 'LOCKED') =>
  fetchApi<UserProfile>(`/api/v1/users/${userId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

export const approveExpert = (expertId: string, approved: boolean) =>
  fetchApi<UserProfile>(`/api/v1/users/experts/${expertId}/approve`, {
    method: 'PATCH',
    body: JSON.stringify({ approved }),
  });

export const deleteUser = (userId: string) =>
  fetchApi<{ message: string }>(`/api/v1/users/${userId}`, {
    method: 'DELETE',
  });
