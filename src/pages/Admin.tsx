
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { AdminUser, NewUserForm } from '@/types/admin';
import { loadUsers, addUser, deleteUser, updateUserPassword, synchronizeAllUsers } from '@/utils/userStorage';
import AdminHeader from '@/components/admin/AdminHeader';
import AddUserForm from '@/components/admin/AddUserForm';
import UsersTable from '@/components/admin/UsersTable';

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Load data and check authentication
  useEffect(() => {
    // Check if the user is authenticated and is an admin
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser && parsedUser.isAdmin) {
        setUser(parsedUser);
        // Cargamos los usuarios inmediatamente
        loadAllUsers();
        
        // Set up an interval to refresh users periodically
        const interval = setInterval(() => {
          loadAllUsers();
        }, 30000); // Reload every 30 seconds
        
        return () => clearInterval(interval);
      } else {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Función dedicada para cargar usuarios
  const loadAllUsers = async () => {
    setLoading(true);
    try {
      const allUsers = synchronizeAllUsers();
      console.log('Usuarios cargados en el panel de admin:', allUsers);
      setUsers(allUsers);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los usuarios.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleAddUser = (newUserData: NewUserForm) => {
    // Check if the email already exists
    if (users.some(user => user.email.toLowerCase() === newUserData.email.toLowerCase())) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Este correo electrónico ya está registrado",
      });
      return;
    }
    
    const updatedUsers = addUser(users, newUserData);
    setUsers(updatedUsers);
    
    toast({
      title: "Usuario agregado",
      description: `El usuario ${newUserData.name} ha sido creado exitosamente`,
    });
    
    setShowAddForm(false);
  };

  const handleDeleteUser = (id: string) => {
    const updatedUsers = deleteUser(users, id);
    setUsers(updatedUsers);
    
    toast({
      title: "Usuario eliminado",
      description: "El usuario ha sido eliminado exitosamente",
    });
  };

  const handleUpdatePassword = (userId: string, newPassword: string) => {
    const updatedUsers = updateUserPassword(users, userId, newPassword);
    setUsers(updatedUsers);
  };

  const syncRegisteredUsers = () => {
    loadAllUsers();
    
    toast({
      title: "Lista de usuarios actualizada",
      description: `Se han actualizado los usuarios. Total: ${users.length}`,
    });
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <Layout>
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
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="users">Gestión de Usuarios</TabsTrigger>
              <TabsTrigger value="affiliates">Gestión de Afiliados</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users">
              <Card className="p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold">Gestión de Usuarios</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Total de usuarios: {users.length}
                    </p>
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-blue-500 flex items-center gap-2"
                    onClick={() => setShowAddForm(true)}
                    disabled={showAddForm}
                  >
                    <Plus size={16} />
                    Añadir Usuario
                  </Button>
                </div>

                {showAddForm && (
                  <AddUserForm 
                    onAddUser={handleAddUser}
                    onCancel={() => setShowAddForm(false)}
                  />
                )}
                
                {loading ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <UsersTable 
                    users={users}
                    onDeleteUser={handleDeleteUser}
                    onUpdatePassword={handleUpdatePassword}
                  />
                )}
              </Card>
            </TabsContent>
            
            <TabsContent value="affiliates">
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold">Gestión de Afiliados</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Administrar solicitudes y comisiones de afiliados
                    </p>
                  </div>
                </div>
                
                <div className="text-center py-8 text-muted-foreground">
                  <p>Panel de gestión de afiliados implementado</p>
                  <p className="text-sm mt-2">
                    Aquí podrás aprobar solicitudes, ver estadísticas y gestionar comisiones
                  </p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Admin;
