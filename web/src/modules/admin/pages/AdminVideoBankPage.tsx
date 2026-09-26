import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoSearchOutline,
  IoAddCircleOutline,
  IoPencilOutline,
  IoEyeOutline,
  IoTrashOutline,
  IoDownloadOutline,
  IoClose,
  IoCheckmarkCircle,
  IoLockClosedOutline,
  IoStar,
  IoTimeOutline,
  IoPlayCircleOutline,
  IoRibbonOutline,
  IoLinkOutline,
  IoVideocamOutline,
} from 'react-icons/io5';
import {
  getAdminVideoBank,
  saveAdminVideoBank,
  updateVideoInBank,
  deleteVideoFromBank,
  toggleVideoVisibility,
  exportToCSV,
} from '@/shared/utils/contentStorage';
import { VideoLesson, VideoCategory } from '@/shared/types/videoLesson';

const CATEGORIES: { key: VideoCategory; label: string; emoji: string }[] = [
  { key: 've_sinh', label: 'Vệ sinh', emoji: '🧼' },
  { key: 'tu_lap', label: 'Tự lập', emoji: '👕' },
  { key: 'giao_tiep', label: 'Giao tiếp', emoji: '🙏' },
  { key: 'cam_xuc', label: 'Cảm xúc', emoji: '🤝' },
  { key: 'sang_tao', label: 'Sáng tạo', emoji: '🎨' },
  { key: 'le_phep', label: 'Lễ phép', emoji: '😊' },
];

const EMOJIS = ['🎬', '🦷', '👕', '🙏', '🎨', '🧼', '🤝', '📚', '😊', '🍎', '⭐', '🎈'];
const PASTEL_COLORS = ['#E0F2FE', '#F3E8FF', '#FEF3C7', '#FCE7F3', '#DCFCE7', '#FFE4E6', '#E0E7FF', '#CCFBF1'];

// Helper detect YouTube URL
const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=0` : null;
};

export default function AdminVideoBankPage() {
  const [bank, setBank] = useState<VideoLesson[]>([]);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterAge, setFilterAge] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modals state
  const [editingVideo, setEditingVideo] = useState<VideoLesson | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<VideoLesson | null>(null);
  const [deleteConfirmVideo, setDeleteConfirmVideo] = useState<VideoLesson | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState<VideoCategory>('ve_sinh');
  const [formAgeMin, setFormAgeMin] = useState(4);
  const [formAgeMax, setFormAgeMax] = useState(6);
  const [formEmoji, setFormEmoji] = useState('🎬');
  const [formColor, setFormColor] = useState('#E0F2FE');
  const [formInstructor, setFormInstructor] = useState('Cô Hoa');
  const [formMinutes, setFormMinutes] = useState(5);
  const [formSeconds, setFormSeconds] = useState(0);
  const [formXP, setFormXP] = useState(15);
  const [formUrl, setFormUrl] = useState('');
  const [formStatus, setFormStatus] = useState<'visible' | 'hidden'>('visible');
  const [formTags, setFormTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [formTakeaways, setFormTakeaways] = useState<string[]>([]);
  const [newTakeawayInput, setNewTakeawayInput] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const loadData = () => {
    // TODO: Replace with API call → GET /api/admin/video-bank
    setBank(getAdminVideoBank());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => setBank(getAdminVideoBank());
    window.addEventListener('kidlife_admin_videobank_update', handleUpdate);
    return () => window.removeEventListener('kidlife_admin_videobank_update', handleUpdate);
  }, []);

  // Stats calculation
  const totalCount = bank.length;
  const visibleCount = bank.filter((v) => v.status !== 'hidden').length;
  const hiddenCount = bank.filter((v) => v.status === 'hidden').length;
  const hasUrlCount = bank.filter((v) => Boolean(v.video_url?.trim())).length;

  // Filtered videos
  const filteredVideos = bank.filter((v) => {
    if (filterCat !== 'all' && v.category !== filterCat) return false;
    if (filterStatus === 'visible' && v.status === 'hidden') return false;
    if (filterStatus === 'hidden' && v.status !== 'hidden') return false;
    if (filterAge !== 'all') {
      const ageNum = parseInt(filterAge);
      if (ageNum < v.ageMin || ageNum > v.ageMax) return false;
    }
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

  // Open Form for Create
  const handleOpenCreateModal = () => {
    setEditingVideo(null);
    setFormTitle('');
    setFormDesc('');
    setFormCategory('ve_sinh');
    setFormAgeMin(4);
    setFormAgeMax(6);
    setFormEmoji('🎬');
    setFormColor('#E0F2FE');
    setFormInstructor('Cô Hoa');
    setFormMinutes(5);
    setFormSeconds(0);
    setFormXP(15);
    setFormUrl('');
    setFormStatus('visible');
    setFormTags(['Kỹ năng sống']);
    setFormTakeaways([
      'Thực hiện các bước cẩn thận và đúng cách',
      'Rèn luyện thói quen tự lập mỗi ngày',
    ]);
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open Form for Edit
  const handleOpenEditModal = (video: VideoLesson) => {
    setEditingVideo(video);
    setFormTitle(video.title);
    setFormDesc(video.description || '');
    setFormCategory(video.category);
    setFormAgeMin(video.ageMin || 4);
    setFormAgeMax(video.ageMax || 6);
    setFormEmoji(video.thumbnail_emoji || '🎬');
    setFormColor(video.thumbnail_color || '#E0F2FE');
    setFormInstructor(video.instructor || 'Cô Hoa');
    const totalSec = video.durationSeconds || 300;
    setFormMinutes(Math.floor(totalSec / 60));
    setFormSeconds(totalSec % 60);
    setFormXP(video.reward_xp || 15);
    setFormUrl(video.video_url || '');
    setFormStatus(video.status || 'visible');
    setFormTags(video.tags || []);
    setFormTakeaways(video.keyTakeaways || []);
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Form Save
  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formTitle.trim()) {
      errors.title = 'Tiêu đề video không được để trống';
    } else if (formTitle.trim().length < 3 || formTitle.trim().length > 100) {
      errors.title = 'Tiêu đề video phải từ 3 đến 100 ký tự';
    }

    if (formAgeMin > formAgeMax) {
      errors.age = 'Lứa tuổi bắt đầu phải nhỏ hơn hoặc bằng lứa tuổi kết thúc';
    }

    if (formXP < 1 || formXP > 200) {
      errors.xp = 'Điểm thưởng XP phải từ 1 đến 200';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const catObj = CATEGORIES.find((c) => c.key === formCategory);
    const durationSeconds = editingVideo?.durationSeconds || 300;
    const durationStr = editingVideo?.duration || '5:00';

    const videoData: VideoLesson = {
      id: editingVideo ? editingVideo.id : `vid-${Date.now()}`,
      title: formTitle.trim(),
      description: formDesc.trim() || `Video bài học kỹ năng sống chủ đề ${catObj?.label || ''}`,
      category: formCategory,
      categoryLabel: catObj ? catObj.label : 'Kỹ năng',
      ageMin: formAgeMin,
      ageMax: formAgeMax,
      ageLabel: `${formAgeMin}-${formAgeMax} tuổi`,
      duration: durationStr,
      durationSeconds,
      thumbnail_emoji: formEmoji,
      thumbnail_color: formColor,
      video_url: formUrl.trim(),
      instructor: editingVideo?.instructor || 'Giáo viên KidLife',
      reward_xp: Number(formXP),
      views: editingVideo ? editingVideo.views : 0,
      tags: formTags,
      status: formStatus,
      keyTakeaways: formTakeaways.length > 0 ? formTakeaways : ['Xem video và ghi nhớ bài học nhé bé!'],
    };

    updateVideoInBank(videoData);
    setIsFormModalOpen(false);
    loadData();
  };

  // Toggle Visibility directly
  const handleToggleVisibility = (videoId: string) => {
    toggleVideoVisibility(videoId);
    loadData();
  };

  // Delete Video
  const handleDeleteVideo = () => {
    if (!deleteConfirmVideo) return;
    deleteVideoFromBank(deleteConfirmVideo.id);
    setDeleteConfirmVideo(null);
    loadData();
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Mã video', 'Tiêu đề', 'Chủ đề', 'Lứa tuổi', 'Thời lượng', 'Giảng viên', 'XP thưởng', 'Lượt xem', 'Trạng thái', 'Có URL'];
    const rows = filteredVideos.map((v) => [
      v.id,
      v.title,
      v.categoryLabel,
      v.ageLabel,
      v.duration,
      v.instructor,
      v.reward_xp,
      v.views,
      v.status === 'hidden' ? 'Ẩn' : 'Hiện',
      v.video_url ? 'Có' : 'Chưa',
    ]);
    exportToCSV('kidlife_admin_videobank', headers, rows);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 50 }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--admin-ink)', margin: 0 }}>
            🎬 Ngân hàng Video bài học
          </h1>
          <p style={{ color: 'var(--admin-muted)', fontSize: 14, margin: '4px 0 0' }}>
            Quản lý kho nội dung video học kỹ năng sống để phụ huynh chọn giao cho bé
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={handleExportCSV}
            className="admin-btn admin-btn-outline"
            style={{ borderRadius: 'var(--admin-radius-btn)', fontWeight: 700 }}
          >
            <IoDownloadOutline size={16} /> Xuất CSV
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="admin-btn admin-btn-primary"
            style={{ borderRadius: 'var(--admin-radius-btn)', fontWeight: 700 }}
          >
            <IoAddCircleOutline size={18} /> + Upload video mới
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div className="admin-card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)' }}>Tổng video trong kho</span>
            <span style={{ fontSize: 24 }}>🎬</span>
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--admin-ink)', marginTop: 6 }}>
            {totalCount} video
          </div>
        </div>

        <div className="admin-card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)' }}>Đang hiển thị cho Phụ huynh</span>
            <span style={{ fontSize: 24 }}>✅</span>
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--admin-success)', marginTop: 6 }}>
            {visibleCount} đang hiện
          </div>
        </div>

        <div className="admin-card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)' }}>Đang tạm ẩn</span>
            <span style={{ fontSize: 24 }}>🔒</span>
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--admin-danger)', marginTop: 6 }}>
            {hiddenCount} đang ẩn
          </div>
        </div>

        <div className="admin-card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)' }}>Đã gắn URL video thực tế</span>
            <span style={{ fontSize: 24 }}>▶️</span>
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--admin-primary)', marginTop: 6 }}>
            {hasUrlCount} video
          </div>
        </div>
      </div>

      {/* Filter and Search Bar - 1 Single Horizontal Row */}
      <div
        style={{
          background: 'var(--admin-surface)',
          borderRadius: 'var(--admin-radius-card)',
          padding: '12px 18px',
          marginBottom: 24,
          border: '1px solid var(--admin-border)',
          boxShadow: 'var(--admin-shadow)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <input
            placeholder="Tìm theo tiêu đề, giảng viên, mô tả..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              height: 40,
              padding: '0 14px 0 38px',
              borderRadius: 'var(--admin-radius-btn)',
              border: '1px solid var(--admin-border)',
              background: 'var(--admin-bg)',
              fontSize: 14,
              outline: 'none',
            }}
          />
          <IoSearchOutline
            size={18}
            color="var(--admin-muted)"
            style={{ position: 'absolute', left: 12, top: 11 }}
          />
        </div>

        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          style={{
            height: 40,
            padding: '0 14px',
            borderRadius: 'var(--admin-radius-btn)',
            border: '1px solid var(--admin-border)',
            background: 'var(--admin-surface)',
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--admin-ink)',
            cursor: 'pointer',
            minWidth: 140,
          }}
        >
          <option value="all">Mọi chủ đề</option>
          {CATEGORIES.map((c) => (
            <option key={c.key} value={c.key}>
              {c.emoji} {c.label}
            </option>
          ))}
        </select>

        <select
          value={filterAge}
          onChange={(e) => setFilterAge(e.target.value)}
          style={{
            height: 40,
            padding: '0 14px',
            borderRadius: 'var(--admin-radius-btn)',
            border: '1px solid var(--admin-border)',
            background: 'var(--admin-surface)',
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--admin-ink)',
            cursor: 'pointer',
            minWidth: 130,
          }}
        >
          <option value="all">Mọi lứa tuổi</option>
          <option value="4">4 tuổi</option>
          <option value="5">5 tuổi</option>
          <option value="6">6 tuổi</option>
          <option value="7">7 tuổi</option>
          <option value="8">8 tuổi</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            height: 40,
            padding: '0 14px',
            borderRadius: 'var(--admin-radius-btn)',
            border: '1px solid var(--admin-border)',
            background: 'var(--admin-surface)',
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--admin-ink)',
            cursor: 'pointer',
            minWidth: 140,
          }}
        >
          <option value="all">Mọi trạng thái</option>
          <option value="visible">✅ Đang hiện</option>
          <option value="hidden">🔒 Đang ẩn</option>
        </select>
      </div>

      {/* Video Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 }}>
        {filteredVideos.map((video) => {
          const isHidden = video.status === 'hidden';
          return (
            <div
              key={video.id}
              className="admin-card"
              style={{
                padding: 0,
                borderRadius: 'var(--admin-radius-card)',
                overflow: 'hidden',
                border: isHidden ? '1px dashed var(--admin-danger)' : '1px solid var(--admin-border)',
                opacity: isHidden ? 0.8 : 1,
              }}
            >
              {/* Thumbnail header */}
              <div
                onClick={() => handleOpenEditModal(video)}
                style={{
                  height: 140,
                  background: video.thumbnail_color || '#EEF2FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  cursor: 'pointer',
                }}
                title="Bấm vào để chỉnh sửa bài học video này"
              >
                <span style={{ fontSize: 56 }}>{video.thumbnail_emoji}</span>

                {/* Duration */}
                <span
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    background: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    borderRadius: 6,
                    padding: '2px 8px',
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <IoTimeOutline size={12} /> {video.duration}
                </span>

                {/* Status Badge */}
                <div style={{ position: 'absolute', top: 8, left: 8 }}>
                  {isHidden ? (
                    <span className="admin-badge badge-danger">🔒 Đang ẩn</span>
                  ) : (
                    <span className="admin-badge badge-success">✅ Đang hiện</span>
                  )}
                </div>

                {/* URL indicator */}
                {video.video_url && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      background: 'rgba(109, 79, 224, 0.9)',
                      color: '#ffffff',
                      borderRadius: 6,
                      padding: '2px 8px',
                      fontSize: 11,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <IoLinkOutline size={12} /> Có URL
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div style={{ padding: 18, display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span className="admin-badge badge-primary">{video.categoryLabel}</span>
                  <span style={{ fontSize: 12, color: 'var(--admin-muted)' }}>• {video.ageLabel}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#D97706', marginLeft: 'auto' }}>
                    +{video.reward_xp} XP
                  </span>
                </div>

                <h3
                  onClick={() => handleOpenEditModal(video)}
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: 'var(--admin-ink)',
                    margin: '0 0 6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  title="Bấm vào để chỉnh sửa bài học video này"
                >
                  <span>{video.title}</span>
                  <span style={{ fontSize: 11, color: 'var(--admin-primary)', fontWeight: 700 }}>✏️</span>
                </h3>

                <p
                  style={{
                    fontSize: 12.5,
                    color: 'var(--admin-muted)',
                    lineHeight: 1.45,
                    margin: '0 0 14px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    flex: 1,
                  }}
                >
                  {video.description}
                </p>

                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--admin-muted)',
                    marginBottom: 14,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>👤 {video.instructor}</span>
                  <span>👁️ {video.views.toLocaleString()} xem</span>
                </div>

                {/* Card Actions */}
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    borderTop: '1px solid var(--admin-border)',
                    paddingTop: 12,
                  }}
                >
                  <button
                    onClick={() => setPreviewVideo(video)}
                    className="admin-btn admin-btn-outline"
                    style={{ flex: 1, padding: '6px 8px', fontSize: 12 }}
                  >
                    <IoEyeOutline size={15} /> Xem trước
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(video)}
                    className="admin-btn admin-btn-outline"
                    style={{ flex: 1, padding: '6px 8px', fontSize: 12 }}
                  >
                    <IoPencilOutline size={15} /> Sửa
                  </button>

                  <button
                    onClick={() => handleToggleVisibility(video.id)}
                    className="admin-btn"
                    style={{
                      padding: '6px 10px',
                      fontSize: 12,
                      background: isHidden ? 'rgba(47, 158, 86, 0.12)' : 'rgba(213, 71, 63, 0.12)',
                      color: isHidden ? 'var(--admin-success)' : 'var(--admin-danger)',
                      border: 'none',
                    }}
                    title={isHidden ? 'Bấm để Hiện video' : 'Bấm để Ẩn video'}
                  >
                    {isHidden ? 'Hiện' : 'Ẩn'}
                  </button>

                  <button
                    onClick={() => setDeleteConfirmVideo(video)}
                    className="admin-btn admin-btn-danger"
                    style={{ padding: '6px 10px', fontSize: 12 }}
                    title="Xóa video"
                  >
                    <IoTrashOutline size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredVideos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--admin-muted)' }}>
          <span style={{ fontSize: 48 }}>🎬</span>
          <p style={{ marginTop: 10, fontSize: 15 }}>Không tìm thấy video bài học nào</p>
        </div>
      )}

      {/* ─────────────────── MODAL TẠO / SỬA VIDEO ─────────────────── */}
      <AnimatePresence>
        {isFormModalOpen && (
          <div className="admin-modal-overlay" onClick={() => setIsFormModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="admin-modal"
              style={{
                width: 740,
                maxHeight: '90vh',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                padding: 0,
                borderRadius: 'var(--admin-radius-card)',
              }}
            >
              <div
                style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid var(--admin-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#FAFBFD',
                }}
              >
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: 'var(--admin-ink)' }}>
                    {editingVideo ? '✏️ Chỉnh sửa video bài học' : '➕ Thêm video bài học mới'}
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--admin-muted)' }}>
                    Cấu hình thông tin, URL phát video và nội dung bài học rút ra
                  </p>
                </div>
                <button
                  onClick={() => setIsFormModalOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                >
                  <IoClose size={22} color="var(--admin-muted)" />
                </button>
              </div>

              <form onSubmit={handleSaveVideo} style={{ padding: '24px', flex: 1 }}>
                <h4 style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', color: 'var(--admin-primary)', marginBottom: 14 }}>
                  I. Thông tin bài học
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 20 }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                      Tiêu đề bài học: <span style={{ color: 'var(--admin-danger)' }}>*</span>
                    </label>
                    <input
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="Ví dụ: Cách đánh răng đúng cách..."
                      style={{
                        width: '100%',
                        height: 40,
                        padding: '0 12px',
                        borderRadius: 8,
                        border: `1px solid ${formErrors.title ? 'var(--admin-danger)' : 'var(--admin-border)'}`,
                        fontSize: 14,
                      }}
                    />
                    {formErrors.title && (
                      <span style={{ fontSize: 12, color: 'var(--admin-danger)', marginTop: 2, display: 'block' }}>
                        {formErrors.title}
                      </span>
                    )}
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                      Mô tả:
                    </label>
                    <textarea
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      placeholder="Mô tả tóm tắt nội dung video..."
                      rows={2}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: '1px solid var(--admin-border)',
                        fontSize: 13.5,
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                      Chủ đề: <span style={{ color: 'var(--admin-danger)' }}>*</span>
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as VideoCategory)}
                      style={{
                        width: '100%',
                        height: 40,
                        padding: '0 10px',
                        borderRadius: 8,
                        border: '1px solid var(--admin-border)',
                        fontSize: 14,
                      }}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.key} value={c.key}>
                          {c.emoji} {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                      Lứa tuổi: <span style={{ color: 'var(--admin-danger)' }}>*</span>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="number"
                        min={3}
                        max={12}
                        value={formAgeMin}
                        onChange={(e) => setFormAgeMin(Number(e.target.value))}
                        style={{
                          width: 70,
                          height: 40,
                          textAlign: 'center',
                          borderRadius: 8,
                          border: '1px solid var(--admin-border)',
                        }}
                      />
                      <span>đến</span>
                      <input
                        type="number"
                        min={3}
                        max={15}
                        value={formAgeMax}
                        onChange={(e) => setFormAgeMax(Number(e.target.value))}
                        style={{
                          width: 70,
                          height: 40,
                          textAlign: 'center',
                          borderRadius: 8,
                          border: '1px solid var(--admin-border)',
                        }}
                      />
                      <span>tuổi</span>
                    </div>
                  </div>



                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                      XP thưởng khi xem xong: <span style={{ color: 'var(--admin-danger)' }}>*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={200}
                      value={formXP}
                      onChange={(e) => setFormXP(Number(e.target.value))}
                      style={{
                        width: '100%',
                        height: 40,
                        padding: '0 12px',
                        borderRadius: 8,
                        border: '1px solid var(--admin-border)',
                        fontSize: 14,
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                      Trạng thái hiển thị:
                    </label>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', height: 40 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 14 }}>
                        <input
                          type="radio"
                          name="vStatus"
                          checked={formStatus === 'visible'}
                          onChange={() => setFormStatus('visible')}
                        />
                        ✅ Hiện
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 14 }}>
                        <input
                          type="radio"
                          name="vStatus"
                          checked={formStatus === 'hidden'}
                          onChange={() => setFormStatus('hidden')}
                        />
                        🔒 Ẩn
                      </label>
                    </div>
                  </div>

                  {/* Thumbnail Emoji & Color */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>
                      Chọn Emoji đại diện & Màu nền card:
                    </label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                      {EMOJIS.map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => setFormEmoji(em)}
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 8,
                            border: formEmoji === em ? '2px solid var(--admin-primary)' : '1px solid var(--admin-border)',
                            background: formEmoji === em ? 'rgba(109, 79, 224, 0.1)' : '#ffffff',
                            fontSize: 18,
                            cursor: 'pointer',
                          }}
                        >
                          {em}
                        </button>
                      ))}

                      <div style={{ marginLeft: 16, display: 'flex', gap: 6, alignItems: 'center' }}>
                        {PASTEL_COLORS.map((col) => (
                          <div
                            key={col}
                            onClick={() => setFormColor(col)}
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 12,
                              background: col,
                              border: formColor === col ? '2px solid var(--admin-primary)' : '1px solid #ccc',
                              cursor: 'pointer',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section II: Video URL */}
                <h4 style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', color: 'var(--admin-primary)', marginBottom: 10, borderTop: '1px solid var(--admin-border)', paddingTop: 18 }}>
                  II. Video URL
                </h4>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                    🔗 URL Video (YouTube, Vimeo hoặc Direct MP4):
                  </label>
                  <input
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... hoặc để trống"
                    style={{
                      width: '100%',
                      height: 40,
                      padding: '0 12px',
                      borderRadius: 8,
                      border: '1px solid var(--admin-border)',
                      fontSize: 13.5,
                    }}
                  />
                  <span style={{ fontSize: 12, color: 'var(--admin-muted)', marginTop: 4, display: 'block' }}>
                    💡 Hỗ trợ: YouTube URL, Vimeo URL, MP4 trực tiếp. Nếu để trống, hệ thống sẽ sử dụng trình phát giả lập (Placeholder player) dành cho trẻ em.
                  </span>
                </div>

                {/* Section III: Key Takeaways */}
                <h4 style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', color: 'var(--admin-primary)', marginBottom: 10, borderTop: '1px solid var(--admin-border)', paddingTop: 18 }}>
                  III. Nội dung bài học rút ra (Key Takeaways)
                </h4>

                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'grid', gap: 8, marginBottom: 10 }}>
                    {formTakeaways.map((point, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: 'var(--admin-primary)', fontWeight: 800 }}>•</span>
                        <input
                          value={point}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormTakeaways((prev) => prev.map((p, i) => (i === idx ? val : p)));
                          }}
                          style={{
                            flex: 1,
                            height: 36,
                            padding: '0 10px',
                            borderRadius: 6,
                            border: '1px solid var(--admin-border)',
                            fontSize: 13,
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setFormTakeaways((prev) => prev.filter((_, i) => i !== idx))}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--admin-danger)' }}
                        >
                          <IoClose size={18} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      value={newTakeawayInput}
                      onChange={(e) => setNewTakeawayInput(e.target.value)}
                      placeholder="Thêm điểm rút ra của bài học..."
                      style={{
                        flex: 1,
                        height: 36,
                        padding: '0 10px',
                        borderRadius: 6,
                        border: '1px solid var(--admin-border)',
                        fontSize: 13,
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newTakeawayInput.trim()) {
                            setFormTakeaways((prev) => [...prev, newTakeawayInput.trim()]);
                            setNewTakeawayInput('');
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newTakeawayInput.trim()) {
                          setFormTakeaways((prev) => [...prev, newTakeawayInput.trim()]);
                          setNewTakeawayInput('');
                        }
                      }}
                      className="admin-btn admin-btn-outline"
                      style={{ padding: '0 14px', fontSize: 13 }}
                    >
                      + Thêm
                    </button>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 12,
                    borderTop: '1px solid var(--admin-border)',
                    paddingTop: 16,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="admin-btn admin-btn-outline"
                  >
                    Hủy bỏ
                  </button>
                  <button type="submit" className="admin-btn admin-btn-primary">
                    💾 Lưu video
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────── MODAL XEM TRƯỚC VIDEO ─────────────────── */}
      <AnimatePresence>
        {previewVideo && (
          <div className="admin-modal-overlay" onClick={() => setPreviewVideo(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="admin-modal"
              style={{
                width: 700,
                maxHeight: '85vh',
                overflowY: 'auto',
                padding: 0,
                borderRadius: 'var(--admin-radius-card)',
              }}
            >
              <div
                style={{
                  padding: '18px 24px',
                  borderBottom: '1px solid var(--admin-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#FAFBFD',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 32 }}>🎬</span>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: 'var(--admin-ink)' }}>
                      Xem trước: {previewVideo.title}
                    </h3>
                    <div style={{ fontSize: 12, color: 'var(--admin-muted)', marginTop: 2 }}>
                      {previewVideo.categoryLabel} • {previewVideo.ageLabel} • {previewVideo.duration} • Giảng viên: {previewVideo.instructor}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewVideo(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <IoClose size={20} color="var(--admin-muted)" />
                </button>
              </div>

              {/* Player Area */}
              <div style={{ padding: '20px 24px' }}>
                <div
                  style={{
                    borderRadius: 16,
                    overflow: 'hidden',
                    background: '#0F172A',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    marginBottom: 16,
                  }}
                >
                  {getYouTubeEmbedUrl(previewVideo.video_url) ? (
                    <iframe
                      src={getYouTubeEmbedUrl(previewVideo.video_url)!}
                      title={previewVideo.title}
                      style={{ width: '100%', height: 340, border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : previewVideo.video_url.endsWith('.mp4') ? (
                    <video
                      controls
                      src={previewVideo.video_url}
                      style={{ width: '100%', maxHeight: 340 }}
                    />
                  ) : (
                    <div
                      style={{
                        height: 240,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                      }}
                    >
                      <span style={{ fontSize: 72 }}>{previewVideo.thumbnail_emoji}</span>
                      <div style={{ fontWeight: 800, fontSize: 17, marginTop: 10 }}>{previewVideo.title}</div>
                      <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>
                        (Chưa có URL video — Trình phát giả lập animation dành cho bé)
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: 14 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--admin-ink)', marginBottom: 4 }}>
                    Mô tả bài học
                  </h4>
                  <p style={{ fontSize: 13, color: 'var(--admin-muted)', margin: 0, lineHeight: 1.5 }}>
                    {previewVideo.description}
                  </p>
                </div>

                {/* Takeaways */}
                <div
                  style={{
                    background: 'var(--admin-bg)',
                    borderRadius: 10,
                    padding: 14,
                    border: '1px solid var(--admin-border)',
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--admin-primary)', marginBottom: 8 }}>
                    📌 Bài học rút ra cho bé:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 4 }}>
                    {previewVideo.keyTakeaways.map((point, idx) => (
                      <li key={idx} style={{ fontSize: 12.5, color: '#444' }}>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div
                style={{
                  padding: '14px 24px',
                  borderTop: '1px solid var(--admin-border)',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 10,
                }}
              >
                <button
                  onClick={() => {
                    const target = previewVideo;
                    setPreviewVideo(null);
                    handleOpenEditModal(target);
                  }}
                  className="admin-btn admin-btn-outline"
                >
                  ✏️ Sửa ngay
                </button>
                <button onClick={() => setPreviewVideo(null)} className="admin-btn admin-btn-primary">
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────── CONFIRM DIALOG XÓA ─────────────────── */}
      <AnimatePresence>
        {deleteConfirmVideo && (
          <div className="admin-modal-overlay" onClick={() => setDeleteConfirmVideo(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="admin-modal"
              style={{ width: 440 }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
              <div className="admin-modal-title">Xác nhận xóa video</div>
              <div className="admin-modal-desc">
                Bạn có chắc chắn muốn xóa video bài học: <br />
                <strong>
                  "{deleteConfirmVideo.thumbnail_emoji} {deleteConfirmVideo.title}"
                </strong>
                ?<br />
                <span style={{ color: 'var(--admin-danger)', fontSize: 13, marginTop: 4, display: 'block' }}>
                  Hành động này không thể hoàn tác. Các gia đình đã gán video này sẽ mất quyền xem bài học.
                </span>
              </div>
              <div className="admin-modal-actions">
                <button onClick={() => setDeleteConfirmVideo(null)} className="admin-btn admin-btn-outline">
                  Hủy
                </button>
                <button onClick={handleDeleteVideo} className="admin-btn admin-btn-danger">
                  🗑️ Xóa vĩnh viễn
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
