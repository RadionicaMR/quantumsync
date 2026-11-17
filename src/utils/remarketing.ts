import { getTrialEndDate } from './trial';

export type RemarketingStage = 'two_days' | 'one_day' | 'expired' | 'recontact';

const HOUR = 60 * 60 * 1000;
/** Days after trial end during which the user still gets the "just expired" message. */
export const RECENT_EXPIRED_DAYS = 7;
export const PROMO_PRICE = 97;
export const REGULAR_PRICE = 129;

export function getRemarketingStage(
  trialStart: string | null,
  hasPaid: boolean | null,
  now: Date = new Date()
): RemarketingStage | null {
  if (hasPaid || !trialStart) return null;
  const end = getTrialEndDate(new Date(trialStart)).getTime();
  const remainingH = (end - now.getTime()) / HOUR;
  if (remainingH > 48) return null;
  if (remainingH > 24) return 'two_days';
  if (remainingH > 0) return 'one_day';
  if (-remainingH <= RECENT_EXPIRED_DAYS * 24) return 'expired';
  return 'recontact';
}

export const STAGE_LABELS: Record<RemarketingStage, string> = {
  two_days: 'Faltan 2 días',
  one_day: 'Faltan 24 hs',
  expired: 'Prueba vencida',
  recontact: 'Recontacto',
};

export function buildRemarketingMessage(stage: RemarketingStage | null, name: string | null): string {
  const first = (name || '').trim().split(/\s+/)[0];
  const hi = first ? `¡Hola ${first}!` : '¡Hola!';
  const greeting = first ? `Hola ${first},` : 'Hola,';
  const promo = `$${PROMO_PRICE} USD`;
  const regular = `$${REGULAR_PRICE} USD`;
  switch (stage) {
    case 'two_days':
      return `${hi} ¿Cómo estás? Te escribe Mauricio de QuantumSync.\n\nVi que iniciaste tu prueba gratuita de 3 días en la plataforma. Te escribo para darte la bienvenida y consultarte: ¿pudiste probar tu primera sesión de frecuencias o el diagnóstico?\n\nAprovecho para contarte que justo esta semana tenemos activa una promo especial para nuevos usuarios: la membresía anual está con descuento a ${promo} (su precio normal es de ${regular}).\n\nCualquier duda que tengas sobre cómo usar la plataforma, avisame por acá y te oriento con gusto.`;
    case 'one_day':
      return `${greeting} te paso un aviso rápido:\n\nMañana finalizan tus 3 días de prueba en QuantumSync. Si ya estuviste probando el sistema, sabés el enorme potencial que tiene para trabajar a distancia con tus pacientes o a nivel personal.\n\nSi querés continuar usándola sin interrupciones, estás a tiempo de aprovechar la promo de esta semana: te dejamos la suscripción anual a solo ${promo} (en lugar de los ${regular} regulares).\n\n¿Te gustaría que te pase los medios de pago para dejarla activa y congelar la promo?`;
    case 'expired':
      return `${greeting} ¿cómo estás?\n\nTe aviso que tu período de prueba en QuantumSync acaba de finalizar y el acceso a los módulos quedó en pausa.\n\nSi querés reactivar tu cuenta hoy y seguir usando todos los tratamientos, frecuencias, diagnósticos, manifestación e historial, todavía estás a tiempo de aprovechar la promo semanal: ${promo} por todo el año (precio regular ${regular}).\n\nRespondeme a este mensaje y te paso los datos para habilitarte el acceso de inmediato.\n\n¡Quedo a tu disposición!`;
    case 'recontact':
      return `${hi} ¿Cómo estás? Te escribe Mauricio de QuantumSync.\n\nHace un tiempito probaste la plataforma durante el período de prueba y quería saber: ¿cómo te fue? ¿Te resultó útil para vos o para tus pacientes? Tu opinión me sirve mucho para seguir mejorándola.\n\nTambién quería contarte que esta semana tenemos una promo especial: la membresía anual a ${promo} en lugar de los ${regular} habituales, con acceso a todos los tratamientos, frecuencias, diagnósticos, manifestación e historial.\n\nSi te interesa aprovecharla, respondeme por acá y te habilito el acceso enseguida.`;
    default:
      return `${hi} Te escribo de QuantumSync.`;
  }
}

/** Every unpaid client gets a follow-up, including the first 24 hours of trial. */
export function buildClientWhatsAppUrl(client: {
  whatsapp_phone: string | null;
  full_name: string | null;
  trial_start_date: string | null;
  created_at: string | null;
  has_paid: boolean | null;
}, now: Date = new Date()): string {
  const stage = client.has_paid ? null : (
    getRemarketingStage(client.trial_start_date || client.created_at, false, now) || 'two_days'
  );
  const message = buildRemarketingMessage(stage, client.full_name);
  return `https://wa.me/${(client.whatsapp_phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}
