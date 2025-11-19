-- Add RLS policy to allow admins to delete affiliates
CREATE POLICY "Admins can delete affiliates"
ON public.affiliates
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));