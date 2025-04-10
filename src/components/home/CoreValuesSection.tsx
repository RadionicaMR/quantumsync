
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import QuantumButton from '@/components/QuantumButton';

interface Value {
  title: string;
  description: string;
}

interface CoreValuesSectionProps {
  values: Value[];
}

const CoreValuesSection = ({ values }: CoreValuesSectionProps) => {
  const navigate = useNavigate();
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="flex justify-center mb-8">
          <QuantumButton 
            className="bg-orange-500 hover:bg-orange-600 text-white glow-orange"
            onClick={() => navigate('/purchase')}
          >
            Adquiere QuantumSync
          </QuantumButton>
        </div>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nuestros Valores Fundamentales</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Estos principios guían todo lo que hacemos en QuantumSync, desde el desarrollo de productos hasta las interacciones con los clientes.
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {values.map((value, index) => (
            <motion.div key={index} variants={item}>
              <Card className="quantum-card p-6 h-full">
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CoreValuesSection;
