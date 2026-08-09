import { fetchApi } from './client';

export interface WalletTransaction {
  _id: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  sourceType: string;
  createdAt: string;
}

export interface Wallet {
  childId: string;
  availableBalance: number;
  savingsBalance: number;
}

export const getWallet = (childId: string) =>
  fetchApi<Wallet>(`/api/v1/children/${childId}/wallet`);

export const getWalletHistory = (
  childId: string,
  limit = 20,
  cursor?: string,
) => {
  const query = cursor
    ? `?limit=${limit}&cursor=${encodeURIComponent(cursor)}`
    : `?limit=${limit}`;
  return fetchApi<WalletTransaction[]>(
    `/api/v1/children/${childId}/wallet/transactions${query}`,
  );
};
