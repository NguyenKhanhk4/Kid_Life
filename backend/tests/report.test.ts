import test, { describe, mock } from 'node:test';
import assert from 'node:assert';
import { ReportService } from '../src/modules/report/report.service';
import { getErrorCode } from './testUtils';
import * as ReportDataSourceModule from '../src/modules/report/report.datasource';
import { WalletTransaction } from '../src/modules/wallet/wallet.model';
import { RewardRedemption } from '../src/modules/reward/reward.model';
import { Certificate } from '../src/modules/certificate/certificate.model';

describe('ReportService', () => {
  test('validateDateRange should throw on invalid ranges', () => {
    try {
      ReportService.validateDateRange('invalid', 'dates');
      assert.fail();
    } catch (error: unknown) {
      assert.strictEqual(getErrorCode(error), 'INVALID_DATE');
    }

    try {
      ReportService.validateDateRange('2026-10-01', '2026-09-01');
      assert.fail();
    } catch (error: unknown) {
      assert.strictEqual(getErrorCode(error), 'INVALID_DATE_RANGE');
    }
    
    try {
      ReportService.validateDateRange('2020-01-01', '2022-01-01'); // More than 365 days
      assert.fail();
    } catch (error: unknown) {
      assert.strictEqual(getErrorCode(error), 'INVALID_DATE_RANGE');
    }
  });

  test('getChildReport should aggregate standard schemas even if Dev2 missing', async () => {
    mock.method(WalletTransaction, 'find', () => ({ sort: () => Promise.resolve([]) }));
    mock.method(RewardRedemption, 'find', () => ({ sort: () => Promise.resolve([]) }));
    mock.method(Certificate, 'find', () => ({ sort: () => Promise.resolve([]) }));

    const fakeDataSource = {
      getCollectionData: () => Promise.resolve([])
    };
    mock.method(ReportDataSourceModule, 'getReportDataSource', () => fakeDataSource);

    const report = await ReportService.getChildReport('child_1');
    assert.ok(Array.isArray(report.walletHistory));
    assert.ok(Array.isArray(report.missionHistory));
    assert.strictEqual(report.missionHistory.length, 0);

    mock.restoreAll();
  });
});
