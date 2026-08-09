import { Certificate } from './certificate.model';
import { AppError } from '../../shared/errors/AppError';
import { isMongoServerError } from '../../shared/errors/MongoErrorGuard';

export class CertificateService {
  /**
   * Auto-issues a certificate based on criteria.
   * Leverages unique index to silently ignore or explicitly handle duplicates.
   */
  static async issueCertificate(childId: string, title: string, criteria: string, fileUrl: string = '') {
    try {
      const certificate = new Certificate({
        childId,
        title,
        criteria,
        fileUrl,
        issuedAt: new Date(),
      });
      await certificate.save();
      return certificate;
    } catch (error: unknown) {
      if (isMongoServerError(error) && error.code === 11000) {
        // Certificate for this criteria already issued, which is fine for idempotency
        return Certificate.findOne({ childId, criteria });
      }
      throw error;
    }
  }

  static async getCertificates(childId: string) {
    return Certificate.find({ childId }).sort({ issuedAt: -1 });
  }
}
