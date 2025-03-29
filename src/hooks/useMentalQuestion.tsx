
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
        
        // Check for significant deviation from the initial position (more sensitive thresholds)
        const hasSignificantRotation = 
          (Math.abs(motion.rotation.beta || 0) > 3.0) || 
          (Math.abs(motion.rotation.gamma || 0) > 3.0) || 
          (Math.abs(motion.rotation.alpha || 0) > 3.0);
        
        const hasSignificantAcceleration = 
          (Math.abs(motion.acceleration.x || 0) > 0.2) || 
          (Math.abs(motion.acceleration.y || 0) > 0.2) || 
          (Math.abs(motion.acceleration.z || 0) > 0.3);
        
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
      // Request permission for device motion
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
        startPendulumSound(0.2);
      }

      // Calibrar el dispositivo al inicio
      console.log("Calibrando dispositivo para pregunta mental...");
      calibrateDevice();

      // Show toast with instructions
      toast({
        title: "Formulando pregunta",
        description: "Piensa en tu pregunta mientras sostienes el dispositivo...",
      });
      
      // Esperamos 5 segundos mientras se monitorea el movimiento
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      console.log(`Estado final de detección: motionDetected=${motionDetected}`);
      
      // Garantizar que siempre tenemos un resultado (SI o NO)
      // Forzamos una respuesta después de 5 segundos
      let result: 'SI' | 'NO';
      
      if (motionDetected) {
        console.log("Se detectó movimiento significativo - respuesta SI");
        result = "SI";
      } else {
        // Si no tenemos datos de sensores o no se detectó movimiento, generamos respuesta aleatoria
        if (motion.rotation.beta === null && motion.rotation.gamma === null) {
          result = Math.random() > 0.5 ? "SI" : "NO";
          console.log(`Generando respuesta aleatoria por falta de datos: ${result}`);
        } else {
          // Verificar una última vez con umbrales muy bajos
          const hasAnyMotion = 
            (Math.abs(motion.rotation.beta || 0) > 2.0) || 
            (Math.abs(motion.rotation.gamma || 0) > 2.0) ||
            (Math.abs(motion.rotation.alpha || 0) > 2.0) ||
            (Math.abs(motion.acceleration.x || 0) > 0.1) ||
            (Math.abs(motion.acceleration.y || 0) > 0.1) ||
            (Math.abs(motion.acceleration.z || 0) > 0.2);
          
          result = hasAnyMotion ? "SI" : "NO";
          console.log(`Última comprobación de movimiento: ${result}`);
          
          // Si aún no detectamos movimiento, generamos un resultado aleatorio
          if (result === "NO" && Math.random() > 0.7) {
            result = "SI";
            console.log("Forzando respuesta aleatoria SI");
          }
        }
      }
      
      // Establecer el resultado final
      setCameraResult(result);
      
      // Detener sonido
      stopPendulumSound();
      
      return result;
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
      // SIEMPRE asegurar que hay un resultado
      if (!cameraResult) {
        const finalResult = Math.random() > 0.5 ? "SI" : "NO";
        console.log(`Configurando resultado final forzado: ${finalResult}`);
        setCameraResult(finalResult);
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
