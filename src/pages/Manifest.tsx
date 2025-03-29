
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Volume2, VolumeX } from 'lucide-react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import QuantumButton from '@/components/QuantumButton';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Manifest = () => {
  // Estados para la manifestación
  const [intention, setIntention] = useState('');
  const [isManifestActive, setIsManifestActive] = useState(false);
  const [visualSpeed, setVisualSpeed] = useState([10]);
  const [patternImage, setPatternImage] = useState<string | null>(null);
  const [receptorImage, setReceptorImage] = useState<string | null>(null);
  const [selectedPattern, setSelectedPattern] = useState('');
  const [activeTab, setActiveTab] = useState("presets");
  const [manifestSound, setManifestSound] = useState(true);
  const [manifestFrequency, setManifestFrequency] = useState([528]);
  const [currentImage, setCurrentImage] = useState<'pattern' | 'receptor'>('pattern');
  
  // Referencias para elementos DOM y audio
  const patternFileInputRef = useRef<HTMLInputElement>(null);
  const receptorFileInputRef = useRef<HTMLInputElement>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const hypnoticTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Patrones preestablecidos
  const patterns = [
    { id: 'abundance', name: 'Abundancia', description: 'Atrae prosperidad y abundancia material y espiritual a tu vida', image: '/patterns/abundance.svg' },
    { id: 'health', name: 'Salud', description: 'Promueve la salud, vitalidad y bienestar físico y mental', image: '/patterns/health.svg' },
    { id: 'love', name: 'Amor', description: 'Atrae relaciones armoniosas y amor incondicional a tu vida', image: '/patterns/love.svg' },
    { id: 'success', name: 'Éxito', description: 'Amplifica el éxito y los logros en todas tus empresas', image: '/patterns/success.svg' },
    { id: 'creativity', name: 'Creatividad', description: 'Estimula la inspiración, la creatividad y la expresión artística', image: '/patterns/creativity.svg' },
    { id: 'protection', name: 'Protección', description: 'Crea un escudo energético contra energías e influencias negativas', image: '/patterns/protection.svg' },
  ];

  // Manejar cambio de pestaña
  const handleTabChange = (value: string) => {
    if (isManifestActive) {
      stopManifestation();
    }
    setActiveTab(value);
    setSelectedPattern('');
  };

  // Manejadores de carga de imagen
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, setter: (image: string | null) => void) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current) {
      ref.current.click();
    }
  };

  // Seleccionar patrón predefinido
  const selectPattern = (patternId: string) => {
    if (isManifestActive) {
      stopManifestation();
    }
    
    setSelectedPattern(patternId);
  };

  // Iniciar manifestación
  const startManifestation = () => {
    if (activeTab === "presets" && !selectedPattern) return;
    if (activeTab === "custom" && !patternImage) return;
    
    // Iniciar sonido si está habilitado
    if (manifestSound) {
      try {
        // Inicializar contexto de audio
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContext();
        
        // Crear oscilador
        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = manifestFrequency[0];
        
        // Configurar volumen
        gainNode.gain.value = 0.2; // volumen bajo para no molestar
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);
        
        oscillator.start();
        oscillatorRef.current = oscillator;
      } catch (error) {
        console.error("Error al iniciar el audio de manifestación:", error);
      }
    }
    
    // Iniciar efecto hipnótico con velocidad aumentada
    // Ahora la velocidad máxima será aún mayor (el valor máximo del deslizador es 30)
    const switchInterval = 1000 / (visualSpeed[0] * 3); // Multiplicamos por 3 para mayor velocidad
    
    if (patternImage && receptorImage) {
      hypnoticTimerRef.current = setInterval(() => {
        setCurrentImage(prev => prev === 'pattern' ? 'receptor' : 'pattern');
      }, switchInterval);
    }
    
    setIsManifestActive(true);
  };

  // Detener manifestación
  const stopManifestation = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    if (hypnoticTimerRef.current) {
      clearInterval(hypnoticTimerRef.current);
      hypnoticTimerRef.current = null;
    }
    
    setIsManifestActive(false);
  };

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (hypnoticTimerRef.current) {
        clearInterval(hypnoticTimerRef.current);
      }
    };
  }, []);

  return (
    <Layout>
      <HeroSection
        title="Manifestación Cuántica"
        subtitle="Programa tus intenciones en el campo cuántico y atrae lo que deseas a tu realidad."
      />

      <section className="py-12 px-4">
        <div className="container mx-auto">
          <Tabs defaultValue="presets" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="presets">Patrones Preestablecidos</TabsTrigger>
              <TabsTrigger value="custom">Patrón Personalizado</TabsTrigger>
            </TabsList>
            
            <TabsContent value="presets" className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="quantum-card p-6 lg:col-span-1">
                  <h3 className="text-xl font-semibold mb-4">Selecciona un Patrón Radiónico</h3>
                  <div className="space-y-2">
                    {patterns.map((pattern) => (
                      <button
                        key={pattern.id}
                        className={`w-full p-3 rounded-lg text-left transition-all ${
                          selectedPattern === pattern.id 
                            ? 'bg-quantum-primary text-white' 
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                        onClick={() => selectPattern(pattern.id)}
                        disabled={isManifestActive}
                      >
                        <div className="font-medium">{pattern.name}</div>
                        <div className={`text-sm ${selectedPattern === pattern.id ? 'text-white/80' : 'text-muted-foreground'}`}>
                          {pattern.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>
                
                <div className="lg:col-span-2">
                  <Card className="quantum-card p-6 h-full">
                    <h3 className="text-xl font-semibold mb-4">Programa tu Intención</h3>
                    
                    {selectedPattern || isManifestActive ? (
                      <div className="space-y-6">
                        <div className="mb-6">
                          <Label htmlFor="intention" className="mb-2 block">Establece tu intención</Label>
                          <Textarea 
                            id="intention" 
                            placeholder="Escribe tu intención con claridad y precisión..."
                            className="min-h-[100px] quantum-input"
                            value={intention}
                            onChange={(e) => setIntention(e.target.value)}
                            disabled={isManifestActive}
                          />
                          
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                              <Label>Frecuencia de Manifestación: {manifestFrequency[0]} Hz</Label>
                              <div className="flex items-center">
                                <Switch
                                  checked={manifestSound}
                                  onCheckedChange={setManifestSound}
                                  disabled={isManifestActive}
                                  id="sound-toggle"
                                  className="mr-2"
                                />
                                <Label htmlFor="sound-toggle" className="cursor-pointer">
                                  {manifestSound ? <Volume2 size={18} /> : <VolumeX size={18} />}
                                </Label>
                              </div>
                            </div>
                            <Slider
                              min={100}
                              max={963}
                              step={1}
                              value={manifestFrequency}
                              onValueChange={setManifestFrequency}
                              disabled={isManifestActive}
                              className="mb-6"
                            />
                          </div>
                          
                          <div className="mt-4">
                            <Label className="mb-2 block">Velocidad de Visualización: {visualSpeed[0]}</Label>
                            <Slider
                              min={1}
                              max={30} // Aumentado el máximo para una visualización más rápida
                              step={1}
                              value={visualSpeed}
                              onValueChange={setVisualSpeed}
                              disabled={isManifestActive}
                              className="mb-4"
                            />
                          </div>

                          {/* Sección para subir imagen RECEPTOR */}
                          <div className="mt-6">
                            <Label className="mb-2 block">Imagen del RECEPTOR</Label>
                            <div 
                              className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer"
                              onClick={() => !isManifestActive && triggerImageUpload(receptorFileInputRef)}
                            >
                              {receptorImage ? (
                                <div className="relative h-40 w-full overflow-hidden rounded-lg">
                                  <img 
                                    src={receptorImage} 
                                    alt="Imagen del receptor" 
                                    className="w-full h-full object-contain"
                                  />
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      triggerImageUpload(receptorFileInputRef);
                                    }}
                                    className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                                    disabled={isManifestActive}
                                  >
                                    <Upload size={16} />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center py-6">
                                  <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                                  <p className="font-medium">Subir Imagen del Receptor</p>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Selecciona una imagen relacionada con tu objetivo
                                  </p>
                                </div>
                              )}
                              <input 
                                type="file"
                                ref={receptorFileInputRef}
                                onChange={(e) => handleImageUpload(e, setReceptorImage)}
                                accept="image/*"
                                className="hidden"
                                disabled={isManifestActive}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          {isManifestActive ? (
                            <>
                              <div className="text-quantum-primary font-medium">
                                Manifestación activa
                              </div>
                              <QuantumButton 
                                variant="outline"
                                onClick={stopManifestation}
                              >
                                Detener Manifestación
                              </QuantumButton>
                            </>
                          ) : (
                            <>
                              <div className="text-muted-foreground">
                                {selectedPattern ? 'Listo para iniciar manifestación' : 'Selecciona un patrón para continuar'}
                              </div>
                              <QuantumButton 
                                onClick={startManifestation}
                                disabled={!selectedPattern || !intention.trim()}
                              >
                                Activar Manifestación
                              </QuantumButton>
                            </>
                          )}
                        </div>
                        
                        {isManifestActive && (
                          <div className="mt-6 relative overflow-hidden rounded-lg bg-black h-[300px]">
                            <div className="absolute inset-0 flex items-center justify-center">
                              {/* Imagen del patrón o imagen del receptor en alternancia */}
                              {(patternImage || receptorImage) && (
                                <img 
                                  src={currentImage === 'pattern' ? 
                                    (patternImage || patterns.find(p => p.id === selectedPattern)?.image) : 
                                    receptorImage || ''}
                                  alt="Patrón de manifestación"
                                  className="max-h-full max-w-full object-contain opacity-80"
                                />
                              )}
                              
                              {/* Texto de la intención superpuesto */}
                              <div 
                                className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl"
                                style={{
                                  animation: `textPulse ${60/visualSpeed[0]}s alternate infinite ease-in-out`,
                                  textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(155,135,245,0.8)'
                                }}
                              >
                                {intention}
                              </div>
                            </div>
                          </div>
                        )}
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
            </TabsContent>
            
            <TabsContent value="custom" className="w-full">
              <Card className="quantum-card p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <h3 className="text-xl font-semibold mb-4">Carga tu Patrón Radiónico</h3>
                    <div 
                      className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer"
                      onClick={() => !isManifestActive && triggerImageUpload(patternFileInputRef)}
                    >
                      {patternImage ? (
                        <div className="relative h-40 w-full overflow-hidden rounded-lg">
                          <img 
                            src={patternImage} 
                            alt="Patrón radiónico personalizado" 
                            className="w-full h-full object-contain"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerImageUpload(patternFileInputRef);
                            }}
                            className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                            disabled={isManifestActive}
                          >
                            <Upload size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                          <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                          <p className="font-medium">Subir Patrón Radiónico</p>
                          <p className="text-sm text-muted-foreground mt-2">
                            Sube tu propio diseño desde tu galería
                          </p>
                        </div>
                      )}
                      <input 
                        type="file"
                        ref={patternFileInputRef}
                        onChange={(e) => handleImageUpload(e, setPatternImage)}
                        accept="image/*"
                        className="hidden"
                        disabled={isManifestActive}
                      />
                    </div>

                    <div className="mt-6">
                      <Label className="mb-2 block">Imagen del RECEPTOR</Label>
                      <div 
                        className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer"
                        onClick={() => !isManifestActive && triggerImageUpload(receptorFileInputRef)}
                      >
                        {receptorImage ? (
                          <div className="relative h-40 w-full overflow-hidden rounded-lg">
                            <img 
                              src={receptorImage} 
                              alt="Imagen del receptor" 
                              className="w-full h-full object-contain"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerImageUpload(receptorFileInputRef);
                              }}
                              className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                              disabled={isManifestActive}
                            >
                              <Upload size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-6">
                            <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                            <p className="font-medium">Subir Imagen del Receptor</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Selecciona una imagen relacionada con tu objetivo
                            </p>
                          </div>
                        )}
                        <input 
                          type="file"
                          ref={receptorFileInputRef}
                          onChange={(e) => handleImageUpload(e, setReceptorImage)}
                          accept="image/*"
                          className="hidden"
                          disabled={isManifestActive}
                        />
                      </div>
                    </div>

                  </div>
                  
                  <div className="lg:col-span-2">
                    <h3 className="text-xl font-semibold mb-4">Programa tu Intención</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="custom-intention" className="mb-2 block">Establece tu intención</Label>
                        <Textarea 
                          id="custom-intention" 
                          placeholder="Escribe tu intención con claridad y precisión..."
                          className="min-h-[100px] quantum-input"
                          value={intention}
                          onChange={(e) => setIntention(e.target.value)}
                          disabled={isManifestActive}
                        />

                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <Label>Frecuencia de Manifestación: {manifestFrequency[0]} Hz</Label>
                            <div className="flex items-center">
                              <Switch
                                checked={manifestSound}
                                onCheckedChange={setManifestSound}
                                disabled={isManifestActive}
                                id="custom-sound-toggle"
                                className="mr-2"
                              />
                              <Label htmlFor="custom-sound-toggle" className="cursor-pointer">
                                {manifestSound ? <Volume2 size={18} /> : <VolumeX size={18} />}
                              </Label>
                            </div>
                          </div>
                          <Slider
                            min={100}
                            max={963}
                            step={1}
                            value={manifestFrequency}
                            onValueChange={setManifestFrequency}
                            disabled={isManifestActive}
                            className="mb-6"
                          />
                        </div>
                        
                        <div className="mt-4">
                          <Label className="mb-2 block">Velocidad de Visualización: {visualSpeed[0]}</Label>
                          <Slider
                            min={1}
                            max={30} // Aumentado el máximo para una visualización más rápida
                            step={1}
                            value={visualSpeed}
                            onValueChange={setVisualSpeed}
                            disabled={isManifestActive}
                            className="mb-4"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {isManifestActive ? (
                          <>
                            <div className="text-quantum-primary font-medium">
                              Manifestación activa
                            </div>
                            <QuantumButton 
                              variant="outline"
                              onClick={stopManifestation}
                            >
                              Detener Manifestación
                            </QuantumButton>
                          </>
                        ) : (
                          <>
                            <div className="text-muted-foreground">
                              {patternImage ? 'Listo para iniciar manifestación' : 'Carga un patrón para continuar'}
                            </div>
                            <QuantumButton 
                              onClick={startManifestation}
                              disabled={!patternImage || !intention.trim()}
                            >
                              Activar Manifestación
                            </QuantumButton>
                          </>
                        )}
                      </div>
                      
                      {isManifestActive && (
                        <div className="mt-6 relative overflow-hidden rounded-lg bg-black h-[300px]">
                          <div className="absolute inset-0 flex items-center justify-center">
                            {/* Imagen del patrón o imagen del receptor en alternancia */}
                            {(patternImage || receptorImage) && (
                              <img 
                                src={currentImage === 'pattern' ? patternImage || '' : receptorImage || ''}
                                alt="Patrón de manifestación"
                                className="max-h-full max-w-full object-contain opacity-80"
                              />
                            )}
                            
                            {/* Texto de la intención superpuesto con estilo más sutil para la sección personalizada */}
                            <div 
                              className="absolute inset-0 flex items-center justify-center text-white font-medium text-xl opacity-60"
                              style={{
                                animation: `textPulse ${60/visualSpeed[0]}s alternate infinite ease-in-out`,
                                textShadow: '0 0 8px rgba(255,255,255,0.6), 0 0 16px rgba(155,135,245,0.6)'
                              }}
                            >
                              {intention}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="py-12 px-4 bg-quantum-gradient-soft">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Cómo Funciona la Manifestación Cuántica</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              QuantumSync utiliza principios de manifestación cuántica y radiónica para amplificar tus intenciones a nivel energético.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="quantum-card p-6">
              <div className="w-12 h-12 rounded-full bg-quantum-gradient-soft text-quantum-primary flex items-center justify-center mb-4 mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Define tu Intención</h3>
              <p className="text-muted-foreground text-center">
                Establece claramente qué deseas manifestar, siendo específico y positivo en tu formulación.
              </p>
            </Card>
            
            <Card className="quantum-card p-6">
              <div className="w-12 h-12 rounded-full bg-quantum-gradient-soft text-quantum-primary flex items-center justify-center mb-4 mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Amplifica con Patrones Radiónicos</h3>
              <p className="text-muted-foreground text-center">
                Los patrones geométricos actúan como amplificadores energéticos para tu intención en el campo cuántico.
              </p>
            </Card>
            
            <Card className="quantum-card p-6">
              <div className="w-12 h-12 rounded-full bg-quantum-gradient-soft text-quantum-primary flex items-center justify-center mb-4 mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Activa la Manifestación</h3>
              <p className="text-muted-foreground text-center">
                Mediante la visualización activa y las frecuencias sonoras, tu intención se programa en la matriz de la realidad.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Patrones Radiónicos Avanzados</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explora nuestra biblioteca de patrones radiónicos para diferentes propósitos de manifestación.
            </p>
          </div>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent>
              {patterns.map((pattern) => (
                <CarouselItem key={pattern.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="quantum-card h-full">
                    <div className="p-1">
                      <div className="h-48 flex items-center justify-center p-6">
                        <div className="relative w-full h-full">
                          <div className="absolute inset-0 rounded-full bg-quantum-gradient-soft opacity-30 animate-pulse-soft"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-2xl font-bold holographic-gradient">{pattern.name}</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 text-center">
                        <h4 className="font-medium mb-2">{pattern.name}</h4>
                        <p className="text-sm text-muted-foreground">{pattern.description}</p>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
    </Layout>
  );
};

export default Manifest;
