import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { setAffiliateCookie, getAffiliateCookie, getClientInfo } from '@/utils/affiliateTracking';

export const useAffiliateTracking = () => {
  const location = useLocation();
  const [affiliateName, setAffiliateName] = useState<string | null>(null);

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

          // Update click count and get affiliate name
          const { data: currentAffiliate } = await supabase
            .from('affiliates')
            .select('total_clicks, name')
            .eq('id', affiliate.id)
            .single();

          if (currentAffiliate) {
            await supabase
              .from('affiliates')
              .update({ total_clicks: (currentAffiliate.total_clicks || 0) + 1 })
              .eq('id', affiliate.id);
            
            setAffiliateName(currentAffiliate.name);
          }
        }
      }
      
      // Check if there's already an affiliate cookie and get the name
      const existingRefCode = getAffiliateCookie();
      if (existingRefCode && !affiliateName) {
        const { data: affiliate } = await supabase
          .from('affiliates')
          .select('name')
          .eq('affiliate_code', existingRefCode)
          .eq('status', 'active')
          .maybeSingle();
        
        if (affiliate) {
          setAffiliateName(affiliate.name);
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
