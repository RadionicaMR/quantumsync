import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AffiliateSale } from '@/types/affiliate';
import SalesTable from './SalesTable';
import SaleFormDialog from './SaleFormDialog';

interface SalesManagementTabProps {
  sales: AffiliateSale[];
  onSaleUpdate: () => void;
}

const SalesManagementTab = ({
  sales,
  onSaleUpdate
}: SalesManagementTabProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<AffiliateSale | null>(null);

  const handleCreateSale = () => {
    setEditingSale(null);
    setIsDialogOpen(true);
  };

  const handleEditSale = (sale: AffiliateSale) => {
    setEditingSale(sale);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSale(null);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Gestión de Ventas</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Total de ventas: {sales.length} | Valor total: ${sales.reduce((sum, s) => sum + s.sale_amount, 0).toFixed(2)}
          </p>
        </div>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center gap-2"
          onClick={handleCreateSale}
        >
          <Plus size={16} />
          Nueva Venta
        </Button>
      </div>
      
      <SalesTable 
        sales={sales}
        onEditSale={handleEditSale}
        onSaleUpdate={onSaleUpdate}
      />

      <SaleFormDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        sale={editingSale}
        onSuccess={() => {
          handleCloseDialog();
          onSaleUpdate();
        }}
      />
    </Card>
  );
};

export default SalesManagementTab;
