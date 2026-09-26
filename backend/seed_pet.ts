/**
 * Tạo dữ liệu test cho module Pet (chạy lại bao nhiêu lần cũng được — mỗi lần reset về trạng thái ban đầu).
 *   npm run seed:pet
 *
 * Tài khoản phụ huynh: pet.tester@kidlife.vn / Pet@12345
 *   - Bé Na  (PIN 1234): 500 XP, Mèo stage 2, cho ăn lần cuối hôm qua (streak 5), có sẵn Mũ phớt + Cánh thiên thần (đang đeo) + Kính mắt mèo
 *   - Bé Tí  (PIN 5678): 300 XP, CHƯA có pet → test màn chọn loài
 *   - Bé Bin (PIN 1111):   5 XP, Rồng stage 3 → test lỗi "không đủ XP"
 * + 81 phụ kiện thú cưng (8 loại, ảnh trong web/public/assets/pets/accessories) cho tủ đồ.
 * Chỉ đụng tới tài khoản test này, không sửa dữ liệu của người dùng khác.
 */
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { env } from './src/config/env';
import { connectMongo, disconnectMongo } from './src/database/mongo';
import User from './src/modules/auth/user.model';
import Child from './src/modules/children/children.model';
import Wallet from './src/modules/wallets/wallet.model';
import WalletTransaction from './src/modules/wallets/wallet-transaction.model';
import { PetModel } from './src/modules/pet/pet.model';
import {
  ACCESSORY_SLOT,
  ChildPetAccessory,
  PetAccessory,
  type AccessoryCategory,
} from './src/modules/pet/accessories/pet-accessory.model';

/**
 * Danh mục phụ kiện = ảnh trong web/public/assets/pets/accessories/<category>/<category>-NN.png
 * (upsert theo đường dẫn ảnh — không đụng phụ kiện admin tự thêm). Mỗi dòng: [tên, giá XP].
 * Chưa đưa vào: halo-05..10 và wings-05 — ảnh gốc vẽ hiệu ứng trong mờ lên nền caro, chưa tách sạch
 * (xem accessories/README.md); có ảnh nền trong suốt thật thì thêm tên vào đây.
 */
const IMG = '/assets/pets/accessories';
const CATALOG: Record<AccessoryCategory, [string, number][]> = {
  hat: [
    ['Mũ sinh nhật', 40], ['Mũ phù thủy', 70], ['Mũ thám tử', 60], ['Mũ nhung đỏ', 70], ['Mũ lưỡi trai', 40],
    ['Bờm tuần lộc', 50], ['Mũ phớt', 60], ['Bờm tai gấu', 40], ['Bờm tai thỏ', 40], ['Nón lá', 50],
    ['Mũ Noel', 50], ['Mũ hải tặc', 70], ['Mũ đầu bếp', 50], ['Mũ cao bồi', 60],
  ],
  crown: [
    ['Vương miện vàng', 150], ['Vương miện kim cương', 160], ['Vương miện ngọc lục bảo', 140], ['Vương miện trái tim', 120],
    ['Vương miện ngôi sao', 120], ['Vòng hoa', 70], ['Vương miện băng giá', 140], ['Mũ vua đỏ', 130],
    ['Vương miện đêm sao', 150], ['Vương miện cỏ bốn lá', 110], ['Vương miện rừng xanh', 130], ['Vương miện cầu vồng', 120],
  ],
  halo: [['Hào quang vàng', 100], ['Hào quang cầu vồng', 110], ['Hào quang đêm sao', 110], ['Vòng hoa hào quang', 90]],
  bow: [
    ['Nơ hồng chấm bi', 30], ['Nơ xanh dương', 30], ['Nơ kẹo sọc', 35], ['Nơ hoa nhí', 35], ['Nơ tím', 30],
    ['Nơ cầu vồng', 40], ['Nơ bạc hà', 30], ['Nơ da báo', 35], ['Nơ dâu tây', 35], ['Nơ vàng kim', 40],
    ['Nơ hồng phấn', 30], ['Nơ caro', 35],
  ],
  glasses: [
    ['Kính tròn tím', 40], ['Kính mắt mèo', 50], ['Kính trái tim', 50], ['Kính phi công', 60], ['Kính ngôi sao', 50],
    ['Kính vuông cam', 40], ['Kính cầu vồng', 55], ['Kính một mắt', 60], ['Kính 3D', 45], ['Kính bông hoa', 50],
    ['Kính học giả', 40], ['Kính hồng xinh', 45],
  ],
  mask: [
    ['Mặt nạ dạ hội', 60], ['Mặt nạ siêu anh hùng', 50], ['Mặt nạ ninja', 60], ['Bịt mắt hải tặc', 40],
    ['Mặt nạ hoàng kim', 70], ['Mặt nạ cáo', 60], ['Mặt nạ khủng long', 60], ['Mặt nạ chú hề', 50],
  ],
  necklace: [
    ['Dây chuyền hồng ngọc', 90], ['Vòng ngọc trai', 80], ['Dây chuyền trái tim', 70], ['Vòng cổ chuông', 40],
    ['Dây chuyền ngôi sao', 70], ['Vòng hoa đeo cổ', 50], ['Vòng cổ khúc xương', 40], ['Dây chuyền đá quý', 100],
    ['Dây chuyền hổ phách', 80], ['Dây chuyền đồng hồ', 90],
  ],
  wings: [
    ['Cánh thiên thần', 150], ['Cánh bướm cam', 120], ['Cánh rồng xanh', 160], ['Cánh bướm cầu vồng', 140],
    ['Cánh tiên pha lê', 150], ['Cánh quạ đen', 140], ['Cánh dơi tím', 130], ['Cánh tiên vàng', 140],
    ['Cánh chim ưng', 140], ['Cánh cơ khí vàng', 180],
  ],
};
const EXCLUDED = new Set(['halo/halo-05', 'halo/halo-06', 'halo/halo-07', 'halo/halo-08', 'halo/halo-09', 'halo/halo-10', 'wings/wings-05']);

const ACCESSORIES = (Object.entries(CATALOG) as [AccessoryCategory, [string, number][]][]).flatMap(([category, items]) =>
  items
    .map(([name, cost_xp], i) => {
      const file = `${category}/${category}-${String(i + 1).padStart(2, '0')}`;
      return { name, icon: `${IMG}/${file}.png`, category, cost_xp, sort_order: i + 1, file };
    })
    .filter((a) => !EXCLUDED.has(a.file)),
);

/** Phụ kiện bé đã có sẵn khi seed: [file ảnh, đang mặc?] */
const OWNED: Record<string, [string, boolean][]> = {
  'Bé Na': [['hat/hat-07', true], ['glasses/glasses-02', false], ['wings/wings-01', true]],
};

const PARENT = { email: 'pet.tester@kidlife.vn', password: 'Pet@12345', fullName: 'Phụ huynh test Pet' };

const DAY_MS = 24 * 60 * 60 * 1000;

interface KidSeed {
  name: string;
  pin: string;
  avatar: string;
  age: number;
  xp: number;
  pet: { speciesId: string; stage: number; exp: number; totalExp: number; streakDays: number; lastFedDaysAgo: number } | null;
}

const KIDS: KidSeed[] = [
  {
    name: 'Bé Na', pin: '1234', avatar: '🐱', age: 7, xp: 500,
    pet: { speciesId: 'cat', stage: 2, exp: 120, totalExp: 180, streakDays: 5, lastFedDaysAgo: 1 },
  },
  { name: 'Bé Tí', pin: '5678', avatar: '🐰', age: 6, xp: 300, pet: null },
  {
    name: 'Bé Bin', pin: '1111', avatar: '🦁', age: 9, xp: 5,
    pet: { speciesId: 'dragon', stage: 3, exp: 300, totalExp: 780, streakDays: 0, lastFedDaysAgo: 3 },
  },
];

function levelOf(xp: number) {
  if (xp >= 2000) return 5;
  if (xp >= 1000) return 4;
  if (xp >= 500) return 3;
  if (xp >= 200) return 2;
  return 1;
}

async function main() {
  await connectMongo(env.mongoUri);
  console.log(`Đã kết nối MongoDB (database: ${mongoose.connection.name})`);

  await Promise.all([PetAccessory.syncIndexes(), ChildPetAccessory.syncIndexes()]);
  const accessoryIds = new Map<string, mongoose.Types.ObjectId>();
  for (const { file, ...a } of ACCESSORIES) {
    const doc = await PetAccessory.findOneAndUpdate(
      { icon: a.icon },
      { $set: { ...a, is_active: true } },
      { upsert: true, new: true },
    );
    accessoryIds.set(file, doc._id as mongoose.Types.ObjectId);
  }
  // Ngừng bán các món seed cũ có ảnh không còn trong danh mục (bé đã mua vẫn giữ)
  const stale = await PetAccessory.updateMany(
    { icon: { $regex: `^${IMG}/`, $nin: ACCESSORIES.map((a) => a.icon) }, is_active: true },
    { is_active: false },
  );
  console.log(`Danh mục phụ kiện: ${ACCESSORIES.length} món` + (stale.modifiedCount ? `, ngừng bán ${stale.modifiedCount} món cũ` : ''));

  const passwordHash = await bcrypt.hash(PARENT.password, 10);
  const parent = await User.findOneAndUpdate(
    { email: PARENT.email },
    { $set: { passwordHash, fullName: PARENT.fullName, role: 'parent', status: 'active' } },
    { upsert: true, new: true },
  );

  for (const kid of KIDS) {
    const child = await Child.findOneAndUpdate(
      { parentId: parent._id, name: kid.name },
      {
        $set: {
          avatar: kid.avatar,
          age: kid.age,
          status: 'active',
          pinCodeHash: await bcrypt.hash(kid.pin, 10),
          streak: kid.pet?.lastFedDaysAgo === 1 ? kid.pet.streakDays : 0,
        },
      },
      { upsert: true, new: true },
    );
    const childId = String(child._id);

    await Wallet.findOneAndUpdate(
      { child_id: child._id },
      { $set: { total_xp: kid.xp, current_level: levelOf(kid.xp), updated_at: new Date() } },
      { upsert: true, new: true },
    );
    await WalletTransaction.deleteMany({ child_id: child._id, type: /^pet_/ });

    await ChildPetAccessory.deleteMany({ child_id: child._id });
    for (const [file, equipped] of OWNED[kid.name] ?? []) {
      const accessory = ACCESSORIES.find((a) => a.file === file)!;
      await ChildPetAccessory.create({
        child_id: child._id,
        accessory_id: accessoryIds.get(file),
        category: accessory.category,
        slot: ACCESSORY_SLOT[accessory.category],
        is_equipped: equipped,
      });
    }

    await PetModel.deleteOne({ childId });
    if (kid.pet) {
      const { lastFedDaysAgo, ...pet } = kid.pet;
      await PetModel.create({ childId, ...pet, feedsToday: 3, lastFedAt: new Date(Date.now() - lastFedDaysAgo * DAY_MS) });
    }

    console.log(
      `  ${kid.name.padEnd(7)} id=${childId}  PIN ${kid.pin}  ${kid.xp} XP  ` +
        (kid.pet ? `pet ${kid.pet.speciesId} stage ${kid.pet.stage}` : 'chưa có pet'),
    );
  }

  console.log(`\nĐăng nhập web: ${PARENT.email} / ${PARENT.password} → "Bé" → chọn bé → nhập PIN → menu Thú cưng`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => disconnectMongo());
