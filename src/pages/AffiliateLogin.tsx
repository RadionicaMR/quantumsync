import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const AffiliateLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) throw error;

      // Check if user is an affiliate
      const { data: affiliateData } = await supabase
        .from('affiliates')
        .select('id')
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (!affiliateData) {
        await supabase.auth.signOut();
        throw new Error('Esta cuenta no es una cuenta de afiliado');
      }

      toast({
        title: 'Inicio de sesión exitoso',
        description: 'Bienvenido a tu dashboard'
      });

      navigate('/affiliate-dashboard');
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error al iniciar sesión',
        description: error.message || 'Verifica tus credenciales'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Iniciar Sesión - Afiliados</h1>
            <p className="text-muted-foreground">
              Accede a tu dashboard de afiliado
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <Button variant="link" className="p-0" onClick={() => navigate('/affiliate-register')}>
                Regístrate aquí
              </Button>
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default AffiliateLogin;
