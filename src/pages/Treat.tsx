
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CustomTreatment from '@/components/treatment/CustomTreatment';
import HowItWorks from '@/components/treatment/HowItWorks';
import CallToAction from '@/components/treatment/CallToAction';
import PresetTreatment from '@/components/treatment/PresetTreatment';
import { treatmentPresets } from '@/data/treatmentPresets';
import { useTreatment } from '@/hooks/useTreatment';

const Treat = () => {
  const treatment = useTreatment();
  
  return (
    <Layout>
      <HeroSection
        title="Tratamiento Vibracional"
        subtitle="Aplica patrones de frecuencia dirigidos para restaurar el equilibrio y mejorar tu bienestar."
      />

      <section className="py-12 px-4">
        <div className="container mx-auto">
          <Tabs defaultValue="presets" className="w-full">
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
                startTreatment={treatment.startTreatment}
                stopTreatment={treatment.stopTreatment}
                radionicImage={treatment.radionicImage}
                setRadionicImage={treatment.setRadionicImage}
                receptorImage={treatment.receptorImage}
                setReceptorImage={treatment.setReceptorImage}
                radionicImages={treatment.radionicImages}
                setRadionicImages={treatment.setRadionicImages}
                receptorImages={treatment.receptorImages}
                setReceptorImages={treatment.setReceptorImages}
                currentImage={treatment.currentImage}
                hypnoticEffect={treatment.hypnoticEffect}
                rate1={treatment.rate1}
                setRate1={treatment.setRate1}
                rate2={treatment.rate2}
                setRate2={treatment.setRate2}
                rate3={treatment.rate3}
                setRate3={treatment.setRate3}
                hypnoticSpeed={treatment.hypnoticSpeed}
                setHypnoticSpeed={treatment.setHypnoticSpeed}
              />
            </TabsContent>
            
            <TabsContent value="custom" className="w-full">
              <Card className="quantum-card p-6">
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
                    currentImage={treatment.currentImage}
                    hypnoticEffect={treatment.hypnoticEffect}
                    startTreatment={treatment.startTreatment}
                    stopTreatment={treatment.stopTreatment}
                  />
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <HowItWorks />
      <CallToAction />
    </Layout>
  );
};

export default Treat;
