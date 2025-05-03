
import { useManifestState } from './useManifestState';
import { useManifestSubliminal } from './useManifestSubliminal';
import { toast } from "@/components/ui/use-toast";

export const useManifestNavigation = (stopManifestation: () => void) => {
  const state = useManifestState();
  const { stopSubliminalAudio } = useManifestSubliminal();

  const handleTabChange = (val: string) => {
    console.log("useManifestNavigation: Cambiando a tab", val, "desde tab actual", state.activeTab);
    
    if (state.isManifestActive) {
      stopManifestation();
    }
    
    // CORREGIDO: Primero actualizar el tab activo en el estado para garantizar consistencia
    state.setActiveTab(val);
    
    // Luego limpiar el estado según el tab seleccionado
    if (val === "presets") {
      console.log("useManifestNavigation: Limpiando imágenes de patrón para presets");
      state.setPatternImage(null);
      state.setPatternImages([]);
    } else if (val === "custom") {
      console.log("useManifestNavigation: Limpiando patrón seleccionado para custom");
      state.setSelectedPattern('');
    }
    
    stopSubliminalAudio();
  };

  const selectPattern = (patternId: string) => {
    console.log("useManifestNavigation: Seleccionando patrón", patternId);
    
    if (state.isManifestActive) {
      stopManifestation();
    }
    
    // Validación para evitar patrones vacíos
    if (patternId && patternId.trim() !== "") {
      state.setSelectedPattern(patternId);
      console.log("Patrón seleccionado:", patternId);
    } else {
      console.warn("Intento de seleccionar un patrón vacío");
      toast({
        title: "Error al seleccionar patrón",
        description: "El patrón seleccionado no es válido",
        variant: "destructive",
      });
    }
    
    stopSubliminalAudio();
  };

  return {
    handleTabChange,
    selectPattern,
  };
};
