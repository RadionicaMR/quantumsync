
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CustomTreatment from '@/components/treatment/CustomTreatment';
import HowItWorks from '@/components/treatment/HowItWorks';
import CallToAction from '@/components/treatment/CallToAction';
import PresetTreatment from '@/components/treatment/preset/PresetTreatment';
import { treatmentPresets } from '@/data/treatmentPresets';
import { useTreatment } from '@/hooks/useTreatment';
import { toast } from '@/hooks/use-toast';
import AudioUploader from '@/components/AudioUploader';
import { SessionRecordDialog } from '@/components/session/SessionRecordDialog';
import { useSessionRecording } from '@/hooks/useSessionRecording';
import { useSession } from '@/context/SessionContext';

const Treat = () => {
  const treatment = useTreatment();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("presets");
  const [diagnosisImported, setDiagnosisImported] = useState(false);
  const { recordSession } = useSessionRecording();
  const { currentPatientId, setCurrentPatientId } = useSession();
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [pendingStart, setPendingStart] = useState(false);
  
  // Check if we're coming from diagnosis page or repeating a session
  useEffect(() => {
    // Handle diagnosis import
    if (location.state?.fromDiagnosis && !diagnosisImported) {
      const { personName, diagnosisArea, diagnosisResult } = location.state;
      
      // Set the receptor name from the diagnosis
      if (personName) {
        treatment.setReceptorName(personName);
        
        // Show toast notification only once when first loading the page
        toast({
          title: "Diagnóstico importado",
          description: `Importando datos del diagnóstico de ${diagnosisArea} para ${personName}`,
        });
        
        // Mark as imported to prevent showing the toast again
        setDiagnosisImported(true);
      }
    }

    // Handle session repeat
    if (location.state?.repeatSession && location.state?.sessionData) {
      const { sessionData } = location.state;
      
      // Load session data into treatment
      if (sessionData.receptorName) {
        treatment.setReceptorName(sessionData.receptorName);
      }
      if (sessionData.frequency) {
        treatment.setFrequency(sessionData.frequency);
      }
      if (sessionData.duration) {
        treatment.setDuration(sessionData.duration);
      }
      if (sessionData.rates && sessionData.rates.length >= 3) {
        treatment.setRate1(sessionData.rates[0] || '');
        treatment.setRate2(sessionData.rates[1] || '');
        treatment.setRate3(sessionData.rates[2] || '');
      }
      
      // Select preset if available
      if (sessionData.preset) {
        const preset = treatmentPresets.find(p => p.name === sessionData.preset);
        if (preset) {
          treatment.selectPreset(preset);
        }
      }
    }
  }, [location.state, treatment]);

  // Handle session recording when treatment stops
  useEffect(() => {
    if (!treatment.isPlaying && treatment.timeRemaining === 0 && currentPatientId) {
      let presetName = '';
      if (treatment.selectedPreset) {
        presetName = typeof treatment.selectedPreset === 'object' 
          ? (treatment.selectedPreset as any).name || ''
          : String(treatment.selectedPreset);
      }
      const sessionData = {
        preset: presetName,
        frequency: treatment.frequency,
        duration: treatment.duration,
        rates: [treatment.rate1, treatment.rate2, treatment.rate3],
        receptorName: treatment.receptorName,
      };
      recordSession(currentPatientId, 'treatment', sessionData);
      setCurrentPatientId(null);
    }
  }, [treatment.isPlaying, treatment.timeRemaining, currentPatientId]);

  const handleStartClick = () => {
    setShowSessionDialog(true);
    setPendingStart(true);
  };

  const handleSessionConfirm = (patientId: string | null) => {
    setCurrentPatientId(patientId);
    if (pendingStart) {
      treatment.startTreatment();
      setPendingStart(false);
    }
  };
  
  // Normalize currentImage value to ensure compatibility
  const normalizeCurrentImage = (image: 'radionic' | 'receptor' | 'mix' | 'pattern'): 'radionic' | 'receptor' | 'mix' => {
    return image === 'pattern' ? 'radionic' : image;
  };
  
  return (
    <Layout>
      <HeroSection
        title="Tratamiento Vibracional"
        subtitle="Aplica patrones de frecuencia dirigidos para restaurar el equilibrio y mejorar tu bienestar."
      />

      {/* Sección de Cómo Funciona movida justo debajo del título */}
      <HowItWorks />

      <section className="py-12 px-4">
        <div className="container mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="presets" className="flex flex-col">
                <span>Preajustes</span>
                <span>de Frecuencia</span>
              </TabsTrigger>
              <TabsTrigger value="custom" className="flex flex-col">
                <span>Tratamiento</span>
                <span>Personalizado</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="presets" className="w-full">
              {/* Puedes poner el Uploader también aquí si el usuario lo desea en ambas pestañas */}
              <PresetTreatment
                presets={treatmentPresets}
                selectedPreset={treatment.selectedPreset}
                isPlaying={treatment.isPlaying}
                frequency={treatment.frequency}
                setFrequency={treatment.setFrequency}
                duration={treatment.duration}
                setDuration={treatment.setDuration}
                intensity={treatment.intensity}
                setIntensity={treatment.setIntensity}
                useHeadphones={treatment.useHeadphones}
                setUseHeadphones={treatment.setUseHeadphones}
                visualFeedback={treatment.visualFeedback}
                setVisualFeedback={treatment.setVisualFeedback}
                timeRemaining={treatment.timeRemaining}
                formatTime={treatment.formatTime}
                onSelectPreset={treatment.selectPreset}
                startTreatment={handleStartClick}
                stopTreatment={treatment.stopTreatment}
                radionicImage={treatment.radionicImage}
                setRadionicImage={treatment.setRadionicImage}
                receptorImage={treatment.receptorImage}
                setReceptorImage={treatment.setReceptorImage}
                radionicImages={treatment.radionicImages}
                setRadionicImages={treatment.setRadionicImages}
                receptorImages={treatment.receptorImages}
                setReceptorImages={treatment.setReceptorImages}
                currentImage={normalizeCurrentImage(treatment.currentImage)}
                hypnoticEffect={treatment.hypnoticEffect}
                rate1={treatment.rate1}
                setRate1={treatment.setRate1}
                rate2={treatment.rate2}
                setRate2={treatment.setRate2}
                rate3={treatment.rate3}
                setRate3={treatment.setRate3}
                hypnoticSpeed={treatment.hypnoticSpeed}
                setHypnoticSpeed={treatment.setHypnoticSpeed}
                receptorName={treatment.receptorName}
                setReceptorName={treatment.setReceptorName}
                audioFile={treatment.audioFile}
                setAudioFile={treatment.setAudioFile}
                audioVolume={treatment.audioVolume}
                setAudioVolume={treatment.setAudioVolume}
                audioSubliminalPlaying={treatment.audioSubliminalPlaying}
                playSubliminalAudio={treatment.playSubliminalAudio}
                stopSubliminalAudio={treatment.stopSubliminalAudio}
                backgroundModeActive={treatment.backgroundModeActive}
              />
            </TabsContent>
            
            <TabsContent value="custom" className="w-full">
              <Card className="quantum-card p-6">
                {/* REMOVIDO EL ANTIGUO AudioUploader de aquí */}
                <div className="">
                  <h3 className="text-xl font-semibold mb-4">Diseñador de Frecuencias Personalizadas</h3>
                  <p className="text-muted-foreground mb-8">
                    Crea tus propias combinaciones de frecuencias para protocolos de tratamiento personalizados.
                  </p>
                  
                  <CustomTreatment
                    frequency={treatment.frequency}
                    setFrequency={treatment.setFrequency}
                    duration={treatment.duration}
                    setDuration={treatment.setDuration}
                    intensity={treatment.intensity}
                    setIntensity={treatment.setIntensity}
                    rate1={treatment.rate1}
                    setRate1={treatment.setRate1}
                    rate2={treatment.rate2}
                    setRate2={treatment.setRate2}
                    rate3={treatment.rate3}
                    setRate3={treatment.setRate3}
                    radionicImage={treatment.radionicImage}
                    setRadionicImage={treatment.setRadionicImage}
                    radionicImages={treatment.radionicImages}
                    setRadionicImages={treatment.setRadionicImages}
                    receptorImage={treatment.receptorImage}
                    setReceptorImage={treatment.setReceptorImage}
                    receptorImages={treatment.receptorImages}
                    setReceptorImages={treatment.setReceptorImages}
                    hypnoticSpeed={treatment.hypnoticSpeed}
                    setHypnoticSpeed={treatment.setHypnoticSpeed}
                    useHeadphones={treatment.useHeadphones}
                    setUseHeadphones={treatment.setUseHeadphones}
                    visualFeedback={treatment.visualFeedback}
                    setVisualFeedback={treatment.setVisualFeedback}
                    isPlaying={treatment.isPlaying}
                    timeRemaining={treatment.timeRemaining}
                    formatTime={treatment.formatTime}
                    currentImage={normalizeCurrentImage(treatment.currentImage)}
                    hypnoticEffect={treatment.hypnoticEffect}
                  startTreatment={handleStartClick}
                  stopTreatment={treatment.stopTreatment}
                    receptorName={treatment.receptorName}
                    setReceptorName={treatment.setReceptorName}
                    audioFile={treatment.audioFile}
                    setAudioFile={treatment.setAudioFile}
                    audioVolume={treatment.audioVolume}
                    setAudioVolume={treatment.setAudioVolume}
                    audioSubliminalPlaying={treatment.audioSubliminalPlaying}
                    playSubliminalAudio={treatment.playSubliminalAudio}
                    stopSubliminalAudio={treatment.stopSubliminalAudio}
                    audioLoop={treatment.audioLoop}
                    setAudioLoop={treatment.setAudioLoop}
                    clearAudio={treatment.clearAudio}
                    backgroundModeActive={treatment.backgroundModeActive}
                  />
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          <SessionRecordDialog
            open={showSessionDialog}
            onOpenChange={setShowSessionDialog}
            onConfirm={handleSessionConfirm}
            sessionType="treatment"
          />
        </div>
      </section>

      <CallToAction />
    </Layout>
  );
};

export default Treat;
