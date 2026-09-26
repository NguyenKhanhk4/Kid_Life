import { useEffect, useState } from 'react';
import { useAuth } from '@/modules/auth/AuthContext';
import { ACTIVE_CHILD_EVENT, pickActiveChild } from '@/shared/utils/activeChild';

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

/**
 * Bé đang được chọn (lấy thật từ /api/children của tài khoản đang đăng nhập).
 * Tự đổi theo khi bé đăng nhập PIN hoặc phụ huynh chọn bé khác ở ChildPicker.
 */
export function useActiveChild() {
  const { token, isLoading: authLoading } = useAuth();
  const [children, setChildren] = useState<ActiveChild[]>([]);
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
        const list: ActiveChild[] = json.data ?? [];
        const picked = pickActiveChild(list);
        setChildren(list);
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

  useEffect(() => {
    const onChange = () => {
      const picked = pickActiveChild(children);
      if (picked) setChild(picked);
    };
    window.addEventListener(ACTIVE_CHILD_EVENT, onChange);
    return () => window.removeEventListener(ACTIVE_CHILD_EVENT, onChange);
  }, [children]);

  return { child, status, token };
}
