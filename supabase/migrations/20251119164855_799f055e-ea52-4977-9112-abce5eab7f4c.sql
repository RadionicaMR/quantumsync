-- Allow anyone to view basic affiliate info (name) by affiliate_code for the referral banner
CREATE POLICY "Anyone can view affiliate name by code"
ON public.affiliates
FOR SELECT
TO public
USING (status = 'active');