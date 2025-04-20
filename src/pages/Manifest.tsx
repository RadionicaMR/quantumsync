
import { useManifestCore } from "@/hooks/manifest/useManifestCore";
import { manifestPatterns } from "@/data/manifestPatterns";
import Layout from "@/components/Layout";
import ManifestControls from "@/components/manifest/ManifestControls";
import ManifestVisualizer from "@/components/manifest/ManifestVisualizer";
import AudioSubliminalControls from "@/components/AudioSubliminalControls";

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <ManifestControls
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
              canStart={canStart}
            />
            {/* Audio Subliminal Controls: recording and upload */}
            <AudioSubliminalControls
              audioFile={manifest.audioFile}
              setAudioFile={manifest.setAudioFile}
              audioVolume={manifest.audioVolume}
              setAudioVolume={manifest.setAudioVolume}
              isPlaying={manifest.audioSubliminalPlaying}
              playAudio={manifest.playSubliminalAudio}
              stopAudio={manifest.stopSubliminalAudio}
              maxVolume={20}
            />
          </div>
          <div>
            <ManifestVisualizer
              isActive={manifest.isManifestActive}
              manifestPatterns={manifestPatterns}
              selectedPattern={manifest.selectedPattern}
              patternImage={manifest.patternImage}
              patternImages={manifest.patternImages}
              receptorImage={manifest.receptorImage}
              receptorImages={manifest.receptorImages}
              intention={manifest.intention}
              currentImage={manifest.currentImage}
              visualSpeed={manifest.visualSpeed}
              exposureTime={manifest.exposureTime}
              rate1={manifest.rate1}
              rate2={manifest.rate2}
              rate3={manifest.rate3}
              patterns={manifestPatterns}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Manifest;
