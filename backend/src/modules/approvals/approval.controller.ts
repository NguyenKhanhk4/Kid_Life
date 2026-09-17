import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../../utils/responseHelper';
import { getPendingSubmissions, approveSubmission, getWalletByChildId } from './approval.service';

export async function getPendingController(req: Request, res: Response) {
  try {
    const result = await getPendingSubmissions();
    res.status(200).json(successResponse(result, "Lấy danh sách bài chờ duyệt thành công"));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message, 500));
  }
}

export async function approveController(req: Request, res: Response) {
  try {
    const { submissionId } = req.params;
    const { action, feedback = '' } = req.body;
    
    const result = await approveSubmission(submissionId, action, feedback);
    res.status(200).json(successResponse(result, "Duyệt bài thành công"));
  } catch (error) {
    const message = (error as Error).message;
    if (message === 'Không tìm thấy bài nộp' || message === 'Không tìm thấy nhiệm vụ liên quan') {
      res.status(404).json(errorResponse(message, 404));
      return;
    }
    if (message === 'submissionId không hợp lệ' || message === 'Bài nộp này đã được xử lý rồi') {
      res.status(400).json(errorResponse(message, 400));
      return;
    }
    res.status(500).json(errorResponse(message, 500));
  }
}

export async function getWalletController(req: Request, res: Response) {
  try {
    const { childId } = req.params;
    const result = await getWalletByChildId(childId);
    res.status(200).json(successResponse(result, "Lấy thông tin ví thành công"));
  } catch (error) {
    const message = (error as Error).message;
    if (message === 'childId không hợp lệ') {
      res.status(400).json(errorResponse(message, 400));
      return;
    }
    res.status(500).json(errorResponse(message, 500));
  }
}
