import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AreaSelection from '@/components/quantum/AreaSelection';
import DiagnoseControls from '@/components/quantum/DiagnoseControls';
import DiagnosisPendulum from '@/components/quantum/DiagnosisPendulum';
import MentalQuestionPendulum from '@/components/quantum/MentalQuestionPendulum';
import DowsingScanner from '@/components/quantum/DowsingScanner';

interface DiagnosisTabsProps {
  isMobile: boolean;
}

const DiagnosisTabs: React.FC<DiagnosisTabsProps> = ({ isMobile }) => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [sensitivity, setSensitivity] = useState([50]);
  const [useCameraMode, setUseCameraMode] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraResult, setCameraResult] = useState<'SI' | 'NO' | null>(null);
  const [pendulumSound, setPendulumSound] = useState(true);
  const [mentalQuestionMode, setMentalQuestionMode] = useState(false);
  const [personName, setPersonName] = useState('');
  
  const handleSelectArea = (area: string) => {
    setSelectedArea(area);
    const pendulumComponent = document.getElementById('pendulum-component');
    if (pendulumComponent) {
      pendulumComponent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Function to start/stop camera
  const toggleCamera = async () => {
    if (isCameraActive) {
      setIsCameraActive(false);
      return;
    }

    try {
      setIsCameraActive(true);
      toast({
        title: "Cámara activada",
        description: "La cámara se ha activado correctamente.",
      });
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Error de cámara",
        description: "No pudimos acceder a la cámara de tu dispositivo.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto">
      <Tabs defaultValue="pendulum" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-4 md:mb-6 bg-quantum-dark/30 border border-quantum-primary/20">
          <TabsTrigger 
            value="pendulum" 
            className="flex flex-col data-[state=active]:bg-quantum-primary/20 data-[state=active]:text-white"
          >
            <span>Péndulo</span>
            <span>Virtual</span>
          </TabsTrigger>
          <TabsTrigger 
            value="dowsing"
            className="flex flex-col data-[state=active]:bg-quantum-primary/20 data-[state=active]:text-white"
          >
            <span>Escáner</span>
            <span>Energético</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pendulum" className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
            <Card className="quantum-card shadow-lg shadow-quantum-primary/5 p-4 md:p-6 lg:col-span-1">
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 holographic-gradient">Selecciona Área a Diagnosticar</h3>
              
              <AreaSelection 
                areas={[
                  "Energía Física", 
                  "Claridad Mental", 
                  "Equilibrio Emocional", 
                  "Niveles de Estrés", 
                  "Calidad del Sueño", 
                  "Conexión Espiritual",
                  "Chakras"
                ]}
                selectedArea={selectedArea}
                onSelectArea={handleSelectArea}
                isPendulumSwinging={false}
                processingCamera={false}
                mentalQuestionMode={mentalQuestionMode}
                setMentalQuestionMode={setMentalQuestionMode}
                askingMental={false}
                startMentalQuestion={() => {}}
                useCameraMode={useCameraMode}
              />
              
              <DiagnoseControls
                useCameraMode={useCameraMode}
                setUseCameraMode={setUseCameraMode}
                pendulumSound={pendulumSound}
                setPendulumSound={setPendulumSound}
                sensitivity={sensitivity}
                setSensitivity={setSensitivity}
                isPendulumSwinging={false}
                processingCamera={false}
                toggleCamera={toggleCamera}
                isCameraActive={isCameraActive}
              />
            </Card>
            
            <div className="lg:col-span-2" id="pendulum-component">
              {mentalQuestionMode ? (
                <Card className="quantum-card shadow-lg shadow-quantum-primary/5 p-4 md:p-6 h-full">
                  <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 holographic-gradient">Respuesta a tu Pregunta Mental</h3>
                  <div className="flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px]">
                    <MentalQuestionPendulum
                      useCameraMode={useCameraMode}
                      pendulumSound={pendulumSound}
                      cameraResult={cameraResult}
                      setCameraResult={setCameraResult}
                    />
                  </div>
                </Card>
              ) : (
                <DiagnosisPendulum
                  selectedArea={selectedArea}
                  mentalQuestionMode={mentalQuestionMode}
                  useCameraMode={useCameraMode}
                  pendulumSound={pendulumSound}
                  cameraResult={cameraResult}
                  setCameraResult={setCameraResult}
                  personName={personName}
                  setPersonName={setPersonName}
                />
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="dowsing" className="w-full">
          <DowsingScanner />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Add the missing toast import to avoid compilation errors
import { toast } from "@/components/ui/use-toast";

export default DiagnosisTabs;
