
export interface Affiliate {
  id: string;
  name: string;
  email: string;
  password: string;
  affiliateCode: string;
  dateRegistered: string;
  status: 'pending' | 'approved' | 'rejected';
  commissionRate: number; // Porcentaje de comisión (ej: 50 para 50%)
  totalCommissions: number;
  totalSales: number;
  totalClicks: number;
}

export interface AffiliateRegistrationForm {
  name: string;
  email: string;
  password: string;
  phone?: string;
  website?: string;
  experience?: string;
}

export interface AffiliateSale {
  id: string;
  affiliateCode: string;
  userEmail: string;
  userName: string;
  saleDate: string;
  saleAmount: number; // Monto de la venta
  currency: 'USD' | 'ARS'; // Moneda de la venta
  commissionAmount: number;
  commissionCurrency: 'USD' | 'ARS'; // Moneda de la comisión
  status: 'pending' | 'paid';
  paymentDate?: string; // Fecha de pago de la comisión
  notes?: string; // Notas adicionales
}

export interface AffiliateClick {
  id: string;
  affiliateCode: string;
  timestamp: string;
  page: string;
  ip?: string;
  userAgent?: string;
  referrer?: string;
  converted: boolean;
  conversionDate?: string;
}

export interface AffiliateStats {
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  totalCommissions: number;
  pendingCommissions: number;
  paidCommissions: number;
  totalSalesUSD: number;
  totalSalesARS: number;
  averageOrderValue: number;
  clicksThisMonth: number;
  salesThisMonth: number;
  commissionsThisMonth: number;
}

export interface AffiliateDetailedStats extends AffiliateStats {
  affiliate: Affiliate;
  recentSales: AffiliateSale[];
  monthlyStats: {
    month: string;
    clicks: number;
    sales: number;
    commissions: number;
  }[];
}
