import { supabase } from '@/integrations/supabase/client';

// Archive rather than delete so previous sessions retain their patient reference.
export const archivePatient = (patientId: string, therapistEmail: string) =>
  supabase.from('patients').update({ archived: true })
    .eq('id', patientId).eq('therapist_id', therapistEmail).select('id').single();