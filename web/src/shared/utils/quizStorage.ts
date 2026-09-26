// Tiện ích quản lý dữ liệu Quiz, lưu trữ kết quả và bộ đề tự tạo vào localStorage
import { QuizSet, QuizProgressRecord, CustomQuizSetFormData } from '@/shared/types/quiz';
import { INITIAL_QUIZ_SETS } from '@/shared/constants/quizMockData';
import { getWalletData, saveWalletData, addTransaction, WalletData } from '@/shared/utils/walletStorage';

const QUIZ_PROGRESS_KEY = 'kidlife_quiz_progress';
const CUSTOM_QUIZ_KEY = 'kidlife_custom_quizsets';
const ASSIGNED_QUIZ_KEY = 'kidlife_assigned_quizzes';

// 1. Lấy danh sách tất cả các bộ đề (kho Admin + do bố mẹ tự tạo)
import { getAdminQuizBank, getAssignedQuizSets, toggleAssignQuizSet } from '@/shared/utils/contentStorage';

export function getAllQuizSets(): QuizSet[] {
  let customSets: QuizSet[] = [];
  try {
    const raw = localStorage.getItem(CUSTOM_QUIZ_KEY);
    if (raw) {
      customSets = JSON.parse(raw);
    }
  } catch {
    // fallback
  }

  const adminBank = getAdminQuizBank();
  // Phụ huynh và bé chỉ thấy các bộ đề có status !== 'hidden'
  const visibleBank = adminBank.filter((q) => q.status !== 'hidden');
  const assignedList = getAssignedQuizSets();
  const progressMap = getQuizProgressMap();

  const all = [...visibleBank, ...customSets];

  return all.map((quiz) => {
    const prog = progressMap[quiz.id];
    // Bộ đề tự tạo mặc định đã giao, bộ đề từ kho thì kiểm tra danh sách assigned
    const isAssigned = quiz.isCustom ? true : assignedList.includes(quiz.id);
    return {
      ...quiz,
      isAssigned,
      isCompleted: prog?.completed || false,
      lastScore: prog?.score,
      lastPercentage: prog?.percentage,
      completedAt: prog?.completedAt,
    };
  });
}

// 2. Lấy bộ đề theo ID
export function getQuizSetById(id: string): QuizSet | undefined {
  const sets = getAllQuizSets();
  return sets.find((s) => s.id === id);
}

// 3. Quản lý trạng thái giao bài của phụ huynh
export function toggleQuizAssignment(quizId: string): boolean {
  return toggleAssignQuizSet(quizId);
}

// 4. Lấy tiến độ làm quiz của bé
export function getQuizProgressMap(): Record<string, QuizProgressRecord> {
  try {
    const raw = localStorage.getItem(QUIZ_PROGRESS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return {};
}

// 5. Lưu kết quả làm quiz và cộng XP nếu đạt
export function recordQuizResult(params: {
  quizId: string;
  quizTitle: string;
  score: number;
  total: number;
  passScorePercentage: number;
  rewardXP: number;
  answers?: Record<string, string>;
}): { passed: boolean; percentage: number; xpAwarded: number } {
  const { quizId, quizTitle, score, total, passScorePercentage, rewardXP, answers } = params;
  const percentage = Math.round((score / total) * 100);
  const passed = percentage >= passScorePercentage;

  const currentProgress = getQuizProgressMap();
  const previousRecord = currentProgress[quizId];
  
  // Xác định xem đã nhận XP cho bài này trước đó chưa (tránh cộng dồn nhiều lần nếu đã pass)
  const alreadyPassedBefore = previousRecord?.passed === true;
  const xpAwarded = passed && !alreadyPassedBefore ? rewardXP : (passed ? Math.round(rewardXP * 0.3) : 0); // Thưởng ôn tập lại

  const newRecord: QuizProgressRecord = {
    quizId,
    quizTitle,
    completed: true,
    score,
    total,
    percentage,
    passed,
    reward_xp: xpAwarded,
    completedAt: new Date().toISOString(),
    answers,
  };

  currentProgress[quizId] = newRecord;
  localStorage.setItem(QUIZ_PROGRESS_KEY, JSON.stringify(currentProgress));
  window.dispatchEvent(new CustomEvent('kidlife_quiz_progress_update', { detail: newRecord }));

  // Nếu đạt điểm chuẩn, cộng XP vào ví bé
  if (xpAwarded > 0) {
    const wallet = getWalletData();
    const updatedWallet: WalletData = {
      ...wallet,
      balance: wallet.balance + xpAwarded,
    };
    saveWalletData(updatedWallet);

    addTransaction({
      title: `Kiểm tra trí nhớ: ${quizTitle} (${score}/${total} câu)`,
      amount: xpAwarded,
      emoji: '🧠',
      type: 'earn',
      date: 'Vừa xong',
    });
  }

  return { passed, percentage, xpAwarded };
}

// 6. Lưu bộ đề mới do bố mẹ tự tạo
export function createCustomQuizSet(data: CustomQuizSetFormData): QuizSet {
  let customSets: QuizSet[] = [];
  try {
    const raw = localStorage.getItem(CUSTOM_QUIZ_KEY);
    if (raw) customSets = JSON.parse(raw);
  } catch {
    // fallback
  }

  const newId = `quiz-custom-${Date.now()}`;
  const newSet: QuizSet = {
    id: newId,
    title: data.title,
    description: `Bộ đề do Ba Mẹ tự thiết kế dành riêng cho bé.`,
    category: data.category,
    categoryLabel: data.categoryLabel,
    ageRange: data.ageRange,
    emoji: data.emoji || '📝',
    questionCount: data.questions.length,
    reward_xp: data.reward_xp || 30,
    pass_score: data.pass_score || 70,
    time_per_question: 30,
    difficulty: data.difficulty || 'medium',
    isCustom: true,
    isAssigned: true,
    questions: data.questions.map((q, idx) => ({
      id: `q-cust-${idx + 1}-${Date.now()}`,
      question: q.question,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation || 'Hãy ghi nhớ lời dặn của ba mẹ để làm thật tốt nhé!',
    })),
  };

  const updated = [newSet, ...customSets];
  localStorage.setItem(CUSTOM_QUIZ_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('kidlife_custom_quiz_created', { detail: newSet }));

  return newSet;
}
