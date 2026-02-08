
DROP FUNCTION IF EXISTS public.get_affiliate_name_by_code(text);

CREATE OR REPLACE FUNCTION public.get_affiliate_name_by_code(_code text)
RETURNS TABLE(id uuid, name text, affiliate_code text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT a.id, a.name, a.affiliate_code
  FROM public.affiliates a
  WHERE a.affiliate_code = _code
    AND a.status = 'active'
  LIMIT 1;
$$;
