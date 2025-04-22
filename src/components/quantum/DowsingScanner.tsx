
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Bell, Play, Wand2, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QuantumButton from '@/components/QuantumButton';
import DowsingRing from './DowsingRing';
import { toast } from "@/components/ui/use-toast";
import { Progress } from '@/components/ui/progress';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define los posibles estados de los chakras
type ChakraState = 'EQUILIBRADO' | 'CERRADO' | 'BLOQUEADO';

// Define la estructura de un chakra
interface Chakra {
  name: string;
  color: string;
  position: string;
  state: ChakraState | null;
  yPosition: number; // Posición vertical relativa (0-100)
}

const DowsingScanner = () => {
  const navigate = useNavigate();
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [email, setEmail] = useState('');
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [personName, setPersonName] = useState('');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  // Definir los chakras y sus posiciones
  const [chakras, setChakras] = useState<Chakra[]>([
    { name: 'Corona', color: '#A675F5', position: 'top', state: null, yPosition: 10 },
    { name: 'Tercer Ojo', color: '#5E5DF0', position: 'forehead', state: null, yPosition: 20 },
    { name: 'Garganta', color: '#3498DB', position: 'throat', state: null, yPosition: 30 },
    { name: 'Corazón', color: '#2ECC71', position: 'chest', state: null, yPosition: 42 },
    { name: 'Plexo Solar', color: '#F1C40F', position: 'solarPlexus', state: null, yPosition: 55 },
    { name: 'Sacro', color: '#E67E22', position: 'sacral', state: null, yPosition: 68 },
    { name: 'Raíz', color: '#E74C3C', position: 'root', state: null, yPosition: 82 }
  ]);
  
  // Función para iniciar el escaneo
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
    
    // Resetear los estados de los chakras
    setChakras(prev => prev.map(chakra => ({
      ...chakra,
      state: null
    })));
    
    toast({
      title: "Escáner Iniciado",
      description: `Analizando el campo energético de ${personName}...`,
    });
  };
  
  // Función para detener el escaneo
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
  
  // Efecto para actualizar el progreso durante el escaneo
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
      
      // Cuando se completa el escaneo
      if (newProgress >= 100) {
        clearInterval(timer);
        setScanning(false);
        setScanComplete(true);
        
        // Generar resultados de los chakras - limitado a las tres opciones
        const chakraStates: ChakraState[] = ['EQUILIBRADO', 'CERRADO', 'BLOQUEADO'];
        const updatedChakras = chakras.map(chakra => ({
          ...chakra,
          state: chakraStates[Math.floor(Math.random() * chakraStates.length)]
        }));
        setChakras(updatedChakras);
        
        toast({
          title: "Escáner Completado",
          description: `Resultados disponibles para ${personName}`,
        });
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [scanning, personName, chakras]);
  
  // Función para navegar a la página de equilibrar chakras
  const navigateToBalance = () => {
    navigate('/balance-chakras', { 
      state: { 
        personName,
        chakraStates: chakras.map(c => ({ name: c.name, state: c.state }))
      } 
    });
  };
  
  // Posición de la barra de escaneo
  const scanBarPosition = scanning ? 
    `${Math.min(82, (progress / 100) * 72 + 10)}%` : '10%';
  
  return (
    <Card className="quantum-card p-6">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold mb-4">Escáner Completo de Campo Energético</h3>
        
        <div className="mb-6">
          <Label htmlFor="personName" className="block text-left mb-2">
            Nombre de la persona a diagnosticar
          </Label>
          <Input
            id="personName"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            placeholder="Ingresa el nombre"
            maxLength={100}
            className="bg-quantum-dark/30 border-quantum-primary/30"
            disabled={scanning}
          />
        </div>
        
        <div className="relative w-full mx-auto mb-8 h-96 flex">
          {/* Human figure background */}
          <div className="absolute left-0 w-3/4 h-full rounded-xl overflow-hidden">
            <img 
              src="/lovable-uploads/398a244d-cfb8-44ba-9036-e14561fe19d0.png"
              alt="Chakra visualization"
              className="h-full object-contain mx-auto"
            />
          </div>
          
          {/* Chakra indicators on the right side */}
          <div className="absolute right-0 w-1/4 h-full flex flex-col justify-center items-start">
            {chakras.map((chakra, index) => (
              <div 
                key={chakra.name}
                className="flex items-center mb-2 relative"
                style={{ 
                  marginTop: index === 0 ? '0' : '8px'
                }}
              >
                <motion.div
                  className="flex items-center"
                  initial={{ scale: 0.8, opacity: 0.7 }}
                  animate={{ 
                    scale: [0.8, 1.2, 0.8], 
                    opacity: scanning ? [0.7, 1, 0.7] : 1 
                  }}
                  transition={{ 
                    repeat: scanning ? Infinity : 0, 
                    duration: 2,
                    delay: index * 0.3 
                  }}
                >
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                    style={{ 
                      backgroundColor: chakra.color,
                      boxShadow: `0 0 10px ${chakra.color}` 
                    }}
                  >
                    <div className="w-3 h-3 rounded-full bg-white opacity-70"></div>
                  </div>
                  
                  <span className="text-xs font-medium whitespace-nowrap">{chakra.name}</span>
                  
                  {/* Estado del chakra (después del escaneo) */}
                  {scanComplete && chakra.state && (
                    <motion.div
                      className="ml-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      {chakra.state}
                    </motion.div>
                  )}
                </motion.div>
              </div>
            ))}
          </div>
          
          {/* Barra de escaneo */}
          {scanning && (
            <motion.div 
              className="absolute left-0 w-3/4 h-1 bg-gradient-to-r from-quantum-primary/20 via-quantum-primary to-quantum-primary/20"
              style={{ 
                top: scanBarPosition,
                boxShadow: '0 0 10px rgba(155, 135, 245, 0.7)'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              ref={progressBarRef}
            />
          )}
        </div>
        
        <div className="mb-6">
          {scanning && (
            <div className="w-full max-w-xs mx-auto">
              <Progress value={progress} className="h-2 mb-2" />
              <p className="text-sm text-muted-foreground">Progreso del escáner: {Math.round(progress)}%</p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!scanning && !scanComplete && (
            <QuantumButton 
              onClick={startScan} 
              disabled={scanning || !personName.trim()}
              className="bg-quantum-primary text-white hover:bg-quantum-primary/80"
            >
              <Play size={16} />
              Iniciar Escaneo
            </QuantumButton>
          )}
          
          {scanning && (
            <QuantumButton 
              onClick={stopScan}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              <Square size={16} />
              Detener Escaneo
            </QuantumButton>
          )}
          
          {scanComplete && (
            <QuantumButton 
              onClick={navigateToBalance} 
              className="bg-gradient-to-r from-quantum-primary to-purple-500 text-white hover:from-quantum-primary/90 hover:to-purple-500/90"
            >
              <Wand2 size={16} />
              Equilibrar Chakras
            </QuantumButton>
          )}
        </div>
      </motion.div>
    </Card>
  );
};

export default DowsingScanner;
