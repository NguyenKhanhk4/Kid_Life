import { getReportDataSource } from './report.datasource';
import { WalletTransaction } from '../wallet/wallet.model';
import { RewardRedemption } from '../reward/reward.model';
import { Certificate } from '../certificate/certificate.model';
import { Subscription, Transaction } from '../payment/payment.model';
import { AppError } from '../../shared/errors/AppError';

export class ReportService {
  static validateDateRange(from?: string, to?: string) {
    let dateFrom: Date | undefined;
    let dateTo: Date | undefined;

    if (from) {
      dateFrom = new Date(from);
      if (isNaN(dateFrom.getTime())) throw new AppError('Invalid dateFrom format', 400, 'INVALID_DATE');
    }
    
    if (to) {
      dateTo = new Date(to);
      if (isNaN(dateTo.getTime())) throw new AppError('Invalid dateTo format', 400, 'INVALID_DATE');
    }

    if (dateFrom && dateTo && dateFrom > dateTo) {
      throw new AppError('dateFrom cannot be later than dateTo', 400, 'INVALID_DATE_RANGE');
    }

    // Example limit constraint: 1 year max
    if (dateFrom && dateTo) {
      const diffTime = Math.abs(dateTo.getTime() - dateFrom.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 365) {
        throw new AppError('Date range cannot exceed 365 days', 400, 'INVALID_DATE_RANGE');
      }
    }

    return { dateFrom, dateTo };
  }

  static buildDateQuery(dateField: string, dateFrom?: Date, dateTo?: Date): Record<string, unknown> {
    const query: Record<string, unknown> = {};
    if (dateFrom || dateTo) {
      const dateCondition: Record<string, Date> = {};
      if (dateFrom) dateCondition.$gte = dateFrom;
      if (dateTo) dateCondition.$lte = dateTo;
      query[dateField] = dateCondition;
    }
    return query;
  }

  static async getChildReport(childId: string, from?: string, to?: string) {
    const { dateFrom, dateTo } = this.validateDateRange(from, to);
    
    const dateQuery = this.buildDateQuery('createdAt', dateFrom, dateTo);

    // Dev3 native data
    const walletQuery = { childId, ...dateQuery };
    const walletHistory = await WalletTransaction.find(walletQuery).sort({ createdAt: -1 });
    const redemptions = await RewardRedemption.find(walletQuery).sort({ createdAt: -1 });

    const certDateQuery = this.buildDateQuery('issuedAt', dateFrom, dateTo);
    const certificates = await Certificate.find({ childId, ...certDateQuery }).sort({ issuedAt: -1 });

    // Dev2 stubs using the flexible DataSource
    const dataSource = getReportDataSource();
    const missionHistory = await dataSource.getCollectionData('missions', { childId, ...dateQuery });
    const skillProgress = await dataSource.getCollectionData('skills', { childId }); // Assuming skills might not have standard createdAt

    return {
      walletHistory,
      redemptions,
      certificates,
      missionHistory,
      skillProgress
    };
  }

  static async getAdminOverview(from?: string, to?: string) {
    const { dateFrom, dateTo } = this.validateDateRange(from, to);
    const dateQuery = this.buildDateQuery('createdAt', dateFrom, dateTo);

    const subscriptions = await Subscription.find(dateQuery);
    const transactions = await Transaction.find(dateQuery);

    const revenue = transactions
      .filter(tx => tx.status === 'SUCCESS')
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      subscriptionsCount: subscriptions.length,
      transactionsCount: transactions.length,
      revenue,
      subscriptions,
      transactions
    };
  }

  static async getExpertContentReport(from?: string, to?: string) {
    const { dateFrom, dateTo } = this.validateDateRange(from, to);
    const dateQuery = this.buildDateQuery('createdAt', dateFrom, dateTo);

    const dataSource = getReportDataSource();
    // Simulate Dev2 content modules performance
    const contentStats = await dataSource.getCollectionData('contentStats', dateQuery);

    return {
      contentStats,
      // Provide an empty array with stable schema for now until Dev2 integrates
      topModules: [],
      engagementMetrics: { views: 0, completions: 0 }
    };
  }
}
