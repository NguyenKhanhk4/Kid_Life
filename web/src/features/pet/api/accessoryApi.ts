import type { Wardrobe } from '../types';
import { petRequest } from './petApi';

export const accessoryApi = {
  list: (token: string, childId: string) =>
    petRequest<Wardrobe>(token, 'GET', `/accessories?childId=${encodeURIComponent(childId)}`),

  buy: (token: string, childId: string, accessoryId: string) =>
    petRequest<Wardrobe>(token, 'POST', '/accessories/buy', { childId, accessoryId }),

  equip: (token: string, childId: string, accessoryId: string) =>
    petRequest<Wardrobe>(token, 'POST', '/accessories/equip', { childId, accessoryId }),

  unequip: (token: string, childId: string, accessoryId: string) =>
    petRequest<Wardrobe>(token, 'POST', '/accessories/unequip', { childId, accessoryId }),
};
