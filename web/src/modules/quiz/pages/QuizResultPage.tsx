import { useNavigate, useLocation } from 'react-router-dom';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';
import { IoCheckmarkCircle, IoCloseCircle, IoRefresh, IoArrowForward, IoTrophy, IoStar } from 'react-icons/io5';

export default function QuizResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { score = 4, total = 5, passed = true, pointsAwarded = 50, quizId = '1' } = (location.state as any) ?? {};

  const quiz = MOCK_KIDLIFE_DATA.quizzes[quizId as keyof typeof MOCK_KIDLIFE_DATA.quizzes] ?? MOCK_KIDLIFE_DATA.quizzes['1'];
  const questions = quiz.questions;
  const mockUserAnswers = questions.map((q: any, i: number) => i < score ? q.correctIndex : (q.correctIndex + 1) % 4);

  return (
    <div style={{ paddingTop: 20 }}>
      {/* Result header */}
      <div style={{ textAlign: 'center', marginBottom: 30 }}>
        <div style={{
          width: 120, height: 120, borderRadius: 60, display: 'grid', placeItems: 'center',
          margin: '0 auto 16px',
          background: passed ? 'var(--kl-green-soft)' : 'var(--kl-red-soft)',
          border: `4px solid ${passed ? 'var(--kl-green)' : 'var(--kl-red)'}`,
        }}>
          <div>
            <div style={{ fontSize: 36, fontWeight: 900 }}>{score}/{total}</div>
            <div style={{ fontSize: 12, color: 'var(--kl-muted)', marginTop: -2 }}>câu đúng</div>
          </div>
        </div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 20,
          padding: '8px 16px', marginBottom: 10,
          background: passed ? 'var(--kl-orange-soft)' : 'var(--kl-red-soft)',
        }}>
          {passed ? <IoTrophy size={18} color="#B36A00" /> : <IoRefresh size={18} color="var(--kl-red)" />}
          <span style={{ fontSize: 16, fontWeight: 800, color: passed ? '#B36A00' : 'var(--kl-red)' }}>
            {passed ? 'Xuất sắc!' : 'Chưa đạt'}
          </span>
        </div>

        {pointsAwarded > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <IoStar size={16} color="var(--kl-orange)" />
            <span style={{ color: 'var(--kl-orange)', fontSize: 16, fontWeight: 800 }}>+{pointsAwarded} XP</span>
          </div>
        )}
      </div>

      {/* Review answers */}
      <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>Xem lại câu trả lời</h3>
      <div style={{ display: 'grid', gap: 10, marginBottom: 20 }}>
        {questions.map((q: any, i: number) => {
          const userAnswer = mockUserAnswers[i];
          const isCorrect = userAnswer === q.correctIndex;
          return (
            <div
              key={i}
              style={{
                borderRadius: 14, padding: 14, borderLeft: `4px solid ${isCorrect ? 'var(--kl-green)' : 'var(--kl-red)'}`,
                background: isCorrect ? '#F1F9D7' : '#FFF0F0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                {isCorrect
                  ? <IoCheckmarkCircle size={20} color="var(--kl-green)" />
                  : <IoCloseCircle size={20} color="var(--kl-red)" />
                }
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, lineHeight: 1.5 }}>
                  Câu {i + 1}: {q.content}
                </span>
              </div>
              {!isCorrect && (
                <div style={{ marginTop: 8, marginLeft: 28 }}>
                  <p style={{ color: 'var(--kl-red)', fontSize: 12 }}>❌ Bạn chọn: {q.options[userAnswer]}</p>
                  <p style={{ color: 'var(--kl-green)', fontSize: 12, fontWeight: 600 }}>✅ Đáp án: {q.options[q.correctIndex]}</p>
                </div>
              )}
              {isCorrect && (
                <p style={{ color: 'var(--kl-green)', fontSize: 12, fontWeight: 600, marginTop: 6, marginLeft: 28 }}>
                  ✅ {q.options[q.correctIndex]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, paddingBottom: 20 }}>
        <button
          className="kl-btn kl-btn-secondary"
          style={{ flex: 1 }}
          onClick={() => navigate(`/child/quiz/${quizId}`, { replace: true })}
        >
          <IoRefresh size={18} /> Làm lại
        </button>
        <button
          className="kl-btn kl-btn-primary"
          style={{ flex: 1 }}
          onClick={() => navigate('/child/home')}
        >
          Quay về <IoArrowForward size={18} />
        </button>
      </div>
    </div>
  );
}
