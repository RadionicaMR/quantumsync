export const ADMIN_TABS = ['users', 'sales', 'affiliates', 'tracking', 'affiliate-stats', 'analytics', 'usage', 'gallery'] as const;
export const TRACKING_FILTERS = ['all', 'two_days', 'one_day', 'expired', 'recontact'] as const;

export interface AdminReturnState {
  tab: string;
  search: string;
  stageFilter: typeof TRACKING_FILTERS[number];
  scrollY: number;
  scrollX: number;
  returnPending: boolean;
}

export const DEFAULT_ADMIN_RETURN: AdminReturnState = {
  tab: 'users', search: '', stageFilter: 'all', scrollY: 0, scrollX: 0, returnPending: false,
};

export function readAdminReturn(storage: Pick<Storage, 'getItem'>, userId: string): AdminReturnState {
  try {
    const saved = JSON.parse(storage.getItem(`admin-return:${userId}`) || 'null');
    if (!saved || !ADMIN_TABS.includes(saved.tab)) return { ...DEFAULT_ADMIN_RETURN };
    return {
      tab: saved.tab,
      search: typeof saved.search === 'string' ? saved.search : '',
      stageFilter: TRACKING_FILTERS.includes(saved.stageFilter) ? saved.stageFilter : 'all',
      scrollY: Number.isFinite(saved.scrollY) ? Math.max(0, saved.scrollY) : 0,
      scrollX: Number.isFinite(saved.scrollX) ? Math.max(0, saved.scrollX) : 0,
      returnPending: saved.returnPending === true,
    };
  } catch {
    return { ...DEFAULT_ADMIN_RETURN };
  }
}

export function saveAdminReturn(storage: Pick<Storage, 'getItem' | 'setItem'>, userId: string, patch: Partial<AdminReturnState>) {
  const state = { ...readAdminReturn(storage, userId), ...patch };
  try { storage.setItem(`admin-return:${userId}`, JSON.stringify(state)); } catch { /* Storage may be unavailable. */ }
  return state;
}

export function getAdminResumePath(storage: Pick<Storage, 'getItem'>, userId: string) {
  const state = readAdminReturn(storage, userId);
  return state.returnPending ? `/admin?tab=${state.tab}` : null;
}