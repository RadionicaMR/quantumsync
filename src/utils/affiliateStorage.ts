
import { Affiliate, AffiliateSale, AffiliateClick, AffiliateStats, AffiliateDetailedStats } from "@/types/affiliate";

// Generate unique affiliate code
export const generateAffiliateCode = (name: string, email: string): string => {
  const namePart = name.replace(/\s+/g, '').substring(0, 4).toUpperCase();
  const emailPart = email.split('@')[0].substring(0, 3).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${namePart}${emailPart}${randomPart}`;
};

// Load affiliates from localStorage
export const loadAffiliates = (): Affiliate[] => {
  const stored = localStorage.getItem('affiliatesList');
  return stored ? JSON.parse(stored) : [];
};

// Save affiliates to localStorage
export const saveAffiliates = (affiliates: Affiliate[]): void => {
  localStorage.setItem('affiliatesList', JSON.stringify(affiliates));
};

// Add new affiliate
export const addAffiliate = (affiliateData: {
  name: string;
  email: string;
  password: string;
}): Affiliate => {
  const affiliates = loadAffiliates();
  
  // Check if email already exists
  if (affiliates.some(a => a.email.toLowerCase() === affiliateData.email.toLowerCase())) {
    throw new Error('Este email ya está registrado como afiliado');
  }
  
  const newAffiliate: Affiliate = {
    id: Date.now().toString(),
    name: affiliateData.name,
    email: affiliateData.email,
    password: affiliateData.password,
    affiliateCode: generateAffiliateCode(affiliateData.name, affiliateData.email),
    dateRegistered: new Date().toISOString().split('T')[0],
    status: 'pending',
    commissionRate: 50, // 50% por defecto
    totalCommissions: 0,
    totalSales: 0,
    totalClicks: 0
  };
  
  const updatedAffiliates = [...affiliates, newAffiliate];
  saveAffiliates(updatedAffiliates);
  return newAffiliate;
};

// Update affiliate status
export const updateAffiliateStatus = (affiliateId: string, status: 'pending' | 'approved' | 'rejected'): void => {
  const affiliates = loadAffiliates();
  const updated = affiliates.map(a => 
    a.id === affiliateId ? { ...a, status } : a
  );
  saveAffiliates(updated);
};

// Update commission payment status
export const updateCommissionPayment = (saleId: string, status: 'paid' | 'pending', paymentDate?: string, notes?: string): void => {
  const sales = loadAffiliateSales();
  const updated = sales.map(s => 
    s.id === saleId ? { ...s, status, paymentDate, notes } : s
  );
  saveAffiliateSales(updated);
};

// Get affiliate by code
export const getAffiliateByCode = (code: string): Affiliate | null => {
  const affiliates = loadAffiliates();
  return affiliates.find(a => a.affiliateCode === code) || null;
};

// Get affiliate by email
export const getAffiliateByEmail = (email: string): Affiliate | null => {
  const affiliates = loadAffiliates();
  return affiliates.find(a => a.email.toLowerCase() === email.toLowerCase()) || null;
};

// Sales tracking
export const loadAffiliateSales = (): AffiliateSale[] => {
  const stored = localStorage.getItem('affiliateSales');
  return stored ? JSON.parse(stored) : [];
};

export const saveAffiliateSales = (sales: AffiliateSale[]): void => {
  localStorage.setItem('affiliateSales', JSON.stringify(sales));
};

export const addAffiliateSale = (
  affiliateCode: string, 
  userEmail: string, 
  userName: string, 
  saleAmount: number = 100, 
  currency: 'USD' | 'ARS' = 'USD'
): void => {
  const affiliate = getAffiliateByCode(affiliateCode);
  if (!affiliate || affiliate.status !== 'approved') return;
  
  const sales = loadAffiliateSales();
  const commissionAmount = saleAmount * (affiliate.commissionRate / 100);
  
  const newSale: AffiliateSale = {
    id: Date.now().toString(),
    affiliateCode,
    userEmail,
    userName,
    saleDate: new Date().toISOString(),
    saleAmount,
    currency,
    commissionAmount,
    commissionCurrency: currency,
    status: 'pending'
  };
  
  const updatedSales = [...sales, newSale];
  saveAffiliateSales(updatedSales);
  
  // Update affiliate stats
  const affiliates = loadAffiliates();
  const updated = affiliates.map(a => {
    if (a.affiliateCode === affiliateCode) {
      return {
        ...a,
        totalSales: a.totalSales + 1,
        totalCommissions: a.totalCommissions + commissionAmount
      };
    }
    return a;
  });
  saveAffiliates(updated);
};

// Click tracking
export const loadAffiliateClicks = (): AffiliateClick[] => {
  const stored = localStorage.getItem('affiliateClicks');
  return stored ? JSON.parse(stored) : [];
};

export const saveAffiliateClicks = (clicks: AffiliateClick[]): void => {
  localStorage.setItem('affiliateClicks', JSON.stringify(clicks));
};

export const trackAffiliateClick = (affiliateCode: string, page: string): void => {
  const affiliate = getAffiliateByCode(affiliateCode);
  if (!affiliate || affiliate.status !== 'approved') return;
  
  const clicks = loadAffiliateClicks();
  const newClick: AffiliateClick = {
    id: Date.now().toString(),
    affiliateCode,
    timestamp: new Date().toISOString(),
    page,
    userAgent: navigator.userAgent,
    referrer: document.referrer,
    converted: false
  };
  
  const updatedClicks = [...clicks, newClick];
  saveAffiliateClicks(updatedClicks);
  
  // Update affiliate click count
  const affiliates = loadAffiliates();
  const updated = affiliates.map(a => 
    a.affiliateCode === affiliateCode 
      ? { ...a, totalClicks: a.totalClicks + 1 }
      : a
  );
  saveAffiliates(updated);
};

// Get detailed affiliate stats
export const getAffiliateDetailedStats = (affiliateCode: string): AffiliateDetailedStats | null => {
  const affiliate = getAffiliateByCode(affiliateCode);
  if (!affiliate) return null;
  
  const sales = loadAffiliateSales().filter(s => s.affiliateCode === affiliateCode);
  const clicks = loadAffiliateClicks().filter(c => c.affiliateCode === affiliateCode);
  
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Filter current month data
  const thisMonthSales = sales.filter(s => {
    const saleDate = new Date(s.saleDate);
    return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
  });
  
  const thisMonthClicks = clicks.filter(c => {
    const clickDate = new Date(c.timestamp);
    return clickDate.getMonth() === currentMonth && clickDate.getFullYear() === currentYear;
  });
  
  const totalClicks = clicks.length;
  const totalConversions = sales.length;
  const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
  
  const totalCommissions = sales.reduce((sum, sale) => sum + sale.commissionAmount, 0);
  const pendingCommissions = sales.filter(s => s.status === 'pending').reduce((sum, sale) => sum + sale.commissionAmount, 0);
  const paidCommissions = sales.filter(s => s.status === 'paid').reduce((sum, sale) => sum + sale.commissionAmount, 0);
  
  const totalSalesUSD = sales.filter(s => s.currency === 'USD').reduce((sum, sale) => sum + sale.saleAmount, 0);
  const totalSalesARS = sales.filter(s => s.currency === 'ARS').reduce((sum, sale) => sum + sale.saleAmount, 0);
  
  const averageOrderValue = sales.length > 0 ? (totalSalesUSD + totalSalesARS) / sales.length : 0;
  
  // Generate monthly stats for the last 6 months
  const monthlyStats = [];
  for (let i = 5; i >= 0; i--) {
    const targetDate = new Date(currentYear, currentMonth - i, 1);
    const monthSales = sales.filter(s => {
      const saleDate = new Date(s.saleDate);
      return saleDate.getMonth() === targetDate.getMonth() && saleDate.getFullYear() === targetDate.getFullYear();
    });
    const monthClicks = clicks.filter(c => {
      const clickDate = new Date(c.timestamp);
      return clickDate.getMonth() === targetDate.getMonth() && clickDate.getFullYear() === targetDate.getFullYear();
    });
    
    monthlyStats.push({
      month: targetDate.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
      clicks: monthClicks.length,
      sales: monthSales.length,
      commissions: monthSales.reduce((sum, sale) => sum + sale.commissionAmount, 0)
    });
  }
  
  return {
    affiliate,
    recentSales: sales.slice(-10).reverse(), // Last 10 sales
    monthlyStats,
    totalClicks,
    totalConversions,
    conversionRate,
    totalCommissions,
    pendingCommissions,
    paidCommissions,
    totalSalesUSD,
    totalSalesARS,
    averageOrderValue,
    clicksThisMonth: thisMonthClicks.length,
    salesThisMonth: thisMonthSales.length,
    commissionsThisMonth: thisMonthSales.reduce((sum, sale) => sum + sale.commissionAmount, 0)
  };
};

// Get all affiliate sales for admin
export const getAllAffiliateSales = (): AffiliateSale[] => {
  return loadAffiliateSales();
};

// Get global affiliate statistics
export const getGlobalAffiliateStats = () => {
  const affiliates = loadAffiliates();
  const sales = loadAffiliateSales();
  const clicks = loadAffiliateClicks();
  
  const totalAffiliates = affiliates.length;
  const activeAffiliates = affiliates.filter(a => a.status === 'approved').length;
  const pendingAffiliates = affiliates.filter(a => a.status === 'pending').length;
  
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.saleAmount, 0);
  const totalCommissionsPaid = sales.filter(s => s.status === 'paid').reduce((sum, sale) => sum + sale.commissionAmount, 0);
  const totalCommissionsPending = sales.filter(s => s.status === 'pending').reduce((sum, sale) => sum + sale.commissionAmount, 0);
  
  const totalClicks = clicks.length;
  const conversionRate = totalClicks > 0 ? (totalSales / totalClicks) * 100 : 0;
  
  return {
    totalAffiliates,
    activeAffiliates,
    pendingAffiliates,
    totalSales,
    totalRevenue,
    totalCommissionsPaid,
    totalCommissionsPending,
    totalClicks,
    conversionRate
  };
};

// Legacy function for backward compatibility
export const getAffiliateStats = (affiliateCode: string) => {
  const detailed = getAffiliateDetailedStats(affiliateCode);
  if (!detailed) return null;
  
  return {
    totalClicks: detailed.totalClicks,
    totalConversions: detailed.totalConversions,
    conversionRate: detailed.conversionRate,
    totalCommissions: detailed.totalCommissions,
    pendingCommissions: detailed.pendingCommissions,
    paidCommissions: detailed.paidCommissions
  };
};
