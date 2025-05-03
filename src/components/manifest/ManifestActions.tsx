
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Progress } from '@/components/ui/progress';
import QuantumButton from '@/components/QuantumButton';
import { Rocket, StopCircle, Smartphone, Infinity } from 'lucide-react';

interface ManifestActionsProps {
  isManifestActive: boolean;
  canStart: boolean;
  timeRemaining: number | null;
  startManifestation: () => void;
  stopManifestation: () => void;
  formatTimeRemaining: (time: number) => string;
  backgroundModeActive?: boolean;
  indefiniteTime?: boolean;
  intention?: string; // Make intention optional for backwards compatibility
}

const ManifestActions = ({
  isManifestActive,
  canStart,
  timeRemaining,
  startManifestation,
  stopManifestation,
  formatTimeRemaining,
  backgroundModeActive = false,
  indefiniteTime = false,
  intention = "", // Default to empty string
}: ManifestActionsProps) => {
  // Add a console log to debug button click
  const handleStartClick = () => {
    console.log("Start manifestation button clicked, canStart:", canStart, "intention:", intention);
    startManifestation();
  };
  
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
              {indefiniteTime || timeRemaining === -1 ? (
                <div className="flex items-center">
                  <Infinity className="w-4 h-4 mr-1" />
                  <span>Tiempo indefinido</span>
                </div>
              ) : (
                timeRemaining !== null && `${formatTimeRemaining(timeRemaining)} restante`
              )}
            </div>
          </div>
          
          {!indefiniteTime && timeRemaining !== -1 && timeRemaining !== null && (
            <Progress 
              value={(timeRemaining > 0) 
                ? ((1 - timeRemaining / (timeRemaining + ((timeRemaining < 1) ? 5 : 0))) * 100) 
                : 0} 
              className="h-2 mb-4"
            />
          )}
          
          <QuantumButton
            variant="outline"
            className="w-full bg-red-500 hover:bg-red-600 text-white"
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
          className="w-full bg-quantum-primary hover:bg-quantum-primary/90 text-white"
          disabled={!canStart || (intention && !intention.trim())}
          onClick={handleStartClick}
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
