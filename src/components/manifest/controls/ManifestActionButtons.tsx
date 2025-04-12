
import QuantumButton from '@/components/QuantumButton';

interface ManifestActionButtonsProps {
  isManifestActive: boolean;
  timeRemaining: number | null;
  formatTimeRemaining: (minutes: number) => string;
  startManifestation: () => void;
  stopManifestation: () => void;
  canStart: boolean;
  intention: string;
}

const ManifestActionButtons = ({
  isManifestActive,
  timeRemaining,
  formatTimeRemaining,
  startManifestation,
  stopManifestation,
  canStart,
  intention
}: ManifestActionButtonsProps) => {
  return (
    <div className="flex items-center justify-between">
      {isManifestActive ? (
        <>
          <div className="text-quantum-primary font-medium">
            {timeRemaining !== null && (
              <span>Tiempo restante: {formatTimeRemaining(Math.ceil(timeRemaining))}</span>
            )}
          </div>
          <QuantumButton 
            variant="outline"
            onClick={stopManifestation}
          >
            Detener Manifestación
          </QuantumButton>
        </>
      ) : (
        <>
          <div className="text-muted-foreground">
            {canStart ? 'Listo para iniciar manifestación' : 'Selecciona un patrón para continuar'}
          </div>
          <QuantumButton 
            className="bg-orange-500 hover:bg-orange-600 text-white glow-orange"
            onClick={startManifestation}
            disabled={!canStart || !intention.trim()}
          >
            INICIAR MANIFESTACIÓN
          </QuantumButton>
        </>
      )}
    </div>
  );
};

export default ManifestActionButtons;
