
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
        className="text-center max-w-[80%] bg-black/40 px-4 py-2 rounded-lg backdrop-blur-sm"
        style={{
          animation: 'none', // Never animate
          opacity: 0.8
        }}
      >
        <p className="text-white text-lg md:text-xl font-medium">{intention}</p>
      </div>
    </div>
  );
};

export default IntentionOverlay;
