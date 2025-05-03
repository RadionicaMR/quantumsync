
import React, { useEffect, useCallback } from 'react';
import CustomManifestLeftPanel from './sections/CustomManifestLeftPanel';
import ManifestInterfaceSection from './sections/ManifestInterfaceSection';
import { ManifestPattern } from '@/data/manifestPatterns';
import { toast } from '@/components/ui/use-toast';

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
  currentImage: 'pattern' | 'receptor' | 'mix';
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

const CustomManifest: React.FC<CustomManifestProps> = ({
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
}) => {
  // Log para rastrear el valor de intención cuando cambia
  useEffect(() => {
    console.log("CustomManifest - intention actualizado:", {
      intention,
      intentionLength: intention ? intention.length : 0,
      intentionValid: intention && intention.trim() !== "",
      patternImage,
      patternImagesCount: patternImages ? patternImages.length : 0
    });
  }, [intention, patternImage, patternImages]);
  
  // Envoltura memoizada para startManifestation con validación previa
  const handleStartManifestation = useCallback(() => {
    console.log("CustomManifest - Verificación pre-start:", {
      intention,
      intentionLength: intention ? intention.length : 0,
      intentionValid: intention && intention.trim() !== "",
      patternImage,
      patternImagesCount: patternImages ? patternImages.length : 0
    });
    
    // Verificación adicional para asegurar que tenemos un patrón válido
    if (!patternImage && (!patternImages || patternImages.length === 0)) {
      toast({
        title: "No se puede iniciar la manifestación",
        description: "Necesitas subir al menos una imagen de patrón.",
        variant: "destructive",
      });
      return;
    }
    
    // IMPORTANTE: Pasamos la intención como argumento al hook
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
  }, [intention, startManifestation, patternImage, patternImages]);
                  
  // Debug log para verificar el cálculo de canStart
  console.log("CustomManifest - RENDER:", {
    intentionValid: intention && intention.trim() !== "",
    patternImageExists: patternImage !== null,
    patternImagesCount: patternImages.length,
    intention: intention,
    intentionLength: intention ? intention.length : 0
  });

  // Create manifest patterns record
  const manifestPatternsRecord: Record<string, string> = {};
  patterns.forEach(pattern => {
    manifestPatternsRecord[pattern.id] = pattern.image;
  });
  
  // Calculated values - simplified canStart condition
  const canStart = Boolean(intention && intention.trim() !== "" && 
                   (patternImage !== null || patternImages.length > 0));

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
      />
      
      {/* Panel derecho: visualización y controles principales */}
      <div className="lg:col-span-2">
        <ManifestInterfaceSection
          currentImage={currentImage}
          isManifestActive={isManifestActive}
          patternImage={patternImage}
          patternImages={patternImages}
          receptorImage={receptorImage}
          receptorImages={receptorImages}
          canStart={canStart}
          timeRemaining={timeRemaining}
          startManifestation={handleStartManifestation}
          stopManifestation={stopManifestation}
          formatTimeRemaining={formatTimeRemaining}
          backgroundModeActive={backgroundModeActive}
          selectedPattern=""  // Default empty string
          patterns={patterns}
          manifestPatterns={manifestPatternsRecord}
          intention={intention}
          manifestSound={manifestSound}
          manifestFrequency={manifestFrequency}
          exposureTime={exposureTime}
          manifestSpeed={visualSpeed}
          visualSpeed={visualSpeed}
          rate1={rate1}
          rate2={rate2}
          rate3={rate3}
          receptorName={receptorName}
          indefiniteTime={indefiniteTime}
        />
      </div>
    </div>
  );
};

export default CustomManifest;
