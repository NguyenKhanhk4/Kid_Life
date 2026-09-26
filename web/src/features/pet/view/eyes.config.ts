import type { PetStage } from '../types';
import eyesData from './eyes.data.json';

/**
 * Vị trí mắt trên từng ảnh stage{n}.png — dùng để làm hiệu ứng chớp mắt ngay trên ảnh PNG phẳng.
 * Toạ độ theo % khung ảnh (0–100): tâm x, y + rộng w, cao h.
 * Mí mắt = mảng lông ngay trên mắt (hoặc ngay dưới nếu lidFrom = 1, vd. trên mắt có vương miện)
 * của chính ảnh đó, trượt xuống che mắt.
 *
 * Ảnh không khai báo mắt (mảng rỗng) thì không chớp — vd. mắt đang híp/nháy sẵn trong ảnh.
 */
export interface EyeRig {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Lấy lông làm mí từ đâu: -1 = ngay trên mắt (mặc định), 1 = ngay dưới mắt */
  lidFrom?: number;
}

const PET_EYES = eyesData as Record<string, Partial<Record<string, EyeRig[]>>>;

export function getStageEyes(speciesId: string, stage: PetStage): EyeRig[] {
  return PET_EYES[speciesId]?.[String(stage)] ?? [];
}
