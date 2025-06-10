
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AdminUser, NewUserForm } from '@/types/admin';
import { Affiliate } from '@/types/affiliate';
import { loadUsers, addUser, deleteUser, updateUserPassword, synchronizeAllUsers } from '@/utils/userStorage';
import { loadAffiliates } from '@/utils/affiliateStorage';

export const useAdminData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
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
        loadAllAffiliates();
        
        // Set up an interval to refresh users periodically
        const interval = setInterval(() => {
          loadAllUsers();
          loadAllAffiliates();
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

  // Función para cargar afiliados
  const loadAllAffiliates = async () => {
    try {
      const allAffiliates = loadAffiliates();
      console.log('Afiliados cargados en el panel de admin:', allAffiliates);
      setAffiliates(allAffiliates);
    } catch (error) {
      console.error('Error al cargar afiliados:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los afiliados.",
      });
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

  return {
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
  };
};
