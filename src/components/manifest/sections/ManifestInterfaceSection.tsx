
import ManifestVisualizer from '../ManifestVisualizer';
import ManifestActions from '../ManifestActions';
import { ManifestPattern } from '@/data/manifestPatterns';

interface ManifestInterfaceSectionProps {
  currentImage: 'pattern' | 'receptor' | 'mix';
  isManifestActive: boolean;
  patternImage: string | null;
  patternImages: string[];
  receptorImage: string | null;
  receptorImages: string[];
  canStart: boolean;
  timeRemaining: number | null;
  startManifestation: () => void;
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
  
  // Debug log for canStart value, intention and other values
  console.log("ManifestInterfaceSection:", {
    canStart,
    intention,
    intentionLength: intention ? intention.length : 0,
    intentionValid: intention && intention.trim() !== "",
    isManifestActive,
    patternImages: patternImages.length,
    patternImage,
    selectedPattern
  });
  
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
        canStart={canStart}
        timeRemaining={timeRemaining}
        startManifestation={startManifestation}
        stopManifestation={stopManifestation}
        formatTimeRemaining={formatTimeRemaining}
        backgroundModeActive={backgroundModeActive}
        indefiniteTime={indefiniteTime}
        intention={intention} // Aseguramos pasar la intención al componente ManifestActions
      />
    </div>
  );
};

export default ManifestInterfaceSection;
