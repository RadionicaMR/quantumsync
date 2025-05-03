
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
    
    // Primero actualizar el tab activo en el estado para garantizar consistencia
    state.setActiveTab(val);
    
    // Ya NO limpiamos nada al cambiar de tab para permitir mejor experiencia de usuario
    // Los usuarios pueden cambiar entre tabs sin perder sus configuraciones
    console.log("useManifestNavigation: Manteniendo configuración al cambiar a", val);
    
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
      
      // Asegurar que estamos en la pestaña correcta
      if (state.activeTab !== "presets") {
        console.log("Cambiando de tab 'custom' a 'presets' por selección de patrón");
        state.setActiveTab("presets");
      }
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
