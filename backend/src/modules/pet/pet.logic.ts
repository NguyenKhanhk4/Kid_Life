import { PET_CONFIG } from './pet.config';

/**
 * Logic thuần của pet — không đụng DB/HTTP, test độc lập được (pet.logic.test.ts).
 * Cùng quy tắc với web/src/features/pet/logic/petLogic.ts.
 */

export type PetMood = 'sad' | 'neutral' | 'happy' | 'excited';

export interface PetState {
  childId: string;
  speciesId: string;
  /** 1..PET_CONFIG.maxStage */
  stage: number;
  /** EXP trong stage hiện tại (về 0 khi lên stage) */
  exp: number;
  /** Tổng EXP đã nhận từ trước tới nay (thống kê) */
  totalExp: number;
  /** Số lần đã cho ăn trong ngày của lastFedAt */
  feedsToday: number;
  lastFedAt: Date | null;
  /** Số ngày liên tiếp có cho ăn (tính tới ngày lastFedAt) */
  streakDays: number;
}

export interface FeedResult {
  state: PetState;
  gainedExp: number;
  fromStage: number;
  toStage: number;
  evolved: boolean;
  /** Vừa chạm mốc streak → thưởng thêm */
  streakBonus: boolean;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Số thứ tự ngày theo múi giờ (dùng để so "cùng ngày", "hôm qua"). */
export function dayIndex(date: Date, tzOffsetMinutes: number): number {
  return Math.floor((date.getTime() + tzOffsetMinutes * 60_000) / DAY_MS);
}

export function createPetState(childId: string, speciesId: string): PetState {
  return { childId, speciesId, stage: 1, exp: 0, totalExp: 0, feedsToday: 0, lastFedAt: null, streakDays: 0 };
}

export function isMaxStage(state: Pick<PetState, 'stage'>): boolean {
  return state.stage >= PET_CONFIG.maxStage;
}

/** EXP cần để lên stage kế tiếp; null nếu đã tối đa. */
export function expToNextStage(stage: number): number | null {
  return stage >= PET_CONFIG.maxStage ? null : PET_CONFIG.expToNextStage[stage - 1];
}

export function feedsLeftToday(state: PetState, now: Date, tz: number): number {
  const sameDay = state.lastFedAt !== null && dayIndex(state.lastFedAt, tz) === dayIndex(now, tz);
  return Math.max(0, PET_CONFIG.maxFeedsPerDay - (sameDay ? state.feedsToday : 0));
}

/** Streak còn hiệu lực: nếu hôm qua và hôm nay đều không cho ăn thì chuỗi đã đứt → 0. */
export function activeStreak(state: PetState, now: Date, tz: number): number {
  if (!state.lastFedAt) return 0;
  return dayIndex(now, tz) - dayIndex(state.lastFedAt, tz) <= 1 ? state.streakDays : 0;
}

export function computeMood(lastFedAt: Date | null, now: Date): PetMood {
  if (!lastFedAt) return 'neutral';
  const minutes = (now.getTime() - lastFedAt.getTime()) / 60_000;
  if (minutes <= PET_CONFIG.mood.excitedWithinMin) return 'excited';
  if (minutes <= PET_CONFIG.mood.happyWithinMin) return 'happy';
  if (minutes <= PET_CONFIG.mood.neutralWithinMin) return 'neutral';
  return 'sad';
}

/** Cộng EXP, lên stage khi đủ ngưỡng (exp về 0 mỗi lần lên — giống web). */
function addExp(state: PetState, amount: number): { stage: number; exp: number } {
  let stage = state.stage;
  let exp = state.exp;
  if (stage >= PET_CONFIG.maxStage) return { stage, exp };
  exp += amount;
  let need = expToNextStage(stage);
  while (need !== null && exp >= need) {
    exp = 0;
    stage += 1;
    need = expToNextStage(stage);
  }
  return { stage, exp };
}

/**
 * Cho ăn 1 lần. Trả về null nếu đã hết lượt trong ngày (caller trả lỗi PET_FULL).
 * Đã max stage vẫn cho ăn được (bé vẫn muốn chăm pet) nhưng không cộng EXP.
 */
export function applyFeed(state: PetState, now: Date, tz: number): FeedResult | null {
  if (feedsLeftToday(state, now, tz) <= 0) return null;

  const today = dayIndex(now, tz);
  const lastDay = state.lastFedAt ? dayIndex(state.lastFedAt, tz) : null;

  const feedsToday = lastDay === today ? state.feedsToday + 1 : 1;
  const streakDays = lastDay === today ? state.streakDays : lastDay === today - 1 ? state.streakDays + 1 : 1;
  // thưởng khi streak vừa tăng lên đúng mốc (chỉ lần cho ăn đầu tiên của ngày đó)
  const streakBonus =
    lastDay !== today && streakDays > 0 && streakDays % PET_CONFIG.streakBonus.everyDays === 0;

  const gained = isMaxStage(state) ? 0 : PET_CONFIG.expPerFeed + (streakBonus ? PET_CONFIG.streakBonus.petExp : 0);
  const { stage, exp } = addExp(state, gained);

  const next: PetState = {
    ...state,
    stage,
    exp,
    totalExp: state.totalExp + gained,
    feedsToday,
    lastFedAt: now,
    streakDays,
  };
  return { state: next, gainedExp: gained, fromStage: state.stage, toStage: stage, evolved: stage > state.stage, streakBonus };
}
