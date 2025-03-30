
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

  const hasRadionicImages = radionicImagesArray.length > 0;
  const hasReceptorImages = receptorImagesArray.length > 0;
  const hasImages = hasRadionicImages || hasReceptorImages;

  return (
    <div className="relative aspect-square w-full bg-black rounded-lg overflow-hidden">
      {/* Show blended images */}
      {hasImages && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {/* Always show a blend of both images instead of alternating */}
          <div className="absolute inset-0 flex items-center justify-center">
            {hasRadionicImages && radionicImagesArray.map((img, index) => (
              <img 
                key={`radionic-${index}`}
                src={img}
                alt={`Efecto radiónico ${index + 1}`}
                className="absolute inset-0 w-full h-full object-contain"
                style={{ 
                  opacity: 0.7 / radionicImagesArray.length,
                  mixBlendMode: 'screen',
                  filter: 'contrast(1.2) brightness(1.1)',
                }}
              />
            ))}
            
            {hasReceptorImages && receptorImagesArray.map((img, index) => (
              <img 
                key={`receptor-${index}`}
                src={img}
                alt={`Efecto receptor ${index + 1}`}
                className="absolute inset-0 w-full h-full object-contain"
                style={{ 
                  opacity: 0.7 / receptorImagesArray.length,
                  mixBlendMode: 'multiply',
                  filter: 'contrast(1.2) brightness(1.1)',
                }}
              />
            ))}
          </div>
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
      
      {/* Add keyframes for random-move animation directly in styles.css */}
      {/* RATES con movimiento aleatorio dentro de la imagen */}
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-full h-full max-w-[90%] max-h-[90%]">
          {rate1 && (
            <div className="absolute text-white font-mono bg-black/40 px-2 py-1 rounded text-sm md:text-base" 
                style={{ 
                  left: '20%',
                  top: '20%',
                  maxWidth: '80%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  animation: 'random-move 15s infinite alternate'
                }}>
              {rate1}
            </div>
          )}
          {rate2 && (
            <div className="absolute text-white font-mono bg-black/40 px-2 py-1 rounded text-sm md:text-base"
                style={{ 
                  left: '50%',
                  top: '40%',
                  maxWidth: '80%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  animation: 'random-move 18s infinite alternate-reverse'
                }}>
              {rate2}
            </div>
          )}
          {rate3 && (
            <div className="absolute text-white font-mono bg-black/40 px-2 py-1 rounded text-sm md:text-base"
                style={{ 
                  left: '30%',
                  top: '60%',
                  maxWidth: '80%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  animation: 'random-move 20s infinite'
                }}>
              {rate3}
            </div>
          )}
        </div>
      </div>
      
      {/* Texto de frecuencia que titila junto con las imágenes */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center max-w-[80%] z-20">
          <div className="text-white text-center font-semibold text-lg md:text-xl lg:text-2xl line-clamp-3 bg-black/30 px-3 py-2 rounded animate-pulse">
            Frecuencia: {frequency[0]} Hz
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentVisualizer;
