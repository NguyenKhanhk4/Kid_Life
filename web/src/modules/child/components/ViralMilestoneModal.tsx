import { useState } from 'react';
import { IoClose, IoShareSocial, IoDownloadOutline, IoQrCodeOutline, IoCheckmarkCircle } from 'react-icons/io5';

interface BadgeItem {
  id: number;
  name: string;
  icon: string;
  desc?: string;
}

interface Props {
  badge: BadgeItem;
  childName: string;
  onClose: () => void;
}

const TEMPLATES = [
  { id: 'knight', name: 'Hiệp Sĩ 🛡️', bg: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)', badgeLabel: 'Hiệp Sĩ Tự Lập' },
  { id: 'princess', name: 'Công Chúa 👸', bg: 'linear-gradient(135deg, #FF758C 0%, #FF7EB3 100%)', badgeLabel: 'Công Chúa Chăm Chỉ' },
  { id: 'astronaut', name: 'Phi Hành Gia 🚀', bg: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)', badgeLabel: 'Phi Hành Gia Dũng Cảm' },
];

export default function ViralMilestoneModal({ badge, childName, onClose }: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      alert(`Đã tạo liên kết thiệp vinh danh thành công! Thiệp "${badge.name}" của bé ${childName} sẵn sàng chia sẻ lên Zalo/Facebook 🎉`);
    }, 1200);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'grid', placeItems: 'center', zIndex: 1000, padding: 20 }}>
      <div className="kl-card" style={{ width: '100%', maxWidth: 500, padding: 28, borderRadius: 28, position: 'relative', animation: 'scaleUp 0.2s ease' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 20, right: 20, fontSize: 22, color: 'var(--kl-muted)', cursor: 'pointer' }}
        >
          <IoClose />
        </button>

        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: 'var(--kl-purple)', fontWeight: 800 }}>✨ TẠO THIỆP VINH DANH VINH QUANG ✨</span>
          <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--kl-primary-dark)', marginTop: 4 }}>
            Chúc Mừng Thành Tựu Bé {childName}!
          </h3>
        </div>

        {/* Template Selector */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTemplate(t)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 700,
                border: selectedTemplate.id === t.id ? '2px solid var(--kl-primary)' : '1px solid var(--kl-border)',
                background: selectedTemplate.id === t.id ? 'var(--kl-primary-soft)' : '#fff',
                color: selectedTemplate.id === t.id ? 'var(--kl-primary)' : 'var(--kl-text)',
                cursor: 'pointer',
              }}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Digital Card Preview Box */}
        <div
          style={{
            background: selectedTemplate.bg,
            color: '#fff',
            padding: 24,
            borderRadius: 24,
            textAlign: 'center',
            boxShadow: '0 12px 28px rgba(0,0,0,0.25)',
            marginBottom: 20,
            position: 'relative',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, opacity: 0.8 }}>
            🌟 KIDLIFE VIRAL MILESTONE CARD 🌟
          </div>

          <div style={{ fontSize: 64, margin: '14px 0 6px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>
            {badge.icon}
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>Bé {childName}</h2>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#FFE169', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {selectedTemplate.badgeLabel} — Danh Hiệu: {badge.name}
          </div>
          <p style={{ fontSize: 12, opacity: 0.85, marginTop: 8 }}>
            "{badge.desc || 'Đạt thành tích xuất sắc trong chuỗi làm việc nhà tự lập'}"
          </p>

          {/* QR Code section inside card */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 18, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ background: '#fff', padding: 6, borderRadius: 8, display: 'grid', placeItems: 'center' }}>
              <IoQrCodeOutline size={36} color="#000" />
            </div>
            <div style={{ textAlign: 'left', fontSize: 10, opacity: 0.9 }}>
              <div><b>Quét mã QR</b> để tải ứng dụng KidLife</div>
              <div>Cùng rèn nếp sống tự lập cho bé!</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <button
            onClick={handleShare}
            className="kl-btn kl-btn-primary"
            style={{ fontSize: 14, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {copied ? <IoCheckmarkCircle size={18} /> : <IoShareSocial size={18} />}
            {copied ? 'Đã tạo link thiệp' : 'Khoe Zalo / Facebook'}
          </button>
          <button
            onClick={() => alert(`Đã tải thiệp vinh danh kỹ thuật số về máy! 📸`)}
            className="kl-btn"
            style={{ background: '#F0F3FF', color: 'var(--kl-primary)', fontSize: 14, borderRadius: 16, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <IoDownloadOutline size={18} /> Tải Ảnh Thiệp
          </button>
        </div>
      </div>
    </div>
  );
}
