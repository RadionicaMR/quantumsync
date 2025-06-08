
import { Affiliate, AffiliateSale, AffiliateClick } from "@/types/affiliate";

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
    commissionRate: 30, // 30% por defecto
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

export const addAffiliateSale = (affiliateCode: string, userEmail: string, userName: string): void => {
  const affiliate = getAffiliateByCode(affiliateCode);
  if (!affiliate || affiliate.status !== 'approved') return;
  
  const sales = loadAffiliateSales();
  const newSale: AffiliateSale = {
    id: Date.now().toString(),
    affiliateCode,
    userEmail,
    userName,
    saleDate: new Date().toISOString(),
    commissionAmount: 100 * (affiliate.commissionRate / 100), // Asumiendo precio base de $100
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
        totalCommissions: a.totalCommissions + newSale.commissionAmount
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

// Get affiliate stats
export const getAffiliateStats = (affiliateCode: string) => {
  const sales = loadAffiliateSales().filter(s => s.affiliateCode === affiliateCode);
  const clicks = loadAffiliateClicks().filter(c => c.affiliateCode === affiliateCode);
  
  const totalClicks = clicks.length;
  const totalConversions = sales.length;
  const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
  const totalCommissions = sales.reduce((sum, sale) => sum + sale.commissionAmount, 0);
  const pendingCommissions = sales.filter(s => s.status === 'pending').reduce((sum, sale) => sum + sale.commissionAmount, 0);
  const paidCommissions = sales.filter(s => s.status === 'paid').reduce((sum, sale) => sum + sale.commissionAmount, 0);
  
  return {
    totalClicks,
    totalConversions,
    conversionRate,
    totalCommissions,
    pendingCommissions,
    paidCommissions
  };
};
