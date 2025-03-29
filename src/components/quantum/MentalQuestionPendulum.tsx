
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

  const startMentalQuestion = async () => {
    setAskingMental(true);
    setCameraResult(null);
    setProcessingCamera(true);
    setIsPendulumSwinging(true);
    
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
      calibrateDevice();

      // Show toast with instructions
      toast({
        title: "Formulando pregunta",
        description: "Piensa en tu pregunta mientras sostienes el dispositivo...",
      });

      // Detect motion over 5 seconds with an extremely low threshold to catch any movement at all
      const hasSignificantMotion = await detectMotion(5000, 0.1); // Reducido a 0.1 grados para captar cualquier movimiento
      
      // Stop swing animation
      clearInterval(swingInterval);
      setPendulumAngle(0);
      setIsPendulumSwinging(false);
      
      // Por defecto, establecer SI
      setCameraResult("SI");
      
      // Solo si realmente no hay movimiento, entonces NO
      if (!hasSignificantMotion) {
        console.log("No se detectó movimiento en absoluto");
        setCameraResult("NO");
      } else {
        console.log("Se detectó movimiento");
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
