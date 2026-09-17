// Controller xử lý request/response cho Lesson & Quiz module
import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../../utils/responseHelper';
import {
  getLessons,
  getLessonById,
  createLesson,
  updateLesson,
  getQuizByLessonId,
  createQuiz,
  submitQuiz,
} from './lesson.service';

export async function getLessonsController(
  req: Request,
  res: Response
): Promise<void> {
  const category = req.query.category as string | undefined;

  try {
    const lessons = await getLessons(category);
    res
      .status(200)
      .json(successResponse(lessons, 'Lấy danh sách bài học thành công', 200));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi máy chủ';
    res.status(500).json(errorResponse(message, 500));
  }
}

export async function getLessonByIdController(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  try {
    const lesson = await getLessonById(id);
    res
      .status(200)
      .json(successResponse(lesson, 'Lấy thông tin bài học thành công', 200));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi máy chủ';
    if (message.includes('Không tìm thấy')) {
      res.status(404).json(errorResponse(message, 404));
      return;
    }
    if (message.includes('không hợp lệ')) {
      res.status(400).json(errorResponse(message, 400));
      return;
    }
    res.status(500).json(errorResponse(message, 500));
  }
}

export async function createLessonController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const lesson = await createLesson(req.body);
    res
      .status(201)
      .json(successResponse(lesson, 'Tạo bài học thành công', 201));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi máy chủ';
    res.status(500).json(errorResponse(message, 500));
  }
}

export async function updateLessonController(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  try {
    const updated = await updateLesson(id, req.body);
    res
      .status(200)
      .json(successResponse(updated, 'Cập nhật bài học thành công', 200));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi máy chủ';
    if (message.includes('Không tìm thấy')) {
      res.status(404).json(errorResponse(message, 404));
      return;
    }
    if (message.includes('không hợp lệ')) {
      res.status(400).json(errorResponse(message, 400));
      return;
    }
    res.status(500).json(errorResponse(message, 500));
  }
}

export async function getQuizController(
  req: Request,
  res: Response
): Promise<void> {
  const { lessonId } = req.params;

  try {
    const quiz = await getQuizByLessonId(lessonId);
    res
      .status(200)
      .json(successResponse(quiz, 'Lấy thông tin quiz thành công', 200));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi máy chủ';
    if (message.includes('chưa có quiz') || message.includes('Không tìm thấy')) {
      res.status(404).json(errorResponse(message, 404));
      return;
    }
    if (message.includes('không hợp lệ')) {
      res.status(400).json(errorResponse(message, 400));
      return;
    }
    res.status(500).json(errorResponse(message, 500));
  }
}

export async function createQuizController(
  req: Request,
  res: Response
): Promise<void> {
  const { lessonId } = req.params;

  try {
    const quiz = await createQuiz(lessonId, req.body);
    res
      .status(201)
      .json(successResponse(quiz, 'Tạo quiz thành công', 201));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi máy chủ';
    if (message.includes('Không tìm thấy') || message.includes('chưa có')) {
      res.status(404).json(errorResponse(message, 404));
      return;
    }
    if (message.includes('không hợp lệ') || message.includes('đã có quiz')) {
      res.status(400).json(errorResponse(message, 400));
      return;
    }
    res.status(500).json(errorResponse(message, 500));
  }
}

export async function submitQuizController(
  req: Request,
  res: Response
): Promise<void> {
  const { lessonId } = req.params;

  try {
    const result = await submitQuiz(lessonId, req.body);
    res
      .status(200)
      .json(successResponse(result, 'Nộp kết quả quiz thành công', 200));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi máy chủ';
    if (message.includes('Không tìm thấy') || message.includes('chưa có')) {
      res.status(404).json(errorResponse(message, 404));
      return;
    }
    if (message.includes('không hợp lệ')) {
      res.status(400).json(errorResponse(message, 400));
      return;
    }
    res.status(500).json(errorResponse(message, 500));
  }
}
