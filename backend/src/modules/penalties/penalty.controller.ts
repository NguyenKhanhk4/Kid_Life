// Controller xử lý request/response cho Penalty module
import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../../utils/responseHelper';
import { createPenalty, getPenalties } from './penalty.service';

export async function createPenaltyController(req: Request, res: Response): Promise<void> {
  try {
    const { child_id, parent_id, reason, penalty_xp } = req.body;
    const result = await createPenalty({
      child_id,
      parent_id,
      reason,
      penalty_xp,
    });
    res.status(201).json(successResponse(result, 'Tạo vé phạt thành công', 201));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi máy chủ';
    if (message.includes('không hợp lệ')) {
      res.status(400).json(errorResponse(message, 400));
      return;
    }
    res.status(500).json(errorResponse(message, 500));
  }
}

export async function getPenaltiesController(req: Request, res: Response): Promise<void> {
  try {
    const child_id = req.query.child_id as string | undefined;
    const parent_id = req.query.parent_id as string | undefined;

    const result = await getPenalties({ child_id, parent_id });
    res.status(200).json(successResponse(result, 'Lấy lịch sử vé phạt thành công', 200));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi máy chủ';
    res.status(500).json(errorResponse(message, 500));
  }
}
