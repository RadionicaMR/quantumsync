import { expect, test, mock } from 'bun:test';

test('removing a patient archives only the selected therapist-owned record, preserving sessions', async () => {
  const calls = [];
  const query = {
    update: (value) => { calls.push(value); return query; },
    eq: (key, value) => { calls.push([key, value]); return query; },
    select: () => query,
    single: async () => ({ data: { id: 'patient-to-remove' }, error: null }),
  };
  mock.module('@/integrations/supabase/client', () => ({
    supabase: { from: (table) => { calls.push(table); return query; } },
  }));
  const { archivePatient } = await import('./patientArchive');
  await archivePatient('patient-to-remove', 'therapist@example.test');
  expect(calls).toEqual(['patients', { archived: true }, ['id', 'patient-to-remove'], ['therapist_id', 'therapist@example.test']]);
});