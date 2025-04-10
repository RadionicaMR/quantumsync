
import { useNavigate } from 'react-router-dom';
import QuantumButton from '@/components/QuantumButton';

const CTASection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 px-4 bg-quantum-gradient text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">¿Listo para Transformar Tu Vida?</h2>
        <p className="max-w-2xl mx-auto mb-8 text-white/80">
          Descarga QuantumSync hoy y comienza tu viaje hacia un mejor bienestar, energía equilibrada y nuevas posibilidades.
        </p>
        <div className="flex justify-center">
          <QuantumButton 
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white glow-orange"
            onClick={() => navigate('/purchase')}
          >
            Adquiere QuantumSync
          </QuantumButton>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
