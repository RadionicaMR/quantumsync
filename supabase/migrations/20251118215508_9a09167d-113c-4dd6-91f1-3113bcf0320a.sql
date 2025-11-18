-- Create enum for payment methods
CREATE TYPE payment_method AS ENUM ('paypal', 'mercadopago');

-- Create enum for commission status
CREATE TYPE commission_status AS ENUM ('pending', 'approved', 'paid');

-- Create affiliates table
CREATE TABLE public.affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  country TEXT NOT NULL,
  payment_method payment_method NOT NULL,
  paypal_email TEXT,
  mercadopago_alias TEXT,
  mercadopago_cvu TEXT,
  affiliate_code TEXT UNIQUE NOT NULL,
  commission_rate DECIMAL(5,2) DEFAULT 30.00,
  total_clicks INTEGER DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  total_commissions DECIMAL(10,2) DEFAULT 0.00,
  pending_commissions DECIMAL(10,2) DEFAULT 0.00,
  paid_commissions DECIMAL(10,2) DEFAULT 0.00,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create affiliate_clicks table
CREATE TABLE public.affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  page TEXT,
  converted BOOLEAN DEFAULT FALSE,
  conversion_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_usd DECIMAL(10,2),
  price_ars DECIMAL(10,2),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create affiliate_sales table
CREATE TABLE public.affiliate_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  sale_amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  commission_status commission_status DEFAULT 'pending',
  payment_method payment_method NOT NULL,
  transaction_id TEXT,
  payment_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create affiliate_payments table
CREATE TABLE public.affiliate_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method payment_method NOT NULL,
  status TEXT DEFAULT 'completed',
  admin_notes TEXT,
  paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create affiliate_settings table
CREATE TABLE public.affiliate_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default commission rate
INSERT INTO public.affiliate_settings (setting_key, setting_value)
VALUES ('global_commission_rate', '30.00');

-- Enable RLS
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for affiliates
CREATE POLICY "Affiliates can view own data"
  ON public.affiliates FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Affiliates can update own data"
  ON public.affiliates FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can insert affiliate (for registration)"
  ON public.affiliates FOR INSERT
  WITH CHECK (true);

-- RLS Policies for affiliate_clicks
CREATE POLICY "Public can insert clicks"
  ON public.affiliate_clicks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Affiliates can view own clicks"
  ON public.affiliate_clicks FOR SELECT
  USING (affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid()));

-- RLS Policies for products
CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (active = true);

-- RLS Policies for affiliate_sales
CREATE POLICY "Affiliates can view own sales"
  ON public.affiliate_sales FOR SELECT
  USING (affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid()));

CREATE POLICY "Public can insert sales"
  ON public.affiliate_sales FOR INSERT
  WITH CHECK (true);

-- RLS Policies for affiliate_payments
CREATE POLICY "Affiliates can view own payments"
  ON public.affiliate_payments FOR SELECT
  USING (affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid()));

-- RLS Policies for affiliate_settings
CREATE POLICY "Anyone can view settings"
  ON public.affiliate_settings FOR SELECT
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_affiliates_code ON public.affiliates(affiliate_code);
CREATE INDEX idx_affiliates_email ON public.affiliates(email);
CREATE INDEX idx_affiliate_clicks_affiliate ON public.affiliate_clicks(affiliate_id);
CREATE INDEX idx_affiliate_sales_affiliate ON public.affiliate_sales(affiliate_id);
CREATE INDEX idx_affiliate_sales_status ON public.affiliate_sales(commission_status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_affiliates_updated_at
  BEFORE UPDATE ON public.affiliates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some default products
INSERT INTO public.products (name, description, price_usd, price_ars, active)
VALUES 
  ('Plan Básico Mensual', 'Acceso completo a todas las funcionalidades durante 1 mes', 29.99, 29990.00, true),
  ('Plan Pro Mensual', 'Acceso premium con funciones avanzadas durante 1 mes', 49.99, 49990.00, true),
  ('Plan Anual', 'Acceso completo durante 1 año con descuento', 299.99, 299990.00, true);