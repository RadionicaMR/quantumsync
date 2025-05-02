
import ImageGrid from '../ImageGrid';
import SettingsToggles from '../SettingsToggles';
import TreatmentActions from '../TreatmentActions';
import TreatmentVisualizer from '../TreatmentVisualizer';
import AudioSubliminalControls from '../../AudioSubliminalControls';

interface TreatmentRightPanelProps {
  radionicImage: string | null;
  setRadionicImage: (image: string | null) => void;
  radionicImages: string[];
  setRadionicImages: (images: string[]) => void;
  receptorImage: string | null;
  setReceptorImage: (image: string | null) => void;
  receptorImages: string[];
  setReceptorImages: (images: string[]) => void;
  useHeadphones: boolean;
  setUseHeadphones: (value: boolean) => void;
  visualFeedback: boolean;
  setVisualFeedback: (value: boolean) => void;
  isPlaying: boolean;
  timeRemaining: number;
  formatTime: (minutes: number) => string;
  currentImage: 'radionic' | 'receptor' | 'mix';
  hypnoticEffect: boolean;
  startTreatment: () => void;
  stopTreatment: () => void;
  frequency: number[];
  intensity: number[];
  rate1: string;
  rate2: string;
  rate3: string;
  hypnoticSpeed: number[];
  receptorName: string;
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  audioVolume: number;
  setAudioVolume: (vol: number) => void;
  audioSubliminalPlaying: boolean;
  playSubliminalAudio: () => void;
  stopSubliminalAudio: () => void;
  audioLoop?: boolean;
  setAudioLoop?: (loop: boolean) => void;
  clearAudio?: () => void;
}

const TreatmentRightPanel = ({
  radionicImage,
  setRadionicImage,
  radionicImages,
  setRadionicImages,
  receptorImage,
  setReceptorImage,
  receptorImages,
  setReceptorImages,
  useHeadphones,
  setUseHeadphones,
  visualFeedback,
  setVisualFeedback,
  isPlaying,
  timeRemaining,
  formatTime,
  currentImage,
  hypnoticEffect,
  startTreatment,
  stopTreatment,
  frequency,
  intensity,
  rate1,
  rate2,
  rate3,
  hypnoticSpeed,
  receptorName,
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
}: TreatmentRightPanelProps) => {
  return (
    <div className="space-y-6 w-full">
      <ImageGrid 
        radionicImage={radionicImage}
        setRadionicImage={setRadionicImage}
        radionicImages={radionicImages}
        setRadionicImages={setRadionicImages}
        receptorImage={receptorImage}
        setReceptorImage={setReceptorImage}
        receptorImages={receptorImages}
        setReceptorImages={setReceptorImages}
        isPlaying={isPlaying}
      />

      <AudioSubliminalControls
        audioFile={audioFile}
        setAudioFile={setAudioFile}
        audioVolume={audioVolume}
        setAudioVolume={setAudioVolume}
        isPlaying={audioSubliminalPlaying}
        playAudio={playSubliminalAudio}
        stopAudio={stopSubliminalAudio}
        maxVolume={20}
        audioLoop={audioLoop}
        setAudioLoop={setAudioLoop}
        clearAudio={clearAudio}
      />
      
      <SettingsToggles 
        useHeadphones={useHeadphones}
        setUseHeadphones={setUseHeadphones}
        visualFeedback={visualFeedback}
        setVisualFeedback={setVisualFeedback}
        isPlaying={isPlaying}
      />
      
      <TreatmentActions 
        isPlaying={isPlaying}
        timeRemaining={timeRemaining}
        formatTime={formatTime}
        startTreatment={startTreatment}
        stopTreatment={stopTreatment}
        receptorName={receptorName}
      />
      
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
      />
    </div>
  );
};

export default TreatmentRightPanel;
