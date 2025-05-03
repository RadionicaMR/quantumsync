
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Progress } from '@/components/ui/progress';
import QuantumButton from '@/components/QuantumButton';
import { Rocket, StopCircle, Smartphone, Infinity } from 'lucide-react';
import { useEffect } from 'react';
import ManifestActionButtons from './controls/ManifestActionButtons';

interface ManifestActionsProps {
  isManifestActive: boolean;
  canStart: boolean;
  timeRemaining: number | null;
  startManifestation: () => void;
  stopManifestation: () => void;
  formatTimeRemaining: (time: number) => string;
  backgroundModeActive?: boolean;
  indefiniteTime?: boolean;
  intention?: string; 
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
  intention = "", 
}: ManifestActionsProps) => {
  // Log intention changes for debugging
  useEffect(() => {
    console.log("ManifestActions - Intention actualizada:", {
      intention,
      intentionLength: intention ? intention.length : 0,
      intentionValid: intention && intention.trim() !== "",
      canStart,
      isManifestActive
    });
  }, [intention, canStart, isManifestActive]);
  
  // Debugging log con valores actuales
  console.log("ManifestActions render con valores actuales:", {
    isManifestActive,
    canStart,
    intention,
    intentionLength: intention ? intention.length : 0,
    intentionValid: intention && intention.trim() !== "",
    timeRemaining,
    indefiniteTime
  });
  
  const handleStartClick = () => {
    // Debug para verificar los valores en el momento del clic
    console.log("ManifestActions: INICIO DE MANIFESTACIÓN con valores:", {
      canStart,
      intention,
      intentionLength: intention ? intention.length : 0,
      intentionValid: intention && intention.trim() !== ""
    });
    
    startManifestation();
  };
  
  // Verificación estricta SOLO de intención válida, sin verificar patrón
  const isIntentionValid = Boolean(intention && intention.trim() !== "");
  
  // Simplificamos la validación solo a la intención
  const isButtonEnabled = isIntentionValid;
  
  console.log("ManifestActions: Estado final del botón:", { 
    isButtonEnabled, 
    canStart, 
    isIntentionValid, 
    intention,
    isManifestActive
  });
  
  return (
    <div className="flex flex-col space-y-2 mt-6">
      <ManifestActionButtons
        isManifestActive={isManifestActive}
        timeRemaining={timeRemaining}
        formatTimeRemaining={formatTimeRemaining}
        startManifestation={handleStartClick}
        stopManifestation={stopManifestation}
        canStart={isButtonEnabled}
        intention={intention}
      />
      
      {isManifestActive && backgroundModeActive && (
        <div className="text-sm text-center text-amber-600 mt-2 flex items-center justify-center">
          <Smartphone className="w-4 h-4 mr-1"/> 
          <span>Manifestación activa en segundo plano</span>
        </div>
      )}
      
      {isManifestActive && indefiniteTime && (
        <div className="text-sm text-center text-blue-500 mt-2 flex items-center justify-center">
          <Infinity className="w-4 h-4 mr-1"/> 
          <span>Manifestación con tiempo indefinido</span>
        </div>
      )}
    </div>
  );
};

export default ManifestActions;
