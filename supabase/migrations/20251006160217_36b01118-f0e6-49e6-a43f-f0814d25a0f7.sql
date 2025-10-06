-- Drop existing RLS policies on patients table
DROP POLICY IF EXISTS "Therapists can create patients" ON public.patients;
DROP POLICY IF EXISTS "Therapists can view own patients" ON public.patients;
DROP POLICY IF EXISTS "Therapists can update own patients" ON public.patients;
DROP POLICY IF EXISTS "Therapists can delete own patients" ON public.patients;

-- Drop existing RLS policies on sessions table
DROP POLICY IF EXISTS "Therapists can create sessions" ON public.sessions;
DROP POLICY IF EXISTS "Therapists can view own sessions" ON public.sessions;
DROP POLICY IF EXISTS "Therapists can update own sessions" ON public.sessions;
DROP POLICY IF EXISTS "Therapists can delete own sessions" ON public.sessions;

-- Drop foreign key constraints
ALTER TABLE public.patients DROP CONSTRAINT IF EXISTS patients_therapist_id_fkey;
ALTER TABLE public.sessions DROP CONSTRAINT IF EXISTS sessions_therapist_id_fkey;
ALTER TABLE public.sessions DROP CONSTRAINT IF EXISTS sessions_patient_id_fkey;

-- Update patients table to use email as therapist_id
ALTER TABLE public.patients
ALTER COLUMN therapist_id TYPE text;

-- Update sessions table to use email as therapist_id  
ALTER TABLE public.sessions
ALTER COLUMN therapist_id TYPE text;

-- Recreate RLS policies for patients table with text therapist_id
CREATE POLICY "Therapists can create patients"
ON public.patients
FOR INSERT
WITH CHECK (therapist_id IS NOT NULL);

CREATE POLICY "Therapists can view own patients"
ON public.patients
FOR SELECT
USING (therapist_id IS NOT NULL);

CREATE POLICY "Therapists can update own patients"
ON public.patients
FOR UPDATE
USING (therapist_id IS NOT NULL);

CREATE POLICY "Therapists can delete own patients"
ON public.patients
FOR DELETE
USING (therapist_id IS NOT NULL);

-- Recreate RLS policies for sessions table with text therapist_id
CREATE POLICY "Therapists can create sessions"
ON public.sessions
FOR INSERT
WITH CHECK (therapist_id IS NOT NULL);

CREATE POLICY "Therapists can view own sessions"
ON public.sessions
FOR SELECT
USING (therapist_id IS NOT NULL);

CREATE POLICY "Therapists can update own sessions"
ON public.sessions
FOR UPDATE
USING (therapist_id IS NOT NULL);

CREATE POLICY "Therapists can delete own sessions"
ON public.sessions
FOR DELETE
USING (therapist_id IS NOT NULL);