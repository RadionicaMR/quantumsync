
export const useManifestUtils = () => {
  // Format time remaining for display
  const formatTimeRemaining = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  return { formatTimeRemaining };
};
