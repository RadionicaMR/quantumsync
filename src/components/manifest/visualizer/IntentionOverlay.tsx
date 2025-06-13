
import React from 'react';

interface IntentionOverlayProps {
  intention: string;
  pulseDuration: number;
  noAnimation?: boolean;
}

const IntentionOverlay: React.FC<IntentionOverlayProps> = ({
  intention,
  pulseDuration,
  noAnimation = false
}) => {
  if (!intention) return null;

  return (
    <div 
      className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none"
    >
      <div 
        className={`text-center max-w-[80%] px-2 py-1 rounded ${noAnimation ? '' : 'animate-pulse'}`}
      >
        <p className="text-white text-lg md:text-xl font-medium drop-shadow-lg">{intention}</p>
      </div>
    </div>
  );
};

export default IntentionOverlay;
