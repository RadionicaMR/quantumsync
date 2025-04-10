
import QuantumButton from '@/components/QuantumButton';
import InfoSection from '@/components/quantum/InfoSection';
import { useNavigate } from 'react-router-dom';

const DiagnosisFooter = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <InfoSection />

      <section className="py-8 md:py-12 px-4 bg-gradient-to-b from-background to-quantum-dark/40">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 holographic-gradient">¿Listo para Profundizar?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-8">
            Después del diagnóstico, pasa a nuestro módulo de tratamiento para abordar cualquier desequilibrio con terapia de frecuencia dirigida.
          </p>
          <QuantumButton 
            className="bg-orange-500 hover:bg-orange-600 text-white glow-orange"
            onClick={() => navigate('/purchase')}
          >
            Adquiere QuantumSync
          </QuantumButton>
        </div>
      </section>
    </>
  );
};

export default DiagnosisFooter;
