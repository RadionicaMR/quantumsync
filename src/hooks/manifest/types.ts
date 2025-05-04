
import { RefObject } from 'react';

export interface ManifestState {
  intention: string;
  isManifestActive: boolean;
  visualSpeed: number[];
  patternImage: string | null;
  receptorImage: string | null;
  patternImages: string[];
  receptorImages: string[];
  selectedPattern: string;
  activeTab: string;
  manifestSound: boolean;
  manifestFrequency: number[];
  currentImage: 'pattern' | 'receptor' | 'mix' | 'radionic';
  exposureTime: number[];
  timeRemaining: number | null;
  receptorName: string;
  rate1: string;
  rate2: string;
  rate3: string;
  indefiniteTime: boolean;
  manifestSpeed: number[];
}

export interface ManifestTimers {
  hypnoticTimerRef: RefObject<NodeJS.Timeout | null>;
  exposureTimerRef: RefObject<NodeJS.Timeout | null>;
  countdownTimerRef: RefObject<NodeJS.Timeout | null>;
}

export interface ManifestAudio {
  oscillatorRef: RefObject<OscillatorNode | null>;
  audioContextRef: RefObject<AudioContext | null>;
  startAudio: (frequency: number) => void;
  stopAudio: () => void;
}

export interface ManifestNavigation {
  handleTabChange: (tab: string) => void;
  selectPattern: (patternId: string) => void;
}

export interface ManifestSubliminal {
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  audioVolume: number;
  setAudioVolume: (vol: number) => void;
  audioRef: RefObject<HTMLAudioElement | null>;
  audioSubliminalPlaying: boolean;
  playSubliminalAudio: () => void;
  stopSubliminalAudio: () => void;
  backgroundModeActive: boolean;
}

export interface ManifestUtils {
  formatTimeRemaining: (time: number) => string;
}
