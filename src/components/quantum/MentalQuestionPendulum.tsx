
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
      }
    };
    
    checkMobile();
  }, []);

  // Activate sensors and request permissions as early as possible
  useEffect(() => {
    if (isMobileDevice) {
      // Initialize sensors when the component loads
      requestPermission().catch(console.error);
    }
  }, [isMobileDevice, requestPermission]);

  // Monitor device motion continuously when in camera mode
  useEffect(() => {
    const monitorMotion = () => {
      if (motion.rotation.beta !== null || motion.acceleration.x !== null) {
        console.log("Motion detected during monitoring!");
        setMotionDetected(true);
      }
    };

    if (askingMental && useCameraMode) {
      const interval = setInterval(monitorMotion, 100);
      return () => clearInterval(interval);
    }
  }, [askingMental, useCameraMode, motion.rotation.beta, motion.acceleration]);

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
      // Request permission for device motion
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
      console.log("Calibrando dispositivo...");
      calibrateDevice();

      // Show toast with instructions
      toast({
        title: "Formulando pregunta",
        description: "Piensa en tu pregunta mientras sostienes el dispositivo...",
      });

      // Detect motion over 5 seconds with an extremely low threshold to catch any movement at all
      console.log("Iniciando detección de movimiento con umbral mínimo...");
      const hasSignificantMotion = await detectMotion(5000, 0.01); // Reducido a 0.01 grados para captar cualquier movimiento
      
      // Also check if motion was detected during monitoring
      const movementDetected = hasSignificantMotion || motionDetected;
      console.log(`Resultado de detección: hasSignificantMotion=${hasSignificantMotion}, motionDetected=${motionDetected}`);
      
      // Stop swing animation
      clearInterval(swingInterval);
      setPendulumAngle(0);
      setIsPendulumSwinging(false);
      
      // Por defecto, establecer SI
      if (movementDetected) {
        console.log("Se detectó movimiento - respuesta SI");
        setCameraResult("SI");
      } else {
        console.log("NO se detectó movimiento - respuesta NO");
        setCameraResult("NO");
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
