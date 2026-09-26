import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IoSearchOutline,
  IoCloseCircle,
  IoPlayCircleOutline,
  IoCheckmarkCircle,
  IoTimeOutline,
  IoStar,
  IoPersonCircleOutline,
  IoEyeOutline,
} from 'react-icons/io5';
import { getAssignedVideosForChild, getAllVideos } from '@/shared/utils/videoLessonStorage';
import { VideoLesson } from '@/shared/types/videoLesson';

const CATEGORIES = [
  { key: 'all', label: 'Tất cả', emoji: '🌟' },
  { key: 've_sinh', label: 'Vệ sinh', emoji: '🧼' },
  { key: 'tu_lap', label: 'Tự lập', emoji: '👕' },
  { key: 'giao_tiep', label: 'Giao tiếp', emoji: '🙏' },
  { key: 'cam_xuc', label: 'Cảm xúc', emoji: '🤝' },
  { key: 'sang_tao', label: 'Sáng tạo', emoji: '🎨' },
  { key: 'le_phep', label: 'Lễ phép', emoji: '😊' },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  ve_sinh: { bg: '#E0F2FE', text: '#0369A1' },
  tu_lap: { bg: '#F3E8FF', text: '#7E22CE' },
  giao_tiep: { bg: '#FEF3C7', text: '#B45309' },
  cam_xuc: { bg: '#FFE4E6', text: '#BE123C' },
  sang_tao: { bg: '#FFEDD5', text: '#C2410C' },
  le_phep: { bg: '#DCFCE7', text: '#15803D' },
};

export default function VideoLessonLibraryPage() {
  const navigate = useNavigate();
  const [selectedCat, setSelectedCat] = useState('all');
  const [search, setSearch] = useState('');
  const [videos, setVideos] = useState<VideoLesson[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    // TODO: Replace with API call → GET /api/child/video-lessons
    setLoading(true);
    setTimeout(() => {
      // Chỉ hiển thị video đã được phụ huynh giao (isAssigned: true)
      setVideos(getAssignedVideosForChild());
      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => {
      setVideos(getAssignedVideosForChild());
    };
    window.addEventListener('kidlife_video_assigned_update', handleUpdate);
    window.addEventListener('kidlife_video_progress_update', handleUpdate);
    window.addEventListener('focus', handleUpdate);
    return () => {
      window.removeEventListener('kidlife_video_assigned_update', handleUpdate);
      window.removeEventListener('kidlife_video_progress_update', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
    };
  }, []);

  const filteredVideos = videos.filter((item) => {
    if (selectedCat !== 'all' && item.category !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.instructor.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const completedCount = videos.filter((v) => v.isWatched).length;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 40 }}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="web-page-header"
        style={{ marginBottom: 20 }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 32 }}>🎬</span>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--kl-primary-dark)' }}>
              Học Bài
            </h1>
          </div>
          <p style={{ color: 'var(--kl-muted)', fontSize: 14, marginTop: 4 }}>
            Xem các video bài học kỹ năng sống bổ ích và hấp dẫn mỗi ngày!
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            className="kl-badge"
            style={{
              background: '#EEF2FF',
              color: '#4F46E5',
              fontSize: 13,
              padding: '8px 16px',
              borderRadius: 20,
              fontWeight: 800,
            }}
          >
            {videos.length} video được giao
          </span>

          {completedCount > 0 && (
            <span
              className="kl-badge"
              style={{
                background: '#ECFDF5',
                color: '#059669',
                fontSize: 13,
                padding: '8px 16px',
                borderRadius: 20,
                fontWeight: 800,
              }}
            >
              ✅ Đã xem {completedCount}
            </span>
          )}
        </div>
      </motion.div>

      {/* Search Input */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: '#ffffff',
          borderRadius: 20,
          padding: '0 20px',
          height: 52,
          marginBottom: 20,
          border: '1.5px solid #E2E8F0',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
        }}
      >
        <IoSearchOutline size={22} color="var(--kl-muted)" />
        <input
          className="kl-input"
          style={{
            background: 'transparent',
            height: '100%',
            border: 'none',
            padding: 0,
            flex: 1,
            fontSize: 15,
          }}
          placeholder="Tìm video bài học theo tên, giáo viên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <IoCloseCircle size={20} color="var(--kl-muted)" />
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div
        className="filter-tab-bar"
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingBottom: 8,
          marginBottom: 24,
          scrollbarWidth: 'none',
        }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = selectedCat === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCat(cat.key)}
              style={{
                padding: '8px 18px',
                borderRadius: 999,
                border: isActive ? '2px solid var(--kl-primary)' : '1px solid #E2E8F0',
                background: isActive ? 'var(--kl-primary)' : '#ffffff',
                color: isActive ? '#ffffff' : 'var(--kl-text)',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            style={{ fontSize: 40, display: 'inline-block' }}
          >
            🎬
          </motion.div>
          <p style={{ marginTop: 12, color: 'var(--kl-muted)', fontWeight: 600 }}>
            Đang tải danh sách bài học video của bé...
          </p>
        </div>
      )}

      {/* Empty State: Khi chưa có video nào được assign */}
      {!loading && videos.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            textAlign: 'center',
            padding: '70px 20px',
            background: '#ffffff',
            borderRadius: 28,
            border: '2px dashed #CBD5E1',
            marginTop: 20,
          }}
        >
          <span style={{ fontSize: 64 }}>🥺</span>
          <h3
            style={{
              fontSize: 20,
              fontWeight: 800,
              marginTop: 14,
              color: 'var(--kl-primary-dark)',
            }}
          >
            Ba mẹ chưa chọn bài học nào cho bé 🥺
          </h3>
          <p
            style={{
              color: 'var(--kl-muted)',
              fontSize: 14,
              marginTop: 6,
              maxWidth: 420,
              margin: '6px auto 20px',
            }}
          >
            Bé hãy nhờ ba mẹ vào mục "Quản lý Video" ở chế độ phụ huynh để chọn và mở khóa những bài học thú vị nhé!
          </p>
          <button
            onClick={() => navigate('/role')}
            className="kl-btn kl-btn-primary"
            style={{ borderRadius: 16, padding: '10px 24px', fontWeight: 800 }}
          >
            ⇄ Chuyển sang Phụ huynh để chọn bài
          </button>
        </motion.div>
      )}

      {/* Video Grid */}
      {!loading && videos.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.06 },
            },
          }}
          className="web-grid-3"
          style={{ gap: 20 }}
        >
          {filteredVideos.map((video) => {
            const catColor = CATEGORY_COLORS[video.category] || { bg: '#EEF2FF', text: '#4F46E5' };
            const isCompleted = video.isWatched;
            const progress = video.watchProgress || 0;

            return (
              <motion.div
                key={video.id}
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.07)' }}
                className="kl-card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  borderRadius: 24,
                  border: isCompleted ? '2px solid #10B981' : '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#ffffff',
                }}
              >
                {/* Thumbnail / Ambient Frame */}
                <div
                  style={{
                    height: 140,
                    background: video.thumbnail_color || 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/child/video-lessons/${video.id}`)}
                >
                  <span style={{ fontSize: 60 }}>{video.thumbnail_emoji}</span>

                  {/* Play overlay button */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0, 0, 0, 0.15)',
                      display: 'grid',
                      placeItems: 'center',
                      transition: 'background 0.2s',
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        background: 'rgba(255, 255, 255, 0.9)',
                        display: 'grid',
                        placeItems: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      }}
                    >
                      <IoPlayCircleOutline size={30} color="var(--kl-primary)" />
                    </div>
                  </div>

                  {/* Duration Tag */}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 10,
                      right: 10,
                      background: 'rgba(15, 23, 42, 0.75)',
                      color: '#ffffff',
                      borderRadius: 10,
                      padding: '3px 8px',
                      fontSize: 11,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <IoTimeOutline size={12} /> {video.duration}
                  </span>

                  {/* Reward XP */}
                  <span
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      background: '#FEF08A',
                      color: '#854D0E',
                      borderRadius: 12,
                      padding: '3px 9px',
                      fontSize: 11.5,
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <IoStar size={13} color="#D97706" />
                    +{video.reward_xp} XP
                  </span>

                  {/* Completed Badge */}
                  {isCompleted && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        background: '#10B981',
                        color: '#ffffff',
                        borderRadius: 12,
                        padding: '3px 9px',
                        fontSize: 11,
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <IoCheckmarkCircle size={14} /> Đã xem xong
                    </span>
                  )}
                </div>

                {/* Progress Bar under thumbnail */}
                <div style={{ height: 4, background: '#E2E8F0', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      background: isCompleted ? '#10B981' : 'var(--kl-primary)',
                      width: `${progress}%`,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>

                {/* Content */}
                <div style={{ padding: 18, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span
                      style={{
                        background: catColor.bg,
                        color: catColor.text,
                        borderRadius: 12,
                        padding: '3px 9px',
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {video.categoryLabel}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--kl-muted)' }}>
                      • {video.ageLabel}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: 15.5,
                      fontWeight: 800,
                      color: 'var(--kl-primary-dark)',
                      marginBottom: 6,
                      lineHeight: 1.35,
                    }}
                  >
                    {video.title}
                  </h3>

                  <p
                    style={{
                      fontSize: 12.5,
                      color: 'var(--kl-muted)',
                      lineHeight: 1.4,
                      marginBottom: 14,
                      flex: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {video.description}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid #F1F5F9',
                      paddingTop: 12,
                    }}
                  >
                    <div style={{ fontSize: 12, color: 'var(--kl-muted)' }}>
                      <span>👤 {video.instructor}</span>
                    </div>

                    <button
                      onClick={() => navigate(`/child/video-lessons/${video.id}`)}
                      className="kl-btn"
                      style={{
                        background: isCompleted ? '#10B981' : 'var(--kl-primary)',
                        color: '#ffffff',
                        padding: '7px 14px',
                        borderRadius: 12,
                        fontSize: 12.5,
                        fontWeight: 800,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {isCompleted ? 'Xem lại ▶' : progress > 0 ? `Tiếp tục (${progress}%)` : 'Bắt đầu xem ▶'}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Filter empty */}
      {!loading && videos.length > 0 && filteredVideos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--kl-muted)' }}>
          <span style={{ fontSize: 48 }}>🔍</span>
          <p style={{ marginTop: 10, fontSize: 15 }}>Không tìm thấy video bài học phù hợp</p>
        </div>
      )}
    </div>
  );
}
