// Controller xử lý request/response cho Reward module
import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../../utils/responseHelper';
import {
  getRewardsByParentId,
  createReward as createRewardService,
  updateReward as updateRewardService,
  createRedemption as createRedemptionService,
  approveRedemption as approveRedemptionService,
  getRedemptions as getRedemptionsService,
} from './reward.service';

export async function getRewards(req: Request, res: Response): Promise<void> {
  const parentId = req.query.parent_id as string;
  if (!parentId || parentId.trim() === '') {
    res.status(400).json(errorResponse('parent_id là bắt buộc', 400));
    return;
  }

  try {
    const rewards = await getRewardsByParentId(parentId);
    res.status(200).json(successResponse(rewards, 'Lấy danh sách phần thưởng thành công', 200));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi máy chủ';
    if (message.includes('không hợp lệ')) {
      res.status(400).json(errorResponse(message, 400));
      return;
    }
    res.status(500).json(errorResponse(message, 500));
  }
}

export async function createReward(req: Request, res: Response): Promise<void> {
  const { parent_id, title, cost_xp, category, icon } = req.body;

  try {
    const reward = await createRewardService({
      parent_id,
      title,
      cost_xp,
      category,
      icon,
    });
    res.status(201).json(successResponse(reward, 'Tạo phần thưởng thành công', 201));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi máy chủ';
    if (message.includes('không hợp lệ')) {
      res.status(400).json(errorResponse(message, 400));
      return;
    }
    res.status(500).json(errorResponse(message, 500));
  }
}

export async function updateReward(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const updated = await updateRewardService(id, req.body);
    res.status(200).json(successResponse(updated, 'Cập nhật phần thưởng thành công', 200));
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

export async function redeemReward(req: Request, res: Response): Promise<void> {
  const { reward_id, child_id } = req.body;

  try {
    const redemption = await createRedemptionService({
      reward_id,
      child_id,
    });
    res.status(201).json(successResponse(redemption, 'Gửi yêu cầu đổi quà thành công', 201));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi máy chủ';
    if (message.includes('Không tìm thấy')) {
      res.status(404).json(errorResponse(message, 404));
      return;
    }
    if (
      message.includes('không hợp lệ') ||
      message.includes('không khả dụng') ||
      message.includes('đã gửi')
    ) {
      res.status(400).json(errorResponse(message, 400));
      return;
    }
    res.status(500).json(errorResponse(message, 500));
  }
}

export async function approveRedemption(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await approveRedemptionService(id, status);
    res.status(200).json(successResponse(updated, 'Cập nhật trạng thái yêu cầu thành công', 200));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi máy chủ';
    if (message.includes('Không tìm thấy')) {
      res.status(404).json(errorResponse(message, 404));
      return;
    }
    if (message.includes('không hợp lệ') || message.includes('đã được xử lý')) {
      res.status(400).json(errorResponse(message, 400));
      return;
    }
    res.status(500).json(errorResponse(message, 500));
  }
}

export async function getRedemptions(req: Request, res: Response): Promise<void> {
  const child_id = req.query.child_id as string | undefined;
  const parent_id = req.query.parent_id as string | undefined;
  const status = req.query.status as string | undefined;

  try {
    const redemptions = await getRedemptionsService({
      child_id,
      parent_id,
      status,
    });
    res.status(200).json(successResponse(redemptions, 'Lấy danh sách yêu cầu đổi quà thành công', 200));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi máy chủ';
    res.status(500).json(errorResponse(message, 500));
  }
}
