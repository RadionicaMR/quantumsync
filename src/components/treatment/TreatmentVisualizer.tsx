
interface TreatmentVisualizerProps {
  isPlaying: boolean;
  visualFeedback: boolean;
  radionicImage: string | null;
  receptorImage: string | null;
  currentImage: 'radionic' | 'receptor';
  hypnoticEffect: boolean;
  frequency: number[];
  intensity: number[];
  rate1: string;
  rate2: string;
  rate3: string;
}

const TreatmentVisualizer = ({
  isPlaying,
  visualFeedback,
  radionicImage,
  receptorImage,
  currentImage,
  hypnoticEffect,
  frequency,
  intensity,
  rate1,
  rate2,
  rate3,
}: TreatmentVisualizerProps) => {
  if (!isPlaying || !visualFeedback) {
    return null;
  }

  return (
    <div className="mt-4 relative h-64 md:h-80 lg:h-96 w-full bg-black/10 dark:bg-white/5 rounded-lg overflow-hidden">
      {/* Efecto hipnótico con las imágenes */}
      {radionicImage && receptorImage && hypnoticEffect && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <img 
            src={currentImage === 'radionic' ? radionicImage : receptorImage}
            alt={currentImage === 'radionic' ? "Efecto radiónico" : "Efecto receptor"}
            className="w-full h-full object-contain transition-opacity duration-100 animate-pulse"
            style={{ 
              opacity: 0.8,
              filter: 'contrast(1.2) brightness(1.1)'
            }}
          />
        </div>
      )}
      
      {/* Overlay con los pulsos circulares */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="w-12 h-12 bg-quantum-primary/20 rounded-full animate-ping"></div>
        <div className="w-24 h-24 bg-quantum-primary/15 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-36 h-36 bg-quantum-primary/10 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
      </div>
      
      {/* Información y RATES */}
      <div className="absolute bottom-3 left-3 text-xs md:text-sm text-white z-20 font-mono bg-black/40 px-2 py-1 rounded">
        Frecuencia: {frequency[0]} Hz · Intensidad: {intensity[0]}%
      </div>
      
      {/* RATES girando en círculo */}
      {(rate1 || rate2 || rate3) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-64 h-64">
            {rate1 && (
              <div className="absolute text-white font-mono bg-black/40 px-2 py-1 rounded animate-spin-slow" 
                  style={{ 
                    left: '50%', 
                    top: '10%',
                    transform: 'translateX(-50%) rotate(0deg)', 
                    transformOrigin: 'center 10rem' 
                  }}>
                {rate1}
              </div>
            )}
            {rate2 && (
              <div className="absolute text-white font-mono bg-black/40 px-2 py-1 rounded animate-spin-slow"
                  style={{ 
                    left: '50%', 
                    top: '10%',
                    transform: 'translateX(-50%) rotate(120deg)', 
                    transformOrigin: 'center 10rem',
                    animationDelay: '0.5s',
                    animationDirection: 'reverse'
                  }}>
                {rate2}
              </div>
            )}
            {rate3 && (
              <div className="absolute text-white font-mono bg-black/40 px-2 py-1 rounded animate-spin-slow"
                  style={{ 
                    left: '50%', 
                    top: '10%',
                    transform: 'translateX(-50%) rotate(240deg)', 
                    transformOrigin: 'center 10rem',
                    animationDelay: '1s'
                  }}>
                {rate3}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TreatmentVisualizer;
