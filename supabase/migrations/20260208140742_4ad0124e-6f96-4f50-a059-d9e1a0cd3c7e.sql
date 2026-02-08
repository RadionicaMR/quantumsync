
-- Fix 1: Drop the overly permissive public SELECT policy that exposes payment info
DROP POLICY IF EXISTS "Anyone can view affiliate name by code" ON public.affiliates;

-- Create a secure function to look up affiliate name by code (only exposes name + code)
CREATE OR REPLACE FUNCTION public.get_affiliate_name_by_code(_code text)
RETURNS TABLE(name text, affiliate_code text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT a.name, a.affiliate_code
  FROM public.affiliates a
  WHERE a.affiliate_code = _code
    AND a.status = 'active'
  LIMIT 1;
$$;

-- Fix 2: Allow authenticated users to insert affiliate_sales (needed for edge function with service role)
-- Actually the edge function will use service role key, so no RLS change needed for that.
-- But we need to allow the track-affiliate-sale edge function to work.
-- The edge function will use SUPABASE_SERVICE_ROLE_KEY which bypasses RLS.
