import type { PetStage } from '../types';

/**
 * Chỉ còn dữ liệu HIỂN THỊ của phía web. Mọi con số game (EXP mỗi lần ăn, ngưỡng lên stage,
 * số lượt/ngày, giá XP...) nằm ở backend/src/modules/pet/pet.config.ts và được trả qua API.
 */

/** Hệ số phóng to Avatar theo từng stage, view dùng để tính CSS scale */
export const STAGE_SCALE: Record<PetStage, number> = {
  1: 0.8,
  2: 0.95,
  3: 1.1,
  4: 1.25,
  5: 1.4,
};
