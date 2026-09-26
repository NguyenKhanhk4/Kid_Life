/**
 * Đo "điểm neo" để gắn phụ kiện từ chính ảnh pet (kênh alpha) + vị trí mắt (eyes.data.json):
 *   - bbox      : khung bao con vật
 *   - headTop   : đỉnh đầu tại cột giữa 2 mắt (giữa 2 tai → chỗ đội mũ)
 *   - faceLeft / faceRight : mép mặt ở ngang tầm mắt (để tính cỡ mũ / mặt nạ)
 * Ảnh không có mắt dùng "mắt ảo" trong accessory.tuning.json. Mọi số đo theo % khung ảnh. Ghi ra src/features/pet/view/accessory.anchors.json.
 *
 * Chạy lại khi thay ảnh pet (trong thư mục web/):  npm run pets:anchors
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.resolve(__dirname, '../..');
const PETS = path.join(WEB, 'public/assets/pets');
const VIEW = path.join(WEB, 'src/features/pet/view');
const eyesData = JSON.parse(fs.readFileSync(path.join(VIEW, 'eyes.data.json'), 'utf8'));
// ảnh không vẽ mắt (trứng, mắt híp) → dùng mắt ảo khai báo trong accessory.tuning.json
const virtualEyes = JSON.parse(fs.readFileSync(path.join(VIEW, 'accessory.tuning.json'), 'utf8')).eyes ?? {};
const OPAQUE = 128;
const r1 = (v) => Math.round(v * 10) / 10;

async function measure(file, eyes) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;
  const solid = (x, y) => data[(y * w + x) * 4 + 3] >= OPAQUE;

  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (solid(x, y)) {
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  const bbox = [r1((x0 / w) * 100), r1((y0 / h) * 100), r1((x1 / w) * 100), r1((y1 / h) * 100)];
  if (eyes.length < 2) return { bbox };

  const [a, b] = [...eyes].sort((p, q) => p.x - q.x);
  const cx = Math.round((((a.x + b.x) / 2) / 100) * w);
  const eyeY = Math.round((((a.y + b.y) / 2) / 100) * h);

  // đỉnh đầu: điểm đặc đầu tiên từ trên xuống, lấy trung vị trên dải cột ±2% quanh giữa 2 mắt
  const tops = [];
  for (let x = cx - Math.round(w * 0.02); x <= cx + Math.round(w * 0.02); x++) {
    for (let y = 0; y < eyeY; y++) if (solid(x, y)) { tops.push(y); break; }
  }
  tops.sort((p, q) => p - q);
  const headTop = tops.length ? tops[tops.length >> 1] : eyeY;

  // mép mặt ở ngang tầm mắt: đi từ giữa 2 mắt ra 2 bên tới khi gặp khoảng trống ≥ 1% ảnh
  const gap = Math.round(w * 0.01);
  const edge = (dir) => {
    let x = cx, lastSolid = cx, miss = 0;
    while (x > 0 && x < w - 1 && miss < gap) {
      x += dir;
      if (solid(x, eyeY)) { lastSolid = x; miss = 0; } else miss++;
    }
    return lastSolid;
  };
  return {
    bbox,
    headTop: r1((headTop / h) * 100),
    faceLeft: r1((edge(-1) / w) * 100),
    faceRight: r1((edge(1) / w) * 100),
  };
}

const out = {};
for (const species of fs.readdirSync(PETS).sort()) {
  const dir = path.join(PETS, species);
  if (species === 'accessories' || !fs.statSync(dir).isDirectory()) continue;
  for (let stage = 1; stage <= 5; stage++) {
    const file = path.join(dir, `stage${stage}.png`);
    if (!fs.existsSync(file)) continue;
    const real = eyesData[species]?.[String(stage)] ?? [];
    const eyes = real.length >= 2 ? real : (virtualEyes[species]?.[String(stage)] ?? []);
    (out[species] ??= {})[stage] = await measure(file, eyes);
  }
}
fs.writeFileSync(path.join(VIEW, 'accessory.anchors.json'), JSON.stringify(out, null, 1) + '\n');
console.log(`Đã đo ${Object.values(out).reduce((s, v) => s + Object.keys(v).length, 0)} ảnh → accessory.anchors.json`);
