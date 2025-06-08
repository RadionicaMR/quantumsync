
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import QuantumButton from '@/components/QuantumButton';

const Affiliate = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Programa de Afiliados</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <p className="mb-6 text-lg">
              Únete a nuestro programa de afiliados y gana comisiones refiriendo nuevos usuarios a QuantumSync.
            </p>
            
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">Beneficios del Programa</h2>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  30% de comisión por cada venta
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Enlaces personalizados para tracking
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Dashboard con estadísticas en tiempo real
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Materiales de marketing exclusivos
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Soporte personalizado
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white dark:bg-card p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">¿Cómo funciona?</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 mt-1">1</div>
                <div>
                  <h4 className="font-medium">Regístrate</h4>
                  <p className="text-sm text-muted-foreground">Completa el formulario de registro y espera la aprobación</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 mt-1">2</div>
                <div>
                  <h4 className="font-medium">Promociona</h4>
                  <p className="text-sm text-muted-foreground">Usa tus enlaces personalizados para promover QuantumSync</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 mt-1">3</div>
                <div>
                  <h4 className="font-medium">Gana</h4>
                  <p className="text-sm text-muted-foreground">Recibe 30% de comisión por cada usuario que se registre</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center space-y-4">
          <QuantumButton 
            className="bg-quantum-primary text-white px-8 py-3 rounded-full mr-4"
            onClick={() => navigate('/affiliate-register')}
          >
            Aplicar como Afiliado
          </QuantumButton>
          
          <QuantumButton 
            className="bg-gray-500 text-white px-8 py-3 rounded-full"
            onClick={() => navigate('/affiliate-dashboard')}
          >
            Acceder al Dashboard
          </QuantumButton>
        </div>
      </div>
    </Layout>
  );
};

export default Affiliate;
