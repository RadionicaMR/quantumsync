
import React, { memo } from 'react';
import { Card } from '@/components/ui/card';
import PatternSection from './PatternSection';
import ReceptorSection from './ReceptorSection';
import AudioSubliminalSection from './AudioSubliminalSection';
import { ManifestControls } from '../ManifestControls';
import ManifestActionButtons from '../controls/ManifestActionButtons';
import IntentionInput from '../controls/IntentionInput';

interface CustomManifestLeftPanelProps {
  patternImage: string | null;
  setPatternImage: (image: string | null) => void;
  patternImages: string[];
  setPatternImages: (images: string[]) => void;
  receptorImage: string | null;
  setReceptorImage: (image: string | null) => void;
  receptorImages: string[];
  setReceptorImages: (images: string[]) => void;
  receptorName: string;
  setReceptorName: (name: string) => void;
  isManifestActive: boolean;
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  audioVolume: number;
  setAudioVolume: (vol: number) => void;
  audioSubliminalPlaying: boolean;
  playSubliminalAudio: () => void;
  stopSubliminalAudio: () => void;
  audioLoop?: boolean;
  setAudioLoop?: (loop: boolean) => void;
  clearAudio?: () => void;
  intention: string;
  setIntention: (intention: string) => void;
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
  indefiniteTime?: boolean;
  setIndefiniteTime?: (value: boolean) => void;
  timeRemaining?: number | null;
  startManifestation?: () => void;
  stopManifestation?: () => void;
  formatTimeRemaining?: (time: number) => string;
  canStart?: boolean;
}

// Use memo to prevent unnecessary re-renders
const CustomManifestLeftPanel = memo(({
  patternImage,
  setPatternImage,
  patternImages,
  setPatternImages,
  receptorImage,
  setReceptorImage,
  receptorImages,
  setReceptorImages,
  receptorName,
  setReceptorName,
  isManifestActive,
  audioFile,
  setAudioFile,
  audioVolume,
  setAudioVolume,
  audioSubliminalPlaying,
  playSubliminalAudio,
  stopSubliminalAudio,
  audioLoop = true,
  setAudioLoop = () => {},
  clearAudio = () => {},
  intention,
  setIntention,
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
  indefiniteTime = false,
  setIndefiniteTime = () => {},
  timeRemaining = null,
  startManifestation = () => {},
  stopManifestation = () => {},
  formatTimeRemaining = (time) => "",
  canStart = false
}: CustomManifestLeftPanelProps) => {
  return (
    <div className="lg:col-span-1 space-y-6">
      <Card className="p-6 quantum-card">
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Intención de Manifestación</h3>
          <IntentionInput 
            intention={intention} 
            setIntention={setIntention}
            isDisabled={isManifestActive}
          />
        </div>
      </Card>
      
      <Card className="p-6 quantum-card">
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Configuración de Receptor</h3>
          <ReceptorNameInput 
            receptorName={receptorName}
            setReceptorName={setReceptorName}
            isActive={isManifestActive}
          />
        </div>
        
        <ManifestControls
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
          timeRemaining={timeRemaining}
          hideActionButtons={true} // Ocultar los botones de acción
          indefiniteTime={indefiniteTime}
          setIndefiniteTime={setIndefiniteTime}
        />
      </Card>
      
      <PatternSection 
        patternImage={patternImage}
        setPatternImage={setPatternImage}
        patternImages={patternImages}
        setPatternImages={setPatternImages}
        isManifestActive={isManifestActive}
      />
      
      <ReceptorSection 
        receptorName={receptorName}
        setReceptorName={setReceptorName}
        receptorImage={receptorImage}
        setReceptorImage={setReceptorImage}
        receptorImages={receptorImages}
        setReceptorImages={setReceptorImages}
        isManifestActive={isManifestActive}
      />

      <AudioSubliminalSection 
        audioFile={audioFile}
        setAudioFile={setAudioFile}
        audioVolume={audioVolume}
        setAudioVolume={setAudioVolume}
        audioSubliminalPlaying={audioSubliminalPlaying}
        playSubliminalAudio={playSubliminalAudio}
        stopSubliminalAudio={stopSubliminalAudio}
        isManifestActive={isManifestActive}
        audioLoop={audioLoop}
        setAudioLoop={setAudioLoop}
        clearAudio={clearAudio}
      />
      
      {/* Fixed action buttons outside - to prevent flickering */}
      <Card className="p-4 quantum-card border-quantum-primary">
        <ManifestActionButtons
          isManifestActive={isManifestActive}
          timeRemaining={timeRemaining}
          formatTimeRemaining={formatTimeRemaining || ((time) => `${time} min`)}
          startManifestation={startManifestation || (() => {})}
          stopManifestation={stopManifestation || (() => {})}
          canStart={canStart || false}
          intention={intention}
        />
      </Card>
    </div>
  );
});

CustomManifestLeftPanel.displayName = 'CustomManifestLeftPanel';

export default CustomManifestLeftPanel;
