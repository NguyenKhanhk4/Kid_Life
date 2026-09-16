import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';
import { IoClose, IoTimeOutline, IoCheckmarkCircle, IoArrowForward, IoCheckmark } from 'react-icons/io5';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function QuizPage() {
  const navigate = useNavigate();
  const { quizId = '1' } = useParams();
  const quiz = MOCK_KIDLIFE_DATA.quizzes[quizId as keyof typeof MOCK_KIDLIFE_DATA.quizzes] ?? MOCK_KIDLIFE_DATA.quizzes['1'];

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(quiz.questions.length).fill(null));
  const [timer, setTimer] = useState(30);

  const question = quiz.questions[currentQ];
  const isLast = currentQ === quiz.questions.length - 1;
  const progress = ((currentQ + 1) / quiz.questions.length) * 100;

  const handleNext = useCallback(() => {
    if (isLast) {
      const finalAnswers = [...answers];
      if (selected !== null) finalAnswers[currentQ] = selected;
      const score = finalAnswers.reduce<number>((acc, ans, i) => acc + (ans === quiz.questions[i].correctIndex ? 1 : 0), 0);
      const passed = score >= quiz.passScore;
      navigate('/child/quiz-result', {
        state: { score, total: quiz.questions.length, passed, pointsAwarded: passed ? quiz.rewardPoints : 0, quizId },
      });
    } else {
      setCurrentQ(currentQ + 1);
      setSelected(null);
    }
  }, [isLast, answers, selected, currentQ, quiz, navigate, quizId]);

  useEffect(() => {
    setTimer(30);
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) { clearInterval(interval); handleNext(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentQ, handleNext]);

  const handleSelect = (index: number) => {
    setSelected(index);
    const newAnswers = [...answers];
    newAnswers[currentQ] = index;
    setAnswers(newAnswers);
  };

  return (
    <div style={{ paddingTop: 20, display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 100px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: 42, height: 42, borderRadius: 22, background: '#E4E9FF', display: 'grid', placeItems: 'center', flexShrink: 0 }}
        >
          <IoClose size={20} color="var(--kl-primary)" />
        </button>
        <div style={{ flex: 1, height: 8, borderRadius: 4, background: '#E7EBFF', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 4, background: 'var(--kl-primary)', width: `${progress}%`, transition: 'width 0.3s ease' }} />
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4, background: '#E7EBFF',
          borderRadius: 12, padding: '6px 10px',
        }}>
          <IoTimeOutline size={14} color={timer <= 10 ? 'var(--kl-red)' : 'var(--kl-muted)'} />
          <span style={{ fontSize: 13, fontWeight: 700, color: timer <= 10 ? 'var(--kl-red)' : 'var(--kl-muted)' }}>{timer}s</span>
        </div>
      </div>

      {/* Question */}
      <p style={{ color: 'var(--kl-primary)', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
        Câu {currentQ + 1}/{quiz.questions.length}
      </p>
      <h2 style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.4, marginBottom: 28 }}>
        {question.content}
      </h2>

      {/* Options */}
      <div style={{ display: 'grid', gap: 12 }}>
        {question.options.map((opt: string, i: number) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: 16,
              background: selected === i ? 'var(--kl-primary-soft)' : '#fff',
              borderRadius: 16, border: `2px solid ${selected === i ? 'var(--kl-primary)' : 'transparent'}`,
              transition: 'var(--kl-transition)', textAlign: 'left',
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 12, display: 'grid', placeItems: 'center',
              background: selected === i ? 'var(--kl-primary)' : '#E7EBFF',
              color: selected === i ? '#fff' : 'var(--kl-muted)', fontWeight: 800, fontSize: 14,
            }}>
              {OPTION_LABELS[i]}
            </div>
            <span style={{ flex: 1, fontWeight: 600, fontSize: 14, color: selected === i ? 'var(--kl-primary)' : 'var(--kl-text)' }}>
              {opt}
            </span>
            {selected === i && <IoCheckmarkCircle size={22} color="var(--kl-primary)" />}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 'auto', paddingTop: 20, paddingBottom: 10 }}>
        <button
          className="kl-btn kl-btn-primary kl-btn-block"
          onClick={handleNext}
          disabled={selected === null}
          style={{ opacity: selected === null ? 0.4 : 1 }}
        >
          {isLast ? 'Nộp bài' : 'Tiếp theo'}
          {isLast ? <IoCheckmark size={18} /> : <IoArrowForward size={18} />}
        </button>
      </div>
    </div>
  );
}
