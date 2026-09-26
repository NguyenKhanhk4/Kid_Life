// Family Controller — nhận request, gọi service, trả response chuẩn
import { Request, Response } from 'express';
import {
  getFamilyMembersService,
  inviteMemberService,
  updateMemberRoleService,
} from './family.service';
import { successResponse } from '../../utils/responseHelper';

export async function getMembers(req: Request, res: Response): Promise<void> {
  try {
    const adminId = req.user!.id;
    const members = await getFamilyMembersService(adminId);
    res.status(200).json(successResponse(members, 'Lấy danh sách thành viên thành công'));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: { code: err.code || 'FAMILY_ERROR', message: err.message },
    });
  }
}

export async function inviteMember(req: Request, res: Response): Promise<void> {
  try {
    const adminId = req.user!.id;
    const member = await inviteMemberService(adminId, req.body);
    res.status(201).json(successResponse(member, 'Gửi lời mời thành công', 201));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: { code: err.code || 'INVITE_ERROR', message: err.message },
    });
  }
}

export async function updateMemberRole(req: Request, res: Response): Promise<void> {
  try {
    const adminId = req.user!.id;
    const { id } = req.params;
    const updated = await updateMemberRoleService(adminId, id, req.body);
    res.status(200).json(successResponse(updated, 'Cập nhật vai trò thành công'));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: { code: err.code || 'UPDATE_ROLE_ERROR', message: err.message },
    });
  }
}
