import { useCallback, useState } from 'react';
import * as petLogic from '../logic/petLogic';
import { loadPet, savePet } from '../storage/petStorage';
import type { Pet } from '../types';

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
      if (!current) return current;
      const updated = petLogic.feed(current);
      savePet(updated);
      return updated;
    });
  }, []);

  const tapPet = useCallback(() => {
    setPet((current) => (current ? petLogic.tap(current) : current));
  }, []);

  return { pet, selectSpecies, feedPet, tapPet };
}
