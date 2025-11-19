import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, User, Trash2 } from 'lucide-react';
import { Affiliate } from '@/types/affiliate';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';

interface AffiliatesTableProps {
  affiliates: Affiliate[];
  onAffiliateUpdate: () => void;
}

const AffiliatesTable = ({ affiliates, onAffiliateUpdate }: AffiliatesTableProps) => {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [affiliateToDelete, setAffiliateToDelete] = useState<Affiliate | null>(null);

  const handleDeleteClick = (affiliate: Affiliate) => {
    setAffiliateToDelete(affiliate);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!affiliateToDelete) return;

    try {
      const { error } = await supabase
        .from('affiliates')
        .delete()
        .eq('id', affiliateToDelete.id);

      if (error) throw error;

      toast({
        title: "Afiliado eliminado",
        description: `${affiliateToDelete.name} ha sido eliminado exitosamente.`,
      });

      onAffiliateUpdate();
    } catch (error) {
      console.error('Error deleting affiliate:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el afiliado. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setAffiliateToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <Badge variant="default">Activo</Badge>;
    }
    return <Badge variant="secondary">Inactivo</Badge>;
  };

  if (affiliates.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <User className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p>No hay afiliados registrados.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>País</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Comisiones</TableHead>
            <TableHead>Ventas</TableHead>
            <TableHead>Clicks</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {affiliates.map((affiliate) => (
            <TableRow key={affiliate.id}>
              <TableCell className="font-medium">{affiliate.name}</TableCell>
              <TableCell>{affiliate.email}</TableCell>
              <TableCell className="font-mono text-sm">{affiliate.affiliate_code}</TableCell>
              <TableCell>{affiliate.country}</TableCell>
              <TableCell>{getStatusBadge(affiliate.status)}</TableCell>
              <TableCell>${affiliate.total_commissions.toFixed(2)}</TableCell>
              <TableCell>{affiliate.total_sales}</TableCell>
              <TableCell>{affiliate.total_clicks}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDeleteClick(affiliate)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente al afiliado{' '}
            <span className="font-semibold">{affiliateToDelete?.name}</span> y todos sus datos asociados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
  );
};

export default AffiliatesTable;
