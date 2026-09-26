import type { EvolutionConfig } from '../types';

/**
 * Nguồn duy nhất cho mọi con số liên quan tới EXP/tiến hoá (phía web).
 * ⚠️ Backend có bản sao y hệt ở backend/src/modules/pet/pet.config.ts — đổi ở đây thì đổi cả bên đó.
 *
 * Nhịp lớn (cho ăn đủ `maxFeedsPerDay` lần mỗi ngày → +60 EXP/ngày):
 *   stage 1 → 2:   60 EXP ≈ 1 ngày     (lớn nhanh ngay ngày đầu cho bé hào hứng)
 *   stage 2 → 3:  420 EXP ≈ 1 tuần
 *   stage 3 → 4: 1080 EXP ≈ 2,5 tuần
 *   stage 4 → 5: 2400 EXP ≈ 6 tuần     → tổng ~2 tháng mới đạt stage cuối
 */
export const EVOLUTION_CONFIG: EvolutionConfig = {
  expPerFeed: 20,
  maxFeedsPerDay: 3,
  maxStage: 5,
  expToNextStage: {
    1: 60,
    2: 420,
    3: 1080,
    4: 2400,
    5: Infinity, // stage 5 là tối đa, không cần ngưỡng để lên tiếp
  },
  stageScale: {
    1: 0.8,
    2: 0.95,
    3: 1.1,
    4: 1.25,
    5: 1.4,
  },
};
