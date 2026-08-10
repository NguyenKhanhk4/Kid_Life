import { fetchApi } from './client';

export interface Skill {
  _id: string;
  name: string;
  description: string;
  ageRange: { min: number; max: number };
  icon?: string;
  createdBy: string;
  createdAt: string;
}

export const getSkills = (search?: string) => {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return fetchApi<{ skills: Skill[] }>(`/api/v1/skills${query}`);
};

export const createSkill = (data: { name: string; description: string; ageRange: { min: number; max: number }; icon?: string }) =>
  fetchApi<Skill>('/api/v1/skills', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateSkill = (skillId: string, data: Partial<{ name: string; description: string; ageRange: { min: number; max: number }; icon: string }>) =>
  fetchApi<Skill>(`/api/v1/skills/${skillId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteSkill = (skillId: string) =>
  fetchApi<{ message: string }>(`/api/v1/skills/${skillId}`, {
    method: 'DELETE',
  });
