
import React, { memo, useCallback, useEffect } from 'react';
import QuantumButton from '@/components/QuantumButton';
import { Rocket, StopCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ManifestActionButtonsProps {
  isManifestActive: boolean;
  timeRemaining: number | null;
  formatTimeRemaining: (minutes: number) => string;
  startManifestation: () => void;
  stopManifestation: () => void;
  canStart: boolean;
  intention: string;
}

const ManifestActionButtons = memo(({
  isManifestActive,
  timeRemaining,
  formatTimeRemaining,
  startManifestation,
  stopManifestation,
  canStart,
  intention
}: ManifestActionButtonsProps) => {
  
  // Debugging log to check component rendering and props
  useEffect(() => {
    console.log("ManifestActionButtons mounted/updated:", {
      isManifestActive,
      timeRemaining,
      intention,
      canStart
    });
  }, [isManifestActive, timeRemaining, intention, canStart]);
  
  // Use useCallback to memorize the function and avoid unnecessary renders
  const handleStartClick = useCallback(() => {
    if (intention && intention.trim() !== "") {
      console.log("ManifestActionButtons - Starting manifestation with intention:", intention);
      startManifestation();
    } else {
      toast({
        title: "No se puede iniciar la manifestación",
        description: "Asegúrate de tener una intención definida.",
        variant: "destructive",
      });
    }
  }, [intention, startManifestation]);

  // Simplify validation to just check for intention
  const isButtonEnabled = Boolean(intention && intention.trim() !== "");
  
  console.log("ManifestActionButtons render:", {
    isManifestActive,
    timeRemaining,
    isButtonEnabled,
    intention,
    hasIntention: Boolean(intention),
    intentionTrimmed: intention?.trim() !== ""
  });

  return (
    <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-background/50">
      {isManifestActive ? (
        <>
          <div className="text-quantum-primary font-medium">
            {timeRemaining !== null && timeRemaining !== -1 && (
              <span>Tiempo restante: {formatTimeRemaining(Math.ceil(timeRemaining))}</span>
            )}
            {timeRemaining === -1 && (
              <span>Tiempo indefinido</span>
            )}
          </div>
          <QuantumButton 
            variant="secondary"
            onClick={stopManifestation}
            className="bg-red-500 hover:bg-red-600 text-white font-bold"
          >
            <div className="flex items-center justify-center">
              <StopCircle className="mr-2 h-4 w-4" />
              <span>DETENER MANIFESTACIÓN</span>
            </div>
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
            <div className="flex items-center justify-center">
              <Rocket className="mr-2 h-5 w-5" />
              <span>INICIAR MANIFESTACIÓN</span>
            </div>
          </QuantumButton>
        </>
      )}
    </div>
  );
});

ManifestActionButtons.displayName = 'ManifestActionButtons';

export default ManifestActionButtons;
