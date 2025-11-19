import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { setAffiliateCookie, getAffiliateCookie, getClientInfo } from '@/utils/affiliateTracking';

export const useAffiliateTracking = () => {
  const location = useLocation();
  const [affiliateName, setAffiliateName] = useState<string | null>(null);

  useEffect(() => {
    const trackAffiliateClick = async () => {
      console.log('[AFFILIATE TRACKING] Starting affiliate tracking...');
      
      // Check URL for ref parameter first
      const urlParams = new URLSearchParams(window.location.search);
      const urlRefCode = urlParams.get('ref');
      console.log('[AFFILIATE TRACKING] URL ref code:', urlRefCode);
      
      let refCodeToUse = urlRefCode;
      let shouldTrackClick = false;

      if (urlRefCode) {
        // Save to cookie if coming from URL
        console.log('[AFFILIATE TRACKING] Saving ref code to cookie:', urlRefCode);
        setAffiliateCookie(urlRefCode);
        shouldTrackClick = true;
      } else {
        // Check existing cookie
        refCodeToUse = getAffiliateCookie();
        console.log('[AFFILIATE TRACKING] Ref code from cookie:', refCodeToUse);
      }

      // If we have a ref code (from URL or cookie), get affiliate info
      if (refCodeToUse) {
        console.log('[AFFILIATE TRACKING] Looking up affiliate with code:', refCodeToUse);
        const { data: affiliate, error } = await supabase
          .from('affiliates')
          .select('id, name')
          .eq('affiliate_code', refCodeToUse)
          .eq('status', 'active')
          .maybeSingle();

        console.log('[AFFILIATE TRACKING] Affiliate lookup result:', { affiliate, error });

        if (affiliate) {
          // Set the affiliate name
          console.log('[AFFILIATE TRACKING] Setting affiliate name:', affiliate.name);
          setAffiliateName(affiliate.name);

          // Only track click if this is a new visit from URL
          if (shouldTrackClick) {
            console.log('[AFFILIATE TRACKING] Tracking new click for affiliate:', affiliate.id);
            const clientInfo = getClientInfo();
            
            await supabase.from('affiliate_clicks').insert({
              affiliate_id: affiliate.id,
              ip_address: undefined,
              ...clientInfo
            });

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
        } else {
          console.log('[AFFILIATE TRACKING] No affiliate found or error occurred');
        }
      } else {
        console.log('[AFFILIATE TRACKING] No ref code found in URL or cookie');
      }
    };

    trackAffiliateClick();
  }, [location]);

  return {
    getAffiliateCode: getAffiliateCookie,
    affiliateName
  };
};
