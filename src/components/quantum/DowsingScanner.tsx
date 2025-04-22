
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Bell, Play, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QuantumButton from '@/components/QuantumButton';
import DowsingRing from './DowsingRing';
import { toast } from "@/components/ui/use-toast";
import { Progress } from '@/components/ui/progress';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define los posibles estados de los chakras
type ChakraState = 'EQUILIBRADO' | 'ABIERTO' | 'CERRADO' | 'BLOQUEADO';

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
        
        // Generar resultados de los chakras
        const chakraStates: ChakraState[] = ['EQUILIBRADO', 'ABIERTO', 'CERRADO', 'BLOQUEADO'];
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
        
        <div className="relative w-64 mx-auto mb-8 h-96">
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
          {chakras.map((chakra, index) => (
            <motion.div
              key={chakra.name}
              className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center"
              style={{ 
                top: `${chakra.yPosition}%`,
                zIndex: 3
              }}
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
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: chakra.color,
                  boxShadow: `0 0 15px ${chakra.color}` 
                }}
              >
                <div className="w-5 h-5 rounded-full bg-white opacity-70"></div>
              </div>
              
              {/* Estado del chakra (después del escaneo) */}
              {scanComplete && chakra.state && (
                <motion.div
                  className="ml-12 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  {chakra.state}
                </motion.div>
              )}
            </motion.div>
          ))}
          
          {/* Barra de escaneo */}
          {scanning && (
            <motion.div 
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-quantum-primary/20 via-quantum-primary to-quantum-primary/20"
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
        
        <div className="flex flex-col gap-4 items-center">
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
