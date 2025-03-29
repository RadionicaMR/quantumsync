
import { useRef } from 'react';
import PendulumVisual from './PendulumVisual';
import DiagnosisResult from './DiagnosisResult';
import PersonNameInput from './PersonNameInput';
import DiagnosisStandby from './DiagnosisStandby';
import { useDiagnosis } from '@/hooks/useDiagnosis';
import { RecentDiagnosisResult } from '@/hooks/useDiagnosisCache';

interface StandardDiagnosisProps {
  selectedArea: string | null;
  useCameraMode: boolean;
  pendulumSound: boolean;
  cameraResult: 'SI' | 'NO' | null;
  setCameraResult: (result: 'SI' | 'NO' | null) => void;
  personName: string;
  setPersonName: (name: string) => void;
  getRecentResult: (area: string) => RecentDiagnosisResult | undefined;
  addResultToCache: (result: RecentDiagnosisResult) => void;
}

const StandardDiagnosis: React.FC<StandardDiagnosisProps> = ({
  selectedArea,
  useCameraMode,
  pendulumSound,
  cameraResult,
  setCameraResult,
  personName,
  setPersonName,
  getRecentResult,
  addResultToCache
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  const {
    isPendulumSwinging,
    pendulumAngle,
    diagnosisResult,
    diagnosisPercentage,
    processingCamera,
    startMotionDiagnosis
  } = useDiagnosis({
    useCameraMode,
    pendulumSound,
    setCameraResult,
    personName,
    getRecentResult,
    addResultToCache
  });
  
  const handleStartDiagnosis = () => {
    if (selectedArea) {
      startMotionDiagnosis(selectedArea);
    }
  };

  return (
    <>
      <PersonNameInput personName={personName} setPersonName={setPersonName} />
      
      {selectedArea && (
        <div className="text-lg mb-6">
          Diagnosticando: <span className="font-semibold">{selectedArea}</span>
          {personName && (
            <span> para <span className="font-semibold">{personName}</span></span>
          )}
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
      
      <DiagnosisResult
        diagnosisResult={diagnosisResult}
        diagnosisPercentage={diagnosisPercentage}
        selectedArea={selectedArea || ''}
        cameraResult={cameraResult}
        onDiagnoseAgain={handleStartDiagnosis}
        personName={personName}
      />
      
      <DiagnosisStandby 
        selectedArea={selectedArea}
        isPendulumSwinging={isPendulumSwinging}
        processingCamera={processingCamera}
        diagnosisResult={diagnosisResult}
        onStartDiagnosis={handleStartDiagnosis}
        useCameraMode={useCameraMode}
      />
    </>
  );
};

export default StandardDiagnosis;
