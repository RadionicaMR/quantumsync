-- Add trial and payment fields to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS trial_start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS has_paid BOOLEAN DEFAULT false;

-- Update existing profiles to have trial_start_date set to their created_at
UPDATE public.profiles SET trial_start_date = created_at WHERE trial_start_date IS NULL;

-- Ensure the handle_new_user function sets trial_start_date
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, trial_start_date, has_paid)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    now(),
    false
  );
  RETURN NEW;
END;
$function$;