
import { Card } from '@/components/ui/card';

interface InfoCardProps {
  step: number;
  title: string;
  description: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ step, title, description }) => {
  return (
    <Card className="quantum-card p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="w-12 h-12 rounded-full bg-quantum-gradient-soft text-quantum-primary flex items-center justify-center mb-4 mx-auto">
        {step}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
      <p className="text-muted-foreground text-center">
        {description}
      </p>
    </Card>
  );
};

export default InfoCard;
