import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import SalesByPeriodChart from '@/components/admin/reports/SalesByPeriodChart';
import TopAffiliatesChart from '@/components/admin/reports/TopAffiliatesChart';
import TopProductsChart from '@/components/admin/reports/TopProductsChart';
import ReportsSummary from '@/components/admin/reports/ReportsSummary';

const AdminReports = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [affiliatesData, setAffiliatesData] = useState<any[]>([]);

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = async () => {
    try {
      setLoading(true);

      // Get all sales with affiliate info
      const { data: sales, error: salesError } = await supabase
        .from('affiliate_sales')
        .select(`
          *,
          affiliates (
            name,
            email,
            affiliate_code
          )
        `)
        .order('created_at', { ascending: false });

      if (salesError) throw salesError;

      // Get all affiliates
      const { data: affiliates, error: affiliatesError } = await supabase
        .from('affiliates')
        .select('*')
        .order('total_commissions', { ascending: false });

      if (affiliatesError) throw affiliatesError;

      setSalesData(sales || []);
      setAffiliatesData(affiliates || []);
    } catch (error) {
      console.error('Error loading reports data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de reportes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    try {
      const exportData = salesData.map(sale => ({
        'Fecha': new Date(sale.created_at).toLocaleDateString(),
        'Afiliado': sale.affiliates?.name || 'N/A',
        'Email Afiliado': sale.affiliates?.email || 'N/A',
        'Código': sale.affiliates?.affiliate_code || 'N/A',
        'Cliente': sale.customer_name || 'N/A',
        'Email Cliente': sale.customer_email,
        'Monto Venta': sale.sale_amount,
        'Moneda': sale.currency,
        'Comisión': sale.commission_amount,
        'Estado Comisión': sale.commission_status,
        'Método Pago': sale.payment_method,
        'Notas': sale.notes || ''
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Ventas');

      // Add affiliates sheet
      const affiliatesExport = affiliatesData.map(aff => ({
        'Nombre': aff.name,
        'Email': aff.email,
        'Código': aff.affiliate_code,
        'Total Clicks': aff.total_clicks,
        'Total Ventas': aff.total_sales,
        'Comisiones Totales': aff.total_commissions,
        'Comisiones Pendientes': aff.pending_commissions,
        'Comisiones Pagadas': aff.paid_commissions,
        'Tasa Comisión': aff.commission_rate + '%',
        'Estado': aff.status
      }));

      const wsAff = XLSX.utils.json_to_sheet(affiliatesExport);
      XLSX.utils.book_append_sheet(wb, wsAff, 'Afiliados');

      XLSX.writeFile(wb, `reporte_afiliados_${new Date().toISOString().split('T')[0]}.xlsx`);

      toast({
        title: "Exportación exitosa",
        description: "El archivo Excel se ha descargado correctamente"
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast({
        title: "Error",
        description: "No se pudo exportar el archivo",
        variant: "destructive"
      });
    }
  };

  const exportToCSV = () => {
    try {
      const headers = ['Fecha', 'Afiliado', 'Email Afiliado', 'Código', 'Cliente', 'Email Cliente', 'Monto Venta', 'Moneda', 'Comisión', 'Estado Comisión', 'Método Pago', 'Notas'];
      
      const rows = salesData.map(sale => [
        new Date(sale.created_at).toLocaleDateString(),
        sale.affiliates?.name || 'N/A',
        sale.affiliates?.email || 'N/A',
        sale.affiliates?.affiliate_code || 'N/A',
        sale.customer_name || 'N/A',
        sale.customer_email,
        sale.sale_amount,
        sale.currency,
        sale.commission_amount,
        sale.commission_status,
        sale.payment_method,
        sale.notes || ''
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `reporte_ventas_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      toast({
        title: "Exportación exitosa",
        description: "El archivo CSV se ha descargado correctamente"
      });
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      toast({
        title: "Error",
        description: "No se pudo exportar el archivo",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Cargando reportes...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Reportes Avanzados</h1>
              <p className="text-muted-foreground">Análisis detallado de ventas y afiliados</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportToCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
            <Button onClick={exportToExcel}>
              <Download className="h-4 w-4 mr-2" />
              Exportar Excel
            </Button>
          </div>
        </div>

        <ReportsSummary salesData={salesData} affiliatesData={affiliatesData} />

        <Tabs defaultValue="sales" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sales">Ventas por Período</TabsTrigger>
            <TabsTrigger value="affiliates">Top Afiliados</TabsTrigger>
            <TabsTrigger value="products">Productos</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Ventas por Período</h2>
              <SalesByPeriodChart salesData={salesData} />
            </Card>
          </TabsContent>

          <TabsContent value="affiliates" className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Afiliados Más Exitosos</h2>
              <TopAffiliatesChart affiliatesData={affiliatesData} />
            </Card>
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Productos Más Vendidos</h2>
              <TopProductsChart salesData={salesData} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminReports;
