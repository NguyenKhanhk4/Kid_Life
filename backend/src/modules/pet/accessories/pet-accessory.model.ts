import { Schema, model, type Document, type Types } from 'mongoose';

export const ACCESSORY_CATEGORIES = ['hat', 'glasses', 'crown', 'cape'] as const;
export type AccessoryCategory = (typeof ACCESSORY_CATEGORIES)[number];

/** Danh mục phụ kiện (admin quản lý). */
export interface IPetAccessory extends Document {
  name: string;
  /** Emoji hoặc URL ảnh. TODO: thay bằng tên artboard/input Rive khi có file .riv */
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
  /** Sao chép từ phụ kiện để khoá "mỗi loại chỉ mặc 1 món" bằng index */
  category: AccessoryCategory;
  is_equipped: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChildPetAccessorySchema = new Schema<IChildPetAccessory>(
  {
    child_id: { type: Schema.Types.ObjectId, ref: 'Child', required: true },
    accessory_id: { type: Schema.Types.ObjectId, ref: 'PetAccessory', required: true },
    category: { type: String, required: true, enum: ACCESSORY_CATEGORIES },
    is_equipped: { type: Boolean, default: false },
  },
  { timestamps: true, collection: 'child_pet_accessories' },
);

// Không mua trùng
ChildPetAccessorySchema.index({ child_id: 1, accessory_id: 1 }, { unique: true });
// Mỗi bé, mỗi category tối đa 1 món đang mặc — DB tự chặn, không cần transaction/replica set
ChildPetAccessorySchema.index(
  { child_id: 1, category: 1 },
  { unique: true, partialFilterExpression: { is_equipped: true }, name: 'one_equipped_per_category' },
);

export const ChildPetAccessory = model<IChildPetAccessory>('ChildPetAccessory', ChildPetAccessorySchema);
