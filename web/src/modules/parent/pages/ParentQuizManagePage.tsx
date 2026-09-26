import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoSearchOutline,
  IoAddCircleOutline,
  IoCheckmarkCircle,
  IoEyeOutline,
  IoTrashOutline,
  IoStar,
  IoSparkles,
  IoTimeOutline,
  IoAnalyticsOutline,
  IoLibraryOutline,
  IoCreateOutline,
} from 'react-icons/io5';
import {
  getAllQuizSets,
  toggleQuizAssignment,
  createCustomQuizSet,
  getQuizProgressMap,
} from '@/shared/utils/quizStorage';
import { QuizSet, QuizCategory, CustomQuizSetFormData } from '@/shared/types/quiz';
import QuizPreviewModal from '@/modules/quiz/components/QuizPreviewModal';

const CATEGORIES: { key: QuizCategory; label: string; emoji: string }[] = [
  { key: 've_sinh', label: 'Vệ sinh', emoji: '🧼' },
  { key: 'tu_lap', label: 'Tự lập', emoji: '👕' },
  { key: 'giao_tiep', label: 'Giao tiếp', emoji: '🙏' },
  { key: 'cam_xuc', label: 'Cảm xúc', emoji: '🤝' },
  { key: 'sang_tao', label: 'Sáng tạo', emoji: '🎨' },
  { key: 'le_phep', label: 'Lễ phép', emoji: '😊' },
];

const AGE_RANGES = ['4-6 tuổi', '6-8 tuổi', '4-8 tuổi', '5-8 tuổi', '7-10 tuổi'];
const EMOJIS = ['🧠', '🦷', '👕', '🙏', '🎨', '🧼', '🤝', '📚', '🍎', '⭐', '🌈', '🚲'];

export default function ParentQuizManagePage() {
  const [activeTab, setActiveTab] = useState<'bank' | 'create' | 'results'>('bank');
  const [quizSets, setQuizSets] = useState<QuizSet[]>([]);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterAge, setFilterAge] = useState('all');

  // Preview modal
  const [previewQuiz, setPreviewQuiz] = useState<QuizSet | null>(null);

  // Form tạo câu hỏi
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<QuizCategory>('tu_lap');
  const [formAgeRange, setFormAgeRange] = useState('4-6 tuổi');
  const [formRewardXP, setFormRewardXP] = useState(30);
  const [formPassScore, setFormPassScore] = useState(70);
  const [formEmoji, setFormEmoji] = useState('🧠');
  const [formQuestions, setFormQuestions] = useState<
    {
      question: string;
      options: { id: string; text: string }[];
      correct_answer: string;
      explanation: string;
    }[]
  >([
    {
      question: '',
      options: [
        { id: 'opt-a', text: '' },
        { id: 'opt-b', text: '' },
      ],
      correct_answer: 'opt-a',
      explanation: '',
    },
    {
      question: '',
      options: [
        { id: 'opt-a', text: '' },
        { id: 'opt-b', text: '' },
      ],
      correct_answer: 'opt-a',
      explanation: '',
    },
    {
      question: '',
      options: [
        { id: 'opt-a', text: '' },
        { id: 'opt-b', text: '' },
      ],
      correct_answer: 'opt-a',
      explanation: '',
    },
  ]);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const loadData = () => {
    // TODO: Replace with API call → GET /api/quizsets
    setQuizSets(getAllQuizSets());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => setQuizSets(getAllQuizSets());
    window.addEventListener('kidlife_quiz_assigned_update', handleUpdate);
    window.addEventListener('kidlife_custom_quiz_created', handleUpdate);
    window.addEventListener('kidlife_quiz_progress_update', handleUpdate);
    return () => {
      window.removeEventListener('kidlife_quiz_assigned_update', handleUpdate);
      window.removeEventListener('kidlife_custom_quiz_created', handleUpdate);
      window.removeEventListener('kidlife_quiz_progress_update', handleUpdate);
    };
  }, []);

  // Toggle giao bài
  const handleToggleAssign = (quizId: string) => {
    toggleQuizAssignment(quizId);
    setQuizSets(getAllQuizSets());
    if (previewQuiz && previewQuiz.id === quizId) {
      setPreviewQuiz((prev) => (prev ? { ...prev, isAssigned: !prev.isAssigned } : null));
    }
  };

  // Quản lý các câu hỏi trong form
  const handleAddQuestion = () => {
    setFormQuestions((prev) => [
      ...prev,
      {
        question: '',
        options: [
          { id: 'opt-a', text: '' },
          { id: 'opt-b', text: '' },
        ],
        correct_answer: 'opt-a',
        explanation: '',
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (formQuestions.length <= 3) {
      setFormError('Bộ đề cần có tối thiểu 3 câu hỏi!');
      return;
    }
    setFormQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddOptionToQuestion = (qIndex: number) => {
    const letters = ['a', 'b', 'c', 'd'];
    const currentOpts = formQuestions[qIndex].options;
    if (currentOpts.length >= 4) return;
    const nextLetter = letters[currentOpts.length];
    const newOptions = [...currentOpts, { id: `opt-${nextLetter}`, text: '' }];

    setFormQuestions((prev) =>
      prev.map((q, i) => (i === qIndex ? { ...q, options: newOptions } : q))
    );
  };

  const handleSaveQuizSet = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!formTitle.trim()) {
      setFormError('Vui lòng nhập tên bộ đề!');
      return;
    }
    if (formQuestions.length < 3) {
      setFormError('Bộ đề phải có ít nhất 3 câu hỏi!');
      return;
    }

    for (let i = 0; i < formQuestions.length; i++) {
      const q = formQuestions[i];
      if (!q.question.trim()) {
        setFormError(`Câu hỏi ${i + 1} chưa có nội dung!`);
        return;
      }
      if (q.options.length < 2) {
        setFormError(`Câu hỏi ${i + 1} phải có tối thiểu 2 đáp án!`);
        return;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].text.trim()) {
          setFormError(`Câu hỏi ${i + 1} - Đáp án ${j + 1} chưa có nội dung!`);
          return;
        }
      }
      if (!q.correct_answer) {
        setFormError(`Vui lòng chọn đáp án đúng cho Câu hỏi ${i + 1}!`);
        return;
      }
    }

    const catObj = CATEGORIES.find((c) => c.key === formCategory);

    const newSetData: CustomQuizSetFormData = {
      title: formTitle.trim(),
      category: formCategory,
      categoryLabel: catObj ? catObj.label : 'Tự lập',
      ageRange: formAgeRange,
      reward_xp: Number(formRewardXP) || 30,
      pass_score: Number(formPassScore) || 70,
      difficulty: 'medium',
      emoji: formEmoji,
      questions: formQuestions,
    };

    createCustomQuizSet(newSetData);
    setFormSuccess('Đã tạo thành công bộ đề mới và tự động giao cho bé! 🎉');
    loadData();

    // Reset form
    setFormTitle('');
    setFormQuestions([
      {
        question: '',
        options: [
          { id: 'opt-a', text: '' },
          { id: 'opt-b', text: '' },
        ],
        correct_answer: 'opt-a',
        explanation: '',
      },
      {
        question: '',
        options: [
          { id: 'opt-a', text: '' },
          { id: 'opt-b', text: '' },
        ],
        correct_answer: 'opt-a',
        explanation: '',
      },
      {
        question: '',
        options: [
          { id: 'opt-a', text: '' },
          { id: 'opt-b', text: '' },
        ],
        correct_answer: 'opt-a',
        explanation: '',
      },
    ]);

    setTimeout(() => {
      setFormSuccess(null);
      setActiveTab('bank');
    }, 1500);
  };

  // Tiến độ làm bài từ localStorage
  const progressMap = getQuizProgressMap();
  const progressList = Object.values(progressMap);

  const filteredSets = quizSets.filter((item) => {
    if (filterCat !== 'all' && item.category !== filterCat) return false;
    if (filterAge !== 'all' && !item.ageRange.includes(filterAge)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
    }
    return true;
  });

  const totalAssigned = quizSets.filter((s) => s.isAssigned).length;

  return (
    <div style={{ maxWidth: 1050, margin: '0 auto', paddingBottom: 50 }}>
      {/* Header */}
      <div className="web-page-header" style={{ marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 30 }}>🧠</span>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--kl-primary-dark)' }}>
              Quản lý Quiz & Kiểm Tra Trí Nhớ
            </h1>
          </div>
          <p style={{ color: 'var(--kl-muted)', fontSize: 14, marginTop: 4 }}>
            Chọn bộ đề từ thư viện chuẩn hoặc tự tay soạn câu hỏi thú vị cho bé rèn luyện
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
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
            Đã giao {totalAssigned}/{quizSets.length} bộ đề
          </span>
        </div>
      </div>

      {/* Main Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          borderBottom: '2px solid #E2E8F0',
          marginBottom: 24,
        }}
      >
        <button
          onClick={() => setActiveTab('bank')}
          style={{
            padding: '12px 20px',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'bank' ? '3px solid var(--kl-primary)' : '3px solid transparent',
            color: activeTab === 'bank' ? 'var(--kl-primary)' : 'var(--kl-muted)',
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
          <IoLibraryOutline size={18} />
          Ngân hàng đề thi ({quizSets.length})
        </button>

        <button
          onClick={() => setActiveTab('create')}
          style={{
            padding: '12px 20px',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'create' ? '3px solid var(--kl-primary)' : '3px solid transparent',
            color: activeTab === 'create' ? 'var(--kl-primary)' : 'var(--kl-muted)',
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
          <IoCreateOutline size={18} />
          Tự tạo câu hỏi
        </button>

        <button
          onClick={() => setActiveTab('results')}
          style={{
            padding: '12px 20px',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'results' ? '3px solid var(--kl-primary)' : '3px solid transparent',
            color: activeTab === 'results' ? 'var(--kl-primary)' : 'var(--kl-muted)',
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
          Theo dõi kết quả ({progressList.length})
        </button>
      </div>

      {/* TAB 1: NGÂN HÀNG ĐỀ THI */}
      {activeTab === 'bank' && (
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
                placeholder="Tìm bộ đề theo tên hoặc mô tả..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <select
              className="kl-input"
              style={{ width: 170, height: 46, borderRadius: 16, border: '1.5px solid #E2E8F0' }}
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
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
              className="kl-input"
              style={{ width: 160, height: 46, borderRadius: 16, border: '1.5px solid #E2E8F0' }}
              value={filterAge}
              onChange={(e) => setFilterAge(e.target.value)}
            >
              <option value="all">Mọi lứa tuổi</option>
              <option value="4-6">4 - 6 tuổi</option>
              <option value="6-8">6 - 8 tuổi</option>
            </select>
          </div>

          {/* List of Quiz Sets */}
          <div style={{ display: 'grid', gap: 14 }}>
            {filteredSets.map((quiz) => (
              <div
                key={quiz.id}
                className="kl-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  padding: '18px 24px',
                  borderRadius: 20,
                  border: quiz.isAssigned ? '1.5px solid #C7D2FE' : '1px solid #E2E8F0',
                  background: quiz.isAssigned ? '#FAF5FF' : '#ffffff',
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 18,
                    background: '#EEF2FF',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 28,
                    flexShrink: 0,
                  }}
                >
                  {quiz.emoji}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--kl-primary-dark)', margin: 0 }}>
                      {quiz.title}
                    </h3>
                    {quiz.isCustom && (
                      <span
                        style={{
                          background: '#FEF3C7',
                          color: '#B45309',
                          fontSize: 11,
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: 10,
                        }}
                      >
                        📝 Ba/Mẹ tạo
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 13, color: 'var(--kl-muted)' }}>
                    <span>🏷️ {quiz.categoryLabel}</span>
                    <span>👶 {quiz.ageRange}</span>
                    <span>❓ {quiz.questions.length} câu hỏi</span>
                    <span style={{ color: '#D97706', fontWeight: 700 }}>⭐ +{quiz.reward_xp} XP</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    onClick={() => setPreviewQuiz(quiz)}
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
                    onClick={() => handleToggleAssign(quiz.id)}
                    className="kl-btn"
                    style={{
                      background: quiz.isAssigned ? '#10B981' : 'var(--kl-primary)',
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
                      boxShadow: quiz.isAssigned
                        ? '0 3px 8px rgba(16, 185, 129, 0.25)'
                        : '0 3px 8px rgba(43, 68, 232, 0.25)',
                    }}
                  >
                    {quiz.isAssigned ? (
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

            {filteredSets.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--kl-muted)' }}>
                <span style={{ fontSize: 48 }}>🔍</span>
                <p style={{ marginTop: 10, fontSize: 15 }}>Không tìm thấy bộ đề phù hợp với bộ lọc</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* TAB 2: TỰ TẠO CÂU HỎI */}
      {activeTab === 'create' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
          <form onSubmit={handleSaveQuizSet}>
            {/* Alerts */}
            {formError && (
              <div
                style={{
                  padding: '12px 18px',
                  borderRadius: 14,
                  background: '#FEE2E2',
                  border: '1.5px solid #EF4444',
                  color: '#991B1B',
                  fontWeight: 700,
                  fontSize: 14,
                  marginBottom: 16,
                }}
              >
                ⚠️ {formError}
              </div>
            )}

            {formSuccess && (
              <div
                style={{
                  padding: '12px 18px',
                  borderRadius: 14,
                  background: '#DCFCE7',
                  border: '1.5px solid #10B981',
                  color: '#065F46',
                  fontWeight: 800,
                  fontSize: 14,
                  marginBottom: 16,
                }}
              >
                🎉 {formSuccess}
              </div>
            )}

            {/* Set General Info */}
            <div className="kl-card" style={{ padding: 24, borderRadius: 24, marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--kl-primary-dark)', marginBottom: 16 }}>
                1. Thông tin chung bộ đề
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>
                    Tên bộ đề: <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    className="kl-input"
                    placeholder="Ví dụ: Rửa bát phụ mẹ, Bé tự xúc ăn ngoan..."
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    style={{ width: '100%', height: 46 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>
                    Chủ đề bài học:
                  </label>
                  <select
                    className="kl-input"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as QuizCategory)}
                    style={{ width: '100%', height: 46 }}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.emoji} {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>
                    Lứa tuổi phù hợp:
                  </label>
                  <select
                    className="kl-input"
                    value={formAgeRange}
                    onChange={(e) => setFormAgeRange(e.target.value)}
                    style={{ width: '100%', height: 46 }}
                  >
                    {AGE_RANGES.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>
                    Thưởng khi hoàn thành:
                  </label>
                  <input
                    className="kl-input"
                    type="number"
                    min={10}
                    max={200}
                    value={formRewardXP}
                    onChange={(e) => setFormRewardXP(Number(e.target.value))}
                    style={{ width: '100%', height: 46 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>
                    Điểm sàn đạt (%):
                  </label>
                  <input
                    className="kl-input"
                    type="number"
                    min={50}
                    max={100}
                    value={formPassScore}
                    onChange={(e) => setFormPassScore(Number(e.target.value))}
                    style={{ width: '100%', height: 46 }}
                  />
                </div>
              </div>

              {/* Emoji Picker */}
              <div style={{ marginTop: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>
                  Chọn biểu tượng Emoji đại diện:
                </label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {EMOJIS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setFormEmoji(em)}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        border: formEmoji === em ? '2px solid var(--kl-primary)' : '1px solid #E2E8F0',
                        background: formEmoji === em ? '#EEF2FF' : '#ffffff',
                        fontSize: 22,
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

            {/* Questions List */}
            <div className="kl-card" style={{ padding: 24, borderRadius: 24, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--kl-primary-dark)', margin: 0 }}>
                  2. Danh sách câu hỏi ({formQuestions.length} câu)
                </h3>
                <span style={{ fontSize: 13, color: 'var(--kl-muted)' }}>* Tối thiểu 3 câu hỏi</span>
              </div>

              <div style={{ display: 'grid', gap: 18 }}>
                {formQuestions.map((q, qIndex) => (
                  <div
                    key={qIndex}
                    style={{
                      background: '#F8FAFC',
                      borderRadius: 18,
                      padding: 20,
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--kl-primary-dark)' }}>
                        Câu hỏi #{qIndex + 1}
                      </span>
                      {formQuestions.length > 3 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIndex)}
                          style={{
                            background: '#FEE2E2',
                            color: '#DC2626',
                            border: 'none',
                            padding: '4px 10px',
                            borderRadius: 10,
                            fontSize: 12,
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            cursor: 'pointer',
                          }}
                        >
                          <IoTrashOutline size={14} /> Xóa câu này
                        </button>
                      )}
                    </div>

                    {/* Question text */}
                    <input
                      className="kl-input"
                      placeholder="Nhập nội dung câu hỏi trắc nghiệm..."
                      value={q.question}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormQuestions((prev) =>
                          prev.map((item, idx) => (idx === qIndex ? { ...item, question: val } : item))
                        );
                      }}
                      style={{ width: '100%', height: 44, marginBottom: 14 }}
                    />

                    {/* Options */}
                    <div style={{ display: 'grid', gap: 10, marginBottom: 12 }}>
                      {q.options.map((opt, oIndex) => {
                        const isCorrect = q.correct_answer === opt.id;
                        return (
                          <div
                            key={opt.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                            }}
                          >
                            <label
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                cursor: 'pointer',
                                background: isCorrect ? '#DCFCE7' : '#ffffff',
                                border: isCorrect ? '1.5px solid #10B981' : '1px solid #CBD5E1',
                                padding: '6px 12px',
                                borderRadius: 12,
                                fontSize: 12,
                                fontWeight: 800,
                                color: isCorrect ? '#065F46' : '#64748B',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              <input
                                type="radio"
                                name={`correct-${qIndex}`}
                                checked={isCorrect}
                                onChange={() => {
                                  setFormQuestions((prev) =>
                                    prev.map((item, idx) =>
                                      idx === qIndex ? { ...item, correct_answer: opt.id } : item
                                    )
                                  );
                                }}
                              />
                              {isCorrect ? '✅ Đáp án ĐÚNG' : `Đáp án ${String.fromCharCode(65 + oIndex)}`}
                            </label>

                            <input
                              className="kl-input"
                              placeholder={`Nội dung lựa chọn ${String.fromCharCode(65 + oIndex)}...`}
                              value={opt.text}
                              onChange={(e) => {
                                const val = e.target.value;
                                setFormQuestions((prev) =>
                                  prev.map((item, idx) => {
                                    if (idx !== qIndex) return item;
                                    const newOpts = item.options.map((o) =>
                                      o.id === opt.id ? { ...o, text: val } : o
                                    );
                                    return { ...item, options: newOpts };
                                  })
                                );
                              }}
                              style={{ flex: 1, height: 40 }}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {q.options.length < 4 && (
                      <button
                        type="button"
                        onClick={() => handleAddOptionToQuestion(qIndex)}
                        style={{
                          background: 'transparent',
                          border: '1px dashed #CBD5E1',
                          borderRadius: 12,
                          padding: '6px 12px',
                          fontSize: 12,
                          fontWeight: 700,
                          color: 'var(--kl-primary)',
                          cursor: 'pointer',
                          marginBottom: 12,
                        }}
                      >
                        + Thêm lựa chọn (tối đa 4)
                      </button>
                    )}

                    {/* Explanation */}
                    <div>
                      <input
                        className="kl-input"
                        placeholder="Giải thích lý do đáp án đúng (hiện cho bé đọc sau khi chọn)..."
                        value={q.explanation}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormQuestions((prev) =>
                            prev.map((item, idx) => (idx === qIndex ? { ...item, explanation: val } : item))
                          );
                        }}
                        style={{ width: '100%', height: 40, fontSize: 13 }}
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="kl-btn"
                  style={{
                    background: '#EEF2FF',
                    color: 'var(--kl-primary)',
                    border: '1.5px dashed var(--kl-primary)',
                    padding: '12px 20px',
                    borderRadius: 16,
                    fontWeight: 800,
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    cursor: 'pointer',
                  }}
                >
                  <IoAddCircleOutline size={20} /> + Thêm câu hỏi trắc nghiệm mới
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 14 }}>
              <button
                type="button"
                onClick={() => setActiveTab('bank')}
                className="kl-btn"
                style={{
                  background: '#F1F5F9',
                  color: 'var(--kl-muted)',
                  padding: '12px 24px',
                  borderRadius: 16,
                  fontWeight: 800,
                  fontSize: 14,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Hủy bỏ
              </button>

              <button
                type="submit"
                className="kl-btn kl-btn-primary"
                style={{
                  padding: '12px 32px',
                  borderRadius: 16,
                  fontWeight: 800,
                  fontSize: 14,
                  boxShadow: '0 4px 14px rgba(43, 68, 232, 0.3)',
                }}
              >
                💾 Lưu bộ đề cho bé
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* TAB 3: THEO DÕI KẾT QUẢ */}
      {activeTab === 'results' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
          {/* Summary Metric Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div className="kl-card" style={{ padding: 20, borderRadius: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: 'var(--kl-muted)', fontWeight: 700 }}>Tổng bài đã làm</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--kl-primary)', marginTop: 4 }}>
                {progressList.length}
              </div>
            </div>

            <div className="kl-card" style={{ padding: 20, borderRadius: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: 'var(--kl-muted)', fontWeight: 700 }}>Số bài đạt chuẩn</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#10B981', marginTop: 4 }}>
                {progressList.filter((p) => p.passed).length}
              </div>
            </div>

            <div className="kl-card" style={{ padding: 20, borderRadius: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: 'var(--kl-muted)', fontWeight: 700 }}>Tổng XP bé đã nhận</div>
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
                    Tên bộ đề
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: 13, fontWeight: 800, color: 'var(--kl-muted)' }}>
                    Ngày làm
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: 13, fontWeight: 800, color: 'var(--kl-muted)' }}>
                    Điểm số
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: 13, fontWeight: 800, color: 'var(--kl-muted)' }}>
                    Trạng thái
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
                    : 'Gần đây';

                  return (
                    <tr key={item.quizId} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '16px 20px', fontWeight: 800, color: 'var(--kl-primary-dark)' }}>
                        {item.quizTitle}
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: 13, color: 'var(--kl-muted)' }}>
                        {dateStr}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontWeight: 800, fontSize: 14 }}>
                          {item.score}/{item.total} ({item.percentage}%)
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        {item.passed ? (
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
                            ✓ Đạt chuẩn
                          </span>
                        ) : (
                          <span
                            style={{
                              background: '#FEF2F2',
                              color: '#DC2626',
                              padding: '4px 10px',
                              borderRadius: 12,
                              fontSize: 12,
                              fontWeight: 800,
                            }}
                          >
                            Cần cố gắng
                          </span>
                        )}
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
                      Bé chưa làm bài kiểm tra trí nhớ nào. Hãy khích lệ bé làm bài ở mục "Ngân hàng đề thi" nhé!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Preview Modal */}
      <QuizPreviewModal
        quiz={previewQuiz}
        isOpen={Boolean(previewQuiz)}
        onClose={() => setPreviewQuiz(null)}
        onToggleAssign={handleToggleAssign}
      />
    </div>
  );
}
