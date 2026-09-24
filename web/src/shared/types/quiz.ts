// Interface định nghĩa bộ đề và câu hỏi trắc nghiệm kiểm tra trí nhớ
export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correct_answer: string; // id của QuizOption đúng (vd: 'opt-a', 'opt-b' hoặc '1', '2')
  explanation?: string;   // Giải thích lý do đáp án đúng
}

export type QuizCategory = 've_sinh' | 'tu_lap' | 'giao_tiep' | 'cam_xuc' | 'sang_tao' | 'le_phep' | 'suc_khoe';

export interface QuizSet {
  id: string;
  title: string;           // "Cách đánh răng đúng cách"
  description: string;
  category: QuizCategory;
  categoryLabel: string;   // "Vệ sinh"
  ageRange: string;        // "4-6 tuổi"
  ageMin?: number;
  ageMax?: number;
  emoji: string;           // "🦷"
  questionCount: number;
  reward_xp: number;
  pass_score: number;      // % điểm sàn để đạt (ví dụ: 70)
  time_per_question: number; // giây (mặc định 30)
  difficulty: 'easy' | 'medium' | 'hard';
  status?: 'visible' | 'hidden'; // Trạng thái hiển thị (admin quản lý)
  isCustom?: boolean;      // do bố mẹ tạo
  isAssigned?: boolean;    // đã giao cho bé
  isCompleted?: boolean;   // trạng thái bé đã làm chưa (lưu localStorage)
  lastScore?: number;      // điểm lần làm gần nhất (số câu đúng)
  lastPercentage?: number; // % điểm lần làm gần nhất
  completedAt?: string;
  step_order?: number;     // thứ tự sắp xếp
  questions: QuizQuestion[];
}

export interface QuizProgressRecord {
  quizId: string;
  quizTitle: string;
  completed: boolean;
  score: number;          // số câu đúng
  total: number;          // tổng số câu
  percentage: number;     // điểm %
  passed: boolean;        // đạt sàn pass_score
  reward_xp: number;      // XP đã nhận
  completedAt: string;
  answers?: Record<string, string>; // questionId -> chosenOptionId
}

export interface CustomQuizSetFormData {
  title: string;
  category: QuizCategory;
  categoryLabel: string;
  ageRange: string;
  emoji: string;
  reward_xp: number;
  pass_score: number;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: {
    question: string;
    options: { id: string; text: string }[];
    correct_answer: string;
    explanation: string;
  }[];
}
