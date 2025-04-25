
import { useState, useRef, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';

// Define the types
export type ChakraState = 'EQUILIBRADO' | 'CERRADO' | 'BLOQUEADO';

export interface Chakra {
  name: string;
  color: string;
  position: string;
  state: ChakraState | null;
  yPosition: number;
}

export const useDowsingScanner = () => {
  const navigate = useNavigate();
  const [personName, setPersonName] = useState('');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  const [chakras, setChakras] = useState<Chakra[]>([
    { name: 'Corona', color: '#A675F5', position: 'top', state: null, yPosition: 10 },
    { name: 'Tercer Ojo', color: '#5E5DF0', position: 'forehead', state: null, yPosition: 20 },
    { name: 'Garganta', color: '#3498DB', position: 'throat', state: null, yPosition: 30 },
    { name: 'Corazón', color: '#2ECC71', position: 'chest', state: null, yPosition: 42 },
    { name: 'Plexo Solar', color: '#F1C40F', position: 'solarPlexus', state: null, yPosition: 55 },
    { name: 'Sacro', color: '#E67E22', position: 'sacral', state: null, yPosition: 68 },
    { name: 'Raíz', color: '#E74C3C', position: 'root', state: null, yPosition: 82 }
  ]);

  const startScan = () => {
    if (!personName.trim()) {
      toast({
        title: "Nombre requerido",
        description: "Por favor ingresa el nombre de la persona a diagnosticar.",
        variant: "destructive"
      });
      return;
    }
    
    setScanning(true);
    setScanComplete(false);
    setProgress(0);
    
    setChakras(prev => prev.map(chakra => ({
      ...chakra,
      state: null
    })));
    
    toast({
      title: "Escáner Iniciado",
      description: `Analizando el campo energético de ${personName}...`,
    });
  };

  const stopScan = () => {
    if (scanning) {
      setScanning(false);
      setScanComplete(false);
      setProgress(0);
      
      toast({
        title: "Escáner Detenido",
        description: "El proceso de escaneo ha sido interrumpido.",
        variant: "destructive"
      });
    }
  };

  const navigateToBalance = () => {
    navigate('/balance-chakras', { 
      state: { 
        personName,
        chakraStates: chakras.map(c => ({ name: c.name, state: c.state }))
      } 
    });
  };

  useEffect(() => {
    if (!scanning) return;
    
    const totalDuration = 60000; // 60 segundos en total
    const interval = 100; // Actualizar cada 100ms
    const steps = totalDuration / interval;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(100, (currentStep / steps) * 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(timer);
        setScanning(false);
        setScanComplete(true);
        
        // Ensure at least 4 chakras are balanced
        const chakraStates: ChakraState[] = ['EQUILIBRADO', 'CERRADO', 'BLOQUEADO'];
        const updatedChakras = [...chakras];
        
        // First, randomly set 4 chakras to "EQUILIBRADO"
        const indices = Array.from({ length: chakras.length }, (_, i) => i);
        for (let i = 0; i < 4; i++) {
          const randomIndex = Math.floor(Math.random() * indices.length);
          const selectedIndex = indices.splice(randomIndex, 1)[0];
          updatedChakras[selectedIndex] = {
            ...updatedChakras[selectedIndex],
            state: 'EQUILIBRADO'
          };
        }
        
        // For the remaining chakras, randomly assign any state
        indices.forEach(index => {
          updatedChakras[index] = {
            ...updatedChakras[index],
            state: chakraStates[Math.floor(Math.random() * chakraStates.length)]
          };
        });
        
        setChakras(updatedChakras);
        
        toast({
          title: "Escáner Completado",
          description: `Resultados disponibles para ${personName}`,
        });
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [scanning, personName, chakras]);

  const scanBarPosition = scanning ? 
    `${Math.min(82, (progress / 100) * 72 + 10)}%` : '10%';

  return {
    personName,
    setPersonName,
    scanning,
    progress,
    scanComplete,
    chakras,
    scanBarPosition,
    startScan,
    stopScan,
    navigateToBalance,
    progressBarRef
  };
};
