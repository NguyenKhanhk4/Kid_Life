// Controller xử lý request/response cho Mission module
import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../../utils/responseHelper';
import {
  getMissionsByChildId,
  createMission as createMissionService,
  updateMission as updateMissionService,
  deleteMission as deleteMissionService,
} from './mission.service';

export async function getMissions(req: Request, res: Response): Promise<void> {
  const childId = req.query.childId as string;
  if (!childId || childId.trim() === '') {
    res.status(400).json(errorResponse('childId là bắt buộc', 400));
    return;
  }

  try {
    const missions = await getMissionsByChildId(childId);
    res.status(200).json(successResponse(missions, 'Lấy danh sách nhiệm vụ thành công', 200));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi máy chủ';
    if (message.includes('không hợp lệ')) {
      res.status(400).json(errorResponse(message, 400));
      return;
    }
    res.status(500).json(errorResponse(message, 500));
  }
}

export async function createMission(req: Request, res: Response): Promise<void> {
  const { child_id, title, category, reward_xp, schedule_time, subtasks } = req.body;

  try {
    const mission = await createMissionService({
      child_id,
      title,
      category,
      reward_xp,
      schedule_time,
      subtasks,
    });
    res.status(201).json(successResponse(mission, 'Tạo nhiệm vụ thành công', 201));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi máy chủ';
    res.status(500).json(errorResponse(message, 500));
  }
}

export async function updateMission(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const updated = await updateMissionService(id, req.body);
    res.status(200).json(successResponse(updated, 'Cập nhật nhiệm vụ thành công', 200));
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

export async function deleteMission(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    await deleteMissionService(id);
    res.status(200).json(successResponse(null, 'Xoá nhiệm vụ thành công', 200));
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
