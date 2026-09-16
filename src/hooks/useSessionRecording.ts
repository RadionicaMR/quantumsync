import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export type SessionType = 'diagnosis' | 'treatment' | 'manifestation' | 'balance_chakras';

export interface SessionRecordOptions {
  /** 'completa' when the session ran the full configured time, 'incompleta' when stopped early */
  status?: 'completa' | 'incompleta';
  actualDurationSeconds?: number;
  silent?: boolean;
}

export const useSessionRecording = () => {
  const { user, isAuthenticated } = useAuth();

  const recordSession = async (
    patientId: string,
    sessionType: SessionType,
    sessionData: any,
    options: SessionRecordOptions = {}
  ) => {
    if (!isAuthenticated || !user?.email) {
      toast({
        title: 'Error',
        description: 'Debes iniciar sesión para registrar sesiones',
        variant: 'destructive',
      });
      return null;
    }

    const status = options.status ?? 'completa';

    const { data, error } = await supabase
      .from('sessions')
      .insert({
        patient_id: patientId,
        therapist_id: user.email,
        session_type: sessionType,
        session_data: {
          ...(sessionData || {}),
          status,
          actualDurationSeconds: options.actualDurationSeconds ?? null,
        },
        status,
        actual_duration_seconds: options.actualDurationSeconds ?? null,
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

    if (!options.silent) {
      toast({
        title: status === 'completa' ? 'Sesión registrada' : 'Sesión registrada (incompleta)',
        description:
          status === 'completa'
            ? 'La sesión se ha guardado correctamente'
            : 'La sesión se detuvo antes de tiempo y se guardó como incompleta',
      });
    }

    return data;
  };

  return { recordSession };
};
