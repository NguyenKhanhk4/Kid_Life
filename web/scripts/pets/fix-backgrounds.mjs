/**
 * Xoá nền ô caro "giả trong suốt" mà AI vẽ luôn vào ảnh stage{n}.png → nền trong suốt thật.
 * Giữ nguyên kích thước & vị trí nhân vật (không căn chỉnh lại).
 *
 * Thuật toán ở checkerboard.mjs.
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
import { fixImage, hasRealTransparency } from './checkerboard.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.resolve(__dirname, '../..');
const REPO = path.resolve(WEB, '..');
const PETS = path.join(WEB, 'public/assets/pets');
const onlySpecies = process.argv[2];

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
