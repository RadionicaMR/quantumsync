
interface TreatmentVisualizerProps {
  isPlaying: boolean;
  visualFeedback: boolean;
  radionicImage: string | null;
  receptorImage: string | null;
  radionicImages: string[];
  receptorImages: string[];
  currentImage: 'radionic' | 'receptor' | 'mix';
  hypnoticEffect: boolean;
  frequency: number[];
  intensity: number[];
  rate1: string;
  rate2: string;
  rate3: string;
  hypnoticSpeed?: number[];
  receptorName?: string;
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
  hypnoticSpeed = [10],
  receptorName = '',
}: TreatmentVisualizerProps) => {
  if (!isPlaying || !visualFeedback) {
    return null;
  }

  // Use the multi-image arrays if they have content, otherwise fall back to the single image
  const radionicImagesArray = radionicImages.length > 0 ? radionicImages : (radionicImage ? [radionicImage] : []);
  const receptorImagesArray = receptorImages.length > 0 ? receptorImages : (receptorImage ? [receptorImage] : []);

  const hasRadionicImages = radionicImagesArray.length > 0;
  const hasReceptorImages = receptorImagesArray.length > 0;
  const hasImages = hasRadionicImages || hasReceptorImages || receptorName.trim().length > 0;

  // Calculate animation speed based on hypnotic speed - faster speed = shorter duration
  const animationDuration = Math.max(0.1, 20 / hypnoticSpeed[0]);
  
  // Calculate faster animation speed for RATE texts based on hypnotic speed
  const rateAnimationDuration = Math.max(5, 15 - hypnoticSpeed[0]);

  // Pulse animation duration based on hypnotic speed
  const pulseDuration = Math.max(0.5, 5 - (hypnoticSpeed[0] / 4));

  return (
    <div className="relative aspect-square w-full bg-black rounded-lg overflow-hidden">
      {/* Show blended images */}
      {hasImages && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {/* Show images with appropriate animation based on hypnoticEffect */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Mostrar imagen según el estado actual */}
            {currentImage === 'radionic' && hasRadionicImages && radionicImagesArray.map((img, index) => (
              <img 
                key={`radionic-${index}`}
                src={img}
                alt={`Efecto radiónico ${index + 1}`}
                className="absolute inset-0 w-full h-full object-contain"
                style={{ 
                  opacity: 0.9,
                  mixBlendMode: 'screen',
                  filter: 'contrast(1.2) brightness(1.1)',
                  transition: `opacity ${animationDuration/3}s ease-in-out`,
                  animation: `pulse ${pulseDuration}s infinite alternate ease-in-out`
                }}
              />
            ))}
            
            {currentImage === 'receptor' && hasReceptorImages && receptorImagesArray.map((img, index) => (
              <img 
                key={`receptor-${index}`}
                src={img}
                alt={`Efecto receptor ${index + 1}`}
                className="absolute inset-0 w-full h-full object-contain"
                style={{ 
                  opacity: 0.9,
                  mixBlendMode: 'multiply',
                  filter: 'contrast(1.2) brightness(1.1)',
                  transition: `opacity ${animationDuration/3}s ease-in-out`,
                  animation: `pulse ${pulseDuration}s infinite alternate-reverse ease-in-out`
                }}
              />
            ))}
            
            {currentImage === 'mix' && (
              <>
                {/* Superposición de ambas imágenes */}
                {hasRadionicImages && radionicImagesArray.map((img, index) => (
                  <img 
                    key={`radionic-mix-${index}`}
                    src={img}
                    alt={`Mezcla de imágenes radiónicas ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ 
                      opacity: 0.6,
                      mixBlendMode: 'screen',
                      filter: 'contrast(1.2) brightness(1.1)',
                      transition: `opacity ${animationDuration/3}s ease-in-out`,
                      animation: `pulse ${pulseDuration}s infinite alternate ease-in-out`
                    }}
                  />
                ))}
                
                {hasReceptorImages && receptorImagesArray.map((img, index) => (
                  <img 
                    key={`receptor-mix-${index}`}
                    src={img}
                    alt={`Mezcla de imágenes receptoras ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ 
                      opacity: 0.6,
                      mixBlendMode: 'multiply',
                      filter: 'contrast(1.2) brightness(1.1)',
                      transition: `opacity ${animationDuration/3}s ease-in-out`,
                      animation: `pulse ${pulseDuration}s infinite alternate-reverse ease-in-out`
                    }}
                  />
                ))}
              </>
            )}
            
            {/* Show receptor name when no images are available or when in receptor mode */}
            {receptorName && (!hasReceptorImages || currentImage === 'receptor') && (
              <div 
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  opacity: currentImage === 'mix' ? 0.8 : 1,
                  transition: `opacity ${animationDuration/3}s ease-in-out`,
                  animation: `pulse ${pulseDuration}s infinite alternate`
                }}
              >
                <div className="text-2xl font-bold text-white bg-black/50 px-6 py-4 rounded-lg">
                  {receptorName}
                </div>
              </div>
            )}
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
        Intensidad: {intensity[0]}%
      </div>
      
      {/* RATES con movimiento aleatorio dentro de la imagen */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-full h-full max-w-[90%] max-h-[90%]">
          {rate1 && (
            <div className="absolute text-blue-400 font-mono bg-black/60 px-3 py-2 rounded text-sm md:text-base shadow-lg border border-blue-500/30" 
                style={{ 
                  left: '20%',
                  top: '20%',
                  maxWidth: '80%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  animation: `random-move ${rateAnimationDuration}s infinite alternate`,
                  textShadow: '0 0 5px rgba(59, 130, 246, 0.7)'
                }}>
              {rate1}
            </div>
          )}
          {rate2 && (
            <div className="absolute text-blue-400 font-mono bg-black/60 px-3 py-2 rounded text-sm md:text-base shadow-lg border border-blue-500/30"
                style={{ 
                  left: '50%',
                  top: '40%',
                  maxWidth: '80%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  animation: `random-move ${rateAnimationDuration + 3}s infinite alternate-reverse`,
                  textShadow: '0 0 5px rgba(59, 130, 246, 0.7)'
                }}>
              {rate2}
            </div>
          )}
          {rate3 && (
            <div className="absolute text-blue-400 font-mono bg-black/60 px-3 py-2 rounded text-sm md:text-base shadow-lg border border-blue-500/30"
                style={{ 
                  left: '30%',
                  top: '60%',
                  maxWidth: '80%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  animation: `random-move ${rateAnimationDuration + 5}s infinite`,
                  textShadow: '0 0 5px rgba(59, 130, 246, 0.7)'
                }}>
              {rate3}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreatmentVisualizer;
