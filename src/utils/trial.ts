export const TRIAL_DAYS = 3;

export function getTrialEndDate(startDate: Date): Date {
  return new Date(startDate.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
}