
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAffiliateByEmail } from '@/utils/affiliateStorage';
import { useAffiliate } from '@/context/AffiliateContext';

interface AffiliateProtectedRouteProps {
  children: ReactNode;
}

const AffiliateProtectedRoute = ({ children }: AffiliateProtectedRouteProps) => {
  const navigate = useNavigate();
  const { currentAffiliate, setCurrentAffiliate } = useAffiliate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's a stored affiliate session
    const storedAffiliateEmail = localStorage.getItem('affiliateSession');
    
    if (storedAffiliateEmail) {
      const affiliate = getAffiliateByEmail(storedAffiliateEmail);
      if (affiliate && affiliate.status === 'approved') {
        setCurrentAffiliate(affiliate);
        setLoading(false);
        return;
      }
    }
    
    // No valid affiliate session, redirect to affiliate register
    navigate('/affiliate-register');
  }, [navigate, setCurrentAffiliate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return currentAffiliate ? <>{children}</> : null;
};

export default AffiliateProtectedRoute;
