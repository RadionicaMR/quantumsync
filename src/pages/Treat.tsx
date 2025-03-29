
import { useState, useRef, useEffect } from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PresetSelector, { TreatmentPreset } from '@/components/treatment/PresetSelector';
import TreatmentControls from '@/components/treatment/TreatmentControls';
import CustomTreatment from '@/components/treatment/CustomTreatment';
import HowItWorks from '@/components/treatment/HowItWorks';
import CallToAction from '@/components/treatment/CallToAction';

const Treat = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState([528]);
  const [duration, setDuration] = useState([5]);
  const [intensity, setIntensity] = useState([50]);
  const [selectedPreset, setSelectedPreset] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [useHeadphones, setUseHeadphones] = useState(true);
  const [visualFeedback, setVisualFeedback] = useState(true);
  
  // Estados para tratamiento personalizado
  const [rate1, setRate1] = useState('');
  const [rate2, setRate2] = useState('');
  const [rate3, setRate3] = useState('');
  const [radionicImage, setRadionicImage] = useState<string | null>(null);
  const [receptorImage, setReceptorImage] = useState<string | null>(null);
  const [hypnoticEffect, setHypnoticEffect] = useState(false);
  const [hypnoticSpeed, setHypnoticSpeed] = useState([10]); // Velocidad de oscilación (1-20)
  const [currentImage, setCurrentImage] = useState<'radionic' | 'receptor'>('radionic');
  
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hypnoticTimerRef = useRef<NodeJS.Timeout | null>(null);

  const presets: TreatmentPreset[] = [
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

  const selectPreset = (preset: TreatmentPreset) => {
    if (isPlaying) {
      stopTreatment();
    }
    
    setSelectedPreset(preset.id);
    setFrequency([preset.frequency]);
    setDuration([preset.duration]);
    setIntensity([50]);
  };

  // Función para el efecto hipnótico
  const startHypnoticEffect = () => {
    if (radionicImage && receptorImage) {
      setHypnoticEffect(true);
      
      // La velocidad del efecto hipnótico se calcula inversamente: valores más altos = transición más rápida
      const switchInterval = 1000 / (hypnoticSpeed[0] * 2);
      
      hypnoticTimerRef.current = setInterval(() => {
        setCurrentImage(prev => prev === 'radionic' ? 'receptor' : 'radionic');
      }, switchInterval);
    }
  };

  const stopHypnoticEffect = () => {
    if (hypnoticTimerRef.current) {
      clearInterval(hypnoticTimerRef.current);
      hypnoticTimerRef.current = null;
    }
    setHypnoticEffect(false);
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
      
      // Iniciar efecto hipnótico si hay imágenes cargadas
      if (radionicImage && receptorImage) {
        startHypnoticEffect();
      }
      
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
    
    stopHypnoticEffect();
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
      if (hypnoticTimerRef.current) {
        clearInterval(hypnoticTimerRef.current);
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
                  <PresetSelector 
                    presets={presets}
                    selectedPreset={selectedPreset}
                    isPlaying={isPlaying}
                    onSelectPreset={selectPreset}
                  />
                </div>
                
                <div className="lg:col-span-2">
                  <TreatmentControls
                    selectedPreset={selectedPreset}
                    presets={presets}
                    frequency={frequency}
                    setFrequency={setFrequency}
                    duration={duration}
                    setDuration={setDuration}
                    intensity={intensity}
                    setIntensity={setIntensity}
                    useHeadphones={useHeadphones}
                    setUseHeadphones={setUseHeadphones}
                    visualFeedback={visualFeedback}
                    setVisualFeedback={setVisualFeedback}
                    isPlaying={isPlaying}
                    timeRemaining={timeRemaining}
                    startTreatment={startTreatment}
                    stopTreatment={stopTreatment}
                    formatTime={formatTime}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="w-full">
              <Card className="quantum-card p-6">
                <div className="">
                  <h3 className="text-xl font-semibold mb-4">Diseñador de Frecuencias Personalizadas</h3>
                  <p className="text-muted-foreground mb-8">
                    Crea tus propias combinaciones de frecuencias para protocolos de tratamiento personalizados.
                  </p>
                  
                  <CustomTreatment
                    frequency={frequency}
                    setFrequency={setFrequency}
                    duration={duration}
                    setDuration={setDuration}
                    intensity={intensity}
                    setIntensity={setIntensity}
                    rate1={rate1}
                    setRate1={setRate1}
                    rate2={rate2}
                    setRate2={setRate2}
                    rate3={rate3}
                    setRate3={setRate3}
                    radionicImage={radionicImage}
                    setRadionicImage={setRadionicImage}
                    receptorImage={receptorImage}
                    setReceptorImage={setReceptorImage}
                    hypnoticSpeed={hypnoticSpeed}
                    setHypnoticSpeed={setHypnoticSpeed}
                    useHeadphones={useHeadphones}
                    setUseHeadphones={setUseHeadphones}
                    visualFeedback={visualFeedback}
                    setVisualFeedback={setVisualFeedback}
                    isPlaying={isPlaying}
                    timeRemaining={timeRemaining}
                    formatTime={formatTime}
                    currentImage={currentImage}
                    hypnoticEffect={hypnoticEffect}
                    startTreatment={startTreatment}
                    stopTreatment={stopTreatment}
                  />
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <HowItWorks />
      <CallToAction />
    </Layout>
  );
};

export default Treat;
