export type PaymentMethod = 'paypal' | 'mercadopago';
export type CommissionStatus = 'pending' | 'approved' | 'paid';

export interface Affiliate {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  country: string;
  payment_method: PaymentMethod;
  paypal_email?: string;
  mercadopago_alias?: string;
  mercadopago_cvu?: string;
  affiliate_code: string;
  commission_rate: number;
  total_clicks: number;
  total_sales: number;
  total_commissions: number;
  pending_commissions: number;
  paid_commissions: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AffiliateClick {
  id: string;
  affiliate_id: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  page: string;
  converted: boolean;
  conversion_date?: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price_usd?: number;
  price_ars?: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AffiliateSale {
  id: string;
  affiliate_id: string;
  product_id?: string;
  customer_email: string;
  customer_name?: string;
  sale_amount: number;
  currency: string;
  commission_amount: number;
  commission_status: CommissionStatus;
  payment_method: PaymentMethod;
  transaction_id?: string;
  payment_date?: string;
  notes?: string;
  created_at: string;
}

export interface AffiliatePayment {
  id: string;
  affiliate_id: string;
  amount: number;
  payment_method: PaymentMethod;
  status: string;
  admin_notes?: string;
  paid_at: string;
}

export interface AffiliateStats {
  total_clicks: number;
  total_sales: number;
  total_commissions: number;
  pending_commissions: number;
  paid_commissions: number;
  conversion_rate: number;
  recent_sales: AffiliateSale[];
}

export interface AffiliateRegistrationData {
  name: string;
  email: string;
  password: string;
  country: string;
  payment_method: PaymentMethod;
  paypal_email?: string;
  mercadopago_alias?: string;
  mercadopago_cvu?: string;
}
