
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Progress } from '@/components/ui/progress';
import QuantumButton from '@/components/QuantumButton';
import { Rocket, StopCircle, Smartphone } from 'lucide-react';

interface ManifestActionsProps {
  isManifestActive: boolean;
  canStart: boolean;
  timeRemaining: number | null;
  startManifestation: () => void;
  stopManifestation: () => void;
  formatTimeRemaining: (time: number) => string;
  backgroundModeActive?: boolean;
}

const ManifestActions = ({
  isManifestActive,
  canStart,
  timeRemaining,
  startManifestation,
  stopManifestation,
  formatTimeRemaining,
  backgroundModeActive = false,
}: ManifestActionsProps) => {
  return (
    <div className="flex flex-col space-y-2 mt-6">
      {isManifestActive ? (
        <>
          <div className="flex justify-between items-center mb-2">
            <div className="text-quantum-primary font-medium flex items-center">
              {backgroundModeActive ? (
                <>
                  <Smartphone className="w-4 h-4 mr-2 text-orange-500" />
                  <span>Manifestando en segundo plano</span>
                </>
              ) : (
                <span>Manifestación en progreso</span>
              )}
            </div>
            <div className="text-sm font-medium">
              {timeRemaining !== null && `${formatTimeRemaining(timeRemaining)} restante`}
            </div>
          </div>
          
          <Progress 
            value={(timeRemaining !== null && timeRemaining > 0) 
              ? ((1 - timeRemaining / 5) * 100) 
              : 0} 
            className="h-2 mb-4"
          />
          
          <QuantumButton
            variant="destructive"
            className="w-full"
            onClick={stopManifestation}
          >
            <div className="flex items-center justify-center">
              <StopCircle className="mr-2 h-4 w-4" />
              <span>DETENER MANIFESTACIÓN</span>
            </div>
          </QuantumButton>
        </>
      ) : (
        <QuantumButton
          className="w-full bg-quantum-primary text-white"
          disabled={!canStart}
          onClick={startManifestation}
        >
          <div className="flex items-center justify-center">
            <Rocket className="mr-2 h-5 w-5" />
            <span>INICIAR MANIFESTACIÓN</span>
          </div>
        </QuantumButton>
      )}
    </div>
  );
};

export default ManifestActions;
