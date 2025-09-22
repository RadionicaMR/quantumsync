
import { useCallback } from 'react';
import { toast } from "@/components/ui/use-toast";
import type { ChakraName } from '@/constants/chakraData';

export const useChakraNotifications = () => {
  // Modified to accept personName as optional parameter with default empty string
  const notifyStart = useCallback((personName: string = '') => {
    toast({
      title: "Proceso iniciado",
      description: `Armonizando chakras${personName ? ` para ${personName}` : ''}...`,
    });
  }, []);

  const notifyStop = useCallback(() => {
    toast({
      title: "Proceso detenido",
      description: "Armonización de chakras interrumpida.",
    });
  }, []);

  const notifyCompletion = useCallback(() => {
    toast({
      title: "¡Armonización Finalizada!",
      description: "Todos los chakras han sido equilibrados.",
    });
  }, []);

  const notifyChakraChange = useCallback((currentChakra: ChakraName, nextChakra: ChakraName) => {
    toast({
      title: `Chakra ${currentChakra} armonizado`,
      description: `Ahora armonizando el chakra ${nextChakra}...`,
    });
  }, []);

  const notifyMissingName = useCallback(() => {
    toast({
      title: "Nombre requerido",
      description: "Por favor ingresa el nombre de la persona a tratar.",
      variant: "destructive"
    });
  }, []);

  const notifyNoChakras = useCallback(() => {
    toast({
      title: "No hay chakras para equilibrar",
      description: "Todos los chakras ya están equilibrados.",
    });
  }, []);

  const notifyNoBlockedChakras = useCallback(() => {
    toast({
      title: "No se encontraron chakras bloqueados",
      description: "Se procederá a equilibrar todos los chakras ya que no hay chakras específicamente cerrados o bloqueados.",
    });
  }, []);

  return {
    notifyStart,
    notifyStop,
    notifyCompletion,
    notifyChakraChange,
    notifyMissingName,
    notifyNoChakras,
    notifyNoBlockedChakras
  };
};
