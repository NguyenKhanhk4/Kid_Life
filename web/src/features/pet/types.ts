export type PetStage = 1 | 2 | 3 | 4 | 5;

export interface PetSpeciesConfig {
  id: string;
  name: string;
  /** Thư mục chứa ảnh của loài này, mỗi stage 1 file: `${imageBaseUrl}/stage{1..5}.{imageExt}` */
  imageBaseUrl: string;
  /** Đuôi file ảnh, mặc định là 'png'. */
  imageExt?: string;
}

export type PetMood = 'sad' | 'neutral' | 'happy' | 'excited';

/** Pet của bé — đúng dữ liệu backend trả về (GET/POST /api/pet), server đã tính sẵn mọi thứ. */
export interface Pet {
  childId: string;
  speciesId: string;
  stage: PetStage;
  maxStage: number;
  /** EXP trong stage hiện tại (về 0 khi lên stage) */
  exp: number;
  /** EXP cần để lên stage kế; null nếu đã tối đa */
  expToNextStage: number | null;
  totalExp: number;
  feedsLeftToday: number;
  maxFeedsPerDay: number;
  /** XP của bé bị trừ mỗi lần cho ăn */
  feedXpCost: number;
  /** Chuỗi ngày cho ăn liên tục còn hiệu lực */
  streakDays: number;
  mood: PetMood;
  lastFedAt: string | null;
}

/** GET /api/pet/config */
export interface PetConfig {
  maxStage: number;
  expPerFeed: number;
  maxFeedsPerDay: number;
  feedXpCost: number;
  expToNextStage: number[];
  streakBonus: { everyDays: number; childXp: number; petExp: number };
  speciesIds: string[];
}

/** POST /api/pet/feed → result */
export interface FeedResult {
  gainedExp: number;
  evolved: boolean;
  fromStage: number;
  toStage: number;
  streakBonus: boolean;
  xpSpent: number;
  xpBalance: number;
}

export type AccessoryCategory = 'hat' | 'glasses' | 'crown' | 'cape';

/** 1 món trong tủ đồ (GET /api/pet/accessories) — server đã gộp trạng thái của bé. */
export interface Accessory {
  id: string;
  name: string;
  /** Emoji hoặc URL ảnh */
  icon: string;
  category: AccessoryCategory;
  costXp: number;
  isOwned: boolean;
  isEquipped: boolean;
}

export interface Wardrobe {
  accessories: Accessory[];
  xpBalance: number;
}

/** Phụ kiện đang hiện trên pet (đã mặc hoặc đang mặc thử) */
export type WornAccessories = Partial<Record<AccessoryCategory, Accessory>>;
