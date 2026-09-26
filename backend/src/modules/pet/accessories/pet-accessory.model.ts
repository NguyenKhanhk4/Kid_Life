import { Schema, model, type Document, type Types } from 'mongoose';

/** Khớp thư mục ảnh web/public/assets/pets/accessories/<category>/ */
export const ACCESSORY_CATEGORIES = ['hat', 'crown', 'halo', 'bow', 'glasses', 'mask', 'necklace', 'wings'] as const;
export type AccessoryCategory = (typeof ACCESSORY_CATEGORIES)[number];

/**
 * Vị trí đeo trên pet: mỗi vị trí chỉ đeo 1 món (mũ / vương miện / halo / nơ cùng nằm trên đầu,
 * kính và mặt nạ cùng che mắt) để đồ không chồng lên nhau.
 */
export const ACCESSORY_SLOT: Record<AccessoryCategory, 'head' | 'face' | 'neck' | 'back'> = {
  hat: 'head',
  crown: 'head',
  halo: 'head',
  bow: 'head',
  glasses: 'face',
  mask: 'face',
  necklace: 'neck',
  wings: 'back',
};
export type AccessorySlot = (typeof ACCESSORY_SLOT)[AccessoryCategory];

/** Danh mục phụ kiện (admin quản lý). */
export interface IPetAccessory extends Document {
  name: string;
  /** Đường dẫn ảnh, vd. /assets/pets/accessories/hat/hat-01.png (web/public). TODO: tên artboard Rive khi có file .riv */
  icon: string;
  cost_xp: number;
  category: AccessoryCategory;
  /** Admin "xoá" = ẩn khỏi cửa hàng; bé đã mua vẫn giữ được */
  is_active: boolean;
  sort_order: number;
  createdAt: Date;
  updatedAt: Date;
}

const PetAccessorySchema = new Schema<IPetAccessory>(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    icon: { type: String, required: true, trim: true, maxlength: 300 },
    cost_xp: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, enum: ACCESSORY_CATEGORIES },
    is_active: { type: Boolean, default: true },
    sort_order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'pet_accessories' },
);

export const PetAccessory = model<IPetAccessory>('PetAccessory', PetAccessorySchema);

/** Phụ kiện bé đã sở hữu. */
export interface IChildPetAccessory extends Document {
  child_id: Types.ObjectId;
  accessory_id: Types.ObjectId;
  /** Sao chép từ phụ kiện */
  category: AccessoryCategory;
  /** Sao chép từ ACCESSORY_SLOT[category] để khoá "mỗi vị trí chỉ đeo 1 món" bằng index */
  slot: AccessorySlot;
  is_equipped: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChildPetAccessorySchema = new Schema<IChildPetAccessory>(
  {
    child_id: { type: Schema.Types.ObjectId, ref: 'Child', required: true },
    accessory_id: { type: Schema.Types.ObjectId, ref: 'PetAccessory', required: true },
    category: { type: String, required: true, enum: ACCESSORY_CATEGORIES },
    slot: { type: String, required: true, enum: ['head', 'face', 'neck', 'back'] },
    is_equipped: { type: Boolean, default: false },
  },
  { timestamps: true, collection: 'child_pet_accessories' },
);

// Không mua trùng
ChildPetAccessorySchema.index({ child_id: 1, accessory_id: 1 }, { unique: true });
// Mỗi bé, mỗi vị trí tối đa 1 món đang đeo — DB tự chặn, không cần transaction/replica set
ChildPetAccessorySchema.index(
  { child_id: 1, slot: 1 },
  { unique: true, partialFilterExpression: { is_equipped: true }, name: 'one_equipped_per_slot' },
);

export const ChildPetAccessory = model<IChildPetAccessory>('ChildPetAccessory', ChildPetAccessorySchema);
