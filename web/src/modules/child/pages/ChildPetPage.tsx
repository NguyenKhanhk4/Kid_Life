import { useState } from 'react';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';
import { IoFlame } from 'react-icons/io5';

const D = MOCK_KIDLIFE_DATA;

const PET_STAGES = [
  { stage: 1, name: 'Trứng Rồng', emoji: '🥚', streakRequired: 0, unlocked: true },
  { stage: 2, name: 'Rồng Con Béo', emoji: '🐉', streakRequired: 7, unlocked: true },
  { stage: 3, name: 'Rồng Thiếu Niên', emoji: '🐲', streakRequired: 14, unlocked: false },
  { stage: 4, name: 'Hỏa Long Huyền Thoại', emoji: '🔥🐉', streakRequired: 30, unlocked: false },
];

const ACCESSORIES = [
  { id: 'a1', name: 'Nón Tiệc Tùng', icon: '🥳', cost: 50, equipped: true },
  { id: 'a2', name: 'Kính Râm Ngầu', icon: '🕶️', cost: 80, equipped: false },
  { id: 'a3', name: 'Vương Miện Vàng', icon: '👑', cost: 150, equipped: false },
  { id: 'a4', name: 'Áo Choàng Phù Thủy', icon: '🧙‍♂️', cost: 200, equipped: false },
];

export default function ChildPetPage() {
  const [petMood, setPetMood] = useState(D.pet.mood);
  const [fedCount, setFedCount] = useState(1);
  const [feedingEffect, setFeedingEffect] = useState(false);
  const [equippedItem, setEquippedItem] = useState('🥳');

  const handleFeedPet = () => {
    setFeedingEffect(true);
    setPetMood('Cực kỳ hạnh phúc!');
    setFedCount(prev => prev + 1);
    setTimeout(() => {
      setFeedingEffect(false);
    }, 1800);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="web-page-header">
        <div>
          <h1>Thú Cưng Của Bé 🐉</h1>
          <p className="page-subtitle">Cùng lớn lên với từng nhiệm vụ</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FFF4E5', padding: '8px 14px', borderRadius: 20 }}>
          <IoFlame color="var(--kl-orange)" size={18} />
          <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--kl-orange)' }}>{D.pet.streak} ngày streak</span>
        </div>
      </div>

      <div className="web-grid-2-1" style={{ marginBottom: 24 }}>
        {/* Pet Showcase */}
        <div
          className="kl-card"
          style={{
            textAlign: 'center',
            padding: '40px 24px',
            background: 'radial-gradient(circle at 50% 30%, #E9EEFF 0%, #E2EAFF 100%)',
            borderRadius: 28,
            position: 'relative',
            border: '2px solid rgba(43, 68, 232, 0.1)',
          }}
        >
          {/* Equipped Accessory Badge */}
          <div style={{ position: 'absolute', top: 24, left: 24, fontSize: 28 }}>
            {equippedItem}
          </div>

          {/* Pet Avatar with animation */}
          <div
            style={{
              fontSize: 100,
              lineHeight: 1,
              marginBottom: 16,
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: feedingEffect ? 'scale(1.25) rotate(8deg)' : 'scale(1)',
            }}
          >
            {D.pet.emoji}
          </div>

          {feedingEffect && (
            <div style={{ position: 'absolute', top: 50, right: 40, fontSize: 28, animation: 'slideUp 0.8s ease' }}>
              💖 Yum Yum!
            </div>
          )}

          <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--kl-primary-dark)', marginBottom: 6 }}>
            {D.pet.name}
          </h2>
          <p style={{ fontSize: 14, color: 'var(--kl-muted)' }}>
            Cấp độ {D.pet.level} • Tâm trạng: <b style={{ color: 'var(--kl-green)' }}>{petMood}</b>
          </p>

          {/* XP Progress */}
          <div style={{ maxWidth: 320, margin: '20px auto 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: 'var(--kl-muted)', marginBottom: 8 }}>
              <span>Tiến độ tiến hóa</span>
              <span>{D.pet.xp} / {D.pet.xpToNext} XP</span>
            </div>
            <div style={{ height: 10, background: 'rgba(43, 68, 232, 0.15)', borderRadius: 5, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--kl-lime)', borderRadius: 5, width: `${(D.pet.xp / D.pet.xpToNext) * 100}%`, transition: 'width 0.6s ease' }} />
            </div>
          </div>

          {/* Feed Pet Button */}
          <div style={{ marginTop: 24 }}>
            <button
              className="kl-btn kl-btn-primary"
              onClick={handleFeedPet}
              style={{ padding: '14px 32px', fontSize: 16, borderRadius: 24, boxShadow: '0 6px 16px rgba(43, 68, 232, 0.3)' }}
            >
              🍎 Cho Rồng Con Ăn (Đã ăn {fedCount} lần)
            </button>
          </div>
        </div>

        {/* Right: Evolution + Wardrobe */}
        <div style={{ display: 'grid', gap: 20 }}>
          {/* Evolution Roadmap */}
          <div className="kl-card" style={{ padding: 22 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--kl-primary-dark)', marginBottom: 16 }}>
              Vòng đời tiến hóa 🌟
            </h3>
            <div style={{ display: 'grid', gap: 10 }}>
              {PET_STAGES.map((s) => (
                <div
                  key={s.stage}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '12px 14px',
                    borderRadius: 14,
                    background: s.unlocked ? '#F0F3FF' : '#F9F9FB',
                    border: s.unlocked ? '1px solid var(--kl-primary)' : '1px dashed var(--kl-border)',
                    opacity: s.unlocked ? 1 : 0.6,
                  }}
                >
                  <span style={{ fontSize: 32 }}>{s.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--kl-primary-dark)' }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: s.unlocked ? 'var(--kl-primary)' : 'var(--kl-muted)' }}>
                      {s.unlocked ? '✅ Đã mở' : `🔒 Cần ${s.streakRequired} ngày streak`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wardrobe */}
          <div className="kl-card" style={{ padding: 22 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--kl-primary-dark)', marginBottom: 16 }}>
              Tủ đồ trang sức 👗
            </h3>
            <div style={{ display: 'grid', gap: 10 }}>
              {ACCESSORIES.map((item) => {
                const isEquipped = equippedItem === item.icon;
                return (
                  <div
                    key={item.id}
                    style={{
                      padding: 14,
                      borderRadius: 14,
                      border: isEquipped ? '2px solid var(--kl-primary)' : '1px solid var(--kl-border)',
                      background: isEquipped ? '#F0F3FF' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 28 }}>{item.icon}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--kl-primary-dark)' }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--kl-muted)' }}>{item.cost} XP</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setEquippedItem(item.icon)}
                      className="kl-btn kl-btn-sm"
                      style={{
                        background: isEquipped ? 'var(--kl-primary)' : '#EAEAEA',
                        color: isEquipped ? '#fff' : 'var(--kl-text)',
                      }}
                    >
                      {isEquipped ? 'Đang mặc' : 'Mặc'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
