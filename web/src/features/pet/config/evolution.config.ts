import type { EvolutionConfig } from '../types';

/**
 * Nguồn duy nhất cho mọi con số liên quan tới EXP/tiến hoá.
 * Đổi độ khó tiến hoá thì sửa ở đây, không sửa rải rác trong logic/view.
 */
export const EVOLUTION_CONFIG: EvolutionConfig = {
  expPerFeed: 20,
  maxStage: 4,
  expToNextStage: {
    1: 60,
    2: 100,
    3: 140,
    4: Infinity, // stage 4 là tối đa, không cần ngưỡng để lên tiếp
  },
  stageScale: {
    1: 0.8,
    2: 1,
    3: 1.2,
    4: 1.45,
  },
};
