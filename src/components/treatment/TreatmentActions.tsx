
import QuantumButton from '@/components/QuantumButton';

interface TreatmentActionsProps {
  isPlaying: boolean;
  timeRemaining: number;
  formatTime: (minutes: number) => string;
  startTreatment: () => void;
  stopTreatment: () => void;
  radionicImage: string | null;
}

const TreatmentActions = ({
  isPlaying,
  timeRemaining,
  formatTime,
  startTreatment,
  stopTreatment,
  radionicImage,
}: TreatmentActionsProps) => {
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
            Listo para iniciar tratamiento personalizado
          </div>
          <QuantumButton 
            onClick={startTreatment}
            disabled={!radionicImage}
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
