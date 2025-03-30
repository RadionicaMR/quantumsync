
import QuantumButton from '@/components/QuantumButton';

interface TreatmentActionsProps {
  isPlaying: boolean;
  timeRemaining: number;
  formatTime: (minutes: number) => string;
  startTreatment: () => void;
  stopTreatment: () => void;
  receptorName?: string;
}

const TreatmentActions = ({
  isPlaying,
  timeRemaining,
  formatTime,
  startTreatment,
  stopTreatment,
  receptorName,
}: TreatmentActionsProps) => {
  // Treatment can start if at least the receptor name is filled
  const canStartTreatment = !!receptorName?.trim();

  return (
    <div className="flex items-center justify-between">
      {isPlaying ? (
        <>
          <div className="text-quantum-primary font-medium">
            Tratamiento en progreso: {formatTime(timeRemaining)} restante
          </div>
          <QuantumButton 
            variant="outline"
            onClick={stopTreatment}
          >
            <div className="flex flex-col items-center">
              <span>DETENER</span>
              <span>TRATAMIENTO</span>
            </div>
          </QuantumButton>
        </>
      ) : (
        <>
          <div className="text-muted-foreground">
            {canStartTreatment
              ? "Listo para iniciar tratamiento personalizado"
              : "Ingrese el nombre del receptor para iniciar"
            }
          </div>
          <QuantumButton 
            onClick={startTreatment}
            disabled={!canStartTreatment}
          >
            <div className="flex flex-col items-center">
              <span>INICIAR</span>
              <span>TRATAMIENTO</span>
            </div>
          </QuantumButton>
        </>
      )}
    </div>
  );
};

export default TreatmentActions;
