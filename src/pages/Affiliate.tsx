
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import QuantumButton from '@/components/QuantumButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { getAffiliateByEmail } from '@/utils/affiliateStorage';
import { useToast } from '@/hooks/use-toast';

const Affiliate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleAffiliateLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const affiliate = getAffiliateByEmail(loginData.email);
      
      if (!affiliate) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se encontró un afiliado con este email",
        });
        setLoading(false);
        return;
      }

      if (affiliate.password !== loginData.password) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Contraseña incorrecta",
        });
        setLoading(false);
        return;
      }

      if (affiliate.status !== 'approved') {
        toast({
          variant: "destructive",
          title: "Cuenta no aprobada",
          description: "Tu cuenta de afiliado aún está pendiente de aprobación",
        });
        setLoading(false);
        return;
      }

      // Store affiliate session
      localStorage.setItem('affiliateSession', affiliate.email);
      
      toast({
        title: "Acceso exitoso",
        description: "Bienvenido a tu dashboard de afiliado",
      });
      
      navigate('/affiliate-dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al acceder al dashboard",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Programa de Afiliados</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <p className="mb-6 text-lg">
              Únete a nuestro programa de afiliados y gana comisiones refiriendo nuevos usuarios a QuantumSync.
            </p>
            
            <div className="bg-quantum-gradient-soft p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">Beneficios del Programa</h2>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  30% de comisión por cada venta
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Enlaces personalizados para tracking
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Dashboard con estadísticas en tiempo real
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Materiales de marketing exclusivos
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Soporte personalizado
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-xl shadow-lg border">
            <h3 className="text-xl font-semibold mb-4">¿Cómo funciona?</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 mt-1">1</div>
                <div>
                  <h4 className="font-medium">Regístrate</h4>
                  <p className="text-sm text-muted-foreground">Completa el formulario de registro y espera la aprobación</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 mt-1">2</div>
                <div>
                  <h4 className="font-medium">Promociona</h4>
                  <p className="text-sm text-muted-foreground">Usa tus enlaces personalizados para promover QuantumSync</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 mt-1">3</div>
                <div>
                  <h4 className="font-medium">Gana</h4>
                  <p className="text-sm text-muted-foreground">Recibe 30% de comisión por cada usuario que se registre</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center space-y-4">
          <QuantumButton 
            className="bg-quantum-primary text-white px-8 py-3 rounded-full mr-4"
            onClick={() => navigate('/affiliate-register')}
          >
            Aplicar como Afiliado
          </QuantumButton>
          
          <QuantumButton 
            className="bg-gray-500 text-white px-8 py-3 rounded-full"
            onClick={() => setShowLogin(!showLogin)}
          >
            {showLogin ? 'Ocultar Acceso' : 'Acceder al Dashboard'}
          </QuantumButton>
        </div>

        {showLogin && (
          <div className="mt-8 max-w-md mx-auto">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Acceso para Afiliados</h3>
              <form onSubmit={handleAffiliateLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email de Afiliado</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Accediendo...' : 'Acceder al Dashboard'}
                </Button>
              </form>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Affiliate;
