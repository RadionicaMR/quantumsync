import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

// Generate a simple session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Simple hash function for IP privacy
const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
};

export type AnalyticsEventType = 'page_visit' | 'cta_click' | 'purchase_page' | 'payment_click';

interface TrackEventOptions {
  eventType: AnalyticsEventType;
  metadata?: Record<string, unknown>;
}

export const useAnalytics = () => {
  const trackEvent = useCallback(async ({ eventType, metadata = {} }: TrackEventOptions) => {
    try {
      const sessionId = getSessionId();
      
      await supabase.from('analytics_events').insert([{
        event_type: eventType,
        page_url: window.location.href,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        ip_hash: hashString(navigator.userAgent + (navigator.language || '')),
        session_id: sessionId,
        metadata: metadata as Json
      }]);
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }, []);

  const trackPageVisit = useCallback(() => {
    trackEvent({ eventType: 'page_visit' });
  }, [trackEvent]);

  const trackCtaClick = useCallback((buttonName?: string) => {
    trackEvent({ 
      eventType: 'cta_click',
      metadata: { button: buttonName || 'inicia_ahora' }
    });
  }, [trackEvent]);

  const trackPurchasePageVisit = useCallback(() => {
    trackEvent({ eventType: 'purchase_page' });
  }, [trackEvent]);

  const trackPaymentClick = useCallback((paymentMethod: string) => {
    trackEvent({ 
      eventType: 'payment_click',
      metadata: { payment_method: paymentMethod }
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageVisit,
    trackCtaClick,
    trackPurchasePageVisit,
    trackPaymentClick
  };
};

// Hook for automatic page visit tracking
export const usePageTracking = () => {
  const { trackPageVisit } = useAnalytics();
  
  useEffect(() => {
    trackPageVisit();
  }, [trackPageVisit]);
};
