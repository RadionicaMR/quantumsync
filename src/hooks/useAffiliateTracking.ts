import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { setAffiliateCookie, getAffiliateCookie, getClientInfo } from '@/utils/affiliateTracking';

export const useAffiliateTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const trackAffiliateClick = async () => {
      // Check URL for ref parameter
      const urlParams = new URLSearchParams(window.location.search);
      const refCode = urlParams.get('ref');

      if (refCode) {
        // Save to cookie
        setAffiliateCookie(refCode);

        // Get affiliate by code
        const { data: affiliate } = await supabase
          .from('affiliates')
          .select('id')
          .eq('affiliate_code', refCode)
          .eq('status', 'active')
          .maybeSingle();

        if (affiliate) {
          // Track the click
          const clientInfo = getClientInfo();
          
          await supabase.from('affiliate_clicks').insert({
            affiliate_id: affiliate.id,
            ip_address: undefined, // Will be captured server-side if needed
            ...clientInfo
          });

          // Update click count
          // Update click count
          const { data: currentAffiliate } = await supabase
            .from('affiliates')
            .select('total_clicks')
            .eq('id', affiliate.id)
            .single();

          if (currentAffiliate) {
            await supabase
              .from('affiliates')
              .update({ total_clicks: (currentAffiliate.total_clicks || 0) + 1 })
              .eq('id', affiliate.id);
          }
        }
      }
    };

    trackAffiliateClick();
  }, [location]);

  return {
    getAffiliateCode: getAffiliateCookie
  };
};
