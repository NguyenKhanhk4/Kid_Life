import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MOCK_KIDLIFE_DATA } from '../constants/kidlifeMockData';

export type TaskStatus = 'todo' | 'in_progress' | 'submitted' | 'done' | 'resubmit';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface KidLifeTask {
  id: string;
  icon: string;
  title: string;
  time: string;
  xp: string;
  rewardXP: number;
  category: string;
  status: TaskStatus;
  subtasks: Array<{ id: string; title: string; done: boolean }>;
}

export interface Wish {
  id: string;
  child: string;
  text: string;
  cost: number;
  time: string;
  status: ReviewStatus | 'converted';
  hasRecording: boolean;
  feedback?: string;
}

export interface Submission {
  id: string;
  taskId: string;
  missionTitle: string;
  childName: string;
  childAvatar: string;
  submittedAt: string;
  emoji: string;
  rewardXP: number;
  status: ReviewStatus;
  aiLabel: string;
  aiConfidence: number;
  feedback?: string;
}

export interface RedemptionRequest {
  id: string;
  rewardId: string;
  rewardTitle: string;
  childName: string;
  icon: string;
  cost: number;
  requestedAt: string;
  status: ReviewStatus;
}

export interface AppNotification {
  id: string;
  type: 'submission' | 'wish' | 'reward' | 'penalty' | 'system';
  icon: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  targetId?: string;
}

interface KidLifeState {
  child: typeof MOCK_KIDLIFE_DATA.child;
  wallet: typeof MOCK_KIDLIFE_DATA.wallet;
  tasks: KidLifeTask[];
  penalties: typeof MOCK_KIDLIFE_DATA.penalties;
  rewards: typeof MOCK_KIDLIFE_DATA.rewards;
  familyMembers: typeof MOCK_KIDLIFE_DATA.familyMembers;
  wishes: Wish[];
  submissions: Submission[];
  redemptionRequests: RedemptionRequest[];
  notifications: AppNotification[];
  childStoryIds: string[];
  rewardedQuizIds: string[];
  pet: typeof MOCK_KIDLIFE_DATA.pet & { equippedItem?: string; ownedItems: string[] };
}

const initialState: KidLifeState = {
  child: MOCK_KIDLIFE_DATA.child,
  wallet: MOCK_KIDLIFE_DATA.wallet,
  tasks: MOCK_KIDLIFE_DATA.todayTasks.map((task) => ({
    ...task,
    status: task.status as TaskStatus,
    subtasks: task.subtasks.map((subtask) => ({ ...subtask })),
  })),
  penalties: MOCK_KIDLIFE_DATA.penalties.map((penalty) => ({ ...penalty })),
  rewards: MOCK_KIDLIFE_DATA.rewards.map((reward) => ({ ...reward })),
  familyMembers: MOCK_KIDLIFE_DATA.familyMembers.map((member) => ({ ...member })),
  wishes: [
    {
      id: 'w1',
      child: MOCK_KIDLIFE_DATA.child.name,
      text: 'Đi công viên nước cuối tuần',
      cost: 50,
      time: 'Hôm nay, 15:30',
      status: 'pending',
      hasRecording: true,
    },
  ],
  submissions: [
    {
      id: 'sub-1',
      taskId: 't2',
      missionTitle: 'Chuẩn bị bữa sáng phụ ba mẹ',
      childName: MOCK_KIDLIFE_DATA.child.name,
      childAvatar: MOCK_KIDLIFE_DATA.child.avatar,
      submittedAt: 'Hôm nay, 07:32',
      emoji: '🍳',
      rewardXP: 60,
      status: 'pending',
      aiLabel: 'Bằng chứng rõ ràng',
      aiConfidence: 94,
    },
  ],
  redemptionRequests: [
    {
      id: 'redeem-1',
      rewardId: 'r1',
      rewardTitle: '15 phút chơi game',
      childName: MOCK_KIDLIFE_DATA.child.name,
      icon: '🎮',
      cost: 100,
      requestedAt: 'Hôm nay, 18:45',
      status: 'pending',
    },
  ],
  notifications: [
    {
      id: 'notification-1',
      type: 'submission',
      icon: '🎉',
      title: 'Bé đã nộp bằng chứng',
      body: 'Minh Anh vừa nộp bài “Chuẩn bị bữa sáng phụ ba mẹ”.',
      time: '5 phút trước',
      read: false,
      targetId: 'sub-1',
    },
    {
      id: 'notification-2',
      type: 'wish',
      icon: '🧞',
      title: 'Bé gửi điều ước mới',
      body: 'Đi công viên nước cuối tuần',
      time: '1 giờ trước',
      read: false,
      targetId: 'w1',
    },
    {
      id: 'notification-3',
      type: 'system',
      icon: '💡',
      title: 'Gợi ý nhiệm vụ mới',
      body: 'Có một nhiệm vụ phù hợp để cải thiện chỉ số Sức khỏe.',
      time: 'Hôm qua',
      read: true,
    },
  ],
  childStoryIds: [],
  rewardedQuizIds: [],
  pet: { ...MOCK_KIDLIFE_DATA.pet, fed: false, ownedItems: ['Mũ vàng', 'Áo xanh'] },
};

const addNotification = (
  state: KidLifeState,
  notification: Omit<AppNotification, 'id' | 'time' | 'read'>,
) => {
  state.notifications.unshift({
    ...notification,
    id: `notification-${Date.now()}-${state.notifications.length}`,
    time: 'Vừa xong',
    read: false,
  });
};

const kidlifeSlice = createSlice({
  name: 'kidlife',
  initialState,
  reducers: {
    addTask: (
      state,
      action: PayloadAction<{
        title: string;
        time: string;
        rewardXP: number;
        category?: string;
        subtasks?: string[];
        icon?: string;
      }>,
    ) => {
      const id = `task-${Date.now()}-${state.tasks.length}`;
      const subtasks = action.payload.subtasks?.filter(Boolean) ?? [];
      state.tasks.unshift({
        id,
        icon: action.payload.icon ?? '📋',
        title: action.payload.title.trim(),
        time: action.payload.time,
        rewardXP: action.payload.rewardXP,
        xp: `+${action.payload.rewardXP} XP`,
        category: action.payload.category ?? 'Kỹ năng',
        status: 'todo',
        subtasks: (subtasks.length ? subtasks : [action.payload.title]).map((title, index) => ({
          id: `${id}-step-${index + 1}`,
          title,
          done: false,
        })),
      });
      addNotification(state, {
        type: 'system',
        icon: '📋',
        title: 'Nhiệm vụ mới đã được giao',
        body: action.payload.title,
        targetId: id,
      });
    },
    toggleSubtask: (
      state,
      action: PayloadAction<{ taskId: string; subtaskId: string }>,
    ) => {
      const task = state.tasks.find((item) => item.id === action.payload.taskId);
      const subtask = task?.subtasks.find((item) => item.id === action.payload.subtaskId);
      if (!task || !subtask || task.status === 'submitted' || task.status === 'done') return;
      subtask.done = !subtask.done;
      task.status = task.subtasks.some((item) => item.done) ? 'in_progress' : 'todo';
    },
    submitTask: (state, action: PayloadAction<{ taskId: string }>) => {
      const task = state.tasks.find((item) => item.id === action.payload.taskId);
      if (!task || !task.subtasks.every((item) => item.done) || task.status === 'submitted') return;
      task.status = 'submitted';
      const id = `submission-${Date.now()}-${state.submissions.length}`;
      state.submissions.unshift({
        id,
        taskId: task.id,
        missionTitle: task.title,
        childName: state.child.name,
        childAvatar: state.child.avatar,
        submittedAt: 'Vừa xong',
        emoji: task.icon,
        rewardXP: task.rewardXP,
        status: 'pending',
        aiLabel: 'Đủ các bước',
        aiConfidence: 92,
      });
      addNotification(state, {
        type: 'submission',
        icon: '✅',
        title: 'Bé đã nộp bằng chứng',
        body: `${state.child.name} đã nộp bài “${task.title}”.`,
        targetId: id,
      });
    },
    reviewSubmission: (
      state,
      action: PayloadAction<{ submissionId: string; approved: boolean; feedback?: string }>,
    ) => {
      const submission = state.submissions.find((item) => item.id === action.payload.submissionId);
      if (!submission || submission.status !== 'pending') return;
      submission.status = action.payload.approved ? 'approved' : 'rejected';
      submission.feedback = action.payload.feedback;
      const task = state.tasks.find((item) => item.id === submission.taskId);
      if (task) task.status = action.payload.approved ? 'done' : 'resubmit';
      if (action.payload.approved) {
        state.wallet.balance += submission.rewardXP;
        state.child.xp += submission.rewardXP;
      }
      addNotification(state, {
        type: 'submission',
        icon: action.payload.approved ? '🏆' : '🔁',
        title: action.payload.approved ? 'Ba mẹ đã duyệt bài' : 'Ba mẹ yêu cầu nộp lại',
        body: action.payload.approved
          ? `Bé nhận được +${submission.rewardXP} XP.`
          : action.payload.feedback || 'Bé hãy xem góp ý và thử lại nhé.',
        targetId: submission.id,
      });
    },
    sendWish: (
      state,
      action: PayloadAction<{ text: string; hasRecording?: boolean }>,
    ) => {
      const cost = 50;
      if (state.wallet.balance < cost || !action.payload.text.trim()) return;
      state.wallet.balance -= cost;
      const id = `wish-${Date.now()}-${state.wishes.length}`;
      state.wishes.unshift({
        id,
        child: state.child.name,
        text: action.payload.text.trim(),
        cost,
        time: 'Vừa xong',
        status: 'pending',
        hasRecording: Boolean(action.payload.hasRecording),
      });
      addNotification(state, {
        type: 'wish',
        icon: '🧞',
        title: 'Bé gửi điều ước mới',
        body: action.payload.text.trim(),
        targetId: id,
      });
    },
    reviewWish: (
      state,
      action: PayloadAction<{
        wishId: string;
        status: 'approved' | 'rejected' | 'converted';
        feedback?: string;
      }>,
    ) => {
      const wish = state.wishes.find((item) => item.id === action.payload.wishId);
      if (!wish || wish.status !== 'pending') return;
      wish.status = action.payload.status;
      wish.feedback = action.payload.feedback;
      if (action.payload.status === 'rejected') state.wallet.balance += wish.cost;
      if (action.payload.status === 'converted') {
        state.rewards.unshift({
          id: `reward-wish-${wish.id}`,
          title: wish.text,
          cost: 250,
          icon: '🧞',
          detail: 'Phần thưởng từ điều ước',
          active: true,
        });
      }
      addNotification(state, {
        type: 'wish',
        icon: action.payload.status === 'approved' ? '💖' : '💬',
        title: action.payload.status === 'approved' ? 'Điều ước được đồng ý' : 'Ba mẹ đã phản hồi điều ước',
        body:
          action.payload.status === 'rejected'
            ? `${action.payload.feedback || 'Hẹn bé vào dịp phù hợp nhé.'} Đã hoàn 50 XP.`
            : wish.text,
        targetId: wish.id,
      });
    },
    setInterestRate: (state, action: PayloadAction<number>) => {
      state.wallet.interestRate = Math.min(20, Math.max(0, action.payload));
    },
    transferSavings: (
      state,
      action: PayloadAction<{ direction: 'deposit' | 'withdraw'; amount: number }>,
    ) => {
      const amount = Math.max(0, action.payload.amount);
      if (action.payload.direction === 'deposit' && state.wallet.balance >= amount) {
        state.wallet.balance -= amount;
        state.wallet.savingsBalance += amount;
      }
      if (action.payload.direction === 'withdraw' && state.wallet.savingsBalance >= amount) {
        state.wallet.savingsBalance -= amount;
        state.wallet.balance += amount;
      }
    },
    issuePenalty: (
      state,
      action: PayloadAction<{ reason: string; amount: number }>,
    ) => {
      const amount = -Math.abs(action.payload.amount);
      const id = `penalty-${Date.now()}-${state.penalties.length}`;
      state.penalties.unshift({
        id,
        reason: action.payload.reason.trim(),
        amount,
        emoji: '⚠️',
        date: 'Vừa xong',
        status: 'issued',
      });
      state.wallet.balance = Math.max(0, state.wallet.balance + amount);
      addNotification(state, {
        type: 'penalty',
        icon: '⚠️',
        title: 'Ba mẹ gửi lời nhắc',
        body: `${action.payload.reason.trim()} (${amount} XP)`,
        targetId: id,
      });
    },
    acknowledgePenalty: (state, action: PayloadAction<string>) => {
      const penalty = state.penalties.find((item) => item.id === action.payload);
      if (penalty) penalty.status = 'resolved';
    },
    addReward: (
      state,
      action: PayloadAction<{ title: string; cost: number; detail: string; icon?: string }>,
    ) => {
      state.rewards.unshift({
        id: `reward-${Date.now()}-${state.rewards.length}`,
        title: action.payload.title.trim(),
        cost: action.payload.cost,
        icon: action.payload.icon ?? '🎁',
        detail: action.payload.detail,
        active: true,
      });
    },
    toggleReward: (state, action: PayloadAction<string>) => {
      const reward = state.rewards.find((item) => item.id === action.payload);
      if (reward) reward.active = !reward.active;
    },
    requestReward: (state, action: PayloadAction<string>) => {
      const reward = state.rewards.find((item) => item.id === action.payload && item.active);
      const alreadyPending = state.redemptionRequests.some(
        (item) => item.rewardId === action.payload && item.status === 'pending',
      );
      if (!reward || alreadyPending || state.wallet.balance < reward.cost) return;
      const id = `redemption-${Date.now()}-${state.redemptionRequests.length}`;
      state.redemptionRequests.unshift({
        id,
        rewardId: reward.id,
        rewardTitle: reward.title,
        childName: state.child.name,
        icon: reward.icon,
        cost: reward.cost,
        requestedAt: 'Vừa xong',
        status: 'pending',
      });
      addNotification(state, {
        type: 'reward',
        icon: '🎁',
        title: 'Yêu cầu đổi thưởng',
        body: `${state.child.name} muốn đổi “${reward.title}”.`,
        targetId: id,
      });
    },
    reviewRedemption: (
      state,
      action: PayloadAction<{ requestId: string; approved: boolean }>,
    ) => {
      const request = state.redemptionRequests.find((item) => item.id === action.payload.requestId);
      if (!request || request.status !== 'pending') return;
      const canApprove = action.payload.approved && state.wallet.balance >= request.cost;
      request.status = canApprove ? 'approved' : 'rejected';
      if (canApprove) state.wallet.balance -= request.cost;
      addNotification(state, {
        type: 'reward',
        icon: canApprove ? '🎁' : '💬',
        title: canApprove ? 'Đổi quà thành công' : 'Yêu cầu đổi quà chưa được duyệt',
        body: request.rewardTitle,
        targetId: request.id,
      });
    },
    inviteFamilyMember: (
      state,
      action: PayloadAction<{ name: string; phone: string; role: 'parent' | 'grandparent' }>,
    ) => {
      state.familyMembers.push({
        id: `member-${Date.now()}-${state.familyMembers.length}`,
        name: action.payload.name.trim() || action.payload.phone,
        phone: action.payload.phone,
        role: action.payload.role,
        roleLabel: action.payload.role === 'parent' ? 'Phụ huynh' : 'Ông/Bà',
        avatar: action.payload.role === 'parent' ? '👨' : '👵',
        status: 'pending',
      });
    },
    addStoryToChildLibrary: (state, action: PayloadAction<string>) => {
      if (!state.childStoryIds.includes(action.payload)) state.childStoryIds.push(action.payload);
    },
    claimQuizReward: (
      state,
      action: PayloadAction<{ quizId: string; amount: number }>,
    ) => {
      if (action.payload.amount <= 0 || state.rewardedQuizIds.includes(action.payload.quizId)) return;
      state.rewardedQuizIds.push(action.payload.quizId);
      state.wallet.balance += action.payload.amount;
      state.child.xp += action.payload.amount;
      addNotification(state, {
        type: 'system',
        icon: '🎓',
        title: 'Hoàn thành bài Quiz',
        body: `Bé nhận được +${action.payload.amount} XP.`,
      });
    },
    feedPet: (state) => {
      if (state.pet.fed || state.wallet.balance < 10) return;
      state.wallet.balance -= 10;
      state.pet.fed = true;
      state.pet.mood = 'Vui vẻ';
    },
    equipPetItem: (
      state,
      action: PayloadAction<{ name: string; cost: number; owned: boolean }>,
    ) => {
      if (!action.payload.owned) {
        if (state.wallet.balance < action.payload.cost) return;
        state.wallet.balance -= action.payload.cost;
        if (!state.pet.ownedItems.includes(action.payload.name)) {
          state.pet.ownedItems.push(action.payload.name);
        }
      }
      state.pet.equippedItem = action.payload.name;
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((item) => item.id === action.payload);
      if (notification) notification.read = true;
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.read = true;
      });
    },
  },
});

export const {
  acknowledgePenalty,
  addReward,
  addStoryToChildLibrary,
  addTask,
  claimQuizReward,
  equipPetItem,
  feedPet,
  inviteFamilyMember,
  issuePenalty,
  markAllNotificationsRead,
  markNotificationRead,
  requestReward,
  reviewRedemption,
  reviewSubmission,
  reviewWish,
  sendWish,
  setInterestRate,
  submitTask,
  toggleReward,
  toggleSubtask,
  transferSavings,
} = kidlifeSlice.actions;

export const kidlifeReducer = kidlifeSlice.reducer;
