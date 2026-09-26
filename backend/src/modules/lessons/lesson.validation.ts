// Validation schemas dùng Zod cho Lesson & Quiz module
import { z } from 'zod';

export const createLessonSchema = z.object({
  title: z
    .string({ required_error: 'Tiêu đề không được để trống' })
    .min(1, 'Tiêu đề không được để trống')
    .max(150, 'Tiêu đề tối đa 150 ký tự'),
  description: z.string().optional().default(''),
  content: z
    .string({ required_error: 'Nội dung bài học không được để trống' })
    .min(1, 'Nội dung bài học không được để trống'),
  category: z.enum(['hoc_tap', 'ky_nang', 'the_chat', 'sang_tao', 'khac'], {
    errorMap: () => ({
      message: 'Danh mục phải là: hoc_tap, ky_nang, the_chat, sang_tao, hoặc khac',
    }),
  }),
  thumbnail_url: z.string().optional().default(''),
  reward_xp: z
    .number({ required_error: 'reward_xp là bắt buộc' })
    .min(1, 'XP tối thiểu là 1')
    .max(200, 'XP tối đa là 200'),
});

export const updateLessonSchema = z.object({
  title: z
    .string()
    .min(1, 'Tiêu đề không được để trống')
    .max(150, 'Tiêu đề tối đa 150 ký tự')
    .optional(),
  description: z.string().optional(),
  content: z.string().min(1, 'Nội dung không được để trống').optional(),
  category: z
    .enum(['hoc_tap', 'ky_nang', 'the_chat', 'sang_tao', 'khac'], {
      errorMap: () => ({ message: 'Danh mục không hợp lệ' }),
    })
    .optional(),
  thumbnail_url: z.string().optional(),
  reward_xp: z.number().min(1, 'XP tối thiểu là 1').max(200, 'XP tối đa là 200').optional(),
});

export const createQuizSchema = z.object({
  title: z
    .string({ required_error: 'Tiêu đề quiz là bắt buộc' })
    .min(1, 'Tiêu đề không được để trống')
    .max(150, 'Tiêu đề tối đa 150 ký tự'),
  pass_score: z
    .number({ required_error: 'pass_score là bắt buộc' })
    .min(1, 'Điểm pass tối thiểu là 1')
    .max(100, 'Điểm pass tối đa là 100'),
  reward_xp: z
    .number({ required_error: 'reward_xp là bắt buộc' })
    .min(1, 'XP tối thiểu là 1')
    .max(200, 'XP tối đa là 200'),
  questions: z
    .array(
      z.object({
        question_text: z
          .string({ required_error: 'Nội dung câu hỏi không được để trống' })
          .min(1, 'Nội dung câu hỏi không được để trống'),
        options: z.array(z.string()).min(2, 'Mỗi câu hỏi cần ít nhất 2 lựa chọn'),
        correct_answer: z
          .string({ required_error: 'Đáp án đúng không được để trống' })
          .min(1, 'Đáp án đúng không được để trống'),
        step_order: z
          .number({ required_error: 'Thứ tự câu hỏi là bắt buộc' })
          .min(1, 'Thứ tự câu hỏi tối thiểu là 1'),
      })
    )
    .optional()
    .default([]),
});

export const submitQuizSchema = z.object({
  child_id: z
    .string({ required_error: 'child_id là bắt buộc' })
    .min(1, 'child_id không được để trống'),
  answers: z
    .array(
      z.object({
        question_id: z
          .string({ required_error: 'question_id là bắt buộc' })
          .min(1, 'question_id không được để trống'),
        selected_answer: z
          .string({ required_error: 'selected_answer là bắt buộc' })
          .min(1, 'selected_answer không được để trống'),
      }),
      { required_error: 'answers là bắt buộc' }
    )
    .min(1, 'Phải có ít nhất 1 câu trả lời'),
});
