// Affiliate tracking utilities with cookie management

const COOKIE_NAME = 'affiliate_ref';
const COOKIE_EXPIRY_DAYS = 30;

/**
 * Sets a cookie with the affiliate reference code
 */
export const setAffiliateCookie = (affiliateCode: string): void => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS);
  
  document.cookie = `${COOKIE_NAME}=${affiliateCode};expires=${expiryDate.toUTCString()};path=/;SameSite=Lax`;
};

/**
 * Gets the affiliate reference code from cookie
 */
export const getAffiliateCookie = (): string | null => {
  const cookies = document.cookie.split(';');
  
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === COOKIE_NAME) {
      return value;
    }
  }
  
  return null;
};

/**
 * Clears the affiliate cookie
 */
export const clearAffiliateCookie = (): void => {
  document.cookie = `${COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

/**
 * Generates a unique affiliate code
 */
export const generateAffiliateCode = (name: string, email: string): string => {
  const namePart = name.replace(/\s+/g, '').substring(0, 4).toUpperCase();
  const emailPart = email.substring(0, 3).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  return `${namePart}${emailPart}${randomPart}`;
};

/**
 * Gets client information for tracking
 */
export const getClientInfo = () => {
  return {
    user_agent: navigator.userAgent,
    referrer: document.referrer || undefined,
    page: window.location.pathname
  };
};
