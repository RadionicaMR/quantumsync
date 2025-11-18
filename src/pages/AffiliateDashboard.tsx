import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAffiliateTracking } from '@/hooks/useAffiliateTracking';
import { Copy, LogOut, TrendingUp, MousePointer, DollarSign, Users } from 'lucide-react';
import type { Affiliate, AffiliateSale, AffiliateStats } from '@/types/affiliate';

const AffiliateDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [loading, setLoading] = useState(true);

  useAffiliateTracking();

  useEffect(() => {
    loadAffiliateData();
  }, []);

  const loadAffiliateData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/affiliate-login');
        return;
      }

      // Get affiliate data
      const { data: affiliateData, error } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      setAffiliate(affiliateData);

      // Get sales
      const { data: sales } = await supabase
        .from('affiliate_sales')
        .select('*')
        .eq('affiliate_id', affiliateData.id)
        .order('created_at', { ascending: false })
        .limit(10);

      const conversionRate = affiliateData.total_clicks > 0
        ? (affiliateData.total_sales / affiliateData.total_clicks) * 100
        : 0;

      setStats({
        total_clicks: affiliateData.total_clicks,
        total_sales: affiliateData.total_sales,
        total_commissions: affiliateData.total_commissions,
        pending_commissions: affiliateData.pending_commissions,
        paid_commissions: affiliateData.paid_commissions,
        conversion_rate: conversionRate,
        recent_sales: sales || []
      });

    } catch (error: any) {
      console.error('Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar los datos'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyLink = (path: string = '') => {
    const link = `${window.location.origin}${path}?ref=${affiliate?.affiliate_code}`;
    navigator.clipboard.writeText(link);
    toast({
      title: 'Link copiado',
      description: 'El enlace de afiliado ha sido copiado al portapapeles'
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!affiliate) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">No se encontró cuenta de afiliado</h2>
            <Button onClick={() => navigate('/affiliate-register')}>
              Registrarse como afiliado
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard de Afiliado</h1>
            <p className="text-muted-foreground">Bienvenido, {affiliate.name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Clics totales</p>
                <p className="text-2xl font-bold">{stats?.total_clicks || 0}</p>
              </div>
              <MousePointer className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ventas</p>
                <p className="text-2xl font-bold">{stats?.total_sales || 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversión</p>
                <p className="text-2xl font-bold">{stats?.conversion_rate.toFixed(2)}%</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Comisiones</p>
                <p className="text-2xl font-bold">${stats?.total_commissions.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-500" />
            </div>
          </Card>
        </div>

        <Tabs defaultValue="links" className="space-y-4">
          <TabsList>
            <TabsTrigger value="links">Mis Enlaces</TabsTrigger>
            <TabsTrigger value="sales">Ventas</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="links">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Enlaces de Afiliado</h2>
              
              <div className="space-y-4">
                <div>
                  <Label>Código de afiliado</Label>
                  <div className="flex gap-2 mt-2">
                    <Input value={affiliate.affiliate_code} readOnly />
                    <Button onClick={() => copyLink()}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Link principal</Label>
                  <div className="flex gap-2 mt-2">
                    <Input value={`${window.location.origin}?ref=${affiliate.affiliate_code}`} readOnly />
                    <Button onClick={() => copyLink()}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Link a compra</Label>
                  <div className="flex gap-2 mt-2">
                    <Input value={`${window.location.origin}/purchase?ref=${affiliate.affiliate_code}`} readOnly />
                    <Button onClick={() => copyLink('/purchase')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="sales">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Historial de Ventas</h2>
              
              {stats?.recent_sales && stats.recent_sales.length > 0 ? (
                <div className="space-y-4">
                  {stats.recent_sales.map((sale: AffiliateSale) => (
                    <div key={sale.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{sale.customer_name || sale.customer_email}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(sale.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={
                          sale.commission_status === 'paid' ? 'default' :
                          sale.commission_status === 'approved' ? 'secondary' : 'outline'
                        }>
                          {sale.commission_status === 'paid' ? 'Pagada' :
                           sale.commission_status === 'approved' ? 'Aprobada' : 'Pendiente'}
                        </Badge>
                      </div>
                      <div className="mt-2 flex justify-between text-sm">
                        <span>Venta: ${sale.sale_amount.toFixed(2)} {sale.currency}</span>
                        <span className="font-semibold">Comisión: ${sale.commission_amount.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Aún no tienes ventas registradas
                </p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Información del Perfil</h2>
              
              <div className="space-y-4">
                <div>
                  <Label>Nombre</Label>
                  <Input value={affiliate.name} readOnly className="mt-2" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={affiliate.email} readOnly className="mt-2" />
                </div>
                <div>
                  <Label>País</Label>
                  <Input value={affiliate.country} readOnly className="mt-2" />
                </div>
                <div>
                  <Label>Método de pago</Label>
                  <Input 
                    value={affiliate.payment_method === 'paypal' ? 'PayPal' : 'Mercado Pago'} 
                    readOnly 
                    className="mt-2" 
                  />
                </div>
                {affiliate.payment_method === 'paypal' && affiliate.paypal_email && (
                  <div>
                    <Label>Email de PayPal</Label>
                    <Input value={affiliate.paypal_email} readOnly className="mt-2" />
                  </div>
                )}
                {affiliate.payment_method === 'mercadopago' && (
                  <>
                    {affiliate.mercadopago_alias && (
                      <div>
                        <Label>Alias de Mercado Pago</Label>
                        <Input value={affiliate.mercadopago_alias} readOnly className="mt-2" />
                      </div>
                    )}
                    {affiliate.mercadopago_cvu && (
                      <div>
                        <Label>CVU de Mercado Pago</Label>
                        <Input value={affiliate.mercadopago_cvu} readOnly className="mt-2" />
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AffiliateDashboard;
