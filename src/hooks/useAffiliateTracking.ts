import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { setAffiliateCookie, getAffiliateCookie, getClientInfo } from '@/utils/affiliateTracking';

export const useAffiliateTracking = () => {
  const location = useLocation();
  const [affiliateName, setAffiliateName] = useState<string | null>(null);

  useEffect(() => {
    const trackAffiliateClick = async () => {
      // Check URL for ref parameter first
      const urlParams = new URLSearchParams(window.location.search);
      const urlRefCode = urlParams.get('ref');
      
      let refCodeToUse = urlRefCode;
      let shouldTrackClick = false;

      if (urlRefCode) {
        // Save to cookie if coming from URL
        setAffiliateCookie(urlRefCode);
        shouldTrackClick = true;
      } else {
        // Check existing cookie
        refCodeToUse = getAffiliateCookie();
      }

      // If we have a ref code (from URL or cookie), get affiliate info
      if (refCodeToUse) {
        const { data: affiliate } = await supabase
          .from('affiliates')
          .select('id, name')
          .eq('affiliate_code', refCodeToUse)
          .eq('status', 'active')
          .maybeSingle();

        if (affiliate) {
          // Set the affiliate name
          setAffiliateName(affiliate.name);

          // Only track click if this is a new visit from URL
          if (shouldTrackClick) {
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
        }
      }
    };

    trackAffiliateClick();
  }, [location]);

  return {
    getAffiliateCode: getAffiliateCookie,
    affiliateName
  };
};
