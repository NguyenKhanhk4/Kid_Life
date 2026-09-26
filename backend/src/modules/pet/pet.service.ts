import { HttpError } from '../../shared/http';
import Child from '../children/children.model';
import { PET_CONFIG, PET_SPECIES_IDS, isPetSpeciesId } from './pet.config';
import {
  activeStreak,
  applyFeed,
  computeMood,
  createPetState,
  expToNextStage,
  feedsLeftToday,
  type PetMood,
  type PetState,
} from './pet.logic';
import { PetModel } from './pet.model';
import type { ChildXpService } from './pet.xp';

/** Dữ liệu pet trả về cho web (đã tính sẵn mọi thứ web cần hiển thị). */
export interface PetDTO {
  childId: string;
  speciesId: string;
  stage: number;
  maxStage: number;
  /** EXP trong stage hiện tại */
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

export interface FeedResponse {
  pet: PetDTO;
  result: {
    gainedExp: number;
    evolved: boolean;
    fromStage: number;
    toStage: number;
    streakBonus: boolean;
    xpSpent: number;
    /** Số XP bé còn lại sau khi cho ăn */
    xpBalance: number;
  };
}

type PetDoc = InstanceType<typeof PetModel>;

function toState(doc: PetDoc): PetState {
  return {
    childId: doc.childId,
    speciesId: doc.speciesId,
    stage: doc.stage,
    exp: doc.exp,
    totalExp: doc.totalExp,
    feedsToday: doc.feedsToday,
    lastFedAt: doc.lastFedAt ?? null,
    streakDays: doc.streakDays,
  };
}

export class PetService {
  constructor(
    private readonly xp: ChildXpService,
    private readonly tzOffsetMinutes: number,
    private readonly now: () => Date = () => new Date(),
  ) {}

  /** Các con số web cần (web không tự fix cứng nữa). */
  getConfig() {
    return { ...PET_CONFIG, speciesIds: PET_SPECIES_IDS };
  }

  toDTO(state: PetState): PetDTO {
    const now = this.now();
    return {
      childId: state.childId,
      speciesId: state.speciesId,
      stage: state.stage,
      maxStage: PET_CONFIG.maxStage,
      exp: state.exp,
      expToNextStage: expToNextStage(state.stage),
      totalExp: state.totalExp,
      feedsLeftToday: feedsLeftToday(state, now, this.tzOffsetMinutes),
      maxFeedsPerDay: PET_CONFIG.maxFeedsPerDay,
      feedXpCost: PET_CONFIG.feedXpCost,
      streakDays: activeStreak(state, now, this.tzOffsetMinutes),
      mood: computeMood(state.lastFedAt, now),
      lastFedAt: state.lastFedAt ? state.lastFedAt.toISOString() : null,
    };
  }

  private async findOrThrow(childId: string): Promise<PetDoc> {
    const doc = await PetModel.findOne({ childId });
    if (!doc) throw new HttpError(404, 'PET_NOT_FOUND', 'Bé chưa chọn thú cưng');
    return doc;
  }

  async getPet(childId: string): Promise<PetDTO | null> {
    const doc = await PetModel.findOne({ childId });
    return doc ? this.toDTO(toState(doc)) : null;
  }

  getXpBalance(childId: string): Promise<number> {
    return this.xp.getBalance(childId);
  }

  async createPet(childId: string, speciesId: unknown): Promise<PetDTO> {
    if (!isPetSpeciesId(speciesId)) throw new HttpError(400, 'INVALID_SPECIES', 'Loài thú cưng không hợp lệ');
    if (await PetModel.exists({ childId })) throw new HttpError(409, 'PET_EXISTS', 'Bé đã có thú cưng rồi');
    try {
      const doc = await PetModel.create(createPetState(childId, speciesId));
      return this.toDTO(toState(doc));
    } catch (err) {
      // 2 request tạo cùng lúc → trùng unique index
      if ((err as { code?: number }).code === 11000) throw new HttpError(409, 'PET_EXISTS', 'Bé đã có thú cưng rồi');
      throw err;
    }
  }

  async feedPet(childId: string): Promise<FeedResponse> {
    const doc = await this.findOrThrow(childId);
    const outcome = applyFeed(toState(doc), this.now(), this.tzOffsetMinutes);
    if (!outcome) {
      throw new HttpError(429, 'PET_FULL', `Hôm nay bé đã cho ăn đủ ${PET_CONFIG.maxFeedsPerDay} lần rồi, mai cho ăn tiếp nhé!`);
    }

    const cost = PET_CONFIG.feedXpCost;
    const refId = String(doc._id);
    if (!(await this.xp.spend(childId, cost, 'pet_feed', refId))) {
      throw new HttpError(400, 'NOT_ENOUGH_XP', `Cần ${cost} XP để cho thú cưng ăn`);
    }

    const { state } = outcome;
    doc.set({
      stage: state.stage,
      exp: state.exp,
      totalExp: state.totalExp,
      feedsToday: state.feedsToday,
      lastFedAt: state.lastFedAt,
      streakDays: state.streakDays,
    });
    try {
      await doc.save();
    } catch (err) {
      await this.xp.add(childId, cost, 'pet_feed_refund', refId); // lưu thất bại → hoàn lại XP đã trừ
      throw err;
    }

    if (outcome.streakBonus) await this.xp.add(childId, PET_CONFIG.streakBonus.childXp, 'pet_streak_bonus', refId);
    // children.streak = chuỗi ngày chăm pet (Dev 3 cập nhật), hiển thị ở hồ sơ bé
    await Child.updateOne({ _id: childId }, { streak: state.streakDays });

    return {
      pet: this.toDTO(state),
      result: {
        gainedExp: outcome.gainedExp,
        evolved: outcome.evolved,
        fromStage: outcome.fromStage,
        toStage: outcome.toStage,
        streakBonus: outcome.streakBonus,
        xpSpent: cost,
        xpBalance: await this.xp.getBalance(childId),
      },
    };
  }

}
