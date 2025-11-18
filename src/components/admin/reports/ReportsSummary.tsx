import { Card } from '@/components/ui/card';
import { DollarSign, TrendingUp, Users, ShoppingCart } from 'lucide-react';

interface ReportsSummaryProps {
  salesData: any[];
  affiliatesData: any[];
}

const ReportsSummary = ({ salesData, affiliatesData }: ReportsSummaryProps) => {
  const totalRevenue = salesData.reduce((sum, sale) => sum + sale.sale_amount, 0);
  const totalCommissions = salesData.reduce((sum, sale) => sum + sale.commission_amount, 0);
  const activeAffiliates = affiliatesData.filter(aff => aff.status === 'active').length;
  const avgSaleValue = salesData.length > 0 ? totalRevenue / salesData.length : 0;

  return (
    <div className="grid md:grid-cols-4 gap-4">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Ingresos Totales</p>
            <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
          </div>
          <DollarSign className="h-8 w-8 text-green-500" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Comisiones Totales</p>
            <p className="text-2xl font-bold">${totalCommissions.toFixed(2)}</p>
          </div>
          <TrendingUp className="h-8 w-8 text-blue-500" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Afiliados Activos</p>
            <p className="text-2xl font-bold">{activeAffiliates}</p>
          </div>
          <Users className="h-8 w-8 text-purple-500" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Valor Prom. Venta</p>
            <p className="text-2xl font-bold">${avgSaleValue.toFixed(2)}</p>
          </div>
          <ShoppingCart className="h-8 w-8 text-orange-500" />
        </div>
      </Card>
    </div>
  );
};

export default ReportsSummary;
