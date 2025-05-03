
import React from 'react';

interface IntentionOverlayProps {
  intention: string;
  pulseDuration: number;
}

const IntentionOverlay: React.FC<IntentionOverlayProps> = ({
  intention,
  pulseDuration
}) => {
  if (!intention) {
    return null;
  }
  
  return (
    <div className="absolute inset-0 flex items-center justify-center z-40">
      <div 
        className="max-w-[80%] text-white font-bold text-xl md:text-2xl p-4 text-center bg-black/30 rounded line-clamp-3"
        style={{
          animation: `pulse ${pulseDuration}s infinite alternate ease-in-out`,
          textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(155,135,245,0.8)'
        }}
      >
        {intention}
      </div>
    </div>
  );
};

export default IntentionOverlay;
