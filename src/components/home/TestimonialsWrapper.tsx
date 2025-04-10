
import { useNavigate } from 'react-router-dom';
import QuantumButton from '@/components/QuantumButton';
import TestimonialsSection from '@/components/home/TestimonialsSection';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  image: string;
}

interface TestimonialsWrapperProps {
  testimonials: Testimonial[];
}

const TestimonialsWrapper = ({ testimonials }: TestimonialsWrapperProps) => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 px-4 bg-quantum-gradient-soft">
      <div className="container mx-auto">
        <div className="flex justify-center mb-8">
          <QuantumButton 
            className="bg-orange-500 hover:bg-orange-600 text-white glow-orange"
            size="lg"
            onClick={() => navigate('/purchase')}
          >
            Adquiere QuantumSync
          </QuantumButton>
        </div>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Lo que Dicen Nuestros Usuarios</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descubre cómo QuantumSync ha transformado la vida de personas de diferentes ámbitos.
          </p>
        </div>
        
        <TestimonialsSection testimonials={testimonials} />
      </div>
    </section>
  );
};

export default TestimonialsWrapper;
