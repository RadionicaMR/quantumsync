
import { useNavigate } from 'react-router-dom';
import QuantumButton from '@/components/QuantumButton';

const CompanyDescriptionSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">La Historia de QuantumSync</h2>
            <div className="quantum-divider w-24 my-4"></div>
            <p className="text-muted-foreground mb-6">
              QuantumSync es más que una empresa tecnológica; somos un equipo comprometido con hacer que el bienestar sea accesible para todos. Combinamos innovación de vanguardia con principios espirituales para crear soluciones que impacten positivamente en la vida de las personas.
            </p>
            <p className="text-muted-foreground mb-6">
              Nuestra esencia radica en integrar tecnología avanzada con conocimientos tradicionales y modernos sobre energía y vibraciones. Sabemos que la energía es la base de todo en el universo, y QuantumSync te da la oportunidad de conectarte con ella de manera práctica y efectiva.
            </p>
            <p className="text-muted-foreground mb-6">
              Con una visión global, buscamos llevar nuestra propuesta de bienestar a millones de personas en todo el mundo. Nuestro compromiso es ofrecer herramientas tecnológicas fáciles de usar, respaldadas científicamente y, sobre todo, útiles para cualquier persona, independientemente de su nivel de conocimiento previo.
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-quantum-primary/10 rounded-full animate-pulse-soft"></div>
            <div className="relative z-10 bg-white dark:bg-card p-4 rounded-xl shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                alt="Tecnología QuantumSync" 
                className="rounded-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyDescriptionSection;
