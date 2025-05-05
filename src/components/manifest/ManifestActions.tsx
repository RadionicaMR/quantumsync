
import React, { memo, useEffect } from 'react';
import { Rocket, StopCircle, Smartphone, Infinity } from 'lucide-react';
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

const ManifestActions = memo(({
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
  // Always check for a non-empty intention
  const isIntentionValid = Boolean(intention && intention.trim() !== "");
  
  console.log("ManifestActions render:", { 
    isManifestActive, 
    timeRemaining, 
    intention,
    intentionValid: isIntentionValid,
    canStart
  });

  // Log on mount and when isManifestActive changes
  useEffect(() => {
    console.log("ManifestActions - Active state changed:", isManifestActive);
  }, [isManifestActive]);
  
  return (
    <div className="flex flex-col space-y-2">
      {/* Make sure buttons are visible by passing necessary props */}
      <ManifestActionButtons
        isManifestActive={isManifestActive}
        timeRemaining={timeRemaining}
        formatTimeRemaining={formatTimeRemaining}
        startManifestation={startManifestation}
        stopManifestation={stopManifestation}
        canStart={isIntentionValid} // Use local validation based on intention
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
});

ManifestActions.displayName = 'ManifestActions';

export default ManifestActions;
