
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { useAdminData } from '@/hooks/useAdminData';
import AdminHeader from './AdminHeader';
import UsersManagementTab from './UsersManagementTab';
import AffiliatesManagementTab from './AffiliatesManagementTab';
import AffiliateStatsTab from './AffiliateStatsTab';

const AdminDashboard = () => {
  const {
    user,
    users,
    affiliates,
    loading,
    handleLogout,
    handleAddUser,
    handleDeleteUser,
    handleUpdatePassword,
    syncRegisteredUsers,
    loadAllAffiliates
  } = useAdminData();

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <AdminHeader 
        userName={user.name} 
        userCount={users.length}
        onLogout={handleLogout} 
        onSync={syncRegisteredUsers} 
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="users">Gestión de Usuarios</TabsTrigger>
            <TabsTrigger value="affiliates">Gestión de Afiliados</TabsTrigger>
            <TabsTrigger value="affiliate-stats">Estadísticas de Afiliados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <UsersManagementTab
              users={users}
              loading={loading}
              onAddUser={handleAddUser}
              onDeleteUser={handleDeleteUser}
              onUpdatePassword={handleUpdatePassword}
            />
          </TabsContent>
          
          <TabsContent value="affiliates">
            <AffiliatesManagementTab
              affiliates={affiliates}
              onAffiliateUpdate={loadAllAffiliates}
            />
          </TabsContent>
          
          <TabsContent value="affiliate-stats">
            <AffiliateStatsTab
              onAffiliateUpdate={loadAllAffiliates}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
