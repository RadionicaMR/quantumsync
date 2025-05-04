
import React, { memo } from 'react';
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
  // Simplify validation to just check intention
  const isIntentionValid = Boolean(intention && intention.trim() !== "");
  
  // Simplify validation to just check intention
  const isButtonEnabled = isIntentionValid;
  
  console.log("ManifestActions render:", { 
    isManifestActive, 
    timeRemaining, 
    isButtonEnabled,
    intention,
    intentionValid: isIntentionValid
  });
  
  return (
    <div className="flex flex-col space-y-2 mt-6">
      {/* Make sure the buttons are visible by passing necessary props */}
      <ManifestActionButtons
        isManifestActive={isManifestActive}
        timeRemaining={timeRemaining}
        formatTimeRemaining={formatTimeRemaining}
        startManifestation={startManifestation}
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
});

ManifestActions.displayName = 'ManifestActions';

export default ManifestActions;
