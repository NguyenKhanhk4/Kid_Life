// Children Controller
import { Request, Response } from 'express';
import {
  getChildrenService,
  createChildService,
  updateChildService,
  resetPinService,
  deleteChildService,
  verifyPinService
} from './children.service';
import { successResponse } from '../../utils/responseHelper';

export async function getChildren(req: Request, res: Response): Promise<void> {
  try {
    const children = await getChildrenService(req.user!.id);
    res.status(200).json(successResponse(children, 'Láº¥y danh sÃ¡ch bÃ© thÃ nh cÃ´ng'));
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
    res.status(201).json(successResponse(child, 'Táº¡o há»“ sÆ¡ bÃ© thÃ nh cÃ´ng', 201));
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
    res.status(200).json(successResponse(child, 'Cáº­p nháº­t há»“ sÆ¡ bÃ© thÃ nh cÃ´ng'));
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
    res.status(200).json(successResponse(result, 'Äáº·t láº¡i PIN thÃ nh cÃ´ng'));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: { code: err.code || 'RESET_PIN_ERROR', message: err.message },
    });
  }
}

export async function deleteChild(req: Request, res: Response): Promise<void> {
  try {
    const result = await deleteChildService(req.user!.id, req.params.id);
    res.status(200).json(successResponse(result, 'XÃ³a há»“ sÆ¡ bÃ© thÃ nh cÃ´ng'));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: { code: err.code || 'DELETE_CHILD_ERROR', message: err.message },
    });
  }
}

export async function verifyPin(req: Request, res: Response): Promise<void> {
  try {
    const result = await verifyPinService(req.params.id, req.body.pin);
    res.status(200).json(successResponse(result, 'Xác th?c mã PIN thành công'));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: { code: err.code || 'VERIFY_PIN_ERROR', message: err.message },
    });
  }
}

