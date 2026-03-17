import QuantumButton from '@/components/QuantumButton';
import { Smartphone } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface TreatmentActionsProps {
  isPlaying: boolean;
  timeRemaining: number;
  formatTime: (minutes: number) => string;
  startTreatment: () => void;
  stopTreatment: () => void;
  receptorName?: string;
  backgroundModeActive?: boolean;
  intention?: string;
}

const TreatmentActions = ({
  isPlaying,
  timeRemaining,
  formatTime,
  startTreatment,
  stopTreatment,
  receptorName,
  backgroundModeActive = false,
  intention
}: TreatmentActionsProps) => {
  const { t, language } = useLanguage();
  const canStartTreatment = !!(receptorName?.trim() || intention?.trim());
  
  const [displayTimeString, setDisplayTimeString] = useState<string>("");
  const startClickedRef = useRef(false);
  
  useEffect(() => {
    if (isPlaying) {
      const formattedTime = formatTime(Math.max(0, timeRemaining));
      setDisplayTimeString(formattedTime);
    } else if (timeRemaining === 0) {
      setDisplayTimeString("");
    }
  }, [timeRemaining, isPlaying, formatTime]);
  
  const handleStartTreatment = () => {
    if (canStartTreatment && !isPlaying && !startClickedRef.current) {
      startClickedRef.current = true;
      startTreatment();
      
      setTimeout(() => {
        startClickedRef.current = false;
      }, 1000);
    }
  };
  
  const handleStopTreatment = () => {
    if (isPlaying) {
      stopTreatment();
    }
  };
  
  const getReadyMessage = () => {
    if (intention?.trim()) {
      return language === 'en' ? "Ready to start manifestation" : "Listo para iniciar manifestación";
    }
    if (receptorName?.trim()) {
      return language === 'en' ? "Ready to start personalized treatment" : "Listo para iniciar tratamiento personalizado";
    }
    return t('actions.enterReceptorName');
  };

  const getTreatmentLabel = () => {
    return intention?.trim() 
      ? (language === 'en' ? 'MANIFESTATION' : 'MANIFESTACIÓN')
      : (language === 'en' ? 'TREATMENT' : 'TRATAMIENTO');
  };

  const getStartLabel = () => language === 'en' ? 'START' : 'INICIAR';
  const getStopLabel = () => language === 'en' ? 'STOP' : 'DETENER';
  const getRemainingLabel = () => language === 'en' ? 'remaining' : 'restante';
  const getInProgressLabel = () => language === 'en' ? 'in progress' : 'en progreso';
  const getBackgroundLabel = () => language === 'en' ? 'Background treatment' : 'Tratamiento en segundo plano';
  
  return (
    <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
      {isPlaying ? (
        <>
          <div className="text-quantum-primary font-medium flex items-center text-center sm:text-left">
            {backgroundModeActive ? (
              <>
                <Smartphone className="w-4 h-4 mr-2 text-orange-500" />
                <span>{getBackgroundLabel()}: {displayTimeString} {getRemainingLabel()}</span>
              </>
            ) : (
              <span>{getTreatmentLabel()} {getInProgressLabel()}: {displayTimeString} {getRemainingLabel()}</span>
            )}
          </div>
          <QuantumButton 
            variant="outline"
            onClick={handleStopTreatment}
          >
            <span className="flex flex-col items-center">
              <span>{getStopLabel()}</span>
              <span>{getTreatmentLabel()}</span>
            </span>
          </QuantumButton>
        </>
      ) : (
        <>
          <div className="text-muted-foreground text-center sm:text-left">
            {getReadyMessage()}
          </div>
          <QuantumButton 
            className="bg-orange-500 hover:bg-orange-600 text-white glow-orange"
            onClick={handleStartTreatment}
            disabled={!canStartTreatment || startClickedRef.current}
          >
            <span className="flex flex-col items-center">
              <span>{getStartLabel()}</span>
              <span>{getTreatmentLabel()}</span>
            </span>
          </QuantumButton>
        </>
      )}
    </div>
  );
};

export default TreatmentActions;
