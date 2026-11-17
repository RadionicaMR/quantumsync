import { expect, test } from 'bun:test';
import { getRemarketingStage, getClientRemarketingStage, buildRemarketingMessage, buildClientWhatsAppUrl, PROMO_PRICE, REGULAR_PRICE } from './remarketing';

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

test('annual promotional price is 97 USD', () => {
  expect(PROMO_PRICE).toBe(97);
});

test('regular annual price is 129 USD', () => {
  expect(REGULAR_PRICE).toBe(129);
});

const client = { whatsapp_phone: '+54 2945 581188', full_name: 'Ana Pérez', trial_start_date: start, created_at: start, has_paid: false };
test('WhatsApp link encodes the selected stage end to end', () => {
  for (const [hour, stage] of [[30, 'two_days'], [60, 'one_day'], [80, 'expired'], [300, 'recontact']]) {
    const url = new URL(buildClientWhatsAppUrl(client, at(hour)));
    expect(url.pathname).toBe('/542945581188');
    expect(url.searchParams.get('text')).toBe(buildRemarketingMessage(stage, client.full_name));
  }
});

test('first-day and legacy unpaid clients do not fall back to a generic greeting', () => {
  expect(new URL(buildClientWhatsAppUrl(client, at(10))).searchParams.get('text')).toBe(buildRemarketingMessage('two_days', client.full_name));
  expect(new URL(buildClientWhatsAppUrl({ ...client, trial_start_date: null }, at(300))).searchParams.get('text')).toBe(buildRemarketingMessage('recontact', client.full_name));
});

test('filters and messages share the client stage including legacy dates', () => {
  expect(getClientRemarketingStage(client, at(10))).toBe('two_days');
  expect(getClientRemarketingStage({ ...client, trial_start_date: null }, at(300))).toBe('recontact');
  expect(getClientRemarketingStage({ ...client, has_paid: true }, at(300))).toBe(null);
});
