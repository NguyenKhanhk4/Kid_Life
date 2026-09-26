import { EVOLUTION_CONFIG } from '../config/evolution.config';
import type { Pet, PetStage } from '../types';

/**
 * Lớp logic thuần cho Pet ảo: chỉ tính toán state, không biết gì về React/CSS/animation.
 * Đây là lớp sẽ KHÔNG bị đụng tới khi nâng cấp view lên Rive.
 * ⚠️ Backend (backend/src/modules/pet/pet.logic.ts) dùng cùng quy tắc.
 */

/** Ngày theo giờ máy, dạng YYYY-MM-DD */
export function dayKey(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function createPet(speciesId: string): Pet {
  return { speciesId, currentStage: 1, currentExp: 0, feedsToday: 0, lastFedDate: null };
}

/** Số lần còn được cho ăn hôm nay (sang ngày mới thì tự đầy lại). */
export function feedsLeftToday(pet: Pet, now: Date = new Date()): number {
  const used = pet.lastFedDate === dayKey(now) ? pet.feedsToday : 0;
  return Math.max(0, EVOLUTION_CONFIG.maxFeedsPerDay - used);
}

export function canFeed(pet: Pet, now: Date = new Date()): boolean {
  return feedsLeftToday(pet, now) > 0;
}

/**
 * Cho pet ăn: tính 1 lượt trong ngày, +exp theo config; đủ ngưỡng thì lên stage và exp về 0.
 * Hết lượt trong ngày → trả nguyên pet. Đã max stage → vẫn tính lượt nhưng không cộng exp.
 */
export function feed(pet: Pet, now: Date = new Date()): Pet {
  if (!canFeed(pet, now)) return pet;

  const today = dayKey(now);
  const feedsToday = (pet.lastFedDate === today ? pet.feedsToday : 0) + 1;
  const base = { ...pet, feedsToday, lastFedDate: today };
  if (pet.currentStage >= EVOLUTION_CONFIG.maxStage) return base;

  let stage = pet.currentStage;
  let exp = pet.currentExp + EVOLUTION_CONFIG.expPerFeed;
  while (stage < EVOLUTION_CONFIG.maxStage && exp >= EVOLUTION_CONFIG.expToNextStage[stage]) {
    exp = 0;
    stage = (stage + 1) as PetStage;
  }
  return { ...base, currentStage: stage, currentExp: exp };
}

/** Tap không đổi data, chỉ để phía view trigger animation. */
export function tap(pet: Pet): Pet {
  return pet;
}

/** Đặt thẳng stage (reset exp về 0) — dùng cho debug/admin, không dùng trong luồng chơi. */
export function setStage(pet: Pet, stage: PetStage): Pet {
  const clamped = Math.min(Math.max(stage, 1), EVOLUTION_CONFIG.maxStage) as PetStage;
  return { ...pet, currentStage: clamped, currentExp: 0 };
}

/** Debug: trả lại đủ lượt cho ăn hôm nay. */
export function resetFeedsToday(pet: Pet): Pet {
  return { ...pet, feedsToday: 0 };
}

export function isMaxStage(pet: Pet): boolean {
  return pet.currentStage >= EVOLUTION_CONFIG.maxStage;
}

export function getExpToNextStage(pet: Pet): number {
  return EVOLUTION_CONFIG.expToNextStage[pet.currentStage];
}
