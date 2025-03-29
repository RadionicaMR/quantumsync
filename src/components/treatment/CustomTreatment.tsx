
import { useState, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import QuantumButton from '@/components/QuantumButton';
import ImageUploader from './ImageUploader';

interface CustomTreatmentProps {
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
  receptorImage: string | null;
  setReceptorImage: (image: string | null) => void;
  hypnoticSpeed: number[];
  setHypnoticSpeed: (value: number[]) => void;
  useHeadphones: boolean;
  setUseHeadphones: (value: boolean) => void;
  visualFeedback: boolean;
  setVisualFeedback: (value: boolean) => void;
  isPlaying: boolean;
  timeRemaining: number;
  formatTime: (minutes: number) => string;
  currentImage: 'radionic' | 'receptor';
  hypnoticEffect: boolean;
  startTreatment: () => void;
  stopTreatment: () => void;
}

const CustomTreatment = ({
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
  receptorImage,
  setReceptorImage,
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
}: CustomTreatmentProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Panel izquierdo - Controles */}
      <div className="lg:col-span-1">
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Frecuencia: {frequency[0]} Hz</h4>
            <Slider
              defaultValue={frequency}
              min={20}
              max={20000}
              step={1}
              value={frequency}
              onValueChange={setFrequency}
              disabled={isPlaying}
              className="mb-4"
            />
            
            <h4 className="font-medium mb-2">Duración: {duration[0]} minutos</h4>
            <Slider
              defaultValue={duration}
              min={1}
              max={60}
              step={1}
              value={duration}
              onValueChange={setDuration}
              disabled={isPlaying}
              className="mb-4"
            />
            
            <h4 className="font-medium mb-2">Intensidad: {intensity[0]}%</h4>
            <Slider
              defaultValue={intensity}
              min={10}
              max={100}
              step={1}
              value={intensity}
              onValueChange={setIntensity}
              disabled={isPlaying}
              className="mb-4"
            />
            
            <h4 className="font-medium mb-2">Velocidad Hipnótica: {hypnoticSpeed[0]}</h4>
            <Slider
              defaultValue={hypnoticSpeed}
              min={1}
              max={20}
              step={1}
              value={hypnoticSpeed}
              onValueChange={setHypnoticSpeed}
              disabled={isPlaying}
              className="mb-4"
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col">
              <Label htmlFor="rate1" className="mb-1">RATE 1</Label>
              <Input
                id="rate1"
                type="text"
                maxLength={10}
                placeholder="Ingrese RATE 1"
                value={rate1}
                onChange={(e) => setRate1(e.target.value)}
                disabled={isPlaying}
                className={isPlaying ? "animate-[pulse_1s_ease-in-out_infinite] bg-quantum-primary/10" : ""}
              />
            </div>
            
            <div className="flex flex-col">
              <Label htmlFor="rate2" className="mb-1">RATE 2</Label>
              <Input
                id="rate2"
                type="text"
                maxLength={10}
                placeholder="Ingrese RATE 2"
                value={rate2}
                onChange={(e) => setRate2(e.target.value)}
                disabled={isPlaying}
                className={isPlaying ? "animate-[pulse_1.2s_ease-in-out_infinite] bg-quantum-primary/10" : ""}
              />
            </div>
            
            <div className="flex flex-col">
              <Label htmlFor="rate3" className="mb-1">RATE 3</Label>
              <Input
                id="rate3"
                type="text"
                maxLength={10}
                placeholder="Ingrese RATE 3"
                value={rate3}
                onChange={(e) => setRate3(e.target.value)}
                disabled={isPlaying}
                className={isPlaying ? "animate-[pulse_1.4s_ease-in-out_infinite] bg-quantum-primary/10" : ""}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Panel derecho - Upload y visualización */}
      <div className="lg:col-span-2">
        <div className="space-y-6">
          {/* Sección del Gráfico Radiónico */}
          <ImageUploader
            title="GRÁFICO RADIÓNICO"
            subtitle="Subir Gráfico Radiónico"
            image={radionicImage}
            setImage={setRadionicImage}
            isPlaying={isPlaying}
          />
          
          {/* Nueva sección RECEPTOR */}
          <ImageUploader
            title="RECEPTOR"
            subtitle="Subir Imagen del Receptor"
            image={receptorImage}
            setImage={setReceptorImage}
            isPlaying={isPlaying}
          />
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Switch 
                id="custom-headphones" 
                checked={useHeadphones}
                onCheckedChange={setUseHeadphones}
                disabled={isPlaying}
              />
              <Label htmlFor="custom-headphones">Usar auriculares (recomendado)</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch 
                id="custom-visual" 
                checked={visualFeedback}
                onCheckedChange={setVisualFeedback}
                disabled={isPlaying}
              />
              <Label htmlFor="custom-visual">Mostrar entrenamiento visual</Label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            {isPlaying ? (
              <>
                <div className="text-quantum-primary font-medium">
                  Tratamiento en progreso: {formatTime(timeRemaining)} restante
                </div>
                <QuantumButton 
                  variant="outline"
                  onClick={stopTreatment}
                >
                  Detener Tratamiento
                </QuantumButton>
              </>
            ) : (
              <>
                <div className="text-muted-foreground">
                  Listo para iniciar tratamiento personalizado
                </div>
                <QuantumButton 
                  onClick={startTreatment}
                  disabled={!radionicImage}
                >
                  Iniciar Tratamiento
                </QuantumButton>
              </>
            )}
          </div>
          
          {/* Visualización de tratamiento con efecto hipnótico */}
          {isPlaying && visualFeedback && (
            <div className="mt-4 relative h-48 bg-black/10 dark:bg-white/5 rounded-lg overflow-hidden">
              {/* Efecto hipnótico con las imágenes */}
              {radionicImage && receptorImage && hypnoticEffect && (
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  <img 
                    src={currentImage === 'radionic' ? radionicImage : receptorImage}
                    alt={currentImage === 'radionic' ? "Efecto radiónico" : "Efecto receptor"}
                    className="w-full h-full object-contain transition-opacity duration-100 animate-pulse"
                    style={{ 
                      opacity: 0.8,
                      filter: 'contrast(1.2) brightness(1.1)'
                    }}
                  />
                </div>
              )}
              
              {/* Overlay con los pulsos circulares */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-8 h-8 bg-quantum-primary/20 rounded-full animate-ping"></div>
                <div className="w-16 h-16 bg-quantum-primary/15 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-24 h-24 bg-quantum-primary/10 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
              </div>
              
              {/* Información y RATES */}
              <div className="absolute bottom-3 left-3 text-xs text-white z-20 font-mono bg-black/40 px-2 py-1 rounded">
                Frecuencia: {frequency[0]} Hz · Intensidad: {intensity[0]}%
              </div>
              <div className="absolute top-3 right-3 flex space-x-4 text-sm font-mono bg-black/40 px-2 py-1 rounded z-20">
                <span className="animate-pulse">{rate1}</span>
                <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>{rate2}</span>
                <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>{rate3}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomTreatment;
