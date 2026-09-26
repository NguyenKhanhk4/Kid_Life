import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import { after, before, describe, it } from 'node:test';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { createApp } from '../../../app';
import Child from '../../children/children.model';
import User from '../../auth/user.model';
import Wallet from '../../wallets/wallet.model';
import WalletTransaction from '../../wallets/wallet-transaction.model';
import { ChildPetAccessory, PetAccessory } from './pet-accessory.model';

/** DB riêng để chạy song song với pet.api.test.ts (node --test chạy mỗi file 1 process). */
const MONGO = process.env.MONGODB_TEST_URI_ACCESSORIES ?? 'mongodb://127.0.0.1:27017/kidlife_test_accessories';
process.env.JWT_SECRET ??= 'test_secret';

let server: Server;
let base = '';
let parentToken = '';
let strangerToken = '';
let adminToken = '';
let kid = '';
const acc: Record<string, string> = {};

async function call(method: string, path: string, body?: unknown, token = parentToken) {
  const headers: Record<string, string> = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(base + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

type Item = { id: string; isOwned: boolean; isEquipped: boolean };
const find = (list: Item[], id: string) => list.find((a) => a.id === id) as Item;

describe('API /api/pet/accessories', () => {
  before(async () => {
    await mongoose.connect(MONGO, { serverSelectionTimeoutMS: 3000 });
    await mongoose.connection.dropDatabase();
    await Promise.all([PetAccessory.syncIndexes(), ChildPetAccessory.syncIndexes(), Wallet.syncIndexes()]);

    const secret = process.env.JWT_SECRET as string;
    const parent = await User.create({ email: 'p@test.vn', passwordHash: 'x', fullName: 'Phụ huynh' });
    const stranger = await User.create({ email: 's@test.vn', passwordHash: 'x', fullName: 'Người lạ' });
    const admin = await User.create({ email: 'a@test.vn', passwordHash: 'x', fullName: 'Admin', role: 'admin' });
    parentToken = jwt.sign({ id: String(parent._id), role: 'parent' }, secret);
    strangerToken = jwt.sign({ id: String(stranger._id), role: 'parent' }, secret);
    adminToken = jwt.sign({ id: String(admin._id), role: 'admin' }, secret);

    kid = String((await Child.create({ parentId: parent._id, name: 'Bé' }))._id);
    await Wallet.create({ child_id: kid, total_xp: 150 });

    const { app, registerErrorHandlers } = createApp();
    registerErrorHandlers();
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  after(async () => {
    server.close();
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it('admin tạo phụ kiện; phụ huynh không gọi được API admin; dữ liệu sai → 400', async () => {
    const items = [
      ['magicHat', 'Mũ ảo thuật', '🎩', 'hat', 60],
      ['cap', 'Mũ lưỡi trai', '🧢', 'hat', 40],
      ['sunglasses', 'Kính râm', '🕶️', 'glasses', 50],
      ['crown', 'Vương miện', '👑', 'crown', 500],
    ] as const;
    for (const [key, name, icon, category, priceXP] of items) {
      const r = await call('POST', '/api/admin/master-data/accessories', { name, icon, category, priceXP }, adminToken);
      assert.equal(r.status, 201);
      assert.equal(r.body.success, true);
      acc[key] = r.body.data._id;
    }
    assert.equal((await call('GET', '/api/admin/master-data/accessories', undefined, parentToken)).status, 403);
    const bad = await call('POST', '/api/admin/master-data/accessories', { name: 'X', icon: '?', category: 'shoes', priceXP: 1 }, adminToken);
    assert.equal(bad.status, 400);
    assert.equal(bad.body.error.code, 'VALIDATION_ERROR');
  });

  it('bé xem tủ đồ: chưa sở hữu gì, kèm XP thật; bé nhà khác → 403', async () => {
    const r = await call('GET', `/api/pet/accessories?childId=${kid}`);
    assert.equal(r.status, 200);
    assert.equal(r.body.accessories.length, 4);
    assert.equal(r.body.xpBalance, 150);
    assert.ok(r.body.accessories.every((a: { isOwned: boolean }) => !a.isOwned));
    assert.equal((await call('GET', `/api/pet/accessories?childId=${kid}`, undefined, strangerToken)).status, 403);
  });

  it('mua: trừ XP + ghi giao dịch; mua trùng → 409; thiếu XP → 400; chưa mua mà mặc → 403', async () => {
    const r = await call('POST', '/api/pet/accessories/buy', { childId: kid, accessoryId: acc.magicHat });
    assert.equal(r.status, 200);
    assert.equal(r.body.xpBalance, 90);
    assert.equal(find(r.body.accessories, acc.magicHat).isOwned, true);
    assert.equal((await WalletTransaction.countDocuments({ child_id: kid, type: 'pet_accessory_buy' })), 1);

    const dup = await call('POST', '/api/pet/accessories/buy', { childId: kid, accessoryId: acc.magicHat });
    assert.equal(dup.status, 409);
    assert.equal(dup.body.error.code, 'ALREADY_OWNED');

    const poor = await call('POST', '/api/pet/accessories/buy', { childId: kid, accessoryId: acc.crown });
    assert.equal(poor.status, 400);
    assert.equal(poor.body.error.code, 'NOT_ENOUGH_XP');
    assert.equal((await Wallet.findOne({ child_id: kid }).lean())?.total_xp, 90);

    const notOwned = await call('POST', '/api/pet/accessories/equip', { childId: kid, accessoryId: acc.sunglasses });
    assert.equal(notOwned.status, 403);

    const missing = await call('POST', '/api/pet/accessories/buy', { childId: kid });
    assert.equal(missing.status, 400);
  });

  it('mặc: mỗi category chỉ 1 món đang mặc; khác category thì mặc cùng lúc được', async () => {
    await call('POST', '/api/pet/accessories/buy', { childId: kid, accessoryId: acc.cap });
    await call('POST', '/api/pet/accessories/buy', { childId: kid, accessoryId: acc.sunglasses }); // hết 90 → 0 XP

    await call('POST', '/api/pet/accessories/equip', { childId: kid, accessoryId: acc.magicHat });
    await call('POST', '/api/pet/accessories/equip', { childId: kid, accessoryId: acc.sunglasses });
    const r = await call('POST', '/api/pet/accessories/equip', { childId: kid, accessoryId: acc.cap });
    assert.equal(r.status, 200);
    assert.equal(find(r.body.accessories, acc.cap).isEquipped, true);
    assert.equal(find(r.body.accessories, acc.magicHat).isEquipped, false);
    assert.equal(find(r.body.accessories, acc.sunglasses).isEquipped, true);
    assert.equal(await ChildPetAccessory.countDocuments({ child_id: kid, category: 'hat', is_equipped: true }), 1);
  });

  it('mặc song song 2 mũ → DB vẫn chỉ còn 1 mũ đang mặc', async () => {
    await Promise.all([
      call('POST', '/api/pet/accessories/equip', { childId: kid, accessoryId: acc.magicHat }),
      call('POST', '/api/pet/accessories/equip', { childId: kid, accessoryId: acc.cap }),
    ]);
    assert.equal(await ChildPetAccessory.countDocuments({ child_id: kid, category: 'hat', is_equipped: true }), 1);
  });

  it('tháo phụ kiện', async () => {
    const r = await call('POST', '/api/pet/accessories/unequip', { childId: kid, accessoryId: acc.sunglasses });
    assert.equal(r.status, 200);
    assert.equal(find(r.body.accessories, acc.sunglasses).isEquipped, false);
  });

  it('admin ngừng bán: ẩn khỏi cửa hàng nhưng bé đã mua vẫn còn trong tủ', async () => {
    assert.equal((await call('DELETE', `/api/admin/master-data/accessories/${acc.sunglasses}`, undefined, adminToken)).status, 200);
    assert.equal((await call('DELETE', `/api/admin/master-data/accessories/${acc.crown}`, undefined, adminToken)).status, 200);
    const admin = await call('GET', '/api/admin/master-data/accessories', undefined, adminToken);
    assert.equal(admin.body.data.length, 2);
    const wardrobe = await call('GET', `/api/pet/accessories?childId=${kid}`);
    const ids = wardrobe.body.accessories.map((a: { id: string }) => a.id);
    assert.ok(ids.includes(acc.sunglasses)); // đã mua → vẫn thấy
    assert.ok(!ids.includes(acc.crown)); // chưa mua + ngừng bán → ẩn
  });
});
