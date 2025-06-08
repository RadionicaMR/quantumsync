
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Affiliate } from '@/types/affiliate';
import { getAffiliateByEmail, trackAffiliateClick } from '@/utils/affiliateStorage';

interface AffiliateContextType {
  currentAffiliate: Affiliate | null;
  referralCode: string | null;
  setCurrentAffiliate: (affiliate: Affiliate | null) => void;
  trackClick: (page: string) => void;
  generateAffiliateLink: (path: string) => string;
}

const AffiliateContext = createContext<AffiliateContextType | undefined>(undefined);

export const AffiliateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentAffiliate, setCurrentAffiliate] = useState<Affiliate | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    // Check for referral code in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode) {
      setReferralCode(refCode);
      localStorage.setItem('referralCode', refCode);
      // Track the click
      trackAffiliateClick(refCode, window.location.pathname);
    } else {
      // Check if there's a stored referral code
      const storedRef = localStorage.getItem('referralCode');
      if (storedRef) {
        setReferralCode(storedRef);
      }
    }
  }, []);

  const trackClick = (page: string) => {
    if (referralCode) {
      trackAffiliateClick(referralCode, page);
    }
  };

  const generateAffiliateLink = (path: string): string => {
    if (!currentAffiliate) return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}${path}?ref=${currentAffiliate.affiliateCode}`;
  };

  return (
    <AffiliateContext.Provider value={{
      currentAffiliate,
      referralCode,
      setCurrentAffiliate,
      trackClick,
      generateAffiliateLink
    }}>
      {children}
    </AffiliateContext.Provider>
  );
};

export const useAffiliate = (): AffiliateContextType => {
  const context = useContext(AffiliateContext);
  if (context === undefined) {
    throw new Error('useAffiliate must be used within an AffiliateProvider');
  }
  return context;
};
