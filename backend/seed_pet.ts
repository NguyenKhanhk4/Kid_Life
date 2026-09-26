/**
 * Tạo dữ liệu test cho module Pet (chạy lại bao nhiêu lần cũng được — mỗi lần reset về trạng thái ban đầu).
 *   npm run seed:pet
 *
 * Tài khoản phụ huynh: pet.tester@kidlife.vn / Pet@12345
 *   - Bé Na  (PIN 1234): 500 XP, Mèo stage 2, cho ăn lần cuối hôm qua (streak 5), có sẵn Mũ ảo thuật (đang mặc) + Kính râm
 *   - Bé Tí  (PIN 5678): 300 XP, CHƯA có pet → test màn chọn loài
 *   - Bé Bin (PIN 1111):   5 XP, Rồng stage 3 → test lỗi "không đủ XP"
 * + 9 phụ kiện thú cưng (mũ, kính, vương miện, khăn/nơ) cho tủ đồ.
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
import { ChildPetAccessory, PetAccessory } from './src/modules/pet/accessories/pet-accessory.model';

/** Danh mục phụ kiện (upsert theo tên — không đụng phụ kiện admin tự thêm). */
const ACCESSORIES = [
  { name: 'Mũ ảo thuật', icon: '🎩', category: 'hat', cost_xp: 60, sort_order: 1 },
  { name: 'Mũ lưỡi trai', icon: '🧢', category: 'hat', cost_xp: 40, sort_order: 2 },
  { name: 'Mũ tốt nghiệp', icon: '🎓', category: 'hat', cost_xp: 90, sort_order: 3 },
  { name: 'Kính râm', icon: '🕶️', category: 'glasses', cost_xp: 50, sort_order: 1 },
  { name: 'Kính học giả', icon: '👓', category: 'glasses', cost_xp: 40, sort_order: 2 },
  { name: 'Vương miện vàng', icon: '👑', category: 'crown', cost_xp: 150, sort_order: 1 },
  { name: 'Vòng hoa', icon: '🌸', category: 'crown', cost_xp: 70, sort_order: 2 },
  { name: 'Khăn quàng đỏ', icon: '🧣', category: 'cape', cost_xp: 60, sort_order: 1 },
  { name: 'Nơ xinh', icon: '🎀', category: 'cape', cost_xp: 45, sort_order: 2 },
] as const;

/** Phụ kiện bé đã có sẵn khi seed: [tên, đang mặc?] */
const OWNED: Record<string, [string, boolean][]> = {
  'Bé Na': [['Mũ ảo thuật', true], ['Kính râm', false]],
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
  for (const a of ACCESSORIES) {
    const doc = await PetAccessory.findOneAndUpdate(
      { name: a.name },
      { $set: { ...a, is_active: true } },
      { upsert: true, new: true },
    );
    accessoryIds.set(a.name, doc._id as mongoose.Types.ObjectId);
  }
  console.log(`Danh mục phụ kiện: ${ACCESSORIES.length} món`);

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
    for (const [name, equipped] of OWNED[kid.name] ?? []) {
      const accessory = ACCESSORIES.find((a) => a.name === name)!;
      await ChildPetAccessory.create({
        child_id: child._id,
        accessory_id: accessoryIds.get(name),
        category: accessory.category,
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
