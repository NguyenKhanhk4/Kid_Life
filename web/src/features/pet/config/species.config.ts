import type { PetSpeciesConfig, PetStage } from '../types';

/**
 * Danh sách loài pet có thể nuôi. Thêm loài mới = thêm 1 object vào đây
 * và bỏ ảnh vào public/assets/pets/{id}/stage1.png .. stage5.png.
 * Hành vi/animation riêng của loài khai báo trong view/behavior.config.ts (cũng chỉ là data).
 * KHÔNG được thêm logic riêng cho từng species ở bất kỳ đâu trong code.
 */
export const PET_SPECIES: PetSpeciesConfig[] = [
  {
    id: 'dragon',
    name: 'Rồng Con',
    imageBaseUrl: '/assets/pets/dragon',
    imageExt: 'png',
  },
  {
    id: 'cat',
    name: 'Mèo Con',
    imageBaseUrl: '/assets/pets/cat',
    imageExt: 'png',
  },
  {
    id: 'bunny',
    name: 'Thỏ Con',
    imageBaseUrl: '/assets/pets/bunny',
    imageExt: 'png',
  },
  {
    id: 'bear',
    name: 'Gấu Con',
    imageBaseUrl: '/assets/pets/bear',
    imageExt: 'png',
  },
  {
    id: 'dog',
    name: 'Chó Con',
    imageBaseUrl: '/assets/pets/dog',
    imageExt: 'png',
  },
  {
    id: 'fox',
    name: 'Cáo Con',
    imageBaseUrl: '/assets/pets/fox',
    imageExt: 'png',
  },
  {
    id: 'monkey',
    name: 'Khỉ Con',
    imageBaseUrl: '/assets/pets/monkey',
    imageExt: 'png',
  },
  {
    id: 'owl',
    name: 'Cú Con',
    imageBaseUrl: '/assets/pets/owl',
    imageExt: 'png',
  },
  {
    id: 'panda',
    name: 'Gấu Trúc Con',
    imageBaseUrl: '/assets/pets/panda',
    imageExt: 'png',
  },
  {
    id: 'pig',
    name: 'Lợn Con',
    imageBaseUrl: '/assets/pets/pig',
    imageExt: 'png',
  },
  {
    id: 'unicron',
    name: 'Kỳ Lân Con',
    imageBaseUrl: '/assets/pets/unicron',
    imageExt: 'png',
  },
];

export function getSpeciesConfig(speciesId: string): PetSpeciesConfig | undefined {
  return PET_SPECIES.find((s) => s.id === speciesId);
}

export function getStageImageUrl(species: PetSpeciesConfig, stage: PetStage): string {
  return `${species.imageBaseUrl}/stage${stage}.${species.imageExt ?? 'png'}`;
}
