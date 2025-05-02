
import { useManifestCore } from "@/hooks/manifest/useManifestCore";
import { manifestPatterns } from "@/data/manifestPatterns";
import Layout from "@/components/Layout";
import ManifestControls from "@/components/manifest/ManifestControls";
import ManifestVisualizer from "@/components/manifest/ManifestVisualizer";
import AudioSubliminalControls from "@/components/AudioSubliminalControls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomManifest from "@/components/manifest/CustomManifest";
import PresetManifest from "@/components/manifest/PresetManifest";
import ImageUploader from "@/components/manifest/ImageUploader";

const Manifest = () => {
  const manifest = useManifestCore(manifestPatterns);

  // Computed property for canStart
  const canStart = manifest.intention.trim() !== "" && 
                 (manifest.selectedPattern !== "" || 
                  manifest.patternImage !== null || 
                  manifest.patternImages.length > 0);

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-4">Manifestación Cuántica</h1>
        <p className="text-muted-foreground mb-10">
          Utiliza frecuencias, imágenes y tu intención para potenciar tu manifestación.
        </p>

        <Tabs defaultValue="presets" value={manifest.activeTab} onValueChange={manifest.handleTabChange}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="presets">Patrones Predefinidos</TabsTrigger>
            <TabsTrigger value="custom">Diseño Personalizado</TabsTrigger>
          </TabsList>
          
          <TabsContent value="presets">
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
              receptorImages={manifest.receptorImages}
              setReceptorImages={manifest.setReceptorImages}
              receptorName={manifest.receptorName}
              setReceptorName={manifest.setReceptorName}
              backgroundModeActive={manifest.backgroundModeActive}
            />
          </TabsContent>
          
          <TabsContent value="custom">
            <CustomManifest
              patterns={manifestPatterns}
              intention={manifest.intention}
              setIntention={manifest.setIntention}
              patternImage={manifest.patternImage}
              setPatternImage={manifest.setPatternImage}
              patternImages={manifest.patternImages}
              setPatternImages={manifest.setPatternImages}
              receptorImage={manifest.receptorImage}
              setReceptorImage={manifest.setReceptorImage}
              receptorImages={manifest.receptorImages}
              setReceptorImages={manifest.setReceptorImages}
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
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Manifest;
