
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from "@/components/ui/use-toast";
import { Card } from '@/components/ui/card';
import PendulumVisual from './PendulumVisual';
import DiagnosisResult from './DiagnosisResult';
import QuantumButton from '@/components/QuantumButton';
import { useDeviceMotion } from '@/hooks/useDeviceMotion';
import { usePendulumAudio } from '@/hooks/usePendulumAudio';

interface DiagnosisPendulumProps {
  selectedArea: string | null;
  mentalQuestionMode: boolean;
  useCameraMode: boolean;
  pendulumSound: boolean;
  cameraResult: 'SI' | 'NO' | null;
  setCameraResult: (result: 'SI' | 'NO' | null) => void;
}

const DiagnosisPendulum: React.FC<DiagnosisPendulumProps> = ({
  selectedArea,
  mentalQuestionMode,
  useCameraMode,
  pendulumSound,
  cameraResult,
  setCameraResult
}) => {
  const [isPendulumSwinging, setIsPendulumSwinging] = useState(false);
  const [pendulumAngle, setPendulumAngle] = useState(0);
  const [diagnosisResult, setDiagnosisResult] = useState<string | null>(null);
  const [diagnosisPercentage, setDiagnosisPercentage] = useState(0);
  const [processingCamera, setProcessingCamera] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  const { detectMotion, requestPermission, calibrateDevice } = useDeviceMotion();
  const { startPendulumSound, stopPendulumSound } = usePendulumAudio();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
  
  const startPendulum = (area: string) => {
    setIsPendulumSwinging(true);
    setDiagnosisResult(null);
    setCameraResult(null);
    
    // Play sound if enabled
    if (pendulumSound) {
      startPendulumSound();
    }
    
    // Simulate pendulum swing
    let angle = 0;
    const swingInterval = setInterval(() => {
      angle = Math.sin(Date.now() / 500) * 30;
      setPendulumAngle(angle);
    }, 16);
    
    // Stop after random time between 3-6 seconds
    const duration = Math.random() * 3000 + 3000;
    setTimeout(() => {
      clearInterval(swingInterval);
      setIsPendulumSwinging(false);
      setPendulumAngle(0);
      
      // Generate diagnosis result
      const percentage = Math.floor(Math.random() * 101);
      setDiagnosisPercentage(percentage);
      
      if (percentage < 30) {
        setDiagnosisResult("Bajo");
      } else if (percentage < 70) {
        setDiagnosisResult("Medio");
      } else {
        setDiagnosisResult("Alto");
      }

      // Stop sound
      stopPendulumSound();
    }, duration);
  };

  const startMotionDiagnosis = async (area: string) => {
    if (!useCameraMode) {
      startPendulum(area);
      return;
    }

    console.log("Iniciando diagnóstico con sensor de movimiento");
    setCameraResult(null);
    setProcessingCamera(true);
    setIsPendulumSwinging(true);
    
    // Let's mimic pendulum swinging during motion detection
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
        return;
      }
      
      // Calibrar el dispositivo para detectar posteriormente cualquier cambio
      calibrateDevice();
      
      // Play sound if enabled
      if (pendulumSound) {
        startPendulumSound();
      }

      // Wait 1 second to prepare
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Análisis en curso",
        description: "Mantenga el dispositivo mientras se realiza el análisis...",
      });
      
      // Detect motion with extremely low threshold (0.1 degrees)
      // Esto detectará cualquier movimiento por mínimo que sea
      const hasSignificantMotion = await detectMotion(5000, 0.1);
      console.log("¿Se detectó movimiento?", hasSignificantMotion);
      
      // Stop swing animation
      clearInterval(swingInterval);
      setPendulumAngle(0);
      
      // Siempre decir "Alto" (high) para resultados si se detecta cualquier movimiento
      // Esto asegura más respuestas "SÍ"
      setDiagnosisPercentage(hasSignificantMotion ? 85 : 15);
      
      if (hasSignificantMotion) {
        console.log("Configurando resultado como ALTO/SI");
        setDiagnosisResult("Alto");
        setCameraResult("SI");
      } else {
        console.log("Configurando resultado como BAJO/NO");
        setDiagnosisResult("Bajo");
        setCameraResult("NO");
      }

      // Stop sound
      stopPendulumSound();
    } catch (error) {
      console.error("Error durante el diagnóstico con movimiento:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error durante el análisis de movimiento.",
        variant: "destructive"
      });
      clearInterval(swingInterval);
    } finally {
      setProcessingCamera(false);
      setIsPendulumSwinging(false);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup camera on component unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Cleanup audio
      stopPendulumSound();
    };
  }, []);

  return (
    <Card className="quantum-card p-6 h-full">
      <h3 className="text-xl font-semibold mb-4">
        {mentalQuestionMode ? "Respuesta a tu Pregunta Mental" : "Diagnóstico Energético"}
      </h3>
      
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        {!isMobileDevice && useCameraMode && (
          <div className="bg-yellow-600/20 border border-yellow-600 p-4 rounded-lg mb-6">
            <p className="text-center font-medium text-yellow-600">
              Solo disponible en el Móvil
            </p>
          </div>
        )}
        
        {mentalQuestionMode ? (
          // Mental question mode content handled by MentalQuestionComponent
          null
        ) : (
          // Regular diagnosis mode
          <>
            {selectedArea ? (
              <>
                <div className="text-lg mb-6">
                  Diagnosticando: <span className="font-semibold">{selectedArea}</span>
                </div>
                
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
                
                <DiagnosisResult
                  diagnosisResult={diagnosisResult}
                  diagnosisPercentage={diagnosisPercentage}
                  selectedArea={selectedArea}
                  cameraResult={cameraResult}
                  onDiagnoseAgain={() => startMotionDiagnosis(selectedArea)}
                />
                
                {(isPendulumSwinging || processingCamera) && (
                  <div className="text-muted-foreground animate-pulse mt-8">
                    {useCameraMode ? "Analizando movimiento del dispositivo..." : "Analizando patrones energéticos..."}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                <div className="text-quantum-primary text-5xl mb-4">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="mb-4">Selecciona un área para comenzar tu diagnóstico energético</p>
                <p className="text-sm">El péndulo virtual te ayudará a identificar desequilibrios en tu campo energético</p>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default DiagnosisPendulum;
