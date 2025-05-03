
/**
 * Utility functions for the manifest visualizer components
 */

/**
 * Calculates animation speed values based on visualSpeed input
 */
export const calculateAnimationSpeeds = (speedValue: number = 10) => {
  // Calculate animation durations based on speed value
  const rateAnimationDuration = Math.max(5, 15 - speedValue);
  const pulseDuration = Math.max(0.5, 5 - (speedValue / 4));
  
  return {
    rateAnimationDuration,
    pulseDuration
  };
};

/**
 * Gets the current image to display from multiple options
 */
export const getCurrentPatternImage = (
  patternImages: string[] = [],
  currentIndex: number = 0,
  patternImage: string | null = null,
  selectedPatternImage: string | null = null
): string | null => {
  
  if (patternImages && patternImages.length > 0) {
    return patternImages[currentIndex];
  }
  
  if (patternImage) {
    return patternImage;
  }
  
  if (selectedPatternImage) {
    return selectedPatternImage;
  }
  
  return null;
};

/**
 * Gets the current receptor image from multiple options
 */
export const getCurrentReceptorImage = (
  receptorImages: string[] = [],
  currentIndex: number = 0,
  receptorImage: string | null = null
): string | null => {
  if (receptorImages && receptorImages.length > 0) {
    return receptorImages[currentIndex];
  }
  return receptorImage;
};
