
import { useEffect, useState } from 'react';

interface EnergyCircleProps {
  minSize?: number;
  maxSize?: number;
  minOpacity?: number;
  maxOpacity?: number;
  color?: string;
  className?: string;
}

const EnergyCircle = ({ 
  minSize = 50, 
  maxSize = 300, 
  minOpacity = 0.1, 
  maxOpacity = 0.3, 
  color = 'bg-quantum-primary',
  className = '',
}: EnergyCircleProps) => {
  const [style, setStyle] = useState({
    width: '0px',
    height: '0px',
    left: '0%',
    top: '0%',
    opacity: 0,
    animationDuration: '0s',
  });

  useEffect(() => {
    const size = Math.floor(Math.random() * (maxSize - minSize) + minSize);
    const left = Math.floor(Math.random() * 90) + 5;
    const top = Math.floor(Math.random() * 90) + 5;
    const opacity = Math.random() * (maxOpacity - minOpacity) + minOpacity;
    const animationDuration = Math.floor(Math.random() * 10) + 8;

    setStyle({
      width: `${size}px`,
      height: `${size}px`,
      left: `${left}%`,
      top: `${top}%`,
      opacity: opacity,
      animationDuration: `${animationDuration}s`,
    });
  }, [maxSize, minSize, maxOpacity, minOpacity]);

  return (
    <div
      className={`energy-circle ${color} ${className}`}
      style={{
        ...style,
        animationDuration: style.animationDuration,
      }}
    />
  );
};

export default EnergyCircle;
