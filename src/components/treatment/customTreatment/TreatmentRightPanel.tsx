
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import AudioSubliminalControls from '@/components/AudioSubliminalControls';
import ImageUploader from '@/components/manifest/ImageUploader';
import ReceptorNameInput from '@/components/treatment/ReceptorNameInput';
import TreatmentVisualizer from '@/components/treatment/TreatmentVisualizer';
import TreatmentActions from '@/components/treatment/TreatmentActions';
import SettingsToggles from '@/components/treatment/SettingsToggles';

interface TreatmentRightPanelProps {
  frequency: number[];
  setFrequency: (value: number[]) => void;
  duration: number[];
  setDuration: (value: number[]) => void;
  intensity: number[];
  setIntensity: (value: number[]) => void;
  rate1: string;
  setRate1: (value: string) => void;
  rate2: string;
  setRate2: (value: string) => void;
  rate3: string;
  setRate3: (value: string) => void;
  radionicImage: string | null;
  setRadionicImage: (image: string | null) => void;
  radionicImages: string[];
  setRadionicImages: (images: string[]) => void;
  receptorImage: string | null;
  setReceptorImage: (image: string | null) => void;
  receptorImages: string[];
  setReceptorImages: (images: string[]) => void;
  hypnoticSpeed: number[];
  setHypnoticSpeed: (value: number[]) => void;
  useHeadphones: boolean;
  setUseHeadphones: (value: boolean) => void;
  visualFeedback: boolean;
  setVisualFeedback: (value: boolean) => void;
  isPlaying: boolean;
  timeRemaining: number;
  formatTime: (minutes: number) => string;
  currentImage: 'radionic' | 'receptor' | 'mix' | 'pattern';  // Updated to include 'pattern'
  hypnoticEffect: boolean;
  startTreatment: () => void;
  stopTreatment: () => void;
  receptorName: string;
  setReceptorName: (name: string) => void;
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
  backgroundModeActive?: boolean;
}

const TreatmentRightPanel = ({
  frequency,
  setFrequency,
  duration,
  setDuration,
  intensity,
  setIntensity,
  rate1,
  setRate1,
  rate2,
  setRate2,
  rate3,
  setRate3,
  radionicImage,
  setRadionicImage,
  radionicImages,
  setRadionicImages,
  receptorImage,
  setReceptorImage,
  receptorImages,
  setReceptorImages,
  hypnoticSpeed,
  setHypnoticSpeed,
  useHeadphones,
  setUseHeadphones,
  visualFeedback,
  setVisualFeedback,
  isPlaying,
  timeRemaining,
  formatTime,
  currentImage,
  hypnoticEffect,
  startTreatment,
  stopTreatment,
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
  clearAudio = () => {},
  backgroundModeActive = false,
}: TreatmentRightPanelProps) => {
  // Normalize currentImage to be compatible with TreatmentVisualizer
  const normalizedCurrentImage = currentImage === 'pattern' ? 'radionic' : currentImage;

  return (
    <div className="space-y-6">
      {/* First Card: Image Uploads */}
      <Card className="quantum-card p-6">
        <h3 className="text-xl font-semibold mb-4">Visualización Radiónica</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Imagen radiónica */}
          <div>
            <h4 className="mb-2 font-medium">Patrón Radiónico</h4>
            <ImageUploader
              label="Subir Patrón Radiónico"
              image={radionicImage}
              setImage={setRadionicImage}
              description="Carga tu propio diseño"
              isDisabled={isPlaying}
              isMultiple={true}
              images={radionicImages}
              setImages={setRadionicImages}
              maxImages={3}
            />
          </div>
          
          {/* Imagen del receptor - Sin duplicar el nombre del receptor */}
          <div>
            <h4 className="mb-2 font-medium">Imagen del Receptor</h4>
            <ImageUploader
              label="Subir Imagen del Receptor"
              image={receptorImage}
              setImage={setReceptorImage}
              description="Foto de la persona o situación a tratar"
              isDisabled={isPlaying}
              isMultiple={true}
              images={receptorImages}
              setImages={setReceptorImages}
              maxImages={3}
            />
          </div>
        </div>
      </Card>
      
      {/* Second Card: Audio Files Upload */}
      <Card className="quantum-card p-6">
        <h3 className="text-xl font-semibold mb-4">Audio Subliminal (opcional)</h3>
        <AudioSubliminalControls 
          audioFile={audioFile}
          setAudioFile={setAudioFile}
          audioVolume={audioVolume}
          setAudioVolume={setAudioVolume}
          isPlaying={audioSubliminalPlaying}
          playAudio={playSubliminalAudio}
          stopAudio={stopSubliminalAudio}
          isDisabled={isPlaying}
          audioLoop={audioLoop}
          setAudioLoop={setAudioLoop}
          clearAudio={clearAudio}
        />
      </Card>
      
      {/* Third Card: Treatment Visualizer */}
      <Card className="quantum-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Visualizador de Tratamiento</h3>
          <div>
            <SettingsToggles 
              useHeadphones={useHeadphones}
              setUseHeadphones={setUseHeadphones}
              visualFeedback={visualFeedback}
              setVisualFeedback={setVisualFeedback}
              isPlaying={isPlaying}
            />
          </div>
        </div>

        <TreatmentVisualizer
          radionicImage={radionicImage}
          radionicImages={radionicImages}
          receptorImage={receptorImage}
          receptorImages={receptorImages}
          currentImage={normalizedCurrentImage}
          hypnoticEffect={hypnoticEffect}
          visualFeedback={visualFeedback}
          frequency={frequency}
          intensity={intensity}
          rate1={rate1}
          rate2={rate2}
          rate3={rate3}
          hypnoticSpeed={hypnoticSpeed}
          isPlaying={isPlaying}
          receptorName={receptorName}
        />
        
        <div className="mt-6">
          <TreatmentActions 
            isPlaying={isPlaying}
            timeRemaining={timeRemaining}
            formatTime={formatTime}
            startTreatment={startTreatment}
            stopTreatment={stopTreatment}
            receptorName={receptorName}
            backgroundModeActive={backgroundModeActive}
          />
        </div>
      </Card>
    </div>
  );
};

export default TreatmentRightPanel;
