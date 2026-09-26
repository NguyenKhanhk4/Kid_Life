// Business logic cho Reward module
import mongoose from 'mongoose';
import Reward, { IReward } from './reward.model';
import Redemption, { IRedemption } from './redemption.model';

export interface CreateRewardPayload {
  parent_id: string;
  title: string;
  cost_xp: number;
  category: string;
  icon?: string;
}

export interface UpdateRewardPayload {
  title?: string;
  cost_xp?: number;
  category?: string;
  icon?: string;
  active?: boolean;
}

export async function getRewardsByParentId(parentId: string) {
  if (!mongoose.Types.ObjectId.isValid(parentId)) {
    throw new Error('parent_id không hợp lệ');
  }

  const rewards = await Reward.find({ parent_id: parentId })
    .sort({ created_at: -1 })
    .lean();

  return rewards;
}

export async function createReward(payload: CreateRewardPayload) {
  if (!mongoose.Types.ObjectId.isValid(payload.parent_id)) {
    throw new Error('parent_id không hợp lệ');
  }

  const reward = await Reward.create({
    parent_id: payload.parent_id,
    title: payload.title,
    cost_xp: payload.cost_xp,
    category: payload.category,
    icon: payload.icon || '',
    active: true,
  });

  return reward.toObject();
}

export async function updateReward(id: string, payload: UpdateRewardPayload) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Reward ID không hợp lệ');
  }

  const updated = await Reward.findByIdAndUpdate(
    id,
    { ...payload, updated_at: new Date() },
    { new: true }
  ).lean();

  if (!updated) {
    throw new Error('Không tìm thấy phần thưởng');
  }

  return updated;
}

export async function createRedemption(payload: { reward_id: string; child_id: string }) {
  if (!mongoose.Types.ObjectId.isValid(payload.reward_id)) {
    throw new Error('reward_id không hợp lệ');
  }
  if (!mongoose.Types.ObjectId.isValid(payload.child_id)) {
    throw new Error('child_id không hợp lệ');
  }

  const reward = await Reward.findById(payload.reward_id);
  if (!reward) {
    throw new Error('Không tìm thấy phần thưởng');
  }
  if (reward.active === false) {
    throw new Error('Phần thưởng này hiện không khả dụng');
  }

  const existingPending = await Redemption.findOne({
    reward_id: payload.reward_id,
    child_id: payload.child_id,
    status: 'pending',
  });

  if (existingPending) {
    throw new Error('Bé đã gửi yêu cầu đổi quà này, vui lòng chờ phụ huynh duyệt');
  }

  const redemption = await Redemption.create({
    reward_id: payload.reward_id,
    child_id: payload.child_id,
    status: 'pending',
  });

  return redemption.toObject();
}

export async function approveRedemption(id: string, status: 'approved' | 'rejected') {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Redemption ID không hợp lệ');
  }

  const redemption = await Redemption.findById(id);
  if (!redemption) {
    throw new Error('Không tìm thấy yêu cầu đổi quà');
  }

  if (redemption.status !== 'pending') {
    throw new Error('Yêu cầu này đã được xử lý rồi');
  }

  const updated = await Redemption.findByIdAndUpdate(
    id,
    { status, reviewed_at: new Date() },
    { new: true }
  ).lean();

  return updated;
}

export async function getRedemptions(query: { child_id?: string; parent_id?: string; status?: string }) {
  const filter: Record<string, unknown> = {};

  if (query.child_id && mongoose.Types.ObjectId.isValid(query.child_id)) {
    filter.child_id = query.child_id;
  }

  if (query.status) {
    filter.status = query.status;
  }

  const redemptions = await Redemption.find(filter)
    .populate('reward_id')
    .sort({ requested_at: -1 })
    .lean();

  if (query.parent_id) {
    return redemptions.filter((item) => {
      const reward = item.reward_id as unknown as IReward | null;
      return reward && reward.parent_id && reward.parent_id.toString() === query.parent_id;
    });
  }

  return redemptions;
}
