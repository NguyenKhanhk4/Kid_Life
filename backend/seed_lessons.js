// Script Seed dữ liệu mẫu cho Module Bài học (Lessons), Quizzes và QuizQuestions vào MongoDB Atlas (db: kidlife)
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    content: { type: String, required: true },
    category: { type: String, required: true, enum: ['hoc_tap', 'ky_nang', 'the_chat', 'sang_tao', 'khac'] },
    thumbnail_url: { type: String, default: '' },
    reward_xp: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const quizSchema = new mongoose.Schema(
  {
    lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true, unique: true },
    title: { type: String, required: true },
    pass_score: { type: Number, default: 80 },
    reward_xp: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const quizQuestionSchema = new mongoose.Schema(
  {
    quiz_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    question_text: { type: String, required: true },
    options: { type: [String], required: true },
    correct_answer: { type: String, required: true },
    step_order: { type: Number, required: true },
  },
  { versionKey: false }
);

const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema);
const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);
const QuizQuestion = mongoose.models.QuizQuestion || mongoose.model('QuizQuestion', quizQuestionSchema);

const sampleLessons = [
  {
    title: 'Cách đánh răng đúng cách',
    description: 'Hướng dẫn bé cách chải răng đúng cách, bảo vệ nụ cười trắng sáng và phòng ngừa sâu răng.',
    content: '1. Chuẩn bị bàn chải lông mềm và lượng kem bằng hạt đậu.\n2. Chải mặt ngoài, mặt trong và mặt nhai của răng.\n3. Chải lưỡi nhẹ nhàng và súc miệng bằng nước sạch.\n4. Thực hiện 2 lần mỗi ngày (sáng và tối), mỗi lần đủ 2 phút.',
    category: 'ky_nang',
    thumbnail_url: '🪥',
    reward_xp: 50,
    quiz: {
      title: 'Đánh răng đúng cách',
      pass_score: 60,
      reward_xp: 30,
      questions: [
        {
          question_text: 'Nên đánh răng mấy lần mỗi ngày?',
          options: ['1 lần', '2 lần', '3 lần', '4 lần'],
          correct_answer: '2 lần',
          step_order: 1,
        },
        {
          question_text: 'Mỗi lần đánh răng bao lâu là đúng tiêu chuẩn?',
          options: ['30 giây', '1 phút', '2 phút', '5 phút'],
          correct_answer: '2 phút',
          step_order: 2,
        },
        {
          question_text: 'Nên đánh răng vào thời điểm nào trong ngày?',
          options: ['Sau khi ăn', 'Trước khi ăn', 'Sáng và tối', 'Chỉ buổi sáng'],
          correct_answer: 'Sáng và tối',
          step_order: 3,
        },
        {
          question_text: 'Dùng bao nhiêu lượng kem đánh răng là vừa đủ cho bé?',
          options: ['Thật nhiều', 'Bằng hạt đậu', 'Nửa bàn chải', 'Không cần kem'],
          correct_answer: 'Bằng hạt đậu',
          step_order: 4,
        },
        {
          question_text: 'Nên thay bàn chải đánh răng bao lâu một lần?',
          options: ['1 tháng', '3 tháng', '6 tháng', '1 năm'],
          correct_answer: '3 tháng',
          step_order: 5,
        },
      ],
    },
  },
  {
    title: 'Tự gấp quần áo gọn gàng',
    description: 'Rèn luyện tính tự lập bằng cách học tự gấp áo, quần và xếp vào tủ ngăn nắp.',
    content: '1. Trải áo phẳng phiu ra giường hoặc mặt bàn sạch.\n2. Gấp hai bên mép áo và tay áo vào trong.\n3. Gấp đôi áo từ dưới vạt lên trên cổ áo.\n4. Xếp gọn gàng vào ngăn tủ đồ riêng của bé.',
    category: 'ky_nang',
    thumbnail_url: '👕',
    reward_xp: 40,
    quiz: {
      title: 'Kỹ năng gấp quần áo',
      pass_score: 50,
      reward_xp: 20,
      questions: [
        {
          question_text: 'Bước đầu tiên khi gấp áo là gì?',
          options: ['Vo tròn áo lại', 'Trải áo phẳng phiu', 'Gấp đôi ngay', 'Treo lên móc'],
          correct_answer: 'Trải áo phẳng phiu',
          step_order: 1,
        },
        {
          question_text: 'Gấp quần áo gọn gàng giúp ích gì cho bé?',
          options: ['Tìm đồ nhanh và ngăn nắp', 'Mất thời gian', 'Làm áo nhăn hơn', 'Không có ích gì'],
          correct_answer: 'Tìm đồ nhanh và ngăn nắp',
          step_order: 2,
        },
      ],
    },
  },
  {
    title: 'Biết nói lời cảm ơn',
    description: 'Học cách thể hiện lòng biết ơn khi nhận được sự giúp đỡ hoặc món quà từ người khác.',
    content: '1. Nhìn vào mắt người đối diện với nụ cười tươi thân thiện.\n2. Nói lời "Con cảm ơn ạ" thật rõ ràng và chân thành.\n3. Luôn cảm ơn khi được giúp đỡ, nhận quà hoặc khi được người lớn khen ngợi.',
    category: 'ky_nang',
    thumbnail_url: '🙏',
    reward_xp: 35,
    quiz: {
      title: 'Lễ phép: Lời cảm ơn',
      pass_score: 50,
      reward_xp: 20,
      questions: [
        {
          question_text: 'Khi nhận được quà hoặc sự giúp đỡ, bé nên làm gì?',
          options: ['Cầm lấy rồi chạy đi', 'Khoanh tay và nói lời cảm ơn', 'Không nói gì', 'Lắc đầu'],
          correct_answer: 'Khoanh tay và nói lời cảm ơn',
          step_order: 1,
        },
      ],
    },
  },
  {
    title: 'Tô màu sáng tạo',
    description: 'Khơi nguồn sáng tạo hội họa và rèn luyện sự khéo léo của đôi tay qua các sắc màu.',
    content: '1. Chọn bức tranh mà bé yêu thích.\n2. Phối hợp các màu sắc ấm và tươi sáng theo trí tưởng tượng của bé.\n3. Tô cẩn thận bên trong đường viền để bức tranh thật gọn gàng và đẹp mắt.',
    category: 'sang_tao',
    thumbnail_url: '🎨',
    reward_xp: 45,
  },
  {
    title: 'Rửa tay trước khi ăn',
    description: 'Quy trình 6 bước rửa tay bằng xà phòng để bảo vệ sức khỏe và loại bỏ vi trùng gây bệnh.',
    content: '1. Làm ướt tay dưới vòi nước và lấy lượng xà phòng vừa đủ.\n2. Xoa hai lòng bàn tay, mu bàn tay và các kẽ ngón tay trong ít nhất 20-30 giây.\n3. Rửa sạch lại bằng nước và lau khô bằng khăn sạch.',
    category: 'ky_nang',
    thumbnail_url: '🧼',
    reward_xp: 30,
    quiz: {
      title: 'Bảo vệ sức khỏe: Rửa tay',
      pass_score: 50,
      reward_xp: 15,
      questions: [
        {
          question_text: 'Nên rửa tay bằng gì để sạch vi khuẩn nhất trước khi ăn?',
          options: ['Chỉ dùng nước lã', 'Xà phòng và nước sạch', 'Lau vào quần áo', 'Thổi bụi'],
          correct_answer: 'Xà phòng và nước sạch',
          step_order: 1,
        },
      ],
    },
  },
  {
    title: 'Chia sẻ đồ chơi với bạn',
    description: 'Học cách chơi hòa đồng, biết chia sẻ niềm vui và xây dựng tình bạn gắn kết.',
    content: '1. Cùng luân phiên chơi các món đồ chơi bé yêu thích.\n2. Niềm nở rủ bạn cùng tham gia chơi chung trò chơi.\n3. Giữ gìn đồ chơi cẩn thận khi được bạn cho mượn.',
    category: 'ky_nang',
    thumbnail_url: '🤝',
    reward_xp: 40,
    quiz: {
      title: 'Tình bạn: Chia sẻ đồ chơi',
      pass_score: 50,
      reward_xp: 20,
      questions: [
        {
          question_text: 'Khi bạn muốn chơi chung đồ chơi, bé nên ứng xử thế nào?',
          options: ['Giấu đồ chơi đi', 'Vui vẻ cùng chia sẻ và chơi chung', 'Giành lại và khóc', 'Bỏ về'],
          correct_answer: 'Vui vẻ cùng chia sẻ và chơi chung',
          step_order: 1,
        },
      ],
    },
  },
];

async function seedLessons() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI chưa được định nghĩa trong file .env');
    }

    console.log('🔄 Đang kết nối tới MongoDB Atlas (dbName: kidlife)...');
    await mongoose.connect(MONGODB_URI, { dbName: 'kidlife' });
    console.log('✅ Đã kết nối MongoDB Atlas thành công!');

    // Xóa dữ liệu cũ nếu muốn làm mới
    console.log('🧹 Đang làm sạch dữ liệu cũ trong lessons, quizzes, quizquestions...');
    await Lesson.deleteMany({});
    await Quiz.deleteMany({});
    await QuizQuestion.deleteMany({});

    console.log('🌱 Đang tiến hành nạp danh sách bài học & câu hỏi quiz mẫu...');

    for (const item of sampleLessons) {
      const { quiz, ...lessonData } = item;
      const lessonDoc = await Lesson.create(lessonData);
      console.log(`  + Đã tạo bài học: "${lessonDoc.title}" (ID: ${lessonDoc._id})`);

      if (quiz) {
        const quizDoc = await Quiz.create({
          lesson_id: lessonDoc._id,
          title: quiz.title,
          pass_score: quiz.pass_score,
          reward_xp: quiz.reward_xp,
        });

        if (quiz.questions && quiz.questions.length > 0) {
          const questionsToInsert = quiz.questions.map((q) => ({
            ...q,
            quiz_id: quizDoc._id,
          }));
          await QuizQuestion.insertMany(questionsToInsert);
          console.log(`    -> Đã tạo quiz "${quizDoc.title}" với ${quiz.questions.length} câu hỏi`);
        }
      }
    }

    const lessonCount = await Lesson.countDocuments();
    const quizCount = await Quiz.countDocuments();
    const questionCount = await QuizQuestion.countDocuments();

    console.log('\n=========================================');
    console.log('🎉 NẠP DỮ LIỆU THÀNH CÔNG VÀO MONGODB ATLAS!');
    console.log(`📚 Tổng số bài học (lessons): ${lessonCount}`);
    console.log(`📝 Tổng số bộ quiz (quizzes): ${quizCount}`);
    console.log(`❓ Tổng số câu hỏi (quizquestions): ${questionCount}`);
    console.log('=========================================\n');
    console.log('👉 Bây giờ bạn có thể mở lại MongoDB Compass và bấm nút REFRESH 🔄 để xem dữ liệu!');
  } catch (error) {
    console.error('❌ Lỗi khi seed dữ liệu:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Đã ngắt kết nối MongoDB.');
    process.exit(0);
  }
}

seedLessons();
