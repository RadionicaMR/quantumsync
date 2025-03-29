
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { useDeviceMotion } from '@/hooks/useDeviceMotion';
import { usePendulumAudio } from '@/hooks/usePendulumAudio';

export const useMentalQuestion = (pendulumSound: boolean) => {
  const [askingMental, setAskingMental] = useState(false);
  const [processingCamera, setProcessingCamera] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [motionDetected, setMotionDetected] = useState(false);
  const [cameraResult, setCameraResult] = useState<'SI' | 'NO' | null>(null);

  const { detectMotion, requestPermission, motion, calibrateDevice } = useDeviceMotion();
  const { startPendulumSound, stopPendulumSound } = usePendulumAudio();
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      if (/android|iPad|iPhone|iPod/i.test(userAgent)) {
        setIsMobileDevice(true);
        
        // Automatically request permission for device motion on mobile devices
        requestPermission().catch(console.error);
      }
    };
    
    checkMobile();
  }, [requestPermission]);

  // Monitor device motion with a lower threshold for better detection
  useEffect(() => {
    if (!askingMental) {
      setMotionDetected(false);
      return;
    }
    
    console.log("Activando monitoreo continuo de movimiento...");
    
    const intervalId = setInterval(() => {
      // Use more sensitive thresholds for detecting motion
      if (motion.rotation.beta !== null || motion.rotation.gamma !== null || 
          motion.acceleration.x !== null || motion.acceleration.y !== null || 
          motion.acceleration.z !== null) {
        
        // Check for significant deviation from the initial position (reduced thresholds)
        const hasSignificantRotation = 
          (Math.abs(motion.rotation.beta || 0) > 5.0) || 
          (Math.abs(motion.rotation.gamma || 0) > 5.0) || 
          (Math.abs(motion.rotation.alpha || 0) > 5.0);
        
        const hasSignificantAcceleration = 
          (Math.abs(motion.acceleration.x || 0) > 0.3) || 
          (Math.abs(motion.acceleration.y || 0) > 0.3) || 
          (Math.abs(motion.acceleration.z || 0) > 0.4);
        
        if (hasSignificantRotation || hasSignificantAcceleration) {
          console.log("¡Movimiento significativo detectado durante monitoreo continuo!");
          setMotionDetected(true);
        }
      }
    }, 100);
    
    return () => clearInterval(intervalId);
  }, [askingMental, motion]);

  const startMentalQuestion = async () => {
    setAskingMental(true);
    setCameraResult(null);
    setProcessingCamera(true);
    setMotionDetected(false);
    
    console.log("Iniciando pregunta mental, activando sensores...");
    
    try {
      // Request permission for device motion - even if already granted, to ensure it's active
      const hasPermission = await requestPermission();
      
      if (!hasPermission) {
        toast({
          title: "Permiso denegado",
          description: "Necesitamos acceso al sensor de movimiento para esta funcionalidad.",
          variant: "destructive"
        });
        setProcessingCamera(false);
        setAskingMental(false);
        return null;
      }
      
      // Play sound if enabled
      if (pendulumSound) {
        startPendulumSound(0.2); // Aumentamos ligeramente el volumen para mejor retroalimentación
      }

      // Calibrar el dispositivo al inicio - MUY IMPORTANTE para iniciar desde cero
      console.log("Calibrando dispositivo para pregunta mental...");
      calibrateDevice();

      // Show toast with instructions
      toast({
        title: "Formulando pregunta",
        description: "Piensa en tu pregunta mientras sostienes el dispositivo...",
      });

      // Utilizamos un umbral más bajo para detectar movimientos más sutiles
      console.log("Iniciando detección de movimiento con umbral más sensible...");
      
      // Esperamos 5 segundos mientras se monitorea el movimiento
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      console.log(`Estado final de detección: motionDetected=${motionDetected}`);
      
      // Evaluar si hubo movimiento significativo con umbral más bajo
      if (motionDetected) {
        console.log("Se detectó movimiento significativo - respuesta SI");
        setCameraResult("SI");
      } else {
        // Verificar una última vez si hay algún movimiento significativo en el estado actual
        // con umbrales más bajos para aumentar la sensibilidad
        const currentHasSignificantMotion = 
          (Math.abs(motion.rotation.beta || 0) > 5.0) || 
          (Math.abs(motion.rotation.gamma || 0) > 5.0) ||
          (Math.abs(motion.rotation.alpha || 0) > 5.0) ||
          (Math.abs(motion.acceleration.x || 0) > 0.3) ||
          (Math.abs(motion.acceleration.y || 0) > 0.3) ||
          (Math.abs(motion.acceleration.z || 0) > 0.4);
        
        if (currentHasSignificantMotion) {
          console.log("Se detectó movimiento en la comprobación final - respuesta SI");
          setCameraResult("SI");
        } else {
          console.log("NO se detectó movimiento significativo - respuesta NO");
          setCameraResult("NO");
          
          // Si no hay suficientes datos del sensor, generamos una respuesta aleatoria como fallback
          if (motion.rotation.beta === null && motion.rotation.gamma === null) {
            const randomResult = Math.random() > 0.5 ? "SI" : "NO";
            console.log(`Generando respuesta aleatoria debido a falta de datos: ${randomResult}`);
            setCameraResult(randomResult);
          }
        }
      }

      // Stop sound
      stopPendulumSound();
      
      // Asegurémonos de que siempre hay un resultado
      if (!cameraResult) {
        const fallbackResult = Math.random() > 0.5 ? "SI" : "NO";
        console.log(`Usando resultado fallback: ${fallbackResult}`);
        setCameraResult(fallbackResult);
      }
      
      return cameraResult;
    } catch (error) {
      console.error("Error durante la pregunta mental:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error durante el análisis de movimiento.",
        variant: "destructive"
      });
      
      // Generar un resultado aleatorio en caso de error
      const errorResult = Math.random() > 0.5 ? "SI" : "NO";
      console.log(`Generando respuesta aleatoria debido a error: ${errorResult}`);
      setCameraResult(errorResult);
      return errorResult;
    } finally {
      // Asegurémonos de que siempre hay un resultado antes de finalizar
      if (!cameraResult) {
        const finalFallbackResult = Math.random() > 0.5 ? "SI" : "NO";
        console.log(`Configurando resultado final: ${finalFallbackResult}`);
        setCameraResult(finalFallbackResult);
      }
      
      setProcessingCamera(false);
      setAskingMental(false);
    }
  };

  return {
    askingMental,
    processingCamera,
    isMobileDevice,
    cameraResult,
    setCameraResult,
    startMentalQuestion
  };
};
