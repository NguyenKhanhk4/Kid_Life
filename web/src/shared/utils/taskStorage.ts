// Tiện ích quản lý danh sách nhiệm vụ đồng bộ Realtime giữa Phụ huynh và Bé
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';
import { triggerCelebrationNotice } from '@/shared/utils/walletStorage';

const D = MOCK_KIDLIFE_DATA;

const TASKS_STORAGE_KEY = 'kidlife_tasks_data';
const PROOFS_STORAGE_KEY = 'kidlife_task_proofs';

export interface SubTaskItem {
  id: string;
  title: string;
  done: boolean;
}

export interface TaskItem {
  id: string;
  icon: string;
  title: string;
  time: string;
  xp: string;
  rewardXP: number;
  category: string;
  status: 'todo' | 'in_progress' | 'submitted' | 'done';
  subtasks: SubTaskItem[];
  proofImage?: string;
  submittedAt?: string;
}

export interface TaskProofData {
  taskId: string;
  taskTitle: string;
  proofImage: string;
  submittedAt: string;
  rewardXP?: number;
}

// 1. Lấy danh sách nhiệm vụ
export function getTasks(): TaskItem[] {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (raw) {
      const parsed: TaskItem[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }

  // Khởi tạo từ mock data mặc định
  const initialTasks: TaskItem[] = D.todayTasks.map((t) => ({
    id: t.id,
    icon: t.icon,
    title: t.title,
    time: t.time,
    xp: t.xp,
    rewardXP: t.rewardXP,
    category: t.category,
    status: (t.status as TaskItem['status']) || 'todo',
    subtasks: t.subtasks.map((s) => ({ id: s.id, title: s.title, done: s.done })),
  }));

  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(initialTasks));
  return initialTasks;
}

// 2. Lưu danh sách nhiệm vụ và phát sự kiện đồng bộ
export function saveTasks(tasks: TaskItem[]): void {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  window.dispatchEvent(new CustomEvent('kidlife_tasks_update', { detail: tasks }));
  window.dispatchEvent(new CustomEvent('kidlife_approvals_count_update'));
}

// 3. Phụ huynh tạo nhiệm vụ mới
export function createNewTask(payload: {
  title: string;
  category: string;
  rewardXP: number;
  time: string;
  icon?: string;
  subtasks: string[];
}): TaskItem {
  const currentTasks = getTasks();
  const taskId = `task-${Date.now()}`;

  const subtasksList: SubTaskItem[] =
    payload.subtasks.length > 0
      ? payload.subtasks.map((stTitle, idx) => ({
          id: `st-${taskId}-${idx + 1}`,
          title: stTitle.trim(),
          done: false,
        }))
      : [
          {
            id: `st-${taskId}-1`,
            title: 'Hoàn thành nhiệm vụ được giao',
            done: false,
          },
        ];

  const newTask: TaskItem = {
    id: taskId,
    icon: payload.icon || '🎯',
    title: payload.title.trim(),
    time: payload.time.trim() || 'Hôm nay',
    xp: `+${payload.rewardXP} XP`,
    rewardXP: payload.rewardXP,
    category: payload.category.trim() || 'Kỹ năng',
    status: 'todo',
    subtasks: subtasksList,
  };

  const updated = [newTask, ...currentTasks];
  saveTasks(updated);
  return newTask;
}

// 4. Bé cập nhật bước checklist
export function toggleSubtaskItem(taskId: string, subId: string): TaskItem[] {
  const currentTasks = getTasks();
  const updated = currentTasks.map((t) => {
    if (t.id !== taskId) return t;

    const newSubs = t.subtasks.map((s) => (s.id === subId ? { ...s, done: !s.done } : s));
    const allDone = newSubs.every((s) => s.done);
    const anyDone = newSubs.some((s) => s.done);

    let newStatus: TaskItem['status'] = t.status;
    if (t.status !== 'done' && t.status !== 'submitted') {
      newStatus = allDone ? 'in_progress' : anyDone ? 'in_progress' : 'todo';
    }

    return {
      ...t,
      subtasks: newSubs,
      status: newStatus,
    };
  });

  saveTasks(updated);
  return updated;
}

// 5. Bé nộp ảnh minh chứng
export function submitTaskProof(taskId: string, proofImage: string): TaskItem | null {
  const currentTasks = getTasks();
  let updatedTask: TaskItem | null = null;

  const updated = currentTasks.map((t) => {
    if (t.id === taskId) {
      updatedTask = {
        ...t,
        status: 'submitted' as const,
        subtasks: t.subtasks.map((s) => ({ ...s, done: true })),
        proofImage,
        submittedAt: new Date().toISOString(),
      };
      return updatedTask;
    }
    return t;
  });

  saveTasks(updated);

  // Lưu vào storage cho trang duyệt bài của phụ huynh
  try {
    const rawProofs = localStorage.getItem(PROOFS_STORAGE_KEY);
    const proofs: Record<string, TaskProofData> = rawProofs ? JSON.parse(rawProofs) : {};
    if (updatedTask) {
      proofs[taskId] = {
        taskId,
        taskTitle: (updatedTask as TaskItem).title,
        proofImage,
        rewardXP: (updatedTask as TaskItem).rewardXP,
        submittedAt: new Date().toISOString(),
      };
      localStorage.setItem(PROOFS_STORAGE_KEY, JSON.stringify(proofs));
    }
  } catch {
    // ignore
  }

  window.dispatchEvent(new CustomEvent('kidlife_approvals_count_update'));
  return updatedTask;
}

// 6. Phụ huynh phê duyệt nhiệm vụ
export function approveTask(taskId: string): void {
  const currentTasks = getTasks();
  const taskToApprove = currentTasks.find((t) => t.id === taskId);

  const updated = currentTasks.map((t) => {
    if (t.id === taskId) {
      return {
        ...t,
        status: 'done' as const,
        subtasks: t.subtasks.map((s) => ({ ...s, done: true })),
      };
    }
    return t;
  });

  saveTasks(updated);

  // Xoá khỏi hàng đợi nộp bài
  try {
    const rawProofs = localStorage.getItem(PROOFS_STORAGE_KEY);
    if (rawProofs) {
      const proofs: Record<string, TaskProofData> = JSON.parse(rawProofs);
      delete proofs[taskId];
      localStorage.setItem(PROOFS_STORAGE_KEY, JSON.stringify(proofs));
    }
  } catch {
    // ignore
  }

  // Cộng XP và bắn thông báo chúc mừng 3s sang màn hình của bé
  if (taskToApprove) {
    triggerCelebrationNotice(taskId, taskToApprove.title, taskToApprove.rewardXP || 60);
  }

  window.dispatchEvent(new CustomEvent('kidlife_approvals_count_update'));
}

// 7. Phụ huynh từ chối / Nhắc con làm lại
export function rejectTask(taskId: string): void {
  const currentTasks = getTasks();

  const updated = currentTasks.map((t) => {
    if (t.id === taskId) {
      return {
        ...t,
        status: 'in_progress' as const,
        proofImage: undefined,
        submittedAt: undefined,
      };
    }
    return t;
  });

  saveTasks(updated);

  try {
    const rawProofs = localStorage.getItem(PROOFS_STORAGE_KEY);
    if (rawProofs) {
      const proofs: Record<string, TaskProofData> = JSON.parse(rawProofs);
      delete proofs[taskId];
      localStorage.setItem(PROOFS_STORAGE_KEY, JSON.stringify(proofs));
    }
  } catch {
    // ignore
  }

  window.dispatchEvent(new CustomEvent('kidlife_approvals_count_update'));
}

// 8. Đặt lại nhiệm vụ (Làm lại)
export function resetTaskToTodo(taskId: string): void {
  const currentTasks = getTasks();
  const updated = currentTasks.map((t) => {
    if (t.id === taskId) {
      return {
        ...t,
        status: 'todo' as const,
        subtasks: t.subtasks.map((s) => ({ ...s, done: false })),
        proofImage: undefined,
        submittedAt: undefined,
      };
    }
    return t;
  });

  saveTasks(updated);

  try {
    const rawProofs = localStorage.getItem(PROOFS_STORAGE_KEY);
    if (rawProofs) {
      const proofs: Record<string, TaskProofData> = JSON.parse(rawProofs);
      delete proofs[taskId];
      localStorage.setItem(PROOFS_STORAGE_KEY, JSON.stringify(proofs));
    }
  } catch {
    // ignore
  }

  window.dispatchEvent(new CustomEvent('kidlife_approvals_count_update'));
}

// 9. Xoá nhiệm vụ
export function deleteTask(taskId: string): void {
  const currentTasks = getTasks();
  const updated = currentTasks.filter((t) => t.id !== taskId);
  saveTasks(updated);

  try {
    const rawProofs = localStorage.getItem(PROOFS_STORAGE_KEY);
    if (rawProofs) {
      const proofs: Record<string, TaskProofData> = JSON.parse(rawProofs);
      delete proofs[taskId];
      localStorage.setItem(PROOFS_STORAGE_KEY, JSON.stringify(proofs));
    }
  } catch {
    // ignore
  }

  window.dispatchEvent(new CustomEvent('kidlife_approvals_count_update'));
}

// 10. Đếm số lượng yêu cầu chờ duyệt thực tế
export function getPendingApprovalsCount(): number {
  try {
    const tasks = getTasks();
    const submittedTasks = tasks.filter((t) => t.status === 'submitted');
    const rawProofs = localStorage.getItem(PROOFS_STORAGE_KEY);
    const proofs: Record<string, TaskProofData> = rawProofs ? JSON.parse(rawProofs) : {};
    
    // Tổng số bài đã nộp ảnh hoặc ở trạng thái submitted
    const uniqueIds = new Set([...submittedTasks.map((t) => t.id), ...Object.keys(proofs)]);
    return uniqueIds.size;
  } catch {
    return 0;
  }
}
