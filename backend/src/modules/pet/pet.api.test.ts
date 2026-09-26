import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import { after, before, describe, it } from 'node:test';
import mongoose from 'mongoose';
import { createApp } from '../../app';
import { InMemoryChildXpService } from './pet.xp';
import { PetModel } from './pet.model';

/**
 * Test API thật với MongoDB (database riêng kidlife_test, xoá sạch sau khi chạy).
 * Cần MongoDB chạy ở MONGODB_TEST_URI (mặc định mongodb://127.0.0.1:27017/kidlife_test).
 */
const MONGO = process.env.MONGODB_TEST_URI ?? 'mongodb://127.0.0.1:27017/kidlife_test';

let clock = new Date('2026-03-01T02:00:00Z'); // 9h sáng giờ VN
let server: Server;
let base = '';

async function call(method: string, path: string, body?: unknown) {
  const res = await fetch(base + path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

describe('API /api/pet', () => {
  before(async () => {
    await mongoose.connect(MONGO, { serverSelectionTimeoutMS: 3000 });
    await PetModel.deleteMany({});
    await PetModel.syncIndexes();
    const app = createApp({ xpService: new InMemoryChildXpService(25), now: () => clock });
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  after(async () => {
    server.close();
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it('bé chưa có pet → pet: null; thiếu childId → 400', async () => {
    assert.deepEqual((await call('GET', '/api/pet?childId=kid1')).body, { pet: null });
    const r = await call('GET', '/api/pet');
    assert.equal(r.status, 400);
    assert.equal(r.body.error.code, 'CHILD_ID_REQUIRED');
  });

  it('chọn loài: sai loài 400, tạo 201, tạo lần 2 → 409', async () => {
    assert.equal((await call('POST', '/api/pet', { childId: 'kid1', speciesId: 'tiger' })).body.error.code, 'INVALID_SPECIES');
    const created = await call('POST', '/api/pet', { childId: 'kid1', speciesId: 'cat' });
    assert.equal(created.status, 201);
    assert.equal(created.body.pet.stage, 1);
    assert.equal(created.body.pet.expToNextStage, 60);
    assert.equal(created.body.pet.feedsLeftToday, 3);
    assert.equal((await call('POST', '/api/pet', { childId: 'kid1', speciesId: 'dog' })).status, 409);
  });

  it('cho ăn: trừ XP, 3 lần đầu → lên stage 2; lần 4 trong ngày → 429 PET_FULL', async () => {
    const r1 = await call('POST', '/api/pet/feed', { childId: 'kid1' });
    assert.equal(r1.status, 200);
    assert.equal(r1.body.result.xpSpent, 10);
    assert.equal(r1.body.result.xpBalance, 15);
    assert.equal(r1.body.pet.exp, 20);
    assert.equal(r1.body.pet.mood, 'excited');

    const r2 = await call('POST', '/api/pet/feed', { childId: 'kid1' });
    assert.equal(r2.body.result.xpBalance, 5);
    // hết XP (còn 5 < 10) → 400, pet không đổi
    const poor = await call('POST', '/api/pet/feed', { childId: 'kid1' });
    assert.equal(poor.status, 400);
    assert.equal(poor.body.error.code, 'NOT_ENOUGH_XP');
    assert.equal((await call('GET', '/api/pet?childId=kid1')).body.pet.feedsLeftToday, 1);
  });

  it('bé khác đủ XP: lên stage 2 ở lần thứ 3, lần 4 bị chặn, hôm sau cho ăn lại được', async () => {
    const app = createApp({ xpService: new InMemoryChildXpService(1000), now: () => clock });
    const s2 = app.listen(0);
    const b2 = `http://127.0.0.1:${(s2.address() as AddressInfo).port}`;
    const post = async (path: string, body: unknown) =>
      fetch(b2 + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(
        async (r) => ({ status: r.status, body: await r.json() }),
      );
    try {
      await post('/api/pet', { childId: 'kid2', speciesId: 'dragon' });
      await post('/api/pet/feed', { childId: 'kid2' });
      await post('/api/pet/feed', { childId: 'kid2' });
      const third = await post('/api/pet/feed', { childId: 'kid2' });
      assert.equal(third.body.result.evolved, true);
      assert.equal(third.body.pet.stage, 2);
      assert.equal(third.body.pet.expToNextStage, 420);
      assert.equal(third.body.pet.feedsLeftToday, 0);

      const fourth = await post('/api/pet/feed', { childId: 'kid2' });
      assert.equal(fourth.status, 429);
      assert.equal(fourth.body.error.code, 'PET_FULL');

      clock = new Date(clock.getTime() + 24 * 3_600_000); // sang hôm sau
      const nextDay = await post('/api/pet/feed', { childId: 'kid2' });
      assert.equal(nextDay.status, 200);
      assert.equal(nextDay.body.pet.streakDays, 2);
      assert.equal(nextDay.body.pet.feedsLeftToday, 2);
    } finally {
      s2.close();
    }
  });

  it('xoá pet (dev) → 204, sau đó GET trả null', async () => {
    assert.equal((await call('DELETE', '/api/pet?childId=kid1')).status, 204);
    assert.deepEqual((await call('GET', '/api/pet?childId=kid1')).body, { pet: null });
    assert.equal((await call('DELETE', '/api/pet?childId=kid1')).status, 404);
  });

  it('route lạ → 404 JSON', async () => {
    const r = await call('GET', '/api/khong-co');
    assert.equal(r.status, 404);
    assert.equal(r.body.error.code, 'NOT_FOUND');
  });
});
