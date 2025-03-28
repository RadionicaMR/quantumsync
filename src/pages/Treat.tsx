
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import QuantumButton from '@/components/QuantumButton';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Treat = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState([528]);
  const [duration, setDuration] = useState([5]);
  const [intensity, setIntensity] = useState([50]);
  const [selectedPreset, setSelectedPreset] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [useHeadphones, setUseHeadphones] = useState(true);
  const [visualFeedback, setVisualFeedback] = useState(true);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const presets = [
    { id: 'sleep', name: 'Mejorar el Sueño', frequency: 396, description: 'Ondas Delta para promover un sueño profundo y reparador', duration: 45 },
    { id: 'stress', name: 'Reducir el Estrés', frequency: 639, description: 'Frecuencias Theta para relajación y alivio de la ansiedad', duration: 20 },
    { id: 'focus', name: 'Mejorar la Concentración', frequency: 852, description: 'Ondas Beta para mejorar la concentración y claridad mental', duration: 15 },
    { id: 'energy', name: 'Aumentar Energía', frequency: 528, description: 'La "frecuencia milagrosa" para vitalidad y reparación del ADN', duration: 10 },
    { id: 'harmony', name: 'Equilibrio Emocional', frequency: 741, description: 'Ayuda a liberar emociones negativas y promover la armonía', duration: 15 },
    { id: 'manifest', name: 'Manifestación', frequency: 963, description: 'Conecta con la conciencia espiritual y el poder de manifestación', duration: 30 },
  ];

  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const selectPreset = (preset: typeof presets[0]) => {
    if (isPlaying) {
      stopTreatment();
    }
    
    setSelectedPreset(preset.id);
    setFrequency([preset.frequency]);
    setDuration([preset.duration]);
    setIntensity([50]);
  };

  const startTreatment = () => {
    if (isPlaying) return;
    
    try {
      // Initialize audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      // Create oscillator
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency[0];
      
      // Set volume based on intensity
      const volume = intensity[0] / 100 * 0.3; // max volume 0.3 to protect hearing
      gainNode.gain.value = volume;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.start();
      oscillatorRef.current = oscillator;
      
      // Start timer
      setTimeRemaining(duration[0]);
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1/60;
          if (newTime <= 0) {
            stopTreatment();
            return 0;
          }
          return newTime;
        });
      }, 1000);
      
      setIsPlaying(true);
    } catch (error) {
      console.error("Error al iniciar el tratamiento de audio:", error);
      alert("No se pudo iniciar el tratamiento de audio. Por favor, asegúrate de que tu dispositivo admite la API Web Audio.");
    }
  };

  const stopTreatment = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsPlaying(false);
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <Layout>
      <HeroSection
        title="Tratamiento Vibracional"
        subtitle="Aplica patrones de frecuencia dirigidos para restaurar el equilibrio y mejorar tu bienestar."
      />

      <section className="py-12 px-4">
        <div className="container mx-auto">
          <Tabs defaultValue="presets" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="presets">Preajustes de Frecuencia</TabsTrigger>
              <TabsTrigger value="custom">Tratamiento Personalizado</TabsTrigger>
            </TabsList>
            
            <TabsContent value="presets" className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <Card className="quantum-card p-6">
                    <h3 className="text-xl font-semibold mb-4">Seleccionar Tratamiento</h3>
                    <div className="space-y-2">
                      {presets.map((preset) => (
                        <button
                          key={preset.id}
                          className={`w-full p-3 rounded-lg text-left transition-all ${
                            selectedPreset === preset.id 
                              ? 'bg-quantum-primary text-white' 
                              : 'bg-muted hover:bg-muted/80'
                          }`}
                          onClick={() => selectPreset(preset)}
                          disabled={isPlaying}
                        >
                          <div className="font-medium">{preset.name}</div>
                          <div className={`text-sm ${selectedPreset === preset.id ? 'text-white/80' : 'text-muted-foreground'}`}>
                            {preset.frequency} Hz · {preset.duration} min
                          </div>
                        </button>
                      ))}
                    </div>
                  </Card>
                </div>
                
                <div className="lg:col-span-2">
                  <Card className="quantum-card p-6 h-full">
                    <h3 className="text-xl font-semibold mb-4">Control de Tratamiento</h3>
                    
                    {selectedPreset ? (
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium">
                            {presets.find(p => p.id === selectedPreset)?.name}
                          </h4>
                          <p className="text-muted-foreground">
                            {presets.find(p => p.id === selectedPreset)?.description}
                          </p>
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
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="w-full">
              <Card className="quantum-card p-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Diseñador de Frecuencias Personalizadas</h3>
                  <p className="text-muted-foreground mb-8">
                    Crea tus propias combinaciones de frecuencias para protocolos de tratamiento personalizados.
                  </p>
                  
                  <div className="relative w-64 h-64 mx-auto mb-8">
                    <div className="absolute inset-0 rounded-full border-4 border-dashed border-quantum-primary/20 animate-spin-slow"></div>
                    <div className="absolute inset-8 rounded-full border-4 border-dashed border-quantum-primary/40 animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
                    <div className="absolute inset-16 rounded-full border-4 border-dashed border-quantum-primary/60 animate-spin-slow"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-quantum-primary font-bold text-lg">Próximamente</div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">
                    Nuestro diseñador de frecuencias personalizadas avanzado está actualmente en desarrollo.
                  </p>
                  
                  <QuantumButton disabled>Recibir Notificación Cuando esté Disponible</QuantumButton>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="py-12 px-4 bg-quantum-gradient-soft">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Cómo Funciona el Tratamiento con Frecuencias</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              QuantumSync utiliza principios de resonancia y entrenamiento para ayudar a equilibrar tu campo energético.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="quantum-card p-6">
              <div className="w-12 h-12 rounded-full bg-quantum-gradient-soft text-quantum-primary flex items-center justify-center mb-4 mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Emisión de Frecuencia</h3>
              <p className="text-muted-foreground text-center">
                Tu dispositivo emite frecuencias vibracionales precisas calibradas para resultados específicos de bienestar.
              </p>
            </Card>
            
            <Card className="quantum-card p-6">
              <div className="w-12 h-12 rounded-full bg-quantum-gradient-soft text-quantum-primary flex items-center justify-center mb-4 mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Resonancia Energética</h3>
              <p className="text-muted-foreground text-center">
                Estas frecuencias resuenan con el campo energético de tu cuerpo, fomentando la armonización y el equilibrio.
              </p>
            </Card>
            
            <Card className="quantum-card p-6">
              <div className="w-12 h-12 rounded-full bg-quantum-gradient-soft text-quantum-primary flex items-center justify-center mb-4 mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Equilibrio del Campo Energético</h3>
              <p className="text-muted-foreground text-center">
                Con el uso regular, tus sistemas energéticos se ajustan a un funcionamiento óptimo, mejorando el bienestar general.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para Manifestar tus Objetivos?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Después de tratar los desequilibrios energéticos, utiliza nuestras herramientas de manifestación para atraer lo que deseas.
          </p>
          <QuantumButton>Explorar Herramientas de Manifestación</QuantumButton>
        </div>
      </section>
    </Layout>
  );
};

export default Treat;
