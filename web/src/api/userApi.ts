import { fetchApi } from './client';

export interface UserProfile {
  _id: string;
  email: string;
  fullName: string;
  role: 'PARENT' | 'CHILD' | 'EXPERT' | 'ADMIN';
  status: 'ACTIVE' | 'LOCKED' | 'PENDING';
  avatarUrl?: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface UsersResponse {
  users: UserProfile[];
  total: number;
}

export const getUsers = async (params?: { page?: number; limit?: number; role?: string; status?: string; search?: string }) => {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.role) query.set('role', params.role);
  if (params?.status) query.set('status', params.status);
  if (params?.search) query.set('search', params.search);
  
  return fetchApi<UsersResponse>(`/api/v1/users?${query.toString()}`);
};

export const updateUserStatus = async (userId: string, status: 'ACTIVE' | 'LOCKED') => {
  return fetchApi<UserProfile>(`/api/v1/users/${userId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

export const approveExpert = async (userId: string, action: 'APPROVE' | 'REJECT') => {
  return fetchApi<{ message: string }>(`/api/v1/users/experts/${userId}/approve`, {
    method: 'PATCH',
    body: JSON.stringify({ action }),
  });
};

export const deleteUser = async (userId: string) => {
  return fetchApi<{ message: string }>(`/api/v1/users/${userId}`, {
    method: 'DELETE',
  });
};
