import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoClose,
  IoTimeOutline,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoArrowForward,
  IoCheckmark,
  IoInformationCircleOutline,
} from 'react-icons/io5';
import { getQuizSetById, getAllQuizSets } from '@/shared/utils/quizStorage';
import { QuizSet, QuizQuestion } from '@/shared/types/quiz';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function QuizPage() {
  const navigate = useNavigate();
  const { quizId } = useParams();

  // Tìm bộ đề theo id hoặc fallback lấy bộ đầu tiên
  const [quizSet, setQuizSet] = useState<QuizSet | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // questionId -> optionId
  const [timer, setTimer] = useState(30);

  // TODO: Replace with API call → GET /api/quizsets/:id
  useEffect(() => {
    const id = quizId || 'quiz-1';
    const found = getQuizSetById(id) || getAllQuizSets()[0];
    if (found) {
      setQuizSet(found);
      setTimer(found.time_per_question || 30);
    }
  }, [quizId]);

  const questions: QuizQuestion[] = quizSet?.questions || [];
  const question: QuizQuestion | undefined = questions[currentQ];
  const isLast = currentQ === questions.length - 1;
  const progress = questions.length > 0 ? ((currentQ + 1) / questions.length) * 100 : 0;

  // Xử lý chuyển câu hoặc nộp bài
  const handleNext = useCallback(() => {
    if (!quizSet || !question) return;

    if (isLast) {
      // Tính điểm tổng kết
      let score = 0;
      questions.forEach((q) => {
        const userChoice = answers[q.id];
        if (userChoice === q.correct_answer) {
          score += 1;
        }
      });

      const percentage = Math.round((score / questions.length) * 100);
      const passed = percentage >= quizSet.pass_score;

      navigate('/child/quiz-result', {
        state: {
          quizId: quizSet.id,
          quizTitle: quizSet.title,
          score,
          total: questions.length,
          percentage,
          passed,
          reward_xp: quizSet.reward_xp,
          pass_score: quizSet.pass_score,
          answers,
        },
      });
    } else {
      setCurrentQ((prev) => prev + 1);
      setSelectedOptId(null);
      setShowExplanation(false);
      setTimer(quizSet.time_per_question || 30);
    }
  }, [isLast, quizSet, question, questions, answers, navigate]);

  // Bộ đếm thời gian
  useEffect(() => {
    if (!quizSet || showExplanation) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Tự động bỏ qua câu khi hết giờ
          handleNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQ, quizSet, showExplanation, handleNext]);

  // Khi bé chọn đáp án
  const handleSelectOption = (optId: string) => {
    if (selectedOptId !== null) return; // Đã chọn rồi không cho đổi
    setSelectedOptId(optId);

    if (question) {
      setAnswers((prev) => ({
        ...prev,
        [question.id]: optId,
      }));
    }

    // Hiển thị phần giải thích sau 0.5s để bé đọc và hiểu
    setTimeout(() => {
      setShowExplanation(true);
    }, 500);
  };

  if (!quizSet || !question) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <p style={{ color: 'var(--kl-muted)' }}>Đang chuẩn bị câu hỏi...</p>
      </div>
    );
  }

  const isTimerCritical = timer < 5;
  const isCorrect = selectedOptId === question.correct_answer;

  return (
    <div
      style={{
        maxWidth: 720,
        margin: '0 auto',
        paddingTop: 16,
        paddingBottom: 40,
        minHeight: 'calc(100vh - 100px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Bar: Back / Progress / Timer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <button
          onClick={() => navigate('/child/quiz-library')}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            background: '#F1F5F9',
            border: 'none',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          title="Quay lại danh sách"
        >
          <IoClose size={22} color="var(--kl-primary-dark)" />
        </button>

        {/* Progress Bar */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              height: 10,
              borderRadius: 6,
              background: '#E2E8F0',
              overflow: 'hidden',
            }}
          >
            <motion.div
              style={{
                height: '100%',
                borderRadius: 6,
                background: 'linear-gradient(90deg, #3B82F6 0%, #10B981 100%)',
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--kl-muted)',
              marginTop: 4,
            }}
          >
            <span>{quizSet.title}</span>
            <span>
              Câu {currentQ + 1}/{questions.length}
            </span>
          </div>
        </div>

        {/* Countdown Timer with color change and pulse */}
        <motion.div
          animate={isTimerCritical ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: Infinity, duration: 0.6 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: isTimerCritical ? '#FEE2E2' : '#EFF6FF',
            border: `1.5px solid ${isTimerCritical ? '#EF4444' : '#BFDBFE'}`,
            borderRadius: 16,
            padding: '6px 14px',
            color: isTimerCritical ? '#DC2626' : '#2563EB',
            fontWeight: 800,
            fontSize: 14,
          }}
        >
          <IoTimeOutline size={18} />
          <span>{timer}s</span>
        </motion.div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          <div
            className="kl-card"
            style={{
              padding: '24px 28px',
              borderRadius: 24,
              marginBottom: 20,
              background: '#ffffff',
              boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
              border: '1.5px solid #E2E8F0',
            }}
          >
            <span
              style={{
                background: '#EEF2FF',
                color: '#4F46E5',
                fontSize: 12,
                fontWeight: 800,
                padding: '4px 12px',
                borderRadius: 12,
                display: 'inline-block',
                marginBottom: 12,
              }}
            >
              ❓ Câu hỏi {currentQ + 1}
            </span>

            <h2
              style={{
                fontSize: 20,
                fontWeight: 800,
                lineHeight: 1.5,
                color: 'var(--kl-primary-dark)',
                margin: 0,
              }}
            >
              {question.question}
            </h2>
          </div>

          {/* Options */}
          <div style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
            {question.options.map((opt, i) => {
              const isSelected = selectedOptId === opt.id;
              const isThisCorrect = opt.id === question.correct_answer;

              // Màu viền và nền khi đã chọn
              let border = '2px solid #E2E8F0';
              let bg = '#ffffff';
              let badgeColor = '#64748B';
              let badgeBg = '#F1F5F9';

              if (selectedOptId !== null) {
                if (isThisCorrect) {
                  border = '2px solid #10B981';
                  bg = '#ECFDF5';
                  badgeColor = '#ffffff';
                  badgeBg = '#10B981';
                } else if (isSelected) {
                  border = '2px solid #EF4444';
                  bg = '#FEF2F2';
                  badgeColor = '#ffffff';
                  badgeBg = '#EF4444';
                }
              }

              return (
                <motion.button
                  key={opt.id}
                  whileTap={selectedOptId === null ? { scale: 0.98 } : {}}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={selectedOptId !== null}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '16px 20px',
                    borderRadius: 20,
                    background: bg,
                    border: border,
                    cursor: selectedOptId === null ? 'pointer' : 'default',
                    textAlign: 'left',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 14,
                      display: 'grid',
                      placeItems: 'center',
                      background: badgeBg,
                      color: badgeColor,
                      fontWeight: 800,
                      fontSize: 15,
                      flexShrink: 0,
                    }}
                  >
                    {OPTION_LABELS[i] || i + 1}
                  </div>

                  <span
                    style={{
                      flex: 1,
                      fontWeight: 700,
                      fontSize: 15,
                      color: 'var(--kl-primary-dark)',
                      lineHeight: 1.4,
                    }}
                  >
                    {opt.text}
                  </span>

                  {selectedOptId !== null && isThisCorrect && (
                    <IoCheckmarkCircle size={24} color="#10B981" />
                  )}

                  {selectedOptId !== null && isSelected && !isThisCorrect && (
                    <IoCloseCircle size={24} color="#EF4444" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Explanation Slide (Slide xuất hiện sau khi chọn) */}
          <AnimatePresence>
            {showExplanation && question.explanation && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                style={{
                  padding: '16px 20px',
                  borderRadius: 20,
                  background: isCorrect ? '#F0FDF4' : '#FFFBEB',
                  border: `1.5px solid ${isCorrect ? '#86EFAC' : '#FDE68A'}`,
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 24 }}>{isCorrect ? '🎉' : '💡'}</div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: isCorrect ? '#166534' : '#92400E',
                      marginBottom: 2,
                    }}
                  >
                    {isCorrect ? 'Chính xác! Bé giỏi lắm!' : 'Giải thích đáp án đúng:'}
                  </div>
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: isCorrect ? '#14532D' : '#78350F',
                      lineHeight: 1.45,
                    }}
                  >
                    {question.explanation}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Button Footer */}
          <div style={{ marginTop: 'auto', paddingTop: 10 }}>
            <button
              className="kl-btn kl-btn-primary kl-btn-block"
              onClick={handleNext}
              disabled={selectedOptId === null}
              style={{
                height: 52,
                borderRadius: 18,
                fontSize: 16,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                opacity: selectedOptId === null ? 0.4 : 1,
                cursor: selectedOptId === null ? 'not-allowed' : 'pointer',
                background:
                  selectedOptId === null
                    ? '#94A3B8'
                    : isLast
                    ? '#10B981'
                    : 'var(--kl-primary)',
              }}
            >
              {isLast ? 'Nộp bài & Xem kết quả' : 'Câu tiếp theo'}
              {isLast ? <IoCheckmark size={20} /> : <IoArrowForward size={20} />}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
