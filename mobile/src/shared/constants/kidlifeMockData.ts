export const MOCK_KIDLIFE_DATA = {
  // Child Profile (Shared across Parent & Child views)
  child: {
    id: 'c1',
    name: 'Minh Anh',
    age: 6,
    avatar: '🧒🏻',
    level: 5,
    xp: 1250,
    xpToNextLevel: 1750,
    streak: 11,
    targetStreak: 14,
    completedTasksCount: 34,
    totalTasksCount: 40,
  },

  // Parent Profile
  parent: {
    id: 'p1',
    name: 'Nguyễn Thị Nga',
    email: 'nguyennga@email.com',
    role: 'Admin (Master)',
    avatar: '👩🏻',
  },

  // Family Members (Co-parenting & RBAC)
  familyMembers: [
    { id: '1', name: 'Nguyễn Thị Nga', role: 'admin', roleLabel: 'Phụ huynh (Admin)', avatar: '👩🏻', phone: '0901234567', status: 'active' },
    { id: '2', name: 'Nguyễn Minh Tuấn', role: 'parent', roleLabel: 'Phụ huynh', avatar: '👨🏻', phone: '0912345678', status: 'active' },
    { id: '3', name: 'Nguyễn Văn Hùng', role: 'grandparent', roleLabel: 'Ông Nội', avatar: '👴', phone: '0987654321', status: 'active' },
    { id: '4', name: 'Trần Thị Mai', role: 'grandparent', roleLabel: 'Bà Nội', avatar: '👵', phone: '0976543210', status: 'pending' },
  ],

  // Virtual Bank & Wallet (Shared)
  wallet: {
    balance: 1250,
    savingsBalance: 800,
    interestRate: 5, // % per week
    dailyInterest: 15,
    lastInterestDate: 'Hôm nay, 08:00',
  },

  // Penalties (Shared)
  penalties: [
    { id: 'p1', reason: 'Chơi game quá giờ', amount: -30, emoji: '🎮', date: 'Hôm qua, 21:00', status: 'issued' },
    { id: 'p2', reason: 'Chưa đánh răng buổi tối', amount: -50, emoji: '🦷', date: 'Thứ 6, 21:30', status: 'resolved' },
  ],

  // Today's Missions / Checklist Tasks (Shared)
  todayTasks: [
    {
      id: 't1',
      icon: '🛋️',
      title: 'Dọn dẹp phòng khách',
      time: '18:30 - 19:00',
      xp: '+80 XP',
      rewardXP: 80,
      category: 'Kỹ năng',
      status: 'in_progress',
      subtasks: [
        { id: 's1', title: 'Cất đồ chơi vào hộp', done: true },
        { id: 's2', title: 'Lau bàn sạch sẽ', done: true },
        { id: 's3', title: 'Quét sàn nhà', done: false },
      ],
    },
    {
      id: 't2',
      icon: '🍳',
      title: 'Chuẩn bị bữa sáng phụ ba mẹ',
      time: '07:00 - 07:30',
      xp: '+60 XP',
      rewardXP: 60,
      category: 'Kỹ năng',
      status: 'done',
      subtasks: [
        { id: 's4', title: 'Rửa tay sạch bằng xà phòng', done: true },
        { id: 's5', title: 'Lấy chén đĩa ra bàn', done: true },
        { id: 's6', title: 'Rửa rau củ quả', done: true },
      ],
    },
    {
      id: 't3',
      icon: '🪥',
      title: 'Đánh răng trước khi ngủ',
      time: '20:30 - 20:45',
      xp: '+30 XP',
      rewardXP: 30,
      category: 'Vệ sinh',
      status: 'todo',
      subtasks: [
        { id: 's7', title: 'Lấy kem đánh răng vừa đủ', done: false },
        { id: 's8', title: 'Chải răng đủ 2 phút', done: false },
        { id: 's9', title: 'Súc miệng sạch sẽ', done: false },
      ],
    },
    {
      id: 't4',
      icon: '📚',
      title: 'Xếp sách vở vào cặp',
      time: '21:00 - 21:15',
      xp: '+40 XP',
      rewardXP: 40,
      category: 'Học tập',
      status: 'todo',
      subtasks: [
        { id: 's10', title: 'Soi thời khóa biểu ngày mai', done: false },
        { id: 's11', title: 'Cất sách vở đúng môn', done: false },
      ],
    },
  ],

  // Rewards List (Shared)
  rewards: [
    { id: 'r1', title: '15 phút chơi game', cost: 100, icon: '🎮', detail: 'Phần thưởng trải nghiệm', active: true },
    { id: 'r2', title: 'Chọn món ăn tối', cost: 180, icon: '🍕', detail: 'Phần thưởng gia đình', active: true },
    { id: 'r3', title: 'Một quyển truyện mới', cost: 350, icon: '📚', detail: 'Phần thưởng vật lý', active: false },
  ],

  // Pet Stats (Shared)
  pet: {
    name: 'Rồng Con Béo',
    level: 2,
    emoji: '🐉',
    stageName: 'Rồng con',
    xp: 1200,
    xpToNext: 1500,
    mood: 'Vui vẻ',
    fed: true,
    streak: 11,
  },

  // AI Skill Radar (Shared)
  skills: [
    { key: 'tuLap', name: 'Tự lập', icon: '🏠', value: 85, prev: 78, color: '#2B44E8', desc: 'Làm việc cá nhân, dọn dẹp' },
    { key: 'sucKhoe', name: 'Sức khỏe', icon: '💪', value: 45, prev: 62, color: '#FF4785', desc: 'Tập thể dục, ngủ sớm' },
    { key: 'triTue', name: 'Trí tuệ', icon: '🧠', value: 72, prev: 65, color: '#8E54E9', desc: 'Làm bài tập, đọc sách' },
    { key: 'tinhCam', name: 'Tình cảm', icon: '💖', value: 90, prev: 82, color: '#FF6B9D', desc: 'Giúp đỡ gia đình' },
  ],

  // Community Leaderboard (Shared)
  leaderboard: [
    { rank: 1, family: 'Gia đình Minh Anh', avatar: '👨‍👩‍👧', points: 2450, streak: 11, medal: '🥇' },
    { rank: 2, family: 'Gia đình Bảo Ngọc', avatar: '👨‍👩‍👦', points: 2380, streak: 13, medal: '🥈' },
    { rank: 3, family: 'Gia đình Đức Huy', avatar: '👩‍👧‍👦', points: 2200, streak: 12, medal: '🥉' },
    { rank: 4, family: 'Gia đình Thu Hà', avatar: '👨‍👧', points: 1980, streak: 10, medal: '' },
    { rank: 5, family: 'Gia đình Quốc Bảo', avatar: '👩‍👦', points: 1850, streak: 9, medal: '' },
  ],
};
