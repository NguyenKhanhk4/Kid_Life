// Business logic cho Module Lessons & Quizzes
import mongoose from 'mongoose';
import Lesson, { ILesson } from './lesson.model';
import Quiz, { IQuiz } from './quiz.model';
import QuizQuestion, { IQuizQuestion } from './quiz-question.model';

export interface CreateLessonPayload {
  title: string;
  description?: string;
  content: string;
  category: 'hoc_tap' | 'ky_nang' | 'the_chat' | 'sang_tao' | 'khac';
  thumbnail_url?: string;
  reward_xp: number;
}

export interface UpdateLessonPayload {
  title?: string;
  description?: string;
  content?: string;
  category?: 'hoc_tap' | 'ky_nang' | 'the_chat' | 'sang_tao' | 'khac';
  thumbnail_url?: string;
  reward_xp?: number;
}

export interface QuestionInput {
  question_text: string;
  options: string[];
  correct_answer: string;
  step_order: number;
}

export interface CreateQuizPayload {
  title: string;
  pass_score: number;
  reward_xp: number;
  questions?: QuestionInput[];
}

export interface AnswerInput {
  question_id: string;
  selected_answer: string;
}

export interface SubmitQuizPayload {
  child_id: string;
  answers: AnswerInput[];
}

export async function getLessons(category?: string) {
  const filter: Record<string, unknown> = {};
  const validCategories = ['hoc_tap', 'ky_nang', 'the_chat', 'sang_tao', 'khac'];
  if (category && validCategories.includes(category)) {
    filter.category = category;
  }

  const lessons = await Lesson.find(filter).sort({ created_at: -1 }).lean();
  return lessons;
}

export async function getLessonById(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Lesson ID không hợp lệ');
  }

  const lesson = await Lesson.findById(id).lean();
  if (!lesson) {
    throw new Error('Không tìm thấy bài học');
  }

  return lesson;
}

export async function createLesson(payload: CreateLessonPayload) {
  const lesson = await Lesson.create(payload);
  return lesson.toObject();
}

export async function updateLesson(id: string, payload: UpdateLessonPayload) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Lesson ID không hợp lệ');
  }

  const updateData = {
    ...payload,
    updated_at: new Date(),
  };

  const updatedLesson = await Lesson.findByIdAndUpdate(id, updateData, {
    new: true,
  }).lean();

  if (!updatedLesson) {
    throw new Error('Không tìm thấy bài học');
  }

  return updatedLesson;
}

export async function getQuizByLessonId(lessonId: string) {
  if (!mongoose.Types.ObjectId.isValid(lessonId)) {
    throw new Error('Lesson ID không hợp lệ');
  }

  const quiz = await Quiz.findOne({ lesson_id: lessonId }).lean();
  if (!quiz) {
    throw new Error('Bài học này chưa có quiz');
  }

  const questions = await QuizQuestion.find({ quiz_id: quiz._id })
    .sort({ step_order: 1 })
    .lean();

  return {
    ...quiz,
    questions,
  };
}

export async function createQuiz(lessonId: string, payload: CreateQuizPayload) {
  if (!mongoose.Types.ObjectId.isValid(lessonId)) {
    throw new Error('Lesson ID không hợp lệ');
  }

  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    throw new Error('Không tìm thấy bài học');
  }

  const existingQuiz = await Quiz.findOne({ lesson_id: lessonId });
  if (existingQuiz) {
    throw new Error('Bài học này đã có quiz rồi');
  }

  const quiz = await Quiz.create({
    lesson_id: lessonId,
    title: payload.title,
    pass_score: payload.pass_score,
    reward_xp: payload.reward_xp,
  });

  if (payload.questions && payload.questions.length > 0) {
    const questionDocs = payload.questions.map((q, index) => ({
      quiz_id: quiz._id,
      question_text: q.question_text,
      options: q.options,
      correct_answer: q.correct_answer,
      step_order: q.step_order || index + 1,
    }));
    await QuizQuestion.insertMany(questionDocs);
  }

  const questions = await QuizQuestion.find({ quiz_id: quiz._id })
    .sort({ step_order: 1 })
    .lean();

  return {
    ...quiz.toObject(),
    questions,
  };
}

export async function submitQuiz(lessonId: string, payload: SubmitQuizPayload) {
  if (!mongoose.Types.ObjectId.isValid(lessonId)) {
    throw new Error('Lesson ID không hợp lệ');
  }

  if (!mongoose.Types.ObjectId.isValid(payload.child_id)) {
    throw new Error('child_id không hợp lệ');
  }

  const quiz = await Quiz.findOne({ lesson_id: lessonId }).lean();
  if (!quiz) {
    throw new Error('Không tìm thấy quiz');
  }

  const questions = await QuizQuestion.find({ quiz_id: quiz._id }).lean();
  if (questions.length === 0) {
    throw new Error('Quiz này chưa có câu hỏi nào');
  }

  let correct_count = 0;
  for (const answer of payload.answers) {
    const question = questions.find(
      (q) => q._id.toString() === answer.question_id
    );
    if (
      question &&
      question.correct_answer.trim().toLowerCase() ===
        answer.selected_answer.trim().toLowerCase()
    ) {
      correct_count++;
    }
  }

  const score_percent = Math.round((correct_count / questions.length) * 100);
  const passed = score_percent >= quiz.pass_score;
  const xp_earned = passed ? quiz.reward_xp : 0;

  return {
    score_percent,
    correct_count,
    total_questions: questions.length,
    passed,
    xp_earned,
    quiz_id: quiz._id,
  };
}
