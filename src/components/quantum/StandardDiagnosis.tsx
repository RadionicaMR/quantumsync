
import { useState, useEffect } from 'react';
import { useRef } from 'react';
import VibraCheckVisual from './VibraCheckVisual';
import DiagnosisResult from './DiagnosisResult';
import PersonNameInput from './PersonNameInput';
import DiagnosisStandby from './DiagnosisStandby';
import { useDiagnosis } from '@/hooks/diagnosis/useDiagnosis';
import { RecentDiagnosisResult } from '@/hooks/useDiagnosisCache';
import { useNavigate } from 'react-router-dom';
import { SessionRecordDialog } from '@/components/session/SessionRecordDialog';
import { useSessionRecording } from '@/hooks/useSessionRecording';
import { useSession } from '@/context/SessionContext';

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
  const navigate = useNavigate();
  const { recordSession } = useSessionRecording();
  const { currentPatientId, setCurrentPatientId } = useSession();
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [pendingDiagnosis, setPendingDiagnosis] = useState<string | null>(null);
  
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

  // Save session when diagnosis completes
  useEffect(() => {
    if (diagnosisResult && currentPatientId && selectedArea) {
      const sessionData = {
        area: selectedArea,
        result: diagnosisResult,
        percentage: diagnosisPercentage,
      };
      recordSession(currentPatientId, 'diagnosis', sessionData);
      setCurrentPatientId(null);
    }
  }, [diagnosisResult, currentPatientId, selectedArea]);

  const handleStartDiagnosis = () => {
    if (selectedArea) {
      setShowSessionDialog(true);
      setPendingDiagnosis(selectedArea);
    }
  };

  const handleSessionConfirm = (patientId: string | null) => {
    setCurrentPatientId(patientId);
    if (pendingDiagnosis) {
      startMotionDiagnosis(pendingDiagnosis);
      setPendingDiagnosis(null);
    }
  };

  const navigateToTreatment = () => {
    navigate('/treat', {
      state: { 
        fromDiagnosis: true, 
        diagnosisArea: selectedArea,
        diagnosisResult,
        personName
      } 
    });
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
      
      <VibraCheckVisual 
        isActive={isPendulumSwinging}
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
        cameraResult={!useCameraMode ? null : cameraResult}
        onDiagnoseAgain={handleStartDiagnosis}
        personName={personName}
        onStartTreatment={navigateToTreatment}
      />
      
      <DiagnosisStandby 
        selectedArea={selectedArea}
        isPendulumSwinging={isPendulumSwinging}
        processingCamera={processingCamera}
        diagnosisResult={diagnosisResult}
        onStartDiagnosis={handleStartDiagnosis}
        useCameraMode={useCameraMode}
        personName={personName}
      />

      <SessionRecordDialog
        open={showSessionDialog}
        onOpenChange={setShowSessionDialog}
        onConfirm={handleSessionConfirm}
        sessionType="diagnosis"
      />
    </>
  );
};

export default StandardDiagnosis;
