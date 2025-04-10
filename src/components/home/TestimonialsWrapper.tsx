
import { useNavigate } from 'react-router-dom';
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
        <TestimonialsSection testimonials={testimonials} />
      </div>
    </section>
  );
};

export default TestimonialsWrapper;
