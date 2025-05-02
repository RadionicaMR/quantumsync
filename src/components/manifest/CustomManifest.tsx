
import React from 'react';
import { Card } from '@/components/ui/card';
import ManifestControls from './ManifestControls';
import ManifestVisualizer from './ManifestVisualizer';
import ImageUploader from './ImageUploader';
import ReceptorNameInput from './ReceptorNameInput';
import AudioSubliminalControls from '../AudioSubliminalControls';

interface Pattern {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface CustomManifestProps {
  patterns: Pattern[];
  intention: string;
  setIntention: (value: string) => void;
  patternImage: string | null;
  setPatternImage: (image: string | null) => void;
  patternImages: string[];
  setPatternImages: (images: string[]) => void;
  receptorImage: string | null;
  setReceptorImage: (image: string | null) => void;
  receptorImages: string[];
  setReceptorImages: (images: string[]) => void;
  manifestSound: boolean;
  setManifestSound: (value: boolean) => void;
  manifestFrequency: number[];
  setManifestFrequency: (value: number[]) => void;
  visualSpeed: number[];
  setVisualSpeed: (value: number[]) => void;
  exposureTime: number[];
  setExposureTime: (value: number[]) => void;
  rate1: string;
  setRate1: (value: string) => void;
  rate2: string;
  setRate2: (value: string) => void;
  rate3: string;
  setRate3: (value: string) => void;
  isManifestActive: boolean;
  timeRemaining: number | null;
  startManifestation: () => void;
  stopManifestation: () => void;
  formatTimeRemaining: (minutes: number) => string;
  currentImage: 'pattern' | 'receptor' | 'mix';
  receptorName: string;
  setReceptorName: (name: string) => void;
  // Audio props:
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  audioVolume: number;
  setAudioVolume: (vol: number) => void;
  audioSubliminalPlaying: boolean;
  playSubliminalAudio: () => void;
  stopSubliminalAudio: () => void;
  audioLoop?: boolean;
  setAudioLoop?: (loop: boolean) => void;
  clearAudio?: () => void; // Nueva prop para eliminar audio
}

const CustomManifest = ({
  patterns,
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
  audioLoop = true,
  setAudioLoop = () => {},
  clearAudio = () => {}, // Implementación por defecto
}: CustomManifestProps) => {
  return (
    <Card className="quantum-card p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h3 className="text-xl font-semibold mb-4">Carga tu Patrón Radiónico</h3>
          
          <div className="mb-6">
            <ImageUploader
              label="Subir Patrón Radiónico"
              image={patternImage}
              setImage={setPatternImage}
              isDisabled={isManifestActive}
              description="Sube tu propio diseño desde tu galería"
              isMultiple={true}
              images={patternImages}
              setImages={setPatternImages}
              maxImages={3}
            />
          </div>
          
          <div className="mb-6">
            <ReceptorNameInput 
              receptorName={receptorName}
              setReceptorName={setReceptorName}
              isActive={isManifestActive}
            />
          </div>

          <div>
            <ImageUploader
              label="Imagen del RECEPTOR"
              image={receptorImage}
              setImage={setReceptorImage}
              isDisabled={isManifestActive}
              description="Selecciona una imagen relacionada con tu objetivo"
              isMultiple={true}
              images={receptorImages}
              setImages={setReceptorImages}
              maxImages={3}
            />
          </div>

          {/* AudioSubliminalControls con las nuevas props */}
          <div className="mt-6">
            <AudioSubliminalControls
              audioFile={audioFile}
              setAudioFile={setAudioFile}
              audioVolume={audioVolume}
              setAudioVolume={setAudioVolume}
              isPlaying={audioSubliminalPlaying}
              playAudio={playSubliminalAudio}
              stopAudio={stopSubliminalAudio}
              isDisabled={isManifestActive}
              maxVolume={20}
              audioLoop={audioLoop}
              setAudioLoop={setAudioLoop}
              clearAudio={clearAudio}
            />
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Programa tu Intención</h3>
          
          <div className="space-y-6">
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
              startManifestation={startManifestation}
              stopManifestation={stopManifestation}
              formatTimeRemaining={formatTimeRemaining}
              canStart={patternImages.length > 0 || !!receptorName.trim()}
            />
            
            <ManifestVisualizer
              isActive={isManifestActive}
              currentImage={currentImage}
              patternImage={patternImage}
              patternImages={patternImages}
              receptorImage={receptorImage}
              receptorImages={receptorImages}
              selectedPattern=""
              patterns={patterns}
              manifestPatterns={patterns}
              intention={intention}
              visualSpeed={visualSpeed}
              exposureTime={exposureTime}
              rate1={rate1}
              rate2={rate2}
              rate3={rate3}
              receptorName={receptorName}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CustomManifest;
