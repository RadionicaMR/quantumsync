
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 px-4 bg-quantum-gradient text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">¿Listo para Transformar Tu Vida?</h2>
        <p className="max-w-2xl mx-auto mb-8 text-white/80">
          Descarga QuantumSync hoy y comienza tu viaje hacia un mejor bienestar, energía equilibrada y nuevas posibilidades.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            className="bg-orange-500 text-white font-medium px-6 py-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors glow-orange"
            onClick={() => navigate('/purchase')}
          >
            Adquiere QuantumSync
          </button>
          <button 
            className="border-2 border-white text-white font-medium px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => navigate('/about')}
          >
            Saber Más
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
