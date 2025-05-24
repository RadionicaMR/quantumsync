
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useState } from 'react';

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
  intention?: string; // Add intention prop
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
  intention = '', // Default to empty string
}: TreatmentVisualizerProps) => {
  const { isIOS } = useIsMobile();
  const [displayAlternate, setDisplayAlternate] = useState(false);
  const [intentionPosition, setIntentionPosition] = useState({ x: 50, y: 50 });
  
  console.log("TreatmentVisualizer rendering with:", { 
    isPlaying, 
    visualFeedback, 
    currentImage, 
    hypnoticEffect,
    hasRadionicImage: !!radionicImage || radionicImages.length > 0,
    hasReceptorImage: !!receptorImage || receptorImages.length > 0,
    receptorName,
    intention,
    intentionLength: intention ? intention.length : 0
  });

  // Effect to handle image alternation when active
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (isPlaying) {
      // Always alternate images when playing, regardless of hypnoticEffect
      // Calculate interval based on hypnoticSpeed (higher speed = shorter interval)
      const speed = hypnoticSpeed[0] || 10;
      // More aggressive formula for faster alternation
      const intervalTime = Math.max(2000 / Math.max(1, speed * 5), 40); 
      
      console.log(`Setting up treatment image alternation interval: ${intervalTime}ms at speed ${speed}`);
      
      // Set up the alternating interval
      intervalId = setInterval(() => {
        setDisplayAlternate(prev => !prev);
      }, intervalTime);
    } else {
      // Reset to default display when inactive
      setDisplayAlternate(false);
    }
    
    // Clean up interval on unmount or when dependencies change
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, hypnoticSpeed]);

  // Effect to handle circular movement of intention text
  useEffect(() => {
    let animationId: number | null = null;
    let startTime: number | null = null;
    
    if (isPlaying && intention && intention.trim().length > 0) {
      console.log("Starting intention circular animation for:", intention);
      
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        
        // Calculate circular position based on time
        const speed = (hypnoticSpeed[0] || 10) / 10; // Normalize speed
        const angle = (elapsed * speed * 0.001) % (2 * Math.PI); // Full circle every few seconds
        
        // Calculate position on circle (centered at 50%, radius varies)
        const radius = 35; // Increased radius for better visibility
        const centerX = 50;
        const centerY = 50;
        
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        setIntentionPosition({ x, y });
        
        animationId = requestAnimationFrame(animate);
      };
      
      animationId = requestAnimationFrame(animate);
    } else {
      // Reset to center when not active
      setIntentionPosition({ x: 50, y: 50 });
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPlaying, intention, hypnoticSpeed]);

  const radionicImagesArray = radionicImages.length > 0 ? radionicImages : (radionicImage ? [radionicImage] : []);
  const receptorImagesArray = receptorImages.length > 0 ? receptorImages : (receptorImage ? [receptorImage] : []);

  const hasRadionicImages = radionicImagesArray.length > 0;
  const hasReceptorImages = receptorImagesArray.length > 0;
  const hasReceptorName = receptorName && receptorName.trim().length > 0;
  const hasIntention = intention && intention.trim().length > 0;
  const hasImages = hasRadionicImages || hasReceptorImages || hasReceptorName;
  
  console.log("Intention display check:", {
    hasIntention,
    intention,
    isPlaying,
    intentionPosition
  });
  
  // For mix view, show both radionic and receptor
  // For specific views, only show the selected type
  // When active and playing, use alternation based on displayAlternate state
  let showRadionic = currentImage === 'mix';
  let showReceptor = currentImage === 'mix';
  
  if (isPlaying) {
    if (displayAlternate) {
      showRadionic = false;
      showReceptor = true;
    } else {
      showRadionic = true;
      showReceptor = false;
    }
  } else {
    // Normal display logic when not active
    if (currentImage === 'radionic' || currentImage === 'pattern') {
      showRadionic = true;
    }
    if (currentImage === 'receptor') {
      showReceptor = true;
    }
  }

  // Always show visualizer when playing
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
      
      {/* Animated circular overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
        <div className={`w-12 h-12 ${displayAlternate ? 'bg-quantum-primary/60' : 'bg-quantum-primary/20'} rounded-full transition-colors duration-50`}></div>
        <div className={`w-24 h-24 ${displayAlternate ? 'bg-quantum-primary/40' : 'bg-quantum-primary/15'} rounded-full transition-colors duration-50`}></div>
        <div className={`w-36 h-36 ${displayAlternate ? 'bg-quantum-primary/20' : 'bg-quantum-primary/10'} rounded-full transition-colors duration-50`}></div>
      </div>

      {/* Display intention moving in circles when provided and playing - HIGHEST Z-INDEX */}
      {hasIntention && isPlaying && (
        <div 
          className="absolute z-[100] pointer-events-none transition-all duration-100 ease-linear"
          style={{ 
            left: `${intentionPosition.x}%`, 
            top: `${intentionPosition.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 rounded-lg backdrop-blur-sm border-2 border-yellow-300 shadow-2xl">
            <p className="text-black text-sm md:text-base font-bold text-center whitespace-nowrap max-w-[250px] truncate drop-shadow-lg">
              {intention}
            </p>
          </div>
        </div>
      )}

      {/* Display intention static when not playing */}
      {hasIntention && !isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-[90] pointer-events-none">
          <div className="max-w-[80%] text-center bg-black/60 px-6 py-4 rounded-lg backdrop-blur-sm">
            <p className="text-white text-lg md:text-xl font-medium">{intention}</p>
          </div>
        </div>
      )}
      
      {/* Información y RATES */}
      <div className="absolute bottom-3 left-3 text-xs md:text-sm text-white z-40 font-mono bg-black/40 px-2 py-1 rounded">
        Frecuencia: {frequency[0]} Hz | Intensidad: {intensity[0]}%
        {hypnoticEffect && <span> | Velocidad: {hypnoticSpeed[0]}</span>}
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
