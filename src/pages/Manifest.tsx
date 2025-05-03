
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PresetManifest from '@/components/manifest/PresetManifest';
import CustomManifest from '@/components/manifest/CustomManifest';
import { manifestPatterns } from '@/data/manifestPatterns';
import { useManifestCore } from '@/hooks/manifest/useManifestCore';
import { useManifestState } from '@/hooks/manifest/useManifestState';
import { toast } from '@/components/ui/use-toast';

const Manifest = () => {
  // Inicializamos con 'presets' para que coincida con la UI por defecto
  const [activeTab, setActiveTab] = useState("presets");
  const manifest = useManifestCore(manifestPatterns);
  
  // Use visualSpeed from core if available, or create new state
  const visualSpeed = manifest.visualSpeed || manifest.exposureTime; 
  const setVisualSpeed = manifest.setVisualSpeed || manifest.setExposureTime;
  
  // Asegurar que el estado activeTab en el hook se mantenga sincronizado al iniciar
  useEffect(() => {
    console.log("Manifest: Sincronizando estado inicial:", {
      activeTabLocal: activeTab,
      activeTabState: manifest.activeTab
    });
    
    // CRUCIAL: Sincronizar el estado activeTab del hook con el estado local
    manifest.setActiveTab(activeTab);
  }, []);
  
  // Mantener la sincronización cuando cambia el tab en cualquier dirección
  useEffect(() => {
    if (activeTab !== manifest.activeTab) {
      console.log("Manifest: Sincronizando activeTab local con hook:", {
        activeTabLocal: activeTab,
        activeTabState: manifest.activeTab
      });
      manifest.setActiveTab(activeTab);
    }
  }, [activeTab]);
  
  // También sincronizar cuando cambia en el hook
  useEffect(() => {
    if (activeTab !== manifest.activeTab) {
      console.log("Manifest: Sincronizando activeTab hook con local:", {
        activeTabLocal: activeTab,
        activeTabState: manifest.activeTab
      });
      setActiveTab(manifest.activeTab);
    }
  }, [manifest.activeTab]);

  console.log("Manifest RENDER - ESTADO COMPLETO:", {
    activeTab,
    intention: manifest.intention,
    intentionLength: manifest.intention ? manifest.intention.length : 0,
    isManifestActive: manifest.isManifestActive,
    patternImage: manifest.patternImage,
    patternImagesCount: manifest.patternImages.length,
    patternImages: manifest.patternImages,
    selectedPattern: manifest.selectedPattern,
    manifestActiveTab: manifest.activeTab
  });
  
  const handleTabChange = (value: string) => {
    console.log("Manifest: Cambiando tab a", value);
    
    // Reset manifest state when switching tabs
    if (manifest.isManifestActive) {
      manifest.stopManifestation();
    }
    
    // Usar el método de navegación del core para cambiar tab
    manifest.handleTabChange(value);
    
    // Actualizar también el estado local
    setActiveTab(value);
  };
  
  return (
    <Layout>
      <HeroSection 
        title="Quantum Manifestation" 
        subtitle="Crea y dirige tu propia realidad a través de patrones cuánticos y radionics"
      />
      
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <Tabs 
            value={activeTab} 
            onValueChange={handleTabChange} 
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="presets">Patrones Predefinidos</TabsTrigger>
              <TabsTrigger value="custom">Manifestación Personal</TabsTrigger>
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
                exposureTime={manifest.exposureTime}
                setExposureTime={manifest.setExposureTime}
                visualSpeed={visualSpeed}
                setVisualSpeed={setVisualSpeed}
                patternImage={manifest.patternImage}
                setPatternImage={manifest.setPatternImage}
                receptorImage={manifest.receptorImage}
                setReceptorImage={manifest.setReceptorImage}
                patternImages={manifest.patternImages}
                setPatternImages={manifest.setPatternImages}
                receptorImages={manifest.receptorImages}
                setReceptorImages={manifest.setReceptorImages}
                isManifestActive={manifest.isManifestActive}
                timeRemaining={manifest.timeRemaining}
                currentImage={manifest.currentImage}
                selectPattern={(pattern) => manifest.selectPattern(pattern.id)}
                startManifestation={manifest.startManifestation}
                stopManifestation={manifest.stopManifestation}
                formatTimeRemaining={manifest.formatTimeRemaining}
                audioFile={manifest.audioFile}
                setAudioFile={manifest.setAudioFile}
                audioVolume={manifest.audioVolume}
                setAudioVolume={manifest.setAudioVolume}
                audioSubliminalPlaying={manifest.audioSubliminalPlaying}
                playSubliminalAudio={manifest.playSubliminalAudio}
                stopSubliminalAudio={manifest.stopSubliminalAudio}
                backgroundModeActive={manifest.backgroundModeActive}
                rate1={manifest.rate1}
                rate2={manifest.rate2}
                rate3={manifest.rate3}
                setRate1={manifest.setRate1}
                setRate2={manifest.setRate2}
                setRate3={manifest.setRate3}
                indefiniteTime={manifest.indefiniteTime}
                setIndefiniteTime={manifest.setIndefiniteTime}
              />
            </TabsContent>
            
            <TabsContent value="custom" className="w-full">
              <CustomManifest
                intention={manifest.intention}
                setIntention={manifest.setIntention}
                manifestSound={manifest.manifestSound}
                setManifestSound={manifest.setManifestSound}
                manifestFrequency={manifest.manifestFrequency}
                setManifestFrequency={manifest.setManifestFrequency}
                exposureTime={manifest.exposureTime}
                setExposureTime={manifest.setExposureTime}
                visualSpeed={visualSpeed}
                setVisualSpeed={setVisualSpeed}
                patternImage={manifest.patternImage}
                setPatternImage={manifest.setPatternImage}
                receptorImage={manifest.receptorImage}
                setReceptorImage={manifest.setReceptorImage}
                patternImages={manifest.patternImages}
                setPatternImages={manifest.setPatternImages}
                receptorImages={manifest.receptorImages}
                setReceptorImages={manifest.setReceptorImages}
                isManifestActive={manifest.isManifestActive}
                timeRemaining={manifest.timeRemaining}
                currentImage={manifest.currentImage}
                startManifestation={manifest.startManifestation}
                stopManifestation={manifest.stopManifestation}
                formatTimeRemaining={manifest.formatTimeRemaining}
                audioFile={manifest.audioFile}
                setAudioFile={manifest.setAudioFile}
                audioVolume={manifest.audioVolume}
                setAudioVolume={manifest.setAudioVolume}
                audioSubliminalPlaying={manifest.audioSubliminalPlaying}
                playSubliminalAudio={manifest.playSubliminalAudio}
                stopSubliminalAudio={manifest.stopSubliminalAudio}
                audioLoop={true}
                setAudioLoop={() => {}}
                clearAudio={() => {}}
                backgroundModeActive={manifest.backgroundModeActive}
                patterns={manifestPatterns}
                rate1={manifest.rate1}
                rate2={manifest.rate2}
                rate3={manifest.rate3}
                setRate1={manifest.setRate1}
                setRate2={manifest.setRate2}
                setRate3={manifest.setRate3}
                receptorName={manifest.receptorName}
                setReceptorName={manifest.setReceptorName}
                indefiniteTime={manifest.indefiniteTime}
                setIndefiniteTime={manifest.setIndefiniteTime}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Manifest;
