
import { Card } from "@/components/ui/card";
import TreatmentVisualizer from "../TreatmentVisualizer";
import TreatmentActions from "../TreatmentActions";
import SettingsToggles from "../SettingsToggles";
import ImageUploader from "../image-uploader/ImageUploader";
import AudioSubliminalControls from "@/components/AudioSubliminalControls";

interface TreatmentRightPanelProps {
  isPlaying: boolean;
  timeRemaining: number | null;
  formatTime: (time: number | null) => string;
  startTreatment: () => void;
  stopTreatment: () => void;
  visualFeedback: boolean;
  setVisualFeedback: (value: boolean) => void;
  useHeadphones: boolean;
  setUseHeadphones: (value: boolean) => void;
  radionicImage: string | null;
  setRadionicImage: (image: string | null) => void;
  radionicImages: string[];
  setRadionicImages: (images: string[]) => void;
  receptorImage: string | null;
  setReceptorImage: (image: string | null) => void;
  receptorImages: string[];
  setReceptorImages: (images: string[]) => void;
  currentImage: 'radionic' | 'receptor' | 'mix';
  hypnoticEffect: boolean;
  frequency: number[];
  intensity: number[];
  rate1: string;
  rate2: string;
  rate3: string;
  hypnoticSpeed?: number[];
  receptorName?: string;
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  audioVolume: number;
  setAudioVolume: (volume: number) => void;
  audioSubliminalPlaying: boolean;
  playSubliminalAudio: () => void;
  stopSubliminalAudio: () => void;
  audioLoop?: boolean;
  setAudioLoop?: (loop: boolean) => void;
  clearAudio?: () => void;
  backgroundModeActive?: boolean;
  intention?: string;
}

const TreatmentRightPanel = ({
  isPlaying,
  timeRemaining,
  formatTime,
  startTreatment,
  stopTreatment,
  visualFeedback,
  setVisualFeedback,
  useHeadphones,
  setUseHeadphones,
  radionicImage,
  setRadionicImage,
  radionicImages,
  setRadionicImages,
  receptorImage,
  setReceptorImage,
  receptorImages,
  setReceptorImages,
  currentImage,
  hypnoticEffect,
  frequency,
  intensity,
  rate1,
  rate2,
  rate3,
  hypnoticSpeed = [10],
  receptorName = "",
  audioFile,
  setAudioFile,
  audioVolume,
  setAudioVolume,
  audioSubliminalPlaying,
  playSubliminalAudio,
  stopSubliminalAudio,
  audioLoop = true,
  setAudioLoop = () => {},
  clearAudio = () => {},
  backgroundModeActive = false,
  intention = ""
}: TreatmentRightPanelProps) => {
  return (
    <div className="lg:col-span-2 space-y-6">
      <Card className="bg-card/90 dark:bg-black/40 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Visualización de Tratamiento</h3>
        
        <TreatmentVisualizer 
          isPlaying={isPlaying}
          visualFeedback={visualFeedback}
          radionicImage={radionicImage}
          receptorImage={receptorImage}
          radionicImages={radionicImages}
          receptorImages={receptorImages}
          currentImage={currentImage}
          hypnoticEffect={hypnoticEffect}
          frequency={frequency}
          intensity={intensity}
          rate1={rate1}
          rate2={rate2}
          rate3={rate3}
          hypnoticSpeed={hypnoticSpeed}
          receptorName={receptorName}
          intention={intention}
        />
      </Card>
      
      <Card className={`bg-card/90 dark:bg-black/40 p-6 rounded-lg ${isPlaying ? 'border-2 border-quantum-primary/60 bg-quantum-primary/5' : ''}`}>
        <TreatmentActions 
          isPlaying={isPlaying}
          timeRemaining={timeRemaining}
          formatTime={formatTime}
          startTreatment={startTreatment}
          stopTreatment={stopTreatment}
          backgroundModeActive={backgroundModeActive}
          receptorName={receptorName}
          intention={intention}
        />
        
        <div className="mt-4">
          <SettingsToggles 
            useHeadphones={useHeadphones}
            setUseHeadphones={setUseHeadphones}
            visualFeedback={visualFeedback}
            setVisualFeedback={setVisualFeedback}
            isPlaying={isPlaying}
          />
        </div>
      </Card>
      
      {/* Image uploads section */}
      <Card className="bg-card/90 dark:bg-black/40 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Imágenes Terapéuticas</h3>
        
        <div className="mb-6">
          <ImageUploader
            title="Gráfico RADIÓNICO"
            subtitle="Patrones de tratamiento"
            image={radionicImage}
            setImage={setRadionicImage}
            images={radionicImages}
            setImages={setRadionicImages}
            isPlaying={isPlaying}
            maxImages={3}
            category="radionic"
          />
        </div>
        
        <div>
          <ImageUploader
            title="Imagen del RECEPTOR"
            subtitle="Sujeto del tratamiento"
            image={receptorImage}
            setImage={setReceptorImage}
            images={receptorImages}
            setImages={setReceptorImages}
            isPlaying={isPlaying}
            maxImages={3}
            category="receptor"
          />
        </div>
      </Card>
      
      {/* Audio subliminal section */}
      <Card className="bg-card/90 dark:bg-black/40 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Audio Subliminal (opcional)</h3>
        
        <AudioSubliminalControls 
          audioFile={audioFile}
          setAudioFile={setAudioFile}
          audioVolume={audioVolume}
          setAudioVolume={setAudioVolume}
          isPlaying={audioSubliminalPlaying}
          playAudio={playSubliminalAudio}
          stopAudio={stopSubliminalAudio}
          isDisabled={isPlaying && !audioSubliminalPlaying}
          audioLoop={audioLoop}
          setAudioLoop={setAudioLoop}
          clearAudio={clearAudio}
        />
      </Card>
    </div>
  );
};

export default TreatmentRightPanel;
