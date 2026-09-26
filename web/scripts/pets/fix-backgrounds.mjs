/**
 * Xoá nền ô caro "giả trong suốt" mà AI vẽ luôn vào ảnh stage{n}.png → nền trong suốt thật.
 * Giữ nguyên kích thước & vị trí nhân vật (không căn chỉnh lại).
 *
 * Cách nhận nền: dò kích thước + vị trí ô caro từ mép ảnh, rồi chỉ coi là nền những pixel
 * trung tính (xám/trắng) KHỚP đúng màu ô tại đúng vị trí đó, nối liền với mép ảnh.
 * Nhờ vậy lông trắng (thỏ, kỳ lân…) không bị ăn nhầm như khi chỉ lọc theo màu.
 *
 * Ảnh gốc được sao lưu vào <repo>/assets-raw/pets/{species}/ trước khi ghi đè.
 *
 * Cách dùng (trong thư mục web/):
 *   npm run pets:fix-bg              → tự tìm & sửa mọi ảnh stage không có nền trong suốt
 *   npm run pets:fix-bg -- bunny     → chỉ 1 loài
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.resolve(__dirname, '../..');
const REPO = path.resolve(WEB, '..');
const PETS = path.join(WEB, 'public/assets/pets');
const onlySpecies = process.argv[2];

const NEUTRAL = 6; // max-min kênh màu để coi là xám/trắng trung tính
const MATCH = 7; // sai số so với màu ô caro

/** Dò chu kỳ + pha của ô caro theo 1 trục từ dãy giá trị sát mép ảnh. */
function fitAxis(values, threshold) {
  const edges = [];
  let prev = values[0] > threshold;
  for (let i = 1; i < values.length; i++) {
    const cur = values[i] > threshold;
    if (cur !== prev) { edges.push(i); prev = cur; }
  }
  if (edges.length < 6) return null;
  const size = (edges[edges.length - 1] - edges[0]) / (edges.length - 1);
  // pha trung bình của các cạnh (mod size)
  const phase = edges.reduce((a, e, k) => a + (e - k * size), 0) / edges.length;
  return { size, phase };
}

async function fixImage(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height, n = w * h;
  const lum = (i) => data[i * 4];
  const neutral = (i) => {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    return Math.max(r, g, b) - Math.min(r, g, b) <= NEUTRAL;
  };

  // màu ô sáng / tối từ vùng góc trên-trái
  const corner = [];
  for (let y = 0; y < 60; y++) for (let x = 0; x < 60; x++) corner.push(lum(y * w + x));
  const light = Math.max(...corner), dark = Math.min(...corner);
  if (light - dark < 15) throw new Error('không thấy nền ô caro ở góc ảnh');
  const mid = (light + dark) / 2;

  const scanLen = Math.min(700, w);
  const fx = fitAxis(Array.from({ length: scanLen }, (_, x) => lum(2 * w + x)), mid);
  const fy = fitAxis(Array.from({ length: scanLen }, (_, y) => lum(y * w + 2)), mid);
  if (!fx || !fy) throw new Error('không dò được kích thước ô caro');
  const lightParity = (Math.floor((2 - fx.phase) / fx.size) + Math.floor((2 - fy.phase) / fy.size)) & 1
    ? (lum(2 * w + 2) > mid ? 1 : 0)
    : (lum(2 * w + 2) > mid ? 0 : 1);

  // pixel khớp nền ô caro tại đúng vị trí
  const isBg = new Uint8Array(n);
  for (let y = 0; y < h; y++) {
    const cy = (y - fy.phase) / fy.size, ey = Math.abs(cy - Math.round(cy)) * fy.size;
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (!neutral(i)) continue;
      const cx = (x - fx.phase) / fx.size, ex = Math.abs(cx - Math.round(cx)) * fx.size;
      const v = lum(i);
      if (ex < 1.5 || ey < 1.5) {
        // sát đường kẻ ô: màu có thể lẫn giữa 2 ô
        if (v >= dark - MATCH && v <= light + MATCH) isBg[i] = 1;
        continue;
      }
      const expectLight = ((Math.floor(cx) + Math.floor(cy)) & 1) === lightParity;
      if (Math.abs(v - (expectLight ? light : dark)) <= MATCH) isBg[i] = 1;
    }
  }

  // flood-fill từ mép ảnh qua các pixel nền
  const bg = new Uint8Array(n);
  const stack = [];
  const push = (i) => { if (isBg[i] && !bg[i]) { bg[i] = 1; stack.push(i); } };
  for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1); }
  while (stack.length) {
    const i = stack.pop(), x = i % w;
    if (x > 0) push(i - 1);
    if (x < w - 1) push(i + 1);
    if (i >= w) push(i - w);
    if (i < n - w) push(i + w);
  }

  // mảng nền bị kẹp kín (giữa tay chân…): cụm pixel khớp ô caro đủ lớn, có cả ô sáng lẫn tối
  const seen = new Uint8Array(n);
  for (let s = 0; s < n; s++) {
    if (!isBg[s] || bg[s] || seen[s]) continue;
    const comp = [s];
    seen[s] = 1;
    let d = 0, l = 0;
    for (let k = 0; k < comp.length; k++) {
      const i = comp[k], x = i % w;
      if (lum(i) < mid) d++; else l++;
      for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w]) {
        if (j >= 0 && j < n && isBg[j] && !bg[j] && !seen[j]) { seen[j] = 1; comp.push(j); }
      }
    }
    if (comp.length > 400 && d > 40 && l > 40) for (const i of comp) bg[i] = 1;
  }

  // lượt 2: ô caro sát lông thường bị AI tô lệch màu một chút → dùng ngưỡng lỏng hơn,
  // nhưng bắt buộc vùng đó PHẲNG (ô caro phẳng lì, lông thì có sợi/kết cấu) và nối liền với nền
  const flat = new Uint8Array(n);
  for (let y = 2; y < h - 2; y++) {
    for (let x = 2; x < w - 2; x++) {
      let s = 0, s2 = 0;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const v = lum((y + dy) * w + x + dx); s += v; s2 += v * v; }
      const mean = s / 25;
      if (s2 / 25 - mean * mean <= 6) flat[y * w + x] = 1;
    }
  }
  const loose = (i) => {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    const v = lum(i);
    return Math.max(r, g, b) - Math.min(r, g, b) <= 14 && v >= dark - 20 && v <= light + 5;
  };
  // lan theo từng lớp (BFS) và dừng sau ~1 ô caro → trường hợp xấu nhất chỉ gọt mép, không ăn sâu vào thân
  const maxDepth = Math.ceil(Math.max(fx.size, fy.size) * 1.1);
  let frontier = [];
  for (let i = 0; i < n; i++) if (bg[i]) frontier.push(i);
  for (let depth = 0; depth < maxDepth && frontier.length; depth++) {
    const next = [];
    for (const i of frontier) {
      const x = i % w;
      for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w]) {
        if (j < 0 || j >= n || bg[j]) continue;
        const jx = j % w, jy = (j / w) | 0;
        const cx = (jx - fx.phase) / fx.size, cy = (jy - fy.phase) / fy.size;
        const onGridLine = Math.abs(cx - Math.round(cx)) * fx.size < 2 || Math.abs(cy - Math.round(cy)) * fy.size < 2;
        if (loose(j) && (flat[j] || onGridLine)) { bg[j] = 1; next.push(j); }
      }
    }
    frontier = next;
  }

  // gọt viền: pixel sát nền, sáng & gần trung tính = màu pha giữa lông và nền
  for (let pass = 0; pass < 3; pass++) {
    const peel = [];
    for (let i = 0; i < n; i++) {
      if (bg[i]) continue;
      const x = i % w;
      const near = (x > 0 && bg[i - 1]) || (x < w - 1 && bg[i + 1]) || (i >= w && bg[i - w]) || (i < n - w && bg[i + w]);
      if (!near) continue;
      const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
      if (Math.min(r, g, b) >= dark - 10 && Math.max(r, g, b) - Math.min(r, g, b) < 18) peel.push(i);
    }
    if (!peel.length) break;
    for (const i of peel) bg[i] = 1;
  }

  // bỏ đốm vụn: chỉ giữ các cụm nhân vật đủ lớn
  const compId = new Int32Array(n).fill(-1);
  const sizes = [];
  for (let s = 0; s < n; s++) {
    if (bg[s] || compId[s] >= 0) continue;
    const id = sizes.length, q = [s];
    compId[s] = id;
    for (let k = 0; k < q.length; k++) {
      const i = q[k], x = i % w;
      for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w]) {
        if (j >= 0 && j < n && !bg[j] && compId[j] < 0) { compId[j] = id; q.push(j); }
      }
    }
    sizes.push(q.length);
  }
  const largest = Math.max(...sizes);
  const keep = new Uint8Array(n);
  for (let i = 0; i < n; i++) keep[i] = !bg[i] && sizes[compId[i]] > largest * 0.005 ? 255 : 0;

  // mép mềm
  const alpha = await sharp(Buffer.from(keep), { raw: { width: w, height: h, channels: 1 } })
    .erode(1).blur(0.8).extractChannel(0).raw().toBuffer();
  for (let i = 0; i < n; i++) data[i * 4 + 3] = alpha[i];

  const transparent = alpha.reduce((a, v) => a + (v < 10 ? 1 : 0), 0) / n;
  const out = await sharp(Buffer.from(data), { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
  return { out, transparent, cell: fx.size };
}

async function hasRealTransparency(file) {
  const { data } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let t = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] < 10) t++;
  return t / (data.length / 4) > 0.05;
}

let fixed = 0;
for (const species of fs.readdirSync(PETS)) {
  if (onlySpecies && species !== onlySpecies) continue;
  for (let stage = 1; stage <= 5; stage++) {
    const file = path.join(PETS, species, `stage${stage}.png`);
    if (!fs.existsSync(file) || (await hasRealTransparency(file))) continue;
    try {
      const rawDir = path.join(REPO, 'assets-raw/pets', species);
      fs.mkdirSync(rawDir, { recursive: true });
      const backup = path.join(rawDir, `stage${stage}.png`);
      if (!fs.existsSync(backup)) fs.copyFileSync(file, backup);
      const { out, transparent, cell } = await fixImage(backup);
      fs.writeFileSync(file, out);
      fixed++;
      console.log(`✅ ${species}/stage${stage}  (ô caro ~${cell.toFixed(1)}px, nền trong suốt ${(transparent * 100).toFixed(0)}%)`);
    } catch (err) {
      console.log(`❌ ${species}/stage${stage}: ${err.message}`);
    }
  }
}
console.log(`\nĐã sửa ${fixed} ảnh. Ảnh gốc sao lưu ở assets-raw/pets/`);
