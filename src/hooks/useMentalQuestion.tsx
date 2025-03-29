
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
  const [countdownSeconds, setCountdownSeconds] = useState(0);

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

  // Cuenta regresiva mientras se procesa
  useEffect(() => {
    let timer: number | null = null;
    
    if (processingCamera) {
      setCountdownSeconds(5);
      timer = window.setInterval(() => {
        setCountdownSeconds(prev => {
          if (prev <= 1) {
            if (timer) clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCountdownSeconds(0);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [processingCamera]);

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
        description: "Piensa en tu pregunta mientras sostienes el dispositivo por 5 segundos...",
      });
      
      // Utilizar detectMotion para obtener resultado, esperando siempre 5 segundos
      console.log("Iniciando detección de movimiento por 5 segundos...");
      const hasMotion = await detectMotion(5000, 1.0);
      console.log("Resultado de detección de movimiento:", hasMotion);
      
      // Establecer resultado basado en detección de movimiento
      let result: 'SI' | 'NO';
      
      if (hasMotion) {
        console.log("Se detectó movimiento - respuesta SI");
        result = "SI";
      } else {
        console.log("No se detectó movimiento - respuesta NO");
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
      
      // En caso de error, no establecer resultado
      setCameraResult(null);
      return null;
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
    startMentalQuestion,
    countdownSeconds
  };
};
