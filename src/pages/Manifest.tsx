
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
  const [activeTab, setActiveTab] = useState("presets");
  const manifest = useManifestCore(manifestPatterns);
  
  // Use visualSpeed from core if available, or create new state
  const visualSpeed = manifest.visualSpeed || manifest.exposureTime; 
  const setVisualSpeed = manifest.setVisualSpeed || manifest.setExposureTime;
  
  // Efecto para sincronizar activeTab entre el componente y el state
  useEffect(() => {
    console.log("Manifest: Sincronizando activeTab:", activeTab);
    
    // Asegurar que la tab activa se actualice en el state
    if (manifest.activeTab !== activeTab) {
      manifest.setActiveTab(activeTab);
    }
    
    // Detener manifestación si estaba activa al cambiar de tab
    if (manifest.isManifestActive) {
      manifest.stopManifestation();
    }
  }, [activeTab, manifest]);

  // Nuevo efecto para forzar la sincronización del estado al iniciar
  useEffect(() => {
    // Establecer el activeTab correcto en el state al iniciar
    manifest.setActiveTab(activeTab);
    
    // Log para debugging
    console.log("Manifest - Initial state synchronization:", {
      activeTab, 
      manifestActiveTab: manifest.activeTab
    });
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo se ejecuta una vez al montar el componente
  
  // Debug log con todos los valores de state antes del render
  console.log("Manifest RENDER - ESTADO COMPLETO:", {
    activeTab,
    intention: manifest.intention,
    intentionLength: manifest.intention ? manifest.intention.length : 0,
    isManifestActive: manifest.isManifestActive,
    patternImage: manifest.patternImage,
    patternImagesCount: manifest.patternImages.length,
    selectedPattern: manifest.selectedPattern,
    manifestActiveTab: manifest.activeTab
  });
  
  const handleTabChange = (value: string) => {
    console.log("Manifest: Cambiando tab a", value);
    setActiveTab(value);
    
    // Reset manifest state when switching tabs
    if (manifest.isManifestActive) {
      manifest.stopManifestation();
    }
    
    // Asegurar que el cambio de tab se refleje en el state
    manifest.setActiveTab(value);
    
    // Forzar limpieza de valores al cambiar de tab
    manifest.setSelectedPattern("");
    manifest.setPatternImage(null);
    manifest.setReceptorImage(null);
    
    // Reseteamos patternImages y receptorImages también
    manifest.setPatternImages([]);
    manifest.setReceptorImages([]);
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
