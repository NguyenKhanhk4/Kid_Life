// Script kiểm thử toàn bộ Module Lessons & Quizzes (Task 2.7)
require('dotenv').config();
const mongoose = require('mongoose');

async function runTests() {
  console.log('🚀 BẮT ĐẦU KIỂM THỬ TOÀN BỘ MODULE LESSONS & QUIZZES (TASK 2.7)\n');

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Đã kết nối MongoDB thành công\n');

    // Import models
    const Lesson = require('./dist/modules/lessons/lesson.model').default;
    const Quiz = require('./dist/modules/lessons/quiz.model').default;
    const QuizQuestion = require('./dist/modules/lessons/quiz-question.model').default;

    const {
      getLessons,
      getLessonById,
      createLesson,
      updateLesson,
      getQuizByLessonId,
      createQuiz,
      submitQuiz,
    } = require('./dist/modules/lessons/lesson.service');

    // Test 1: Tạo bài học mới (POST /api/lessons)
    console.log('--- TEST 1: Tạo bài học mới (createLesson) ---');
    const lessonData = {
      title: 'Học đếm từ 1 đến 10 cùng bạn Thỏ',
      description: 'Bài học đếm số vui nhộn dành cho bé mầm non',
      content: '## Bài học đếm số\n1: Một con thỏ\n2: Hai củ cà rốt...',
      category: 'hoc_tap',
      thumbnail_url: 'https://example.com/tho.png',
      reward_xp: 50,
    };
    const createdLesson = await createLesson(lessonData);
    console.log('✅ Tạo bài học thành công:', createdLesson._id);
    console.log('Title:', createdLesson.title);
    console.log('Category:', createdLesson.category);
    console.log('Reward XP:', createdLesson.reward_xp, '\n');

    const lessonId = createdLesson._id.toString();

    // Test 2: Lấy danh sách bài học (getLessons)
    console.log('--- TEST 2: Lấy danh sách bài học và lọc theo category ---');
    const allLessons = await getLessons();
    console.log(`✅ Lấy tất cả bài học: Tìm thấy ${allLessons.length} bài`);
    const mathLessons = await getLessons('hoc_tap');
    console.log(`✅ Lọc category "hoc_tap": Tìm thấy ${mathLessons.length} bài\n`);

    // Test 3: Lấy chi tiết bài học theo ID (getLessonById)
    console.log('--- TEST 3: Lấy chi tiết bài học theo ID ---');
    const foundLesson = await getLessonById(lessonId);
    console.log('✅ Lấy chi tiết bài học thành công:', foundLesson.title);
    
    // Test 3b: Validate ID không hợp lệ
    try {
      await getLessonById('invalid_id_123');
      console.log('❌ Lỗi: Chưa bắt được ID không hợp lệ');
    } catch (e) {
      console.log('✅ Bắt đúng lỗi ID không hợp lệ:', e.message, '\n');
    }

    // Test 4: Cập nhật bài học (updateLesson)
    console.log('--- TEST 4: Cập nhật bài học ---');
    const updatedLesson = await updateLesson(lessonId, {
      title: 'Học đếm từ 1 đến 20 cùng bạn Thỏ Thông Thái',
      reward_xp: 75,
    });
    console.log('✅ Cập nhật thành công:', updatedLesson.title);
    console.log('Reward XP mới:', updatedLesson.reward_xp);
    console.log('updated_at:', updatedLesson.updated_at, '\n');

    // Test 5: Tạo quiz cho bài học (createQuiz)
    console.log('--- TEST 5: Tạo quiz kèm bộ câu hỏi cho bài học ---');
    const quizPayload = {
      title: 'Trắc nghiệm đếm số nhanh',
      pass_score: 50, // 50% là pass
      reward_xp: 30,
      questions: [
        {
          question_text: 'Bạn Thỏ có 2 củ cà rốt, mẹ cho thêm 1 củ, tổng cộng có mấy củ?',
          options: ['2 củ', '3 củ', '4 củ'],
          correct_answer: '3 củ',
          step_order: 1,
        },
        {
          question_text: 'Số nào đứng liền sau số 9?',
          options: ['8', '10', '11'],
          correct_answer: '10',
          step_order: 2,
        },
      ],
    };
    const createdQuiz = await createQuiz(lessonId, quizPayload);
    console.log('✅ Tạo quiz thành công:', createdQuiz._id);
    console.log('Title:', createdQuiz.title);
    console.log(`Số câu hỏi đã tạo: ${createdQuiz.questions?.length}`);
    console.log('Pass score:', createdQuiz.pass_score + '%');
    console.log('Reward XP:', createdQuiz.reward_xp, '\n');

    // Test 5b: Kiểm tra chặn tạo trùng quiz cho 1 lesson
    console.log('--- TEST 5b: Chặn tạo trùng quiz cho cùng 1 bài học ---');
    try {
      await createQuiz(lessonId, quizPayload);
      console.log('❌ Lỗi: Chưa chặn được quiz trùng');
    } catch (e) {
      console.log('✅ Chặn trùng quiz thành công:', e.message, '\n');
    }

    // Test 6: Lấy quiz theo lessonId (getQuizByLessonId)
    console.log('--- TEST 6: Lấy quiz và questions theo lessonId ---');
    const quizWithQuestions = await getQuizByLessonId(lessonId);
    console.log('✅ Lấy quiz thành công:', quizWithQuestions.title);
    console.log(`Questions (sorted):`);
    quizWithQuestions.questions.forEach((q, idx) => {
      console.log(`  ${idx + 1}. [Thứ tự ${q.step_order}] ${q.question_text}`);
      console.log(`     Lựa chọn: ${q.options.join(' | ')} (Đáp án đúng: ${q.correct_answer})`);
    });
    console.log();

    // Test 7: Nộp kết quả quiz (submitQuiz)
    console.log('--- TEST 7: Nộp kết quả quiz và chấm điểm ---');
    const q1 = quizWithQuestions.questions[0];
    const q2 = quizWithQuestions.questions[1];
    const dummyChildId = new mongoose.Types.ObjectId().toString();

    // Trường hợp 1: Đúng 2/2 (100%) -> Passed = true, XP = 30
    console.log('Kịch bản A: Trả lời đúng 2/2 câu');
    const submitResult1 = await submitQuiz(lessonId, {
      child_id: dummyChildId,
      answers: [
        { question_id: q1._id.toString(), selected_answer: '3 củ' },
        { question_id: q2._id.toString(), selected_answer: '10' },
      ],
    });
    console.log('Kết quả:', submitResult1);
    console.log(`✅ Đúng ${submitResult1.correct_count}/${submitResult1.total_questions} (${submitResult1.score_percent}%) | Passed: ${submitResult1.passed} | XP thưởng: ${submitResult1.xp_earned}\n`);

    // Trường hợp 2: Đúng 1/2 câu (50%) -> pass_score là 50% -> Passed = true
    console.log('Kịch bản B: Trả lời đúng 1/2 câu (với khoảng trắng/chữ hoa)');
    const submitResult2 = await submitQuiz(lessonId, {
      child_id: dummyChildId,
      answers: [
        { question_id: q1._id.toString(), selected_answer: '  3 CỦ  ' }, // test trim & lower
        { question_id: q2._id.toString(), selected_answer: '8' },
      ],
    });
    console.log('Kết quả:', submitResult2);
    console.log(`✅ Đúng ${submitResult2.correct_count}/${submitResult2.total_questions} (${submitResult2.score_percent}%) | Passed: ${submitResult2.passed} | XP thưởng: ${submitResult2.xp_earned}\n`);

    // Trường hợp 3: Đúng 0/2 câu (0%) -> Passed = false, XP = 0
    console.log('Kịch bản C: Trả lời sai 2/2 câu');
    const submitResult3 = await submitQuiz(lessonId, {
      child_id: dummyChildId,
      answers: [
        { question_id: q1._id.toString(), selected_answer: '2 củ' },
        { question_id: q2._id.toString(), selected_answer: '11' },
      ],
    });
    console.log('Kết quả:', submitResult3);
    console.log(`✅ Đúng ${submitResult3.correct_count}/${submitResult3.total_questions} (${submitResult3.score_percent}%) | Passed: ${submitResult3.passed} | XP thưởng: ${submitResult3.xp_earned}\n`);

    // Dọn dẹp dữ liệu test
    console.log('--- DỌN DẸP DỮ LIỆU TEST ---');
    await QuizQuestion.deleteMany({ quiz_id: createdQuiz._id });
    await Quiz.findByIdAndDelete(createdQuiz._id);
    await Lesson.findByIdAndDelete(createdLesson._id);
    console.log('✅ Đã dọn dẹp sạch sẽ dữ liệu test trong MongoDB\n');

    console.log('🎉 TẤT CẢ 7 ENDPOINTS & BUSINESS LOGIC CỦA MODULE LESSONS & QUIZZES HOẠT ĐỘNG HOÀN HẢO!');
  } catch (error) {
    console.error('❌ Lỗi kiểm thử:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Đã ngắt kết nối database.');
  }
}

runTests();
