import type { FeedResult, Pet, PetConfig } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/** Lỗi từ backend, giữ `code` (PET_FULL, NOT_ENOUGH_XP...) để UI xử lý. */
export class PetApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

export async function petRequest<T>(token: string, method: string, path: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/pet${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new PetApiError(0, 'NETWORK_ERROR', 'Không kết nối được máy chủ');
  }
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new PetApiError(res.status, json?.error?.code ?? 'UNKNOWN', json?.error?.message ?? 'Có lỗi xảy ra');
  }
  return json as T;
}

const q = (childId: string) => `?childId=${encodeURIComponent(childId)}`;

export const petApi = {
  getConfig: (token: string) => petRequest<{ config: PetConfig }>(token, 'GET', '/config').then((r) => r.config),

  getPet: (token: string, childId: string) =>
    petRequest<{ pet: Pet | null; xpBalance: number }>(token, 'GET', q(childId)),

  createPet: (token: string, childId: string, speciesId: string) =>
    petRequest<{ pet: Pet }>(token, 'POST', '', { childId, speciesId }).then((r) => r.pet),

  feed: (token: string, childId: string) =>
    petRequest<{ pet: Pet; result: FeedResult }>(token, 'POST', '/feed', { childId }),
};
