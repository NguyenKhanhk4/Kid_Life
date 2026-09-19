import type { PetSpeciesConfig } from '../types';

/**
 * Danh sách loài pet có thể nuôi. Thêm loài mới = thêm 1 object vào đây
 * và bỏ ảnh vào public/assets/pets/{id}/stage-1.svg .. stage-4.svg.
 * KHÔNG được thêm logic riêng cho từng species ở bất kỳ đâu trong code.
 */
export const PET_SPECIES: PetSpeciesConfig[] = [
  {
    id: 'dragon',
    name: 'Rồng Con',
    imageBaseUrl: '/assets/pets/dragon',
  },
  {
    id: 'cat',
    name: 'Mèo Con',
    imageBaseUrl: '/assets/pets/cat',
  },
  {
    id: 'bunny',
    name: 'Thỏ Con',
    imageBaseUrl: '/assets/pets/bunny',
  },
];

export function getSpeciesConfig(speciesId: string): PetSpeciesConfig | undefined {
  return PET_SPECIES.find((s) => s.id === speciesId);
}
