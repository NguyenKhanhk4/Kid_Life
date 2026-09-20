import { useState, useEffect } from 'react';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';
import {
  getWalletData,
  saveWalletData,
  addTransaction,
  getTransactions,
  triggerCelebrationNotice,
  WalletData,
  WalletTransactionItem,
} from '@/shared/utils/walletStorage';

const D = MOCK_KIDLIFE_DATA;

export default function ParentBankPage() {
  const [wallet, setWallet] = useState<WalletData>(getWalletData);
  const [transactions, setTransactions] = useState<WalletTransactionItem[]>(getTransactions);
  const [penalties, setPenalties] = useState(D.penalties);

  const [activeTab, setActiveTab] = useState<'all' | 'penalties'>('all');

  // Form trừ điểm phạt
  const [penaltyReason, setPenaltyReason] = useState('');
  const [penaltyAmount, setPenaltyAmount] = useState('');

  // Form thưởng điểm nóng
  const [rewardReason, setRewardReason] = useState('');
  const [rewardAmount, setRewardAmount] = useState('');

  useEffect(() => {
    const handleWalletUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<WalletData>;
      setWallet(customEvent.detail || getWalletData());
    };

    const handleTxUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<WalletTransactionItem[]>;
      setTransactions(customEvent.detail || getTransactions());
    };

    window.addEventListener('kidlife_wallet_update', handleWalletUpdate);
    window.addEventListener('kidlife_transactions_update', handleTxUpdate);
    window.addEventListener('focus', () => {
      setWallet(getWalletData());
      setTransactions(getTransactions());
    });
    window.addEventListener('storage', () => {
      setWallet(getWalletData());
      setTransactions(getTransactions());
    });

    return () => {
      window.removeEventListener('kidlife_wallet_update', handleWalletUpdate);
      window.removeEventListener('kidlife_transactions_update', handleTxUpdate);
    };
  }, []);

  // Xử lý áp dụng vé phạt
  const handleIssuePenalty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!penaltyReason || !penaltyAmount) return;
    const num = Math.abs(Number(penaltyAmount));

    const newPenalty = {
      id: `pen-${Date.now()}`,
      reason: penaltyReason.trim(),
      amount: -num,
      emoji: '⚠️',
      date: 'Vừa xong',
      status: 'issued',
    };
    setPenalties([newPenalty, ...penalties]);

    // Trừ điểm trong ví dùng chung
    const currentWallet = getWalletData();
    const newBalance = Math.max(0, currentWallet.balance - num);
    const updatedWallet = { ...currentWallet, balance: newBalance };
    saveWalletData(updatedWallet);
    setWallet(updatedWallet);

    addTransaction({
      title: `Vé phạt: ${penaltyReason.trim()}`,
      amount: -num,
      emoji: '⚠️',
      type: 'penalty',
    });

    setPenaltyReason('');
    setPenaltyAmount('');
    alert(`Đã áp dụng hình thức trừ ${num} XP và đồng bộ số dư sang tài khoản của bé!`);
  };

  // Xử lý thưởng điểm nóng trực tiếp
  const handleIssueReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rewardReason || !rewardAmount) return;
    const num = Math.abs(Number(rewardAmount));

    // Kích hoạt thưởng điểm và thông báo chúc mừng 3s sang bé
    triggerCelebrationNotice(`parent-reward-${Date.now()}`, rewardReason.trim(), num);

    setRewardReason('');
    setRewardAmount('');
    alert(`Đã thưởng ${num} XP cho bé! Màn hình của bé sẽ hiện popup chúc mừng và cộng điểm ngay lập tức.`);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="web-page-header">
        <div>
          <h1>Ngân Hàng Ảo & Kỷ Luật 🏦</h1>
          <p className="page-subtitle">Quản lý tài chính, quỹ Heo đất và thưởng phạt đồng bộ hai chiều</p>
        </div>
      </div>

      {/* Top Grid: Overview Card */}
      <div style={{ marginBottom: 24 }}>
        <div
          className="kl-card"
          style={{
            background: 'linear-gradient(135deg, #1A237E 0%, #283593 100%)',
            color: '#fff',
            padding: 28,
            borderRadius: 24,
            boxShadow: '0 8px 24px rgba(26, 35, 126, 0.25)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 15, opacity: 0.9, fontWeight: 700 }}>Tài khoản tài chính của bé Minh Anh</span>
            <span className="kl-badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 13 }}>
              Lãi suất tiết kiệm: {wallet.interestRate}% / ngày
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', padding: 18, borderRadius: 18 }}>
              <div style={{ fontSize: 13, opacity: 0.8 }}>Ví chi tiêu khả dụng</div>
              <div style={{ fontSize: 32, fontWeight: 800, marginTop: 6, color: '#fff' }}>
                {wallet.balance.toLocaleString()} XP
              </div>
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>Bé có thể dùng để đổi quà hoặc gửi vào Heo đất</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.08)', padding: 18, borderRadius: 18 }}>
              <div style={{ fontSize: 13, opacity: 0.8 }}>Heo đất tiết kiệm sinh lãi 🐷</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#FFE169', marginTop: 6 }}>
                {wallet.savingsBalance.toLocaleString()} XP
              </div>
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
                Sinh lời ~{wallet.dailyInterest} XP mỗi ngày từ lãi suất kép
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two action forms: Thưởng nóng & Phạt kỷ luật */}
      <div className="web-grid-2" style={{ marginBottom: 28 }}>
        {/* Form 1: Thưởng điểm động viên */}
        <div className="kl-card" style={{ padding: 22, borderRadius: 22 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--kl-primary-dark)', marginBottom: 6 }}>
            Thưởng điểm khích lệ nóng 🎁
          </h3>
          <p style={{ fontSize: 12, color: 'var(--kl-muted)', marginBottom: 16 }}>
            Tặng điểm thưởng ngay khi bé làm việc tốt đột xuất hoặc có hành vi đáng khen.
          </p>

          <form onSubmit={handleIssueReward} style={{ display: 'grid', gap: 12 }}>
            <input
              type="text"
              placeholder="Lý do khen thưởng (vd: Tự giác học bài, Giúp mẹ dọn bếp)"
              value={rewardReason}
              onChange={(e) => setRewardReason(e.target.value)}
              className="kl-input"
              style={{ height: 44 }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                type="number"
                placeholder="Số điểm XP thưởng (vd: 50)"
                value={rewardAmount}
                onChange={(e) => setRewardAmount(e.target.value)}
                className="kl-input"
                style={{ flex: 1, height: 44 }}
              />
              <button
                type="submit"
                className="kl-btn kl-btn-primary"
                disabled={!rewardReason || !rewardAmount}
                style={{
                  padding: '10px 20px',
                  fontWeight: 700,
                  opacity: !rewardReason || !rewardAmount ? 0.5 : 1,
                  cursor: !rewardReason || !rewardAmount ? 'not-allowed' : 'pointer',
                }}
              >
                + Thưởng ngay
              </button>
            </div>
          </form>
        </div>

        {/* Form 2: Kỷ luật văn minh */}
        <div className="kl-card" style={{ padding: 22, borderRadius: 22 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--kl-primary-dark)', marginBottom: 6 }}>
            Trừ điểm nhắc nhở / Kỷ luật văn minh ⚖️
          </h3>
          <p style={{ fontSize: 12, color: 'var(--kl-muted)', marginBottom: 16 }}>
            Trừ điểm để nhắc nhở khi bé vi phạm quy tắc gia đình đã cam kết.
          </p>

          <form onSubmit={handleIssuePenalty} style={{ display: 'grid', gap: 12 }}>
            <input
              type="text"
              placeholder="Lý do vi phạm (ví dụ: Chơi game quá giờ, chưa dọn đồ chơi)"
              value={penaltyReason}
              onChange={(e) => setPenaltyReason(e.target.value)}
              className="kl-input"
              style={{ height: 44 }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                type="number"
                placeholder="Số điểm trừ XP (vd: 30)"
                value={penaltyAmount}
                onChange={(e) => setPenaltyAmount(e.target.value)}
                className="kl-input"
                style={{ flex: 1, height: 44 }}
              />
              <button
                type="submit"
                className="kl-btn"
                disabled={!penaltyReason || !penaltyAmount}
                style={{
                  background: 'var(--kl-pink)',
                  color: '#fff',
                  padding: '10px 20px',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: 12,
                  opacity: !penaltyReason || !penaltyAmount ? 0.5 : 1,
                  cursor: !penaltyReason || !penaltyAmount ? 'not-allowed' : 'pointer',
                }}
              >
                Áp dụng phạt
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Tab Navigation: Full History vs Penalties */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className={`filter-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            📋 Tất cả giao dịch của bé ({transactions.length})
          </button>
          <button
            className={`filter-tab-btn ${activeTab === 'penalties' ? 'active' : ''}`}
            onClick={() => setActiveTab('penalties')}
          >
            ⚖️ Lịch sử vé phạt ({penalties.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Dòng tiền thực tế đồng bộ từ bé */}
      {activeTab === 'all' && (
        <div style={{ display: 'grid', gap: 10 }}>
          {transactions.map((tx) => {
            const isPlus = tx.amount > 0;
            return (
              <div
                key={tx.id}
                className="kl-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  border: '1px solid var(--kl-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 24 }}>{tx.emoji}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--kl-primary-dark)' }}>{tx.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--kl-muted)', marginTop: 2 }}>{tx.date}</div>
                  </div>
                </div>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 16,
                    color: isPlus ? 'var(--kl-green)' : 'var(--kl-pink)',
                  }}
                >
                  {isPlus ? `+${tx.amount.toLocaleString()}` : tx.amount.toLocaleString()} XP
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Lịch sử vé phạt */}
      {activeTab === 'penalties' && (
        <div className="web-grid-2">
          {penalties.map((p) => (
            <div
              key={p.id}
              className="kl-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 16,
                background: '#FFF5F6',
                border: '1px solid #FFE3E7',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 24 }}>{p.emoji}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--kl-primary-dark)' }}>{p.reason}</div>
                  <div style={{ fontSize: 12, color: 'var(--kl-muted)' }}>{p.date}</div>
                </div>
              </div>
              <span style={{ fontWeight: 800, color: 'var(--kl-pink)', fontSize: 15 }}>{p.amount} XP</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
