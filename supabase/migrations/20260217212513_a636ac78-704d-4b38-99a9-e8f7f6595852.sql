
-- Usage events table for tracking all module interactions
CREATE TABLE public.usage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_hash text NOT NULL,
  event_type text NOT NULL, -- 'session_start', 'session_end', 'diagnosis_run'
  module text NOT NULL, -- 'treatment', 'manifestation', 'diagnosis', 'balance_chakras'
  protocol_name text,
  is_preset boolean DEFAULT false,
  configured_duration integer, -- in minutes
  configured_intensity numeric,
  actual_duration integer, -- in seconds
  frequency numeric,
  diagnosis_area text,
  diagnosis_result jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for fast queries
CREATE INDEX idx_usage_events_user_hash ON public.usage_events(user_hash);
CREATE INDEX idx_usage_events_module ON public.usage_events(module);
CREATE INDEX idx_usage_events_created_at ON public.usage_events(created_at);
CREATE INDEX idx_usage_events_event_type ON public.usage_events(event_type);

-- Enable RLS
ALTER TABLE public.usage_events ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (anonymous tracking)
CREATE POLICY "Anyone can insert usage events"
ON public.usage_events FOR INSERT
WITH CHECK (true);

-- Only admins can read
CREATE POLICY "Admins can view usage events"
ON public.usage_events FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Aggregated metrics table for pre-computed stats
CREATE TABLE public.aggregated_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_key text NOT NULL, -- e.g. 'monthly_sessions', 'top_protocols'
  metric_period text NOT NULL, -- 'daily', 'weekly', 'monthly'
  period_start date NOT NULL,
  period_end date NOT NULL,
  module text,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_aggregated_metrics_key ON public.aggregated_metrics(metric_key, metric_period);
CREATE INDEX idx_aggregated_metrics_period ON public.aggregated_metrics(period_start, period_end);

ALTER TABLE public.aggregated_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view aggregated metrics"
ON public.aggregated_metrics FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage aggregated metrics"
ON public.aggregated_metrics FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update aggregated metrics"
ON public.aggregated_metrics FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));
