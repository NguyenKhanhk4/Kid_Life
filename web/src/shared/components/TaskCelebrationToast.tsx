// Component hiển thị popup chúc mừng khi bé được bố mẹ duyệt nhiệm vụ (tự tắt sau 3 giây)
import { useState, useEffect } from 'react';
import {
  CelebrationNotice,
  getActiveCelebrationNotice,
  clearCelebrationNotice,
} from '@/shared/utils/walletStorage';

export default function TaskCelebrationToast() {
  const [notice, setNotice] = useState<CelebrationNotice | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 1. Kiểm tra ngay khi mount
    const checkNotice = () => {
      const active = getActiveCelebrationNotice();
      if (active) {
        setNotice(active);
        setVisible(true);
        clearCelebrationNotice(); // Xoá để không lặp lại

        // Tự động tắt sau đúng 3 giây theo yêu cầu
        const timer = setTimeout(() => {
          setVisible(false);
          setNotice(null);
        }, 3000);

        return () => clearTimeout(timer);
      }
    };

    checkNotice();

    // 2. Lắng nghe CustomEvent từ cùng window
    const handleCelebrationEvent = (e: Event) => {
      const customEvent = e as CustomEvent<CelebrationNotice>;
      if (customEvent.detail) {
        setNotice(customEvent.detail);
        setVisible(true);
        clearCelebrationNotice();

        setTimeout(() => {
          setVisible(false);
          setNotice(null);
        }, 3000);
      }
    };

    // 3. Lắng nghe storage event (khi bố mẹ duyệt ở tab khác)
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === 'kidlife_active_celebration' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setNotice(parsed);
          setVisible(true);
          clearCelebrationNotice();

          setTimeout(() => {
            setVisible(false);
            setNotice(null);
          }, 3000);
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('kidlife_celebration_event', handleCelebrationEvent);
    window.addEventListener('storage', handleStorageEvent);

    // Poll nhẹ mỗi 1 giây phòng khi storage event bị hạn chế
    const interval = setInterval(checkNotice, 1000);

    return () => {
      window.removeEventListener('kidlife_celebration_event', handleCelebrationEvent);
      window.removeEventListener('storage', handleStorageEvent);
      clearInterval(interval);
    };
  }, []);

  if (!visible || !notice) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 99999,
        animation: 'klSlideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          color: '#fff',
          padding: '18px 28px',
          borderRadius: 24,
          boxShadow: '0 20px 40px rgba(5, 150, 105, 0.45), 0 0 0 3px rgba(255, 255, 255, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          maxWidth: 500,
          border: '2px solid #6EE7B7',
        }}
      >
        {/* Icon & Sparkle */}
        <div
          style={{
            fontSize: 40,
            animation: 'klPulse 1s infinite alternate',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          🎉
        </div>

        <div>
          <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: '#D1FAE5' }}>
            🌟 Ba mẹ đã duyệt bài!
          </div>
          <div style={{ fontSize: 17, fontWeight: 900, marginTop: 2, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
            Chúc mừng con đã hoàn thành nhiệm vụ!
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#ECFDF5', marginTop: 3 }}>
            "{notice.taskTitle}"
          </div>
        </div>

        {/* XP Badge */}
        <div
          style={{
            background: '#FEF08A',
            color: '#854D0E',
            padding: '8px 14px',
            borderRadius: 16,
            fontSize: 16,
            fontWeight: 900,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <span>+{notice.rewardXP}</span>
          <span style={{ fontSize: 12 }}>XP</span>
        </div>
      </div>

      <style>{`
        @keyframes klSlideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
        }
        @keyframes klPulse {
          from { transform: scale(1); }
          to { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
