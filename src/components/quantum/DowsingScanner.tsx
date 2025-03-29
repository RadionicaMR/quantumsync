
import { Card } from '@/components/ui/card';
import QuantumButton from '@/components/QuantumButton';

const DowsingScanner = () => {
  return (
    <Card className="quantum-card p-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-4">Escáner Completo de Campo Energético</h3>
        <p className="text-muted-foreground mb-8">
          El escáner energético avanzado utiliza principios radiónicos para proporcionar una evaluación integral de todo tu campo energético.
        </p>
        
        <div className="relative w-64 h-64 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-quantum-primary/20 animate-spin-slow"></div>
          <div className="absolute inset-4 rounded-full border-4 border-dashed border-quantum-primary/30 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '6s' }}></div>
          <div className="absolute inset-8 rounded-full border-4 border-dashed border-quantum-primary/40 animate-spin-slow"></div>
          <div className="absolute inset-12 rounded-full border-4 border-dashed border-quantum-primary/50 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '4s' }}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-quantum-primary font-bold text-lg">Próximamente</div>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-4">
          Nuestro escáner avanzado está actualmente en desarrollo y estará disponible en la próxima actualización.
        </p>
        
        <QuantumButton disabled>Recibir Notificación cuando esté Disponible</QuantumButton>
      </div>
    </Card>
  );
};

export default DowsingScanner;
