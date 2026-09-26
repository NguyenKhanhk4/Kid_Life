import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoTimeOutline, IoCheckmarkCircle, IoStar } from 'react-icons/io5';
import { QuizSet } from '@/shared/types/quiz';

interface QuizPreviewModalProps {
  quiz: QuizSet | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleAssign?: (quizId: string) => void;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function QuizPreviewModal({ quiz, isOpen, onClose, onToggleAssign }: QuizPreviewModalProps) {
  if (!isOpen || !quiz) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
            maxWidth: 640,
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
              padding: '20px 24px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#F8FAFC',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 32 }}>{quiz.emoji}</span>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--kl-primary-dark)', margin: 0 }}>
                  Xem trước: {quiz.title}
                </h3>
                <div style={{ display: 'flex', gap: 8, marginTop: 4, fontSize: 12, color: 'var(--kl-muted)' }}>
                  <span>{quiz.categoryLabel}</span>
                  <span>• {quiz.ageRange}</span>
                  <span>• {quiz.questions.length} câu hỏi</span>
                  <span>• Điểm sàn {quiz.pass_score}%</span>
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

          {/* Question List (Scrollable) */}
          <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'grid', gap: 16 }}>
            {quiz.questions.map((q, qIndex) => (
              <div
                key={q.id || qIndex}
                style={{
                  background: '#F8FAFC',
                  borderRadius: 18,
                  padding: 16,
                  border: '1px solid #E2E8F0',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--kl-primary-dark)', marginBottom: 10 }}>
                  Câu {qIndex + 1}: {q.question}
                </div>

                <div style={{ display: 'grid', gap: 6, marginBottom: 8 }}>
                  {q.options.map((opt, oIndex) => {
                    const isCorrect = opt.id === q.correct_answer;
                    return (
                      <div
                        key={opt.id || oIndex}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '8px 12px',
                          borderRadius: 12,
                          background: isCorrect ? '#ECFDF5' : '#ffffff',
                          border: isCorrect ? '1.5px solid #10B981' : '1px solid #E2E8F0',
                          fontSize: 13,
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 800,
                            color: isCorrect ? '#059669' : '#64748B',
                            width: 20,
                          }}
                        >
                          {OPTION_LABELS[oIndex] || oIndex + 1}.
                        </span>
                        <span
                          style={{
                            flex: 1,
                            fontWeight: isCorrect ? 700 : 500,
                            color: isCorrect ? '#065F46' : 'var(--kl-text)',
                          }}
                        >
                          {opt.text}
                        </span>
                        {isCorrect && (
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              color: '#059669',
                              fontSize: 11,
                              fontWeight: 800,
                            }}
                          >
                            <IoCheckmarkCircle size={16} /> Đáp án đúng
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <div
                    style={{
                      fontSize: 12,
                      color: '#475569',
                      background: '#FFFBEB',
                      padding: '6px 10px',
                      borderRadius: 10,
                      border: '1px solid #FEF3C7',
                    }}
                  >
                    💡 <strong>Giải thích:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}
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
              Thưởng +{quiz.reward_xp} XP cho bé
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              {onToggleAssign && (
                <button
                  onClick={() => onToggleAssign(quiz.id)}
                  className="kl-btn"
                  style={{
                    background: quiz.isAssigned ? '#FEF2F2' : '#ECFDF5',
                    color: quiz.isAssigned ? '#DC2626' : '#059669',
                    border: `1.5px solid ${quiz.isAssigned ? '#FECDD3' : '#A7F3D0'}`,
                    padding: '8px 16px',
                    borderRadius: 14,
                    fontWeight: 800,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  {quiz.isAssigned ? 'Bỏ giao cho bé' : '+ Thêm cho bé'}
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
