
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Play, Square, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from "@/components/ui/use-toast";
import QuantumButton from '@/components/QuantumButton';
import ChakraHeader from '@/components/quantum/ChakraHeader';

// Definir las frecuencias de los chakras
const CHAKRA_FREQUENCIES = {
  'Raíz': 396,
  'Sacro': 417,
  'Plexo Solar': 528,
  'Corazón': 639,
  'Garganta': 741,
  'Tercer Ojo': 852,
  'Corona': 963
};

// Definir los colores de los chakras
const CHAKRA_COLORS = {
  'Corona': '#A675F5',
  'Tercer Ojo': '#5E5DF0',
  'Garganta': '#3498DB',
  'Corazón': '#2ECC71',
  'Plexo Solar': '#F1C40F',
  'Sacro': '#E67E22',
  'Raíz': '#E74C3C'
};

// Definir las posiciones de los chakras
const CHAKRA_POSITIONS = {
  'Corona': 10,
  'Tercer Ojo': 20,
  'Garganta': 30,
  'Corazón': 42,
  'Plexo Solar': 55,
  'Sacro': 68,
  'Raíz': 82
};

// Interfaz para los datos de estado pasados desde la página anterior
interface LocationState {
  personName?: string;
  chakraStates?: Array<{
    name: string;
    state: string | null;
  }>;
}

const BalanceChakras = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState || {};
  
  const [personName, setPersonName] = useState(state.personName || '');
  const [duration, setDuration] = useState([1]); // Duración en minutos (1-5)
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChakra, setCurrentChakra] = useState('');
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  
  const audioContext = useRef<AudioContext | null>(null);
  const oscillator = useRef<OscillatorNode | null>(null);
  const gainNode = useRef<GainNode | null>(null);
  
  // Ordenar los chakras de abajo hacia arriba (de Raíz a Corona)
  const chakraOrder = [
    'Raíz', 
    'Sacro', 
    'Plexo Solar', 
    'Corazón', 
    'Garganta', 
    'Tercer Ojo', 
    'Corona'
  ];
  
  // Inicializar el contexto de audio si está disponible
  useEffect(() => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      audioContext.current = new AudioContext();
      gainNode.current = audioContext.current.createGain();
      gainNode.current.gain.value = 0.3; // Volumen moderado
      gainNode.current.connect(audioContext.current.destination);
    } else {
      console.error('Web Audio API no soportada en este navegador');
    }
    
    return () => {
      stopSound();
      if (audioContext.current && audioContext.current.state !== 'closed') {
        audioContext.current.close();
      }
    };
  }, []);
  
  // Función para reproducir la frecuencia de un chakra
  const playChakraSound = (chakraName: string) => {
    if (!audioContext.current || audioContext.current.state === 'closed') {
      audioContext.current = new AudioContext();
      gainNode.current = audioContext.current.createGain();
      gainNode.current.gain.value = 0.3;
      gainNode.current.connect(audioContext.current.destination);
    }
    
    // Detener cualquier sonido actual
    stopSound();
    
    // Crear y configurar un nuevo oscilador
    if (audioContext.current && gainNode.current) {
      oscillator.current = audioContext.current.createOscillator();
      oscillator.current.type = 'sine'; // Usar onda sinusoidal para un tono más puro
      oscillator.current.frequency.value = CHAKRA_FREQUENCIES[chakraName as keyof typeof CHAKRA_FREQUENCIES];
      oscillator.current.connect(gainNode.current);
      oscillator.current.start();
      
      console.log(`Reproduciendo frecuencia ${CHAKRA_FREQUENCIES[chakraName as keyof typeof CHAKRA_FREQUENCIES]} Hz para chakra ${chakraName}`);
    }
  };
  
  // Función para detener el sonido
  const stopSound = () => {
    if (oscillator.current) {
      oscillator.current.stop();
      oscillator.current.disconnect();
      oscillator.current = null;
    }
  };
  
  // Iniciar el proceso de equilibrio de chakras
  const startBalancing = () => {
    if (!personName.trim()) {
      toast({
        title: "Nombre requerido",
        description: "Por favor ingresa el nombre de la persona a tratar.",
        variant: "destructive"
      });
      return;
    }
    
    setIsPlaying(true);
    setCurrentChakra(chakraOrder[0]);
    setProgress(0);
    setCompleted(false);
    
    toast({
      title: "Proceso iniciado",
      description: `Armonizando chakras para ${personName}...`,
    });
    
    // Iniciar con el primer chakra
    playChakraSound(chakraOrder[0]);
  };
  
  // Detener el proceso
  const stopBalancing = () => {
    setIsPlaying(false);
    setCurrentChakra('');
    stopSound();
    
    toast({
      title: "Proceso detenido",
      description: "Armonización de chakras interrumpida.",
    });
  };
  
  // Manejar el avance a través de los chakras
  useEffect(() => {
    if (!isPlaying || !currentChakra) return;
    
    const chakraDuration = duration[0] * 60 * 1000; // Convertir minutos a milisegundos
    const intervalTime = 100; // Actualizar cada 100ms
    const steps = chakraDuration / intervalTime;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(100, (currentStep / steps) * 100);
      setProgress(newProgress);
      
      // Cuando se completa el tiempo para este chakra
      if (newProgress >= 100) {
        // Encontrar el índice actual y pasar al siguiente chakra
        const currentIndex = chakraOrder.indexOf(currentChakra);
        
        if (currentIndex < chakraOrder.length - 1) {
          // Pasar al siguiente chakra
          const nextChakra = chakraOrder[currentIndex + 1];
          setCurrentChakra(nextChakra);
          setProgress(0);
          playChakraSound(nextChakra);
          
          toast({
            title: `Chakra ${currentChakra} armonizado`,
            description: `Ahora armonizando el chakra ${nextChakra}...`,
          });
        } else {
          // Proceso completado
          clearInterval(timer);
          setIsPlaying(false);
          setCompleted(true);
          stopSound();
          
          toast({
            title: "¡Armonización Finalizada!",
            description: "Todos los chakras han sido equilibrados.",
          });
        }
      }
    }, intervalTime);
    
    return () => clearInterval(timer);
  }, [isPlaying, currentChakra, duration, chakraOrder]);
  
  return (
    <Layout>
      <ChakraHeader />
      
      <div className="container mx-auto py-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 max-w-3xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold holographic-gradient mb-2">Equilibrar Chakras</h2>
              <p className="text-muted-foreground">
                Armoniza y equilibra los 7 chakras principales con frecuencias específicas
              </p>
            </div>
            
            <div className="mb-6">
              <Label htmlFor="personName" className="block mb-2">
                Nombre de la persona a tratar
              </Label>
              <Input
                id="personName"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="Ingresa el nombre"
                maxLength={100}
                className="bg-quantum-dark/30 border-quantum-primary/30"
                disabled={isPlaying}
              />
            </div>
            
            <div className="mb-8">
              <Label className="block mb-2">
                Tiempo por chakra: {duration[0]} {duration[0] === 1 ? 'minuto' : 'minutos'}
              </Label>
              <Slider
                value={duration}
                onValueChange={setDuration}
                min={1}
                max={5}
                step={1}
                disabled={isPlaying}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1 min</span>
                <span>2 min</span>
                <span>3 min</span>
                <span>4 min</span>
                <span>5 min</span>
              </div>
            </div>
            
            <div className="relative w-full max-w-xs mx-auto h-96 mb-8">
              {/* Imagen de fondo de figura humana */}
              <div className="absolute inset-0 bg-gradient-to-b from-quantum-dark/10 to-quantum-dark/30 rounded-xl overflow-hidden">
                <svg 
                  viewBox="0 0 200 400" 
                  className="h-full w-full opacity-40"
                  style={{ mixBlendMode: 'luminosity' }}
                >
                  <path d="M100,30 C130,30 130,10 100,10 C70,10 70,30 100,30 Z" fill="#ddd" /> {/* Cabeza */}
                  <rect x="95" y="30" width="10" height="40" fill="#ddd" /> {/* Cuello */}
                  <path d="M60,70 L140,70 L130,170 L70,170 Z" fill="#ddd" /> {/* Torso */}
                  <path d="M70,170 L50,290 L70,290 L80,170 Z" fill="#ddd" /> {/* Pierna izquierda */}
                  <path d="M130,170 L150,290 L130,290 L120,170 Z" fill="#ddd" /> {/* Pierna derecha */}
                  <path d="M140,70 L170,120 L150,120 L130,90 Z" fill="#ddd" /> {/* Brazo derecho */}
                  <path d="M60,70 L30,120 L50,120 L70,90 Z" fill="#ddd" /> {/* Brazo izquierdo */}
                </svg>
              </div>
              
              {/* Chakras */}
              {chakraOrder.map((chakraName) => {
                const isActive = currentChakra === chakraName;
                const yPosition = CHAKRA_POSITIONS[chakraName as keyof typeof CHAKRA_POSITIONS];
                const color = CHAKRA_COLORS[chakraName as keyof typeof CHAKRA_COLORS];
                
                return (
                  <motion.div
                    key={chakraName}
                    className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center"
                    style={{ 
                      top: `${yPosition}%`,
                      zIndex: 3
                    }}
                    initial={{ scale: 0.8, opacity: 0.7 }}
                    animate={{ 
                      scale: isActive ? [0.8, 1.5, 0.8] : 0.8, 
                      opacity: isActive ? [0.7, 1, 0.7] : 0.7,
                      boxShadow: isActive ? `0 0 30px ${color}` : 'none'
                    }}
                    transition={{ 
                      repeat: isActive ? Infinity : 0, 
                      duration: 2
                    }}
                  >
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ 
                        backgroundColor: color,
                        boxShadow: isActive ? `0 0 15px ${color}` : 'none'
                      }}
                    >
                      <div className="w-5 h-5 rounded-full bg-white opacity-70"></div>
                    </div>
                    
                    {isActive && (
                      <motion.div
                        className="ml-14 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        {chakraName} - {CHAKRA_FREQUENCIES[chakraName as keyof typeof CHAKRA_FREQUENCIES]} Hz
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
            
            {isPlaying && (
              <div className="w-full max-w-xs mx-auto mb-8 text-center">
                <p className="text-sm mb-1">
                  Armonizando chakra {currentChakra} ({CHAKRA_FREQUENCIES[currentChakra as keyof typeof CHAKRA_FREQUENCIES]} Hz)
                </p>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full" 
                    style={{ 
                      width: `${progress}%`,
                      backgroundColor: CHAKRA_COLORS[currentChakra as keyof typeof CHAKRA_COLORS]
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Progreso: {Math.round(progress)}%
                </p>
              </div>
            )}
            
            {completed && (
              <motion.div
                className="flex items-center justify-center p-4 mb-8 rounded-lg bg-green-100 text-green-800"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Check className="mr-2" size={20} />
                <span className="font-medium">¡Armonización Finalizada!</span>
              </motion.div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isPlaying && !completed ? (
                <QuantumButton 
                  onClick={startBalancing} 
                  disabled={!personName.trim()}
                  className="bg-quantum-primary text-white hover:bg-quantum-primary/80"
                >
                  <Play size={16} />
                  Iniciar Armonización
                </QuantumButton>
              ) : isPlaying ? (
                <QuantumButton 
                  onClick={stopBalancing}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  <Square size={16} />
                  Finalizar
                </QuantumButton>
              ) : (
                <QuantumButton 
                  onClick={() => {
                    setCompleted(false);
                    startBalancing();
                  }}
                  className="bg-quantum-primary text-white hover:bg-quantum-primary/80"
                >
                  <Play size={16} />
                  Iniciar Nuevamente
                </QuantumButton>
              )}
              
              {(completed || isPlaying) && (
                <QuantumButton 
                  onClick={() => navigate('/diagnose')}
                  variant="outline"
                  className="border-quantum-primary/30 hover:bg-quantum-primary/10"
                >
                  Volver a Diagnóstico
                </QuantumButton>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default BalanceChakras;
