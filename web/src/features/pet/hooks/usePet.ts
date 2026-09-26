import { useCallback, useState } from 'react';
import * as petLogic from '../logic/petLogic';
import { clearPet, loadPet, savePet } from '../storage/petStorage';
import type { Pet, PetStage } from '../types';

/**
 * Cầu nối giữa lớp logic thuần và lớp hiển thị: giữ state Pet của user,
 * gọi petLogic cho mỗi hành động rồi persist. View không import petLogic trực tiếp.
 */
export function usePet() {
  const [pet, setPet] = useState<Pet | null>(() => loadPet());

  const selectSpecies = useCallback((speciesId: string) => {
    const newPet = petLogic.createPet(speciesId);
    savePet(newPet);
    setPet(newPet);
  }, []);

  const feedPet = useCallback(() => {
    setPet((current) => {
      if (!current || !petLogic.canFeed(current)) return current;
      const updated = petLogic.feed(current);
      savePet(updated);
      return updated;
    });
  }, []);

  /** Debug: trả lại đủ lượt cho ăn hôm nay. */
  const debugResetFeeds = useCallback(() => {
    setPet((current) => {
      if (!current) return current;
      const updated = petLogic.resetFeedsToday(current);
      savePet(updated);
      return updated;
    });
  }, []);

  const tapPet = useCallback(() => {
    setPet((current) => (current ? petLogic.tap(current) : current));
  }, []);

  /** Xoá pet hiện tại, quay về màn chọn loài. */
  const resetPet = useCallback(() => {
    clearPet();
    setPet(null);
  }, []);

  /** Chỉ dùng cho debug: nhảy thẳng tới 1 stage. */
  const debugSetStage = useCallback((stage: PetStage) => {
    setPet((current) => {
      if (!current) return current;
      const updated = petLogic.setStage(current, stage);
      savePet(updated);
      return updated;
    });
  }, []);

  return { pet, selectSpecies, feedPet, tapPet, resetPet, debugSetStage, debugResetFeeds };
}
