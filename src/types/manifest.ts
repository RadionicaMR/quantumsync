
import { ManifestPattern } from '@/data/manifestPatterns';

export interface ManifestCoreProps {
  selectedPattern: string;
  intention: string;
  setIntention: (value: string) => void;
  manifestSound: boolean;
  setManifestSound: (value: boolean) => void;
  manifestFrequency: number[];
  setManifestFrequency: (value: number[]) => void;
  exposureTime: number[];
  setExposureTime: (value: number[]) => void;
  visualSpeed: number[];
  setVisualSpeed: (value: number[]) => void;
  patternImage: string | null;
  setPatternImage: (image: string | null) => void;
  receptorImage: string | null;
  setReceptorImage: (image: string | null) => void;
  patternImages: string[];
  setPatternImages: (images: string[]) => void;
  receptorImages: string[];
  setReceptorImages: (images: string[]) => void;
  isManifestActive: boolean;
  timeRemaining: number | null;
  currentImage: 'pattern' | 'receptor' | 'mix';
  selectPattern: (pattern: ManifestPattern) => void;
  startManifestation: (intention?: string) => void;
  stopManifestation: () => void;
  formatTimeRemaining: (time: number) => string;
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  audioVolume: number;
  setAudioVolume: (value: number) => void;
  audioSubliminalPlaying: boolean;
  playSubliminalAudio: () => void;
  stopSubliminalAudio: () => void;
  backgroundModeActive: boolean;
  rate1: string;
  rate2: string;
  rate3: string;
  setRate1: (value: string) => void;
  setRate2: (value: string) => void;
  setRate3: (value: string) => void;
  receptorName: string;
  setReceptorName: (value: string) => void;
  indefiniteTime: boolean;
  setIndefiniteTime: (value: boolean) => void;
}

export interface ManifestTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}
