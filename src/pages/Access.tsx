import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { LogIn, Loader2, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Access = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already authenticated and paid, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/diagnose', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: '¡Bienvenido de vuelta!',
          description: 'Acceso exitoso a QuantumSync',
        });
        navigate('/diagnose', { replace: true });
      } else {
        setError('Credenciales incorrectas. Verifica tu email y contraseña.');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          <Card className="p-8 bg-gradient-to-br from-card/90 to-card/70 border-purple-500/20">
            <div className="text-center mb-6">
              <div className="mx-auto w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                <Lock className="h-7 w-7 text-purple-400" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                Acceso a QuantumSync
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Ingresa con tu cuenta registrada para acceder a la plataforma
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  required
                  className="mt-1"
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    Iniciar Sesión
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                ¿Aún no has pagado? <button onClick={() => navigate('/purchase')} className="text-purple-400 hover:text-purple-300 underline">Adquirir membresía</button>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Access;
