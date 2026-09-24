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
  IoArrowUpOutline,
  IoArrowDownOutline,
  IoStar,
} from 'react-icons/io5';
import {
  getAdminQuizBank,
  saveAdminQuizBank,
  updateQuizSetInBank,
  deleteQuizSetFromBank,
  exportToCSV,
} from '@/shared/utils/contentStorage';
import { QuizSet, QuizCategory, QuizQuestion, QuizOption } from '@/shared/types/quiz';

const CATEGORIES: { key: QuizCategory; label: string; emoji: string }[] = [
  { key: 've_sinh', label: 'Vệ sinh', emoji: '🧼' },
  { key: 'tu_lap', label: 'Tự lập', emoji: '👕' },
  { key: 'giao_tiep', label: 'Giao tiếp', emoji: '🙏' },
  { key: 'cam_xuc', label: 'Cảm xúc', emoji: '🤝' },
  { key: 'sang_tao', label: 'Sáng tạo', emoji: '🎨' },
  { key: 'le_phep', label: 'Lễ phép', emoji: '😊' },
  { key: 'suc_khoe', label: 'Sức khỏe', emoji: '💪' },
];

const EMOJIS = ['🧠', '🦷', '👕', '🙏', '🎨', '🧼', '🤝', '📚', '😊', '🌙', '💧', '🍎', '⭐', '🌈', '🚲'];
const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function AdminQuizBankPage() {
  const [bank, setBank] = useState<QuizSet[]>([]);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterAge, setFilterAge] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Modals state
  const [editingQuiz, setEditingQuiz] = useState<QuizSet | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [previewQuiz, setPreviewQuiz] = useState<QuizSet | null>(null);
  const [deleteConfirmQuiz, setDeleteConfirmQuiz] = useState<QuizSet | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState<QuizCategory>('ve_sinh');
  const [formAgeMin, setFormAgeMin] = useState(4);
  const [formAgeMax, setFormAgeMax] = useState(6);
  const [formEmoji, setFormEmoji] = useState('🧠');
  const [formXP, setFormXP] = useState(30);
  const [formPassScore, setFormPassScore] = useState(70);
  const [formTimePerQ, setFormTimePerQ] = useState(30);
  const [formDifficulty, setFormDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [formStatus, setFormStatus] = useState<'visible' | 'hidden'>('visible');
  const [formQuestions, setFormQuestions] = useState<QuizQuestion[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const loadData = () => {
    // TODO: Replace with API call → GET /api/admin/quiz-bank
    setBank(getAdminQuizBank());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => setBank(getAdminQuizBank());
    window.addEventListener('kidlife_admin_quizbank_update', handleUpdate);
    return () => window.removeEventListener('kidlife_admin_quizbank_update', handleUpdate);
  }, []);

  // Filtered bank
  const filteredBank = bank.filter((q) => {
    if (filterCat !== 'all' && q.category !== filterCat) return false;
    if (filterDifficulty !== 'all' && q.difficulty !== filterDifficulty) return false;
    if (filterAge !== 'all') {
      const ageNum = parseInt(filterAge);
      if (q.ageMin && q.ageMax) {
        if (ageNum < q.ageMin || ageNum > q.ageMax) return false;
      } else if (!q.ageRange.includes(filterAge)) {
        return false;
      }
    }
    if (search.trim()) {
      const query = search.toLowerCase();
      return q.title.toLowerCase().includes(query) || q.description.toLowerCase().includes(query);
    }
    return true;
  });

  // Pagination calculation
  const totalItems = filteredBank.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE) || 1;
  const paginatedBank = filteredBank.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Open Form for Create
  const handleOpenCreateModal = () => {
    setEditingQuiz(null);
    setFormTitle('');
    setFormDesc('');
    setFormCategory('ve_sinh');
    setFormAgeMin(4);
    setFormAgeMax(6);
    setFormEmoji('🧠');
    setFormXP(30);
    setFormPassScore(70);
    setFormTimePerQ(30);
    setFormDifficulty('easy');
    setFormStatus('visible');
    setFormQuestions([
      {
        id: `q-new-1-${Date.now()}`,
        question: '',
        options: [
          { id: 'opt-a', text: '' },
          { id: 'opt-b', text: '' },
        ],
        correct_answer: 'opt-a',
        explanation: '',
      },
      {
        id: `q-new-2-${Date.now()}`,
        question: '',
        options: [
          { id: 'opt-a', text: '' },
          { id: 'opt-b', text: '' },
        ],
        correct_answer: 'opt-a',
        explanation: '',
      },
      {
        id: `q-new-3-${Date.now()}`,
        question: '',
        options: [
          { id: 'opt-a', text: '' },
          { id: 'opt-b', text: '' },
        ],
        correct_answer: 'opt-a',
        explanation: '',
      },
    ]);
    setFormErrors({});
    setIsCreateModalOpen(true);
  };

  // Open Form for Edit
  const handleOpenEditModal = (quiz: QuizSet) => {
    setEditingQuiz(quiz);
    setFormTitle(quiz.title);
    setFormDesc(quiz.description || '');
    setFormCategory(quiz.category);
    setFormAgeMin(quiz.ageMin || 4);
    setFormAgeMax(quiz.ageMax || 6);
    setFormEmoji(quiz.emoji || '🧠');
    setFormXP(quiz.reward_xp || 30);
    setFormPassScore(quiz.pass_score || 70);
    setFormTimePerQ(quiz.time_per_question || 30);
    setFormDifficulty(quiz.difficulty || 'medium');
    setFormStatus(quiz.status || 'visible');
    setFormQuestions(JSON.parse(JSON.stringify(quiz.questions || [])));
    setFormErrors({});
    setIsCreateModalOpen(true);
  };

  // Form Validation & Save
  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formTitle.trim()) {
      errors.title = 'Tên bộ đề không được để trống';
    } else if (formTitle.trim().length < 3 || formTitle.trim().length > 100) {
      errors.title = 'Tên bộ đề phải từ 3 đến 100 ký tự';
    }

    if (formAgeMin > formAgeMax) {
      errors.age = 'Lứa tuổi bắt đầu phải nhỏ hơn hoặc bằng lứa tuổi kết thúc';
    }

    if (formXP < 1 || formXP > 500) {
      errors.xp = 'Điểm thưởng XP phải từ 1 đến 500';
    }

    if (formPassScore < 1 || formPassScore > 100) {
      errors.passScore = 'Điểm sàn đạt phải từ 1% đến 100%';
    }

    if (formQuestions.length < 3) {
      errors.questions = 'Bộ đề phải có tối thiểu 3 câu hỏi';
    }

    formQuestions.forEach((q, idx) => {
      if (!q.question.trim()) {
        errors[`q_${idx}_content`] = `Câu hỏi #${idx + 1} chưa có nội dung`;
      }
      if (q.options.length < 2) {
        errors[`q_${idx}_options`] = `Câu hỏi #${idx + 1} phải có tối thiểu 2 đáp án`;
      }
      q.options.forEach((opt, oIdx) => {
        if (!opt.text.trim()) {
          errors[`q_${idx}_opt_${oIdx}`] = `Câu hỏi #${idx + 1} - Đáp án ${OPTION_LABELS[oIdx] || oIdx + 1} chưa có nội dung`;
        }
      });
      if (!q.correct_answer) {
        errors[`q_${idx}_correct`] = `Vui lòng chọn đáp án đúng cho Câu hỏi #${idx + 1}`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const catObj = CATEGORIES.find((c) => c.key === formCategory);

    const quizData: QuizSet = {
      id: editingQuiz ? editingQuiz.id : `quiz-${Date.now()}`,
      title: formTitle.trim(),
      description: formDesc.trim() || `Bộ đề rèn luyện kỹ năng ${catObj?.label || ''}`,
      category: formCategory,
      categoryLabel: catObj ? catObj.label : 'Kỹ năng',
      ageRange: `${formAgeMin}-${formAgeMax} tuổi`,
      ageMin: formAgeMin,
      ageMax: formAgeMax,
      emoji: formEmoji,
      questionCount: formQuestions.length,
      reward_xp: Number(formXP),
      pass_score: Number(formPassScore),
      time_per_question: Number(formTimePerQ),
      difficulty: formDifficulty,
      status: formStatus,
      questions: formQuestions,
    };

    updateQuizSetInBank(quizData);
    setIsCreateModalOpen(false);
    loadData();
  };

  // Reorder questions
  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formQuestions.length) return;
    const updated = [...formQuestions];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFormQuestions(updated);
  };

  // Delete Quiz
  const handleDeleteQuiz = () => {
    if (!deleteConfirmQuiz) return;
    deleteQuizSetFromBank(deleteConfirmQuiz.id);
    setDeleteConfirmQuiz(null);
    loadData();
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Mã bộ đề', 'Tên bộ đề', 'Chủ đề', 'Lứa tuổi', 'Số câu hỏi', 'XP thưởng', 'Điểm sàn', 'Độ khó', 'Trạng thái'];
    const rows = filteredBank.map((q) => [
      q.id,
      q.title,
      q.categoryLabel,
      q.ageRange,
      q.questions.length,
      q.reward_xp,
      `${q.pass_score}%`,
      q.difficulty === 'easy' ? 'Dễ' : q.difficulty === 'medium' ? 'Trung bình' : 'Khó',
      q.status === 'hidden' ? 'Ẩn' : 'Hiện',
    ]);
    exportToCSV('kidlife_admin_quizbank', headers, rows);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--admin-ink)', margin: 0 }}>
            🧠 Ngân hàng đề thi Quiz
          </h1>
          <p style={{ color: 'var(--admin-muted)', fontSize: 14, margin: '4px 0 0' }}>
            Quản lý toàn bộ câu hỏi trắc nghiệm gốc cho phụ huynh chọn và gán cho các bé
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
            <IoAddCircleOutline size={18} /> + Tạo bộ đề mới
          </button>
        </div>
      </div>

      {/* Filter and Search Bar - 1 Single Horizontal Row */}
      <div
        style={{
          background: 'var(--admin-surface)',
          borderRadius: 'var(--admin-radius-card)',
          padding: '12px 18px',
          marginBottom: 20,
          border: '1px solid var(--admin-border)',
          boxShadow: 'var(--admin-shadow)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        {/* Search */}
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <input
            placeholder="Tìm theo tên bộ đề, mô tả..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
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

        {/* Category filter */}
        <select
          value={filterCat}
          onChange={(e) => {
            setFilterCat(e.target.value);
            setCurrentPage(1);
          }}
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

        {/* Age Filter */}
        <select
          value={filterAge}
          onChange={(e) => {
            setFilterAge(e.target.value);
            setCurrentPage(1);
          }}
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

        {/* Difficulty Filter */}
        <select
          value={filterDifficulty}
          onChange={(e) => {
            setFilterDifficulty(e.target.value);
            setCurrentPage(1);
          }}
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
          <option value="all">Mọi độ khó</option>
          <option value="easy">Dễ</option>
          <option value="medium">Trung bình</option>
          <option value="hard">Khó</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="admin-table-container" style={{ overflowX: 'auto' }}>
        <div className="admin-table-toolbar" style={{ background: '#FAFBFD' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-muted)' }}>
            Hiển thị {paginatedBank.length} trên tổng số {filteredBank.length} bộ đề • Bấm vào bất kỳ dòng nào để chỉnh sửa ✏️
          </span>
        </div>

        <table className="admin-table" style={{ width: '100%', minWidth: 860 }}>
          <thead>
            <tr>
              <th style={{ width: 60, textAlign: 'center' }}>STT</th>
              <th>Tên bộ đề</th>
              <th>Chủ đề</th>
              <th>Lứa tuổi</th>
              <th style={{ textAlign: 'center' }}>Số câu</th>
              <th style={{ textAlign: 'center' }}>XP</th>
              <th style={{ textAlign: 'center' }}>Trạng thái</th>
              <th style={{ width: 140, textAlign: 'right' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBank.map((quiz, index) => {
              const isHidden = quiz.status === 'hidden';
              return (
                <tr
                  key={quiz.id}
                  onClick={() => handleOpenEditModal(quiz)}
                  style={{
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                  }}
                  title="Bấm vào để chỉnh sửa bộ câu hỏi này"
                >
                  <td style={{ textAlign: 'center', color: 'var(--admin-muted)', fontWeight: 600 }}>
                    {(currentPage - 1) * PAGE_SIZE + index + 1}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 24 }}>{quiz.emoji}</span>
                      <div>
                        <div
                          style={{
                            fontWeight: 800,
                            color: 'var(--admin-ink)',
                            fontSize: 14.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <span>{quiz.title}</span>
                          <span
                            style={{
                              fontSize: 11,
                              color: 'var(--admin-primary)',
                              background: 'rgba(109, 79, 224, 0.08)',
                              padding: '2px 8px',
                              borderRadius: 10,
                              fontWeight: 700,
                            }}
                          >
                            ✏️ Sửa
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: 'var(--admin-muted)',
                            maxWidth: 320,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {quiz.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="admin-badge badge-primary">{quiz.categoryLabel}</span>
                  </td>
                  <td style={{ fontSize: 13, fontWeight: 600 }}>{quiz.ageRange}</td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>{quiz.questions.length}</td>
                  <td style={{ textAlign: 'center', fontWeight: 800, color: '#D97706' }}>
                    +{quiz.reward_xp}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {isHidden ? (
                      <span className="admin-badge badge-danger">🔒 Đang ẩn</span>
                    ) : (
                      <span className="admin-badge badge-success">✅ Hiện</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditModal(quiz);
                        }}
                        className="admin-icon-btn"
                        title="Chỉnh sửa bộ đề"
                        style={{ color: 'var(--admin-primary)' }}
                      >
                        <IoPencilOutline size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewQuiz(quiz);
                        }}
                        className="admin-icon-btn"
                        title="Xem trước bộ đề"
                        style={{ color: 'var(--admin-info)' }}
                      >
                        <IoEyeOutline size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmQuiz(quiz);
                        }}
                        className="admin-icon-btn"
                        title="Xóa bộ đề"
                        style={{ color: 'var(--admin-danger)' }}
                      >
                        <IoTrashOutline size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {paginatedBank.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--admin-muted)' }}>
                  Không tìm thấy bộ đề phù hợp với điều kiện tìm kiếm.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div
            style={{
              padding: '16px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid var(--admin-border)',
              background: '#FAFBFD',
            }}
          >
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="admin-btn admin-btn-outline"
              style={{ padding: '6px 14px', fontSize: 13, opacity: currentPage <= 1 ? 0.5 : 1 }}
            >
              ← Trước
            </button>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)' }}>
              Trang {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="admin-btn admin-btn-outline"
              style={{ padding: '6px 14px', fontSize: 13, opacity: currentPage >= totalPages ? 0.5 : 1 }}
            >
              Tiếp →
            </button>
          </div>
        )}
      </div>

      {/* ─────────────────── MODAL TẠO / SỬA BỘ ĐỀ ─────────────────── */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="admin-modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="admin-modal"
              style={{
                width: 780,
                maxHeight: '90vh',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                padding: 0,
                borderRadius: 'var(--admin-radius-card)',
              }}
            >
              {/* Header */}
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
                    {editingQuiz ? '✏️ Chỉnh sửa bộ đề' : '➕ Tạo bộ đề mới'}
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--admin-muted)' }}>
                    Điền đầy đủ thông tin và cấu hình các câu hỏi trắc nghiệm
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                >
                  <IoClose size={22} color="var(--admin-muted)" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveQuiz} style={{ padding: '24px', flex: 1 }}>
                <h4 style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', color: 'var(--admin-primary)', marginBottom: 14 }}>
                  I. Thông tin bộ đề
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }}>
                  {/* Title */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                      Tên bộ đề: <span style={{ color: 'var(--admin-danger)' }}>*</span>
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

                  {/* Description */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                      Mô tả:
                    </label>
                    <textarea
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      placeholder="Mô tả tóm tắt nội dung bài quiz..."
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

                  {/* Category */}
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                      Chủ đề: <span style={{ color: 'var(--admin-danger)' }}>*</span>
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as QuizCategory)}
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

                  {/* Age Range */}
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
                    {formErrors.age && (
                      <span style={{ fontSize: 12, color: 'var(--admin-danger)', marginTop: 2, display: 'block' }}>
                        {formErrors.age}
                      </span>
                    )}
                  </div>

                  {/* XP & Pass Score */}
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                      XP thưởng: <span style={{ color: 'var(--admin-danger)' }}>*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={formXP}
                      onChange={(e) => setFormXP(Number(e.target.value))}
                      style={{
                        width: '100%',
                        height: 40,
                        padding: '0 12px',
                        borderRadius: 8,
                        border: '1px solid var(--admin-border)',
                      }}
                    />
                    {formErrors.xp && (
                      <span style={{ fontSize: 12, color: 'var(--admin-danger)', marginTop: 2, display: 'block' }}>
                        {formErrors.xp}
                      </span>
                    )}
                  </div>

                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                      Điểm sàn đạt (%): <span style={{ color: 'var(--admin-danger)' }}>*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={formPassScore}
                      onChange={(e) => setFormPassScore(Number(e.target.value))}
                      style={{
                        width: '100%',
                        height: 40,
                        padding: '0 12px',
                        borderRadius: 8,
                        border: '1px solid var(--admin-border)',
                      }}
                    />
                    {formErrors.passScore && (
                      <span style={{ fontSize: 12, color: 'var(--admin-danger)', marginTop: 2, display: 'block' }}>
                        {formErrors.passScore}
                      </span>
                    )}
                  </div>

                  {/* Difficulty & Status */}
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                      Độ khó:
                    </label>
                    <select
                      value={formDifficulty}
                      onChange={(e) => setFormDifficulty(e.target.value as any)}
                      style={{
                        width: '100%',
                        height: 40,
                        padding: '0 10px',
                        borderRadius: 8,
                        border: '1px solid var(--admin-border)',
                      }}
                    >
                      <option value="easy">Dễ</option>
                      <option value="medium">Trung bình</option>
                      <option value="hard">Khó</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                      Trạng thái hiển thị:
                    </label>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', height: 40 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 14 }}>
                        <input
                          type="radio"
                          name="formStatus"
                          value="visible"
                          checked={formStatus === 'visible'}
                          onChange={() => setFormStatus('visible')}
                        />
                        ✅ Hiện
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 14 }}>
                        <input
                          type="radio"
                          name="formStatus"
                          value="hidden"
                          checked={formStatus === 'hidden'}
                          onChange={() => setFormStatus('hidden')}
                        />
                        🔒 Ẩn
                      </label>
                    </div>
                  </div>

                  {/* Emoji Picker */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>
                      Biểu tượng Emoji:
                    </label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Question List */}
                <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', color: 'var(--admin-primary)', margin: 0 }}>
                      II. Danh sách câu hỏi ({formQuestions.length} câu)
                    </h4>
                    <span style={{ fontSize: 12, color: 'var(--admin-muted)' }}>* Tối thiểu 3 câu hỏi</span>
                  </div>

                  {formErrors.questions && (
                    <div style={{ color: 'var(--admin-danger)', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
                      ⚠️ {formErrors.questions}
                    </div>
                  )}

                  <div style={{ display: 'grid', gap: 16 }}>
                    {formQuestions.map((q, qIdx) => (
                      <div
                        key={q.id || qIdx}
                        style={{
                          background: 'var(--admin-bg)',
                          borderRadius: 'var(--admin-radius-card)',
                          padding: 16,
                          border: '1px solid var(--admin-border)',
                        }}
                      >
                        {/* Question Top bar */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--admin-ink)' }}>
                              Câu {qIdx + 1}
                            </span>
                            {/* Reorder buttons */}
                            <button
                              type="button"
                              onClick={() => handleMoveQuestion(qIdx, 'up')}
                              disabled={qIdx === 0}
                              style={{ border: 'none', background: 'none', cursor: 'pointer', opacity: qIdx === 0 ? 0.3 : 1 }}
                              title="Di chuyển lên"
                            >
                              <IoArrowUpOutline size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveQuestion(qIdx, 'down')}
                              disabled={qIdx === formQuestions.length - 1}
                              style={{
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                opacity: qIdx === formQuestions.length - 1 ? 0.3 : 1,
                              }}
                              title="Di chuyển xuống"
                            >
                              <IoArrowDownOutline size={16} />
                            </button>
                          </div>

                          {formQuestions.length > 3 && (
                            <button
                              type="button"
                              onClick={() => setFormQuestions((prev) => prev.filter((_, i) => i !== qIdx))}
                              className="admin-btn admin-btn-danger"
                              style={{ padding: '4px 8px', fontSize: 12 }}
                            >
                              <IoTrashOutline size={14} /> Xóa câu
                            </button>
                          )}
                        </div>

                        {/* Question input */}
                        <div style={{ marginBottom: 12 }}>
                          <input
                            value={q.question}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormQuestions((prev) =>
                                prev.map((item, idx) => (idx === qIdx ? { ...item, question: val } : item))
                              );
                            }}
                            placeholder="Nhập nội dung câu hỏi..."
                            style={{
                              width: '100%',
                              height: 38,
                              padding: '0 10px',
                              borderRadius: 6,
                              border: `1px solid ${formErrors[`q_${qIdx}_content`] ? 'var(--admin-danger)' : 'var(--admin-border)'}`,
                              background: '#ffffff',
                              fontSize: 13.5,
                            }}
                          />
                          {formErrors[`q_${qIdx}_content`] && (
                            <span style={{ fontSize: 11.5, color: 'var(--admin-danger)', marginTop: 2, display: 'block' }}>
                              {formErrors[`q_${qIdx}_content`]}
                            </span>
                          )}
                        </div>

                        {/* Options */}
                        <div style={{ display: 'grid', gap: 8, marginBottom: 10 }}>
                          {q.options.map((opt, oIdx) => {
                            const isCorrect = q.correct_answer === opt.id;
                            return (
                              <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <label
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    cursor: 'pointer',
                                    fontSize: 12.5,
                                    fontWeight: 700,
                                    color: isCorrect ? 'var(--admin-success)' : 'var(--admin-muted)',
                                    minWidth: 80,
                                  }}
                                >
                                  <input
                                    type="radio"
                                    name={`correct_${qIdx}`}
                                    checked={isCorrect}
                                    onChange={() => {
                                      setFormQuestions((prev) =>
                                        prev.map((item, idx) =>
                                          idx === qIdx ? { ...item, correct_answer: opt.id } : item
                                        )
                                      );
                                    }}
                                  />
                                  {OPTION_LABELS[oIdx] || oIdx + 1} {isCorrect && '✓'}
                                </label>

                                <input
                                  value={opt.text}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setFormQuestions((prev) =>
                                      prev.map((item, idx) => {
                                        if (idx !== qIdx) return item;
                                        const newOpts = item.options.map((o) =>
                                          o.id === opt.id ? { ...o, text: val } : o
                                        );
                                        return { ...item, options: newOpts };
                                      })
                                    );
                                  }}
                                  placeholder={`Nội dung đáp án ${OPTION_LABELS[oIdx]}...`}
                                  style={{
                                    flex: 1,
                                    height: 34,
                                    padding: '0 10px',
                                    borderRadius: 6,
                                    border: `1px solid ${
                                      formErrors[`q_${qIdx}_opt_${oIdx}`] ? 'var(--admin-danger)' : 'var(--admin-border)'
                                    }`,
                                    background: '#ffffff',
                                    fontSize: 13,
                                  }}
                                />

                                {q.options.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFormQuestions((prev) =>
                                        prev.map((item, idx) => {
                                          if (idx !== qIdx) return item;
                                          const newOpts = item.options.filter((o) => o.id !== opt.id);
                                          const correct =
                                            item.correct_answer === opt.id ? newOpts[0]?.id : item.correct_answer;
                                          return { ...item, options: newOpts, correct_answer: correct };
                                        })
                                      );
                                    }}
                                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--admin-danger)' }}
                                  >
                                    <IoClose size={18} />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Add Option button */}
                        {q.options.length < 4 && (
                          <button
                            type="button"
                            onClick={() => {
                              const nextLetters = ['a', 'b', 'c', 'd'];
                              const nextLetter = nextLetters[q.options.length] || `opt-${q.options.length + 1}`;
                              setFormQuestions((prev) =>
                                prev.map((item, idx) => {
                                  if (idx !== qIdx) return item;
                                  return {
                                    ...item,
                                    options: [...item.options, { id: `opt-${nextLetter}`, text: '' }],
                                  };
                                })
                              );
                            }}
                            style={{
                              background: 'transparent',
                              border: '1px dashed var(--admin-border)',
                              borderRadius: 6,
                              padding: '4px 10px',
                              fontSize: 12,
                              color: 'var(--admin-primary)',
                              cursor: 'pointer',
                              marginBottom: 10,
                              fontWeight: 600,
                            }}
                          >
                            + Thêm đáp án (tối đa 4)
                          </button>
                        )}

                        {/* Explanation */}
                        <div>
                          <input
                            value={q.explanation || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormQuestions((prev) =>
                                prev.map((item, idx) => (idx === qIdx ? { ...item, explanation: val } : item))
                              );
                            }}
                            placeholder="Giải thích lý do đáp án đúng (tùy chọn)..."
                            style={{
                              width: '100%',
                              height: 32,
                              padding: '0 10px',
                              borderRadius: 6,
                              border: '1px solid var(--admin-border)',
                              background: '#ffffff',
                              fontSize: 12.5,
                            }}
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() =>
                        setFormQuestions((prev) => [
                          ...prev,
                          {
                            id: `q-new-${Date.now()}`,
                            question: '',
                            options: [
                              { id: 'opt-a', text: '' },
                              { id: 'opt-b', text: '' },
                            ],
                            correct_answer: 'opt-a',
                            explanation: '',
                          },
                        ])
                      }
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--admin-radius-card)',
                        border: '2px dashed var(--admin-primary)',
                        background: 'rgba(109, 79, 224, 0.05)',
                        color: 'var(--admin-primary)',
                        fontWeight: 800,
                        fontSize: 14,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      <IoAddCircleOutline size={18} /> + Thêm câu hỏi
                    </button>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 12,
                    marginTop: 28,
                    borderTop: '1px solid var(--admin-border)',
                    paddingTop: 16,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="admin-btn admin-btn-outline"
                  >
                    Hủy bỏ
                  </button>
                  <button type="submit" className="admin-btn admin-btn-primary">
                    💾 Lưu bộ đề
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────── MODAL XEM TRƯỚC BỘ ĐỀ ─────────────────── */}
      <AnimatePresence>
        {previewQuiz && (
          <div className="admin-modal-overlay" onClick={() => setPreviewQuiz(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="admin-modal"
              style={{
                width: 640,
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
                  <span style={{ fontSize: 32 }}>{previewQuiz.emoji}</span>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: 'var(--admin-ink)' }}>
                      Xem trước: {previewQuiz.title}
                    </h3>
                    <div style={{ fontSize: 12, color: 'var(--admin-muted)', marginTop: 2 }}>
                      {previewQuiz.categoryLabel} • {previewQuiz.ageRange} • {previewQuiz.questions.length} câu • +{previewQuiz.reward_xp} XP
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewQuiz(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <IoClose size={20} color="var(--admin-muted)" />
                </button>
              </div>

              <div style={{ padding: '20px 24px', display: 'grid', gap: 16 }}>
                {previewQuiz.questions.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    style={{
                      background: 'var(--admin-bg)',
                      padding: 14,
                      borderRadius: 10,
                      border: '1px solid var(--admin-border)',
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: 13.5, marginBottom: 8, color: 'var(--admin-ink)' }}>
                      Câu {idx + 1}: {q.question}
                    </div>

                    <div style={{ display: 'grid', gap: 6 }}>
                      {q.options.map((opt, oIdx) => {
                        const isCorrect = opt.id === q.correct_answer;
                        return (
                          <div
                            key={opt.id}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 6,
                              background: isCorrect ? 'rgba(47, 158, 86, 0.12)' : '#ffffff',
                              border: isCorrect ? '1px solid var(--admin-success)' : '1px solid var(--admin-border)',
                              fontSize: 13,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <span>
                              <strong>{OPTION_LABELS[oIdx] || oIdx + 1}.</strong> {opt.text}
                            </span>
                            {isCorrect && (
                              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--admin-success)' }}>
                                ✓ Đáp án đúng
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div
                        style={{
                          marginTop: 8,
                          fontSize: 12,
                          color: '#555',
                          background: '#FFFBEB',
                          padding: '6px 10px',
                          borderRadius: 6,
                        }}
                      >
                        💡 <strong>Giải thích:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
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
                    const target = previewQuiz;
                    setPreviewQuiz(null);
                    handleOpenEditModal(target);
                  }}
                  className="admin-btn admin-btn-outline"
                >
                  ✏️ Chỉnh sửa ngay
                </button>
                <button onClick={() => setPreviewQuiz(null)} className="admin-btn admin-btn-primary">
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────── CONFIRM DIALOG XÓA ─────────────────── */}
      <AnimatePresence>
        {deleteConfirmQuiz && (
          <div className="admin-modal-overlay" onClick={() => setDeleteConfirmQuiz(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="admin-modal"
              style={{ width: 440 }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
              <div className="admin-modal-title">Xác nhận xóa bộ đề</div>
              <div className="admin-modal-desc">
                Bạn có chắc chắn muốn xóa bộ đề: <br />
                <strong>
                  "{deleteConfirmQuiz.emoji} {deleteConfirmQuiz.title}"
                </strong>
                ?<br />
                <span style={{ color: 'var(--admin-danger)', fontSize: 13, marginTop: 4, display: 'block' }}>
                  Hành động này không thể hoàn tác. Phụ huynh đã thêm bộ đề này sẽ không còn quyền truy cập.
                </span>
              </div>
              <div className="admin-modal-actions">
                <button onClick={() => setDeleteConfirmQuiz(null)} className="admin-btn admin-btn-outline">
                  Hủy
                </button>
                <button onClick={handleDeleteQuiz} className="admin-btn admin-btn-danger">
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
