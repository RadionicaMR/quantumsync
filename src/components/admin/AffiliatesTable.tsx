
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, User, Eye } from 'lucide-react';
import { Affiliate } from '@/types/affiliate';
import { updateAffiliateStatus, getAffiliateDetailedStats } from '@/utils/affiliateStorage';
import { useToast } from '@/hooks/use-toast';
import AffiliateDetailModal from './AffiliateDetailModal';

interface AffiliatesTableProps {
  affiliates: Affiliate[];
  onAffiliateUpdate: () => void;
}

const AffiliatesTable = ({ affiliates, onAffiliateUpdate }: AffiliatesTableProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedAffiliate, setSelectedAffiliate] = useState<string | null>(null);
  const [affiliateStats, setAffiliateStats] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleStatusUpdate = async (affiliateId: string, status: 'approved' | 'rejected') => {
    setLoading(affiliateId);
    try {
      updateAffiliateStatus(affiliateId, status);
      onAffiliateUpdate();
      
      toast({
        title: status === 'approved' ? "Afiliado aprobado" : "Afiliado rechazado",
        description: `El afiliado ha sido ${status === 'approved' ? 'aprobado' : 'rechazado'} exitosamente`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el estado del afiliado",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleViewDetails = (affiliate: Affiliate) => {
    const stats = getAffiliateDetailedStats(affiliate.affiliateCode);
    setAffiliateStats(stats);
    setSelectedAffiliate(affiliate.id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAffiliate(null);
    setAffiliateStats(null);
  };

  const getStatusBadge = (status: Affiliate['status']) => {
    const variants = {
      pending: { variant: 'secondary' as const, text: 'Pendiente' },
      approved: { variant: 'default' as const, text: 'Aprobado' },
      rejected: { variant: 'destructive' as const, text: 'Rechazado' }
    };
    
    const config = variants[status];
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  if (affiliates.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <User className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p>No hay solicitudes de afiliados registradas.</p>
        <p className="text-sm mt-2">Las nuevas solicitudes aparecerán aquí.</p>
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
              <TableHead>Registro</TableHead>
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
                <TableCell className="font-mono text-sm">{affiliate.affiliateCode}</TableCell>
                <TableCell>{affiliate.dateRegistered}</TableCell>
                <TableCell>{getStatusBadge(affiliate.status)}</TableCell>
                <TableCell>${affiliate.totalCommissions.toFixed(2)}</TableCell>
                <TableCell>{affiliate.totalSales}</TableCell>
                <TableCell>{affiliate.totalClicks}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(affiliate)}
                      className="bg-blue-50 hover:bg-blue-100"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {affiliate.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(affiliate.id, 'approved')}
                          disabled={loading === affiliate.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusUpdate(affiliate.id, 'rejected')}
                          disabled={loading === affiliate.id}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AffiliateDetailModal
        affiliateStats={affiliateStats}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onUpdate={onAffiliateUpdate}
      />
    </>
  );
};

export default AffiliatesTable;
