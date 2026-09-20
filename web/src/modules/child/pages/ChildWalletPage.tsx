import { useState, useEffect } from 'react';
import {
  getWalletData,
  depositToPiggy,
  withdrawFromPiggy,
  redeemRewardItem,
  getAllRewards,
  addCustomRewardItem,
  getTransactions,
  WalletData,
  WalletTransactionItem,
} from '@/shared/utils/walletStorage';
import { IoAddCircle, IoClose, IoSparkles, IoWalletOutline } from 'react-icons/io5';

export default function ChildWalletPage() {
  const [activeTab, setActiveTab] = useState<'balance' | 'savings' | 'history'>('balance');
  const [wallet, setWallet] = useState<WalletData>(getWalletData);
  const [rewards, setRewards] = useState(getAllRewards);
  const [transactions, setTransactions] = useState<WalletTransactionItem[]>(getTransactions);

  // Form Heo đất
  const [piggyMode, setPiggyMode] = useState<'deposit' | 'withdraw'>('deposit');
  const [savingsAmount, setSavingsAmount] = useState('');
  const [piggyNotice, setPiggyNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal tạo yêu cầu quà mới (nút +)
  const [showAddRewardModal, setShowAddRewardModal] = useState(false);
  const [newRewardTitle, setNewRewardTitle] = useState('');
  const [newRewardCost, setNewRewardCost] = useState('');
  const [newRewardDetail, setNewRewardDetail] = useState('');
  const [newRewardIcon, setNewRewardIcon] = useState('🎁');

  // Thông báo đổi quà
  const [rewardNotice, setRewardNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Lắng nghe sự kiện đồng bộ ví & phần thưởng
  useEffect(() => {
    const handleWalletUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<WalletData>;
      if (customEvent.detail) {
        setWallet(customEvent.detail);
      } else {
        setWallet(getWalletData());
      }
      setTransactions(getTransactions());
    };

    const handleRewardsUpdate = () => {
      setRewards(getAllRewards());
    };

    const handleTxUpdate = () => {
      setTransactions(getTransactions());
    };

    window.addEventListener('kidlife_wallet_update', handleWalletUpdate);
    window.addEventListener('kidlife_rewards_update', handleRewardsUpdate);
    window.addEventListener('kidlife_transactions_update', handleTxUpdate);
    window.addEventListener('focus', () => {
      setWallet(getWalletData());
      setRewards(getAllRewards());
      setTransactions(getTransactions());
    });

    return () => {
      window.removeEventListener('kidlife_wallet_update', handleWalletUpdate);
      window.removeEventListener('kidlife_rewards_update', handleRewardsUpdate);
      window.removeEventListener('kidlife_transactions_update', handleTxUpdate);
    };
  }, []);

  // Xử lý Gửi hoặc Rút Heo Đất
  const handlePiggySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(savingsAmount);
    if (!savingsAmount || num <= 0) return;

    if (piggyMode === 'deposit') {
      const res = depositToPiggy(num);
      if (res.success) {
        setPiggyNotice({ type: 'success', message: res.message });
        setSavingsAmount('');
        if (res.data) setWallet(res.data);
      } else {
        setPiggyNotice({ type: 'error', message: res.message });
      }
    } else {
      const res = withdrawFromPiggy(num);
      if (res.success) {
        setPiggyNotice({ type: 'success', message: res.message });
        setSavingsAmount('');
        if (res.data) setWallet(res.data);
      } else {
        setPiggyNotice({ type: 'error', message: res.message });
      }
    }

    setTimeout(() => {
      setPiggyNotice(null);
    }, 3500);
  };

  // Xử lý Đổi quà (trừ điểm)
  const handleRedeemReward = (reward: { id: string; title: string; cost: number; icon?: string }) => {
    const res = redeemRewardItem(reward);
    if (res.success) {
      setRewardNotice({ type: 'success', message: res.message });
      if (res.data) setWallet(res.data);
    } else {
      setRewardNotice({ type: 'error', message: res.message });
    }

    setTimeout(() => {
      setRewardNotice(null);
    }, 4000);
  };

  // Xử lý Tạo yêu cầu quà mới (Nút +)
  const handleCreateCustomReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRewardTitle.trim()) return;
    const costNum = Number(newRewardCost) || 100;

    addCustomRewardItem({
      title: newRewardTitle.trim(),
      cost: Math.max(1, costNum),
      detail: newRewardDetail.trim() || 'Yêu cầu do bé đề xuất',
      icon: newRewardIcon || '🎁',
    });

    setRewards(getAllRewards());
    setShowAddRewardModal(false);
    setNewRewardTitle('');
    setNewRewardCost('');
    setNewRewardDetail('');
    setNewRewardIcon('🎁');

    setRewardNotice({
      type: 'success',
      message: `🎉 Đã tạo thành công yêu cầu quà "${newRewardTitle.trim()}"! Món quà đã được thêm vào danh sách!`,
    });

    setTimeout(() => setRewardNotice(null), 3500);
  };

  const ICONS_LIST = ['🎁', '🍦', '🎮', '🎨', '⚽', '📚', '🍕', '🎬', '🚲', '🧸'];

  return (
    <div>
      {/* Page Header */}
      <div className="web-page-header">
        <div>
          <h1>Ví Điểm & Heo Đất 🐷</h1>
          <p className="page-subtitle">Học quản lý tài chính thông minh</p>
        </div>
      </div>

      {/* Main Balance Card */}
      <div
        className="kl-card"
        style={{
          background: 'linear-gradient(135deg, #2B44E8 0%, #6E7DFB 100%)',
          color: '#fff',
          padding: 28,
          borderRadius: 24,
          marginBottom: 24,
          boxShadow: '0 12px 28px rgba(43, 68, 232, 0.25)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: 14, opacity: 0.9 }}>Số dư khả dụng</span>
            <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: -0.5, marginTop: 4 }}>
              {wallet.balance.toLocaleString()} <span style={{ fontSize: 22, fontWeight: 700 }}>XP</span>
            </div>
          </div>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 27,
              background: 'rgba(255,255,255,0.2)',
              display: 'grid',
              placeItems: 'center',
              fontSize: 28,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            💰
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            paddingTop: 20,
            borderTop: '1px solid rgba(255,255,255,0.2)',
            marginTop: 16,
          }}
        >
          <div>
            <span style={{ fontSize: 13, opacity: 0.85 }}>Sổ tiết kiệm (Heo đất) 🐖</span>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#FFE169', marginTop: 4 }}>
              {wallet.savingsBalance.toLocaleString()} XP
            </div>
          </div>
          <div>
            <span style={{ fontSize: 13, opacity: 0.85 }}>Lãi suất hôm nay (+{wallet.interestRate}%) 📈</span>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#A7F3D0', marginTop: 4 }}>
              +{wallet.dailyInterest} XP
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="filter-tab-bar" style={{ marginBottom: 24 }}>
        <button
          className={`filter-tab-btn ${activeTab === 'balance' ? 'active' : ''}`}
          onClick={() => setActiveTab('balance')}
        >
          🎁 Đổi quà ({rewards.length})
        </button>
        <button
          className={`filter-tab-btn ${activeTab === 'savings' ? 'active' : ''}`}
          onClick={() => setActiveTab('savings')}
        >
          🐷 Nuôi heo đất
        </button>
        <button
          className={`filter-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📜 Lịch sử giao dịch ({transactions.length})
        </button>
      </div>

      {/* Thông báo thao tác chung */}
      {rewardNotice && (
        <div
          style={{
            background: rewardNotice.type === 'success' ? '#D1FAE5' : '#FEE2E2',
            border: `1px solid ${rewardNotice.type === 'success' ? '#10B981' : '#EF4444'}`,
            color: rewardNotice.type === 'success' ? '#065F46' : '#991B1B',
            borderRadius: 16,
            padding: '14px 18px',
            marginBottom: 20,
            fontWeight: 700,
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <span style={{ fontSize: 20 }}>{rewardNotice.type === 'success' ? '🎉' : '⚠️'}</span>
          <span>{rewardNotice.message}</span>
        </div>
      )}

      {/* TAB 1: ĐỔI QUÀ */}
      {activeTab === 'balance' && (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 18,
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--kl-primary-dark)' }}>Quà có thể đổi 🎁</h2>
              {/* Nút Dấu + Tạo yêu cầu quà */}
              <button
                onClick={() => setShowAddRewardModal(true)}
                className="kl-btn kl-btn-primary"
                style={{
                  padding: '6px 14px',
                  fontSize: 13,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  borderRadius: 20,
                  boxShadow: '0 4px 10px rgba(43, 68, 232, 0.2)',
                }}
                title="Bấm để tạo yêu cầu quà mới gửi ba mẹ"
              >
                <IoAddCircle size={18} />
                <span>Thêm yêu cầu quà</span>
              </button>
            </div>
            <span style={{ fontSize: 13, color: 'var(--kl-muted)' }}>Cần ba mẹ chuẩn bị</span>
          </div>

          <div className="web-grid-2">
            {rewards.map((reward) => {
              const canAfford = wallet.balance >= reward.cost;
              return (
                <div
                  key={reward.id}
                  className="kl-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 18,
                    border: canAfford ? '1px solid var(--kl-border)' : '1px dashed #CBD5E1',
                    borderRadius: 20,
                    opacity: canAfford ? 1 : 0.8,
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: 18,
                        background: canAfford ? '#FFF4E5' : '#F1F5F9',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 28,
                        flexShrink: 0,
                      }}
                    >
                      {reward.icon}
                    </div>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--kl-primary-dark)' }}>
                        {reward.title}
                      </h3>
                      <p style={{ fontSize: 13, color: 'var(--kl-muted)', marginTop: 2 }}>{reward.detail}</p>
                    </div>
                  </div>
                  <button
                    className="kl-btn kl-btn-sm"
                    style={{
                      background: canAfford ? 'var(--kl-primary)' : '#E2E8F0',
                      color: canAfford ? '#fff' : '#64748B',
                      cursor: canAfford ? 'pointer' : 'not-allowed',
                      fontWeight: 800,
                      borderRadius: 14,
                      padding: '8px 16px',
                      whiteSpace: 'nowrap',
                      boxShadow: canAfford ? '0 4px 12px rgba(43, 68, 232, 0.25)' : 'none',
                    }}
                    disabled={!canAfford}
                    onClick={() => handleRedeemReward(reward)}
                  >
                    {reward.cost.toLocaleString()} XP
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: NUÔI HEO ĐẤT (GỬI VÀ RÚT TƯƠNG ỨNG) */}
      {activeTab === 'savings' && (
        <div className="kl-card" style={{ padding: 32, maxWidth: 580, margin: '0 auto', borderRadius: 24 }}>
          {/* Header Heo Đất */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 68, marginBottom: 8 }}>🐷✨</div>
            <h3 style={{ fontSize: 22, fontWeight: 900, color: 'var(--kl-primary-dark)' }}>
              Ngân Hàng Heo Đất Của Bé
            </h3>
            <p style={{ fontSize: 14, color: 'var(--kl-muted)', maxWidth: 420, margin: '8px auto 0' }}>
              Mỗi ngày con giữ điểm trong heo đất, ba mẹ tặng thêm lãi kép <b>{wallet.interestRate}%</b> mỗi ngày!
            </p>
          </div>

          {/* Chuyển đổi giữa Gửi Vào và Rút Ra */}
          <div
            style={{
              display: 'flex',
              background: '#F1F5F9',
              borderRadius: 14,
              padding: 4,
              marginBottom: 22,
            }}
          >
            <button
              onClick={() => {
                setPiggyMode('deposit');
                setPiggyNotice(null);
                setSavingsAmount('');
              }}
              style={{
                flex: 1,
                padding: '10px 0',
                border: 'none',
                borderRadius: 12,
                fontWeight: 800,
                fontSize: 14,
                cursor: 'pointer',
                background: piggyMode === 'deposit' ? '#fff' : 'transparent',
                color: piggyMode === 'deposit' ? 'var(--kl-primary)' : 'var(--kl-muted)',
                boxShadow: piggyMode === 'deposit' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              📥 Gửi vào Heo Đất
            </button>
            <button
              onClick={() => {
                setPiggyMode('withdraw');
                setPiggyNotice(null);
                setSavingsAmount('');
              }}
              style={{
                flex: 1,
                padding: '10px 0',
                border: 'none',
                borderRadius: 12,
                fontWeight: 800,
                fontSize: 14,
                cursor: 'pointer',
                background: piggyMode === 'withdraw' ? '#fff' : 'transparent',
                color: piggyMode === 'withdraw' ? 'var(--kl-primary)' : 'var(--kl-muted)',
                boxShadow: piggyMode === 'withdraw' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              📤 Rút về Ví điểm
            </button>
          </div>

          {/* Thông báo Heo đất */}
          {piggyNotice && (
            <div
              style={{
                background: piggyNotice.type === 'success' ? 'var(--kl-green-soft)' : '#FEE2E2',
                border: `1px solid ${piggyNotice.type === 'success' ? 'var(--kl-green)' : '#EF4444'}`,
                color: piggyNotice.type === 'success' ? 'var(--kl-green)' : '#991B1B',
                borderRadius: 14,
                padding: '14px 18px',
                marginBottom: 20,
                fontWeight: 700,
                fontSize: 14,
                textAlign: 'center',
              }}
            >
              {piggyNotice.type === 'success' ? '🎉 ' : '⚠️ '}
              {piggyNotice.message}
            </div>
          )}

          {/* Form thực hiện */}
          <form onSubmit={handlePiggySubmit} style={{ display: 'grid', gap: 18 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 700, color: 'var(--kl-primary-dark)' }}>
                  {piggyMode === 'deposit' ? 'Số điểm XP muốn gửi vào Heo đất:' : 'Số điểm XP muốn rút về Ví:'}
                </label>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--kl-primary)' }}>
                  {piggyMode === 'deposit'
                    ? `Ví khả dụng: ${wallet.balance.toLocaleString()} XP`
                    : `Trong Heo đất: ${wallet.savingsBalance.toLocaleString()} XP`}
                </span>
              </div>

              <input
                type="number"
                placeholder={piggyMode === 'deposit' ? 'Ví dụ: 100' : 'Ví dụ: 50'}
                value={savingsAmount}
                onChange={(e) => setSavingsAmount(e.target.value)}
                min="1"
                max={piggyMode === 'deposit' ? wallet.balance : wallet.savingsBalance}
                className="kl-input"
                style={{ fontSize: 17, fontWeight: 800, height: 48, borderRadius: 14 }}
              />

              {/* Nút chọn nhanh */}
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                {[50, 100, 200].map((quickXP) => (
                  <button
                    key={quickXP}
                    type="button"
                    onClick={() => setSavingsAmount(String(quickXP))}
                    style={{
                      flex: 1,
                      padding: '6px 0',
                      borderRadius: 10,
                      border: '1px solid var(--kl-border)',
                      background: '#F8FAFC',
                      fontSize: 12,
                      fontWeight: 700,
                      color: 'var(--kl-primary-dark)',
                      cursor: 'pointer',
                    }}
                  >
                    +{quickXP} XP
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setSavingsAmount(
                      String(piggyMode === 'deposit' ? wallet.balance : wallet.savingsBalance)
                    )
                  }
                  style={{
                    flex: 1,
                    padding: '6px 0',
                    borderRadius: 10,
                    border: '1px solid var(--kl-border)',
                    background: '#EEF2FF',
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--kl-primary)',
                    cursor: 'pointer',
                  }}
                >
                  Tất cả
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="kl-btn kl-btn-primary kl-btn-block"
              style={{
                fontSize: 16,
                fontWeight: 800,
                padding: 14,
                borderRadius: 14,
                background:
                  piggyMode === 'deposit'
                    ? 'linear-gradient(135deg, #2563EB, #1D4ED8)'
                    : 'linear-gradient(135deg, #059669, #10B981)',
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
              }}
              disabled={
                !savingsAmount ||
                Number(savingsAmount) <= 0 ||
                (piggyMode === 'deposit' && Number(savingsAmount) > wallet.balance) ||
                (piggyMode === 'withdraw' && Number(savingsAmount) > wallet.savingsBalance)
              }
            >
              {piggyMode === 'deposit' ? 'Gửi vào Heo Đất 🐖' : 'Rút về Ví điểm 💵'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: LỊCH SỬ GIAO DỊCH */}
      {activeTab === 'history' && (
        <div>
          {transactions.length === 0 ? (
            <div className="kl-card" style={{ textAlign: 'center', padding: 48, borderRadius: 20 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📜</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--kl-primary-dark)' }}>
                Chưa có giao dịch nào
              </h3>
              <p style={{ fontSize: 13, color: 'var(--kl-muted)', marginTop: 4 }}>
                Hãy hoàn thành nhiệm vụ hoặc nuôi heo đất để nhận điểm nhé!
              </p>
            </div>
          ) : (
            <div className="web-grid-2">
              {transactions.map((t) => {
                const isPositive = t.amount > 0;
                return (
                  <div
                    key={t.id}
                    className="kl-card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 16,
                      borderRadius: 18,
                      border: '1px solid var(--kl-border)',
                      background: isPositive ? '#F0FDF4' : '#FFF5F6',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 46,
                          height: 46,
                          borderRadius: 16,
                          background: isPositive ? '#DCFCE7' : '#FFE4E6',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: 22,
                        }}
                      >
                        {t.emoji}
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--kl-primary-dark)' }}>
                          {t.title}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--kl-muted)', marginTop: 2 }}>
                          {t.date}
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        fontWeight: 900,
                        color: isPositive ? '#16A34A' : '#E11D48',
                        fontSize: 16,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {isPositive ? `+${t.amount.toLocaleString()}` : `${t.amount.toLocaleString()}`} XP
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL: TẠO YÊU CẦU QUÀ MỚI (NÚT +) */}
      {showAddRewardModal && (
        <div
          onClick={() => setShowAddRewardModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            boxSizing: 'border-box',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="kl-card"
            style={{
              width: '100%',
              maxWidth: 480,
              padding: 28,
              borderRadius: 24,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              position: 'relative',
              animation: 'klScaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <button
              onClick={() => setShowAddRewardModal(false)}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: '#F1F5F9',
                border: 'none',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
                color: 'var(--kl-muted)',
              }}
            >
              <IoClose size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <span style={{ fontSize: 32 }}>🎁</span>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--kl-primary-dark)' }}>
                  Bé Muốn Đổi Quà Gì Nào?
                </h3>
                <p style={{ fontSize: 13, color: 'var(--kl-muted)', marginTop: 2 }}>
                  Tạo yêu cầu phần thưởng gửi cho ba mẹ duyệt
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateCustomReward} style={{ display: 'grid', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--kl-primary-dark)', display: 'block', marginBottom: 6 }}>
                  Tên món quà / Phần thưởng:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Đi ăn gà rán, Mua sách tranh mới..."
                  value={newRewardTitle}
                  onChange={(e) => setNewRewardTitle(e.target.value)}
                  required
                  className="kl-input"
                  style={{ height: 44, borderRadius: 12 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--kl-primary-dark)', display: 'block', marginBottom: 6 }}>
                  Số điểm XP đề xuất:
                </label>
                <input
                  type="number"
                  placeholder="Ví dụ: 150"
                  value={newRewardCost}
                  onChange={(e) => setNewRewardCost(e.target.value)}
                  min="1"
                  required
                  className="kl-input"
                  style={{ height: 44, borderRadius: 12, fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--kl-primary-dark)', display: 'block', marginBottom: 6 }}>
                  Chọn biểu tượng (icon):
                </label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {ICONS_LIST.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setNewRewardIcon(ic)}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        border: newRewardIcon === ic ? '2px solid var(--kl-primary)' : '1px solid var(--kl-border)',
                        background: newRewardIcon === ic ? 'var(--kl-primary-soft)' : '#F8FAFC',
                        fontSize: 20,
                        cursor: 'pointer',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--kl-primary-dark)', display: 'block', marginBottom: 6 }}>
                  Lời nhắn gửi ba mẹ (không bắt buộc):
                </label>
                <input
                  type="text"
                  placeholder="Con sẽ cố gắng ngoan và chăm chỉ..."
                  value={newRewardDetail}
                  onChange={(e) => setNewRewardDetail(e.target.value)}
                  className="kl-input"
                  style={{ height: 44, borderRadius: 12 }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowAddRewardModal(false)}
                  className="kl-btn"
                  style={{ flex: 1, padding: 12, borderRadius: 14, background: '#F1F5F9', fontWeight: 700 }}
                >
                  Huỷ bỏ
                </button>
                <button
                  type="submit"
                  className="kl-btn kl-btn-primary"
                  style={{ flex: 1, padding: 12, borderRadius: 14, fontWeight: 800 }}
                  disabled={!newRewardTitle.trim()}
                >
                  Gửi yêu cầu 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes klScaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
