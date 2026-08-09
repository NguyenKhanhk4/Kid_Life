import { fetchApi } from './client';

export interface Pet {
  childId: string;
  level: number;
  xp: number;
  mood: 'HAPPY' | 'NEUTRAL' | 'SAD';
  lastFedAt: string | null;
}

export const getPet = (childId: string) =>
  fetchApi<Pet>(`/api/v1/children/${childId}/pet`);

export const feedPet = (childId: string) =>
  fetchApi<{ pet: Pet; feedCost: number }>(
    `/api/v1/children/${childId}/pet/feed`,
    {
      method: 'POST',
    },
  );
