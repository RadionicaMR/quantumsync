
export const useManifestUtils = () => {
  // Función para formatear el tiempo restante
  const formatTimeRemaining = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    formatTimeRemaining
  };
};
