export type PetStage = 1 | 2 | 3 | 4 | 5;

export interface PetSpeciesConfig {
  id: string;
  name: string;
  /** Thư mục chứa ảnh của loài này, mỗi stage 1 file: `${imageBaseUrl}/stage{1..5}.{imageExt}` */
  imageBaseUrl: string;
  /** Đuôi file ảnh, mặc định là 'png'. */
  imageExt?: string;
}

export interface EvolutionConfig {
  /** EXP cộng thêm mỗi lần feed() */
  expPerFeed: number;
  /** Số lần cho ăn tối đa mỗi ngày — chặn "cày" để pet lớn từ từ, bé không nhanh chán */
  maxFeedsPerDay: number;
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
  /** EXP trong stage hiện tại (về 0 khi lên stage) */
  currentExp: number;
  /** Số lần đã cho ăn trong ngày `lastFedDate` */
  feedsToday: number;
  /** Ngày cho ăn gần nhất, dạng YYYY-MM-DD theo giờ máy (null = chưa cho ăn lần nào) */
  lastFedDate: string | null;
}
