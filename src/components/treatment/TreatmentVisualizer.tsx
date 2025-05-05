
import { useIsMobile } from '@/hooks/use-mobile';

interface TreatmentVisualizerProps {
  isPlaying: boolean;
  visualFeedback: boolean;
  radionicImage: string | null;
  receptorImage: string | null;
  radionicImages: string[];
  receptorImages: string[];
  currentImage: 'radionic' | 'receptor' | 'mix' | 'pattern';
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
  const { isIOS } = useIsMobile();
  
  console.log("TreatmentVisualizer rendering with:", { 
    isPlaying, 
    visualFeedback, 
    currentImage, 
    hypnoticEffect,
    hasRadionicImage: !!radionicImage || radionicImages.length > 0,
    hasReceptorImage: !!receptorImage || receptorImages.length > 0,
    receptorName
  });

  // Use the multi-image arrays if they have content, otherwise fall back to the single image
  const radionicImagesArray = radionicImages.length > 0 ? radionicImages : (radionicImage ? [radionicImage] : []);
  const receptorImagesArray = receptorImages.length > 0 ? receptorImages : (receptorImage ? [receptorImage] : []);

  const hasRadionicImages = radionicImagesArray.length > 0;
  const hasReceptorImages = receptorImagesArray.length > 0;
  const hasReceptorName = receptorName && receptorName.trim().length > 0;
  const hasImages = hasRadionicImages || hasReceptorImages || hasReceptorName;
  
  // For mix view, show both radionic and receptor
  // For specific views, only show the selected type
  const showRadionic = currentImage === 'mix' || currentImage === 'radionic' || currentImage === 'pattern';
  const showReceptor = currentImage === 'mix' || currentImage === 'receptor';

  // Eliminar la comprobación de visualFeedback para que siempre muestre el visualizador
  // cuando isPlaying sea true, independientemente de visualFeedback
  if (!isPlaying) {
    return (
      <div className="relative aspect-square w-full bg-black/10 dark:bg-black/20 rounded-lg overflow-hidden flex items-center justify-center">
        <p className="text-center text-muted-foreground px-4">
          Complete los campos requeridos y haga clic en Iniciar Manifestación.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative aspect-square w-full bg-black rounded-lg overflow-hidden ${isIOS ? 'ios-momentum-scroll' : ''}`}>
      {/* Show blended images */}
      {(hasImages || isPlaying) && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {/* Radionic Images - Show based on currentImage */}
          {hasRadionicImages && showRadionic && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              {radionicImagesArray.map((img, index) => (
                <img 
                  key={`radionic-${index}`}
                  src={img}
                  alt={`Efecto radiónico ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ 
                    opacity: 1,
                    mixBlendMode: 'screen',
                    filter: 'contrast(1.2) brightness(1.1)'
                  }}
                />
              ))}
            </div>
          )}
          
          {/* Si no hay imágenes radionicas pero estamos en modo activo, mostrar un mensaje */}
          {isPlaying && showRadionic && !hasRadionicImages && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/40">
              <div className="text-xl text-quantum-primary font-medium bg-black/50 px-6 py-3 rounded-lg">
                Patrón de Manifestación
              </div>
            </div>
          )}
          
          {/* Receptor Images - Show based on currentImage */}
          {showReceptor && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              {/* Show receptor images if available */}
              {hasReceptorImages && receptorImagesArray.map((img, index) => (
                <img 
                  key={`receptor-${index}`}
                  src={img}
                  alt={`Efecto receptor ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ 
                    opacity: 1,
                    mixBlendMode: 'multiply',
                    filter: 'contrast(1.2) brightness(1.1)'
                  }}
                />
              ))}
              
              {/* Show receptor name when needed */}
              {hasReceptorName && (!hasReceptorImages) && showReceptor && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-2xl font-bold text-white bg-black/50 px-6 py-4 rounded-lg">
                    {receptorName}
                  </div>
                </div>
              )}
              
              {/* Si no hay imágenes de receptor ni nombre pero estamos en modo activo, mostrar un mensaje */}
              {isPlaying && showReceptor && !hasReceptorImages && !hasReceptorName && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40">
                  <div className="text-xl text-quantum-primary font-medium bg-black/50 px-6 py-3 rounded-lg">
                    Receptor Universal
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Static circular overlay instead of animated */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
        <div className="w-12 h-12 bg-quantum-primary/20 rounded-full"></div>
        <div className="w-24 h-24 bg-quantum-primary/15 rounded-full"></div>
        <div className="w-36 h-36 bg-quantum-primary/10 rounded-full"></div>
      </div>
      
      {/* Información y RATES */}
      <div className="absolute bottom-3 left-3 text-xs md:text-sm text-white z-40 font-mono bg-black/40 px-2 py-1 rounded">
        Frecuencia: {frequency[0]} Hz | Intensidad: {intensity[0]}%
      </div>
      
      {/* RATES sin animación */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
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
