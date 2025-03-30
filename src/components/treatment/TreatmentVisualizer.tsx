
interface TreatmentVisualizerProps {
  isPlaying: boolean;
  visualFeedback: boolean;
  radionicImage: string | null;
  receptorImage: string | null;
  radionicImages: string[];
  receptorImages: string[];
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
  radionicImages = [],
  receptorImages = [],
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

  // Use the multi-image arrays if they have content, otherwise fall back to the single image
  const radionicImagesArray = radionicImages.length > 0 ? radionicImages : (radionicImage ? [radionicImage] : []);
  const receptorImagesArray = receptorImages.length > 0 ? receptorImages : (receptorImage ? [receptorImage] : []);

  const hasImages = radionicImagesArray.length > 0 || receptorImagesArray.length > 0;

  return (
    <div className="mt-4 relative h-64 md:h-80 lg:h-96 w-full bg-black/10 dark:bg-white/5 rounded-lg overflow-hidden">
      {/* Efectos con las imágenes */}
      {hasImages && hypnoticEffect && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {currentImage === 'radionic' && radionicImagesArray.map((img, index) => (
            <img 
              key={`radionic-${index}`}
              src={img}
              alt={`Efecto radiónico ${index + 1}`}
              className="absolute inset-0 w-full h-full object-contain transition-opacity duration-100 animate-pulse"
              style={{ 
                opacity: 0.8 / radionicImagesArray.length,
                filter: 'contrast(1.2) brightness(1.1)',
                animationDelay: `${index * 0.3}s`
              }}
            />
          ))}
          
          {currentImage === 'receptor' && receptorImagesArray.map((img, index) => (
            <img 
              key={`receptor-${index}`}
              src={img}
              alt={`Efecto receptor ${index + 1}`}
              className="absolute inset-0 w-full h-full object-contain transition-opacity duration-100 animate-pulse"
              style={{ 
                opacity: 0.8 / receptorImagesArray.length,
                filter: 'contrast(1.2) brightness(1.1)',
                animationDelay: `${index * 0.3}s`
              }}
            />
          ))}
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
          <div className="relative w-full h-full max-w-[80%] max-h-[80%]">
            {rate1 && (
              <div className="absolute text-white font-mono bg-black/40 px-2 py-1 rounded animate-spin-slow text-sm md:text-base" 
                  style={{ 
                    left: '50%', 
                    top: '15%',
                    transform: 'translateX(-50%) rotate(0deg)', 
                    transformOrigin: 'center 8rem',
                    maxWidth: '90%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                {rate1}
              </div>
            )}
            {rate2 && (
              <div className="absolute text-white font-mono bg-black/40 px-2 py-1 rounded animate-spin-slow text-sm md:text-base"
                  style={{ 
                    left: '50%', 
                    top: '15%',
                    transform: 'translateX(-50%) rotate(120deg)', 
                    transformOrigin: 'center 8rem',
                    animationDelay: '0.5s',
                    animationDirection: 'reverse',
                    maxWidth: '90%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                {rate2}
              </div>
            )}
            {rate3 && (
              <div className="absolute text-white font-mono bg-black/40 px-2 py-1 rounded animate-spin-slow text-sm md:text-base"
                  style={{ 
                    left: '50%', 
                    top: '15%',
                    transform: 'translateX(-50%) rotate(240deg)', 
                    transformOrigin: 'center 8rem',
                    animationDelay: '1s',
                    maxWidth: '90%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
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
