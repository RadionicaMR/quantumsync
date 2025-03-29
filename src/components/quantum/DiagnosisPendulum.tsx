
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import StandardDiagnosis from './StandardDiagnosis';
import { useDiagnosisCache } from '@/hooks/useDiagnosisCache';

interface DiagnosisPendulumProps {
  selectedArea: string | null;
  mentalQuestionMode: boolean;
  useCameraMode: boolean;
  pendulumSound: boolean;
  cameraResult: 'SI' | 'NO' | null;
  setCameraResult: (result: 'SI' | 'NO' | null) => void;
  personName: string;
  setPersonName: (name: string) => void;
}

const DiagnosisPendulum: React.FC<DiagnosisPendulumProps> = ({
  selectedArea,
  mentalQuestionMode,
  useCameraMode,
  pendulumSound,
  cameraResult,
  setCameraResult,
  personName,
  setPersonName
}) => {
  const { getRecentResult, addResultToCache } = useDiagnosisCache();

  return (
    <Card className="quantum-card p-6 h-full">
      <h3 className="text-xl font-semibold mb-4">
        {mentalQuestionMode ? "Respuesta a tu Pregunta Mental" : "Diagnóstico Energético"}
      </h3>
      
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        {mentalQuestionMode ? (
          // Mental question mode content handled by MentalQuestionComponent
          null
        ) : (
          // Regular diagnosis mode
          <StandardDiagnosis
            selectedArea={selectedArea}
            useCameraMode={useCameraMode}
            pendulumSound={pendulumSound}
            cameraResult={cameraResult}
            setCameraResult={setCameraResult}
            personName={personName}
            setPersonName={setPersonName}
            getRecentResult={getRecentResult}
            addResultToCache={addResultToCache}
          />
        )}
      </div>
    </Card>
  );
};

export default DiagnosisPendulum;
