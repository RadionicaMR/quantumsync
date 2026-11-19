import { expect, test } from 'bun:test';
import { readAdminReturn, saveAdminReturn, getAdminResumePath } from './adminReturn';

const storage = () => {
  const values = new Map();
  return { getItem: (key) => values.get(key) || null, setItem: (key, value) => values.set(key, value) };
};

test('WhatsApp return restores Seguimiento, search, filter, and exact position', () => {
  const s = storage();
  saveAdminReturn(s, 'admin-a', { tab: 'tracking', search: 'Ana', stageFilter: 'recontact', scrollY: 742, scrollX: 120, returnPending: true });
  expect(getAdminResumePath(s, 'admin-a')).toBe('/admin?tab=tracking');
  expect(readAdminReturn(s, 'admin-a')).toEqual({ tab: 'tracking', search: 'Ana', stageFilter: 'recontact', scrollY: 742, scrollX: 120, returnPending: true });
});

test('new users default to Usuarios without inheriting another administrator position', () => {
  const s = storage();
  saveAdminReturn(s, 'admin-a', { tab: 'tracking', returnPending: true });
  expect(readAdminReturn(s, 'admin-b').tab).toBe('users');
  expect(getAdminResumePath(s, 'admin-b')).toBe(null);
});

test('leaving the WhatsApp workflow clears the installed-app return', () => {
  const s = storage();
  saveAdminReturn(s, 'admin-a', { tab: 'tracking', returnPending: true });
  saveAdminReturn(s, 'admin-a', { returnPending: false });
  expect(getAdminResumePath(s, 'admin-a')).toBe(null);
});

test('invalid stored destinations cannot become resume routes', () => {
  const s = storage();
  s.setItem('admin-return:admin-a', JSON.stringify({ tab: 'https://example.com', returnPending: true }));
  expect(getAdminResumePath(s, 'admin-a')).toBe(null);
});