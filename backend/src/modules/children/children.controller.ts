// Children Controller
import { Request, Response } from 'express';
import {
  getChildrenService,
  createChildService,
  updateChildService,
  resetPinService,
} from './children.service';
import { successResponse } from '../../utils/responseHelper';

export async function getChildren(req: Request, res: Response): Promise<void> {
  try {
    const children = await getChildrenService(req.user!.id);
    res.status(200).json(successResponse(children, 'Lấy danh sách bé thành công'));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: { code: err.code || 'GET_CHILDREN_ERROR', message: err.message },
    });
  }
}

export async function createChild(req: Request, res: Response): Promise<void> {
  try {
    const child = await createChildService(req.user!.id, req.body);
    res.status(201).json(successResponse(child, 'Tạo hồ sơ bé thành công', 201));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: { code: err.code || 'CREATE_CHILD_ERROR', message: err.message },
    });
  }
}

export async function updateChild(req: Request, res: Response): Promise<void> {
  try {
    const child = await updateChildService(req.user!.id, req.params.id, req.body);
    res.status(200).json(successResponse(child, 'Cập nhật hồ sơ bé thành công'));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: { code: err.code || 'UPDATE_CHILD_ERROR', message: err.message },
    });
  }
}

export async function resetPin(req: Request, res: Response): Promise<void> {
  try {
    const result = await resetPinService(req.user!.id, req.params.id, req.body);
    res.status(200).json(successResponse(result, 'Đặt lại PIN thành công'));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: { code: err.code || 'RESET_PIN_ERROR', message: err.message },
    });
  }
}
