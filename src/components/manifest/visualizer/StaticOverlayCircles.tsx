
import React from 'react';

interface StaticOverlayCirclesProps {
  isVisible: boolean;
}

const StaticOverlayCircles: React.FC<StaticOverlayCirclesProps> = ({
  isVisible
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
      <div className="w-12 h-12 bg-quantum-primary/20 rounded-full"></div>
      <div className="w-24 h-24 bg-quantum-primary/15 rounded-full"></div>
      <div className="w-36 h-36 bg-quantum-primary/10 rounded-full"></div>
    </div>
  );
};

export default StaticOverlayCircles;
