import { fetchApi } from './client';

export interface Reward {
  _id: string;
  title: string;
  description: string;
  type: 'VIRTUAL' | 'PHYSICAL';
  cost: number;
  status: 'ACTIVE' | 'ARCHIVED';
}

export interface RewardRedemption {
  _id: string;
  childId: string;
  rewardId: string;
  rewardTitleSnapshot: string;
  costSnapshot: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export const getRewards = () => fetchApi<Reward[]>('/api/v1/rewards');

export const createReward = (data: Partial<Reward>) =>
  fetchApi<Reward>('/api/v1/rewards', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateReward = (id: string, data: Partial<Reward>) =>
  fetchApi<Reward>(`/api/v1/rewards/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteReward = (id: string) =>
  fetchApi<Reward>(`/api/v1/rewards/${id}`, {
    method: 'DELETE',
  });

export const redeemReward = (rewardId: string) =>
  fetchApi<RewardRedemption>(`/api/v1/rewards/${rewardId}/redeem`, {
    method: 'POST',
  });

export const getRedemptions = (status?: string) => {
  const query = status ? `?status=${status}` : '';
  return fetchApi<RewardRedemption[]>(`/api/v1/rewards/redemptions${query}`);
};

export const approveRedemption = (redemptionId: string, approved: boolean) =>
  fetchApi<RewardRedemption>(
    `/api/v1/rewards/redemptions/${redemptionId}/approve`,
    {
      method: 'PATCH',
      body: JSON.stringify({ approved }),
    },
  );
