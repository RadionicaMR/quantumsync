import { expect, test } from 'bun:test';
import { getRemarketingStage, buildRemarketingMessage } from './remarketing';

const start = '2026-11-10T12:00:00Z';
const at = (h) => new Date(new Date(start).getTime() + h * 3600000);

test('stage follows hours left in the 3-day trial', () => {
  expect(getRemarketingStage(start, false, at(10))).toBe(null);
  expect(getRemarketingStage(start, false, at(30))).toBe('two_days');
  expect(getRemarketingStage(start, false, at(60))).toBe('one_day');
  expect(getRemarketingStage(start, false, at(80))).toBe('expired');
});

test('recontact starts after 7 days past trial end; paid users get none', () => {
  expect(getRemarketingStage(start, false, at(72 + 7 * 24))).toBe('expired');
  expect(getRemarketingStage(start, false, at(72 + 7 * 24 + 1))).toBe('recontact');
  expect(getRemarketingStage(start, true, at(80))).toBe(null);
});

test('promo messages quote 97 USD against 129 USD', () => {
  for (const s of ['two_days', 'one_day', 'expired', 'recontact']) {
    const m = buildRemarketingMessage(s, 'Ana Pérez');
    expect(m).toContain('$97 USD');
    expect(m).toContain('$129 USD');
    expect(m.startsWith('¡Hola Ana!')).toBe(true);
  }
});
