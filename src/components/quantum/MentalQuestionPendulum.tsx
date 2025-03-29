
import { useState, useRef, useEffect } from 'react';
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

  // Monitor device motion with a higher threshold
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
        
        // Check for significant deviation from the initial position (increased thresholds)
        const hasSignificantRotation = 
          (Math.abs(motion.rotation.beta || 0) > 3.0) || 
          (Math.abs(motion.rotation.gamma || 0) > 3.0) || 
          (Math.abs(motion.rotation.alpha || 0) > 3.0);
        
        const hasSignificantAcceleration = 
          (Math.abs(motion.acceleration.x || 0) > 0.25) || 
          (Math.abs(motion.acceleration.y || 0) > 0.25) || 
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

      // Calibrar el dispositivo al inicio
      console.log("Calibrando dispositivo para pregunta mental...");
      calibrateDevice();

      // Show toast with instructions
      toast({
        title: "Formulando pregunta",
        description: "Piensa en tu pregunta mientras sostienes el dispositivo...",
      });

      // Utilizamos un umbral más alto para evitar falsos positivos
      console.log("Iniciando detección de movimiento con umbral adecuado...");
      
      // Esperamos 5 segundos mientras se monitorea el movimiento
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Stop swing animation
      clearInterval(swingInterval);
      setPendulumAngle(0);
      setIsPendulumSwinging(false);
      
      console.log(`Estado final de detección: motionDetected=${motionDetected}`);
      
      // Evaluar si hubo movimiento significativo
      if (motionDetected) {
        console.log("Se detectó movimiento significativo - respuesta SI");
        setCameraResult("SI");
      } else {
        // Verificar una última vez si hay algún movimiento significativo en el estado actual
        const currentHasSignificantMotion = 
          (Math.abs(motion.rotation.beta || 0) > 3.0) || 
          (Math.abs(motion.rotation.gamma || 0) > 3.0) ||
          (Math.abs(motion.rotation.alpha || 0) > 3.0) ||
          (Math.abs(motion.acceleration.x || 0) > 0.25) ||
          (Math.abs(motion.acceleration.y || 0) > 0.25) ||
          (Math.abs(motion.acceleration.z || 0) > 0.3);
        
        if (currentHasSignificantMotion) {
          console.log("Se detectó movimiento en la comprobación final - respuesta SI");
          setCameraResult("SI");
        } else {
          console.log("NO se detectó movimiento significativo - respuesta NO");
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
      
      // Default to NO on error
      setCameraResult("NO");
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
