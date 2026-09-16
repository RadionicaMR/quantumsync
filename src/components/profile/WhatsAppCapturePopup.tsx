import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import WhatsAppPhoneInput, { DEFAULT_COUNTRY_CODE, isValidWhatsappPhone } from '@/components/shared/WhatsAppPhoneInput';

const WhatsAppCapturePopup = () => {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY_CODE);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!isAuthenticated || !user?.userId || user?.isAdmin) return;

    const check = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('whatsapp_phone')
        .eq('id', user.userId)
        .maybeSingle();

      if (cancelled || error) return;
      if (data && !data.whatsapp_phone) {
        setTimeout(() => {
          if (!cancelled) setIsOpen(true);
        }, 1500);
      }
    };

    check();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user?.userId]);

  const handleSave = async () => {
    const digits = `${countryCode}${phone}`.replace(/\D/g, '');
    if (digits.length < 8 || digits.length > 17) {
      setError('Ingresá un número válido (solo dígitos, sin 0 ni 15).');
      return;
    }
    const fullNumber = `+${digits}`;
    setError('');
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ whatsapp_phone: fullNumber })
        .eq('id', user!.userId)
        .select('id');

      if (error) throw error;
      if (!data || data.length === 0) throw new Error('No se encontró tu perfil para actualizar.');

      toast({
        title: '¡Gracias!',
        description: 'Tu número de WhatsApp quedó registrado.',
      });
      setIsOpen(false);
    } catch (e: any) {
      toast({
        title: 'No pudimos guardar tu número',
        description: e.message || 'Intentá nuevamente en unos segundos.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520] border-purple-500/30 text-white [&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-green-300 via-emerald-300 to-green-200 bg-clip-text text-transparent">
            Un último dato administrativo
          </DialogTitle>
          <DialogDescription className="text-center text-purple-200/80 pt-2">
            <span className="flex items-center justify-center gap-2 text-emerald-300 font-medium mb-2">
              <CheckCircle2 className="h-4 w-4" /> Tu cuenta está activa y funcionando
            </span>
            Solo necesitamos, por única vez, tu número de WhatsApp con código de país. Lo usamos únicamente para brindarte soporte y avisos importantes de tu cuenta.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          <Label htmlFor="whatsapp-capture" className="text-purple-200">
            Tu WhatsApp
          </Label>
          <WhatsAppPhoneInput
            id="whatsapp-capture"
            countryCode={countryCode}
            onCountryCodeChange={setCountryCode}
            phone={phone}
            onPhoneChange={setPhone}
            disabled={isSaving}
          />
          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white text-lg py-6 h-auto rounded-full shadow-[0_0_30px_rgba(34,197,94,0.4)] font-semibold"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Guardando...
              </>
            ) : (
              'Guardar y continuar'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppCapturePopup;
