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
  intention?: string;
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
  intention = '',
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
      const speed = hypnoticSpeed[0] || 10;
      const intervalTime = Math.max(2000 / Math.max(1, speed * 5), 40); 
      
      console.log(`Setting up treatment image alternation interval: ${intervalTime}ms at speed ${speed}`);
      
      intervalId = setInterval(() => {
        setDisplayAlternate(prev => !prev);
      }, intervalTime);
    } else {
      setDisplayAlternate(false);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, hypnoticSpeed]);

  // Effect to handle smooth circular movement of intention text
  useEffect(() => {
    let animationId: number | null = null;
    
    if (isPlaying && intention && intention.trim().length > 0) {
      console.log("Starting smooth intention circular animation for:", intention);
      
      const animate = () => {
        const time = Date.now() * 0.001; // Convert to seconds for smoother animation
        const speed = (hypnoticSpeed[0] || 10) / 20; // Slower, more fluid movement
        
        // Calculate smooth circular position
        const radius = 30; // Slightly smaller radius for better visibility
        const centerX = 50;
        const centerY = 50;
        
        const angle = time * speed; // Continuous time-based animation
        
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        setIntentionPosition({ x, y });
        
        animationId = requestAnimationFrame(animate);
      };
      
      animationId = requestAnimationFrame(animate);
    } else {
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
    <div className={`relative aspect-square w-full bg-gradient-to-br from-black/80 to-black/60 rounded-lg overflow-hidden ${isIOS ? 'ios-momentum-scroll' : ''} border border-quantum-primary/20`}>
      {(hasImages || isPlaying) && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {hasRadionicImages && showRadionic && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              {radionicImagesArray.map((img, index) => (
                <img 
                  key={`radionic-${index}`}
                  src={img}
                  alt={`Efecto radiónico ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ 
                    opacity: 0.8,
                    mixBlendMode: 'screen',
                    filter: 'contrast(1.2) brightness(1.1)'
                  }}
                />
              ))}
            </div>
          )}
          
          {isPlaying && showRadionic && !hasRadionicImages && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-gradient-to-br from-quantum-primary/20 to-quantum-primary/10">
              <div className="text-xl text-quantum-primary font-medium bg-black/30 px-6 py-3 rounded-lg border border-quantum-primary/30">
                Patrón de Manifestación
              </div>
            </div>
          )}
          
          {showReceptor && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
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
              
              {hasReceptorName && (!hasReceptorImages) && showReceptor && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-2xl font-bold text-white bg-black/50 px-6 py-4 rounded-lg">
                    {receptorName}
                  </div>
                </div>
              )}
              
              {isPlaying && showReceptor && !hasReceptorImages && !hasReceptorName && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-gradient-to-br from-quantum-primary/20 to-quantum-primary/10">
                  <div className="text-xl text-quantum-primary font-medium bg-black/30 px-6 py-3 rounded-lg border border-quantum-primary/30">
                    Receptor Universal
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
        <div className={`w-12 h-12 ${displayAlternate ? 'bg-quantum-primary/60' : 'bg-quantum-primary/20'} rounded-full transition-colors duration-50`}></div>
        <div className={`w-24 h-24 ${displayAlternate ? 'bg-quantum-primary/40' : 'bg-quantum-primary/15'} rounded-full transition-colors duration-50`}></div>
        <div className={`w-36 h-36 ${displayAlternate ? 'bg-quantum-primary/20' : 'bg-quantum-primary/10'} rounded-full transition-colors duration-50`}></div>
      </div>

      {hasIntention && isPlaying && (
        <div 
          className="absolute z-[100] pointer-events-none"
          style={{ 
            left: `${intentionPosition.x}%`, 
            top: `${intentionPosition.y}%`,
            transform: 'translate(-50%, -50%)',
            transition: 'none' // Remove any CSS transitions for smoother animation
          }}
        >
          <p className="text-white text-sm md:text-base font-bold text-center whitespace-nowrap max-w-[250px] truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {intention}
          </p>
        </div>
      )}

      {hasIntention && !isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-[90] pointer-events-none">
          <div className="max-w-[80%] text-center">
            <p className="text-white text-lg md:text-xl font-medium drop-shadow-lg">{intention}</p>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-3 left-3 text-xs md:text-sm text-white z-40 font-mono bg-black/40 px-2 py-1 rounded">
        Frecuencia: {frequency[0]} Hz | Intensidad: {intensity[0]}%
        {hypnoticEffect && <span> | Velocidad: {hypnoticSpeed[0]}</span>}
      </div>
      
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
