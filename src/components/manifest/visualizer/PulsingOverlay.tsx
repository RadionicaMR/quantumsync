
import React from 'react';

const PulsingOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
      <div className="w-12 h-12 bg-quantum-primary/20 rounded-full animate-ping"></div>
      <div className="w-24 h-24 bg-quantum-primary/15 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-36 h-36 bg-quantum-primary/10 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
    </div>
  );
};

export default PulsingOverlay;
