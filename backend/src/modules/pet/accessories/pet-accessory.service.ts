import mongoose from 'mongoose';
import { HttpError } from '../../../shared/http';
import type { ChildXpService } from '../pet.xp';
import { ACCESSORY_SLOT, ChildPetAccessory, PetAccessory, type AccessoryCategory, type IPetAccessory } from './pet-accessory.model';

/** Phụ kiện trả về cho bé (đã gộp trạng thái sở hữu/đang mặc). */
export interface AccessoryDTO {
  id: string;
  name: string;
  icon: string;
  category: AccessoryCategory;
  costXp: number;
  isOwned: boolean;
  isEquipped: boolean;
}

export interface WardrobeDTO {
  accessories: AccessoryDTO[];
  xpBalance: number;
}

/** Dữ liệu admin (giữ tên field như trang AdminMasterData đang dùng). */
export interface AdminAccessoryDTO {
  _id: string;
  name: string;
  icon: string;
  category: AccessoryCategory;
  priceXP: number;
  sortOrder: number;
  createdAt: Date;
}

export interface AccessoryInput {
  name: string;
  icon: string;
  category: AccessoryCategory;
  priceXP: number;
  sortOrder?: number;
}

const isDuplicateKey = (err: unknown) => (err as { code?: number }).code === 11000;

function toObjectId(id: string, code: string): mongoose.Types.ObjectId {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, code, 'Mã phụ kiện không hợp lệ');
  return new mongoose.Types.ObjectId(id);
}

function toAdminDTO(doc: IPetAccessory): AdminAccessoryDTO {
  return {
    _id: String(doc._id),
    name: doc.name,
    icon: doc.icon,
    category: doc.category,
    priceXP: doc.cost_xp,
    sortOrder: doc.sort_order,
    createdAt: doc.createdAt,
  };
}

export class PetAccessoryService {
  constructor(private readonly xp: ChildXpService) {}

  /** Toàn bộ phụ kiện đang bán + phụ kiện bé đã mua (kể cả món admin đã ngừng bán). */
  async getWardrobe(childId: string): Promise<WardrobeDTO> {
    const owned = await ChildPetAccessory.find({ child_id: childId }).lean();
    const ownedById = new Map(owned.map((o) => [String(o.accessory_id), o]));

    const items = await PetAccessory.find({
      $or: [{ is_active: true }, { _id: { $in: owned.map((o) => o.accessory_id) } }],
    })
      .sort({ category: 1, sort_order: 1, cost_xp: 1 })
      .lean();

    const accessories = items.map((a): AccessoryDTO => {
      const mine = ownedById.get(String(a._id));
      return {
        id: String(a._id),
        name: a.name,
        icon: a.icon,
        category: a.category,
        costXp: a.cost_xp,
        isOwned: !!mine,
        isEquipped: !!mine?.is_equipped,
      };
    });
    return { accessories, xpBalance: await this.xp.getBalance(childId) };
  }

  async buy(childId: string, accessoryId: string): Promise<WardrobeDTO> {
    const accId = toObjectId(accessoryId, 'INVALID_ACCESSORY');
    const accessory = await PetAccessory.findOne({ _id: accId, is_active: true }).lean();
    if (!accessory) throw new HttpError(404, 'ACCESSORY_NOT_FOUND', 'Không tìm thấy phụ kiện');

    if (await ChildPetAccessory.exists({ child_id: childId, accessory_id: accId })) {
      throw new HttpError(409, 'ALREADY_OWNED', 'Bé đã có phụ kiện này rồi');
    }
    if (!(await this.xp.spend(childId, accessory.cost_xp, 'pet_accessory_buy', accessoryId))) {
      throw new HttpError(400, 'NOT_ENOUGH_XP', `Cần ${accessory.cost_xp} XP để mua ${accessory.name}`);
    }

    try {
      await ChildPetAccessory.create({
        child_id: childId,
        accessory_id: accId,
        category: accessory.category,
        slot: ACCESSORY_SLOT[accessory.category],
      });
    } catch (err) {
      // 2 request mua cùng lúc hoặc lưu lỗi → hoàn lại XP đã trừ
      await this.xp.add(childId, accessory.cost_xp, 'pet_accessory_refund', accessoryId);
      if (isDuplicateKey(err)) throw new HttpError(409, 'ALREADY_OWNED', 'Bé đã có phụ kiện này rồi');
      throw err;
    }
    return this.getWardrobe(childId);
  }

  /**
   * Mặc 1 món: tháo mọi món khác CÙNG vị trí đeo (vd. mũ ↔ vương miện) rồi mới mặc món mới.
   * Index `one_equipped_per_slot` đảm bảo bất biến kể cả khi 2 request chạy song song
   * (không cần transaction nên chạy được cả trên MongoDB standalone).
   */
  async equip(childId: string, accessoryId: string): Promise<WardrobeDTO> {
    const accId = toObjectId(accessoryId, 'INVALID_ACCESSORY');
    const mine = await ChildPetAccessory.findOne({ child_id: childId, accessory_id: accId });
    if (!mine) throw new HttpError(403, 'NOT_OWNED', 'Bé cần mua phụ kiện này trước khi mặc');

    if (!mine.is_equipped) {
      await ChildPetAccessory.updateMany(
        { child_id: childId, slot: mine.slot, is_equipped: true, _id: { $ne: mine._id } },
        { is_equipped: false },
      );
      try {
        await ChildPetAccessory.updateOne({ _id: mine._id }, { is_equipped: true });
      } catch (err) {
        if (isDuplicateKey(err)) throw new HttpError(409, 'CONFLICT', 'Dữ liệu vừa thay đổi, hãy thử lại');
        throw err;
      }
    }
    return this.getWardrobe(childId);
  }

  async unequip(childId: string, accessoryId: string): Promise<WardrobeDTO> {
    const accId = toObjectId(accessoryId, 'INVALID_ACCESSORY');
    const res = await ChildPetAccessory.updateOne({ child_id: childId, accessory_id: accId }, { is_equipped: false });
    if (res.matchedCount === 0) throw new HttpError(403, 'NOT_OWNED', 'Bé chưa có phụ kiện này');
    return this.getWardrobe(childId);
  }

  // ─── Admin (master data) ─────────────────────────────────────────────────

  async adminList(): Promise<AdminAccessoryDTO[]> {
    const docs = await PetAccessory.find({ is_active: true }).sort({ category: 1, sort_order: 1, cost_xp: 1 });
    return docs.map(toAdminDTO);
  }

  async adminCreate(input: AccessoryInput): Promise<AdminAccessoryDTO> {
    const doc = await PetAccessory.create({
      name: input.name,
      icon: input.icon,
      category: input.category,
      cost_xp: input.priceXP,
      sort_order: input.sortOrder ?? 0,
    });
    return toAdminDTO(doc);
  }

  async adminUpdate(id: string, input: AccessoryInput): Promise<AdminAccessoryDTO> {
    const doc = await PetAccessory.findOneAndUpdate(
      { _id: toObjectId(id, 'INVALID_ACCESSORY'), is_active: true },
      { name: input.name, icon: input.icon, category: input.category, cost_xp: input.priceXP, sort_order: input.sortOrder ?? 0 },
      { new: true, runValidators: true },
    );
    if (!doc) throw new HttpError(404, 'ACCESSORY_NOT_FOUND', 'Không tìm thấy phụ kiện');
    // category đổi → cập nhật bản sao ở các bé đã mua và tháo ra để không vi phạm "mỗi vị trí 1 món"
    await ChildPetAccessory.updateMany(
      { accessory_id: doc._id, category: { $ne: doc.category } },
      { category: doc.category, slot: ACCESSORY_SLOT[doc.category], is_equipped: false },
    );
    return toAdminDTO(doc);
  }

  /** Ngừng bán (ẩn khỏi cửa hàng), bé đã mua vẫn giữ và mặc được. */
  async adminDelete(id: string): Promise<void> {
    const res = await PetAccessory.updateOne({ _id: toObjectId(id, 'INVALID_ACCESSORY'), is_active: true }, { is_active: false });
    if (res.matchedCount === 0) throw new HttpError(404, 'ACCESSORY_NOT_FOUND', 'Không tìm thấy phụ kiện');
  }
}
