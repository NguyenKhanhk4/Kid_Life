import { Pet, IPet } from '../models/pet.model';
import { Types } from 'mongoose';

// Giả định interface IXpService
export interface IXpService {
  deductChildXp(childId: string, amount: number): Promise<boolean>;
  addChildXp(childId: string, amount: number): Promise<void>;
}

// Mock service - trong thực tế sẽ import từ module chứa logic XP của bé
export const MockXpService: IXpService = {
  deductChildXp: async (childId: string, amount: number) => {
    // Giả định bé luôn đủ XP cho việc demo
    // Trong thực tế, query XP hiện tại và so sánh: if (xp < amount) return false;
    return true; 
  },
  addChildXp: async (childId: string, amount: number) => {
    console.log(`[Mock] Added ${amount} bonus XP to child ${childId}`);
  }
};

const STAGE_THRESHOLDS = {
  STAGE_1_MAX: 79,   // 0-79: Stage 1 (Level 1-4)
  STAGE_2_MAX: 279,  // 80-279: Stage 2 (Level 5-14)
  STAGE_3_MAX: 579,  // 280-579: Stage 3 (Level 15-29)
  // >= 580: Stage 4 (Level 30+)
};

export const calculateEvolution = (pet: IPet): void => {
  // Update level: 1 level every 20 XP
  pet.level = 1 + Math.floor(pet.current_xp / 20);

  // Update stage based on XP thresholds
  if (pet.current_xp <= STAGE_THRESHOLDS.STAGE_1_MAX) {
    pet.stage = 1;
  } else if (pet.current_xp <= STAGE_THRESHOLDS.STAGE_2_MAX) {
    pet.stage = 2;
  } else if (pet.current_xp <= STAGE_THRESHOLDS.STAGE_3_MAX) {
    pet.stage = 3;
  } else {
    pet.stage = 4;
  }

  // Set mood to excited right after feeding
  pet.mood = 'excited';
};

export const updateStreak = async (pet: IPet, childId: string, xpService: IXpService): Promise<void> => {
  const now = new Date();
  const lastActiveDate = new Date(pet.last_active_date || now);
  
  // Chuẩn hoá ngày về 0h00 để so sánh số ngày chênh lệch (đơn giản hoá với UTC)
  const normalizeDate = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  
  const nowNormalized = normalizeDate(now);
  const lastActiveNormalized = normalizeDate(lastActiveDate);

  const diffTime = nowNormalized.getTime() - lastActiveNormalized.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Chuỗi ngày liên tiếp
    pet.streak_days += 1;
  } else if (diffDays > 1) {
    // Gãy streak
    pet.streak_days = 1; // Bắt đầu lại từ 1 vì hôm nay có tương tác
  } else {
    // Trong cùng một ngày (diffDays === 0)
    // Nếu pet mới tạo chưa có streak thì gán bằng 1
    if (pet.streak_days === 0) pet.streak_days = 1; 
  }

  pet.last_active_date = now;

  // Thưởng mốc 14 ngày
  if (pet.streak_days > 0 && pet.streak_days % 14 === 0 && diffDays === 1) {
    await xpService.addChildXp(childId, 50); // Thưởng cho bé 50 XP
    pet.current_xp += 20; // Thưởng Pet 20 XP
  }
};

export const petService = {
  async getPetByChildId(childId: string): Promise<IPet> {
    let pet = await Pet.findOne({ child_id: new Types.ObjectId(childId) });
    
    if (!pet) {
      pet = new Pet({
        child_id: new Types.ObjectId(childId),
      });
      await pet.save();
    }
    
    return pet;
  },

  async feedPet(childId: string): Promise<IPet> {
    const pet = await this.getPetByChildId(childId);
    
    // Trừ 10 XP của bé
    const hasEnoughXp = await MockXpService.deductChildXp(childId, 10);
    if (!hasEnoughXp) {
      const error = new Error('Không đủ XP để cho ăn');
      (error as any).status = 400;
      throw error;
    }

    // Cộng XP cho Pet
    pet.current_xp += 10;
    pet.last_fed_time = new Date();

    // Cập nhật streak & tiến hoá
    await updateStreak(pet, childId, MockXpService);
    calculateEvolution(pet);

    await pet.save();
    return pet;
  }
};
