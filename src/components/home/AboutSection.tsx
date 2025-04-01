
import { useNavigate } from 'react-router-dom';
import QuantumButton from '@/components/QuantumButton';

const AboutSection = () => {
  const navigate = useNavigate();
  
  return (
    <section id="about-section" className="py-16 px-4 bg-quantum-gradient-soft">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Acerca de QuantumSync</h2>
            <div className="quantum-divider w-24 my-4"></div>
            <p className="text-muted-foreground mb-6">
              QuantumSync es más que una empresa de tecnología; somos un equipo comprometido con hacer que el bienestar sea accesible para todos. Combinamos innovación de vanguardia con principios espirituales para crear soluciones que impacten positivamente en la vida de las personas.
            </p>
            <p className="text-muted-foreground mb-6">
              Nuestra esencia radica en integrar tecnología avanzada con conocimientos tradicionales y modernos sobre energía y vibraciones. Sabemos que la energía es la base de todo en el universo, y QuantumSync te da la oportunidad de conectarte con ella de manera práctica y efectiva.
            </p>
            <QuantumButton onClick={() => navigate('/about')}>Conoce Nuestra Misión</QuantumButton>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-quantum-primary/10 rounded-full animate-pulse-soft"></div>
            <div className="relative z-10 bg-white dark:bg-card p-4 rounded-xl shadow-xl">
              <img 
                src="/lovable-uploads/f0fbc21d-ae7c-473e-81d3-25a02ad82bc1.png" 
                alt="Energía cuántica y balance energético" 
                className="rounded-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
