import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Users, TrendingUp, Link } from 'lucide-react';

const AffiliateProgram = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Programa de Afiliados</h1>
          <p className="text-xl text-muted-foreground">
            Gana comisiones recomendando QuantumSync
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="p-6">
            <DollarSign className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">50% de Comisión</h3>
            <p className="text-muted-foreground">
              Gana el 50% en cada venta que generes
            </p>
          </Card>

          <Card className="p-6">
            <Users className="h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Trackeo Automático</h3>
            <p className="text-muted-foreground">
              Sistema de cookies de 30 días para trackear ventas
            </p>
          </Card>

          <Card className="p-6">
            <TrendingUp className="h-12 w-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Dashboard Completo</h3>
            <p className="text-muted-foreground">
              Ve tus estadísticas y comisiones en tiempo real
            </p>
          </Card>
        </div>

        <div className="text-center space-x-4">
          <Button size="lg" onClick={() => navigate('/affiliate-register')}>
            Unirse Ahora
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/affiliate-login')}>
            Ya soy afiliado
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default AffiliateProgram;
