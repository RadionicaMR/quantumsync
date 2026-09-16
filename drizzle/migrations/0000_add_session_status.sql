ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'completa',
  ADD COLUMN IF NOT EXISTS actual_duration_seconds integer;