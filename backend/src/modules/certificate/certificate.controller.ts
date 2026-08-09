import { Request, Response, NextFunction } from 'express';
import { CertificateService } from './certificate.service';
import { sendResponse } from '../../shared/responses/apiResponse';
import { AppError } from '../../shared/errors/AppError';

export class CertificateController {
  static async getCertificates(req: Request, res: Response, next: NextFunction) {
    try {
      const childId = req.params.childId;
      
      // Boundary check: ensure PARENT owns child or CHILD is the child
      if (req.user?.role === 'CHILD' && req.user.id !== childId) {
        throw new AppError('Forbidden: Can only access your own certificates', 403, 'FORBIDDEN');
      }

      const certificates = await CertificateService.getCertificates(childId);
      return sendResponse(res, 200, certificates);
    } catch (error) {
      next(error);
    }
  }
}
