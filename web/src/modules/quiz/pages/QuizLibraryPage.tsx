import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSearchOutline, IoCloseCircle, IoSparkles, IoCheckmarkCircle, IoTimeOutline, IoStar } from 'react-icons/io5';
import { getAllQuizSets } from '@/shared/utils/quizStorage';
import { QuizSet } from '@/shared/types/quiz';

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

export default function QuizLibraryPage() {
  const navigate = useNavigate();
  const [selectedCat, setSelectedCat] = useState('all');
  const [search, setSearch] = useState('');
  const [quizSets, setQuizSets] = useState<QuizSet[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    // TODO: Replace with API call → GET /api/quizsets?category=...
    setLoading(true);
    setTimeout(() => {
      setQuizSets(getAllQuizSets());
      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    loadData();
    const handleProgressUpdate = () => {
      setQuizSets(getAllQuizSets());
    };
    window.addEventListener('kidlife_quiz_progress_update', handleProgressUpdate);
    window.addEventListener('kidlife_custom_quiz_created', handleProgressUpdate);
    window.addEventListener('focus', handleProgressUpdate);
    return () => {
      window.removeEventListener('kidlife_quiz_progress_update', handleProgressUpdate);
      window.removeEventListener('kidlife_custom_quiz_created', handleProgressUpdate);
      window.removeEventListener('focus', handleProgressUpdate);
    };
  }, []);

  const filteredSets = quizSets.filter((item) => {
    // Chỉ hiển thị các bộ đề được giao
    if (!item.isAssigned) return false;
    if (selectedCat !== 'all' && item.category !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
    }
    return true;
  });

  const completedCount = quizSets.filter((s) => s.isCompleted).length;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 40 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="web-page-header"
        style={{ marginBottom: 20 }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 32 }}>🧠</span>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--kl-primary-dark)' }}>
              Kiểm Tra Trí Nhớ
            </h1>
          </div>
          <p style={{ color: 'var(--kl-muted)', fontSize: 14, marginTop: 4 }}>
            Ôn luyện và kiểm tra những gì bé đã học qua các câu đố vui thú vị!
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
            {quizSets.length} bộ đề
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
              ✅ Đã hoàn thành {completedCount}
            </span>
          )}
        </div>
      </motion.div>

      {/* Search Bar */}
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
          placeholder="Tìm kiếm bộ đề kiểm tra trí nhớ..."
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

      {/* Category Filter Tabs */}
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

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            style={{ fontSize: 40, display: 'inline-block' }}
          >
            🧠
          </motion.div>
          <p style={{ marginTop: 12, color: 'var(--kl-muted)', fontWeight: 600 }}>
            Đang chuẩn bị bộ câu hỏi cho bé...
          </p>
        </div>
      )}

      {/* Quiz Grid */}
      {!loading && (
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
          {filteredSets.map((quiz) => {
            const catColor = CATEGORY_COLORS[quiz.category] || { bg: '#EEF2FF', text: '#4F46E5' };
            const isDone = quiz.isCompleted;

            return (
              <motion.div
                key={quiz.id}
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
                  border: isDone ? '2px solid #10B981' : '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#ffffff',
                }}
              >
                {/* Banner / Emoji Top */}
                <div
                  style={{
                    height: 120,
                    background: isDone
                      ? 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)'
                      : 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <span style={{ fontSize: 56 }}>{quiz.emoji}</span>

                  {/* Badges */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 6,
                    }}
                  >
                    {isDone && (
                      <span
                        style={{
                          background: '#10B981',
                          color: '#ffffff',
                          borderRadius: 20,
                          padding: '3px 10px',
                          fontSize: 11,
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)',
                        }}
                      >
                        <IoCheckmarkCircle size={14} /> Đã làm • {quiz.lastScore}/{quiz.questionCount}
                      </span>
                    )}

                    {quiz.isCustom && (
                      <span
                        style={{
                          background: '#F59E0B',
                          color: '#ffffff',
                          borderRadius: 20,
                          padding: '3px 10px',
                          fontSize: 11,
                          fontWeight: 800,
                          boxShadow: '0 2px 6px rgba(245, 158, 11, 0.3)',
                        }}
                      >
                        📝 Ba/Mẹ tạo
                      </span>
                    )}

                    {!isDone && !quiz.isCustom && quiz.id === 'quiz-6' && (
                      <span
                        style={{
                          background: '#EF4444',
                          color: '#ffffff',
                          borderRadius: 20,
                          padding: '3px 10px',
                          fontSize: 11,
                          fontWeight: 800,
                        }}
                      >
                        🔥 Mới
                      </span>
                    )}
                  </div>

                  {/* Reward XP tag */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 10,
                      right: 10,
                      background: '#FEF08A',
                      color: '#854D0E',
                      borderRadius: 14,
                      padding: '4px 10px',
                      fontSize: 12,
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <IoStar size={14} color="#D97706" />
                    +{quiz.reward_xp} XP
                  </div>
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
                      {quiz.categoryLabel}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--kl-muted)' }}>
                      • {quiz.ageRange}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: 'var(--kl-primary-dark)',
                      marginBottom: 6,
                      lineHeight: 1.35,
                    }}
                  >
                    {quiz.title}
                  </h3>

                  <p
                    style={{
                      fontSize: 12.5,
                      color: 'var(--kl-muted)',
                      lineHeight: 1.4,
                      marginBottom: 16,
                      flex: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {quiz.description}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--kl-muted)', fontSize: 12 }}>
                      <IoTimeOutline size={15} />
                      <span>{quiz.questionCount} câu hỏi • {quiz.pass_score}% đạt</span>
                    </div>

                    <button
                      onClick={() => navigate(`/child/quiz/${quiz.id}`)}
                      className="kl-btn"
                      style={{
                        background: isDone ? '#10B981' : 'var(--kl-primary)',
                        color: '#ffffff',
                        padding: '8px 16px',
                        borderRadius: 14,
                        fontSize: 13,
                        fontWeight: 800,
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: isDone
                          ? '0 3px 8px rgba(16, 185, 129, 0.25)'
                          : '0 3px 8px rgba(43, 68, 232, 0.25)',
                      }}
                    >
                      {isDone ? 'Làm lại 🔄' : 'Làm bài ▶'}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && filteredSets.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '70px 20px',
            background: '#ffffff',
            borderRadius: 24,
            border: '1px dashed #CBD5E1',
            marginTop: 20,
          }}
        >
          <span style={{ fontSize: 56 }}>🧠</span>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginTop: 12, color: 'var(--kl-primary-dark)' }}>
            Không tìm thấy bộ đề phù hợp
          </h3>
          <p style={{ color: 'var(--kl-muted)', fontSize: 14, marginTop: 4 }}>
            Thử tìm kiếm với từ khóa khác hoặc chọn mục "Tất cả" nhé bé ơi!
          </p>
          <button
            onClick={() => {
              setSelectedCat('all');
              setSearch('');
            }}
            className="kl-btn kl-btn-primary kl-btn-sm"
            style={{ marginTop: 16 }}
          >
            Xem tất cả bộ đề
          </button>
        </div>
      )}
    </div>
  );
}
