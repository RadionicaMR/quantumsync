
import { useState, useEffect, useRef } from 'react';
import { ManifestPattern } from '@/data/manifestPatterns';
import { ManifestAudio } from './types';
import { useManifestState } from './useManifestState';
import { useManifestAudio } from './useManifestAudio';
import { useManifestSubliminal } from './useManifestSubliminal';
import { useManifestEffects } from './useManifestEffects';
import { toast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

export interface ManifestCore {
  patterns: ManifestPattern[];
  selectedPattern: string;
  intention: string;
  setIntention: (value: string) => void;
  isManifestActive: boolean;
  setIsManifestActive: (value: boolean) => void;
  visualSpeed: number[];
  setVisualSpeed: (value: number[]) => void;
  patternImage: string | null;
  setPatternImage: (value: string | null) => void;
  receptorImage: string | null;
  setReceptorImage: (value: string | null) => void;
  patternImages: string[];
  setPatternImages: (value: string[]) => void;
  receptorImages: string[];
  setReceptorImages: (value: string[]) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
  manifestSound: boolean;
  setManifestSound: (value: boolean) => void;
  manifestFrequency: number[];
  setManifestFrequency: (value: number[]) => void;
  currentImage: 'pattern' | 'receptor' | 'mix' | 'radionic';
  setCurrentImage: (value: 'pattern' | 'receptor' | 'mix' | 'radionic') => void;
  exposureTime: number[];
  setExposureTime: (value: number[]) => void;
  timeRemaining: number | null;
  setTimeRemaining: (value: number | null) => void;
  receptorName: string;
  setReceptorName: (value: string) => void;
  rate1: string;
  setRate1: (value: string) => void;
  rate2: string;
  setRate2: (value: string) => void;
  rate3: string;
  setRate3: (value: string) => void;
  startManifestation: (intentionText?: string) => void;
  stopManifestation: () => void;
  formatTimeRemaining: (time: number) => string;
  selectPattern: (patternId: string) => void;
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  audioVolume: number;
  setAudioVolume: (value: number) => void;
  audioSubliminalPlaying: boolean;
  playSubliminalAudio: () => void;
  stopSubliminalAudio: () => void;
  backgroundModeActive: boolean;
  handleTabChange: (tab: string) => void;
  indefiniteTime: boolean;
  setIndefiniteTime: (value: boolean) => void;
  manifestSpeed: number[];
  setManifestSpeed: (value: number[]) => void;
}

export const useManifestCore = (patterns: ManifestPattern[]) => {
  // Get manifest state
  const state = useManifestState();
  const audio = useManifestAudio();
  const subliminal = useManifestSubliminal();
  const effects = useManifestEffects();
  
  // Extract useful state
  const { 
    isManifestActive, setIsManifestActive,
    intention, setIntention,
    timeRemaining, setTimeRemaining,
    patternImage, receptorImage,
    patternImages, receptorImages,
    currentImage, setCurrentImage,
    exposureTime, visualSpeed,
    receptorName,
    indefiniteTime,
    manifestSpeed
  } = state;
  
  // Mobile detection
  const { isIOS, isSafari } = useIsMobile();
  
  // References
  const manifestTimerRef = useRef<NodeJS.Timeout | null>(null);
  const manifestIntervalRef = useRef<NodeJS.Timeout | number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  
  // Function to start the image alternation
  const startImageAlternation = () => {
    console.log("Starting image alternation in Manifest");
    
    // Clear any existing interval/animation frame
    stopImageAlternation();
    
    // Set initial image - now renamed to 'radionic' to match treatment nomenclature
    setCurrentImage('radionic');
    
    // Calculate interval based on speed setting (faster = shorter interval)
    const speed = (visualSpeed && visualSpeed.length > 0) ? visualSpeed[0] : 10;
    const switchInterval = 2000 / Math.max(1, speed);
    
    console.log("Setting up image alternation with interval:", switchInterval);
    
    // Use requestAnimationFrame for iOS/Safari for better performance
    if (isIOS || isSafari) {
      const animate = (currentTime: number) => {
        if (!isManifestActive) return; // Stop if not active
        
        const elapsed = currentTime - lastTimeRef.current;
        
        if (elapsed > switchInterval) {
          setCurrentImage(prev => {
            // Toggle between 'radionic' (or legacy 'pattern') and 'receptor' states
            return prev === 'radionic' || prev === 'pattern' ? 'receptor' : 'radionic';
          });
          lastTimeRef.current = currentTime;
        }
        
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      
      lastTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      // Standard interval for other browsers
      manifestIntervalRef.current = setInterval(() => {
        setCurrentImage(prev => {
          // Toggle between 'radionic' (or legacy 'pattern') and 'receptor' states
          return prev === 'radionic' || prev === 'pattern' ? 'receptor' : 'radionic';
        });
      }, switchInterval);
    }
  };
  
  // Function to stop image alternation
  const stopImageAlternation = () => {
    console.log("Stopping image alternation in Manifest");
    
    // Clean up interval if it exists
    if (manifestIntervalRef.current) {
      clearInterval(manifestIntervalRef.current as NodeJS.Timeout);
      manifestIntervalRef.current = null;
    }
    
    // Clean up animation frame if it exists
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Reset to mix view
    setCurrentImage('mix');
  };

  // Function to handle tab changes
  const handleTabChange = (tab: string) => {
    console.log("Handling tab change to", tab);
    state.setActiveTab(tab);
  };
  
  // Enhanced startManifestation to properly handle image alternation
  const startManifestation = (intentionText?: string) => {
    // Validate intention
    const finalIntention = intentionText || intention;
    
    if (!finalIntention || finalIntention.trim() === "") {
      console.error("Cannot start manifestation - missing intention");
      toast({
        title: "Error de manifestación",
        description: "Debes ingresar una intención para la manifestación",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Starting manifestation with intention:", finalIntention);
    
    // If an intention was passed, update the state
    if (intentionText) {
      setIntention(intentionText);
    }
    
    // Set active state
    setIsManifestActive(true);
    
    // Start image alternation
    startImageAlternation();
    
    // Start audio
    audio.startManifestAudio();
    
    // Start subliminal audio if available
    if (subliminal.audioFile) {
      setTimeout(() => {
        subliminal.playSubliminalAudio();
      }, 300);
    }
    
    // Start timer if not indefinite
    if (!indefiniteTime) {
      const timeInMs = (exposureTime[0] || 5) * 60 * 1000;
      setTimeRemaining(timeInMs / 1000);
      
      // Clear any existing timer
      if (manifestTimerRef.current) {
        clearTimeout(manifestTimerRef.current);
      }
      
      // Set countdown timer
      let remainingTime = timeInMs;
      const countdownInterval = setInterval(() => {
        remainingTime -= 1000;
        setTimeRemaining(remainingTime / 1000);
        
        if (remainingTime <= 0) {
          clearInterval(countdownInterval);
          stopManifestation();
        }
      }, 1000);
      
      // Set timer to stop manifestation
      manifestTimerRef.current = setTimeout(() => {
        stopManifestation();
        clearInterval(countdownInterval);
      }, timeInMs);
    }
    
    // Show toast notification
    toast({
      title: "Manifestación iniciada",
      description: `Manifestando: ${finalIntention.substring(0, 50)}${finalIntention.length > 50 ? '...' : ''}`,
    });
  };
  
  // Enhanced stopManifestation to properly clean up image alternation
  const stopManifestation = () => {
    console.log("Stopping manifestation");
    
    // Set inactive state
    setIsManifestActive(false);
    
    // Stop image alternation
    stopImageAlternation();
    
    // Stop audio
    audio.stopManifestAudio();
    
    // Stop subliminal audio
    subliminal.stopSubliminalAudio();
    
    // Clear timer
    if (manifestTimerRef.current) {
      clearTimeout(manifestTimerRef.current);
      manifestTimerRef.current = null;
    }
    
    // Reset time remaining
    setTimeRemaining(null);
    
    // Show toast notification
    toast({
      title: "Manifestación detenida",
      description: "La manifestación ha sido detenida exitosamente.",
    });
  };
  
  useEffect(() => {
    // Cleanup on unmount
    return () => {
      console.log("Cleaning up useManifestCore");
      
      if (manifestTimerRef.current) {
        clearTimeout(manifestTimerRef.current);
      }
      
      if (manifestIntervalRef.current) {
        clearInterval(manifestIntervalRef.current as NodeJS.Timeout);
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // Adjust image alternation when speed changes
  useEffect(() => {
    if (isManifestActive) {
      // Restart image alternation with new speed
      startImageAlternation();
    }
  }, [visualSpeed, isManifestActive]);

  return {
    ...state,
    ...audio,
    ...subliminal,
    ...effects,
    startManifestation,
    stopManifestation,
    formatTimeRemaining: (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    },
    selectPattern: (patternId: string) => {
      const pattern = patterns.find(p => p.id === patternId);
      if (pattern) {
        state.setSelectedPattern(pattern.id);
      }
    },
    backgroundModeActive: audio.backgroundModeActive || subliminal.backgroundModeActive,
    handleTabChange
  };
};
