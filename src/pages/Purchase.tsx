import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowRight, CreditCard, Map } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

const Purchase = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { trackPurchasePageVisit, trackPaymentClick } = useAnalytics();

  useEffect(() => {
    trackPurchasePageVisit();
  }, [trackPurchasePageVisit]);

  const handlePaymentClick = (option: string) => {
    trackPaymentClick(option === 'argentina' ? 'mercadopago' : 'paypal');
    setSelectedOption(option);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (selectedOption === 'argentina') {
      window.location.href = 'https://mpago.la/2oUZRbt';
    } else if (selectedOption === 'internacional') {
      window.location.href = 'https://www.paypal.com/ncp/payment/4J3UP5EQVBRCW';
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setSelectedOption(null);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        {!showConfirm ? (
          <>
            <div className="text-center mb-16">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-4 holographic-gradient"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Adquiere QuantumSync
              </motion.h1>
              <motion.p 
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Elige tu método de pago preferido según tu ubicación y comienza a transformar tu energía hoy mismo.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="overflow-hidden h-full">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
                    <Map className="h-16 w-16 text-white mb-2" />
                    <h2 className="text-2xl font-bold text-white">Soy de Argentina</h2>
                    <p className="text-white/80 mb-2">Pago a través de Mercado Pago</p>
                    <p className="text-white font-semibold text-lg">Membresía Anual $157.000</p>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <ArrowRight className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span>Acepta todas las tarjetas de crédito y débito</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span>Transferencia bancaria</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span>Pago en efectivo mediante Rapipago o Pago Fácil</span>
                      </li>
                    </ul>
                    <Button 
                      className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium"
                      onClick={() => handlePaymentClick('argentina')}
                    >
                      <CreditCard className="mr-2 h-5 w-5" />
                      Pagar con Mercado Pago
                    </Button>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Card className="overflow-hidden h-full">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-4">
                    <Map className="h-16 w-16 text-white mb-2" />
                    <h2 className="text-2xl font-bold text-white">Fuera de Argentina</h2>
                    <p className="text-white/80 mb-2">Pago a través de PayPal</p>
                    <p className="text-white font-semibold text-lg">Membresía Anual us$ 129</p>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <ArrowRight className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span>Acepta todas las tarjetas de crédito y débito</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span>Saldo PayPal</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span>Disponible en todos los países</span>
                      </li>
                    </ul>
                    <Button 
                      className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium"
                      onClick={() => handlePaymentClick('internacional')}
                    >
                      <CreditCard className="mr-2 h-5 w-5" />
                      Pagar con PayPal
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </div>
          </>
        ) : (
          <motion.div 
            className="max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Confirmar redirección</h2>
              <p className="mb-6 text-muted-foreground">
                {selectedOption === 'argentina' 
                  ? "Vas a ser dirigido a una página de pago de MercadoPago Argentina. Si al finalizar el pago no eres redirigido automaticamente a la pagina de registro, comunícate con nosotros al email: quantumsyncdigital@gmail.com, y rápidamente estaremos en contacto contigo."
                  : "Vas a ser dirigido a una página de pago de Paypal. Si al finalizar el pago no eres redirigido automaticamente a la pagina de registro, comunícate con nosotros al email: quantumsyncdigital@gmail.com, y rápidamente estaremos en contacto contigo."
                }
              </p>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-500"
                  onClick={handleConfirm}
                >
                  Continuar
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Purchase;
