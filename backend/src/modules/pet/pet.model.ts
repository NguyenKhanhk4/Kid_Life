import mongoose, { Schema, type InferSchemaType } from 'mongoose';
import { PET_CONFIG, PET_SPECIES_IDS } from './pet.config';

/** Mỗi bé có đúng 1 pet (unique theo childId). */
const PetSchema = new Schema(
  {
    // childId là id bé do module children (Dev 1) cấp — lưu dạng chuỗi để không phụ thuộc kiểu id bên đó
    childId: { type: String, required: true, unique: true, trim: true, maxlength: 64 },
    speciesId: { type: String, required: true, enum: PET_SPECIES_IDS },
    stage: { type: Number, required: true, min: 1, max: PET_CONFIG.maxStage, default: 1 },
    exp: { type: Number, required: true, min: 0, default: 0 },
    totalExp: { type: Number, required: true, min: 0, default: 0 },
    feedsToday: { type: Number, required: true, min: 0, default: 0 },
    lastFedAt: { type: Date, default: null },
    streakDays: { type: Number, required: true, min: 0, default: 0 },
  },
  {
    timestamps: true,
    // 2 request cho ăn cùng lúc → request thứ 2 bị VersionError (409) thay vì ghi đè số liệu
    optimisticConcurrency: true,
  },
);

export type PetDocument = InferSchemaType<typeof PetSchema>;
export const PetModel = mongoose.model('Pet', PetSchema);
