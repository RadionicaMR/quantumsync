
import { useRef } from 'react';
import { toast } from "@/components/ui/use-toast";
import MentalPendulumAnimation from './MentalPendulumAnimation';
import MentalQuestionResult from './MentalQuestionResult';
import { useMentalQuestion } from '@/hooks/useMentalQuestion';

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
  const {
    askingMental,
    processingCamera,
    isMobileDevice,
    startMentalQuestion
  } = useMentalQuestion(pendulumSound);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  const handleStartQuestion = async () => {
    await startMentalQuestion();
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

      <MentalPendulumAnimation 
        isSwinging={askingMental} 
        pendulumSound={pendulumSound} 
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
        onAskAgain={handleStartQuestion}
        onStartQuestion={handleStartQuestion}
      />
    </>
  );
};

export default MentalQuestionPendulum;
