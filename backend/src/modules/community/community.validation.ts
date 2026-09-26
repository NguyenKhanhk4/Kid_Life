// Zod validation schemas cho module Community
import { z } from 'zod';

export const createPostSchema = z.object({
  title: z
    .string({ required_error: 'Tiêu đề là bắt buộc' })
    .min(5, 'Tiêu đề phải có ít nhất 5 ký tự')
    .max(200, 'Tiêu đề tối đa 200 ký tự')
    .trim(),
  content: z
    .string({ required_error: 'Nội dung là bắt buộc' })
    .min(10, 'Nội dung phải có ít nhất 10 ký tự')
    .max(5000, 'Nội dung tối đa 5000 ký tự')
    .trim(),
  tags: z
    .array(z.string().trim().max(30))
    .max(5, 'Tối đa 5 thẻ tag')
    .default([]),
});

export const createCommentSchema = z.object({
  commentText: z
    .string({ required_error: 'Nội dung bình luận là bắt buộc' })
    .min(1, 'Bình luận không được để trống')
    .max(1000, 'Bình luận tối đa 1000 ký tự')
    .trim(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
