/**
 * Render ảnh kiểm tra vị trí phụ kiện: mỗi loại phụ kiện 1 lưới 11 loài × 5 stage,
 * dùng ĐÚNG hàm placeAccessory của web (src/features/pet/view/accessoryLayout.ts).
 *
 * Cách dùng (trong thư mục web/):
 *   npm run pets:preview-accessories -- <thư mục ra> [category] [ảnh phụ kiện]
 *   vd. npm run pets:preview-accessories -- ../tmp hat hat/hat-07.png
 *   npm run pets:preview-accessories -- <thư mục ra> --items <category>
 *     → mọi ảnh của 1 loại, gắn lên vài pet đại diện (để chỉnh riêng từng ảnh)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { ACCESSORY_CATEGORIES, anchorsOf, eyesOf, itemKeyOf, placeAccessory, speciesTuningOf } from '../../src/features/pet/view/accessoryLayout.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.resolve(__dirname, '../..');
const PETS = path.join(WEB, 'public/assets/pets');
const VIEW = path.join(WEB, 'src/features/pet/view');
const read = (f) => JSON.parse(fs.readFileSync(path.join(VIEW, f), 'utf8'));
const eyesData = read('eyes.data.json');
const anchors = read('accessory.anchors.json');
const tuning = read('accessory.tuning.json');

const args = process.argv.slice(2);
const itemsMode = args.includes('--items');
const [outDir = '.', onlyCategory, onlyItem] = args.filter((a) => a !== '--items');
const SAMPLE = {
  hat: 'hat/hat-07.png',
  crown: 'crown/crown-01.png',
  halo: 'halo/halo-01.png',
  bow: 'bow/bow-01.png',
  glasses: 'glasses/glasses-02.png',
  mask: 'mask/mask-02.png',
  necklace: 'necklace/necklace-03.png',
  wings: 'wings/wings-01.png',
};
const CELL = 180;
const species = Object.keys(anchors).sort();

const dataUri = async (file, width) =>
  `data:image/png;base64,${(await sharp(file).resize({ width }).png().toBuffer()).toString('base64')}`;

fs.mkdirSync(outDir, { recursive: true });

/** Vẽ 1 ô: pet + phụ kiện, trả về các phần tử SVG */
async function cell(sp, stage, category, itemKey, ox, oy, size) {
  const itemFile = path.join(PETS, 'accessories', itemKey);
  const meta = await sharp(itemFile).metadata();
  const p = placeAccessory({
    category,
    eyes: eyesOf(eyesData[sp]?.[String(stage)], tuning, sp, stage),
    anchors: anchorsOf(anchors, tuning, sp, stage),
    species: speciesTuningOf(tuning, sp, stage, category),
    item: tuning.items[itemKeyOf(itemKey)],
  });
  const k = size / 100;
  const w = p.width * k, h = (w * meta.height) / meta.width;
  const acc = `<g transform="translate(${ox + p.x * k} ${oy + p.y * k}) rotate(${p.rotate})"><image href="${await dataUri(itemFile, 300)}" x="${-w / 2}" y="${-p.originY * h}" width="${w}" height="${h}"/></g>`;
  const pet = `<image href="${await dataUri(path.join(PETS, sp, `stage${stage}.png`), size * 2)}" x="${ox}" y="${oy}" width="${size}" height="${size}"/>`;
  return p.behind ? acc + pet : pet + acc;
}

if (itemsMode) {
  const PICK = [['cat', 2], ['fox', 5], ['pig', 1], ['dragon', 3], ['unicron', 4]];
  const dir = path.join(PETS, 'accessories', onlyCategory);
  const files = fs.readdirSync(dir).filter((f) => /.(png|webp)$/i.test(f)).sort();
  const parts = [];
  for (let r = 0; r < files.length; r++) {
    parts.push(`<text x="4" y="${r * CELL + CELL / 2}" font-size="13" font-family="Arial">${files[r].replace(/.png$/, '')}</text>`);
    for (let c = 0; c < PICK.length; c++) {
      const [sp, st] = PICK[c];
      parts.push(`<rect x="${90 + c * CELL}" y="${r * CELL}" width="${CELL}" height="${CELL}" fill="${(r + c) % 2 ? '#e3eaf7' : '#eef2fb'}"/>`);
      parts.push(await cell(sp, st, onlyCategory, `${onlyCategory}/${files[r]}`, 90 + c * CELL, r * CELL, CELL));
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${90 + PICK.length * CELL}" height="${files.length * CELL}"><rect width="100%" height="100%" fill="#fff"/>${parts.join('')}</svg>`;
  const out = path.join(outDir, `items-${onlyCategory}.png`);
  await sharp(Buffer.from(svg)).png().toFile(out);
  console.log(`🖼  ${out}`);
  process.exit(0);
}
for (const category of ACCESSORY_CATEGORIES) {
  if (onlyCategory && category !== onlyCategory) continue;
  const itemKey = onlyItem ?? SAMPLE[category];
  const itemFile = path.join(PETS, 'accessories', itemKey);
  const meta = await sharp(itemFile).metadata();
  const aspect = meta.height / meta.width;
  const itemUri = await dataUri(itemFile, 360);

  const parts = [];
  for (let row = 0; row < species.length; row++) {
    const sp = species[row];
    parts.push(`<text x="6" y="${row * CELL + CELL / 2}" font-size="15" font-family="Arial">${sp}</text>`);
    for (let stage = 1; stage <= 5; stage++) {
      const ox = 80 + (stage - 1) * CELL, oy = row * CELL;
      const p = placeAccessory({
        category,
        eyes: eyesOf(eyesData[sp]?.[String(stage)], tuning, sp, stage),
        anchors: anchorsOf(anchors, tuning, sp, stage),
        species: speciesTuningOf(tuning, sp, stage, category),
        item: tuning.items[itemKeyOf(itemKey)],
      });
      const k = CELL / 100;
      const w = p.width * k, h = w * aspect;
      const acc = `<g transform="translate(${ox + p.x * k} ${oy + p.y * k}) rotate(${p.rotate})"><image href="${itemUri}" x="${-w / 2}" y="${-p.originY * h}" width="${w}" height="${h}"/></g>`;
      const pet = `<image href="${await dataUri(path.join(PETS, sp, `stage${stage}.png`), CELL * 2)}" x="${ox}" y="${oy}" width="${CELL}" height="${CELL}"/>`;
      parts.push(`<rect x="${ox}" y="${oy}" width="${CELL}" height="${CELL}" fill="${(row + stage) % 2 ? '#e3eaf7' : '#eef2fb'}"/>`);
      parts.push(p.behind ? acc + pet : pet + acc);
      // chấm đỏ = điểm neo
      parts.push(`<circle cx="${ox + p.x * k}" cy="${oy + p.y * k}" r="2" fill="red"/>`);
    }
  }
  const W = 80 + 5 * CELL, H = species.length * CELL;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="100%" height="100%" fill="#fff"/>${parts.join('')}</svg>`;
  const out = path.join(outDir, `preview-${category}.png`);
  await sharp(Buffer.from(svg)).png().toFile(out);
  console.log(`🖼  ${out}  (${itemKey})`);
}
