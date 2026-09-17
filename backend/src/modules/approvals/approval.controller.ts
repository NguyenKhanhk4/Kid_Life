import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../../utils/responseHelper';
import { getPendingSubmissions, approveSubmission, getWalletByChildId } from './approval.service';

export async function getPendingController(req: Request, res: Response) {
  try {
    const result = await getPendingSubmissions();
    return successResponse(res, result, "Lấy danh sách bài chờ duyệt thành công");
  } catch (error) {
    return errorResponse(res, (error as Error).message, 500);
  }
}

export async function approveController(req: Request, res: Response) {
  try {
    const { submissionId } = req.params;
    const { action, feedback = '' } = req.body;
    
    const result = await approveSubmission(submissionId, action, feedback);
    return successResponse(res, result, "Duyệt bài thành công");
  } catch (error) {
    const message = (error as Error).message;
    if (message === 'Không tìm thấy bài nộp' || message === 'Không tìm thấy nhiệm vụ liên quan') {
      return errorResponse(res, message, 404);
    }
    if (message === 'submissionId không hợp lệ' || message === 'Bài nộp này đã được xử lý rồi') {
      return errorResponse(res, message, 400);
    }
    return errorResponse(res, message, 500);
  }
}

export async function getWalletController(req: Request, res: Response) {
  try {
    const { childId } = req.params;
    const result = await getWalletByChildId(childId);
    return successResponse(res, result, "Lấy thông tin ví thành công");
  } catch (error) {
    const message = (error as Error).message;
    if (message === 'childId không hợp lệ') {
      return errorResponse(res, message, 400);
    }
    return errorResponse(res, message, 500);
  }
}
