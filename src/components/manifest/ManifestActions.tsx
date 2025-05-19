
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Play, StopCircle } from 'lucide-react';

interface ManifestActionsProps {
  isManifestActive: boolean;
  canStart: boolean;
  timeRemaining: number | null;
  startManifestation: () => void;
  stopManifestation: () => void;
  formatTimeRemaining: (time: number) => string;
  backgroundModeActive?: boolean;
  indefiniteTime?: boolean;
  intention?: string; // Nueva prop para la intención
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
  intention = ""
}: ManifestActionsProps) => {
  // Debugging logs
  console.log("ManifestActions render:", {
    isManifestActive,
    canStart,
    timeRemaining,
    hasIntention: !!intention
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 justify-between mt-2">
      <div className="flex-1 w-full">
        {/* Tiempo restante */}
        {isManifestActive && timeRemaining !== null && !indefiniteTime && (
          <div className="text-center sm:text-left">
            <p className="text-quantum-primary flex items-center gap-2 justify-center sm:justify-start">
              <Loader2 className="animate-spin" size={16} />
              <span className="font-mono">
                Tiempo restante: {formatTimeRemaining(timeRemaining)}
              </span>
            </p>
          </div>
        )}
        
        {/* Modo indefinido */}
        {isManifestActive && indefiniteTime && (
          <div className="text-center sm:text-left">
            <p className="text-quantum-primary flex items-center gap-2 justify-center sm:justify-start">
              <Loader2 className="animate-spin" size={16} />
              <span className="font-mono">
                Manifestación en curso (modo indefinido)
              </span>
            </p>
          </div>
        )}

        {/* Modo en segundo plano */}
        {backgroundModeActive && (
          <div className="text-center sm:text-left">
            <p className="text-yellow-400 text-sm mt-1">
              Audio subliminal activo en segundo plano
            </p>
          </div>
        )}

        {/* Intención actual (si está activa) */}
        {isManifestActive && intention && (
          <div className="mt-2 text-center sm:text-left">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Intención activa:</span> {intention.length > 40 ? `${intention.slice(0, 40)}...` : intention}
            </p>
          </div>
        )}
      </div>
      
      <div className="flex justify-center sm:justify-end gap-3">
        {!isManifestActive ? (
          <Button 
            onClick={startManifestation}
            disabled={!canStart}
            className="bg-gradient-to-r from-quantum-primary/80 to-green-500/80 hover:from-quantum-primary hover:to-green-500 shadow-lg w-32"
          >
            <Play size={16} className="mr-2" />
            Iniciar
          </Button>
        ) : (
          <Button 
            onClick={stopManifestation}
            variant="destructive"
            className="w-32"
          >
            <StopCircle size={16} className="mr-2" />
            Detener
          </Button>
        )}
      </div>
    </div>
  );
};

export default ManifestActions;
