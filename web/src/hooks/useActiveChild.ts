import { useEffect, useState } from 'react';
import { useAuth } from '@/modules/auth/AuthContext';
import { pickActiveChild } from '@/shared/utils/activeChild';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ActiveChild {
  _id: string;
  name: string;
  avatar?: string;
  level?: number;
  xp?: number;
  streak?: number;
}

export type ActiveChildStatus = 'loading' | 'ready' | 'no-auth' | 'no-child' | 'error';

/** Bé đang dùng chế độ "Bé" (lấy thật từ /api/children của tài khoản phụ huynh đang đăng nhập). */
export function useActiveChild() {
  const { token, isLoading: authLoading } = useAuth();
  const [child, setChild] = useState<ActiveChild | null>(null);
  const [status, setStatus] = useState<ActiveChildStatus>('loading');

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      setChild(null);
      setStatus('no-auth');
      return;
    }
    let cancelled = false;
    setStatus('loading');
    fetch(`${API_BASE}/api/children`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (!json.success) throw new Error(json.error?.message);
        const picked = pickActiveChild<ActiveChild>(json.data ?? []);
        setChild(picked);
        setStatus(picked ? 'ready' : 'no-child');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [token, authLoading]);

  return { child, status, token };
}
