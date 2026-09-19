import { EVOLUTION_CONFIG } from '../config/evolution.config';
import type { Pet, PetStage } from '../types';

/**
 * Lớp logic thuần cho Pet ảo: chỉ tính toán state, không biết gì về React/CSS/animation.
 * Đây là lớp sẽ KHÔNG bị đụng tới khi nâng cấp view lên Rive.
 */

export function createPet(speciesId: string): Pet {
  return { speciesId, currentStage: 1, currentExp: 0 };
}

/**
 * Cho pet ăn: +exp theo config, nếu đủ ngưỡng thì tăng stage và reset exp về 0.
 * Có thể tăng nhiều stage liên tiếp nếu 1 lần feed dư exp qua nhiều ngưỡng.
 */
export function feed(pet: Pet): Pet {
  if (pet.currentStage >= EVOLUTION_CONFIG.maxStage) {
    return pet;
  }

  let stage = pet.currentStage;
  let exp = pet.currentExp + EVOLUTION_CONFIG.expPerFeed;

  while (stage < EVOLUTION_CONFIG.maxStage && exp >= EVOLUTION_CONFIG.expToNextStage[stage]) {
    exp = 0;
    stage = (stage + 1) as PetStage;
  }

  return { ...pet, currentStage: stage, currentExp: exp };
}

/** Tap không đổi data, chỉ để phía view trigger animation. */
export function tap(pet: Pet): Pet {
  return pet;
}

export function isMaxStage(pet: Pet): boolean {
  return pet.currentStage >= EVOLUTION_CONFIG.maxStage;
}

export function getExpToNextStage(pet: Pet): number {
  return EVOLUTION_CONFIG.expToNextStage[pet.currentStage];
}
