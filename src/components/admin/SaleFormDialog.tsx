import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import type { AffiliateSale, Affiliate, CommissionStatus } from '@/types/affiliate';

interface SaleFormDialogProps {
  open: boolean;
  onClose: () => void;
  sale: AffiliateSale | null;
  onSuccess: () => void;
}

const SaleFormDialog = ({ open, onClose, sale, onSuccess }: SaleFormDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [formData, setFormData] = useState({
    affiliate_id: '',
    customer_name: '',
    customer_email: '',
    sale_amount: '',
    commission_amount: '',
    currency: 'USD',
    commission_status: 'pending' as CommissionStatus,
    payment_method: 'paypal' as 'paypal' | 'mercadopago',
    transaction_id: '',
    notes: ''
  });

  useEffect(() => {
    loadAffiliates();
  }, []);

  useEffect(() => {
    if (sale) {
      setFormData({
        affiliate_id: sale.affiliate_id,
        customer_name: sale.customer_name || '',
        customer_email: sale.customer_email,
        sale_amount: sale.sale_amount.toString(),
        commission_amount: sale.commission_amount.toString(),
        currency: sale.currency,
        commission_status: sale.commission_status,
        payment_method: sale.payment_method,
        transaction_id: sale.transaction_id || '',
        notes: sale.notes || ''
      });
    } else {
      // Reset form for new sale
      setFormData({
        affiliate_id: '',
        customer_name: '',
        customer_email: '',
        sale_amount: '',
        commission_amount: '',
        currency: 'USD',
        commission_status: 'pending',
        payment_method: 'paypal',
        transaction_id: '',
        notes: ''
      });
    }
  }, [sale]);

  const loadAffiliates = async () => {
    const { data } = await supabase
      .from('affiliates')
      .select('*')
      .eq('status', 'active')
      .order('name');
    
    if (data) setAffiliates(data);
  };

  const calculateCommission = (saleAmount: string) => {
    const amount = parseFloat(saleAmount);
    if (isNaN(amount)) return '';
    
    // Find selected affiliate to get their commission rate
    const affiliate = affiliates.find(a => a.id === formData.affiliate_id);
    const commissionRate = affiliate?.commission_rate || 50; // Default to 50%
    
    return (amount * (commissionRate / 100)).toFixed(2);
  };

  const handleSaleAmountChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      sale_amount: value,
      commission_amount: calculateCommission(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.affiliate_id || !formData.customer_email || !formData.sale_amount) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Por favor completa los campos requeridos'
      });
      return;
    }

    setLoading(true);

    try {
      const saleData = {
        affiliate_id: formData.affiliate_id,
        customer_name: formData.customer_name || null,
        customer_email: formData.customer_email,
        sale_amount: parseFloat(formData.sale_amount),
        commission_amount: parseFloat(formData.commission_amount),
        currency: formData.currency,
        commission_status: formData.commission_status,
        payment_method: formData.payment_method,
        transaction_id: formData.transaction_id || null,
        notes: formData.notes || null
      };

      if (sale) {
        // Update existing sale
        const { error } = await supabase
          .from('affiliate_sales')
          .update(saleData)
          .eq('id', sale.id);

        if (error) throw error;

        toast({
          title: 'Venta actualizada',
          description: 'La venta ha sido actualizada exitosamente'
        });
      } else {
        // Create new sale
        const { error } = await supabase
          .from('affiliate_sales')
          .insert(saleData);

        if (error) throw error;

        toast({
          title: 'Venta creada',
          description: 'La venta ha sido registrada exitosamente'
        });
      }

      onSuccess();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {sale ? 'Editar Venta' : 'Nueva Venta'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="affiliate_id">Afiliado *</Label>
            <Select
              value={formData.affiliate_id}
              onValueChange={(value) => setFormData({ ...formData, affiliate_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un afiliado" />
              </SelectTrigger>
              <SelectContent>
                {affiliates.map((affiliate) => (
                  <SelectItem key={affiliate.id} value={affiliate.id}>
                    {affiliate.name} ({affiliate.email}) - {affiliate.commission_rate}% comisión
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_name">Nombre del cliente</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer_email">Email del cliente *</Label>
              <Input
                id="customer_email"
                type="email"
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sale_amount">Monto de venta *</Label>
              <Input
                id="sale_amount"
                type="number"
                step="0.01"
                value={formData.sale_amount}
                onChange={(e) => handleSaleAmountChange(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commission_amount">Comisión *</Label>
              <Input
                id="commission_amount"
                type="number"
                step="0.01"
                value={formData.commission_amount}
                onChange={(e) => setFormData({ ...formData, commission_amount: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Moneda</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="ARS">ARS</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="commission_status">Estado de comisión</Label>
              <Select
                value={formData.commission_status}
                onValueChange={(value: CommissionStatus) => setFormData({ ...formData, commission_status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="approved">Aprobado</SelectItem>
                  <SelectItem value="paid">Pagado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_method">Método de pago</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value: 'paypal' | 'mercadopago') => setFormData({ ...formData, payment_method: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="mercadopago">Mercado Pago</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transaction_id">ID de transacción</Label>
            <Input
              id="transaction_id"
              value={formData.transaction_id}
              onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
              placeholder="MP-123456, TXN-789"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Información adicional sobre la venta..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {sale ? 'Actualizar' : 'Crear'} Venta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SaleFormDialog;
