// Quản lý kho nội dung 3 tầng: Admin (Kho Master) → Phụ huynh (Chọn & Giao) → Bé (Học & Làm)
import { QuizSet } from '@/shared/types/quiz';
import { VideoLesson } from '@/shared/types/videoLesson';
import { INITIAL_QUIZ_SETS } from '@/shared/constants/quizMockData';
import { INITIAL_VIDEO_LESSONS } from '@/shared/constants/videoLessonMockData';

const ADMIN_QUIZ_BANK_KEY = 'kidlife_admin_quizbank';
const ADMIN_VIDEO_BANK_KEY = 'kidlife_admin_videobank';
const ASSIGNED_QUIZ_KEY = 'kidlife_assigned_quizsets';
const ASSIGNED_VIDEO_KEY = 'kidlife_assigned_videos';

// Danh sách mặc định ban đầu được giao cho bé
const DEFAULT_ASSIGNED_QUIZZES = ['quiz-1', 'quiz-2', 'quiz-3', 'quiz-4', 'quiz-5', 'quiz-6'];
const DEFAULT_ASSIGNED_VIDEOS = ['vid-1', 'vid-2', 'vid-3', 'vid-4'];

// ─── 1. QUIZ BANK MANAGEMENT (ADMIN) ─────────────────────────────────────────

export const getAdminQuizBank = (): QuizSet[] => {
  try {
    const raw = localStorage.getItem(ADMIN_QUIZ_BANK_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  // Mặc định lưu 10 bộ đề ban đầu
  localStorage.setItem(ADMIN_QUIZ_BANK_KEY, JSON.stringify(INITIAL_QUIZ_SETS));
  return INITIAL_QUIZ_SETS;
};

export const saveAdminQuizBank = (data: QuizSet[]): void => {
  localStorage.setItem(ADMIN_QUIZ_BANK_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent('kidlife_admin_quizbank_update', { detail: data }));
};

export const updateQuizSetInBank = (updatedQuiz: QuizSet): void => {
  const bank = getAdminQuizBank();
  const index = bank.findIndex((q) => q.id === updatedQuiz.id);
  let newBank: QuizSet[];
  if (index >= 0) {
    newBank = bank.map((q) => (q.id === updatedQuiz.id ? updatedQuiz : q));
  } else {
    newBank = [updatedQuiz, ...bank];
  }
  saveAdminQuizBank(newBank);
};

export const deleteQuizSetFromBank = (quizId: string): void => {
  const bank = getAdminQuizBank();
  const newBank = bank.filter((q) => q.id !== quizId);
  saveAdminQuizBank(newBank);

  // Xóa khỏi danh sách assign của bé nếu có
  const assigned = getAssignedQuizSets();
  if (assigned.includes(quizId)) {
    toggleAssignQuizSet(quizId);
  }
};

export const toggleQuizVisibility = (quizId: string): 'visible' | 'hidden' => {
  const bank = getAdminQuizBank();
  let updatedStatus: 'visible' | 'hidden' = 'visible';
  const newBank = bank.map((q) => {
    if (q.id === quizId) {
      updatedStatus = q.status === 'hidden' ? 'visible' : 'hidden';
      return { ...q, status: updatedStatus };
    }
    return q;
  });
  saveAdminQuizBank(newBank);
  return updatedStatus;
};

// ─── 2. ASSIGNED QUIZZES (PARENT → CHILD) ───────────────────────────────────

export const getAssignedQuizSets = (): string[] => {
  try {
    const raw = localStorage.getItem(ASSIGNED_QUIZ_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  localStorage.setItem(ASSIGNED_QUIZ_KEY, JSON.stringify(DEFAULT_ASSIGNED_QUIZZES));
  return DEFAULT_ASSIGNED_QUIZZES;
};

export const toggleAssignQuizSet = (quizId: string): boolean => {
  const current = getAssignedQuizSets();
  const exists = current.includes(quizId);
  const updated = exists ? current.filter((id) => id !== quizId) : [...current, quizId];
  localStorage.setItem(ASSIGNED_QUIZ_KEY, JSON.stringify(updated));
  window.dispatchEvent(
    new CustomEvent('kidlife_quiz_assigned_update', { detail: { quizId, isAssigned: !exists } })
  );
  return !exists;
};

// ─── 3. VIDEO BANK MANAGEMENT (ADMIN) ────────────────────────────────────────

export const getAdminVideoBank = (): VideoLesson[] => {
  try {
    const raw = localStorage.getItem(ADMIN_VIDEO_BANK_KEY);
    if (raw) {
      const parsed: VideoLesson[] = JSON.parse(raw);
      let changed = false;
      const merged = parsed.map((item) => {
        if (!item.video_url?.trim()) {
          const init = INITIAL_VIDEO_LESSONS.find((v) => v.id === item.id);
          if (init?.video_url) {
            changed = true;
            return { ...item, video_url: init.video_url };
          }
        }
        return item;
      });
      if (changed) {
        localStorage.setItem(ADMIN_VIDEO_BANK_KEY, JSON.stringify(merged));
      }
      return merged;
    }
  } catch {
    // fallback
  }
  localStorage.setItem(ADMIN_VIDEO_BANK_KEY, JSON.stringify(INITIAL_VIDEO_LESSONS));
  return INITIAL_VIDEO_LESSONS;
};

export const saveAdminVideoBank = (data: VideoLesson[]): void => {
  localStorage.setItem(ADMIN_VIDEO_BANK_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent('kidlife_admin_videobank_update', { detail: data }));
};

export const updateVideoInBank = (updatedVideo: VideoLesson): void => {
  const bank = getAdminVideoBank();
  const index = bank.findIndex((v) => v.id === updatedVideo.id);
  let newBank: VideoLesson[];
  if (index >= 0) {
    newBank = bank.map((v) => (v.id === updatedVideo.id ? updatedVideo : v));
  } else {
    newBank = [updatedVideo, ...bank];
  }
  saveAdminVideoBank(newBank);
};

export const deleteVideoFromBank = (videoId: string): void => {
  const bank = getAdminVideoBank();
  const newBank = bank.filter((v) => v.id !== videoId);
  saveAdminVideoBank(newBank);

  // Xóa khỏi danh sách giao cho bé nếu có
  const assigned = getAssignedVideos();
  if (assigned.includes(videoId)) {
    toggleAssignVideo(videoId);
  }
};

export const toggleVideoVisibility = (videoId: string): 'visible' | 'hidden' => {
  const bank = getAdminVideoBank();
  let updatedStatus: 'visible' | 'hidden' = 'visible';
  const newBank = bank.map((v) => {
    if (v.id === videoId) {
      updatedStatus = v.status === 'hidden' ? 'visible' : 'hidden';
      return { ...v, status: updatedStatus };
    }
    return v;
  });
  saveAdminVideoBank(newBank);
  return updatedStatus;
};

// ─── 4. ASSIGNED VIDEOS (PARENT → CHILD) ────────────────────────────────────

export const getAssignedVideos = (): string[] => {
  try {
    const raw = localStorage.getItem(ASSIGNED_VIDEO_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  localStorage.setItem(ASSIGNED_VIDEO_KEY, JSON.stringify(DEFAULT_ASSIGNED_VIDEOS));
  return DEFAULT_ASSIGNED_VIDEOS;
};

export const toggleAssignVideo = (videoId: string): boolean => {
  const current = getAssignedVideos();
  const exists = current.includes(videoId);
  const updated = exists ? current.filter((id) => id !== videoId) : [...current, videoId];
  localStorage.setItem(ASSIGNED_VIDEO_KEY, JSON.stringify(updated));
  window.dispatchEvent(
    new CustomEvent('kidlife_video_assigned_update', { detail: { videoId, isAssigned: !exists } })
  );
  return !exists;
};

// ─── 5. CSV EXPORT UTILITY ──────────────────────────────────────────────────

export const exportToCSV = (filename: string, headers: string[], rows: (string | number)[][]): void => {
  const processCell = (cell: string | number) => {
    const str = String(cell ?? '').replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvContent =
    '\uFEFF' + // UTF-8 BOM
    headers.map(processCell).join(',') +
    '\n' +
    rows.map((row) => row.map(processCell).join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
