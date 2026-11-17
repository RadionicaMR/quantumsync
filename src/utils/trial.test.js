import { expect, test } from 'bun:test';
import { TRIAL_DAYS, getTrialEndDate } from './trial';

test('the free trial lasts exactly three days and expires after 72 hours', () => {
  const start = new Date('2026-11-17T17:31:00Z');
  const end = getTrialEndDate(start);
  expect(TRIAL_DAYS).toBe(3);
  expect(end.toISOString()).toBe('2026-11-20T17:31:00.000Z');
  expect(new Date('2026-11-20T17:30:59Z') < end).toBe(true);
  expect(new Date('2026-11-20T17:31:00Z') < end).toBe(false);
  expect(Math.ceil((end.getTime() - start.getTime()) / 86400000)).toBe(3);
});