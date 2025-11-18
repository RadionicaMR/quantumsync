-- Update default commission rate from 30% to 50%
ALTER TABLE public.affiliates 
ALTER COLUMN commission_rate SET DEFAULT 50.00;

-- Update existing affiliates to 50% commission
UPDATE public.affiliates 
SET commission_rate = 50.00 
WHERE commission_rate = 30.00;