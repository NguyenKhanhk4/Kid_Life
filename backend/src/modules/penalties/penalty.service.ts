// Business logic service cho Penalty module
import mongoose from 'mongoose';
import Penalty, { IPenalty } from './penalty.model';
import Wallet from '../wallets/wallet.model';
import WalletTransaction from '../wallets/wallet-transaction.model';

export interface CreatePenaltyPayload {
  child_id: string;
  parent_id: string;
  reason: string;
  penalty_xp: number;
}

interface PenaltyFilter {
  child_id?: mongoose.Types.ObjectId | string;
  parent_id?: mongoose.Types.ObjectId | string;
}

function calculateLevel(total_xp: number): number {
  if (total_xp >= 2000) return 5;
  if (total_xp >= 1000) return 4;
  if (total_xp >= 500) return 3;
  if (total_xp >= 200) return 2;
  return 1;
}

export async function createPenalty(payload: CreatePenaltyPayload) {
  // BƯỚC 1 — Validate inputs
  if (!mongoose.Types.ObjectId.isValid(payload.child_id)) {
    throw new Error('child_id không hợp lệ');
  }
  if (!mongoose.Types.ObjectId.isValid(payload.parent_id)) {
    throw new Error('parent_id không hợp lệ');
  }

  // BƯỚC 2 — Tìm hoặc tạo wallet của bé
  let foundWallet = await Wallet.findOne({ child_id: payload.child_id });
  if (!foundWallet) {
    foundWallet = await Wallet.create({
      child_id: payload.child_id,
      total_xp: 0,
      current_level: 1,
    });
  }
  const wallet_balance_before = foundWallet.total_xp;

  // BƯỚC 3 — Tính toán XP bị trừ
  const actual_deducted = Math.min(payload.penalty_xp, wallet_balance_before);
  const new_total_xp = wallet_balance_before - actual_deducted;
  const wallet_balance_after = new_total_xp;
  const new_level = calculateLevel(new_total_xp);

  // BƯỚC 4 — Cập nhật wallet (TRANSACTION-SAFE)
  const penaltyId = new mongoose.Types.ObjectId();

  const [updatedWallet] = await Promise.all([
    Wallet.findByIdAndUpdate(
      foundWallet._id,
      { total_xp: new_total_xp, current_level: new_level, updated_at: new Date() },
      { new: true }
    ).lean(),
    WalletTransaction.create({
      wallet_id: foundWallet._id,
      child_id: payload.child_id,
      amount: -actual_deducted,
      type: 'penalty',
      reference_id: penaltyId,
      description: `Vé phạt: ${payload.reason}`,
    }),
  ]);

  // BƯỚC 5 — Tạo penalty record với penaltyId đã định sẵn
  const penalty = await Penalty.create({
    _id: penaltyId,
    child_id: payload.child_id,
    parent_id: payload.parent_id,
    reason: payload.reason,
    penalty_xp: payload.penalty_xp,
    actual_deducted,
    wallet_balance_before,
    wallet_balance_after,
  });

  // BƯỚC 7 — Trả về kết quả
  return {
    penalty: penalty.toObject(),
    updated_wallet: updatedWallet,
    actual_deducted,
    wallet_balance_before,
    wallet_balance_after,
    level_changed: new_level !== foundWallet.current_level,
  };
}

export async function getPenalties(query: { child_id?: string; parent_id?: string }) {
  // Bước 1: Build filter object rỗng {}
  const filter: PenaltyFilter = {};

  // Bước 2: Nếu có child_id trong query VÀ là ObjectId hợp lệ → thêm child_id vào filter
  if (query.child_id && mongoose.Types.ObjectId.isValid(query.child_id)) {
    filter.child_id = query.child_id;
  }

  // Bước 3: Nếu có parent_id trong query VÀ là ObjectId hợp lệ → thêm parent_id vào filter
  if (query.parent_id && mongoose.Types.ObjectId.isValid(query.parent_id)) {
    filter.parent_id = query.parent_id;
  }

  // Bước 4: Penalty.find(filter).sort({ created_at: -1 }).lean()
  const penalties = await Penalty.find(filter).sort({ created_at: -1 }).lean();
  return penalties;
}
