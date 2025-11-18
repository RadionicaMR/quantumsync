import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { generateAffiliateCode } from '@/utils/affiliateTracking';
import { Loader2, Globe, CreditCard, DollarSign } from 'lucide-react';
import type { PaymentMethod } from '@/types/affiliate';

const AffiliateRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    paypal_email: '',
    mercadopago_alias: '',
    mercadopago_cvu: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Las contraseñas no coinciden'
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'La contraseña debe tener al menos 6 caracteres'
      });
      return;
    }

    // Validate at least one payment method is provided
    if (!formData.paypal_email && !formData.mercadopago_alias) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Debes proporcionar al menos un método de pago (PayPal o Mercado Pago)'
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/affiliate-dashboard`,
          data: {
            full_name: formData.name
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No se pudo crear el usuario');

      // 2. Generate affiliate code
      const affiliateCode = generateAffiliateCode(formData.name, formData.email);

      // 3. Determine primary payment method (prefer PayPal if provided)
      const primaryPaymentMethod: PaymentMethod = formData.paypal_email ? 'paypal' : 'mercadopago';

      // 4. Create affiliate record
      const { error: affiliateError } = await supabase
        .from('affiliates')
        .insert({
          user_id: authData.user.id,
          name: formData.name,
          email: formData.email,
          country: formData.country,
          payment_method: primaryPaymentMethod,
          paypal_email: formData.paypal_email || null,
          mercadopago_alias: formData.mercadopago_alias || null,
          mercadopago_cvu: formData.mercadopago_cvu || null,
          affiliate_code: affiliateCode,
          status: 'active'
        });

      if (affiliateError) throw affiliateError;

      toast({
        title: '¡Registro exitoso!',
        description: 'Tu cuenta de afiliado ha sido creada. Revisa tu email para confirmar.'
      });

      // Redirect to dashboard
      setTimeout(() => {
        navigate('/affiliate-dashboard');
      }, 2000);

    } catch (error: any) {
      console.error('Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error al registrar',
        description: error.message || 'No se pudo completar el registro'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Únete al Programa de Afiliados</h1>
            <p className="text-muted-foreground">
              Gana comisiones recomendando QuantumSync
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

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

            <div className="grid grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">
                <Globe className="inline w-4 h-4 mr-2" />
                País
              </Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Ej: Argentina, México, España"
                required
              />
            </div>

            <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Métodos de Pago
              </h3>
              <p className="text-xs text-muted-foreground">
                Completa al menos uno de los siguientes métodos para recibir tus comisiones
              </p>

              <div className="space-y-2">
                <Label htmlFor="paypal_email">
                  <DollarSign className="inline w-4 h-4 mr-2" />
                  Email de PayPal (Internacional)
                </Label>
                <Input
                  id="paypal_email"
                  type="email"
                  value={formData.paypal_email}
                  onChange={(e) => setFormData({ ...formData, paypal_email: e.target.value })}
                  placeholder="tu@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mercadopago_alias">
                  <DollarSign className="inline w-4 h-4 mr-2" />
                  Alias de Mercado Pago (Argentina)
                </Label>
                <Input
                  id="mercadopago_alias"
                  value={formData.mercadopago_alias}
                  onChange={(e) => setFormData({ ...formData, mercadopago_alias: e.target.value })}
                  placeholder="tu.alias.mp"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mercadopago_cvu">CVU de Mercado Pago (opcional)</Label>
                <Input
                  id="mercadopago_cvu"
                  value={formData.mercadopago_cvu}
                  onChange={(e) => setFormData({ ...formData, mercadopago_cvu: e.target.value })}
                  placeholder="0000003100000000000000"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                'Crear cuenta de afiliado'
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Beneficios del programa:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>✓ 50% de comisión en cada venta</li>
              <li>✓ Trackeo de 30 días por cookie</li>
              <li>✓ Dashboard completo con estadísticas</li>
              <li>✓ Pagos automáticos mensuales</li>
            </ul>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default AffiliateRegister;
