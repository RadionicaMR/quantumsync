
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  MousePointer,
  UserCheck,
  Clock,
  Target
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const AffiliateGlobalStats = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data: affiliates } = await supabase.from('affiliates').select('*');
      const { data: sales } = await supabase.from('affiliate_sales').select('*');
      
      const activeAffiliates = affiliates?.filter(a => a.status === 'active').length || 0;
      const pendingAffiliates = affiliates?.filter(a => a.status !== 'active').length || 0;
      
      const totalClicks = affiliates?.reduce((sum, a) => sum + (a.total_clicks || 0), 0) || 0;
      const totalSalesCount = sales?.length || 0;
      const totalRevenue = sales?.reduce((sum, s) => sum + (s.sale_amount || 0), 0) || 0;
      
      const totalCommissionsPaid = sales
        ?.filter(s => s.commission_status === 'paid')
        .reduce((sum, s) => sum + (s.commission_amount || 0), 0) || 0;
      
      const totalCommissionsPending = sales
        ?.filter(s => s.commission_status === 'pending')
        .reduce((sum, s) => sum + (s.commission_amount || 0), 0) || 0;
      
      const conversionRate = totalClicks > 0 ? (totalSalesCount / totalClicks) * 100 : 0;
      
      setStats({
        totalAffiliates: affiliates?.length || 0,
        activeAffiliates,
        pendingAffiliates,
        totalClicks,
        totalSales: totalSalesCount,
        totalRevenue,
        totalCommissionsPaid,
        totalCommissionsPending,
        conversionRate
      });
    } catch (error) {
      console.error('Error loading affiliate stats:', error);
      // Set default values on error
      setStats({
        totalAffiliates: 0,
        activeAffiliates: 0,
        pendingAffiliates: 0,
        totalClicks: 0,
        totalSales: 0,
        totalRevenue: 0,
        totalCommissionsPaid: 0,
        totalCommissionsPending: 0,
        conversionRate: 0
      });
    }
  };

  if (!stats) return <div>Cargando...</div>;

  const statCards = [
    {
      title: 'Total Afiliados',
      value: stats.totalAffiliates,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Afiliados Activos',
      value: stats.activeAffiliates,
      icon: UserCheck,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pendientes Aprobación',
      value: stats.pendingAffiliates,
      icon: Clock,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Total Ventas',
      value: stats.totalSales,
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Ingresos Totales',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Comisiones Pagadas',
      value: `$${stats.totalCommissionsPaid.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Comisiones Pendientes',
      value: `$${stats.totalCommissionsPending.toFixed(2)}`,
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Tasa de Conversión',
      value: `${stats.conversionRate.toFixed(2)}%`,
      icon: Target,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Estadísticas Globales del Programa de Afiliados</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Resumen de Performance
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Clicks Totales:</span>
              <Badge variant="outline">{stats.totalClicks}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Conversión Promedio:</span>
              <Badge variant={stats.conversionRate > 2 ? "default" : "secondary"}>
                {stats.conversionRate.toFixed(2)}%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Ingresos por Afiliado:</span>
              <Badge variant="outline">
                ${stats.activeAffiliates > 0 ? (stats.totalRevenue / stats.activeAffiliates).toFixed(2) : '0.00'}
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            Estado de Comisiones
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Total Generado:</span>
              <Badge className="bg-green-100 text-green-800">
                ${(stats.totalCommissionsPaid + stats.totalCommissionsPending).toFixed(2)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Pendiente de Pago:</span>
              <Badge variant={stats.totalCommissionsPending > 0 ? "destructive" : "outline"}>
                ${stats.totalCommissionsPending.toFixed(2)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>% Pagado:</span>
              <Badge variant="default">
                {((stats.totalCommissionsPaid / (stats.totalCommissionsPaid + stats.totalCommissionsPending)) * 100 || 0).toFixed(1)}%
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AffiliateGlobalStats;
