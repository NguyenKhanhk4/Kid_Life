export type PetStage = 1 | 2 | 3 | 4;

export interface PetSpeciesConfig {
  id: string;
  name: string;
  /** Thư mục chứa ảnh của loài này, mỗi stage 1 file: `${imageBaseUrl}/stage-{1..4}.svg` */
  imageBaseUrl: string;
}

export interface EvolutionConfig {
  /** EXP cộng thêm mỗi lần feed() */
  expPerFeed: number;
  /** Stage cao nhất, feed() không tăng exp/stage nữa khi đã ở stage này */
  maxStage: PetStage;
  /** EXP cần để đi từ stage này lên stage kế tiếp, ví dụ expToNextStage[1] = ngưỡng để lên stage 2 */
  expToNextStage: Record<PetStage, number>;
  /** Hệ số phóng to Avatar theo từng stage, view dùng để tính CSS scale */
  stageScale: Record<PetStage, number>;
}

export interface Pet {
  speciesId: string;
  currentStage: PetStage;
  currentExp: number;
}
