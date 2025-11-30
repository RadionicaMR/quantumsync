
import { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import { manifestPatterns } from '@/data/manifestPatterns';
import { useManifestCore } from '@/hooks/manifest/useManifestCore';
import ManifestTabs from '@/components/manifest/ManifestTabs';
import ManifestTabsContent from '@/components/manifest/ManifestTabsContent'; 
import ManifestTabSync from '@/components/manifest/ManifestTabSync';

const Manifest = () => {
  // Local state for active tab
  const [activeTab, setActiveTab] = useState("presets");
  
  // Get manifest core functionality
  const manifest = useManifestCore(manifestPatterns);
  
  // Use visualSpeed from core if available, or create new state
  const visualSpeed = manifest.visualSpeed || manifest.exposureTime; 
  const setVisualSpeed = manifest.setVisualSpeed || manifest.setExposureTime;
  
  // Handle tab changes
  const handleTabChange = (value: string) => {
    console.log("Manifest: Changing tab to", value);
    
    // Reset manifest state when switching tabs
    if (manifest.isManifestActive) {
      manifest.stopManifestation();
    }
    
    // Use the navigation method from core to change tab
    manifest.handleTabChange(value);
    
    // Update local state
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
          <ManifestTabSync
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            manifestActiveTab={manifest.activeTab}
            setManifestActiveTab={manifest.setActiveTab}
          >
            <Tabs 
              value={activeTab} 
              onValueChange={handleTabChange} 
              className="w-full"
            >
              <ManifestTabs 
                activeTab={activeTab} 
                onTabChange={handleTabChange} 
              />
              
              <ManifestTabsContent
                activeTab={activeTab}
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
                 audioLoop={manifest.audioLoop}
                 setAudioLoop={manifest.setAudioLoop}
                 clearAudio={manifest.clearAudio}
                 backgroundModeActive={manifest.backgroundModeActive}
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
            </Tabs>
          </ManifestTabSync>
        </div>
      </section>
    </Layout>
  );
};

export default Manifest;
