
import React from 'react';
import { Card } from '@/components/ui/card';
import { ManifestPattern } from '@/data/manifestPatterns';
import PatternSelection from '../PatternSelection';
import IntentionInput from '../IntentionInput';
import AudioControls from '../AudioControls';
import FrequencyControls from '../FrequencyControls';
import TimingControls from '../TimingControls';
import ReceptorNameInput from '../ReceptorNameInput';
import ImageUploaderSection from '@/components/treatment/preset/ImageUploaderSection';

interface PresetManifestConfigPanelProps {
  patterns: ManifestPattern[];
  selectedPattern: string;
  intention: string;
  setIntention: (value: string) => void;
  manifestSound: boolean;
  setManifestSound: (value: boolean) => void;
  manifestFrequency: number[];
  setManifestFrequency: (value: number[]) => void;
  exposureTime: number[];
  setExposureTime: (value: number[]) => void;
  visualSpeed: number[];
  setVisualSpeed: (value: number[]) => void;
  isManifestActive: boolean;
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  audioVolume: number;
  setAudioVolume: (value: number) => void;
  audioSubliminalPlaying: boolean;
  playSubliminalAudio: () => void;
  stopSubliminalAudio: () => void;
  receptorName: string;
  setReceptorName: (value: string) => void;
  selectPattern: (pattern: ManifestPattern) => void;
  indefiniteTime: boolean;
  setIndefiniteTime: (value: boolean) => void;
  // Added image uploader props
  patternImage: string | null;
  setPatternImage: (image: string | null) => void;
  receptorImage: string | null;
  setReceptorImage: (image: string | null) => void;
  patternImages: string[];
  setPatternImages: (images: string[]) => void;
  receptorImages: string[];
  setReceptorImages: (images: string[]) => void;
}

const PresetManifestConfigPanel: React.FC<PresetManifestConfigPanelProps> = ({
  patterns,
  selectedPattern,
  intention,
  setIntention,
  manifestSound,
  setManifestSound,
  manifestFrequency,
  setManifestFrequency,
  exposureTime,
  setExposureTime,
  visualSpeed,
  setVisualSpeed,
  isManifestActive,
  audioFile,
  setAudioFile,
  audioVolume,
  setAudioVolume,
  audioSubliminalPlaying,
  playSubliminalAudio,
  stopSubliminalAudio,
  receptorName,
  setReceptorName,
  selectPattern,
  indefiniteTime,
  setIndefiniteTime,
  // Added image uploader props
  patternImage,
  setPatternImage,
  receptorImage,
  setReceptorImage,
  patternImages,
  setPatternImages,
  receptorImages,
  setReceptorImages
}) => {
  return (
    <div className="lg:col-span-1">
      <Card className="bg-card/90 dark:bg-black/40 p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Configuración</h3>

        <PatternSelection
          patterns={patterns}
          selectedPattern={selectedPattern}
          selectPattern={selectPattern}
        />

        <IntentionInput intention={intention} setIntention={setIntention} />

        <div className="mt-6">
          <ReceptorNameInput 
            receptorName={receptorName}
            setReceptorName={setReceptorName}
            isActive={isManifestActive}
          />
        </div>

        <AudioControls
          manifestSound={manifestSound}
          setManifestSound={setManifestSound}
          audioFile={audioFile}
          setAudioFile={setAudioFile}
          audioVolume={audioVolume}
          setAudioVolume={setAudioVolume}
          audioSubliminalPlaying={audioSubliminalPlaying}
          playSubliminalAudio={playSubliminalAudio}
          stopSubliminalAudio={stopSubliminalAudio}
        />

        <FrequencyControls
          manifestSound={manifestSound}
          setManifestSound={setManifestSound}
          manifestFrequency={manifestFrequency}
          setManifestFrequency={setManifestFrequency}
        />

        <TimingControls
          exposureTime={exposureTime}
          setExposureTime={setExposureTime}
          visualSpeed={visualSpeed}
          setVisualSpeed={setVisualSpeed}
          isDisabled={isManifestActive}
          indefiniteTime={indefiniteTime}
          setIndefiniteTime={setIndefiniteTime}
        />
      </Card>

      {/* Added Image Uploader Section similar to Treatment page */}
      <Card className="bg-card/90 dark:bg-black/40 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Imágenes de Manifestación</h3>
        <ImageUploaderSection 
          isPlaying={isManifestActive}
          radionicImage={patternImage}
          setRadionicImage={setPatternImage}
          receptorImage={receptorImage}
          setReceptorImage={setReceptorImage}
          radionicImages={patternImages}
          setRadionicImages={setPatternImages}
          receptorImages={receptorImages}
          setReceptorImages={setReceptorImages}
          receptorName={receptorName}
          setReceptorName={setReceptorName}
        />
      </Card>
    </div>
  );
};

export default PresetManifestConfigPanel;
