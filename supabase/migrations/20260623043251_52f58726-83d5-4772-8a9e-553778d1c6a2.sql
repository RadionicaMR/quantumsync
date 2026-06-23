CREATE INDEX IF NOT EXISTS idx_sessions_therapist_created_at ON public.sessions (therapist_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_therapist_patient ON public.sessions (therapist_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_patients_therapist_id ON public.patients (therapist_id);
CREATE INDEX IF NOT EXISTS idx_patients_therapist_name ON public.patients (therapist_id, name);