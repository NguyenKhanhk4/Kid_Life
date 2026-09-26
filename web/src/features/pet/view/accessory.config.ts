import type { PetStage, WornAccessories } from '../types';
import anchorsData from './accessory.anchors.json';
import tuningData from './accessory.tuning.json';
import {
  anchorsOf,
  eyesOf,
  itemKeyOf,
  placeAccessory,
  speciesTuningOf,
  type AccessoryCategory,
  type AccessoryPlacement,
  type AccessoryTuningFile,
  type PetAnchors,
} from './accessoryLayout';
import { getStageEyes } from './eyes.config';

/**
 * Vị trí gắn phụ kiện trên pet. Công thức ở accessoryLayout.ts (dùng chung với script kiểm tra),
 * số đo từng ảnh ở accessory.anchors.json (npm run pets:anchors),
 * chỉnh tay theo loài / theo ảnh phụ kiện ở accessory.tuning.json.
 * Kiểm tra bằng ảnh: npm run pets:preview-accessories -- <thư mục ra>
 */
const ANCHORS = anchorsData as unknown as Record<string, Record<string, PetAnchors>>;
const TUNING = tuningData as unknown as AccessoryTuningFile;

/** Thứ tự vẽ phía trước pet (dưới → trên); cánh vẽ sau lưng pet */
export const FRONT_DRAW_ORDER: AccessoryCategory[] = ['necklace', 'mask', 'glasses', 'bow', 'crown', 'hat', 'halo'];
export const BEHIND_DRAW_ORDER: AccessoryCategory[] = ['wings'];

export function getAccessoryPlacement(
  speciesId: string,
  stage: PetStage,
  category: AccessoryCategory,
  icon: string,
): AccessoryPlacement {
  return placeAccessory({
    category,
    eyes: eyesOf(getStageEyes(speciesId, stage), TUNING, speciesId, stage),
    anchors: anchorsOf(ANCHORS, TUNING, speciesId, stage),
    species: speciesTuningOf(TUNING, speciesId, stage, category),
    item: TUNING.items[itemKeyOf(icon)],
  });
}

export function hasAccessories(worn: WornAccessories | undefined): boolean {
  return !!worn && Object.keys(worn).length > 0;
}
