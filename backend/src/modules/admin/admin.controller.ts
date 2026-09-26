import { Request, Response } from 'express';
import { getAdminStatsService, getUsersService, updateUserStatusService, getFamilyDetailService, updateChildStatusService, getPendingInvitesService, getReportedPostsService, hidePostService, createChallengeService, closeChallengeService, getSettingsService, updateSettingService, getAuditLogsService, createSupportTicketService, getSupportTicketsService, resolveSupportTicketService, logAdminAction } from './admin.service';
import { successResponse } from '../../utils/responseHelper';

export async function getAdminStats(req: Request, res: Response): Promise<void> {
  try {
    const stats = await getAdminStatsService();
    res.status(200).json(successResponse(stats, 'Lấy thống kê thành công'));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: { code: err.code || 'GET_STATS_ERROR', message: err.message },
    });
  }
}

export async function getUsers(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const role = req.query.role as string | undefined;
    const status = req.query.status as string | undefined;

    const result = await getUsersService(page, role, status);
    res.status(200).json(successResponse(result, 'Lấy danh sách người dùng thành công'));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: { code: err.code || 'GET_USERS_ERROR', message: err.message },
    });
  }
}

export async function updateUserStatus(req: Request, res: Response): Promise<void> {
  try {
    const { status } = req.body;
    if (!['active', 'locked'].includes(status)) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_STATUS', message: 'Status chỉ có thể là active hoặc locked' },
      });
      return;
    }

    const user = await updateUserStatusService(req.params.id, status);
    res.status(200).json(successResponse(user, `Đã chuyển trạng thái người dùng thành ${status}`));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: { code: err.code || 'UPDATE_STATUS_ERROR', message: err.message },
    });
  }
}

export async function getFamilyDetail(req: Request, res: Response): Promise<void> {
  try {
    const detail = await getFamilyDetailService(req.params.userId);
    res.status(200).json(successResponse(detail, 'Lấy chi tiết gia đình thành công'));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: { code: err.code || 'GET_FAMILY_DETAIL_ERROR', message: err.message },
    });
  }
}

export async function updateChildStatus(req: Request, res: Response): Promise<void> {
  try {
    const { status } = req.body;
    if (!['active', 'locked'].includes(status)) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_STATUS', message: 'Status chỉ có thể là active hoặc locked' },
      });
      return;
    }

    const child = await updateChildStatusService(req.params.id, status);
    res.status(200).json(successResponse(child, `Đã chuyển trạng thái bé thành ${status}`));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: { code: err.code || 'UPDATE_CHILD_STATUS_ERROR', message: err.message },
    });
  }
}

export async function getPendingInvites(req: Request, res: Response): Promise<void> {
  try {
    const invites = await getPendingInvitesService();
    res.status(200).json(successResponse(invites, 'Lấy danh sách lời mời chờ xử lý thành công'));
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'GET_PENDING_INVITES_ERROR', message: err.message },
    });
  }
}

// ─── NHÓM C: KIỂM DUYỆT CỘNG ĐỒNG ──────────────────────────────────────────────

export async function getReportedPosts(req: Request, res: Response): Promise<void> {
  try {
    const posts = await getReportedPostsService();
    res.status(200).json(successResponse(posts, 'Lấy danh sách bài viết vi phạm thành công'));
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'GET_REPORTED_POSTS_ERROR', message: err.message } });
  }
}

export async function hidePost(req: Request, res: Response): Promise<void> {
  try {
    const { isHidden } = req.body;
    const post = await hidePostService(req.params.id, isHidden);
    res.status(200).json(successResponse(post, isHidden ? 'Đã ẩn bài viết' : 'Đã hiện bài viết'));
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'HIDE_POST_ERROR', message: err.message } });
  }
}

export async function createChallengeAdmin(req: Request, res: Response): Promise<void> {
  try {
    const challenge = await createChallengeService(req.body);
    res.status(201).json(successResponse(challenge, 'Tạo thử thách thành công', 201));
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'CREATE_CHALLENGE_ERROR', message: err.message } });
  }
}

export async function closeChallengeAdmin(req: Request, res: Response): Promise<void> {
  try {
    const challenge = await closeChallengeService(req.params.id);
    res.status(200).json(successResponse(challenge, 'Đã đóng thử thách thành công'));
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'CLOSE_CHALLENGE_ERROR', message: err.message } });
  }
}

// ─── NHÓM E: CẤU HÌNH HỆ THỐNG ───────────────────────────────────────────────

export async function getSettings(req: Request, res: Response): Promise<void> {
  try {
    const settings = await getSettingsService();
    res.status(200).json(successResponse(settings, 'Lấy cấu hình thành công'));
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'GET_SETTINGS_ERROR', message: err.message } });
  }
}

export async function updateSetting(req: Request, res: Response): Promise<void> {
  try {
    const { value } = req.body;
    const setting = await updateSettingService(req.params.key, value, req.user!.id);
    res.status(200).json(successResponse(setting, 'Cập nhật cấu hình thành công'));
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'UPDATE_SETTING_ERROR', message: err.message } });
  }
}

// ─── NHÓM D: QUẢN LÝ DANH MỤC HỆ THỐNG (Master Data Placeholders) ────────────

export async function masterDataPlaceholder(req: Request, res: Response): Promise<void> {
  res.status(501).json({ success: false, error: { code: 'NOT_IMPLEMENTED', message: 'TODO: Cần Dev 2/Dev 3 export model tương ứng' } });
}
export async function getMasterDataPlaceholder(req: Request, res: Response): Promise<void> {
  res.status(200).json(successResponse([], 'TODO: Chờ export model. Tạm trả về mảng rỗng.'));
}

// ─── NHÓM F: VẬN HÀNH & GIÁM SÁT ──────────────────────────────────────────────

export async function getAuditLogs(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const action = req.query.action as string;
    const result = await getAuditLogsService(page, action);
    res.status(200).json(successResponse(result, 'Lấy nhật ký vận hành thành công'));
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'GET_AUDIT_LOGS_ERROR', message: err.message } });
  }
}

export async function createSupportTicket(req: Request, res: Response): Promise<void> {
  try {
    const { subject, message } = req.body;
    const ticket = await createSupportTicketService(req.user!.id, subject, message);
    res.status(201).json(successResponse(ticket, 'Gửi yêu cầu hỗ trợ thành công', 201));
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'CREATE_TICKET_ERROR', message: err.message } });
  }
}

export async function getSupportTickets(req: Request, res: Response): Promise<void> {
  try {
    const tickets = await getSupportTicketsService();
    res.status(200).json(successResponse(tickets, 'Lấy danh sách ticket thành công'));
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'GET_TICKETS_ERROR', message: err.message } });
  }
}

export async function resolveSupportTicket(req: Request, res: Response): Promise<void> {
  try {
    const ticket = await resolveSupportTicketService(req.params.id);
    await logAdminAction(req.user!.id, 'RESOLVE_TICKET', 'SupportTicket', req.params.id);
    res.status(200).json(successResponse(ticket, 'Đã đánh dấu xử lý xong'));
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'RESOLVE_TICKET_ERROR', message: err.message } });
  }
}
