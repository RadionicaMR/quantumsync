
import { Card } from '@/components/ui/card';

interface BenefitItem {
  title: string;
  description: string;
}

interface BenefitsSectionProps {
  benefitItems: BenefitItem[];
}

const BenefitsSection = ({ benefitItems }: BenefitsSectionProps) => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Experimenta Beneficios Reales</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            QuantumSync ofrece mejoras tangibles en múltiples áreas de tu vida.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefitItems.map((benefit, index) => (
            <Card key={index} className="quantum-card p-6">
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
