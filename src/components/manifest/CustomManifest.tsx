
import React, { useEffect, useCallback, memo } from 'react';
import CustomManifestLeftPanel from './sections/CustomManifestLeftPanel';
import TreatmentVisualizer from '@/components/treatment/TreatmentVisualizer';
import { ManifestPattern } from '@/data/manifestPatterns';
import { toast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import ManifestActions from './ManifestActions';

interface CustomManifestProps {
  intention: string;
  setIntention: (intention: string) => void;
  patternImage: string | null;
  setPatternImage: (image: string | null) => void;
  patternImages: string[];
  setPatternImages: (images: string[]) => void;
  receptorImage: string | null;
  setReceptorImage: (image: string | null) => void;
  receptorImages: string[];
  setReceptorImages: (images: string[]) => void;
  manifestSound: boolean;
  setManifestSound: (sound: boolean) => void;
  manifestFrequency: number[];
  setManifestFrequency: (frequency: number[]) => void;
  visualSpeed: number[];
  setVisualSpeed: (speed: number[]) => void;
  exposureTime: number[];
  setExposureTime: (time: number[]) => void;
  rate1: string;
  setRate1: (rate: string) => void;
  rate2: string;
  setRate2: (rate: string) => void;
  rate3: string;
  setRate3: (rate: string) => void;
  isManifestActive: boolean;
  timeRemaining: number | null;
  startManifestation: (intention?: string) => void;
  stopManifestation: () => void;
  formatTimeRemaining: (time: number) => string;
  currentImage: 'pattern' | 'receptor' | 'mix' | 'radionic';
  receptorName: string;
  setReceptorName: (name: string) => void;
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  audioVolume: number;
  setAudioVolume: (vol: number) => void;
  audioSubliminalPlaying: boolean;
  playSubliminalAudio: () => void;
  stopSubliminalAudio: () => void;
  audioLoop: boolean;
  setAudioLoop: (loop: boolean) => void;
  clearAudio: () => void;
  backgroundModeActive?: boolean;
  patterns?: ManifestPattern[];
  indefiniteTime?: boolean;
  setIndefiniteTime?: (value: boolean) => void;
}

// Memoize the component to prevent unnecessary re-renders
const CustomManifest = memo(({
  intention,
  setIntention,
  patternImage,
  setPatternImage,
  patternImages,
  setPatternImages,
  receptorImage,
  setReceptorImage,
  receptorImages,
  setReceptorImages,
  manifestSound,
  setManifestSound,
  manifestFrequency,
  setManifestFrequency,
  visualSpeed,
  setVisualSpeed,
  exposureTime,
  setExposureTime,
  rate1,
  setRate1,
  rate2,
  setRate2,
  rate3,
  setRate3,
  isManifestActive,
  timeRemaining,
  startManifestation,
  stopManifestation,
  formatTimeRemaining,
  currentImage,
  receptorName,
  setReceptorName,
  audioFile,
  setAudioFile,
  audioVolume,
  setAudioVolume,
  audioSubliminalPlaying,
  playSubliminalAudio,
  stopSubliminalAudio,
  audioLoop,
  setAudioLoop,
  clearAudio,
  backgroundModeActive = false,
  patterns = [],
  indefiniteTime = false,
  setIndefiniteTime = () => {}
}: CustomManifestProps) => {
  // Wrapper for startManifestation with validation
  const handleStartManifestation = useCallback(() => {
    console.log("CustomManifest - Pre-start verification:", {
      intention,
      intentionLength: intention ? intention.length : 0,
      intentionValid: intention && intention.trim() !== "",
      patternImage,
      receptorImage
    });
    
    // Pass intention explicitly to startManifestation
    if (intention && intention.trim() !== "") {
      console.log("CustomManifest - Starting with intention:", intention);
      startManifestation(intention);
    } else {
      toast({
        title: "No se puede iniciar la manifestación",
        description: "Asegúrate de tener una intención definida.",
        variant: "destructive",
      });
    }
  }, [intention, startManifestation]);
                  
  // Calculated values - only validate intention
  const isIntentionValid = Boolean(intention && intention.trim() !== "");
  const canStart = isIntentionValid;

  // Log when manifest active state changes
  useEffect(() => {
    console.log("CustomManifest - isManifestActive changed:", isManifestActive);
  }, [isManifestActive]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left panel: configuration */}
      <CustomManifestLeftPanel
        intention={intention}
        setIntention={setIntention}
        manifestSound={manifestSound}
        setManifestSound={setManifestSound}
        manifestFrequency={manifestFrequency}
        setManifestFrequency={setManifestFrequency}
        visualSpeed={visualSpeed}
        setVisualSpeed={setVisualSpeed}
        exposureTime={exposureTime}
        setExposureTime={setExposureTime}
        rate1={rate1}
        setRate1={setRate1}
        rate2={rate2}
        setRate2={setRate2}
        rate3={rate3}
        setRate3={setRate3}
        isManifestActive={isManifestActive}
        patternImage={patternImage}
        setPatternImage={setPatternImage}
        patternImages={patternImages}
        setPatternImages={setPatternImages}
        receptorImage={receptorImage}
        setReceptorImage={setReceptorImage}
        receptorImages={receptorImages}
        setReceptorImages={setReceptorImages}
        receptorName={receptorName}
        setReceptorName={setReceptorName}
        audioFile={audioFile}
        setAudioFile={setAudioFile}
        audioVolume={audioVolume}
        setAudioVolume={setAudioVolume}
        audioSubliminalPlaying={audioSubliminalPlaying}
        playSubliminalAudio={playSubliminalAudio}
        stopSubliminalAudio={stopSubliminalAudio}
        audioLoop={audioLoop}
        setAudioLoop={setAudioLoop}
        clearAudio={clearAudio}
        indefiniteTime={indefiniteTime}
        setIndefiniteTime={setIndefiniteTime}
        timeRemaining={timeRemaining}
        startManifestation={handleStartManifestation}
        stopManifestation={stopManifestation}
        formatTimeRemaining={formatTimeRemaining}
        canStart={canStart}
      />
      
      {/* Right panel: Treatment Visualizer adapted for manifestation */}
      <div className="lg:col-span-2">
        <Card className="bg-card/80 dark:bg-black/40 rounded-lg p-6 mb-4">
          <h3 className="text-xl font-semibold mb-2 text-center">Visualizador de Manifestación Cuántica</h3>
          <p className="text-muted-foreground text-center mb-4">
            {isManifestActive 
              ? "Manifestación en curso. Visualizando patrones cuánticos..." 
              : "Complete los campos requeridos y haga clic en Iniciar Manifestación."}
          </p>
          
          <TreatmentVisualizer
            isPlaying={isManifestActive}
            visualFeedback={true} // Always true to show visualizer
            radionicImage={patternImage}
            receptorImage={receptorImage}
            radionicImages={patternImages}
            receptorImages={receptorImages}
            currentImage={currentImage} // Use the actual currentImage value
            hypnoticEffect={false} // No hypnotic effect for personal manifestation
            frequency={manifestFrequency}
            intensity={visualSpeed}
            rate1={rate1}
            rate2={rate2}
            rate3={rate3}
            hypnoticSpeed={visualSpeed}
            receptorName={receptorName}
          />
        </Card>
        
        {/* Single ManifestActions component */}
        <Card className="bg-card/90 dark:bg-black/40 p-4 rounded-lg mt-4">
          <ManifestActions
            isManifestActive={isManifestActive}
            canStart={canStart}
            timeRemaining={timeRemaining}
            startManifestation={handleStartManifestation}
            stopManifestation={stopManifestation}
            formatTimeRemaining={formatTimeRemaining}
            backgroundModeActive={backgroundModeActive}
            indefiniteTime={indefiniteTime}
            intention={intention}
          />
        </Card>
      </div>
    </div>
  );
});

CustomManifest.displayName = 'CustomManifest';

export default CustomManifest;
