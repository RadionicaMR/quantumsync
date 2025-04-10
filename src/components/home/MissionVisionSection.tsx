
import QuantumButton from '@/components/QuantumButton';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';

const MissionVisionSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 px-4 bg-quantum-gradient-soft">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="quantum-card p-8">
            <h2 className="text-2xl font-bold mb-4">Nuestra Misión</h2>
            <div className="quantum-divider w-16 my-4"></div>
            <p className="text-muted-foreground mb-6">
              La misión de QuantumSync es clara: hacer que el equilibrio energético y el bienestar personal sean accesibles a través de tecnología avanzada y fácil de usar. Queremos que cualquier persona, desde cualquier lugar del mundo, pueda acceder a herramientas que antes eran exclusivas de especialistas.
            </p>
            <p className="text-muted-foreground">
              Creemos que las herramientas energéticas deben democratizarse, permitiendo a todos tomar el control de su propio bienestar sin requerir años de entrenamiento especializado.
            </p>
          </div>
          <div className="quantum-card p-8">
            <h2 className="text-2xl font-bold mb-4">Nuestra Visión</h2>
            <div className="quantum-divider w-16 my-4"></div>
            <p className="text-muted-foreground mb-6">
              Nuestra visión es convertirnos en líderes globales en soluciones digitales para el bienestar energético. Esto significa no solo crear una aplicación innovadora, sino también desarrollar una comunidad global que valore el impacto positivo de la energía en sus vidas.
            </p>
            <p className="text-muted-foreground">
              Visualizamos un mundo donde las herramientas energéticas sean tan comunes como las aplicaciones de fitness, donde las personas mantengan rutinariamente su salud energética junto con su bienestar físico y mental.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;
