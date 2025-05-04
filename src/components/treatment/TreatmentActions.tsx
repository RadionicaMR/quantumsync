
import QuantumButton from '@/components/QuantumButton';
import { Smartphone } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

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
  
  // Local state for displaying the remaining time
  const [displayTimeString, setDisplayTimeString] = useState<string>("");
  const startClickedRef = useRef(false);
  
  // Update the displayed time whenever timeRemaining or isPlaying changes
  useEffect(() => {
    if (isPlaying) {
      const formattedTime = formatTime(Math.max(0, timeRemaining));
      setDisplayTimeString(formattedTime);
      console.log(`Updated displayed time: ${formattedTime} (${timeRemaining.toFixed(2)} min) - Playing: ${isPlaying}`);
    } else if (timeRemaining === 0) {
      setDisplayTimeString("");
    }
  }, [timeRemaining, isPlaying, formatTime]);
  
  const handleStartTreatment = () => {
    console.log("Start treatment button clicked");
    if (canStartTreatment && !isPlaying && !startClickedRef.current) {
      // Set flag to prevent double clicks
      startClickedRef.current = true;
      startTreatment();
      
      // Reset flag after a short delay
      setTimeout(() => {
        startClickedRef.current = false;
      }, 1000);
    }
  };
  
  const handleStopTreatment = () => {
    console.log("Stop treatment button clicked");
    if (isPlaying) {
      stopTreatment();
    }
  };
  
  return (
    <div className="flex items-center justify-between">
      {isPlaying ? (
        <>
          <div className="text-quantum-primary font-medium flex items-center">
            {backgroundModeActive ? (
              <>
                <Smartphone className="w-4 h-4 mr-2 text-orange-500" />
                <span>Tratamiento en segundo plano: {displayTimeString} restante</span>
              </>
            ) : (
              <span>Tratamiento en progreso: {displayTimeString} restante</span>
            )}
          </div>
          <QuantumButton 
            variant="outline"
            onClick={handleStopTreatment}
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
            onClick={handleStartTreatment}
            disabled={!canStartTreatment || startClickedRef.current}
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
