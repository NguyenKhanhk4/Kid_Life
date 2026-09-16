import { useState } from 'react';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';

const D = MOCK_KIDLIFE_DATA;

export default function ChildWalletPage() {
  const [activeTab, setActiveTab] = useState<'balance' | 'savings' | 'history'>('balance');
  const [savingsDeposit, setSavingsDeposit] = useState('');
  const [savingsSuccess, setSavingsSuccess] = useState(false);

  const handleSaveToPiggy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!savingsDeposit || Number(savingsDeposit) <= 0) return;
    setSavingsSuccess(true);
    setTimeout(() => {
      setSavingsSuccess(false);
      setSavingsDeposit('');
    }, 2500);
  };

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
              {D.wallet.balance.toLocaleString()} <span style={{ fontSize: 22, fontWeight: 700 }}>XP</span>
            </div>
          </div>
          <div style={{ width: 52, height: 52, borderRadius: 26, background: 'rgba(255,255,255,0.2)', display: 'grid', placeItems: 'center', fontSize: 28 }}>
            💰
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.2)', marginTop: 16 }}>
          <div>
            <span style={{ fontSize: 12, opacity: 0.8 }}>Sổ tiết kiệm (Heo đất)</span>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>
              {D.wallet.savingsBalance.toLocaleString()} XP
            </div>
          </div>
          <div>
            <span style={{ fontSize: 12, opacity: 0.8 }}>Lãi suất hôm nay (+{D.wallet.interestRate}%)</span>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#FFE169', marginTop: 4 }}>
              +{D.wallet.dailyInterest} XP
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
          Đổi quà
        </button>
        <button
          className={`filter-tab-btn ${activeTab === 'savings' ? 'active' : ''}`}
          onClick={() => setActiveTab('savings')}
        >
          Nuôi heo đất
        </button>
        <button
          className={`filter-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Lịch sử giao dịch
        </button>
      </div>

      {/* Tab 1: Đổi quà */}
      {activeTab === 'balance' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--kl-primary-dark)' }}>Quà có thể đổi 🎁</h2>
            <span style={{ fontSize: 13, color: 'var(--kl-muted)' }}>Cần ba mẹ duyệt</span>
          </div>

          <div className="web-grid-2">
            {D.rewards.map((reward) => (
              <div
                key={reward.id}
                className="kl-card"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: 18, border: '1px solid var(--kl-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: '#FFF4E5', display: 'grid', placeItems: 'center', fontSize: 26 }}>
                    {reward.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--kl-primary-dark)' }}>{reward.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--kl-muted)' }}>{reward.detail}</p>
                  </div>
                </div>
                <button
                  className="kl-btn kl-btn-sm"
                  style={{
                    background: D.wallet.balance >= reward.cost ? 'var(--kl-primary)' : 'var(--kl-border)',
                    color: D.wallet.balance >= reward.cost ? '#fff' : 'var(--kl-muted)',
                    cursor: D.wallet.balance >= reward.cost ? 'pointer' : 'not-allowed',
                  }}
                  disabled={D.wallet.balance < reward.cost}
                  onClick={() => alert(`Đã gửi yêu cầu đổi "${reward.title}" tới ba mẹ thành công! 🎉`)}
                >
                  {reward.cost} XP
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Nuôi heo đất */}
      {activeTab === 'savings' && (
        <div className="kl-card" style={{ padding: 28, maxWidth: 560 }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 64, marginBottom: 10 }}>🐷✨</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--kl-primary-dark)' }}>Gửi tiết kiệm nhận lãi suất</h3>
            <p style={{ fontSize: 14, color: 'var(--kl-muted)', maxWidth: 340, margin: '8px auto 0' }}>
              Mỗi ngày con giữ điểm trong heo đất, ba mẹ tặng thêm lãi kép <b>{D.wallet.interestRate}%</b> mỗi ngày!
            </p>
          </div>

          {savingsSuccess ? (
            <div style={{ background: 'var(--kl-green-soft)', padding: 20, borderRadius: 14, textAlign: 'center', color: 'var(--kl-green)', fontWeight: 700, marginBottom: 16, fontSize: 15 }}>
              🎉 Chúc mừng bé đã gửi tiết kiệm thành công! Heo đất sẽ sinh thêm lãi mỗi ngày!
            </div>
          ) : (
            <form onSubmit={handleSaveToPiggy} style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ fontSize: 14, fontWeight: 700, color: 'var(--kl-primary-dark)', display: 'block', marginBottom: 8 }}>
                  Số điểm XP muốn gửi vào Heo đất:
                </label>
                <input
                  type="number"
                  placeholder="Ví dụ: 100"
                  value={savingsDeposit}
                  onChange={(e) => setSavingsDeposit(e.target.value)}
                  max={D.wallet.balance}
                  className="kl-input"
                  style={{ fontSize: 16, fontWeight: 700 }}
                />
                <span style={{ fontSize: 12, color: 'var(--kl-muted)', display: 'block', marginTop: 6 }}>
                  Tối đa: {D.wallet.balance.toLocaleString()} XP
                </span>
              </div>
              <button
                type="submit"
                className="kl-btn kl-btn-primary kl-btn-block"
                style={{ fontSize: 16 }}
                disabled={!savingsDeposit || Number(savingsDeposit) <= 0 || Number(savingsDeposit) > D.wallet.balance}
              >
                Gửi vào Heo Đất 🐖
              </button>
            </form>
          )}
        </div>
      )}

      {/* Tab 3: Lịch sử */}
      {activeTab === 'history' && (
        <div className="web-grid-2">
          <div className="kl-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: 'var(--kl-green-soft)', display: 'grid', placeItems: 'center', color: 'var(--kl-green)', fontSize: 22 }}>
                +
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>Hoàn thành: Lau bàn ăn</div>
                <div style={{ fontSize: 12, color: 'var(--kl-muted)' }}>Hôm nay, 12:30</div>
              </div>
            </div>
            <span style={{ fontWeight: 800, color: 'var(--kl-green)', fontSize: 15 }}>+60 XP</span>
          </div>

          <div className="kl-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: '#FFF4E5', display: 'grid', placeItems: 'center', color: 'var(--kl-orange)', fontSize: 22 }}>
                📈
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>Lãi suất Heo đất hàng ngày</div>
                <div style={{ fontSize: 12, color: 'var(--kl-muted)' }}>Hôm nay, 08:00</div>
              </div>
            </div>
            <span style={{ fontWeight: 800, color: 'var(--kl-orange)', fontSize: 15 }}>+15 XP</span>
          </div>

          {D.penalties.map((p) => (
            <div key={p.id} className="kl-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 22, background: '#FFE8EC', display: 'grid', placeItems: 'center', fontSize: 22 }}>
                  {p.emoji}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{p.reason}</div>
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
