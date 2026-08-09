import { fetchApi } from './client';

export interface Certificate {
  _id: string;
  childId: string;
  title: string;
  description: string;
  imageUrl: string;
  issuedAt: string;
}

export const getCertificates = (childId: string) =>
  fetchApi<Certificate[]>(`/api/v1/children/${childId}/certificates`);
