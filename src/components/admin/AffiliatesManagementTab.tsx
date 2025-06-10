
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { Affiliate } from '@/types/affiliate';
import AffiliatesTable from './AffiliatesTable';

interface AffiliatesManagementTabProps {
  affiliates: Affiliate[];
  onAffiliateUpdate: () => void;
}

const AffiliatesManagementTab = ({
  affiliates,
  onAffiliateUpdate
}: AffiliatesManagementTabProps) => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Gestión de Afiliados</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Total de afiliados: {affiliates.length} | Pendientes: {affiliates.filter(a => a.status === 'pending').length}
          </p>
        </div>
        <Button 
          className="bg-gradient-to-r from-green-600 to-emerald-500 flex items-center gap-2"
          onClick={onAffiliateUpdate}
        >
          <Users size={16} />
          Actualizar Lista
        </Button>
      </div>
      
      <AffiliatesTable 
        affiliates={affiliates}
        onAffiliateUpdate={onAffiliateUpdate}
      />
    </Card>
  );
};

export default AffiliatesManagementTab;
