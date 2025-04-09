
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { AdminUser, NewUserForm } from '@/types/admin';
import { loadUsers, addUser, deleteUser, updateUserPassword } from '@/utils/userStorage';
import AdminHeader from '@/components/admin/AdminHeader';
import AddUserForm from '@/components/admin/AddUserForm';
import UsersTable from '@/components/admin/UsersTable';

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Load data and check authentication
  useEffect(() => {
    // Check if the user is authenticated and is an admin
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser && parsedUser.isAdmin) {
        setUser(parsedUser);
        // Load users
        setUsers(loadUsers());
        
        // Set up an interval to refresh users periodically
        const interval = setInterval(() => {
          setUsers(loadUsers());
        }, 30000); // Reload every 30 seconds
        
        return () => clearInterval(interval);
      } else {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleAddUser = (newUserData: NewUserForm) => {
    // Check if the email already exists
    if (users.some(user => user.email === newUserData.email)) {
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
    const updatedUsers = loadUsers();
    setUsers(updatedUsers);
    
    toast({
      title: "Lista de usuarios actualizada",
      description: `Se han actualizado los usuarios. Total: ${updatedUsers.length}`,
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
          onLogout={handleLogout} 
          onSync={syncRegisteredUsers} 
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
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

            <UsersTable 
              users={users}
              onDeleteUser={handleDeleteUser}
              onUpdatePassword={handleUpdatePassword}
            />
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Admin;
