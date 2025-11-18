import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useAdminData } from '@/hooks/useAdminData';
import { useNavigate } from 'react-router-dom';
import { Users, DollarSign, TrendingUp, LogOut, ShoppingCart } from 'lucide-react';
import AffiliatesManagementTab from './AffiliatesManagementTab';
import AffiliateStatsTab from './AffiliateStatsTab';
import SalesManagementTab from './SalesManagementTab';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { adminData, affiliates, sales, loading, reloadData } = useAdminData();

  const handleLogout = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-muted-foreground mt-1">Gestión del Programa de Afiliados</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Usuarios</p>
              <p className="text-2xl font-bold">{adminData.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Afiliados</p>
              <p className="text-2xl font-bold">{adminData.totalAffiliates}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Ventas</p>
              <p className="text-2xl font-bold">{sales.length}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ingresos Totales</p>
              <p className="text-2xl font-bold">${adminData.totalRevenue.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Tabs defaultValue="sales" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="sales">Gestión de Ventas</TabsTrigger>
            <TabsTrigger value="affiliates">Gestión de Afiliados</TabsTrigger>
            <TabsTrigger value="affiliate-stats">Estadísticas Globales</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales">
            <SalesManagementTab
              sales={sales}
              onSaleUpdate={reloadData}
            />
          </TabsContent>
          
          <TabsContent value="affiliates">
            <AffiliatesManagementTab
              affiliates={affiliates}
              onAffiliateUpdate={reloadData}
            />
          </TabsContent>
          
          <TabsContent value="affiliate-stats">
            <AffiliateStatsTab
              onAffiliateUpdate={reloadData}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
