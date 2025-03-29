
import { useState, useRef, useEffect } from 'react';
import { Camera } from 'lucide-react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import QuantumButton from '@/components/QuantumButton';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';

// Custom components
import AreaSelection from '@/components/quantum/AreaSelection';
import DiagnoseControls from '@/components/quantum/DiagnoseControls';
import DiagnosisPendulum from '@/components/quantum/DiagnosisPendulum';
import MentalQuestionPendulum from '@/components/quantum/MentalQuestionPendulum';
import DowsingScanner from '@/components/quantum/DowsingScanner';
import InfoSection from '@/components/quantum/InfoSection';

const Diagnose = () => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [sensitivity, setSensitivity] = useState([50]);
  const [useCameraMode, setUseCameraMode] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraResult, setCameraResult] = useState<'SI' | 'NO' | null>(null);
  const [pendulumSound, setPendulumSound] = useState(true);
  const [mentalQuestionMode, setMentalQuestionMode] = useState(false);
  const [personName, setPersonName] = useState('');

  const streamRef = useRef<MediaStream | null>(null);

  const isMobile = useIsMobile();

  // Function to start/stop camera
  const toggleCamera = async () => {
    if (isCameraActive && streamRef.current) {
      // Stop camera
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraActive(false);
      return;
    }

    try {
      // Request camera permissions
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: { ideal: 'environment' } } 
      });
      
      streamRef.current = stream;
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

  const handleSelectArea = (area: string) => {
    setSelectedArea(area);
    const pendulumComponent = document.getElementById('pendulum-component');
    if (pendulumComponent) {
      pendulumComponent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup camera on component unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <Layout>
      <HeroSection
        title="Diagnóstico Energético"
        subtitle="Identifica desequilibrios energéticos y áreas que necesitan atención."
        className="hero-diagnose"
      />

      <section className="py-4 md:py-6 px-4 bg-gradient-to-b from-quantum-dark/70 to-background">
        <div className="container mx-auto">
          <Tabs defaultValue="pendulum" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-4 md:mb-6 bg-quantum-dark/30 border border-quantum-primary/20">
              <TabsTrigger 
                value="pendulum" 
                className="data-[state=active]:bg-quantum-primary/20 data-[state=active]:text-white"
              >
                Péndulo Virtual
              </TabsTrigger>
              <TabsTrigger 
                value="dowsing"
                className="data-[state=active]:bg-quantum-primary/20 data-[state=active]:text-white"
              >
                Escáner Energético
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
      </section>

      <InfoSection />

      <section className="py-8 md:py-12 px-4 bg-gradient-to-b from-background to-quantum-dark/40">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 holographic-gradient">¿Listo para Profundizar?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-8">
            Después del diagnóstico, pasa a nuestro módulo de tratamiento para abordar cualquier desequilibrio con terapia de frecuencia dirigida.
          </p>
          <QuantumButton>Explorar Tratamientos</QuantumButton>
        </div>
      </section>
    </Layout>
  );
};

export default Diagnose;
