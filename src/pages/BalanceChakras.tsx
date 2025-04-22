
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
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import QuantumButton from '@/components/QuantumButton';
import ChakraHeader from '@/components/quantum/ChakraHeader';
import ChakraFigure from '@/components/quantum/ChakraFigure';
import { useChakraAudio } from '@/hooks/useChakraAudio';
import { CHAKRA_ORDER, CHAKRA_COLORS, CHAKRA_FREQUENCIES, type ChakraName } from '@/constants/chakraData';

interface LocationState {
  personName?: string;
  chakraStates?: Array<{
    name: string;
    state: string | null;
  }>;
}

// Opciones de equilibrado
type BalanceOption = 'all' | 'blocked';

const BalanceChakras = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState || {};
  
  const [personName, setPersonName] = useState(state.personName || '');
  const [duration, setDuration] = useState([1]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChakra, setCurrentChakra] = useState<ChakraName | ''>('');
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [balanceOption, setBalanceOption] = useState<BalanceOption>('all');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { playChakraSound, stopSound } = useChakraAudio();
  
  // Prepare chakras to balance based on the selected option
  const getChakrasToBalance = () => {
    if (balanceOption === 'all') {
      return [...CHAKRA_ORDER];
    } else {
      // If we have diagnosis data, only include chakras that need balancing
      if (state.chakraStates && state.chakraStates.length > 0) {
        return CHAKRA_ORDER.filter(chakraName => {
          const chakraData = state.chakraStates?.find(c => c.name === chakraName);
          return chakraData && (chakraData.state === 'CERRADO' || chakraData.state === 'BLOQUEADO');
        });
      } else {
        // If no diagnosis data, fall back to all chakras
        return [...CHAKRA_ORDER];
      }
    }
  };
  
  // Start the balancing process
  const startBalancing = () => {
    if (!personName.trim()) {
      toast({
        title: "Nombre requerido",
        description: "Por favor ingresa el nombre de la persona a tratar.",
        variant: "destructive"
      });
      return;
    }
    
    const chakrasToBalance = getChakrasToBalance();
    
    if (chakrasToBalance.length === 0) {
      toast({
        title: "No hay chakras para equilibrar",
        description: "Todos los chakras ya están equilibrados.",
      });
      return;
    }
    
    setIsPlaying(true);
    setCurrentChakra(chakrasToBalance[0]);
    setProgress(0);
    setCompleted(false);
    
    toast({
      title: "Proceso iniciado",
      description: `Armonizando chakras para ${personName}...`,
    });
    
    playChakraSound(chakrasToBalance[0]);
  };
  
  // Stop the process
  const stopBalancing = () => {
    setIsPlaying(false);
    setCurrentChakra('');
    stopSound();
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    toast({
      title: "Proceso detenido",
      description: "Armonización de chakras interrumpida.",
    });
  };
  
  // Handle chakra progression
  useEffect(() => {
    if (!isPlaying || !currentChakra) return;
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const chakrasToBalance = getChakrasToBalance();
    const chakraDuration = duration[0] * 60 * 1000;
    const updateInterval = 100;
    let elapsedTime = 0;
    
    timerRef.current = setInterval(() => {
      elapsedTime += updateInterval;
      const newProgress = Math.min(100, (elapsedTime / chakraDuration) * 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        const currentIndex = chakrasToBalance.indexOf(currentChakra as ChakraName);
        
        if (currentIndex < chakrasToBalance.length - 1) {
          const nextChakra = chakrasToBalance[currentIndex + 1];
          setCurrentChakra(nextChakra);
          setProgress(0);
          elapsedTime = 0;
          playChakraSound(nextChakra);
          
          toast({
            title: `Chakra ${currentChakra} armonizado`,
            description: `Ahora armonizando el chakra ${nextChakra}...`,
          });
        } else {
          clearInterval(timerRef.current as NodeJS.Timeout);
          timerRef.current = null;
          setIsPlaying(false);
          setCompleted(true);
          stopSound();
          
          toast({
            title: "¡Armonización Finalizada!",
            description: "Todos los chakras han sido equilibrados.",
          });
        }
      }
    }, updateInterval);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, currentChakra, duration, balanceOption]);
  
  // Display chakra states if coming from diagnosis
  const hasChakraStates = state.chakraStates && state.chakraStates.some(c => c.state);
  
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
            
            {/* Opciones de equilibrado */}
            <div className="mb-6">
              <Label className="block mb-2">
                Opción de equilibrado
              </Label>
              <RadioGroup 
                value={balanceOption} 
                onValueChange={(value) => setBalanceOption(value as BalanceOption)}
                className="flex flex-col space-y-2"
                disabled={isPlaying}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="option-all" />
                  <Label htmlFor="option-all" className="cursor-pointer">
                    Equilibrar todos los chakras
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="blocked" id="option-blocked" />
                  <Label htmlFor="option-blocked" className="cursor-pointer">
                    Equilibrar solo chakras cerrados o bloqueados
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Muestra los estados de los chakras si vienen del diagnóstico */}
            {hasChakraStates && balanceOption === 'blocked' && (
              <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-medium mb-2">Resultados del diagnóstico:</h3>
                <ul className="text-sm space-y-1">
                  {state.chakraStates?.map((chakra) => (
                    <li key={chakra.name} className="flex items-center">
                      <span 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: CHAKRA_COLORS[chakra.name as ChakraName] }}
                      ></span>
                      <span>{chakra.name}: </span>
                      <span className={`ml-1 font-medium ${
                        chakra.state === 'EQUILIBRADO' ? 'text-green-600' : 
                        chakra.state === 'CERRADO' ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {chakra.state}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
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
            
            <ChakraFigure currentChakra={currentChakra} />
            
            {isPlaying && (
              <div className="w-full max-w-xs mx-auto mb-8 text-center">
                <p className="text-sm mb-1">
                  Armonizando chakra {currentChakra} ({CHAKRA_FREQUENCIES[currentChakra as ChakraName]} Hz)
                </p>
                <Progress 
                  value={progress} 
                  className="h-2 w-full bg-gray-200 rounded-full overflow-hidden"
                  style={{
                    "--progress-foreground": CHAKRA_COLORS[currentChakra as ChakraName]
                  } as React.CSSProperties}
                />
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
