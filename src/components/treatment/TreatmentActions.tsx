
import QuantumButton from '@/components/QuantumButton';
import { Smartphone } from 'lucide-react';

interface TreatmentActionsProps {
  isPlaying: boolean;
  timeRemaining: number;
  formatTime: (minutes: number) => string;
  startTreatment: () => void;
  stopTreatment: () => void;
  receptorName?: string;
  backgroundModeActive?: boolean;
}

const TreatmentActions = ({
  isPlaying,
  timeRemaining,
  formatTime,
  startTreatment,
  stopTreatment,
  receptorName,
  backgroundModeActive = false,
}: TreatmentActionsProps) => {
  // Treatment can start if at least the receptor name is filled
  const canStartTreatment = !!receptorName?.trim();

  return (
    <div className="flex items-center justify-between">
      {isPlaying ? (
        <>
          <div className="text-quantum-primary font-medium flex items-center">
            {backgroundModeActive ? (
              <>
                <Smartphone className="w-4 h-4 mr-2 text-orange-500" />
                <span>Tratamiento en segundo plano: {formatTime(timeRemaining)} restante</span>
              </>
            ) : (
              <span>Tratamiento en progreso: {formatTime(timeRemaining)} restante</span>
            )}
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
            className="bg-orange-500 hover:bg-orange-600 text-white glow-orange"
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
