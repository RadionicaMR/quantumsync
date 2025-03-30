import React from 'react';
import { Card } from '@/components/ui/card';
import PatternSelector from './PatternSelector';
import ManifestControls from './ManifestControls';
import ManifestVisualizer from './ManifestVisualizer';
import ImageUploader from '@/components/manifest/ImageUploader';

interface Pattern {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface PresetManifestProps {
  patterns: Pattern[];
  selectedPattern: string;
  intention: string;
  setIntention: (value: string) => void;
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
  onSelectPattern: (patternId: string) => void;
  currentImage: 'pattern' | 'receptor' | 'mix';
  receptorImage: string | null;
  setReceptorImage: (image: string | null) => void;
}

const PresetManifest = ({
  patterns,
  selectedPattern,
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
  isManifestActive,
  timeRemaining,
  startManifestation,
  stopManifestation,
  formatTimeRemaining,
  onSelectPattern,
  currentImage,
  receptorImage,
  setReceptorImage
}: PresetManifestProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <PatternSelector 
        patterns={patterns}
        selectedPattern={selectedPattern}
        isManifestActive={isManifestActive}
        onSelectPattern={onSelectPattern}
      />
      
      <div className="lg:col-span-2">
        <Card className="quantum-card p-6 h-full">
          <h3 className="text-xl font-semibold mb-4">Programa tu Intención</h3>
          
          {selectedPattern || isManifestActive ? (
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
                canStart={!!selectedPattern}
              />
              
              {/* Imagen del RECEPTOR */}
              <div className="mt-6">
                <ImageUploader
                  label="Imagen del RECEPTOR"
                  image={receptorImage}
                  setImage={setReceptorImage}
                  isDisabled={isManifestActive}
                  description="Selecciona una imagen relacionada con tu objetivo"
                />
              </div>
              
              <ManifestVisualizer
                isActive={isManifestActive}
                currentImage={currentImage}
                patternImage={null}
                receptorImage={receptorImage}
                selectedPattern={selectedPattern}
                patterns={patterns}
                intention={intention}
                visualSpeed={visualSpeed}
                exposureTime={exposureTime}
                rate1={rate1}
                rate2={rate2}
                rate3={rate3}
              />
            </div>
          ) : (
            <div className="text-center text-muted-foreground h-[300px] flex flex-col items-center justify-center">
              <div className="text-quantum-primary text-5xl mb-4">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-lg mb-4">Selecciona un patrón para comenzar</p>
              <p className="text-sm max-w-md">
                Elige uno de nuestros patrones radiónicos diseñados para amplificar diferentes tipos de manifestaciones
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PresetManifest;
