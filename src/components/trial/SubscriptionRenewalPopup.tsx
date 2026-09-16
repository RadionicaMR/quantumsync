import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useTrialStatus } from '@/hooks/useTrialStatus';

const WHATSAPP_NUMBER = '542945581188';
const THRESHOLDS = [30, 20, 5];

const SubscriptionRenewalPopup = () => {
  const { isLoading, hasPaid, subscriptionDaysRemaining, isSubscriptionExpired } = useTrialStatus();
  const [isOpen, setIsOpen] = useState(false);
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    if (isLoading || !hasPaid || isSubscriptionExpired) return;
    if (subscriptionDaysRemaining === null) return;

    // Umbral más cercano ya alcanzado (30, 20 o 5 días restantes)
    const threshold = THRESHOLDS.find((t) => subscriptionDaysRemaining <= t && subscriptionDaysRemaining > (THRESHOLDS.find((x) => x < t) ?? 0));
    if (!threshold) return;

    const storageKey = `quantumsync-renewal-notice-${threshold}`;
    if (localStorage.getItem(storageKey)) return;

    const timer = setTimeout(() => {
      setDays(subscriptionDaysRemaining);
      setIsOpen(true);
      localStorage.setItem(storageKey, 'true');
    }, 5000);

    return () => clearTimeout(timer);
  }, [isLoading, hasPaid, subscriptionDaysRemaining, isSubscriptionExpired]);

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hola, quiero renovar mi suscripción anual de QuantumSync (me quedan ${days ?? 0} días).`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520] border-purple-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
            Tu suscripción vence pronto
          </DialogTitle>
          <DialogDescription className="text-center text-purple-200/80 pt-2">
            {`Quedan ${days ?? 0} días para que finalice tu suscripción anual de QuantumSync. Escribime por WhatsApp para renovarla y seguir con el acceso completo.`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 pt-2">
          <Button
            onClick={handleWhatsApp}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white text-lg py-6 h-auto rounded-full shadow-[0_0_30px_rgba(34,197,94,0.4)] font-semibold"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Renovar por WhatsApp
          </Button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            Ahora no
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionRenewalPopup;
