
import QuantumButton from '@/components/QuantumButton';

interface AreaSelectionProps {
  areas: string[];
  selectedArea: string | null;
  onSelectArea: (area: string) => void;
  isPendulumSwinging: boolean;
  processingCamera: boolean;
  mentalQuestionMode: boolean;
  setMentalQuestionMode: (mode: boolean) => void;
  askingMental: boolean;
  startMentalQuestion: () => void;
  useCameraMode: boolean;
}

const AreaSelection: React.FC<AreaSelectionProps> = ({
  areas,
  selectedArea,
  onSelectArea,
  isPendulumSwinging,
  processingCamera,
  mentalQuestionMode,
  setMentalQuestionMode,
  askingMental,
  startMentalQuestion,
  useCameraMode
}) => {
  return (
    <div className="mb-6">
      <QuantumButton
        onClick={() => setMentalQuestionMode(!mentalQuestionMode)}
        className="w-full mb-4"
      >
        {mentalQuestionMode 
          ? "Modo Diagnóstico por Área" 
          : "Modo Pregunta Mental (SI/NO)"}
      </QuantumButton>
      
      {mentalQuestionMode && (
        <div className="bg-quantum-gradient-soft p-4 rounded-lg mb-4">
          <h4 className="font-medium mb-2">Pregunta Mental</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Piensa en una pregunta que se pueda responder con SÍ o NO. Mantén el dispositivo estable y presiona el botón.
          </p>
          <QuantumButton
            onClick={startMentalQuestion}
            disabled={askingMental || processingCamera}
            className="w-full"
          >
            {askingMental ? "Analizando..." : "Iniciar Pregunta Mental"}
          </QuantumButton>
          
          {useCameraMode && (
            <div className="mt-4 p-2 bg-blue-100 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800 text-center font-medium">
                Solo disponible en el Móvil
              </p>
            </div>
          )}
        </div>
      )}

      {!mentalQuestionMode && (
        <div className="space-y-2">
          {areas.map((area) => (
            <button
              key={area}
              className={`w-full p-3 rounded-lg text-left transition-all ${
                selectedArea === area 
                  ? 'bg-quantum-primary text-white' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
              onClick={() => onSelectArea(area)}
              disabled={isPendulumSwinging || processingCamera}
            >
              {area}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AreaSelection;
