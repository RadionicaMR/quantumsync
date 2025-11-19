import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, User, Trash2, Ban, CheckCircle, Edit } from 'lucide-react';
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
import EditAffiliateDialog from './EditAffiliateDialog';

interface AffiliatesTableProps {
  affiliates: Affiliate[];
  onAffiliateUpdate: () => void;
}

const AffiliatesTable = ({ affiliates, onAffiliateUpdate }: AffiliatesTableProps) => {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [affiliateToDelete, setAffiliateToDelete] = useState<Affiliate | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [affiliateToEdit, setAffiliateToEdit] = useState<Affiliate | null>(null);

  const handleDeleteClick = (affiliate: Affiliate) => {
    setAffiliateToDelete(affiliate);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (affiliate: Affiliate) => {
    setAffiliateToEdit(affiliate);
    setEditDialogOpen(true);
  };

  const handleToggleStatus = async (affiliate: Affiliate) => {
    const newStatus = affiliate.status === 'active' ? 'inactive' : 'active';
    
    try {
      const { error } = await supabase
        .from('affiliates')
        .update({ status: newStatus })
        .eq('id', affiliate.id);

      if (error) throw error;

      toast({
        title: newStatus === 'active' ? "Afiliado reactivado" : "Afiliado suspendido",
        description: `${affiliate.name} ha sido ${newStatus === 'active' ? 'reactivado' : 'suspendido'} exitosamente.`,
      });

      onAffiliateUpdate();
    } catch (error) {
      console.error('Error updating affiliate status:', error);
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado del afiliado. Intenta nuevamente.",
        variant: "destructive",
      });
    }
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
      return <Badge variant="default" className="bg-green-600">Activo</Badge>;
    }
    return <Badge variant="secondary" className="bg-gray-500">Inactivo</Badge>;
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
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditClick(affiliate)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button 
                    size="sm" 
                    variant={affiliate.status === 'active' ? 'secondary' : 'default'}
                    onClick={() => handleToggleStatus(affiliate)}
                  >
                    {affiliate.status === 'active' ? (
                      <>
                        <Ban className="w-4 h-4 mr-1" />
                        Suspender
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Reactivar
                      </>
                    )}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDeleteClick(affiliate)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

    <EditAffiliateDialog
      affiliate={affiliateToEdit}
      open={editDialogOpen}
      onOpenChange={setEditDialogOpen}
      onSuccess={onAffiliateUpdate}
    />

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
