import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { AffiliateSale } from '@/types/affiliate';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SalesTableProps {
  sales: AffiliateSale[];
  onEditSale: (sale: AffiliateSale) => void;
  onSaleUpdate: () => void;
}

const SalesTable = ({ sales, onEditSale, onSaleUpdate }: SalesTableProps) => {
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      approved: "default",
      paid: "default"
    };
    
    return (
      <Badge variant={variants[status] || "secondary"}>
        {status === 'pending' ? 'Pendiente' : status === 'approved' ? 'Aprobado' : 'Pagado'}
      </Badge>
    );
  };

  const handleDelete = async (saleId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta venta?')) return;

    try {
      const { error } = await supabase
        .from('affiliate_sales')
        .delete()
        .eq('id', saleId);

      if (error) throw error;

      toast({
        title: 'Venta eliminada',
        description: 'La venta ha sido eliminada exitosamente'
      });

      onSaleUpdate();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message
      });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Comisión</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No hay ventas registradas
              </TableCell>
            </TableRow>
          ) : (
            sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">
                  {sale.customer_name || 'Sin nombre'}
                </TableCell>
                <TableCell>{sale.customer_email}</TableCell>
                <TableCell>
                  ${sale.sale_amount.toFixed(2)} {sale.currency}
                </TableCell>
                <TableCell className="text-green-600">
                  ${sale.commission_amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  {getStatusBadge(sale.commission_status)}
                </TableCell>
                <TableCell>
                  {new Date(sale.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEditSale(sale)}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(sale.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SalesTable;
