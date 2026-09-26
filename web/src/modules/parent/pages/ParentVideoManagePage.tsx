import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  IoSearchOutline,
  IoCheckmarkCircle,
  IoAddCircleOutline,
  IoEyeOutline,
  IoTimeOutline,
  IoStar,
  IoAnalyticsOutline,
  IoVideocamOutline,
} from 'react-icons/io5';
import {
  getAllVideos,
  toggleVideoAssignment,
  getVideoProgressMap,
} from '@/shared/utils/videoLessonStorage';
import { VideoLesson } from '@/shared/types/videoLesson';
import VideoPreviewModal from '@/modules/video-lesson/components/VideoPreviewModal';

const CATEGORIES = [
  { key: 'all', label: 'Tất cả', emoji: '🌟' },
  { key: 've_sinh', label: 'Vệ sinh', emoji: '🧼' },
  { key: 'tu_lap', label: 'Tự lập', emoji: '👕' },
  { key: 'giao_tiep', label: 'Giao tiếp', emoji: '🙏' },
  { key: 'cam_xuc', label: 'Cảm xúc', emoji: '🤝' },
  { key: 'sang_tao', label: 'Sáng tạo', emoji: '🎨' },
  { key: 'le_phep', label: 'Lễ phép', emoji: '😊' },
];

export default function ParentVideoManagePage() {
  const [activeTab, setActiveTab] = useState<'library' | 'progress'>('library');
  const [videos, setVideos] = useState<VideoLesson[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [previewVideo, setPreviewVideo] = useState<VideoLesson | null>(null);

  const loadData = () => {
    // TODO: Replace with API call → GET /api/parent/video-lessons
    setVideos(getAllVideos());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => {
      setVideos(getAllVideos());
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

  const handleToggleAssign = (videoId: string) => {
    toggleVideoAssignment(videoId);
    setVideos(getAllVideos());
    if (previewVideo && previewVideo.id === videoId) {
      setPreviewVideo((prev) => (prev ? { ...prev, isAssigned: !prev.isAssigned } : null));
    }
  };

  const assignedCount = videos.filter((v) => v.isAssigned).length;
  const progressMap = getVideoProgressMap();
  const progressList = Object.values(progressMap);

  const filteredVideos = videos.filter((v) => {
    if (selectedCat !== 'all' && v.category !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.instructor.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div style={{ maxWidth: 1050, margin: '0 auto', paddingBottom: 50 }}>
      {/* Header */}
      <div className="web-page-header" style={{ marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 30 }}>🎬</span>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--kl-primary-dark)' }}>
              Quản lý Video Bài Học
            </h1>
          </div>
          <p style={{ color: 'var(--kl-muted)', fontSize: 14, marginTop: 4 }}>
            Chọn lọc các bài học video kỹ năng sống phù hợp lứa tuổi và theo dõi tiến độ học của bé
          </p>
        </div>

        <div>
          <span
            className="kl-badge"
            style={{
              background: '#EEF2FF',
              color: '#4F46E5',
              fontSize: 13,
              fontWeight: 800,
              padding: '6px 14px',
            }}
          >
            Đã chọn {assignedCount}/{videos.length} video cho bé
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          borderBottom: '2px solid #E2E8F0',
          marginBottom: 24,
        }}
      >
        <button
          onClick={() => setActiveTab('library')}
          style={{
            padding: '12px 20px',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'library' ? '3px solid var(--kl-primary)' : '3px solid transparent',
            color: activeTab === 'library' ? 'var(--kl-primary)' : 'var(--kl-muted)',
            fontWeight: 800,
            fontSize: 15,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: -2,
            transition: 'all 0.2s',
          }}
        >
          <IoVideocamOutline size={18} />
          Thư viện video ({videos.length})
        </button>

        <button
          onClick={() => setActiveTab('progress')}
          style={{
            padding: '12px 20px',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'progress' ? '3px solid var(--kl-primary)' : '3px solid transparent',
            color: activeTab === 'progress' ? 'var(--kl-primary)' : 'var(--kl-muted)',
            fontWeight: 800,
            fontSize: 15,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: -2,
            transition: 'all 0.2s',
          }}
        >
          <IoAnalyticsOutline size={18} />
          Tiến độ học của bé ({progressList.length})
        </button>
      </div>

      {/* TAB 1: THƯ VIỆN VIDEO */}
      {activeTab === 'library' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
          {/* Filter Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <div
              style={{
                flex: 1,
                minWidth: 260,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: '#ffffff',
                border: '1.5px solid #E2E8F0',
                borderRadius: 16,
                padding: '0 16px',
                height: 46,
              }}
            >
              <IoSearchOutline size={18} color="var(--kl-muted)" />
              <input
                className="kl-input"
                style={{ background: 'transparent', border: 'none', padding: 0, height: '100%', flex: 1 }}
                placeholder="Tìm kiếm video bài học..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="kl-input"
              style={{ width: 170, height: 46, borderRadius: 16, border: '1.5px solid #E2E8F0' }}
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.emoji} {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Video Cards List */}
          <div style={{ display: 'grid', gap: 14 }}>
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="kl-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  padding: '18px 24px',
                  borderRadius: 20,
                  border: video.isAssigned ? '1.5px solid #C7D2FE' : '1px solid #E2E8F0',
                  background: video.isAssigned ? '#FAF5FF' : '#ffffff',
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 18,
                    background: video.thumbnail_color || '#EEF2FF',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 32,
                    flexShrink: 0,
                  }}
                >
                  {video.thumbnail_emoji}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--kl-primary-dark)', margin: 0 }}>
                      {video.title}
                    </h3>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 13, color: 'var(--kl-muted)' }}>
                    <span>🏷️ {video.categoryLabel}</span>
                    <span>👶 {video.ageLabel}</span>
                    <span>⏱️ {video.duration}</span>
                    <span>👤 {video.instructor}</span>
                    <span style={{ color: '#D97706', fontWeight: 700 }}>⭐ +{video.reward_xp} XP</span>
                    <span>👁️ {video.views.toLocaleString()} lượt xem</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    onClick={() => setPreviewVideo(video)}
                    className="kl-btn"
                    style={{
                      background: '#F1F5F9',
                      color: 'var(--kl-primary-dark)',
                      padding: '8px 16px',
                      borderRadius: 14,
                      fontWeight: 700,
                      fontSize: 13,
                      border: '1px solid #CBD5E1',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      cursor: 'pointer',
                    }}
                  >
                    <IoEyeOutline size={16} /> Xem trước
                  </button>

                  <button
                    onClick={() => handleToggleAssign(video.id)}
                    className="kl-btn"
                    style={{
                      background: video.isAssigned ? '#10B981' : 'var(--kl-primary)',
                      color: '#ffffff',
                      padding: '8px 18px',
                      borderRadius: 14,
                      fontWeight: 800,
                      fontSize: 13,
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      cursor: 'pointer',
                      boxShadow: video.isAssigned
                        ? '0 3px 8px rgba(16, 185, 129, 0.25)'
                        : '0 3px 8px rgba(43, 68, 232, 0.25)',
                    }}
                  >
                    {video.isAssigned ? (
                      <>
                        <IoCheckmarkCircle size={16} /> Đã thêm cho bé ✓
                      </>
                    ) : (
                      <>
                        <IoAddCircleOutline size={16} /> + Thêm cho bé
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}

            {filteredVideos.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--kl-muted)' }}>
                <span style={{ fontSize: 48 }}>🔍</span>
                <p style={{ marginTop: 10, fontSize: 15 }}>Không tìm thấy video bài học</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* TAB 2: TIẾN ĐỘ HỌC CỦA BÉ */}
      {activeTab === 'progress' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
          {/* Summary Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div className="kl-card" style={{ padding: 20, borderRadius: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: 'var(--kl-muted)', fontWeight: 700 }}>Bé đã hoàn thành</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#10B981', marginTop: 4 }}>
                {progressList.filter((p) => p.watched).length}/{videos.length} video
              </div>
            </div>

            <div className="kl-card" style={{ padding: 20, borderRadius: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: 'var(--kl-muted)', fontWeight: 700 }}>Đang xem dở</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--kl-primary)', marginTop: 4 }}>
                {progressList.filter((p) => !p.watched && p.progress > 0).length} bài
              </div>
            </div>

            <div className="kl-card" style={{ padding: 20, borderRadius: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: 'var(--kl-muted)', fontWeight: 700 }}>Tổng XP từ video</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#D97706', marginTop: 4 }}>
                +{progressList.reduce((acc, p) => acc + (p.reward_xp || 0), 0)} XP
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="kl-card" style={{ padding: 0, overflow: 'hidden', borderRadius: 20 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '14px 20px', fontSize: 13, fontWeight: 800, color: 'var(--kl-muted)' }}>
                    Tên video bài học
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: 13, fontWeight: 800, color: 'var(--kl-muted)', width: 200 }}>
                    Tiến độ
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: 13, fontWeight: 800, color: 'var(--kl-muted)' }}>
                    Trạng thái
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: 13, fontWeight: 800, color: 'var(--kl-muted)' }}>
                    Ngày xong
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: 13, fontWeight: 800, color: 'var(--kl-muted)' }}>
                    XP nhận
                  </th>
                </tr>
              </thead>
              <tbody>
                {progressList.map((item) => {
                  const dateStr = item.completedAt
                    ? new Date(item.completedAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Chưa xong';

                  return (
                    <tr key={item.videoId} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '16px 20px', fontWeight: 800, color: 'var(--kl-primary-dark)' }}>
                        {item.videoTitle}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            style={{
                              flex: 1,
                              height: 8,
                              borderRadius: 4,
                              background: '#E2E8F0',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                background: item.watched ? '#10B981' : 'var(--kl-primary)',
                                width: `${item.progress}%`,
                              }}
                            />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--kl-muted)' }}>
                            {item.progress}%
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        {item.watched ? (
                          <span
                            style={{
                              background: '#ECFDF5',
                              color: '#059669',
                              padding: '4px 10px',
                              borderRadius: 12,
                              fontSize: 12,
                              fontWeight: 800,
                            }}
                          >
                            ✓ Đã xem xong
                          </span>
                        ) : item.progress > 0 ? (
                          <span
                            style={{
                              background: '#FEF3C7',
                              color: '#B45309',
                              padding: '4px 10px',
                              borderRadius: 12,
                              fontSize: 12,
                              fontWeight: 800,
                            }}
                          >
                            Đang xem
                          </span>
                        ) : (
                          <span style={{ color: 'var(--kl-muted)', fontSize: 13 }}>Chưa xem</span>
                        )}
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: 13, color: 'var(--kl-muted)' }}>
                        {dateStr}
                      </td>
                      <td style={{ padding: '16px 20px', fontWeight: 800, color: '#D97706' }}>
                        +{item.reward_xp || 0} XP
                      </td>
                    </tr>
                  );
                })}

                {progressList.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--kl-muted)' }}>
                      Bé chưa xem video nào. Tiến độ xem sẽ tự động hiển thị tại đây khi bé học bài.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Preview Modal */}
      <VideoPreviewModal
        video={previewVideo}
        isOpen={Boolean(previewVideo)}
        onClose={() => setPreviewVideo(null)}
        onToggleAssign={handleToggleAssign}
      />
    </div>
  );
}
