
import { useNavigate } from 'react-router-dom';
import QuantumButton from '@/components/QuantumButton';

const AffiliateSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 px-4 bg-quantum-gradient-soft">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Únete a Nuestro Programa de Afiliados</h2>
            <div className="quantum-divider w-24 my-4"></div>
            <p className="text-muted-foreground mb-6">
              QuantumSync no es solo una herramienta para transformar tu vida, sino también una oportunidad para generar ingresos. Nuestro plan de compensación está diseñado para recompensar tus esfuerzos en la promoción de la aplicación, creando un modelo justo y escalable.
            </p>
            <QuantumButton onClick={() => navigate('/affiliate')}>Conviértete en Afiliado (MUY PRONTO)</QuantumButton>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-quantum-primary/10 rounded-full animate-pulse-soft"></div>
            <div className="relative z-10 bg-white dark:bg-card p-4 rounded-xl shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1513682121497-80211f36a7d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                alt="Persona feliz ganando dinero" 
                className="rounded-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AffiliateSection;
