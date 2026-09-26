/**
 * Dữ liệu test cho Báo cáo kỹ năng (module 3.3). Chạy SAU `npm run seed:pet` (dùng lại các bé test):
 *   npm run seed:reports
 *
 * Tạo nhiệm vụ đã được duyệt (kèm bài nộp) + ngày chăm pet cho tháng trước và tháng này, để radar
 * có số liệu thật và có % thay đổi. Chạy lại = xoá dữ liệu cũ của các bé test rồi tạo lại.
 * Chỉ đụng tới các bé của tài khoản pet.tester@kidlife.vn.
 */
import mongoose from 'mongoose';
import { env } from './src/config/env';
import { connectMongo, disconnectMongo } from './src/database/mongo';
import User from './src/modules/auth/user.model';
import Child from './src/modules/children/children.model';
import Mission from './src/modules/missions/mission.model';
import Penalty from './src/modules/penalties/penalty.model';
import Submission from './src/modules/submissions/submission.model';
import Wallet from './src/modules/wallets/wallet.model';
import WalletTransaction from './src/modules/wallets/wallet-transaction.model';
import { AiSkillReport } from './src/modules/reports/ai-skill-report.model';
import { monthPeriodOf, monthRange, shiftMonth } from './src/modules/reports/ai-skill.scoring';

const PARENT_EMAIL = 'pet.tester@kidlife.vn';
const PROOF_IMG = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';

type Category = 'hoc_tap' | 'nha_cua' | 'the_chat' | 'ky_nang' | 'khac';

const TITLES: Record<Category, string[]> = {
  nha_cua: ['Dọn giường sau khi ngủ dậy', 'Rửa bát sau bữa tối', 'Quét nhà', 'Tưới cây ngoài ban công'],
  ky_nang: ['Tự buộc dây giày', 'Tự chuẩn bị cặp sách'],
  the_chat: ['Chạy bộ 15 phút', 'Tập bơi', 'Đạp xe cùng bố'],
  hoc_tap: ['Đọc sách 30 phút', 'Làm bài tập toán', 'Học 5 từ tiếng Anh'],
  khac: ['Vẽ tranh tặng mẹ', 'Gọi điện hỏi thăm ông bà'],
};

type MonthPlan = Partial<Record<Category, number>> & { petDays: number; penalties?: number };

/** Số nhiệm vụ đã duyệt theo loại + số ngày chăm pet + số lần bị phạt, cho [tháng trước, tháng này] */
const PLAN: Record<string, { prev: MonthPlan; cur: MonthPlan }> = {
  // Tháng này Tự lập tăng mạnh, Trí tuệ giảm, bị phạt 1 lần → Chuyên cần giảm → có lời khuyên rõ ràng
  'Bé Na': {
    prev: { nha_cua: 6, ky_nang: 2, the_chat: 6, hoc_tap: 6, khac: 3, petDays: 6 },
    cur: { nha_cua: 10, ky_nang: 3, the_chat: 5, hoc_tap: 3, khac: 1, petDays: 4, penalties: 1 },
  },
  // Chỉ có dữ liệu tháng này → % thay đổi hiện "—"
  'Bé Tí': { prev: { petDays: 0 }, cur: { hoc_tap: 6, the_chat: 2, petDays: 0 } },
};

const DAY_MS = 24 * 60 * 60 * 1000;

/** Ngày thứ `i` rải đều trong [start, until) lúc 10h sáng giờ địa phương */
function spreadDate(start: Date, until: Date, i: number, n: number): Date {
  const days = Math.max(1, Math.floor((until.getTime() - start.getTime()) / DAY_MS));
  const day = Math.floor(((i + 0.5) * days) / Math.max(n, 1));
  return new Date(start.getTime() + day * DAY_MS + 10 * 3_600_000);
}

async function seedMonth(
  childId: mongoose.Types.ObjectId,
  parentId: mongoose.Types.ObjectId,
  period: string,
  plan: PLAN_ENTRY,
  until: Date,
) {
  const { start, end } = monthRange(period, env.tzOffsetMinutes);
  const stop = until < end ? until : end;
  let total = 0;
  for (const [category, count] of Object.entries(plan) as [Category | 'petDays' | 'penalties', number][]) {
    if (category === 'petDays' || category === 'penalties') continue;
    for (let i = 0; i < count; i++) {
      const at = spreadDate(start, stop, i, count);
      const mission = await Mission.create({
        child_id: childId,
        title: TITLES[category][i % TITLES[category].length],
        category,
        reward_xp: 20,
        status: 'done',
        created_at: at,
        updated_at: at,
      });
      await Submission.create({
        mission_id: mission._id,
        child_id: childId,
        proof_image_url: PROOF_IMG,
        proof_image_public_id: 'seed',
        status: 'approved',
        submitted_at: at,
        reviewed_at: at,
      });
      total++;
    }
  }
  const wallet = await Wallet.findOne({ child_id: childId });
  for (let i = 0; i < (plan.penalties ?? 0); i++) {
    await Penalty.create({
      child_id: childId,
      parent_id: parentId,
      reason: 'Chưa dọn đồ chơi sau khi chơi',
      penalty_xp: 10,
      actual_deducted: 0,
      wallet_balance_before: 0,
      wallet_balance_after: 0,
      created_at: spreadDate(start, stop, i, plan.penalties ?? 1),
    });
  }
  for (let i = 0; i < plan.petDays; i++) {
    await WalletTransaction.create({
      wallet_id: wallet?._id ?? new mongoose.Types.ObjectId(),
      child_id: childId,
      amount: -10,
      type: 'pet_feed',
      reference_id: new mongoose.Types.ObjectId(),
      description: 'Cho thú cưng ăn',
      created_at: spreadDate(start, stop, i, plan.petDays),
    });
  }
  return total;
}
type PLAN_ENTRY = MonthPlan;

async function main() {
  await connectMongo(env.mongoUri);
  console.log(`Đã kết nối MongoDB (database: ${mongoose.connection.name})`);

  const parent = await User.findOne({ email: PARENT_EMAIL });
  if (!parent) throw new Error(`Chưa có ${PARENT_EMAIL} — chạy "npm run seed:pet" trước`);

  // Báo cáo cũ (trước khi đổi Tình cảm → Chuyên cần) — là dữ liệu tính lại được, xem báo cáo sẽ tự sinh lại
  const stale = await AiSkillReport.deleteMany({ chuyen_can_score: { $exists: false } });
  if (stale.deletedCount) console.log(`Xoá ${stale.deletedCount} báo cáo định dạng cũ`);

  const now = new Date();
  const cur = monthPeriodOf(now, env.tzOffsetMinutes);
  const prev = shiftMonth(cur, -1);

  for (const [name, plan] of Object.entries(PLAN)) {
    const child = await Child.findOne({ parentId: parent._id, name });
    if (!child) {
      console.log(`  Bỏ qua ${name}: chưa có (chạy seed:pet trước)`);
      continue;
    }
    const missionIds = (await Mission.find({ child_id: child._id }).select('_id').lean()).map((m) => m._id);
    await Promise.all([
      Submission.deleteMany({ child_id: child._id }),
      Mission.deleteMany({ _id: { $in: missionIds } }),
      AiSkillReport.deleteMany({ child_id: child._id }),
      WalletTransaction.deleteMany({ child_id: child._id, type: 'pet_feed' }),
      Penalty.deleteMany({ child_id: child._id }),
    ]);

    const childId = child._id as mongoose.Types.ObjectId;
    const parentId = parent._id as mongoose.Types.ObjectId;
    const a = await seedMonth(childId, parentId, prev, plan.prev, now);
    const b = await seedMonth(childId, parentId, cur, plan.cur, now);
    console.log(`  ${name.padEnd(7)} ${prev}: ${a} nhiệm vụ, ${plan.prev.petDays} ngày chăm pet | ${cur}: ${b} nhiệm vụ, ${plan.cur.petDays} ngày chăm pet`);
  }

  console.log('\nXem: đăng nhập pet.tester@kidlife.vn → Phụ huynh → chọn bé ở góc trên → Báo cáo AI');
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => disconnectMongo());
