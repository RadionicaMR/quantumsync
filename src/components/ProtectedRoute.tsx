
import { ReactNode, useRef } from 'react';
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
  const { user, loading, roleLoading, isAuthenticated } = useAuth();
  const { isLoading: trialLoading, hasPaid, isTrialActive, isTrialExpired, isSubscriptionExpired } = useTrialStatus();
  const location = useLocation();
  // Once the page has been shown, never swap it for the spinner on background
  // re-checks (e.g. session refresh when returning to the tab). Unmounting the
  // page would stop any running treatment/manifestation.
  const shownRef = useRef(false);
  const busy = loading || roleLoading || trialLoading;

  if (busy && shownRef.current && isAuthenticated) {
    return <>{children}</>;
  }

  if (busy) {
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

  // Admin users (and the owner account) bypass all trial/subscription restrictions
  const isOwner = user?.email?.toLowerCase() === 'mauriramosgs@gmail.com';
  if (user?.isAdmin || isOwner) {
    shownRef.current = true;
    return <>{children}</>;
  }

  // Suscripción anual vencida (día 366+) → pantalla de renovación
  if (hasPaid && isSubscriptionExpired) {
    return <Navigate to="/subscription-expired" replace />;
  }

  // Trial expired and not paid → redirect to trial expired page
  if (isTrialExpired) {
    return <Navigate to="/trial-expired" replace />;
  }

  // Manifestation requires paid access (not available during trial)
  if (requirePaid && !hasPaid) {
    return <Navigate to="/purchase" replace />;
  }

  shownRef.current = true;
  return <>{children}</>;
};

export default ProtectedRoute;
