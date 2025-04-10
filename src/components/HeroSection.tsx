
import { ReactNode } from 'react';
import DowsingRing from './quantum/DowsingRing';
import EnergyCircle from './EnergyCircle';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  children?: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  energyCircles?: number;
}

const BackgroundStar = ({ index }: { index: number }) => {
  const randomSize = Math.random() * 2 + 1;
  
  return (
    <div
      key={`distant-star-${index}`}
      className="absolute rounded-full animate-pulse-soft"
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        width: `${randomSize}px`,
        height: `${randomSize}px`,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${Math.random() * 3 + 2}s`,
      }}
    />
  );
};

const GalacticBackground = () => {
  return (
    <div className="absolute inset-0 z-0 bg-black">
      {/* Nebulosa cósmica */}
      <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-purple-900 via-blue-900 to-black mix-blend-multiply"></div>
      
      {/* Estrellas distantes - reducidas */}
      {Array.from({ length: 20 }).map((_, i) => (
        <BackgroundStar key={i} index={i} />
      ))}
    </div>
  );
};

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
    <div className={`relative w-full overflow-hidden py-6 md:py-10 px-4 bg-quantum-dark/90 ${className}`}>
      {/* Fondo galáctico */}
      <GalacticBackground />
      
      {/* Anillos dowsing decorativos - smaller and fewer */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] opacity-30 pointer-events-none">
        <DowsingRing inset={30} opacity="60" reverse={false} duration="20s" pulseEffect={true} />
      </div>
      
      <div className={`container mx-auto relative z-10 flex flex-col ${alignment[align]} gap-2`}>
        <div className="cosmic-glow">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold holographic-gradient max-w-4xl drop-shadow-glow">
            {title}
          </h1>
        </div>
        <p className="text-sm md:text-base neon-text max-w-2xl">
          {subtitle}
        </p>
        {children}
      </div>
    </div>
  );
};

export default HeroSection;
