
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AffiliateGlobalStats from './AffiliateGlobalStats';

interface AffiliateStatsTabProps {
  onAffiliateUpdate: () => void;
}

const AffiliateStatsTab = ({ onAffiliateUpdate }: AffiliateStatsTabProps) => {
  const { toast } = useToast();

  const handleRefreshStats = () => {
    onAffiliateUpdate();
    toast({
      title: "Estadísticas actualizadas",
      description: "Los datos han sido refrescados",
    });
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Estadísticas del Programa de Afiliados</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Vista global de performance y métricas
          </p>
        </div>
        <Button 
          className="bg-gradient-to-r from-purple-600 to-pink-500 flex items-center gap-2"
          onClick={handleRefreshStats}
        >
          <BarChart3 size={16} />
          Actualizar Estadísticas
        </Button>
      </div>
      
      <AffiliateGlobalStats />
    </Card>
  );
};

export default AffiliateStatsTab;
