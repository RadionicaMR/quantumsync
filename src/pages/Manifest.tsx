
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import PresetManifest from '@/components/manifest/PresetManifest';
import CustomManifest from '@/components/manifest/CustomManifest';
import { manifestPatterns } from '@/data/manifestPatterns';
import { useManifest } from '@/hooks/useManifest';

const Manifest = () => {
  const manifest = useManifest(manifestPatterns);
  
  return (
    <Layout>
      <HeroSection
        title="Manifestación Cuántica"
        subtitle="Programa tus intenciones en el campo cuántico y atrae lo que deseas a tu realidad."
      />

      <section className="py-12 px-4">
        <div className="container mx-auto">
          <Tabs 
            defaultValue="presets" 
            className="w-full" 
            onValueChange={manifest.handleTabChange}
            value={manifest.activeTab}
          >
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="presets" className="flex flex-col">
                <span>Patrones</span>
                <span>Preestablecidos</span>
              </TabsTrigger>
              <TabsTrigger value="custom" className="flex flex-col">
                <span>Patrón</span>
                <span>Personalizado</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="presets" className="w-full">
              <PresetManifest 
                patterns={manifestPatterns}
                selectedPattern={manifest.selectedPattern}
                intention={manifest.intention}
                setIntention={manifest.setIntention}
                manifestSound={manifest.manifestSound}
                setManifestSound={manifest.setManifestSound}
                manifestFrequency={manifest.manifestFrequency}
                setManifestFrequency={manifest.setManifestFrequency}
                visualSpeed={manifest.visualSpeed}
                setVisualSpeed={manifest.setVisualSpeed}
                exposureTime={manifest.exposureTime}
                setExposureTime={manifest.setExposureTime}
                rate1={manifest.rate1}
                setRate1={manifest.setRate1}
                rate2={manifest.rate2}
                setRate2={manifest.setRate2}
                rate3={manifest.rate3}
                setRate3={manifest.setRate3}
                isManifestActive={manifest.isManifestActive}
                timeRemaining={manifest.timeRemaining}
                startManifestation={manifest.startManifestation}
                stopManifestation={manifest.stopManifestation}
                formatTimeRemaining={manifest.formatTimeRemaining}
                onSelectPattern={manifest.selectPattern}
                currentImage={manifest.currentImage}
                receptorImage={manifest.receptorImage}
                setReceptorImage={manifest.setReceptorImage}
                receptorName={manifest.receptorName}
                setReceptorName={manifest.setReceptorName}
              />
            </TabsContent>
            
            <TabsContent value="custom" className="w-full">
              <CustomManifest 
                patterns={manifestPatterns}
                intention={manifest.intention}
                setIntention={manifest.setIntention}
                patternImage={manifest.patternImage}
                setPatternImage={manifest.setPatternImage}
                receptorImage={manifest.receptorImage}
                setReceptorImage={manifest.setReceptorImage}
                manifestSound={manifest.manifestSound}
                setManifestSound={manifest.setManifestSound}
                manifestFrequency={manifest.manifestFrequency}
                setManifestFrequency={manifest.setManifestFrequency}
                visualSpeed={manifest.visualSpeed}
                setVisualSpeed={manifest.setVisualSpeed}
                exposureTime={manifest.exposureTime}
                setExposureTime={manifest.setExposureTime}
                rate1={manifest.rate1}
                setRate1={manifest.setRate1}
                rate2={manifest.rate2}
                setRate2={manifest.setRate2}
                rate3={manifest.rate3}
                setRate3={manifest.setRate3}
                isManifestActive={manifest.isManifestActive}
                timeRemaining={manifest.timeRemaining}
                startManifestation={manifest.startManifestation}
                stopManifestation={manifest.stopManifestation}
                formatTimeRemaining={manifest.formatTimeRemaining}
                currentImage={manifest.currentImage}
                receptorName={manifest.receptorName}
                setReceptorName={manifest.setReceptorName}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Manifest;
