
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  console.log('[ProtectedRoute] state', {
    loading,
    isAuthenticated,
    user,
    requireAdmin,
    path: location.pathname,
  });

  if (loading) {
    // Mostramos un spinner más atractivo mientras se verifica la autenticación
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
    // Redirigir al login si no está autenticado
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !user?.isAdmin) {
    // Redirigir al inicio si se requiere ser admin y el usuario no lo es
    return <Navigate to="/" replace />;
  }

  // Si está autenticado y cumple con los requisitos, mostrar el contenido protegido
  return <>{children}</>;
};

export default ProtectedRoute;
