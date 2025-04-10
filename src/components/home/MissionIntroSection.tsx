
import { useNavigate } from 'react-router-dom';
import QuantumButton from '@/components/QuantumButton';

const MissionIntroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto text-center">
        <div className="flex justify-center mb-8">
          <QuantumButton 
            className="bg-orange-500 hover:bg-orange-600 text-white glow-orange"
            onClick={() => navigate('/purchase')}
          >
            Adquiere QuantumSync
          </QuantumButton>
        </div>
        <h2 className="text-3xl font-bold mb-4">Nuestra Misión y Visión</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          En QuantumSync, estamos dedicados a hacer que el bienestar energético sea accesible para todos a través de tecnología innovadora.
        </p>
      </div>
    </section>
  );
};

export default MissionIntroSection;
