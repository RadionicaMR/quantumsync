
import React, { useEffect, useCallback, memo } from 'react';
import CustomManifestLeftPanel from './sections/CustomManifestLeftPanel';
import TreatmentVisualizer from '@/components/treatment/TreatmentVisualizer';
import { ManifestPattern } from '@/data/manifestPatterns';
import { toast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';

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
  // Envoltura memoizada para startManifestation con validación previa
  const handleStartManifestation = useCallback(() => {
    console.log("CustomManifest - Verificación pre-start:", {
      intention,
      intentionLength: intention ? intention.length : 0,
      intentionValid: intention && intention.trim() !== "",
      patternImage,
      patternImagesCount: patternImages ? patternImages.length : 0,
      patternImages,
    });
    
    // IMPORTANTE: Solo validamos la intención, eliminamos la validación de patrón
    if (intention && intention.trim() !== "") {
      console.log("CustomManifest - Iniciando con intención:", intention);
      startManifestation(intention);
    } else {
      toast({
        title: "No se puede iniciar la manifestación",
        description: "Asegúrate de tener una intención definida.",
        variant: "destructive",
      });
    }
  }, [intention, startManifestation]);
                  
  // Calculated values - solo validamos la intención
  const isIntentionValid = Boolean(intention && intention.trim() !== "");
  const canStart = isIntentionValid;

  // Adjust the current image for Treatment Visualizer compatibility
  const normalizedCurrentImage = currentImage === 'radionic' ? 'pattern' : currentImage;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Panel izquierdo: configuraciones */}
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
      
      {/* Panel derecho: Visualizador de tratamiento adaptado para manifestación */}
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
            visualFeedback={true}
            radionicImage={patternImage}
            receptorImage={receptorImage}
            radionicImages={patternImages}
            receptorImages={receptorImages}
            currentImage={normalizedCurrentImage}
            hypnoticEffect={isManifestActive}
            frequency={manifestFrequency}
            intensity={visualSpeed}
            rate1={rate1}
            rate2={rate2}
            rate3={rate3}
            hypnoticSpeed={visualSpeed}
            receptorName={receptorName}
          />
        </Card>
      </div>
    </div>
  );
});

CustomManifest.displayName = 'CustomManifest';

export default CustomManifest;
