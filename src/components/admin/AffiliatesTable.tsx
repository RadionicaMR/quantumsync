import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, User } from 'lucide-react';
import { Affiliate } from '@/types/affiliate';
import { useToast } from '@/hooks/use-toast';

interface AffiliatesTableProps {
  affiliates: Affiliate[];
  onAffiliateUpdate: () => void;
}

const AffiliatesTable = ({ affiliates, onAffiliateUpdate }: AffiliatesTableProps) => {
  const { toast } = useToast();

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
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-1" />
                  Ver
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AffiliatesTable;
