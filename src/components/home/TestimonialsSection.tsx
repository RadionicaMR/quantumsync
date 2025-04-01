
import { useState } from 'react';
import { Card } from '@/components/ui/card';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  image: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

const TestimonialsSection = ({ testimonials }: TestimonialsSectionProps) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Lo Que Dicen Nuestros Usuarios</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descubre cómo QuantumSync está transformando vidas en todo el mundo.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${activeTab === index ? 'bg-quantum-primary w-6' : 'bg-quantum-primary/30'}`}
              onClick={() => setActiveTab(index)}
            />
          ))}
        </div>
        
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeTab * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 px-4"
              >
                <Card className="quantum-card p-8 max-w-2xl mx-auto">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-quantum-primary">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{testimonial.name}</h3>
                      <p className="text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-lg italic text-muted-foreground">"{testimonial.content}"</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
