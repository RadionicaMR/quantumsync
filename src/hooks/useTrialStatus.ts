import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface TrialStatus {
  isLoading: boolean;
  hasPaid: boolean;
  isTrialActive: boolean;
  isTrialExpired: boolean;
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  trialStartDate: Date | null;
}

export const useTrialStatus = (): TrialStatus => {
  const { user, isAuthenticated } = useAuth();
  const [hasPaid, setHasPaid] = useState(false);
  const [trialStartDate, setTrialStartDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  // Update "now" every minute for countdown
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user?.userId) {
      setIsLoading(false);
      return;
    }

    const fetchTrialData = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('trial_start_date, has_paid')
          .eq('id', user.userId)
          .single();

        if (error) {
          console.error('[TRIAL] Error fetching trial status:', error);
          setIsLoading(false);
          return;
        }

        setHasPaid(data?.has_paid ?? false);
        setTrialStartDate(data?.trial_start_date ? new Date(data.trial_start_date) : null);
      } catch (err) {
        console.error('[TRIAL] Exception:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrialData();
  }, [isAuthenticated, user?.userId]);

  const trialEndDate = trialStartDate ? new Date(trialStartDate.getTime() + 7 * 24 * 60 * 60 * 1000) : null;
  const msRemaining = trialEndDate ? trialEndDate.getTime() - now.getTime() : 0;

  const isTrialActive = !hasPaid && trialStartDate !== null && msRemaining > 0;
  const isTrialExpired = !hasPaid && trialStartDate !== null && msRemaining <= 0;

  const totalMinutesRemaining = Math.max(0, Math.floor(msRemaining / 60000));
  const daysRemaining = Math.floor(totalMinutesRemaining / (24 * 60));
  const hoursRemaining = Math.floor((totalMinutesRemaining % (24 * 60)) / 60);
  const minutesRemaining = totalMinutesRemaining % 60;

  return {
    isLoading,
    hasPaid,
    isTrialActive,
    isTrialExpired,
    daysRemaining,
    hoursRemaining,
    minutesRemaining,
    trialStartDate,
  };
};
