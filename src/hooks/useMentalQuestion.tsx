
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

  const { motion, requestPermission, calibrateDevice, detectMotion } = useDeviceMotion();
  const { startPendulumSound, stopPendulumSound } = usePendulumAudio();
  
  // Verificar si es dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      if (/android|iPad|iPhone|iPod/i.test(userAgent)) {
        setIsMobileDevice(true);
        
        // Solicitar permiso automáticamente
        requestPermission().catch(console.error);
      }
    };
    
    checkMobile();
  }, [requestPermission]);

  // Monitorear el movimiento del dispositivo
  useEffect(() => {
    if (!askingMental) {
      setMotionDetected(false);
      return;
    }
    
    console.log("Activando monitoreo continuo de movimiento...");
    
    const intervalId = setInterval(() => {
      if (motion.rotation.beta !== null || motion.rotation.gamma !== null || 
          motion.acceleration.x !== null || motion.acceleration.y !== null || 
          motion.acceleration.z !== null) {
        
        // Verificar desviaciones significativas con umbral bajo
        const hasSignificantRotation = 
          (Math.abs(motion.rotation.beta || 0) > 2.0) || 
          (Math.abs(motion.rotation.gamma || 0) > 2.0) || 
          (Math.abs(motion.rotation.alpha || 0) > 2.0);
        
        const hasSignificantAcceleration = 
          (Math.abs(motion.acceleration.x || 0) > 0.15) || 
          (Math.abs(motion.acceleration.y || 0) > 0.15) || 
          (Math.abs(motion.acceleration.z || 0) > 0.15);
        
        if (hasSignificantRotation || hasSignificantAcceleration) {
          console.log("¡Movimiento significativo detectado durante monitoreo continuo!");
          setMotionDetected(true);
        }
      }
    }, 50); // Monitoreo más frecuente
    
    return () => clearInterval(intervalId);
  }, [askingMental, motion]);

  const startMentalQuestion = async () => {
    setAskingMental(true);
    setCameraResult(null);
    setProcessingCamera(true);
    setMotionDetected(false);
    
    console.log("Iniciando pregunta mental, activando sensores...");
    
    try {
      // Solicitar permiso para sensor de movimiento
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
      
      // Activar sonido si está habilitado
      if (pendulumSound) {
        startPendulumSound(0.3);
      }

      // Calibrar el dispositivo
      console.log("Calibrando dispositivo para pregunta mental...");
      calibrateDevice();

      // Mostrar toast con instrucciones
      toast({
        title: "Formulando pregunta",
        description: "Piensa en tu pregunta mientras sostienes el dispositivo...",
      });
      
      // Esperar mientras se monitorea el movimiento
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      console.log(`Estado final de detección: motionDetected=${motionDetected}`);
      
      // Determinar resultado basado en detección de movimiento
      let result: 'SI' | 'NO';
      
      if (motionDetected) {
        console.log("Se detectó movimiento significativo - respuesta SI");
        result = "SI";
      } else {
        console.log("No se detectó movimiento significativo - respuesta NO");
        result = "NO";
      }
      
      // Establecer resultado final
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
      
      // En caso de error, establecer NO como predeterminado
      setCameraResult("NO");
      return "NO";
    } finally {
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
