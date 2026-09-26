import { useCallback, useEffect, useState } from 'react';
import { useActiveChild } from '@/hooks/useActiveChild';
import { aiSkillApi } from './api';
import type { AiSkillReport } from './types';

/** Báo cáo kỹ năng của bé đang chọn; month = "YYYY-MM" (bỏ trống = tháng hiện tại). */
export function useAiSkillReport(month?: string) {
  const { child, status: childStatus, token } = useActiveChild();
  const childId = child?._id ?? null;

  const [report, setReport] = useState<AiSkillReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token || !childId) return;
    setLoading(true);
    setError(null);
    try {
      setReport(await aiSkillApi.getReport(token, childId, month));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  }, [token, childId, month]);

  useEffect(() => {
    if (childStatus === 'loading') return;
    if (childStatus !== 'ready') {
      setLoading(false);
      return;
    }
    void load();
  }, [childStatus, load]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  const applyTask = useCallback(async () => {
    if (!token || !childId || !report || report.isTaskApplied) return;
    setApplying(true);
    try {
      const res = await aiSkillApi.applyTask(token, childId, report.reportId);
      setReport(res.report);
      setNotice(`Đã giao nhiệm vụ "${res.mission.title}" cho ${res.report.childName} 🚀`);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      void load(); // có thể đã được áp dụng ở máy khác → tải lại trạng thái
    } finally {
      setApplying(false);
    }
  }, [token, childId, report, load]);

  return { child, childStatus, report, loading, error, applying, notice, reload: load, applyTask };
}
