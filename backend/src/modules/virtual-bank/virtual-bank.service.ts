// Business logic service cho VirtualBank module
import mongoose from 'mongoose';
import BankAccount, { IBankAccount } from './bank-account.model';
import BankTransaction from './bank-transaction.model';
import Wallet from '../wallets/wallet.model';
import WalletTransaction from '../wallets/wallet-transaction.model';

function calculateLevel(total_xp: number): number {
  if (total_xp >= 2000) return 5;
  if (total_xp >= 1000) return 4;
  if (total_xp >= 500) return 3;
  if (total_xp >= 200) return 2;
  return 1;
}

export async function getBankAccount(childId: string) {
  // Bước 1: Validate childId là ObjectId hợp lệ
  if (!mongoose.Types.ObjectId.isValid(childId)) {
    throw new Error('childId không hợp lệ');
  }

  // Bước 2: Tìm BankAccount
  const account = await BankAccount.findOne({ child_id: childId }).lean();
  if (!account) {
    return {
      child_id: childId,
      balance: 0,
      total_interest_earned: 0,
      last_interest_at: null,
      transactions: [],
    };
  }

  // Bước 3: Lấy 20 giao dịch gần nhất
  const transactions = await BankTransaction.find({ child_id: childId })
    .sort({ created_at: -1 })
    .limit(20)
    .lean();

  return { ...account, transactions };
}

export async function deposit(payload: { child_id: string; amount: number }) {
  // Bước 1: Validate child_id là ObjectId hợp lệ
  if (!mongoose.Types.ObjectId.isValid(payload.child_id)) {
    throw new Error('child_id không hợp lệ');
  }

  // Bước 2: Validate amount > 0 và là số nguyên
  const amount = Math.floor(payload.amount);
  if (amount < 1) {
    throw new Error('Số XP gửi phải lớn hơn 0');
  }

  // Bước 3: Tìm wallet của bé
  const wallet = await Wallet.findOne({ child_id: payload.child_id });
  if (!wallet) {
    throw new Error('Không tìm thấy ví của bé');
  }
  if (wallet.total_xp < amount) {
    throw new Error('Ví không đủ XP để gửi');
  }

  // Bước 4: Tìm hoặc tạo bank account
  let account = await BankAccount.findOne({ child_id: payload.child_id });
  if (!account) {
    account = await BankAccount.create({
      child_id: payload.child_id,
      balance: 0,
      total_interest_earned: 0,
    });
  }

  // Bước 5: Lưu balance_before
  const balance_before = account.balance;

  // Bước 6: Dùng Promise.all để cập nhật đồng thời
  const [updatedWallet, updatedAccount] = await Promise.all([
    Wallet.findByIdAndUpdate(
      wallet._id,
      {
        total_xp: wallet.total_xp - amount,
        current_level: calculateLevel(wallet.total_xp - amount),
        updated_at: new Date(),
      },
      { new: true }
    ).lean(),
    BankAccount.findByIdAndUpdate(
      account._id,
      {
        balance: account.balance + amount,
        updated_at: new Date(),
      },
      { new: true }
    ).lean(),
  ]);

  // Bước 7: Tạo WalletTransaction (trừ XP từ wallet)
  await WalletTransaction.create({
    wallet_id: wallet._id,
    child_id: payload.child_id,
    amount: -amount,
    type: 'mission_reward',
    reference_id: account._id,
    description: `Gửi ${amount} XP vào ngân hàng`,
  });

  // Bước 8: Tạo BankTransaction
  await BankTransaction.create({
    account_id: account._id,
    child_id: payload.child_id,
    type: 'deposit',
    amount,
    balance_before,
    balance_after: account.balance + amount,
    description: `Gửi ${amount} XP vào ngân hàng`,
  });

  return {
    updated_wallet: updatedWallet,
    updated_account: updatedAccount,
    amount_deposited: amount,
  };
}

export async function withdraw(payload: { child_id: string; amount: number }) {
  // Bước 1: Validate child_id là ObjectId hợp lệ
  if (!mongoose.Types.ObjectId.isValid(payload.child_id)) {
    throw new Error('child_id không hợp lệ');
  }

  // Bước 2: Validate amount > 0 và là số nguyên
  const amount = Math.floor(payload.amount);
  if (amount < 1) {
    throw new Error('Số XP rút phải lớn hơn 0');
  }

  // Bước 3: Tìm bank account
  const account = await BankAccount.findOne({ child_id: payload.child_id });
  if (!account) {
    throw new Error('Không tìm thấy tài khoản ngân hàng');
  }
  if (account.balance < amount) {
    throw new Error('Số dư ngân hàng không đủ');
  }

  // Bước 4: Tìm hoặc tạo wallet
  let wallet = await Wallet.findOne({ child_id: payload.child_id });
  if (!wallet) {
    wallet = await Wallet.create({
      child_id: payload.child_id,
      total_xp: 0,
      current_level: 1,
    });
  }

  // Bước 5: Lưu balance_before & tính toán level mới cho wallet
  const balance_before = account.balance;
  const new_wallet_xp = wallet.total_xp + amount;
  const new_level = calculateLevel(new_wallet_xp);

  // Bước 6: Dùng Promise.all để cập nhật đồng thời
  const [updatedAccount, updatedWallet] = await Promise.all([
    BankAccount.findByIdAndUpdate(
      account._id,
      {
        balance: account.balance - amount,
        updated_at: new Date(),
      },
      { new: true }
    ).lean(),
    Wallet.findByIdAndUpdate(
      wallet._id,
      {
        total_xp: new_wallet_xp,
        current_level: new_level,
        updated_at: new Date(),
      },
      { new: true }
    ).lean(),
  ]);

  // Bước 7: Tạo WalletTransaction (cộng XP vào wallet)
  await WalletTransaction.create({
    wallet_id: wallet._id,
    child_id: payload.child_id,
    amount: +amount,
    type: 'mission_reward',
    reference_id: account._id,
    description: `Rút ${amount} XP từ ngân hàng`,
  });

  // Bước 8: Tạo BankTransaction
  await BankTransaction.create({
    account_id: account._id,
    child_id: payload.child_id,
    type: 'withdrawal',
    amount,
    balance_before,
    balance_after: account.balance - amount,
    description: `Rút ${amount} XP từ ngân hàng`,
  });

  return {
    updated_wallet: updatedWallet,
    updated_account: updatedAccount,
    amount_withdrawn: amount,
  };
}

export async function processInterest(): Promise<{
  accounts_processed: number;
  total_interest_paid: number;
}> {
  // Bước 1: Tìm tất cả BankAccount có balance > 0
  const accounts = await BankAccount.find({ balance: { $gt: 0 } }).lean();

  // Bước 2: Khai báo biến đếm
  let accounts_processed = 0;
  let total_interest_paid = 0;

  // Bước 3: Xử lý TUẦN TỰ từng account bằng for...of loop
  for (const account of accounts) {
    const interest_amount = Math.floor(account.balance * 0.02);
    if (interest_amount < 1) {
      continue;
    }

    const new_balance = account.balance + interest_amount;

    await BankAccount.findByIdAndUpdate(account._id, {
      balance: new_balance,
      total_interest_earned: account.total_interest_earned + interest_amount,
      last_interest_at: new Date(),
      updated_at: new Date(),
    });

    await BankTransaction.create({
      account_id: account._id,
      child_id: account.child_id,
      type: 'interest',
      amount: interest_amount,
      balance_before: account.balance,
      balance_after: new_balance,
      description: `Lãi suất hàng ngày 2%: +${interest_amount} XP`,
    });

    accounts_processed += 1;
    total_interest_paid += interest_amount;
  }

  // Bước 4: Trả về kết quả
  return { accounts_processed, total_interest_paid };
}
