
import React, { useEffect, useState } from 'react';

interface StaticOverlayCirclesProps {
  isVisible: boolean;
  visualSpeed?: number;
}

const StaticOverlayCircles: React.FC<StaticOverlayCirclesProps> = ({
  isVisible,
  visualSpeed = 10
}) => {
  const [isAlternate, setIsAlternate] = useState(false);
  
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (isVisible) {
      // Calculate interval based on visualSpeed (higher speed = shorter interval)
      const intervalTime = 2000 / Math.max(1, visualSpeed);
      
      intervalId = setInterval(() => {
        setIsAlternate(prev => !prev);
      }, intervalTime);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isVisible, visualSpeed]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
      <div className={`w-12 h-12 ${isAlternate ? 'bg-quantum-primary/30' : 'bg-quantum-primary/20'} rounded-full transition-colors duration-300`}></div>
      <div className={`w-24 h-24 ${isAlternate ? 'bg-quantum-primary/25' : 'bg-quantum-primary/15'} rounded-full transition-colors duration-300`}></div>
      <div className={`w-36 h-36 ${isAlternate ? 'bg-quantum-primary/15' : 'bg-quantum-primary/10'} rounded-full transition-colors duration-300`}></div>
    </div>
  );
};

export default StaticOverlayCircles;
