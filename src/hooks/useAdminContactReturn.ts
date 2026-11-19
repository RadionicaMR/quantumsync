import { useEffect, useLayoutEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { readAdminReturn, saveAdminReturn } from '@/utils/adminReturn';

export function useAdminContactReturn(tab: string, ready: boolean) {
  const { user } = useAuth();
  const container = useRef<HTMLDivElement>(null);
  const initial = useRef(user ? readAdminReturn(localStorage, user.userId) : null);
  const restored = useRef(false);

  const remember = (pending = true) => {
    if (!user) return;
    saveAdminReturn(localStorage, user.userId, {
      tab, scrollY: window.scrollY,
      scrollX: container.current?.querySelector('div.overflow-auto')?.scrollLeft || 0,
      returnPending: pending,
    });
  };

  useLayoutEffect(() => {
    if (!ready || restored.current) return;
    restored.current = true;
    if (initial.current?.tab !== tab) return;
    window.scrollTo({ top: initial.current.scrollY, behavior: 'instant' });
    const table = container.current?.querySelector('div.overflow-auto');
    if (table) table.scrollLeft = initial.current.scrollX;
  }, [ready, tab]);

  useEffect(() => {
    const save = () => {
      if (!restored.current || !user) return;
      remember(readAdminReturn(localStorage, user.userId).returnPending);
    };
    window.addEventListener('scroll', save, { passive: true });
    window.addEventListener('pagehide', save);
    document.addEventListener('visibilitychange', save);
    return () => {
      window.removeEventListener('scroll', save);
      window.removeEventListener('pagehide', save);
      document.removeEventListener('visibilitychange', save);
    };
  }, [user?.userId, tab]);

  return { container, remember };
}