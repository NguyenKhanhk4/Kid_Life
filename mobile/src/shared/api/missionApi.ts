import { fetchApi } from './client';

export interface ChecklistItem {
  _id: string;
  text: string;
  isDone: boolean;
}

export interface Mission {
  _id: string;
  title: string;
  description: string;
  childId: string;
  skillId?: string;
  rewardPoints: number;
  dueDate: string;
  checklist: ChecklistItem[];
}

export interface Submission {
  _id: string;
  missionId: string;
  childId: string;
  evidenceUrls: string[];
  status: 'pending_review' | 'approved' | 'rejected';
  createdAt: string;
}

export interface CreateMissionInput {
  title: string;
  description: string;
  childId: string;
  rewardPoints: number;
  dueDate: string;
  checklist?: { text: string }[];
}

export interface UpdateMissionInput {
  title?: string;
  description?: string;
  rewardPoints?: number;
  dueDate?: string;
}

export const getMissions = (childId: string) =>
  fetchApi<Mission[]>(`/api/v1/missions?childId=${childId}`);

export const getMission = (id: string) => fetchApi<Mission>(`/api/v1/missions/${id}`);

export const createMission = (data: CreateMissionInput) =>
  fetchApi<Mission>('/api/v1/missions', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateMission = (id: string, data: UpdateMissionInput) =>
  fetchApi<Mission>(`/api/v1/missions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteMission = (id: string) =>
  fetchApi<void>(`/api/v1/missions/${id}`, {
    method: 'DELETE',
  });

export const updateChecklist = (missionId: string, itemId: string, isDone: boolean) =>
  fetchApi<ChecklistItem[]>(`/api/v1/missions/${missionId}/checklist/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify({ isDone }),
  });

export const getSubmissions = (childId: string, status?: string) => {
  const query = new URLSearchParams({ childId });
  if (status) query.append('status', status);
  return fetchApi<Submission[]>(`/api/v1/submissions?${query.toString()}`);
};

export const getSubmission = (id: string) => fetchApi<Submission>(`/api/v1/submissions/${id}`);

export const submitMission = (missionId: string, evidenceUrls: string[]) =>
  fetchApi<Submission>(`/api/v1/missions/${missionId}/submissions`, {
    method: 'POST',
    body: JSON.stringify({ evidenceUrls }),
  });

export const reviewSubmission = (id: string, decision: 'approved' | 'rejected', reason?: string) =>
  fetchApi<Submission>(`/api/v1/submissions/${id}/review`, {
    method: 'PATCH',
    body: JSON.stringify({ decision, reason }),
  });
