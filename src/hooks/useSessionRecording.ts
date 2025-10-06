import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type SessionType = 'diagnosis' | 'treatment' | 'manifestation' | 'balance_chakras';

export const useSessionRecording = () => {
  const recordSession = async (
    patientId: string,
    sessionType: SessionType,
    sessionData: any
  ) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: 'Error',
        description: 'Debes iniciar sesión para registrar sesiones',
        variant: 'destructive',
      });
      return null;
    }

    const { data, error } = await supabase
      .from('sessions')
      .insert({
        patient_id: patientId,
        therapist_id: user.id,
        session_type: sessionType,
        session_data: sessionData,
      })
      .select()
      .single();

    if (error) {
      console.error('Error recording session:', error);
      toast({
        title: 'Error',
        description: 'No se pudo registrar la sesión',
        variant: 'destructive',
      });
      return null;
    }

    toast({
      title: 'Sesión registrada',
      description: 'La sesión se ha guardado correctamente',
    });

    return data;
  };

  return { recordSession };
};
