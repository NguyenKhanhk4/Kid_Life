import type { AccessoryCategory } from '../types';
import type { EyeRig } from './eyes.config';

/**
 * Vị trí đặt phụ kiện lên ảnh pet (đơn vị % khung ảnh), suy ra từ vị trí mắt của từng loài/stage
 * (eyes.data.json) nên mọi loài dùng chung 1 công thức, không có if theo speciesId.
 * TODO: khi có ảnh phụ kiện vẽ riêng hoặc file Rive (input hat/glasses/crown/cape) thì thay lớp này.
 */
export interface AccessoryAnchor {
  /** tâm phụ kiện */
  x: number;
  y: number;
  /** kích thước emoji theo % chiều rộng ảnh */
  size: number;
  /** độ nghiêng (độ) theo đường nối 2 mắt */
  rotate: number;
}

/** Ảnh không khai báo mắt → giả định mặt nằm giữa, hơi cao */
const FALLBACK_EYES: EyeRig[] = [
  { x: 42, y: 42, w: 9, h: 9 },
  { x: 58, y: 42, w: 9, h: 9 },
];

/** Hệ số theo khoảng cách 2 mắt: dy = lệch dọc so với tâm mắt, size = độ to */
const LAYOUT: Record<AccessoryCategory, { dy: number; size: number }> = {
  glasses: { dy: 0, size: 1.75 },
  hat: { dy: -1.35, size: 1.7 },
  crown: { dy: -1.2, size: 1.45 },
  cape: { dy: 1.75, size: 1.3 },
};

/** Thứ tự vẽ: khăn/nơ dưới cùng, kính, rồi mũ/vương miện trên cùng */
export const ACCESSORY_DRAW_ORDER: AccessoryCategory[] = ['cape', 'glasses', 'crown', 'hat'];

export function getAccessoryAnchor(category: AccessoryCategory, stageEyes: EyeRig[]): AccessoryAnchor {
  const eyes = stageEyes.length >= 2 ? stageEyes : FALLBACK_EYES;
  const [left, right] = [...eyes].sort((a, b) => a.x - b.x);
  const cx = (left.x + right.x) / 2;
  const cy = (left.y + right.y) / 2;
  const span = Math.max(Math.hypot(right.x - left.x, right.y - left.y), 12);
  const rotate = (Math.atan2(right.y - left.y, right.x - left.x) * 180) / Math.PI;
  const rad = (rotate * Math.PI) / 180;
  const { dy, size } = LAYOUT[category];

  // dịch vuông góc với đường nối 2 mắt để pet nghiêng đầu thì mũ/khăn nghiêng theo
  return {
    x: cx - Math.sin(rad) * dy * span,
    y: cy + Math.cos(rad) * dy * span,
    size: span * size,
    rotate,
  };
}

export const isImageIcon = (icon: string) => /^(https?:\/\/|\/)/.test(icon);
