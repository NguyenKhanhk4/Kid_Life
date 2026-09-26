import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoTimeOutline, IoCheckmarkCircle, IoStar, IoRibbonOutline } from 'react-icons/io5';
import { VideoLesson } from '@/shared/types/videoLesson';

interface VideoPreviewModalProps {
  video: VideoLesson | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleAssign?: (videoId: string) => void;
}

const getYouTubeEmbedUrl = (url?: string) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` : null;
};

export default function VideoPreviewModal({
  video,
  isOpen,
  onClose,
  onToggleAssign,
}: VideoPreviewModalProps) {
  if (!isOpen || !video) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#ffffff',
            borderRadius: 28,
            width: '100%',
            maxWidth: 680,
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '18px 24px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#F8FAFC',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 32 }}>🎬</span>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--kl-primary-dark)', margin: 0 }}>
                  Xem trước: {video.title}
                </h3>
                <div style={{ display: 'flex', gap: 8, marginTop: 4, fontSize: 12, color: 'var(--kl-muted)' }}>
                  <span>{video.categoryLabel}</span>
                  <span>• {video.ageLabel}</span>
                  <span>• {video.duration}</span>
                  <span>• Giảng viên: {video.instructor}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                background: '#EDF2F7',
                border: 'none',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <IoClose size={20} color="var(--kl-muted)" />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'grid', gap: 16 }}>
            {/* Real Playable Video Player */}
            <div
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                background: '#0F172A',
                boxShadow: '0 10px 25px rgba(15, 23, 42, 0.25)',
                border: '2px solid #1E293B',
              }}
            >
              {getYouTubeEmbedUrl(video.video_url) ? (
                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000' }}>
                  <iframe
                    src={getYouTubeEmbedUrl(video.video_url)!}
                    title={video.title}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none',
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : video.video_url?.endsWith('.mp4') ? (
                <div style={{ width: '100%', background: '#000', display: 'flex', justifyContent: 'center' }}>
                  <video
                    controls
                    autoPlay
                    src={video.video_url}
                    style={{ width: '100%', maxHeight: 360 }}
                  />
                </div>
              ) : (
                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000' }}>
                  <iframe
                    src="https://www.youtube.com/embed/wxM6kePuv2Y?autoplay=1&rel=0"
                    title={video.title}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none',
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>

            <div>
              <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--kl-primary-dark)', marginBottom: 6 }}>
                Mô tả bài học
              </h4>
              <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.5, margin: 0 }}>
                {video.description}
              </p>
            </div>

            {/* Key takeaways */}
            <div
              style={{
                background: '#F8FAFC',
                borderRadius: 16,
                padding: 16,
                border: '1px solid #E2E8F0',
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: 'var(--kl-primary-dark)',
                  marginBottom: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <IoRibbonOutline size={18} color="var(--kl-primary)" />
                Bài học rút ra cho bé:
              </div>
              <ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 6 }}>
                {video.keyTakeaways.map((point, idx) => (
                  <li key={idx} style={{ fontSize: 13, color: '#334155' }}>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#D97706', fontWeight: 800, fontSize: 14 }}>
              <IoStar size={18} />
              Thưởng +{video.reward_xp} XP cho bé
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              {onToggleAssign && (
                <button
                  onClick={() => onToggleAssign(video.id)}
                  className="kl-btn"
                  style={{
                    background: video.isAssigned ? '#FEF2F2' : '#ECFDF5',
                    color: video.isAssigned ? '#DC2626' : '#059669',
                    border: `1.5px solid ${video.isAssigned ? '#FECDD3' : '#A7F3D0'}`,
                    padding: '8px 16px',
                    borderRadius: 14,
                    fontWeight: 800,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  {video.isAssigned ? 'Bỏ giao cho bé' : '+ Thêm cho bé'}
                </button>
              )}
              <button
                onClick={onClose}
                className="kl-btn kl-btn-primary"
                style={{ padding: '8px 18px', borderRadius: 14, fontSize: 13, fontWeight: 800 }}
              >
                Đóng
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
