ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS whatsapp_phone text;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, whatsapp_phone, trial_start_date, has_paid)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    NULLIF(COALESCE(NEW.raw_user_meta_data->>'whatsapp_phone', ''), ''),
    now(),
    false
  );
  RETURN NEW;
END;
$function$;