// Controller xử lý request/response cho VirtualBank module
import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../../utils/responseHelper';
import {
  getBankAccount,
  deposit,
  withdraw,
  processInterest,
} from './virtual-bank.service';

export async function getBankAccountController(req: Request, res: Response): Promise<void> {
  try {
    const { childId } = req.params;
    const result = await getBankAccount(childId);
    res
      .status(200)
      .json(successResponse(result, 'Lấy thông tin tài khoản ngân hàng thành công', 200));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi máy chủ';
    if (message.includes('không hợp lệ')) {
      res.status(400).json(errorResponse(message, 400));
      return;
    }
    res.status(500).json(errorResponse(message, 500));
  }
}

export async function depositController(req: Request, res: Response): Promise<void> {
  try {
    const { child_id, amount } = req.body;
    const result = await deposit({ child_id, amount });
    res
      .status(201)
      .json(successResponse(result, 'Gửi XP vào ngân hàng thành công', 201));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi máy chủ';
    if (
      message.includes('không hợp lệ') ||
      message.includes('không đủ') ||
      message.includes('phải lớn hơn')
    ) {
      res.status(400).json(errorResponse(message, 400));
      return;
    }
    if (message.includes('Không tìm thấy')) {
      res.status(404).json(errorResponse(message, 404));
      return;
    }
    res.status(500).json(errorResponse(message, 500));
  }
}

export async function withdrawController(req: Request, res: Response): Promise<void> {
  try {
    const { child_id, amount } = req.body;
    const result = await withdraw({ child_id, amount });
    res
      .status(201)
      .json(successResponse(result, 'Rút XP từ ngân hàng thành công', 201));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi máy chủ';
    if (
      message.includes('không hợp lệ') ||
      message.includes('không đủ') ||
      message.includes('phải lớn hơn')
    ) {
      res.status(400).json(errorResponse(message, 400));
      return;
    }
    if (message.includes('Không tìm thấy')) {
      res.status(404).json(errorResponse(message, 404));
      return;
    }
    res.status(500).json(errorResponse(message, 500));
  }
}

export async function triggerInterestController(req: Request, res: Response): Promise<void> {
  try {
    const result = await processInterest();
    res.status(200).json(successResponse(result, 'Tính lãi thành công', 200));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi máy chủ';
    res.status(500).json(errorResponse(message, 500));
  }
}
