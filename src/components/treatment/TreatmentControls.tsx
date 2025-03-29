
import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import QuantumButton from '@/components/QuantumButton';
import { Card } from '@/components/ui/card';
import { TreatmentPreset } from './PresetSelector';

interface TreatmentControlsProps {
  selectedPreset: string | null;
  presets: TreatmentPreset[];
  frequency: number[];
  setFrequency: (value: number[]) => void;
  duration: number[];
  setDuration: (value: number[]) => void;
  intensity: number[];
  setIntensity: (value: number[]) => void;
  useHeadphones: boolean;
  setUseHeadphones: (value: boolean) => void;
  visualFeedback: boolean;
  setVisualFeedback: (value: boolean) => void;
  isPlaying: boolean;
  timeRemaining: number;
  startTreatment: () => void;
  stopTreatment: () => void;
  formatTime: (minutes: number) => string;
}

const TreatmentControls = ({
  selectedPreset,
  presets,
  frequency,
  setFrequency,
  duration,
  setDuration,
  intensity,
  setIntensity,
  useHeadphones,
  setUseHeadphones,
  visualFeedback, 
  setVisualFeedback,
  isPlaying,
  timeRemaining,
  startTreatment,
  stopTreatment,
  formatTime,
}: TreatmentControlsProps) => {
  const selectedPresetData = presets.find(p => p.id === selectedPreset);
  
  return (
    <Card className="quantum-card p-6 h-full">
      <h3 className="text-xl font-semibold mb-4">Control de Tratamiento</h3>
      
      {selectedPreset ? (
        <div className="space-y-6">
          <div>
            <h4 className="font-medium">{selectedPresetData?.name}</h4>
            <p className="text-muted-foreground">{selectedPresetData?.description}</p>
          </div>
          
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
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Switch 
                id="headphones" 
                checked={useHeadphones}
                onCheckedChange={setUseHeadphones}
                disabled={isPlaying}
              />
              <Label htmlFor="headphones">Usar auriculares (recomendado)</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch 
                id="visual" 
                checked={visualFeedback}
                onCheckedChange={setVisualFeedback}
                disabled={isPlaying}
              />
              <Label htmlFor="visual">Mostrar entrenamiento visual</Label>
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
                  Listo para iniciar tratamiento
                </div>
                <QuantumButton 
                  onClick={startTreatment}
                >
                  Iniciar Tratamiento
                </QuantumButton>
              </>
            )}
          </div>
          
          {isPlaying && visualFeedback && (
            <div className="mt-4 relative h-40 bg-black/5 dark:bg-white/5 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-quantum-primary/20 rounded-full animate-ping"></div>
                <div className="w-16 h-16 bg-quantum-primary/10 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-24 h-24 bg-quantum-primary/5 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
                Frecuencia: {frequency[0]} Hz · Intensidad: {intensity[0]}%
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-12">
          <div className="text-quantum-primary text-5xl mb-4">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
              <path d="M3 12H7L10 20L14 4L17 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="mb-4">Selecciona un preajuste de frecuencia para comenzar el tratamiento</p>
          <p className="text-sm">Nuestros preajustes están diseñados para resultados específicos de bienestar</p>
        </div>
      )}
    </Card>
  );
};

export default TreatmentControls;
