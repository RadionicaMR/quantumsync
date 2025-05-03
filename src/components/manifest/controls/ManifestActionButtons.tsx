
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
  // Add a console log to debug button click
  const handleStartClick = () => {
    console.log("ManifestActionButtons: Start manifestation button clicked", {
      canStart,
      intention,
      intentionValid: intention && intention.trim() !== ""
    });
    startManifestation();
  };

  // Simplificamos la validación solo para la intención
  const isButtonEnabled = intention && intention.trim() !== "";
  
  console.log("ManifestActionButtons: Button state", {
    isButtonEnabled,
    canStart,
    intention,
    intentionValid: intention && intention.trim() !== ""
  });

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
            {isButtonEnabled
              ? 'Listo para iniciar manifestación' 
              : 'Completa los campos requeridos para continuar'}
          </div>
          <QuantumButton 
            className="bg-orange-500 hover:bg-orange-600 text-white glow-orange"
            onClick={handleStartClick}
            disabled={!isButtonEnabled}
          >
            INICIAR MANIFESTACIÓN
          </QuantumButton>
        </>
      )}
    </div>
  );
};

export default ManifestActionButtons;
