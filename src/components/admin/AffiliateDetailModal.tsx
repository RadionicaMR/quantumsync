
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { AffiliateDetailedStats, AffiliateSale } from '@/types/affiliate';
import { updateCommissionPayment } from '@/utils/affiliateStorage';
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign, 
  TrendingUp, 
  MousePointer, 
  Users, 
  Calendar,
  CheckCircle,
  Clock,
  Eye
} from 'lucide-react';

interface AffiliateDetailModalProps {
  affiliateStats: AffiliateDetailedStats | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const AffiliateDetailModal = ({ affiliateStats, isOpen, onClose, onUpdate }: AffiliateDetailModalProps) => {
  const { toast } = useToast();
  const [paymentNotes, setPaymentNotes] = useState('');
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);

  if (!affiliateStats) return null;

  const { affiliate } = affiliateStats;

  const handleMarkAsPaid = async (saleId: string) => {
    setProcessingPayment(saleId);
    try {
      const paymentDate = new Date().toISOString();
      updateCommissionPayment(saleId, 'paid', paymentDate, paymentNotes);
      onUpdate();
      
      toast({
        title: "Comisión marcada como pagada",
        description: "La comisión ha sido actualizada exitosamente",
      });
      
      setPaymentNotes('');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el estado de la comisión",
      });
    } finally {
      setProcessingPayment(null);
    }
  };

  const formatCurrency = (amount: number, currency: 'USD' | 'ARS') => {
    return `${currency === 'USD' ? '$' : '$'} ${amount.toFixed(2)} ${currency}`;
  };

  const getStatusBadge = (status: 'pending' | 'paid') => {
    return status === 'paid' ? (
      <Badge className="bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Pagado
      </Badge>
    ) : (
      <Badge variant="secondary">
        <Clock className="w-3 h-3 mr-1" />
        Pendiente
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Detalle del Afiliado: {affiliate.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <MousePointer className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Clicks</p>
                  <p className="text-2xl font-bold">{affiliateStats.totalClicks}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Ventas</p>
                  <p className="text-2xl font-bold">{affiliateStats.totalConversions}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Comisiones</p>
                  <p className="text-2xl font-bold">${affiliateStats.totalCommissions.toFixed(2)}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Conversión</p>
                  <p className="text-2xl font-bold">{affiliateStats.conversionRate.toFixed(1)}%</p>
                </div>
              </div>
            </Card>
          </div>

          <Tabs defaultValue="sales" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sales">Ventas y Comisiones</TabsTrigger>
              <TabsTrigger value="stats">Estadísticas</TabsTrigger>
              <TabsTrigger value="info">Información</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sales" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Historial de Ventas</h3>
                <div className="text-sm text-muted-foreground">
                  Pendiente: ${affiliateStats.pendingCommissions.toFixed(2)} | 
                  Pagado: ${affiliateStats.paidCommissions.toFixed(2)}
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Venta</TableHead>
                      <TableHead>Comisión</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {affiliateStats.recentSales.map((sale: AffiliateSale) => (
                      <TableRow key={sale.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{sale.userName}</p>
                            <p className="text-sm text-muted-foreground">{sale.userEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(sale.saleDate).toLocaleDateString('es-ES')}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(sale.saleAmount, sale.currency)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(sale.commissionAmount, sale.commissionCurrency)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(sale.status)}
                        </TableCell>
                        <TableCell>
                          {sale.status === 'pending' && (
                            <div className="space-y-2">
                              <Textarea
                                placeholder="Notas del pago (opcional)"
                                value={paymentNotes}
                                onChange={(e) => setPaymentNotes(e.target.value)}
                                className="h-20"
                              />
                              <Button
                                size="sm"
                                onClick={() => handleMarkAsPaid(sale.id)}
                                disabled={processingPayment === sale.id}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                {processingPayment === sale.id ? 'Procesando...' : 'Marcar como Pagado'}
                              </Button>
                            </div>
                          )}
                          {sale.status === 'paid' && sale.paymentDate && (
                            <div className="text-sm text-muted-foreground">
                              Pagado: {new Date(sale.paymentDate).toLocaleDateString('es-ES')}
                              {sale.notes && (
                                <p className="mt-1 text-xs">{sale.notes}</p>
                              )}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="stats" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h4 className="font-semibold mb-4">Estadísticas del Mes</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Clicks este mes:</span>
                      <span className="font-bold">{affiliateStats.clicksThisMonth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ventas este mes:</span>
                      <span className="font-bold">{affiliateStats.salesThisMonth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Comisiones este mes:</span>
                      <span className="font-bold">${affiliateStats.commissionsThisMonth.toFixed(2)}</span>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h4 className="font-semibold mb-4">Totales por Moneda</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Ventas USD:</span>
                      <span className="font-bold">${affiliateStats.totalSalesUSD.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ventas ARS:</span>
                      <span className="font-bold">${affiliateStats.totalSalesARS.toFixed(2)} ARS</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ticket promedio:</span>
                      <span className="font-bold">${affiliateStats.averageOrderValue.toFixed(2)}</span>
                    </div>
                  </div>
                </Card>
              </div>
              
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Evolución Mensual</h4>
                <div className="space-y-2">
                  {affiliateStats.monthlyStats.map((month, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 py-2 border-b">
                      <span className="font-medium">{month.month}</span>
                      <span>{month.clicks} clicks</span>
                      <span>{month.sales} ventas</span>
                      <span>${month.commissions.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="info" className="space-y-4">
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Información del Afiliado</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Código de Afiliado:</label>
                    <p className="font-mono bg-gray-100 p-2 rounded">{affiliate.affiliateCode}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email:</label>
                    <p>{affiliate.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Fecha de Registro:</label>
                    <p>{affiliate.dateRegistered}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tasa de Comisión:</label>
                    <p>{affiliate.commissionRate}%</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Estado:</label>
                    <Badge variant={affiliate.status === 'approved' ? 'default' : 'secondary'}>
                      {affiliate.status === 'approved' ? 'Aprobado' : 
                       affiliate.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                    </Badge>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AffiliateDetailModal;
