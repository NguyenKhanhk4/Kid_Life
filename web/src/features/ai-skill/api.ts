import type { AiSkillReport } from './types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request<T>(token: string, method: string, path: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/reports${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Không kết nối được máy chủ');
  }
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(json?.error?.message ?? 'Có lỗi xảy ra');
  return json as T;
}

export const aiSkillApi = {
  getReport: (token: string, childId: string, month?: string) => {
    const q = new URLSearchParams({ childId, ...(month ? { month } : {}) });
    return request<{ report: AiSkillReport }>(token, 'GET', `/ai-skill?${q}`).then((r) => r.report);
  },

  applyTask: (token: string, childId: string, reportId: string) =>
    request<{ report: AiSkillReport; mission: { id: string; title: string } }>(token, 'POST', '/apply-ai-task', {
      childId,
      reportId,
    }),
};
