// Tiện ích quản lý trạng thái Ví điểm, Heo đất, Đổi quà & Duyệt nhiệm vụ (đồng bộ realtime)
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';

const D = MOCK_KIDLIFE_DATA;

const WALLET_KEY = 'kidlife_wallet_data';
const TRANSACTIONS_KEY = 'kidlife_transactions';
const CUSTOM_REWARDS_KEY = 'kidlife_custom_rewards';
const CELEBRATION_KEY = 'kidlife_active_celebration';

export interface WalletData {
  balance: number;
  savingsBalance: number;
  interestRate: number;
  dailyInterest: number;
}

export interface WalletTransactionItem {
  id: string;
  title: string;
  amount: number;
  date: string;
  emoji: string;
  type: 'earn' | 'deposit' | 'withdraw' | 'reward' | 'penalty' | 'interest';
}

export interface CustomRewardItem {
  id: string;
  title: string;
  cost: number;
  detail: string;
  icon: string;
  category?: string;
  createdAt: string;
}

export interface CelebrationNotice {
  id: string;
  taskId: string;
  taskTitle: string;
  rewardXP: number;
  timestamp: number;
}

// 1. Lấy dữ liệu ví điểm
export function getWalletData(): WalletData {
  try {
    const raw = localStorage.getItem(WALLET_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return {
    balance: D.wallet.balance,
    savingsBalance: D.wallet.savingsBalance,
    interestRate: D.wallet.interestRate,
    dailyInterest: D.wallet.dailyInterest,
  };
}

// Lưu dữ liệu ví & phát sự kiện đồng bộ
export function saveWalletData(data: WalletData): void {
  localStorage.setItem(WALLET_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent('kidlife_wallet_update', { detail: data }));
}

// 2. Lấy danh sách giao dịch
export function getTransactions(): WalletTransactionItem[] {
  try {
    const raw = localStorage.getItem(TRANSACTIONS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  // Dữ liệu ban đầu
  const initialList: WalletTransactionItem[] = [
    {
      id: 'tx-init-1',
      title: 'Hoàn thành: Lau bàn ăn',
      amount: 60,
      date: 'Hôm nay, 12:30',
      emoji: '✅',
      type: 'earn',
    },
    {
      id: 'tx-init-2',
      title: 'Lãi suất Heo đất hàng ngày',
      amount: 15,
      date: 'Hôm nay, 08:00',
      emoji: '📈',
      type: 'interest',
    },
    {
      id: 'tx-init-3',
      title: 'Vé phạt: Chơi game quá giờ',
      amount: -30,
      date: 'Hôm qua, 21:00',
      emoji: '🎮',
      type: 'penalty',
    },
    {
      id: 'tx-init-4',
      title: 'Vé phạt: Chưa đánh răng buổi tối',
      amount: -50,
      date: 'Thứ 6, 21:30',
      emoji: '🦷',
      type: 'penalty',
    },
  ];
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(initialList));
  return initialList;
}

export function addTransaction(item: Omit<WalletTransactionItem, 'id' | 'date'> & { date?: string }): void {
  const current = getTransactions();
  const newItem: WalletTransactionItem = {
    id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    date: item.date || 'Vừa xong',
    ...item,
  };
  const updated = [newItem, ...current];
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('kidlife_transactions_update', { detail: updated }));
}

// 3. Nghiệp vụ Heo Đất: Gửi vào
export function depositToPiggy(amount: number): { success: boolean; message: string; data?: WalletData } {
  const num = Math.floor(amount);
  if (num <= 0) return { success: false, message: 'Số điểm gửi phải lớn hơn 0' };

  const wallet = getWalletData();
  if (wallet.balance < num) {
    return { success: false, message: 'Ví không đủ điểm XP để gửi vào heo đất!' };
  }

  const newWallet: WalletData = {
    ...wallet,
    balance: wallet.balance - num,
    savingsBalance: wallet.savingsBalance + num,
  };

  saveWalletData(newWallet);
  addTransaction({
    title: `Gửi vào Heo Đất tiết kiệm 🐷`,
    amount: -num,
    emoji: '🐖',
    type: 'deposit',
  });

  return { success: true, message: `Đã gửi thành công ${num.toLocaleString()} XP vào Heo Đất!`, data: newWallet };
}

// 4. Nghiệp vụ Heo Đất: Rút ra
export function withdrawFromPiggy(amount: number): { success: boolean; message: string; data?: WalletData } {
  const num = Math.floor(amount);
  if (num <= 0) return { success: false, message: 'Số điểm rút phải lớn hơn 0' };

  const wallet = getWalletData();
  if (wallet.savingsBalance < num) {
    return { success: false, message: 'Số dư trong Heo Đất không đủ để rút!' };
  }

  const newWallet: WalletData = {
    ...wallet,
    balance: wallet.balance + num,
    savingsBalance: wallet.savingsBalance - num,
  };

  saveWalletData(newWallet);
  addTransaction({
    title: `Rút từ Heo Đất về Ví điểm 💰`,
    amount: +num,
    emoji: '💵',
    type: 'withdraw',
  });

  return { success: true, message: `Đã rút thành công ${num.toLocaleString()} XP về Ví điểm!`, data: newWallet };
}

// 5. Nghiệp vụ Đổi Quà: Trừ số dư
export function redeemRewardItem(reward: { id: string; title: string; cost: number; icon?: string }): {
  success: boolean;
  message: string;
  data?: WalletData;
} {
  const wallet = getWalletData();
  if (wallet.balance < reward.cost) {
    return { success: false, message: `Bé chưa đủ ${reward.cost.toLocaleString()} XP để đổi món quà này! Hãy làm thêm nhiệm vụ nhé! 💪` };
  }

  const newWallet: WalletData = {
    ...wallet,
    balance: wallet.balance - reward.cost,
  };

  saveWalletData(newWallet);
  addTransaction({
    title: `Đổi quà: ${reward.title}`,
    amount: -reward.cost,
    emoji: reward.icon || '🎁',
    type: 'reward',
  });

  return {
    success: true,
    message: `Đã đổi thành công "${reward.title}" (-${reward.cost} XP)! Yêu cầu đã gửi tới ba mẹ để chuẩn bị quà cho con nhé! 🎉`,
    data: newWallet,
  };
}

// 6. Quản lý danh sách Quà (gồm quà mặc định + quà custom từ nút +)
export function getAllRewards() {
  let custom: CustomRewardItem[] = [];
  try {
    const raw = localStorage.getItem(CUSTOM_REWARDS_KEY);
    if (raw) custom = JSON.parse(raw);
  } catch {
    // fallback
  }
  return [...D.rewards, ...custom];
}

export function addCustomRewardItem(item: Omit<CustomRewardItem, 'id' | 'createdAt'>): CustomRewardItem {
  let custom: CustomRewardItem[] = [];
  try {
    const raw = localStorage.getItem(CUSTOM_REWARDS_KEY);
    if (raw) custom = JSON.parse(raw);
  } catch {
    // fallback
  }

  const newReward: CustomRewardItem = {
    id: `rew-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...item,
  };

  const updated = [newReward, ...custom];
  localStorage.setItem(CUSTOM_REWARDS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('kidlife_rewards_update', { detail: updated }));
  return newReward;
}

// 7. Thông báo chúc mừng hoàn thành nhiệm vụ khi Bố mẹ duyệt
export function triggerCelebrationNotice(taskId: string, taskTitle: string, rewardXP: number): void {
  // Cộng XP vào ví của bé ngay lập tức
  const wallet = getWalletData();
  const newWallet: WalletData = {
    ...wallet,
    balance: wallet.balance + rewardXP,
  };
  saveWalletData(newWallet);

  // Ghi vào lịch sử giao dịch
  addTransaction({
    title: `Nhiệm vụ được duyệt: ${taskTitle}`,
    amount: +rewardXP,
    emoji: '🏆',
    type: 'earn',
  });

  // Lưu thông báo chúc mừng để màn hình của bé hiển thị trong 3s
  const notice: CelebrationNotice = {
    id: `celeb-${Date.now()}`,
    taskId,
    taskTitle,
    rewardXP,
    timestamp: Date.now(),
  };

  localStorage.setItem(CELEBRATION_KEY, JSON.stringify(notice));
  window.dispatchEvent(new CustomEvent('kidlife_celebration_event', { detail: notice }));
}

export function getActiveCelebrationNotice(): CelebrationNotice | null {
  try {
    const raw = localStorage.getItem(CELEBRATION_KEY);
    if (raw) {
      const notice: CelebrationNotice = JSON.parse(raw);
      // Nếu sự kiện trong vòng 10 giây trở lại thì còn hiệu lực
      if (Date.now() - notice.timestamp < 10000) {
        return notice;
      }
    }
  } catch {
    // fallback
  }
  return null;
}

export function clearCelebrationNotice(): void {
  localStorage.removeItem(CELEBRATION_KEY);
}
