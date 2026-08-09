import { fetchApi } from './client';

export interface Plan {
  id: string;
  name: string;
  amount: number;
  currency: string;
  durationMonths: number;
}

export interface Subscription {
  _id: string;
  planId: string;
  status: 'ACTIVE' | 'CANCELED' | 'EXPIRED' | 'PENDING';
  startDate: string | null;
  endDate: string | null;
}

export interface Transaction {
  _id: string;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  createdAt: string;
}

export const getPlans = () => fetchApi<Plan[]>('/api/v1/plans');

export const subscribe = (planId: string, idempotencyKey: string) =>
  fetchApi<{
    subscription: Subscription;
    transaction: Transaction;
    checkoutUrl: string;
  }>('/api/v1/subscriptions', {
    method: 'POST',
    body: JSON.stringify({ planId, idempotencyKey }),
  });

export const getMySubscriptions = () =>
  fetchApi<Subscription[]>('/api/v1/subscriptions/me');

export const cancelSubscription = () =>
  fetchApi<Subscription>('/api/v1/subscriptions/me/cancel', {
    method: 'PATCH',
  });

export const getTransactions = () =>
  fetchApi<Transaction[]>('/api/v1/transactions');
