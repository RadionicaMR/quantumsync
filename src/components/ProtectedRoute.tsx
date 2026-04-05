
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTrialStatus } from '@/hooks/useTrialStatus';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requirePaid?: boolean; // For manifestation - requires paid access
}

const ProtectedRoute = ({ children, requireAdmin = false, requirePaid = false }: ProtectedRouteProps) => {
  const { user, loading, isAuthenticated } = useAuth();
  const { isLoading: trialLoading, hasPaid, isTrialActive, isTrialExpired } = useTrialStatus();
  const location = useLocation();

  if (loading || trialLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-black">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto" />
          <p className="mt-4 text-purple-300">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Admin users bypass all trial restrictions
  if (user?.isAdmin) {
    return <>{children}</>;
  }

  // Trial expired and not paid → redirect to trial expired page
  if (isTrialExpired) {
    return <Navigate to="/trial-expired" replace />;
  }

  // Manifestation requires paid access (not available during trial)
  if (requirePaid && !hasPaid) {
    return <Navigate to="/purchase" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
