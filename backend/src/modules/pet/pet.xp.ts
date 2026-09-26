import mongoose from 'mongoose';
import Wallet from '../wallets/wallet.model';
import WalletTransaction from '../wallets/wallet-transaction.model';

export type PetXpReason =
  | 'pet_feed'
  | 'pet_feed_refund'
  | 'pet_streak_bonus'
  | 'pet_accessory_buy'
  | 'pet_accessory_refund';

const REASON_LABEL: Record<PetXpReason, string> = {
  pet_feed: 'Cho thú cưng ăn',
  pet_feed_refund: 'Hoàn XP cho thú cưng ăn (lỗi lưu dữ liệu)',
  pet_streak_bonus: 'Thưởng chuỗi ngày chăm thú cưng',
  pet_accessory_buy: 'Mua phụ kiện cho thú cưng',
  pet_accessory_refund: 'Hoàn XP mua phụ kiện (lỗi lưu dữ liệu)',
};

/**
 * XP của bé nằm trong ví (module wallets). Pet chỉ cần 3 thao tác nên phụ thuộc qua interface này
 * — test có thể truyền InMemoryChildXpService thay cho ví thật.
 */
export interface ChildXpService {
  getBalance(childId: string): Promise<number>;
  /** Trừ XP; trả false nếu không đủ (không trừ gì) */
  spend(childId: string, amount: number, reason: PetXpReason, referenceId?: string): Promise<boolean>;
  add(childId: string, amount: number, reason: PetXpReason, referenceId?: string): Promise<void>;
}

/** Cùng ngưỡng level với approvals/penalties/virtual-bank. */
function calculateLevel(totalXp: number): number {
  if (totalXp >= 2000) return 5;
  if (totalXp >= 1000) return 4;
  if (totalXp >= 500) return 3;
  if (totalXp >= 200) return 2;
  return 1;
}

/** XP thật: đọc/ghi collection wallets + ghi lịch sử wallettransactions. */
export class WalletXpService implements ChildXpService {
  async getBalance(childId: string) {
    const wallet = await Wallet.findOne({ child_id: childId }).select('total_xp').lean();
    return wallet?.total_xp ?? 0;
  }

  async spend(childId: string, amount: number, reason: PetXpReason, referenceId?: string) {
    // Trừ có điều kiện trong 1 lệnh → 2 request song song không thể làm ví âm
    const wallet = await Wallet.findOneAndUpdate(
      { child_id: childId, total_xp: { $gte: amount } },
      { $inc: { total_xp: -amount }, $set: { updated_at: new Date() } },
      { new: true },
    );
    if (!wallet) return false;
    await this.afterChange(wallet, childId, -amount, reason, referenceId);
    return true;
  }

  async add(childId: string, amount: number, reason: PetXpReason, referenceId?: string) {
    const wallet = await Wallet.findOneAndUpdate(
      { child_id: childId },
      { $inc: { total_xp: amount }, $set: { updated_at: new Date() }, $setOnInsert: { current_level: 1 } },
      { new: true, upsert: true },
    );
    await this.afterChange(wallet, childId, amount, reason, referenceId);
  }

  private async afterChange(
    wallet: InstanceType<typeof Wallet>,
    childId: string,
    amount: number,
    reason: PetXpReason,
    referenceId?: string,
  ) {
    const level = calculateLevel(wallet.total_xp);
    if (level !== wallet.current_level) await Wallet.updateOne({ _id: wallet._id }, { current_level: level });
    await WalletTransaction.create({
      wallet_id: wallet._id,
      child_id: childId,
      amount,
      type: reason,
      reference_id: referenceId ?? new mongoose.Types.ObjectId(),
      description: REASON_LABEL[reason],
    });
  }
}

/** Chỉ dùng cho test: XP trong bộ nhớ, mỗi bé bắt đầu với startingBalance. */
export class InMemoryChildXpService implements ChildXpService {
  private balances = new Map<string, number>();

  constructor(private readonly startingBalance = 0) {}

  async getBalance(childId: string) {
    return this.balances.get(childId) ?? this.startingBalance;
  }

  async spend(childId: string, amount: number) {
    const balance = await this.getBalance(childId);
    if (balance < amount) return false;
    this.balances.set(childId, balance - amount);
    return true;
  }

  async add(childId: string, amount: number) {
    this.balances.set(childId, (await this.getBalance(childId)) + amount);
  }
}
