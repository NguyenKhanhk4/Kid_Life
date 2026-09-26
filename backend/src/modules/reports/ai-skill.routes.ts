import { Router } from 'express';
import { z } from 'zod';
import authMiddleware from '../../middleware/authMiddleware';
import requireRole from '../../middleware/rbacMiddleware';
import { resolveChildId } from '../../shared/childAccess';
import { asyncHandler } from '../../shared/http';
import { parseBody } from '../../shared/parseBody';
import type { AiSkillReportService } from './ai-skill.service';

const reportQuerySchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'month phải có dạng YYYY-MM')
    .optional(),
});

const applyTaskSchema = z.object({
  childId: z.string().trim().min(1),
  reportId: z.string().trim().min(1, 'Thiếu reportId'),
});

/** Mount tại /api/reports — phụ huynh (hoặc admin) xem báo cáo kỹ năng của bé mình. */
export function createReportRouter(service: AiSkillReportService): Router {
  const router = Router();
  router.use(authMiddleware);
  router.use(requireRole('admin', 'parent'));

  /** GET /api/reports/ai-skill?childId=&month=YYYY-MM → { report } (tháng hiện tại nếu bỏ month) */
  router.get(
    '/ai-skill',
    asyncHandler(async (req, res) => {
      const { month } = parseBody(reportQuerySchema, req.query);
      res.json({ report: await service.getReport(await resolveChildId(req), month) });
    }),
  );

  /** POST /api/reports/apply-ai-task { childId, reportId } → { report, mission } */
  router.post(
    '/apply-ai-task',
    asyncHandler(async (req, res) => {
      const { reportId } = parseBody(applyTaskSchema, req.body);
      res.status(201).json(await service.applyAiTask(await resolveChildId(req), reportId));
    }),
  );

  return router;
}
