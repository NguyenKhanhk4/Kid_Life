/**
 * Mọi con số của pet ở phía backend (nguồn chính khi web đã nối API).
 * ⚠️ Giữ y hệt web/src/features/pet/config/evolution.config.ts + species.config.ts.
 *
 * Nhịp lớn (cho ăn đủ MAX_FEEDS_PER_DAY lần mỗi ngày → +60 EXP/ngày):
 *   stage 1 → 2:   60 EXP ≈ 1 ngày     (lớn nhanh ngay ngày đầu cho bé hào hứng)
 *   stage 2 → 3:  420 EXP ≈ 1 tuần
 *   stage 3 → 4: 1080 EXP ≈ 2,5 tuần
 *   stage 4 → 5: 2400 EXP ≈ 6 tuần     → tổng ~2 tháng mới đạt stage cuối
 */
export const PET_SPECIES_IDS = [
  'dragon', 'cat', 'bunny', 'bear', 'dog', 'fox', 'monkey', 'owl', 'panda', 'pig', 'unicron',
] as const;

export type PetSpeciesId = (typeof PET_SPECIES_IDS)[number];

export const PET_CONFIG = {
  maxStage: 5,
  /** EXP pet nhận mỗi lần cho ăn */
  expPerFeed: 20,
  /** Số lần cho ăn tối đa mỗi ngày — chặn "cày" để pet lớn từ từ */
  maxFeedsPerDay: 3,
  /** XP của bé bị trừ mỗi lần cho ăn */
  feedXpCost: 10,
  /** expToNextStage[i] = EXP cần để đi từ stage (i+1) lên stage (i+2) */
  expToNextStage: [60, 420, 1080, 2400] as readonly number[],
  /** Thưởng khi giữ chuỗi cho ăn liên tục đủ mỗi N ngày */
  streakBonus: { everyDays: 14, childXp: 50, petExp: 20 },
  /** Tâm trạng theo thời gian kể từ lần cho ăn gần nhất (phút) */
  mood: { excitedWithinMin: 10, happyWithinMin: 12 * 60, neutralWithinMin: 36 * 60 },
} as const;

export function isPetSpeciesId(value: unknown): value is PetSpeciesId {
  return typeof value === 'string' && (PET_SPECIES_IDS as readonly string[]).includes(value);
}
