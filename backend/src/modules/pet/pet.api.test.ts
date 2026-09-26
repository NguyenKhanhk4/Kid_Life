import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import { after, before, describe, it } from 'node:test';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { createApp } from '../../app';
import Child from '../children/children.model';
import User from '../auth/user.model';
import Wallet from '../wallets/wallet.model';
import WalletTransaction from '../wallets/wallet-transaction.model';
import { InMemoryChildXpService, type ChildXpService } from './pet.xp';
import { PetModel } from './pet.model';

/**
 * Test API thật với MongoDB (database riêng kidlife_test, xoá sạch sau khi chạy).
 * Cần MongoDB chạy ở MONGODB_TEST_URI (mặc định mongodb://127.0.0.1:27017/kidlife_test).
 */
const MONGO = process.env.MONGODB_TEST_URI ?? 'mongodb://127.0.0.1:27017/kidlife_test';
process.env.JWT_SECRET ??= 'test_secret';

let clock = new Date('2026-03-01T02:00:00Z'); // 9h sáng giờ VN
const servers: Server[] = [];

let parentToken = '';
let strangerToken = '';
let kid1 = '';
let kid2 = '';

function startApp(xpService?: ChildXpService) {
  const { app, registerErrorHandlers } = createApp({ xpService, now: () => clock });
  registerErrorHandlers();
  const server = app.listen(0);
  servers.push(server);
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

  return async (method: string, path: string, body?: unknown, token = parentToken) => {
    const headers: Record<string, string> = {};
    if (body) headers['Content-Type'] = 'application/json';
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(base + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
    const text = await res.text();
    return { status: res.status, body: text ? JSON.parse(text) : null };
  };
}

let call: ReturnType<typeof startApp>;

describe('API /api/pet', () => {
  before(async () => {
    await mongoose.connect(MONGO, { serverSelectionTimeoutMS: 3000 });
    await mongoose.connection.dropDatabase();
    await PetModel.syncIndexes();
    await Wallet.syncIndexes();

    const parent = await User.create({ email: 'p@test.vn', passwordHash: 'x', fullName: 'Phụ huynh' });
    const stranger = await User.create({ email: 's@test.vn', passwordHash: 'x', fullName: 'Người lạ' });
    const secret = process.env.JWT_SECRET as string;
    parentToken = jwt.sign({ id: String(parent._id), role: 'parent' }, secret);
    strangerToken = jwt.sign({ id: String(stranger._id), role: 'parent' }, secret);

    kid1 = String((await Child.create({ parentId: parent._id, name: 'Bé 1' }))._id);
    kid2 = String((await Child.create({ parentId: parent._id, name: 'Bé 2' }))._id);
    // XP thật trong ví: bé 1 chỉ có 25 XP (đủ 2 lần ăn), bé 2 có 1000 XP
    await Wallet.create({ child_id: kid1, total_xp: 25 });
    await Wallet.create({ child_id: kid2, total_xp: 1000 });

    call = startApp(); // mặc định dùng ví thật (WalletXpService)
  });

  after(async () => {
    servers.forEach((s) => s.close());
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it('không có token → 401; sai childId → 400; bé của người khác → 403', async () => {
    assert.equal((await call('GET', `/api/pet?childId=${kid1}`, undefined, '')).status, 401);
    const bad = await call('GET', '/api/pet?childId=kid1');
    assert.equal(bad.status, 400);
    assert.equal(bad.body.error.code, 'CHILD_ID_REQUIRED');
    const other = await call('GET', `/api/pet?childId=${kid1}`, undefined, strangerToken);
    assert.equal(other.status, 403);
    const missing = await call('GET', `/api/pet?childId=${new mongoose.Types.ObjectId()}`);
    assert.equal(missing.status, 404);
  });

  it('config lấy từ backend', async () => {
    const r = await call('GET', '/api/pet/config');
    assert.equal(r.status, 200);
    assert.equal(r.body.config.feedXpCost, 10);
    assert.ok(r.body.config.speciesIds.includes('cat'));
  });

  it('bé chưa có pet → pet: null kèm số XP thật trong ví', async () => {
    assert.deepEqual((await call('GET', `/api/pet?childId=${kid1}`)).body, { pet: null, xpBalance: 25 });
  });

  it('chọn loài: sai loài 400, tạo 201, tạo lần 2 → 409', async () => {
    assert.equal((await call('POST', '/api/pet', { childId: kid1, speciesId: 'tiger' })).body.error.code, 'INVALID_SPECIES');
    const created = await call('POST', '/api/pet', { childId: kid1, speciesId: 'cat' });
    assert.equal(created.status, 201);
    assert.equal(created.body.pet.stage, 1);
    assert.equal(created.body.pet.expToNextStage, 60);
    assert.equal(created.body.pet.feedsLeftToday, 3);
    assert.equal((await call('POST', '/api/pet', { childId: kid1, speciesId: 'dog' })).status, 409);
  });

  it('cho ăn: trừ XP trong ví + ghi giao dịch; hết XP → 400 NOT_ENOUGH_XP', async () => {
    const r1 = await call('POST', '/api/pet/feed', { childId: kid1 });
    assert.equal(r1.status, 200);
    assert.equal(r1.body.result.xpSpent, 10);
    assert.equal(r1.body.result.xpBalance, 15);
    assert.equal(r1.body.pet.exp, 20);
    assert.equal(r1.body.pet.mood, 'excited');

    const r2 = await call('POST', '/api/pet/feed', { childId: kid1 });
    assert.equal(r2.body.result.xpBalance, 5);
    const poor = await call('POST', '/api/pet/feed', { childId: kid1 });
    assert.equal(poor.status, 400);
    assert.equal(poor.body.error.code, 'NOT_ENOUGH_XP');
    assert.equal((await call('GET', `/api/pet?childId=${kid1}`)).body.pet.feedsLeftToday, 1);

    assert.equal((await Wallet.findOne({ child_id: kid1 }).lean())?.total_xp, 5);
    const txs = await WalletTransaction.find({ child_id: kid1, type: 'pet_feed' }).lean();
    assert.equal(txs.length, 2);
    assert.equal(txs[0].amount, -10);
    assert.equal((await Child.findById(kid1).lean())?.streak, 1);
  });

  it('lên stage 2 ở lần thứ 3, lần 4 bị chặn, hôm sau cho ăn lại được', async () => {
    await call('POST', '/api/pet', { childId: kid2, speciesId: 'dragon' });
    await call('POST', '/api/pet/feed', { childId: kid2 });
    await call('POST', '/api/pet/feed', { childId: kid2 });
    const third = await call('POST', '/api/pet/feed', { childId: kid2 });
    assert.equal(third.body.result.evolved, true);
    assert.equal(third.body.pet.stage, 2);
    assert.equal(third.body.pet.expToNextStage, 420);
    assert.equal(third.body.pet.feedsLeftToday, 0);

    const fourth = await call('POST', '/api/pet/feed', { childId: kid2 });
    assert.equal(fourth.status, 429);
    assert.equal(fourth.body.error.code, 'PET_FULL');

    clock = new Date(clock.getTime() + 24 * 3_600_000); // sang hôm sau
    const nextDay = await call('POST', '/api/pet/feed', { childId: kid2 });
    assert.equal(nextDay.status, 200);
    assert.equal(nextDay.body.pet.streakDays, 2);
    assert.equal(nextDay.body.pet.feedsLeftToday, 2);
    assert.equal(nextDay.body.result.xpBalance, 1000 - 4 * 10);
  });

  it('XP có thể inject (InMemoryChildXpService) cho test không cần ví', async () => {
    const mem = startApp(new InMemoryChildXpService(0));
    const r = await mem('POST', '/api/pet/feed', { childId: kid2 });
    assert.equal(r.status, 400);
    assert.equal(r.body.error.code, 'NOT_ENOUGH_XP');
  });

  it('không còn API debug/xoá pet', async () => {
    assert.equal((await call('PATCH', '/api/pet/debug', { childId: kid2, stage: 4 })).status, 404);
    assert.equal((await call('DELETE', `/api/pet?childId=${kid1}`)).status, 404);
  });

  it('route lạ → 404 JSON', async () => {
    const r = await call('GET', '/api/khong-co');
    assert.equal(r.status, 404);
    assert.equal(r.body.error.code, 'NOT_FOUND');
  });
});
