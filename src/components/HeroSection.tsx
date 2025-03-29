
import { ReactNode } from 'react';
import EnergyCircle from './EnergyCircle';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  children?: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  energyCircles?: number;
}

const HeroSection = ({ 
  title, 
  subtitle, 
  children, 
  className = '', 
  align = 'center',
  energyCircles = 5,
}: HeroSectionProps) => {
  const alignment = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <div className={`relative w-full overflow-hidden py-12 md:py-24 px-4 ${className}`}>
      {/* Energy circles */}
      {Array.from({ length: energyCircles }).map((_, i) => (
        <EnergyCircle key={i} />
      ))}
      
      {/* Estrellas con brillo holográfico */}
      <div className="stars-container absolute inset-0 z-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              background: `radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(155,135,245,0.8) 50%, rgba(155,135,245,0) 100%)`,
              boxShadow: '0 0 10px 3px rgba(155,135,245,0.6)',
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>
      
      <div className={`container mx-auto relative z-10 flex flex-col ${alignment[align]} gap-6`}>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold holographic-gradient max-w-4xl">
          {title}
        </h1>
        <p className="text-lg md:text-xl neon-text max-w-2xl">
          {subtitle}
        </p>
        {children}
      </div>
    </div>
  );
};

export default HeroSection;
