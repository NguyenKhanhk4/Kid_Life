// Controller xử lý request/response cho Submission module
import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../../utils/responseHelper';
import { updateSubtask, createSubmission } from './submission.service';

export async function updateSubtaskController(req: Request, res: Response): Promise<void> {
  const { missionId, subId } = req.params;
  const { is_done } = req.body;

  try {
    const result = await updateSubtask(missionId, subId, is_done);
    res.status(200).json(successResponse(result, 'Cập nhật checklist thành công', 200));
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

export async function createSubmissionController(req: Request, res: Response): Promise<void> {
  const { mission_id, child_id } = req.body;
  const file = req.file;

  if (!file) {
    res.status(400).json(errorResponse('Ảnh minh chứng là bắt buộc', 400));
    return;
  }

  try {
    const submission = await createSubmission({ mission_id, child_id }, file);
    res.status(201).json(successResponse(submission, 'Nộp bài minh chứng thành công', 201));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi máy chủ';
    if (message.includes('Không tìm thấy')) {
      res.status(404).json(errorResponse(message, 404));
      return;
    }
    if (
      message.includes('không hợp lệ') ||
      message.includes('đã được nộp') ||
      message.includes('là bắt buộc')
    ) {
      res.status(400).json(errorResponse(message, 400));
      return;
    }
    res.status(500).json(errorResponse(message, 500));
  }
}
