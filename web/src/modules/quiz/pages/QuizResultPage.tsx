import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoRefresh,
  IoArrowForward,
  IoTrophy,
  IoStar,
  IoBookOutline,
  IoSparkles,
} from 'react-icons/io5';
import { getQuizSetById, recordQuizResult } from '@/shared/utils/quizStorage';
import ConfettiEffect from '@/shared/components/ConfettiEffect';

export default function QuizResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    quizId = 'quiz-1',
    quizTitle = 'Bộ đề trắc nghiệm',
    score = 0,
    total = 5,
    percentage = 0,
    passed = false,
    reward_xp = 30,
    pass_score = 70,
    answers = {},
  } = (location.state as any) ?? {};

  const [hasRecorded, setHasRecorded] = useState(false);
  const [actualAwardedXP, setActualAwardedXP] = useState(0);
  const [showConfetti, setShowConfetti] = useState(passed);
  const quizSet = getQuizSetById(quizId);

  useEffect(() => {
    if (!hasRecorded && quizId) {
      const res = recordQuizResult({
        quizId,
        quizTitle,
        score,
        total,
        passScorePercentage: pass_score,
        rewardXP: reward_xp,
        answers,
      });
      setActualAwardedXP(res.xpAwarded);
      setHasRecorded(true);
    }
  }, [hasRecorded, quizId, quizTitle, score, total, pass_score, reward_xp, answers]);

  // Phân loại kết quả:
  // 🏆 Xuất sắc (≥90%) / ⭐ Giỏi (≥70%) / 💪 Cố lên (< 70%)
  const isExcellent = percentage >= 90;
  const isGood = percentage >= 70 && percentage < 90;

  let rankEmoji = '💪';
  let rankLabel = 'Cố lên bé nhé!';
  let rankColor = '#DC2626';
  let rankBg = '#FEF2F2';

  if (isExcellent) {
    rankEmoji = '🏆';
    rankLabel = 'Xuất sắc!';
    rankColor = '#B45309';
    rankBg = '#FEF3C7';
  } else if (isGood) {
    rankEmoji = '⭐';
    rankLabel = 'Làm tốt lắm!';
    rankColor = '#059669';
    rankBg = '#ECFDF5';
  }

  const questions = quizSet?.questions || [];

  return (
    <div
      style={{
        maxWidth: 720,
        margin: '0 auto',
        paddingTop: 20,
        paddingBottom: 40,
      }}
    >
      <ConfettiEffect show={showConfetti} onFinish={() => setShowConfetti(false)} />

      {/* Result Hero Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="kl-card"
        style={{
          textAlign: 'center',
          padding: '36px 24px',
          borderRadius: 28,
          marginBottom: 24,
          background: passed
            ? 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)'
            : 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
          border: `2px solid ${passed ? '#86EFAC' : '#FECDD3'}`,
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        }}
      >
        {/* Score Circle */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto 16px',
            background: '#ffffff',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            border: `4px solid ${passed ? '#10B981' : '#EF4444'}`,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 34,
                fontWeight: 900,
                color: passed ? '#065F46' : '#991B1B',
              }}
            >
              {score}/{total}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--kl-muted)', marginTop: -2 }}>
              {percentage}% đúng
            </div>
          </div>
        </div>

        {/* Title & Rank Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            borderRadius: 20,
            padding: '8px 20px',
            background: rankBg,
            marginBottom: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <span style={{ fontSize: 20 }}>{rankEmoji}</span>
          <span style={{ fontSize: 16, fontWeight: 900, color: rankColor }}>
            {rankLabel}
          </span>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--kl-primary-dark)', marginBottom: 6 }}>
          {quizTitle}
        </h2>

        {/* XP Awarded status */}
        {passed ? (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#FEF08A',
              color: '#854D0E',
              padding: '8px 20px',
              borderRadius: 20,
              fontSize: 16,
              fontWeight: 900,
              marginTop: 6,
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)',
            }}
          >
            <IoStar size={20} color="#D97706" />
            <span>+{actualAwardedXP || reward_xp} XP đã được cộng vào Ví điểm!</span>
          </div>
        ) : (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: '#DC2626',
              fontSize: 14,
              fontWeight: 700,
              marginTop: 4,
            }}
          >
            <span>Cần đạt tối thiểu {pass_score}% để nhận +{reward_xp} XP. Hãy thử làm lại nhé!</span>
          </div>
        )}
      </motion.div>

      {/* Review Answers Section */}
      <div style={{ marginBottom: 24 }}>
        <h3
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: 'var(--kl-primary-dark)',
            marginBottom: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <IoBookOutline size={20} color="var(--kl-primary)" />
          Xem lại đáp án chi tiết
        </h3>

        <div style={{ display: 'grid', gap: 14 }}>
          {questions.map((q, i) => {
            const userChoiceId = answers[q.id];
            const isCorrect = userChoiceId === q.correct_answer;
            const chosenOption = q.options.find((opt) => opt.id === userChoiceId);
            const correctOption = q.options.find((opt) => opt.id === q.correct_answer);

            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="kl-card"
                style={{
                  padding: 18,
                  borderRadius: 20,
                  borderLeft: `5px solid ${isCorrect ? '#10B981' : '#EF4444'}`,
                  background: isCorrect ? '#F0FDF4' : '#FFF7F7',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  {isCorrect ? (
                    <IoCheckmarkCircle size={24} color="#10B981" style={{ flexShrink: 0, marginTop: 2 }} />
                  ) : (
                    <IoCloseCircle size={24} color="#EF4444" style={{ flexShrink: 0, marginTop: 2 }} />
                  )}

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--kl-primary-dark)', marginBottom: 8 }}>
                      Câu {i + 1}: {q.question}
                    </div>

                    {!isCorrect && (
                      <div style={{ marginBottom: 6, fontSize: 13 }}>
                        <span style={{ color: '#DC2626', fontWeight: 700 }}>
                          ❌ Bé chọn: {chosenOption?.text || '(Chưa chọn/Hết giờ)'}
                        </span>
                      </div>
                    )}

                    <div style={{ fontSize: 13 }}>
                      <span style={{ color: '#059669', fontWeight: 800 }}>
                        ✅ Đáp án đúng: {correctOption?.text}
                      </span>
                    </div>

                    {q.explanation && (
                      <div
                        style={{
                          marginTop: 8,
                          padding: '8px 12px',
                          borderRadius: 12,
                          background: 'rgba(255,255,255,0.7)',
                          border: '1px dashed #CBD5E1',
                          fontSize: 12.5,
                          color: '#475569',
                          lineHeight: 1.4,
                        }}
                      >
                        💡 <strong>Giải thích:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 14 }}>
        <button
          className="kl-btn"
          onClick={() => navigate(`/child/quiz/${quizId}`, { replace: true })}
          style={{
            flex: 1,
            height: 52,
            borderRadius: 18,
            background: '#ffffff',
            border: '2px solid var(--kl-border)',
            color: 'var(--kl-primary-dark)',
            fontSize: 15,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <IoRefresh size={20} /> Làm lại bài này
        </button>

        <button
          className="kl-btn kl-btn-primary"
          onClick={() => navigate('/child/quiz-library')}
          style={{
            flex: 1,
            height: 52,
            borderRadius: 18,
            fontSize: 15,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          Về Thư viện Quiz <IoArrowForward size={20} />
        </button>
      </div>
    </div>
  );
}
