
import { ReactNode } from 'react';
import EnergyCircle from './EnergyCircle';
import DowsingRing from './quantum/DowsingRing';

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
    <div className={`relative w-full overflow-hidden py-24 md:py-32 px-4 bg-quantum-dark/90 ${className}`}>
      {/* Fondo galáctico mejorado */}
      <div className="absolute inset-0 z-0 bg-black">
        {/* Nebulosa cósmica */}
        <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-purple-900 via-blue-900 to-black mix-blend-multiply"></div>
        
        {/* Estrellas distantes */}
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={`distant-star-${i}`}
            className="absolute rounded-full animate-pulse-soft"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>
      
      {/* Energy circles */}
      {Array.from({ length: energyCircles }).map((_, i) => (
        <EnergyCircle key={i} />
      ))}
      
      {/* Anillos dowsing decorativos */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-50 pointer-events-none">
        <DowsingRing inset={50} opacity="80" reverse={false} duration="20s" pulseEffect={true} />
        <DowsingRing inset={100} opacity="60" reverse={true} duration="25s" />
        <DowsingRing inset={150} opacity="40" reverse={false} duration="30s" />
        <DowsingRing inset={200} opacity="20" reverse={true} duration="35s" />
      </div>
      
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
        <div className="cosmic-glow">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold holographic-gradient max-w-4xl drop-shadow-glow">
            {title}
          </h1>
        </div>
        <p className="text-lg md:text-xl neon-text max-w-2xl">
          {subtitle}
        </p>
        {children}
      </div>
    </div>
  );
};

export default HeroSection;
