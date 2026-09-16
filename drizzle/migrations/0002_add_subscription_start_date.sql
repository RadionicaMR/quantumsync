ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_start_date timestamptz;

UPDATE public.profiles
SET subscription_start_date = created_at
WHERE has_paid = true AND subscription_start_date IS NULL;