import type { Pet } from '../types';

/**
 * Lưu trữ tạm bằng localStorage cho MVP (chưa nối backend thật).
 * Đổi sang gọi API thật sau này chỉ cần sửa file này + hook usePet,
 * không đụng tới logic/view.
 */
const STORAGE_KEY = 'kidlife.pet.v1';

export function loadPet(): Pet | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as Partial<Pet>;
    // dữ liệu lưu từ bản cũ chưa có đếm lượt cho ăn
    return { feedsToday: 0, lastFedDate: null, ...saved } as Pet;
  } catch {
    return null;
  }
}

export function savePet(pet: Pet): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pet));
}

export function clearPet(): void {
  localStorage.removeItem(STORAGE_KEY);
}
