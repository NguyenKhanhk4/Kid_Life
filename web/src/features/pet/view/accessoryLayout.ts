/**
 * Tính vị trí gắn phụ kiện lên ảnh pet — hàm THUẦN (chỉ `import type`), dùng chung cho:
 *   - web (AccessoryLayer.tsx)
 *   - script render ảnh kiểm tra: scripts/pets/preview-accessories.mjs (Node chạy thẳng file .ts)
 * nên ảnh kiểm tra khớp 100% với những gì bé thấy trên web.
 *
 * Mọi số theo % khung ảnh pet. Đầu vào:
 *   - eyes     : vị trí 2 mắt (eyes.data.json) → tâm mặt, khoảng cách mắt S, góc nghiêng đầu
 *   - anchors  : số đo từ ảnh (accessory.anchors.json) → đỉnh đầu, bề rộng mặt, khung thân
 *   - tuning   : chỉnh tay theo loài/stage + theo từng ảnh phụ kiện (accessory.tuning.json)
 */
import type { EyeRig } from './eyes.config';

export const ACCESSORY_CATEGORIES = ['hat', 'crown', 'halo', 'bow', 'glasses', 'mask', 'necklace', 'wings'] as const;
export type AccessoryCategory = (typeof ACCESSORY_CATEGORIES)[number];

/** Vị trí đeo — mỗi vị trí 1 món (khớp ACCESSORY_SLOT ở backend pet-accessory.model.ts) */
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

export interface PetAnchors {
  /** [x0, y0, x1, y1] khung bao con vật */
  bbox: [number, number, number, number];
  headTop?: number;
  faceLeft?: number;
  faceRight?: number;
}

/** Chỉnh tay cho 1 loài/stage + category: dx/dy theo % ảnh pet, scale nhân cỡ, rotate cộng thêm (độ) */
export interface SpeciesTuning {
  dx?: number;
  dy?: number;
  scale?: number;
  rotate?: number;
}

/** Chỉnh tay cho 1 ảnh phụ kiện: dxRel/dyRel theo bề rộng phụ kiện (vd. mặt nạ trùm cả mặt → dời xuống) */
export interface ItemTuning {
  dxRel?: number;
  dyRel?: number;
  scale?: number;
  rotate?: number;
}

export interface AccessoryTuningFile {
  /** species → stage ("1".."5" hoặc "*" = mọi stage) → category → chỉnh */
  species: Record<string, Record<string, Partial<Record<AccessoryCategory, SpeciesTuning>>>>;
  /** "hat/hat-01.png" → chỉnh riêng ảnh đó */
  items: Record<string, ItemTuning>;
  /** Ảnh pet không vẽ mắt (quả trứng, mắt híp): khai báo mắt "ảo" để có chỗ gắn */
  eyes: Record<string, Record<string, EyeRig[]>>;
  /** Sửa số đo tự động sai (vd. đỉnh đầu bị tính lên tới đỉnh sừng/đuôi) */
  anchors?: Record<string, Record<string, Partial<PetAnchors>>>;
}

/** Số đo tự động + phần sửa tay */
export function anchorsOf(
  measured: Record<string, Record<string, PetAnchors>>,
  file: AccessoryTuningFile,
  speciesId: string,
  stage: number,
): PetAnchors | undefined {
  const base = measured[speciesId]?.[String(stage)];
  const fix = file.anchors?.[speciesId]?.[String(stage)];
  return base ? { ...base, ...fix } : undefined;
}

/** Mắt thật (eyes.data.json); ảnh không vẽ mắt thì dùng mắt ảo trong file chỉnh tay */
export function eyesOf(real: EyeRig[] | undefined, file: AccessoryTuningFile, speciesId: string, stage: number): EyeRig[] {
  return real && real.length >= 2 ? real : (file.eyes[speciesId]?.[String(stage)] ?? []);
}

export interface AccessoryPlacement {
  /** điểm neo trên ảnh pet (%) */
  x: number;
  y: number;
  /** bề rộng phụ kiện (% bề rộng ảnh pet); chiều cao theo tỉ lệ ảnh phụ kiện */
  width: number;
  /** góc xoay (độ) quanh điểm neo */
  rotate: number;
  /** điểm nào của ảnh phụ kiện đặt vào điểm neo: 0 = mép trên, 0.5 = giữa, 1 = mép dưới */
  originY: number;
  /** vẽ sau lưng pet (cánh) */
  behind: boolean;
}

/**
 * Cách đặt từng loại, tính theo "khung đầu": u dọc đường nối 2 mắt, v vuông góc (xuống là dương).
 *   F = đỉnh đầu → tầm mắt, S = khoảng cách 2 mắt, W = bề rộng mặt,
 *   D = tầm mắt → chân (cổ/vai tính theo tỉ lệ D nên đúng cả với bé chibi đầu to lẫn con trưởng thành)
 */
function basePlacement(category: AccessoryCategory, g: { F: number; S: number; W: number; D: number; bodyW: number }) {
  const { F, S, W, D, bodyW } = g;
  switch (category) {
    case 'hat': // vành mũ nằm hơi dưới đỉnh đầu
      return { u: 0, v: -0.6 * F, width: 1.0 * W, originY: 0.86, tilt: 0 };
    case 'crown':
      return { u: 0, v: -0.68 * F, width: 0.68 * W, originY: 0.9, tilt: 0 };
    case 'halo': // lơ lửng trên đỉnh đầu
      return { u: 0, v: -F - 0.1 * W, width: 0.7 * W, originY: 0.55, tilt: 0 };
    case 'bow': // cài lệch sang 1 bên đầu
      return { u: 0.28 * W, v: -0.72 * F, width: 0.4 * W, originY: 0.62, tilt: 16 };
    case 'glasses':
      return { u: 0, v: 0.04 * S, width: 2.0 * S, originY: 0.5, tilt: 0 };
    case 'mask':
      return { u: 0, v: 0.08 * S, width: 2.1 * S, originY: 0.5, tilt: 0 };
    case 'necklace': // mép trên vòng ở dưới cằm
      return { u: 0, v: 0.24 * D, width: Math.min(1.7 * S, 0.5 * bodyW), originY: 0.1, tilt: 0 };
    case 'wings': // sau lưng, ngang vai
      return { u: 0, v: 0.4 * D, width: clamp(0.9 * bodyW, 3 * S, 75), originY: 0.5, tilt: 0 };
  }
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function placeAccessory(input: {
  category: AccessoryCategory;
  eyes: EyeRig[];
  anchors: PetAnchors | undefined;
  species?: SpeciesTuning;
  item?: ItemTuning;
}): AccessoryPlacement {
  const { category, anchors, species = {}, item = {} } = input;
  const bbox = anchors?.bbox ?? [15, 10, 85, 90];
  const bodyW = bbox[2] - bbox[0];

  // mắt: dữ liệu thật; không có thì đoán ở 1/3 trên của con vật
  let eyes = input.eyes;
  if (eyes.length < 2) {
    const cx = (bbox[0] + bbox[2]) / 2, ey = bbox[1] + (bbox[3] - bbox[1]) * 0.32;
    eyes = [{ x: cx - 7, y: ey, w: 8, h: 8 }, { x: cx + 7, y: ey, w: 8, h: 8 }];
  }
  const [l, r] = [...eyes].sort((a, b) => a.x - b.x);
  const cx = (l.x + r.x) / 2, cy = (l.y + r.y) / 2;
  const S = Math.max(Math.hypot(r.x - l.x, r.y - l.y), 8);
  const angle = (Math.atan2(r.y - l.y, r.x - l.x) * 180) / Math.PI;
  const headTop = anchors?.headTop ?? cy - 1.3 * S;
  const F = Math.max(cy - headTop, 0.7 * S);
  const faceRaw = anchors?.faceLeft !== undefined && anchors?.faceRight !== undefined ? anchors.faceRight - anchors.faceLeft : 2.4 * S;
  const W = clamp(faceRaw, 1.9 * S, 2.6 * S);
  const D = Math.max(bbox[3] - cy, 2 * S);

  const base = basePlacement(category, { F, S, W, D, bodyW });
  const rad = (angle * Math.PI) / 180;
  const width = base.width * (species.scale ?? 1) * (item.scale ?? 1);
  // dời theo ảnh phụ kiện (tính theo bề rộng của chính nó), cũng trong khung đầu
  const u = base.u + (item.dxRel ?? 0) * width;
  const v = base.v + (item.dyRel ?? 0) * width;
  const behind = category === 'wings';
  const rotate = (behind ? 0 : angle) + base.tilt + (species.rotate ?? 0) + (item.rotate ?? 0);
  // cánh gắn vào thân chứ không theo đầu: lấy giữa đầu và giữa khung thân (tư thế bò / quay nghiêng)
  const shiftX = behind ? ((bbox[0] + bbox[2]) / 2 - cx) * 0.5 : 0;

  return {
    x: cx + Math.cos(rad) * u - Math.sin(rad) * v + shiftX + (species.dx ?? 0),
    y: cy + Math.sin(rad) * u + Math.cos(rad) * v + (species.dy ?? 0),
    width,
    rotate,
    originY: base.originY,
    behind,
  };
}

/** Lấy chỉnh tay theo loài: "*" (mọi stage) rồi đè bằng stage cụ thể */
export function speciesTuningOf(file: AccessoryTuningFile, speciesId: string, stage: number, category: AccessoryCategory): SpeciesTuning {
  const s = file.species[speciesId];
  return { ...(s?.['*']?.[category] ?? {}), ...(s?.[String(stage)]?.[category] ?? {}) };
}

/** "/assets/pets/accessories/hat/hat-01.png" → "hat/hat-01.png" */
export function itemKeyOf(icon: string): string {
  const m = icon.match(/accessories\/(.+)$/);
  return m ? m[1] : icon;
}
