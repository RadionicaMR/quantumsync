export const SUBSCRIPTION_DAYS = 365;

export interface SubscriptionInfo {
  dayNumber: number;
  daysRemaining: number;
  expired: boolean;
  label: string;
  sublabel: string;
}

export const getSubscriptionInfo = (
  hasPaid: boolean | null,
  subscriptionStartDate: string | null
): SubscriptionInfo | null => {
  if (!hasPaid || !subscriptionStartDate) return null;

  const DAY_MS = 24 * 60 * 60 * 1000;
  const elapsed = Math.floor((Date.now() - new Date(subscriptionStartDate).getTime()) / DAY_MS);
  const dayNumber = elapsed + 1;
  const daysRemaining = SUBSCRIPTION_DAYS - elapsed;
  const expired = daysRemaining <= 0;

  return {
    dayNumber,
    daysRemaining,
    expired,
    label: expired ? `Vencida · día ${dayNumber}` : `Día ${dayNumber} / ${SUBSCRIPTION_DAYS}`,
    sublabel: expired ? 'Renovación pendiente' : `${daysRemaining} días restantes`,
  };
};
