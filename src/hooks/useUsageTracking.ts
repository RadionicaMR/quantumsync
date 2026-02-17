import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Generate anonymous user hash from session-stable fingerprint
const getUserHash = (): string => {
  let hash = sessionStorage.getItem('usage_user_hash');
  if (!hash) {
    const raw = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      Intl.DateTimeFormat().resolvedOptions().timeZone
    ].join('|');
    // Simple irreversible hash
    let h = 0;
    for (let i = 0; i < raw.length; i++) {
      h = ((h << 5) - h + raw.charCodeAt(i)) & 0xffffffff;
    }
    hash = `u_${Math.abs(h).toString(36)}_${Date.now().toString(36)}`;
    sessionStorage.setItem('usage_user_hash', hash);
  }
  return hash;
};

export type UsageModule = 'treatment' | 'manifestation' | 'diagnosis' | 'balance_chakras';

interface TrackSessionStartOptions {
  module: UsageModule;
  protocolName?: string;
  isPreset?: boolean;
  configuredDuration?: number;
  configuredIntensity?: number;
  frequency?: number;
  metadata?: Record<string, unknown>;
}

interface TrackSessionEndOptions {
  module: UsageModule;
  actualDuration?: number; // in seconds
  protocolName?: string;
  metadata?: Record<string, unknown>;
}

interface TrackDiagnosisOptions {
  area: string;
  result?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export const useUsageTracking = () => {
  const trackSessionStart = useCallback(async (options: TrackSessionStartOptions) => {
    try {
      await supabase.from('usage_events').insert([{
        user_hash: getUserHash(),
        event_type: 'session_start',
        module: options.module,
        protocol_name: options.protocolName || null,
        is_preset: options.isPreset ?? false,
        configured_duration: options.configuredDuration || null,
        configured_intensity: options.configuredIntensity || null,
        frequency: options.frequency || null,
        metadata: (options.metadata || {}) as any,
      }]);
    } catch (e) {
      console.error('Usage tracking error:', e);
    }
  }, []);

  const trackSessionEnd = useCallback(async (options: TrackSessionEndOptions) => {
    try {
      await supabase.from('usage_events').insert([{
        user_hash: getUserHash(),
        event_type: 'session_end',
        module: options.module,
        protocol_name: options.protocolName || null,
        actual_duration: options.actualDuration || null,
        metadata: (options.metadata || {}) as any,
      }]);
    } catch (e) {
      console.error('Usage tracking error:', e);
    }
  }, []);

  const trackDiagnosis = useCallback(async (options: TrackDiagnosisOptions) => {
    try {
      await supabase.from('usage_events').insert([{
        user_hash: getUserHash(),
        event_type: 'diagnosis_run',
        module: 'diagnosis' as UsageModule,
        diagnosis_area: options.area,
        diagnosis_result: (options.result || {}) as any,
        metadata: (options.metadata || {}) as any,
      }]);
    } catch (e) {
      console.error('Usage tracking error:', e);
    }
  }, []);

  return { trackSessionStart, trackSessionEnd, trackDiagnosis };
};
