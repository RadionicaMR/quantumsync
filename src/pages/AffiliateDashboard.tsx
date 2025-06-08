
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  MousePointerClick, 
  Copy, 
  ExternalLink,
  BarChart3,
  Calendar,
  LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useAffiliate } from '@/context/AffiliateContext';
import { getAffiliateStats, loadAffiliateSales } from '@/utils/affiliateStorage';
import { AffiliateSale } from '@/types/affiliate';

const AffiliateDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentAffiliate, generateAffiliateLink } = useAffiliate();
  const [stats, setStats] = useState({
    totalClicks: 0,
    totalConversions: 0,
    conversionRate: 0,
    totalCommissions: 0,
    pendingCommissions: 0,
    paidCommissions: 0
  });
  const [sales, setSales] = useState<AffiliateSale[]>([]);
  const [customPath, setCustomPath] = useState('/');

  useEffect(() => {
    if (currentAffiliate) {
      const affiliateStats = getAffiliateStats(currentAffiliate.affiliateCode);
      setStats(affiliateStats);
      
      const affiliateSales = loadAffiliateSales().filter(
        sale => sale.affiliateCode === currentAffiliate.affiliateCode
      );
      setSales(affiliateSales);
    }
  }, [currentAffiliate]);

  const handleLogout = () => {
    localStorage.removeItem('affiliateSession');
    navigate('/');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "¡Copiado!",
      description: "El enlace ha sido copiado al portapapeles",
    });
  };

  const generateLink = (path: string) => {
    return generateAffiliateLink(path);
  };

  if (!currentAffiliate) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">No autorizado</h1>
            <Button onClick={() => navigate('/affiliate-register')}>
              Ir al Registro de Afiliados
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard de Afiliado</h1>
            <p className="text-muted-foreground mt-1">
              Bienvenido, {currentAffiliate.name}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={currentAffiliate.status === 'approved' ? 'default' : 'secondary'}>
                {currentAffiliate.status === 'approved' ? 'Aprobado' : 'Pendiente'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Código: {currentAffiliate.affiliateCode}
              </span>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                  <p className="text-3xl font-bold">{stats.totalClicks}</p>
                </div>
                <MousePointerClick className="w-8 h-8 text-blue-500" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conversiones</p>
                  <p className="text-3xl font-bold">{stats.totalConversions}</p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tasa Conversión</p>
                  <p className="text-3xl font-bold">{stats.conversionRate.toFixed(1)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Comisiones</p>
                  <p className="text-3xl font-bold">${stats.totalCommissions}</p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-500" />
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="links" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="links">Enlaces de Afiliado</TabsTrigger>
            <TabsTrigger value="sales">Historial de Ventas</TabsTrigger>
            <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          </TabsList>

          <TabsContent value="links" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Generador de Enlaces</h3>
              
              {/* Pre-configured Links */}
              <div className="space-y-4 mb-6">
                <h4 className="font-medium">Enlaces Principales</h4>
                
                {[
                  { path: '/', label: 'Página Principal' },
                  { path: '/purchase', label: 'Página de Compra' },
                  { path: '/register', label: 'Registro de Usuario' },
                  { path: '/diagnose', label: 'Diagnóstico' }
                ].map((link) => (
                  <div key={link.path} className="flex items-center gap-2 p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{link.label}</p>
                      <p className="text-sm text-muted-foreground break-all">
                        {generateLink(link.path)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(generateLink(link.path))}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Custom Link Generator */}
              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Crear Enlace Personalizado</h4>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="customPath">Ruta personalizada</Label>
                    <Input
                      id="customPath"
                      value={customPath}
                      onChange={(e) => setCustomPath(e.target.value)}
                      placeholder="/ruta-personalizada"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={() => copyToClipboard(generateLink(customPath))}
                      disabled={!customPath}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar
                    </Button>
                  </div>
                </div>
                {customPath && (
                  <p className="text-sm text-muted-foreground mt-2 break-all">
                    Vista previa: {generateLink(customPath)}
                  </p>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Historial de Ventas</h3>
              
              {sales.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Aún no tienes ventas registradas
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sales.map((sale) => (
                    <div key={sale.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{sale.userName}</p>
                        <p className="text-sm text-muted-foreground">{sale.userEmail}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(sale.saleDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          +${sale.commissionAmount}
                        </p>
                        <Badge variant={sale.status === 'paid' ? 'default' : 'secondary'}>
                          {sale.status === 'paid' ? 'Pagado' : 'Pendiente'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Resumen de Comisiones</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Ganado:</span>
                    <span className="font-semibold">${stats.totalCommissions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pendiente:</span>
                    <span className="font-semibold text-yellow-600">${stats.pendingCommissions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pagado:</span>
                    <span className="font-semibold text-green-600">${stats.paidCommissions}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Rendimiento</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tasa de Comisión:</span>
                    <span className="font-semibold">{currentAffiliate.commissionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Clicks por Conversión:</span>
                    <span className="font-semibold">
                      {stats.totalConversions > 0 ? Math.round(stats.totalClicks / stats.totalConversions) : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor Promedio:</span>
                    <span className="font-semibold">
                      ${stats.totalConversions > 0 ? Math.round(stats.totalCommissions / stats.totalConversions) : 0}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AffiliateDashboard;
