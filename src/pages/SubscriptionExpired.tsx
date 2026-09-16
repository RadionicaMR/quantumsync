import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageCircle, CalendarClock } from 'lucide-react';

const WHATSAPP_NUMBER = '542945581188';

const SubscriptionExpired = () => {
  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hola, quiero renovar mi suscripción anual de QuantumSync.');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Card className="max-w-lg w-full p-8 text-center bg-black/40 border-purple-500/30">
          <CalendarClock className="h-12 w-12 mx-auto text-amber-400 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-3">Tu suscripción ha finalizado</h1>
          <p className="text-purple-200/80 mb-6">
            Tu año de acceso a QuantumSync llegó a su fin. Escribime por WhatsApp para renovar tu
            suscripción y reactivar el acceso completo a la plataforma.
          </p>
          <Button
            onClick={handleWhatsApp}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white text-lg py-6 h-auto rounded-full font-semibold"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Renovar por WhatsApp
          </Button>
        </Card>
      </div>
    </Layout>
  );
};

export default SubscriptionExpired;
