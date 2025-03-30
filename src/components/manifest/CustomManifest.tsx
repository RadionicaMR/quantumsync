
import React from 'react';
import { Card } from '@/components/ui/card';
import ManifestControls from './ManifestControls';
import ManifestVisualizer from './ManifestVisualizer';
import ImageUploader from './ImageUploader';

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
  receptorImage: string | null;
  setReceptorImage: (image: string | null) => void;
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
}

const CustomManifest = ({
  patterns,
  intention,
  setIntention,
  patternImage,
  setPatternImage,
  receptorImage,
  setReceptorImage,
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
  currentImage
}: CustomManifestProps) => {
  return (
    <Card className="quantum-card p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h3 className="text-xl font-semibold mb-4">Carga tu Patrón Radiónico</h3>
          
          <ImageUploader
            label="Subir Patrón Radiónico"
            image={patternImage}
            setImage={setPatternImage}
            isDisabled={isManifestActive}
            description="Sube tu propio diseño desde tu galería"
          />

          <div className="mt-6">
            <ImageUploader
              label="Imagen del RECEPTOR"
              image={receptorImage}
              setImage={setReceptorImage}
              isDisabled={isManifestActive}
              description="Selecciona una imagen relacionada con tu objetivo"
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
              canStart={!!patternImage}
            />
            
            <ManifestVisualizer
              isActive={isManifestActive}
              currentImage={currentImage}
              patternImage={patternImage}
              receptorImage={receptorImage}
              selectedPattern=""
              patterns={patterns}
              intention={intention}
              visualSpeed={visualSpeed}
              exposureTime={exposureTime}
              rate1={rate1}
              rate2={rate2}
              rate3={rate3}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CustomManifest;
