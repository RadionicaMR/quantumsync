import { useAffiliateTracking } from '@/hooks/useAffiliateTracking';

const AffiliateReferralBanner = () => {
  const { affiliateName } = useAffiliateTracking();

  console.log('[BANNER] Affiliate name from hook:', affiliateName);

  if (!affiliateName) {
    console.log('[BANNER] No affiliate name, banner will not render');
    return null;
  }

  console.log('[BANNER] Rendering banner for affiliate:', affiliateName);

  return (
    <div className="fixed top-16 md:top-20 right-4 z-[100] animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="bg-gradient-to-r from-purple-600/90 to-blue-500/90 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 shadow-lg">
        <p className="text-xs md:text-sm text-white font-medium">
          Referido por <span className="font-bold">{affiliateName}</span>
        </p>
      </div>
    </div>
  );
};

export default AffiliateReferralBanner;
