import { Request, Response, NextFunction } from 'express';
import { ReportService } from './report.service';
import { sendResponse } from '../../shared/responses/apiResponse';

export class ReportController {
  static async getChildReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const dateFrom = typeof req.query.dateFrom === 'string' ? req.query.dateFrom : undefined;
      const dateTo = typeof req.query.dateTo === 'string' ? req.query.dateTo : undefined;
      const report = await ReportService.getChildReport(id, dateFrom, dateTo);
      return sendResponse(res, 200, report);
    } catch (error) { next(error); }
  }

  static async getAdminOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const dateFrom = typeof req.query.dateFrom === 'string' ? req.query.dateFrom : undefined;
      const dateTo = typeof req.query.dateTo === 'string' ? req.query.dateTo : undefined;
      const overview = await ReportService.getAdminOverview(dateFrom, dateTo);
      return sendResponse(res, 200, overview);
    } catch (error) { next(error); }
  }

  static async getExpertContent(req: Request, res: Response, next: NextFunction) {
    try {
      const dateFrom = typeof req.query.dateFrom === 'string' ? req.query.dateFrom : undefined;
      const dateTo = typeof req.query.dateTo === 'string' ? req.query.dateTo : undefined;
      const content = await ReportService.getExpertContentReport(dateFrom, dateTo);
      return sendResponse(res, 200, content);
    } catch (error) { next(error); }
  }
}
