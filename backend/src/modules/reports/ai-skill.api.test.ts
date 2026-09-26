import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import { after, before, describe, it } from 'node:test';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { createApp } from '../../app';
import User from '../auth/user.model';
import Child from '../children/children.model';
import Mission from '../missions/mission.model';
import Penalty from '../penalties/penalty.model';
import Submission from '../submissions/submission.model';
import WalletTransaction from '../wallets/wallet-transaction.model';
import { AiSkillReport } from './ai-skill-report.model';

/** DB riêng để chạy song song với các file test khác. */
const MONGO = process.env.MONGODB_TEST_URI_REPORTS ?? 'mongodb://127.0.0.1:27017/kidlife_test_reports';
process.env.JWT_SECRET ??= 'test_secret';

// 00:00 ngày 16/9 giờ VN → tháng 9 đã trôi qua đúng 1 nửa
const clock = new Date('2026-09-15T17:00:00Z');

let server: Server;
let base = '';
let parentToken = '';
let strangerToken = '';
let kid = '';

async function call(method: string, path: string, body?: unknown, token = parentToken) {
  const headers: Record<string, string> = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(base + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

/** n nhiệm vụ category đã được duyệt vào ngày `day` (giờ UTC 03:00 = 10h sáng VN) */
async function approvedMissions(category: string, n: number, day: string) {
  const at = new Date(`${day}T03:00:00Z`);
  for (let i = 0; i < n; i++) {
    const m = await Mission.create({ child_id: kid, title: `${category} ${i}`, category, reward_xp: 10, status: 'done', updated_at: at });
    await Submission.create({
      mission_id: m._id,
      child_id: kid,
      proof_image_url: 'https://x/y.jpg',
      proof_image_public_id: 'y',
      status: 'approved',
      reviewed_at: at,
    });
  }
}

type Axis = { key: string; score: number; deltaPercent: number | null; previousScore: number | null; activities: number };
const axis = (report: { axes: Axis[] }, key: string) => report.axes.find((a) => a.key === key) as Axis;

describe('API /api/reports', () => {
  before(async () => {
    await mongoose.connect(MONGO, { serverSelectionTimeoutMS: 3000 });
    await mongoose.connection.dropDatabase();
    await AiSkillReport.syncIndexes();

    const secret = process.env.JWT_SECRET as string;
    const parent = await User.create({ email: 'p@test.vn', passwordHash: 'x', fullName: 'Phụ huynh' });
    const stranger = await User.create({ email: 's@test.vn', passwordHash: 'x', fullName: 'Người lạ' });
    parentToken = jwt.sign({ id: String(parent._id), role: 'parent' }, secret);
    strangerToken = jwt.sign({ id: String(stranger._id), role: 'parent' }, secret);
    kid = String((await Child.create({ parentId: parent._id, name: 'Bé Na' }))._id);

    // Tháng 8: tự lập 11/16=69, sức khỏe 6/12=50, trí tuệ 6/12=50, chuyên cần 10 ngày/31=32
    await approvedMissions('nha_cua', 8, '2026-08-10');
    await approvedMissions('the_chat', 6, '2026-08-11');
    await approvedMissions('hoc_tap', 6, '2026-08-12');
    await approvedMissions('khac', 3, '2026-08-13');
    for (let d = 1; d <= 6; d++) {
      await WalletTransaction.create({
        wallet_id: new mongoose.Types.ObjectId(),
        child_id: kid,
        amount: -10,
        type: 'pet_feed',
        reference_id: new mongoose.Types.ObjectId(),
        description: 'Cho thú cưng ăn',
        created_at: new Date(`2026-08-0${d}T03:00:00Z`),
      });
    }
    // Tháng 9 (đã qua 15 ngày): tự lập 8/8, sức khỏe 3/6, trí tuệ 1/6, chuyên cần 3 ngày/15 − 1 lần phạt
    await approvedMissions('nha_cua', 8, '2026-09-02');
    await approvedMissions('the_chat', 3, '2026-09-03');
    await approvedMissions('hoc_tap', 1, '2026-09-04');
    // bài bị từ chối không được tính
    await Submission.create({
      mission_id: (await Mission.create({ child_id: kid, title: 'x', category: 'khac', reward_xp: 5 }))._id,
      child_id: kid,
      proof_image_url: 'https://x/y.jpg',
      proof_image_public_id: 'y',
      status: 'rejected',
      reviewed_at: new Date('2026-09-05T03:00:00Z'),
    });
    await Penalty.create({
      child_id: kid,
      parent_id: new mongoose.Types.ObjectId(),
      reason: 'Nói dối',
      penalty_xp: 10,
      actual_deducted: 0,
      wallet_balance_before: 0,
      wallet_balance_after: 0,
      created_at: new Date('2026-09-07T03:00:00Z'),
    });

    const { app, registerErrorHandlers } = createApp({ now: () => clock });
    registerErrorHandlers();
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  after(async () => {
    server.close();
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it('không token → 401; bé nhà khác → 403; tháng tương lai / sai định dạng → 400', async () => {
    assert.equal((await call('GET', `/api/reports/ai-skill?childId=${kid}`, undefined, '')).status, 401);
    assert.equal((await call('GET', `/api/reports/ai-skill?childId=${kid}`, undefined, strangerToken)).status, 403);
    assert.equal((await call('GET', `/api/reports/ai-skill?childId=${kid}&month=2026-12`)).body.error.code, 'INVALID_MONTH');
    assert.equal((await call('GET', `/api/reports/ai-skill?childId=${kid}&month=2026-9`)).status, 400);
  });

  it('báo cáo tháng hiện tại: điểm từ dữ liệu thật + % thay đổi backend tính sẵn', async () => {
    const r = await call('GET', `/api/reports/ai-skill?childId=${kid}`);
    assert.equal(r.status, 200);
    const report = r.body.report;
    assert.equal(report.monthPeriod, '2026-09');
    assert.equal(report.generatedBy, 'rules');

    assert.deepEqual(
      report.axes.map((a: Axis) => [a.key, a.score, a.previousScore, a.deltaPercent]),
      [
        ['tu_lap', 100, 69, 44.9],
        ['suc_khoe', 50, 50, 0],
        ['tri_tue', 17, 50, -66],
        ['chuyen_can', 10, 32, -68.7], // 3/15 ngày = 20%, bị phạt 1 lần −10
      ],
    );
    assert.equal(axis(report, 'chuyen_can').activities, 3); // ngày có bài bị từ chối không tính
    // trọng tâm = chỉ số thấp nhất (Chuyên cần) → nhiệm vụ category ky_nang
    assert.equal(report.suggestedTask.category, 'ky_nang');
    assert.match(report.recommendation, /Tự lập \(100%\)/);
    assert.equal(report.isTaskApplied, false);
  });

  it('báo cáo tháng trước: không có tháng 7 để so → delta null', async () => {
    const r = await call('GET', `/api/reports/ai-skill?childId=${kid}&month=2026-08`);
    assert.equal(axis(r.body.report, 'tu_lap').score, 69); // nhiệm vụ khac tính vào tự lập
    assert.equal(axis(r.body.report, 'chuyen_can').activities, 10); // 4 ngày có nhiệm vụ + 6 ngày chăm pet
    assert.equal(axis(r.body.report, 'chuyen_can').score, 32);
    assert.ok(r.body.report.axes.every((a: Axis) => a.deltaPercent === null));
  });

  it('áp dụng gợi ý: tạo nhiệm vụ thật cho bé; lần 2 → 409; báo cáo lạ → 404', async () => {
    const { report } = (await call('GET', `/api/reports/ai-skill?childId=${kid}`)).body;
    const r = await call('POST', '/api/reports/apply-ai-task', { childId: kid, reportId: report.reportId });
    assert.equal(r.status, 201);
    assert.equal(r.body.report.isTaskApplied, true);

    const mission = await Mission.findById(r.body.mission.id).lean();
    assert.equal(mission?.title, report.suggestedTask.title);
    assert.equal(mission?.category, 'ky_nang');
    assert.equal(mission?.status, 'todo');
    assert.equal(String(mission?.child_id), kid);

    const again = await call('POST', '/api/reports/apply-ai-task', { childId: kid, reportId: report.reportId });
    assert.equal(again.status, 409);
    assert.equal(again.body.error.code, 'TASK_ALREADY_APPLIED');

    const missing = await call('POST', '/api/reports/apply-ai-task', { childId: kid, reportId: String(new mongoose.Types.ObjectId()) });
    assert.equal(missing.status, 404);
    assert.equal((await call('POST', '/api/reports/apply-ai-task', { childId: kid })).status, 400);
  });

  it('đã áp dụng thì xem lại vẫn giữ trạng thái và nhiệm vụ gợi ý cũ', async () => {
    await approvedMissions('hoc_tap', 6, '2026-09-06'); // trí tuệ tăng → dữ liệu đổi
    const r = await call('GET', `/api/reports/ai-skill?childId=${kid}`);
    assert.equal(r.body.report.isTaskApplied, true);
    assert.equal(r.body.report.suggestedTask.category, 'ky_nang');
    assert.equal(axis(r.body.report, 'tri_tue').score, 100);
  });
});
