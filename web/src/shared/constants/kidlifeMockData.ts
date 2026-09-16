export const MOCK_KIDLIFE_DATA = {
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

  parent: {
    id: 'p1',
    name: 'Nguyễn Thị Nga',
    email: 'nguyennga@email.com',
    role: 'Admin (Master)',
    avatar: '👩🏻',
  },

  familyMembers: [
    { id: '1', name: 'Nguyễn Thị Nga', role: 'admin', roleLabel: 'Phụ huynh (Admin)', avatar: '👩🏻', phone: '0901234567', status: 'active' },
    { id: '2', name: 'Nguyễn Minh Tuấn', role: 'parent', roleLabel: 'Phụ huynh', avatar: '👨🏻', phone: '0912345678', status: 'active' },
    { id: '3', name: 'Nguyễn Văn Hùng', role: 'grandparent', roleLabel: 'Ông Nội', avatar: '👴', phone: '0987654321', status: 'active' },
    { id: '4', name: 'Trần Thị Mai', role: 'grandparent', roleLabel: 'Bà Nội', avatar: '👵', phone: '0976543210', status: 'pending' },
  ],

  wallet: {
    balance: 1250,
    savingsBalance: 800,
    interestRate: 5,
    dailyInterest: 15,
    lastInterestDate: 'Hôm nay, 08:00',
  },

  penalties: [
    { id: 'p1', reason: 'Chơi game quá giờ', amount: -30, emoji: '🎮', date: 'Hôm qua, 21:00', status: 'issued' },
    { id: 'p2', reason: 'Chưa đánh răng buổi tối', amount: -50, emoji: '🦷', date: 'Thứ 6, 21:30', status: 'resolved' },
  ],

  todayTasks: [
    {
      id: 't1', icon: '🛋️', title: 'Dọn dẹp phòng khách', time: '18:30 - 19:00',
      xp: '+80 XP', rewardXP: 80, category: 'Kỹ năng', status: 'in_progress',
      subtasks: [
        { id: 's1', title: 'Cất đồ chơi vào hộp', done: true },
        { id: 's2', title: 'Lau bàn sạch sẽ', done: true },
        { id: 's3', title: 'Quét sàn nhà', done: false },
      ],
    },
    {
      id: 't2', icon: '🍳', title: 'Chuẩn bị bữa sáng phụ ba mẹ', time: '07:00 - 07:30',
      xp: '+60 XP', rewardXP: 60, category: 'Kỹ năng', status: 'done',
      subtasks: [
        { id: 's4', title: 'Rửa tay sạch bằng xà phòng', done: true },
        { id: 's5', title: 'Lấy chén đĩa ra bàn', done: true },
        { id: 's6', title: 'Rửa rau củ quả', done: true },
      ],
    },
    {
      id: 't3', icon: '🪥', title: 'Đánh răng trước khi ngủ', time: '20:30 - 20:45',
      xp: '+30 XP', rewardXP: 30, category: 'Vệ sinh', status: 'todo',
      subtasks: [
        { id: 's7', title: 'Lấy kem đánh răng vừa đủ', done: false },
        { id: 's8', title: 'Chải răng đủ 2 phút', done: false },
        { id: 's9', title: 'Súc miệng sạch sẽ', done: false },
      ],
    },
    {
      id: 't4', icon: '📚', title: 'Xếp sách vở vào cặp', time: '21:00 - 21:15',
      xp: '+40 XP', rewardXP: 40, category: 'Học tập', status: 'todo',
      subtasks: [
        { id: 's10', title: 'Soi thời khóa biểu ngày mai', done: false },
        { id: 's11', title: 'Cất sách vở đúng môn', done: false },
      ],
    },
  ],

  rewards: [
    { id: 'r1', title: '15 phút chơi game', cost: 100, icon: '🎮', detail: 'Phần thưởng trải nghiệm', active: true },
    { id: 'r2', title: 'Chọn món ăn tối', cost: 180, icon: '🍕', detail: 'Phần thưởng gia đình', active: true },
    { id: 'r3', title: 'Một quyển truyện mới', cost: 350, icon: '📚', detail: 'Phần thưởng vật lý', active: false },
  ],

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

  skills: [
    { key: 'tuLap', name: 'Tự lập', icon: '🏠', value: 85, prev: 78, color: '#2B44E8', desc: 'Làm việc cá nhân, dọn dẹp' },
    { key: 'sucKhoe', name: 'Sức khỏe', icon: '💪', value: 45, prev: 62, color: '#FF4785', desc: 'Tập thể dục, ngủ sớm' },
    { key: 'triTue', name: 'Trí tuệ', icon: '🧠', value: 72, prev: 65, color: '#8E54E9', desc: 'Làm bài tập, đọc sách' },
    { key: 'tinhCam', name: 'Tình cảm', icon: '💖', value: 90, prev: 82, color: '#FF6B9D', desc: 'Giúp đỡ gia đình' },
  ],

  leaderboard: [
    { rank: 1, family: 'Gia đình Minh Anh', avatar: '👨‍👩‍👧', points: 2450, streak: 11, medal: '🥇' },
    { rank: 2, family: 'Gia đình Bảo Ngọc', avatar: '👨‍👩‍👦', points: 2380, streak: 13, medal: '🥈' },
    { rank: 3, family: 'Gia đình Đức Huy', avatar: '👩‍👧‍👦', points: 2200, streak: 12, medal: '🥉' },
    { rank: 4, family: 'Gia đình Thu Hà', avatar: '👨‍👧', points: 1980, streak: 10, medal: '' },
    { rank: 5, family: 'Gia đình Quốc Bảo', avatar: '👩‍👦', points: 1850, streak: 9, medal: '' },
  ],

  lessons: [
    { id: '1', title: 'Cách đánh răng đúng cách', skill: 'Vệ sinh', ageRange: '4-6', duration: '5 phút', thumbnail: '🪥', author: 'Cô Hoa', views: 1250 },
    { id: '2', title: 'Tự gấp quần áo gọn gàng', skill: 'Tự lập', ageRange: '6-8', duration: '7 phút', thumbnail: '👕', author: 'Thầy Nam', views: 980 },
    { id: '3', title: 'Biết nói lời cảm ơn', skill: 'Giao tiếp', ageRange: '4-6', duration: '4 phút', thumbnail: '🙏', author: 'Cô Mai', views: 2100 },
    { id: '4', title: 'Tô màu sáng tạo', skill: 'Sáng tạo', ageRange: '4-8', duration: '10 phút', thumbnail: '🎨', author: 'Cô Lan', views: 750 },
    { id: '5', title: 'Rửa tay trước khi ăn', skill: 'Vệ sinh', ageRange: '4-6', duration: '3 phút', thumbnail: '🧼', author: 'Bác sĩ Tùng', views: 3200 },
    { id: '6', title: 'Chia sẻ đồ chơi với bạn', skill: 'Cảm xúc', ageRange: '5-8', duration: '6 phút', thumbnail: '🤝', author: 'Cô Hạnh', views: 1500 },
  ],

  quizzes: {
    '1': {
      title: 'Đánh răng đúng cách', passScore: 3, rewardPoints: 50,
      questions: [
        { id: '1', content: 'Nên đánh răng mấy lần mỗi ngày?', options: ['1 lần', '2 lần', '3 lần', '4 lần'], correctIndex: 1 },
        { id: '2', content: 'Mỗi lần đánh răng bao lâu?', options: ['30 giây', '1 phút', '2 phút', '5 phút'], correctIndex: 2 },
        { id: '3', content: 'Nên đánh răng khi nào?', options: ['Sau khi ăn', 'Trước khi ăn', 'Sáng và tối', 'Chỉ buổi sáng'], correctIndex: 2 },
        { id: '4', content: 'Dùng bao nhiêu kem đánh răng?', options: ['Thật nhiều', 'Bằng hạt đậu', 'Nửa bàn chải', 'Không cần kem'], correctIndex: 1 },
        { id: '5', content: 'Nên thay bàn chải bao lâu 1 lần?', options: ['1 tháng', '3 tháng', '6 tháng', '1 năm'], correctIndex: 1 },
      ],
    },
  },

  children: [
    { id: 1, name: 'Vũ Lương', avatar: '🐥' },
    { id: 2, name: 'Thảo My', avatar: '🐥' },
    { id: 3, name: 'Nhật Linh', avatar: '🐥' },
  ],

  badges: [
    { id: 1, name: 'Siêu sao', icon: '⭐', color: '#FFD233', bgColor: '#4A62FF', locked: false, desc: 'Giữ chuỗi làm việc nhà 10 ngày liên tiếp' },
    { id: 2, name: 'Bé ngoan', icon: '👼', color: '#FFD233', bgColor: '#4A62FF', locked: false, desc: 'Hoàn thành 30 nhiệm vụ tự lập' },
    { id: 3, name: 'Chăm chỉ', icon: '🧹', color: '#FFD233', bgColor: '#4A62FF', locked: false, desc: 'Dọn dẹp phòng khách sạch sẽ 5 lần' },
    { id: 4, name: 'Sáng tạo', icon: '🎨', color: '#A0A7C0', bgColor: '#E8EDFC', locked: true, desc: 'Đạt 100 điểm trắc nghiệm bài học' },
    { id: 5, name: 'Dũng cảm', icon: '🛡️', color: '#A0A7C0', bgColor: '#E8EDFC', locked: true, desc: 'Giúp đỡ gia đình trong 14 ngày' },
  ],

  voiceCharacters: [
    { id: 'v1', name: 'Giọng Mẹ', icon: '👩', color: '#FF4785', isCloned: true, bgGradient: 'linear-gradient(135deg, #FF4785 0%, #FF85A1 100%)' },
    { id: 'v2', name: 'Giọng Bố', icon: '👨', color: '#2B44E8', isCloned: false, bgGradient: 'linear-gradient(135deg, #2B44E8 0%, #6E7DFB 100%)' },
    { id: 'v3', name: 'Phù Thủy Xám', icon: '🧙‍♂️', color: '#8E54E9', isCloned: false, bgGradient: 'linear-gradient(135deg, #8E54E9 0%, #B282F5 100%)' },
    { id: 'v4', name: 'Robot BiBi', icon: '🤖', color: '#00C48C', isCloned: false, bgGradient: 'linear-gradient(135deg, #00C48C 0%, #40E0D0 100%)' },
    { id: 'v5', name: 'Công Chúa', icon: '👸', color: '#FF6B9D', isCloned: false, bgGradient: 'linear-gradient(135deg, #FF6B9D 0%, #FFA8C5 100%)' },
    { id: 'v6', name: 'Rồng Con', icon: '🐲', color: '#FFA900', isCloned: false, bgGradient: 'linear-gradient(135deg, #FFA900 0%, #FFD233 100%)' },
    { id: 'v7', name: 'Cú Mèo', icon: '🦉', color: '#5B6B92', isCloned: false, bgGradient: 'linear-gradient(135deg, #5B6B92 0%, #8395BD 100%)' },
    { id: 'v8', name: 'Gấu Bơ', icon: '🧸', color: '#E85D04', isCloned: false, bgGradient: 'linear-gradient(135deg, #E85D04 0%, #F48C06 100%)' },
  ],

  stories: [
    {
      id: 's1',
      title: 'Sự Tích Cây Vú Sữa',
      category: 'Cổ tích',
      moral: 'Bài học về lòng hiếu thảo và sự kính yêu cha mẹ',
      duration: '8 phút',
      cover: '🌳',
      audioUrl: '',
      addedToChildLibrary: true,
      text: 'Ngày xửa ngày xưa, có một cậu bé vô cùng ham chơi. Một lần bị mẹ mắng, cậu bực tức bỏ nhà đi. Cậu la tha khắp nơi, không nghĩ đến người mẹ ở nhà đang mỏi mòn chờ đợi...'
    },
    {
      id: 's2',
      title: 'Thạch Sanh Lý Thông',
      category: 'Cổ tích',
      moral: 'Bài học về lòng dũng cảm, thật thà và sự công bằng',
      duration: '10 phút',
      cover: '🪓',
      audioUrl: '',
      addedToChildLibrary: true,
      text: 'Ngày xưa ở quận Cao Bình có hai vợ chồng già sinh được một người con trai đặt tên là Thạch Sanh. Thạch Sanh lớn lên hiền lành, chăm chỉ, lại có sức khỏe phi thường...'
    },
    {
      id: 's3',
      title: 'Chú Thỏ Thông Minh',
      category: 'Giáo dục',
      moral: 'Bài học về trí thông minh và sự bình tĩnh khi gặp nguy hiểm',
      duration: '6 phút',
      cover: '🐰',
      audioUrl: '',
      addedToChildLibrary: true,
      text: 'Trong một khu rừng xanh tươi, chú Thỏ Trắng nổi tiếng thông minh và nhanh nhẹn. Một ngày nọ, Thỏ Trắng gặp Báo Đốm hung dữ trong rừng sâu...'
    },
    {
      id: 's4',
      title: 'Hành Trình Khám Phá Vũ Trụ',
      category: 'Khoa học',
      moral: 'Khơi gợi niềm đam mê học hỏi và khám phá thế giới',
      duration: '7 phút',
      cover: '🚀',
      audioUrl: '',
      addedToChildLibrary: false,
      text: 'Vũ trụ bao la chứa đựng hàng tỷ ngôi sao lấp lánh và các hành tinh kỳ thú. Bạn có biết Mặt Trời là một ngôi sao khổng lồ cung cấp ánh sáng cho Trái Đất không?...'
    },
  ],

  memoryLane: {
    totalPhotos: 42,
    cloudLimit: 'Không giới hạn (Gói Premium 💖)',
    photos: [
      { id: 'm1', title: 'Minh Anh dọn phòng khách', date: '16/09/2026', imageEmoji: '🧹', category: 'Tự lập', likes: 5 },
      { id: 'm2', title: 'Tự lau bàn sau bữa tối', date: '15/09/2026', imageEmoji: '🪑', category: 'Kỹ năng', likes: 8 },
      { id: 'm3', title: 'Chuẩn bị bữa sáng giúp mẹ', date: '14/09/2026', imageEmoji: '🍳', category: 'Tình cảm', likes: 12 },
      { id: 'm4', title: 'Tự gấp quần áo gọn gàng', date: '12/09/2026', imageEmoji: '👕', category: 'Tự lập', likes: 6 },
      { id: 'm5', title: 'Rửa tay sạch xà phòng', date: '10/09/2026', imageEmoji: '🧼', category: 'Sức khỏe', likes: 4 },
    ],
    videoRecaps: [
      { id: 'v1', title: 'Hành Trình Tự Lập Tháng 9/2026', duration: '1:45', thumbnail: '🎬', createdDate: '15/09/2026' },
    ],
    photobooks: [
      { id: 'pb1', title: 'Tạp Chí Tuổi Thơ Bé Minh Anh 2026', pages: 24, status: 'Sẵn sàng in PDF' },
    ]
  },

  wishes: [
    {
      id: 'w1',
      childName: 'Minh Anh',
      wishText: 'Con ước cuối tuần này được ba đưa đi công viên nước!',
      hasAudio: true,
      audioDuration: '0:12',
      costStars: 50,
      createdAt: 'Hôm nay, 19:30',
      status: 'pending',
    },
    {
      id: 'w2',
      childName: 'Minh Anh',
      wishText: 'Con ước được ăn pizza gà nướng phô mai',
      hasAudio: false,
      audioDuration: '',
      costStars: 50,
      createdAt: 'Thứ 6 tuần trước',
      status: 'approved',
    }
  ],
};

