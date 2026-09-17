// Routes định nghĩa các API endpoints cho Lesson & Quiz module
import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import {
  createLessonSchema,
  updateLessonSchema,
  createQuizSchema,
  submitQuizSchema,
} from './lesson.validation';
import {
  getLessonsController,
  getLessonByIdController,
  createLessonController,
  updateLessonController,
  getQuizController,
  createQuizController,
  submitQuizController,
} from './lesson.controller';

const router = Router();

// === NHÓM 1: Quản lý bài học ===
router.get('/', getLessonsController);
router.post('/', validateRequest(createLessonSchema), createLessonController);
router.get('/:id', getLessonByIdController);
router.put('/:id', validateRequest(updateLessonSchema), updateLessonController);

// === NHÓM 2: Quản lý quiz ===
router.get('/:lessonId/quiz', getQuizController);
router.post('/:lessonId/quiz', validateRequest(createQuizSchema), createQuizController);

// === NHÓM 3: Nộp kết quả quiz ===
router.post('/:lessonId/quiz/submit', validateRequest(submitQuizSchema), submitQuizController);

export default router;
