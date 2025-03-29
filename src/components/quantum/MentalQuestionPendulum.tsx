
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from "@/components/ui/use-toast";
import PendulumVisual from './PendulumVisual';
import MentalQuestionResult from './MentalQuestionResult';
import { useDeviceMotion } from '@/hooks/useDeviceMotion';
import { usePendulumAudio } from '@/hooks/usePendulumAudio';

interface MentalQuestionPendulumProps {
  useCameraMode: boolean;
  pendulumSound: boolean;
  cameraResult: 'SI' | 'NO' | null;
  setCameraResult: (result: 'SI' | 'NO' | null) => void;
}

const MentalQuestionPendulum: React.FC<MentalQuestionPendulumProps> = ({
  useCameraMode,
  pendulumSound,
  cameraResult,
  setCameraResult
}) => {
  const [isPendulumSwinging, setIsPendulumSwinging] = useState(false);
  const [pendulumAngle, setPendulumAngle] = useState(0);
  const [askingMental, setAskingMental] = useState(false);
  const [processingCamera, setProcessingCamera] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [motionDetected, setMotionDetected] = useState(false);

  const { detectMotion, requestPermission, motion, calibrateDevice } = useDeviceMotion();
  const { startPendulumSound, stopPendulumSound } = usePendulumAudio();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
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

  // Monitor device motion continuously
  useEffect(() => {
    if (!askingMental) return;
    
    console.log("Activando monitoreo continuo de movimiento...");
    
    const intervalId = setInterval(() => {
      // If there's any motion at all, consider it detected
      if (motion.rotation.beta !== null || motion.rotation.gamma !== null || 
          motion.acceleration.x !== null || motion.acceleration.y !== null || 
          motion.acceleration.z !== null) {
        
        // Check if there's any non-zero value in any motion parameter
        const hasRotation = 
          (motion.rotation.beta !== 0 && motion.rotation.beta !== null) || 
          (motion.rotation.gamma !== 0 && motion.rotation.gamma !== null) || 
          (motion.rotation.alpha !== 0 && motion.rotation.alpha !== null);
        
        const hasAcceleration = 
          (motion.acceleration.x !== 0 && motion.acceleration.x !== null) || 
          (motion.acceleration.y !== 0 && motion.acceleration.y !== null) || 
          (motion.acceleration.z !== 0 && motion.acceleration.z !== null);
        
        if (hasRotation || hasAcceleration) {
          console.log("¡Movimiento detectado durante monitoreo continuo!");
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
    setIsPendulumSwinging(true);
    setMotionDetected(false);
    
    console.log("Iniciando pregunta mental, activando sensores...");
    
    // Begin pendulum swing animation
    let angle = 0;
    const swingInterval = setInterval(() => {
      angle = Math.sin(Date.now() / 500) * 30;
      setPendulumAngle(angle);
    }, 16);
    
    try {
      // Request permission for device motion - even if already granted, to ensure it's active
      const hasPermission = await requestPermission();
      
      if (!hasPermission) {
        toast({
          title: "Permiso denegado",
          description: "Necesitamos acceso al sensor de movimiento para esta funcionalidad.",
          variant: "destructive"
        });
        clearInterval(swingInterval);
        setProcessingCamera(false);
        setIsPendulumSwinging(false);
        setAskingMental(false);
        return;
      }
      
      // Play sound if enabled
      if (pendulumSound) {
        startPendulumSound();
      }

      // Calibramos el dispositivo para tener un punto de referencia
      console.log("Calibrando dispositivo para pregunta mental...");
      calibrateDevice();

      // Show toast with instructions
      toast({
        title: "Formulando pregunta",
        description: "Piensa en tu pregunta mientras sostienes el dispositivo...",
      });

      // Utilizamos un umbral extremadamente bajo (0.001) para detectar cualquier movimiento
      console.log("Iniciando detección de movimiento con umbral mínimo...");
      
      // Esperamos 5 segundos mientras se monitorea el movimiento
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Stop swing animation
      clearInterval(swingInterval);
      setPendulumAngle(0);
      setIsPendulumSwinging(false);
      
      console.log(`Estado final de detección: motionDetected=${motionDetected}`);
      
      // Siempre intentar dar "SI" como resultado
      if (motionDetected) {
        console.log("Se detectó movimiento - respuesta SI");
        setCameraResult("SI");
      } else {
        // Verificar una última vez si hay algún movimiento en el estado actual
        const currentHasMotion = 
          (motion.rotation.beta !== 0 && motion.rotation.beta !== null) || 
          (motion.rotation.gamma !== 0 && motion.rotation.gamma !== null) ||
          (motion.rotation.alpha !== 0 && motion.rotation.alpha !== null) ||
          (motion.acceleration.x !== 0 && motion.acceleration.x !== null) ||
          (motion.acceleration.y !== 0 && motion.acceleration.y !== null) ||
          (motion.acceleration.z !== 0 && motion.acceleration.z !== null);
        
        if (currentHasMotion) {
          console.log("Se detectó movimiento en la comprobación final - respuesta SI");
          setCameraResult("SI");
        } else {
          console.log("NO se detectó movimiento - respuesta NO");
          setCameraResult("NO");
        }
      }

      // Stop sound
      stopPendulumSound();
    } catch (error) {
      console.error("Error durante la pregunta mental:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error durante el análisis de movimiento.",
        variant: "destructive"
      });
      clearInterval(swingInterval);
      
      // Default to SI on error (fallback)
      setCameraResult("SI");
    } finally {
      setProcessingCamera(false);
      setAskingMental(false);
    }
  };

  return (
    <>
      {!isMobileDevice && useCameraMode && (
        <div className="bg-yellow-600/20 border border-yellow-600 p-4 rounded-lg mb-6">
          <p className="text-center font-medium text-yellow-600">
            Solo disponible en el Móvil
          </p>
        </div>
      )}

      <PendulumVisual 
        isPendulumSwinging={isPendulumSwinging} 
        pendulumAngle={pendulumAngle} 
      />
      
      {/* Video de la cámara (oculto) */}
      {useCameraMode && (
        <video 
          ref={videoRef}
          autoPlay 
          playsInline
          className="hidden"
        />
      )}
      
      <MentalQuestionResult 
        cameraResult={cameraResult}
        askingMental={askingMental}
        onAskAgain={startMentalQuestion}
        onStartQuestion={startMentalQuestion}
      />
    </>
  );
};

export default MentalQuestionPendulum;
