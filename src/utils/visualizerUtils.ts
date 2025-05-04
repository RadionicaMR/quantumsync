
/**
 * Calcula las velocidades de animación basadas en la velocidad visual establecida.
 * @param speedValue - Valor de velocidad visual (1-20)
 * @returns Objeto con duraciones calculadas para las animaciones
 */
export function calculateAnimationSpeeds(speedValue: number) {
  // Duración de la animación RATE - inversamente proporcional a la velocidad
  const rateAnimationDuration = Math.max(5, 15 - (speedValue / 2));
  
  // Duración del pulso - inversamente proporcional a la velocidad
  const pulseDuration = Math.max(0.5, 5 - (speedValue / 4));
  
  return { rateAnimationDuration, pulseDuration };
}

/**
 * Obtiene la imagen de patrón actual para mostrar.
 * Prioriza la matriz de imágenes, luego la imagen simple y finalmente el patrón seleccionado.
 */
export function getCurrentPatternImage(
  patternImages: string[] | undefined, 
  currentIndex: number,
  singlePatternImage: string | null,
  selectedPatternImage: string | null
): string | null {
  // Si hay imágenes múltiples, usar la actual según el índice
  if (patternImages && patternImages.length > 0) {
    return patternImages[currentIndex % patternImages.length];
  }
  
  // Si hay una imagen simple, usarla
  if (singlePatternImage) {
    return singlePatternImage;
  }
  
  // Finalmente, usar la imagen del patrón seleccionado si hay
  return selectedPatternImage;
}

/**
 * Obtiene la imagen de receptor actual para mostrar.
 * Prioriza la matriz de imágenes, luego la imagen simple.
 */
export function getCurrentReceptorImage(
  receptorImages: string[] | undefined,
  currentIndex: number,
  singleReceptorImage: string | null
): string | null {
  // Si hay imágenes múltiples, usar la actual según el índice
  if (receptorImages && receptorImages.length > 0) {
    return receptorImages[currentIndex % receptorImages.length];
  }
  
  // Si hay una imagen simple, usarla
  return singleReceptorImage;
}
