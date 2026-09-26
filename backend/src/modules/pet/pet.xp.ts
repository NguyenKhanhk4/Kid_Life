/**
 * XP của bé thuộc module ví (wallet) của Dev 2. Pet chỉ cần 3 thao tác nên phụ thuộc qua interface này;
 * khi module wallet xong, viết 1 class implement ChildXpService gọi sang wallet và truyền vào PetService.
 */
export interface ChildXpService {
  getBalance(childId: string): Promise<number>;
  /** Trừ XP; trả false nếu không đủ (không trừ gì) */
  spend(childId: string, amount: number, reason: string): Promise<boolean>;
  add(childId: string, amount: number, reason: string): Promise<void>;
}

/**
 * TẠM THỜI: lưu XP trong bộ nhớ (mất khi restart server), mỗi bé mới có sẵn 1250 XP như dữ liệu mock.
 * TODO(dev2-wallet): thay bằng WalletXpService khi có backend/src/modules/wallet.
 */
export class InMemoryChildXpService implements ChildXpService {
  private balances = new Map<string, number>();

  constructor(private readonly startingBalance = 1250) {}

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
