
import { Pattern } from '@/data/manifestPatterns';

// Define all shared types for the manifest hooks
export interface ManifestState {
  intention: string;
  isManifestActive: boolean;
  visualSpeed: number[];
  patternImage: string | null;
  receptorImage: string | null;
  selectedPattern: string;
  activeTab: string;
  manifestSound: boolean;
  manifestFrequency: number[];
  currentImage: 'pattern' | 'receptor' | 'mix';
  exposureTime: number[];
  timeRemaining: number | null;
  receptorName: string;
  rate1: string;
  rate2: string;
  rate3: string;
}

export interface ManifestAudio {
  oscillatorRef: React.MutableRefObject<OscillatorNode | null>;
  audioContextRef: React.MutableRefObject<AudioContext | null>;
}

export interface ManifestTimers {
  hypnoticTimerRef: React.MutableRefObject<NodeJS.Timeout | null>;
  exposureTimerRef: React.MutableRefObject<NodeJS.Timeout | null>;
  countdownTimerRef: React.MutableRefObject<NodeJS.Timeout | null>;
}
