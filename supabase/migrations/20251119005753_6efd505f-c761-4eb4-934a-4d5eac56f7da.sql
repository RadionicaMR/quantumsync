-- Fix affiliate registration to require authentication
-- This prevents unlimited fake affiliate account creation

DROP POLICY IF EXISTS "Anyone can insert affiliate (for registration)" ON public.affiliates;

CREATE POLICY "Authenticated users can register as affiliate"
ON public.affiliates
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND
  user_id IS NOT NULL
);

-- Add policy comment for documentation
COMMENT ON POLICY "Authenticated users can register as affiliate" ON public.affiliates IS 
'Requires authentication and validates that user_id matches the authenticated user to prevent fake affiliate creation';
