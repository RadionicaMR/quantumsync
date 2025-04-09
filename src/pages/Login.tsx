
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import PasswordRecoveryForm from '@/components/auth/PasswordRecoveryForm';
import AuthCard from '@/components/auth/AuthCard';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [showRecovery, setShowRecovery] = useState(false);

  // Redirigir si ya está autenticado
  if (isAuthenticated) {
    // Redirigir a admin si es administrador, de lo contrario al diagnóstico
    if (user?.isAdmin) {
      navigate('/admin');
    } else {
      navigate('/diagnose');
    }
    return null;
  }

  const toggleRecoveryMode = () => {
    setShowRecovery(!showRecovery);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[80vh]">
        <AuthCard>
          {showRecovery ? (
            <PasswordRecoveryForm onBack={toggleRecoveryMode} />
          ) : (
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-1 mb-6">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <LoginForm onToggleRecovery={toggleRecoveryMode} />
              </TabsContent>
            </Tabs>
          )}
        </AuthCard>
      </div>
    </Layout>
  );
};

export default Login;
