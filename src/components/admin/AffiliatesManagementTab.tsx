import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Affiliate } from '@/types/affiliate';
import AffiliatesTable from './AffiliatesTable';
import CreateAffiliateDialog from './CreateAffiliateDialog';

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
        <div className="flex gap-2">
          <CreateAffiliateDialog onSuccess={onAffiliateUpdate} />
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={onAffiliateUpdate}
          >
            <RefreshCw size={16} />
            Actualizar
          </Button>
        </div>
      </div>
      
      <AffiliatesTable 
        affiliates={affiliates}
        onAffiliateUpdate={onAffiliateUpdate}
      />
    </Card>
  );
};

export default AffiliatesManagementTab;
