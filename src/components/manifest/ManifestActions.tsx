
import QuantumButton from '@/components/QuantumButton';

interface ManifestActionsProps {
  isManifestActive: boolean;
  timeRemaining: number;
  formatTimeRemaining: (time: number) => string;
  startManifestation: () => void;
  stopManifestation: () => void;
  patternImage?: string | null;
}

const ManifestActions = ({
  isManifestActive,
  timeRemaining,
  formatTimeRemaining,
  startManifestation,
  stopManifestation,
  patternImage,
}: ManifestActionsProps) => {
  return (
    <div className="flex items-center justify-between">
      {isManifestActive ? (
        <>
          <div className="text-quantum-primary font-medium">
            Manifestación en progreso: {formatTimeRemaining(timeRemaining)} restante
          </div>
          <QuantumButton 
            variant="outline"
            onClick={stopManifestation}
          >
            <div className="flex flex-col items-center">
              <span>DETENER</span>
              <span>MANIFESTACIÓN</span>
            </div>
          </QuantumButton>
        </>
      ) : (
        <>
          <div className="text-muted-foreground">
            Listo para iniciar manifestación
          </div>
          <QuantumButton 
            onClick={startManifestation}
            disabled={!patternImage}
          >
            <div className="flex flex-col items-center">
              <span>ACTIVAR</span>
              <span>MANIFESTACIÓN</span>
            </div>
          </QuantumButton>
        </>
      )}
    </div>
  );
};

export default ManifestActions;
