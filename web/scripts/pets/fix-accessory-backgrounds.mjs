/**
 * Chuẩn hoá ảnh phụ kiện trong public/assets/pets/accessories/<loại>/:
 *   1. xoá nền ô caro "giả trong suốt" (thuật toán ở checkerboard.mjs)
 *   2. cắt sát món đồ (bỏ viền trong suốt) để web căn vị trí chính xác
 *
 * Ảnh gốc được sao lưu vào <repo>/assets-raw/pets/accessories/<loại>/ trước khi ghi đè.
 * Ảnh đã có nền trong suốt thật thì chỉ cắt sát.
 *
 * Cách dùng (trong thư mục web/):
 *   npm run pets:fix-accessories            → mọi loại
 *   npm run pets:fix-accessories -- hat     → chỉ 1 loại
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { detectChecker, expectedChecker, fixImage, hasRealTransparency } from './checkerboard.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.resolve(__dirname, '../..');
const REPO = path.resolve(WEB, '..');
const ROOT = path.join(WEB, 'public/assets/pets/accessories');
const RAW = path.join(REPO, 'assets-raw/pets/accessories');
const onlyCategory = process.argv[2];

/**
 * Ảnh có hiệu ứng phát sáng / lỗ ở giữa (vòng halo, vòng hoa): lượt 1 để sót ô caro bên trong vòng
 * (màu ô lệch nhiều) và ánh sáng mờ phủ lên ô caro. Chỉ bật cho các ảnh này vì với đồ màu bạc/xám
 * (vd. tiara) lượt tách này có thể làm mờ luôn món đồ.
 */
const GLOW_MATTE = (category, file) => category === 'halo' || ['crown/crown-06.png'].includes(`${category}/${file}`);

/**
 * Lượt 2 — "difference matte": so mỗi pixel với màu ô caro đáng lẽ có ở đúng vị trí đó.
 *   - gần như trùng (≤ T0)  → nền, trong suốt
 *   - lệch vừa (< K)        → ánh sáng mờ phủ lên nền: bán trong suốt, khôi phục màu gốc
 *   - lệch nhiều            → món đồ, giữ nguyên
 * Chỉ lan từ vùng đã là nền (hoặc mảng caro lớn bị vòng kẹp kín) qua các pixel "lệch vừa",
 * nên viền đen / thân món đồ chặn lại, không ăn vào trong.
 */
async function glowMatte(rawFile, fixedBuffer) {
  const T0 = 14, K = 90;
  const orig = await sharp(rawFile).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { data: src, info } = orig;
  const w = info.width, h = info.height, n = w * h;
  const out = Buffer.from((await sharp(fixedBuffer).ensureAlpha().raw().toBuffer()));
  const grid = detectChecker(src, w);

  const dist = new Float32Array(n);
  const expect = new Uint8Array(n);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const r = src[i * 4], g = src[i * 4 + 1], b = src[i * 4 + 2];
      const e = expectedChecker(grid, x, y);
      const dOf = (v) => Math.max(Math.abs(r - v), Math.abs(g - v), Math.abs(b - v));
      let v = e.value;
      if (e.nearLine) v = dOf(grid.light) < dOf(grid.dark) ? grid.light : grid.dark;
      expect[i] = v;
      dist[i] = dOf(v);
    }
  }

  // hạt giống: nền đã tách ở lượt 1 + mảng caro lớn bị kẹp trong vòng
  const region = new Uint8Array(n);
  const queue = [];
  for (let i = 0; i < n; i++) if (out[i * 4 + 3] < 10) { region[i] = 1; queue.push(i); }
  const cellArea = grid.fx.size * grid.fy.size;
  const seen = new Uint8Array(n);
  for (let s = 0; s < n; s++) {
    if (region[s] || seen[s] || dist[s] > T0) continue;
    const comp = [s];
    seen[s] = 1;
    for (let k = 0; k < comp.length; k++) {
      const i = comp[k], x = i % w;
      for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w]) {
        if (j >= 0 && j < n && !region[j] && !seen[j] && dist[j] <= T0) { seen[j] = 1; comp.push(j); }
      }
    }
    if (comp.length > cellArea * 1.5) for (const i of comp) { region[i] = 1; queue.push(i); }
  }
  // lan qua các pixel "lệch vừa"
  for (let k = 0; k < queue.length; k++) {
    const i = queue[k], x = i % w;
    for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w]) {
      if (j >= 0 && j < n && !region[j] && dist[j] < K) { region[j] = 1; queue.push(j); }
    }
  }

  for (let i = 0; i < n; i++) {
    if (!region[i]) continue;
    const a = Math.min(1, Math.max(0, (dist[i] - T0) / (K - T0)));
    const cur = out[i * 4 + 3] / 255;
    if (a <= 0.02) { out[i * 4 + 3] = 0; continue; }
    const e = expect[i];
    for (let c = 0; c < 3; c++) {
      out[i * 4 + c] = Math.max(0, Math.min(255, Math.round(e + (src[i * 4 + c] - e) / a)));
    }
    out[i * 4 + 3] = Math.round(Math.min(cur, a) * 255);
  }
  return sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}

/** Cắt sát phần có hình (alpha > 8), chừa 1% lề để mép mềm không bị cụt */
async function trimToContent(buffer) {
  const img = sharp(buffer);
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 8) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) throw new Error('ảnh trống sau khi xoá nền');
  const pad = Math.round(Math.max(w, h) * 0.01);
  const left = Math.max(0, x0 - pad), top = Math.max(0, y0 - pad);
  const width = Math.min(w, x1 + pad + 1) - left, height = Math.min(h, y1 + pad + 1) - top;
  return sharp(buffer).extract({ left, top, width, height }).png({ compressionLevel: 9 }).toBuffer();
}

let done = 0;
for (const category of fs.readdirSync(ROOT)) {
  const dir = path.join(ROOT, category);
  if (!fs.statSync(dir).isDirectory() || (onlyCategory && category !== onlyCategory)) continue;
  for (const file of fs.readdirSync(dir).filter((f) => /\.(png|webp)$/i.test(f)).sort()) {
    const target = path.join(dir, file);
    try {
      const rawDir = path.join(RAW, category);
      fs.mkdirSync(rawDir, { recursive: true });
      const backup = path.join(rawDir, file);
      if (!fs.existsSync(backup)) fs.copyFileSync(target, backup);

      let note;
      let buffer;
      if (await hasRealTransparency(backup)) {
        buffer = fs.readFileSync(backup);
        note = 'đã trong suốt sẵn';
      } else {
        const { out, transparent, cell } = await fixImage(backup);
        buffer = out;
        note = `ô caro ~${cell.toFixed(1)}px, nền trong suốt ${(transparent * 100).toFixed(0)}%`;
        if (GLOW_MATTE(category, file)) {
          buffer = await glowMatte(backup, buffer);
          note += ', tách ánh sáng';
        }
      }
      const trimmed = await trimToContent(buffer);
      const meta = await sharp(trimmed).metadata();
      fs.writeFileSync(target, trimmed);
      done++;
      console.log(`✅ ${category}/${file}  (${note}, cắt sát ${meta.width}×${meta.height})`);
    } catch (err) {
      console.log(`❌ ${category}/${file}: ${err.message}`);
    }
  }
}
console.log(`\nĐã xử lý ${done} ảnh. Ảnh gốc sao lưu ở assets-raw/pets/accessories/`);
