
import ManifestVisualizer from '../ManifestVisualizer';
import ManifestActions from '../ManifestActions';
import { ManifestPattern } from '@/data/manifestPatterns';
import { useEffect } from 'react';

interface ManifestInterfaceSectionProps {
  currentImage: 'pattern' | 'receptor' | 'mix';
  isManifestActive: boolean;
  patternImage: string | null;
  patternImages: string[];
  receptorImage: string | null;
  receptorImages: string[];
  canStart: boolean;
  timeRemaining: number | null;
  startManifestation: (intention?: string) => void;
  stopManifestation: () => void;
  formatTimeRemaining: (time: number) => string;
  backgroundModeActive?: boolean;
  // Added properties to resolve type errors
  selectedPattern: string;
  patterns: ManifestPattern[];
  manifestPatterns: Record<string, string>;
  intention: string;
  manifestSound: boolean;
  manifestFrequency: number[];
  exposureTime: number[];
  manifestSpeed: number[];
  visualSpeed?: number[];
  rate1?: string; 
  rate2?: string;
  rate3?: string;
  receptorName?: string;
  indefiniteTime?: boolean;
}

const ManifestInterfaceSection: React.FC<ManifestInterfaceSectionProps> = ({
  currentImage,
  isManifestActive,
  patternImage,
  patternImages,
  receptorImage,
  receptorImages,
  canStart,
  timeRemaining,
  startManifestation,
  stopManifestation,
  formatTimeRemaining,
  backgroundModeActive = false,
  // Added props
  selectedPattern,
  patterns,
  manifestPatterns,
  intention,
  manifestSound,
  manifestFrequency,
  exposureTime,
  manifestSpeed,
  visualSpeed = [10],
  rate1 = "",
  rate2 = "",
  rate3 = "",
  receptorName = "",
  indefiniteTime = false
}) => {
  // Convert manifestPatterns record to array if needed
  const patternsArray = Array.isArray(patterns) ? patterns : [];
  
  // Log intention changes for debugging
  useEffect(() => {
    console.log("ManifestInterfaceSection - Intention actualizada:", {
      intention,
      intentionLength: intention ? intention.length : 0,
      intentionValid: intention && intention.trim() !== "",
    });
  }, [intention]);
  
  // Verificación de patrón
  const hasPattern = Boolean(
    (selectedPattern && selectedPattern !== "") || 
    patternImage !== null || 
    (patternImages && patternImages.length > 0)
  );
  
  // Debug log for pattern verification
  console.log("ManifestInterfaceSection RENDER - Verificación de patrón:", {
    canStart,
    intention,
    intentionLength: intention ? intention.length : 0,
    intentionValid: intention && intention.trim() !== "",
    isManifestActive,
    hasPattern,
    patternImagesLength: patternImages.length,
    patternImage,
    selectedPattern,
    patternImages
  });
  
  // CRUCIAL: Explícitamente pasar la intención cuando se inicia la manifestación
  const handleStartManifestation = () => {
    console.log("ManifestInterfaceSection - Iniciando con intención:", intention);
    if (intention && intention.trim() !== "") {
      // CORRECCIÓN: Verificación explícita de patrones
      if (hasPattern) {
        console.log("ManifestInterfaceSection - Patrón verificado, iniciando manifestación");
        startManifestation(intention);
      } else {
        console.error("Error: No se encontró patrón para iniciar manifestación");
      }
    }
  };
  
  return (
    <div className="bg-card/90 dark:bg-black/40 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Interfaz de Manifestación</h3>
      
      <ManifestVisualizer
        currentImage={currentImage}
        patternImage={patternImage}
        patternImages={patternImages}
        receptorImage={receptorImage}
        receptorImages={receptorImages}
        isActive={isManifestActive}
        selectedPattern={selectedPattern}
        patterns={patternsArray}
        manifestPatterns={manifestPatterns}
        intention={intention}
        manifestSound={manifestSound}
        manifestFrequency={manifestFrequency}
        exposureTime={exposureTime}
        manifestSpeed={manifestSpeed}
        visualSpeed={visualSpeed}
        rate1={rate1}
        rate2={rate2}
        rate3={rate3}
        receptorName={receptorName}
      />
      
      <ManifestActions 
        isManifestActive={isManifestActive}
        canStart={hasPattern && intention && intention.trim() !== ""}
        timeRemaining={timeRemaining}
        startManifestation={handleStartManifestation}
        stopManifestation={stopManifestation}
        formatTimeRemaining={formatTimeRemaining}
        backgroundModeActive={backgroundModeActive}
        indefiniteTime={indefiniteTime}
        intention={intention}
      />
    </div>
  );
};

export default ManifestInterfaceSection;
