import { fetchApi } from './client';

export interface ChildProfile {
  _id: string;
  parentId: string;
  name: string;
  dateOfBirth: string;
  avatarUrl?: string;
  loginUsername: string;
  preferredSkills: string[];
  level: number;
  totalPoints: number;
  restrictions?: {
    maxScreenTime?: number;
    allowedHours?: { start: string; end: string };
  };
  createdAt: string;
}

export interface CreateChildData {
  name: string;
  dateOfBirth: string;
  avatarUrl?: string;
  loginUsername: string;
  loginPassword: string;
  preferredSkills?: string[];
}

export interface CreateChildResponse {
  child: ChildProfile;
  walletId: string;
  petId: string;
}

export const createChild = (data: CreateChildData) =>
  fetchApi<CreateChildResponse>('/api/v1/children', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const getChildren = () =>
  fetchApi<{ children: ChildProfile[] }>('/api/v1/children');

export const getChild = (childId: string) =>
  fetchApi<ChildProfile>(`/api/v1/children/${childId}`);

export const updateChild = (childId: string, data: Partial<Omit<ChildProfile, '_id' | 'parentId' | 'createdAt' | 'loginUsername'>>) =>
  fetchApi<ChildProfile>(`/api/v1/children/${childId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteChild = (childId: string) =>
  fetchApi<{ message: string }>(`/api/v1/children/${childId}`, {
    method: 'DELETE',
  });
