import { useState } from 'react';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';

const D = MOCK_KIDLIFE_DATA;

export default function ParentBankPage() {
  const [balance, setBalance] = useState(D.wallet.balance);
  const [savings, setSavings] = useState(D.wallet.savingsBalance);
  const [interestRate] = useState(D.wallet.interestRate);
  const [penalties, setPenalties] = useState(D.penalties);

  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');

  const handleIssuePenalty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || !amount) return;
    const num = Number(amount);
    const newPenalty = {
      id: `pen-${Date.now()}`,
      reason,
      amount: -Math.abs(num),
      emoji: '⚠️',
      date: 'Vừa xong',
      status: 'issued',
    };
    setPenalties([newPenalty, ...penalties]);
    setBalance(prev => Math.max(0, prev - Math.abs(num)));
    setReason('');
    setAmount('');
    alert(`Đã áp dụng hình thức trừ ${Math.abs(num)} XP và gửi thông báo nhắc nhở cho bé!`);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="web-page-header">
        <div>
          <h1>Ngân Hàng Ảo & Kỷ Luật 🏦</h1>
          <p className="page-subtitle">Quản lý tài chính & thưởng phạt văn minh</p>
        </div>
      </div>

      {/* Top Grid: Account + Penalty Form */}
      <div className="web-grid-2" style={{ marginBottom: 24 }}>
        {/* Account Overview Card */}
        <div
          className="kl-card"
          style={{
            background: 'linear-gradient(135deg, #1A237E 0%, #283593 100%)',
            color: '#fff',
            padding: 28,
            borderRadius: 24,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 14, opacity: 0.8 }}>Tài khoản bé Minh Anh</span>
            <span className="kl-badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 12 }}>
              Lãi suất: {interestRate}% / ngày
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>Ví chi tiêu</div>
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>{balance.toLocaleString()} XP</div>
            </div>
            <div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>Heo đất tiết kiệm</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#FFE169', marginTop: 4 }}>{savings.toLocaleString()} XP</div>
            </div>
          </div>
        </div>

        {/* Penalty / Discipline Form */}
        <div className="kl-card" style={{ padding: 22, borderRadius: 22 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--kl-primary-dark)', marginBottom: 10 }}>
            Trừ điểm nhắc nhở / Kỷ luật văn minh ⚖️
          </h3>
          <p style={{ fontSize: 12, color: 'var(--kl-muted)', marginBottom: 16 }}>
            Trừ điểm để nhắc nhở khi bé vi phạm quy tắc gia đình đã cam kết.
          </p>

          <form onSubmit={handleIssuePenalty} style={{ display: 'grid', gap: 12 }}>
            <input
              type="text"
              placeholder="Lý do vi phạm (ví dụ: Chơi game quá giờ, chưa dọn đồ chơi)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="kl-input"
              style={{ height: 44 }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                type="number"
                placeholder="Số điểm trừ XP (vd: 30)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="kl-input"
                style={{ flex: 1, height: 44 }}
              />
              <button
                type="submit"
                className="kl-btn kl-btn-sm"
                disabled={!reason || !amount}
                style={{
                  background: 'var(--kl-pink)',
                  color: '#fff',
                  padding: '10px 20px',
                  fontWeight: 700,
                  opacity: !reason || !amount ? 0.5 : 1,
                  cursor: !reason || !amount ? 'not-allowed' : 'pointer',
                }}
              >
                Áp dụng phạt
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Disciplinary History */}
      <div className="section-header">
        <div className="section-title-row">
          <span style={{ fontSize: 20 }}>📜</span>
          <h2 className="section-title">Lịch sử kỷ luật gần đây</h2>
        </div>
      </div>
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
    </div>
  );
}
