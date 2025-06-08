
export interface Affiliate {
  id: string;
  name: string;
  email: string;
  password: string;
  affiliateCode: string;
  dateRegistered: string;
  status: 'pending' | 'approved' | 'rejected';
  commissionRate: number; // Porcentaje de comisión (ej: 30 para 30%)
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
  commissionAmount: number;
  status: 'pending' | 'paid';
}

export interface AffiliateClick {
  id: string;
  affiliateCode: string;
  timestamp: string;
  page: string;
  ip?: string;
  converted: boolean;
}

export interface AffiliateStats {
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  totalCommissions: number;
  pendingCommissions: number;
  paidCommissions: number;
}
