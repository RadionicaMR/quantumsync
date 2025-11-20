import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AppUser {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  role: 'admin' | 'user';
}

export const useUsersManagement = () => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);

      // Get all profiles with their roles using a single query with JOIN
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          created_at,
          user_roles!inner (role)
        `)
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Transform the data to match our AppUser interface
      const formattedUsers = (usersData || []).map(user => ({
        id: user.id,
        email: user.email,
        full_name: user.full_name || '',
        created_at: user.created_at,
        role: (user.user_roles as any)?.[0]?.role || 'user'
      })) as AppUser[];

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (userId: string, newPassword: string) => {
    try {
      // Call edge function to reset password
      const { data, error } = await supabase.functions.invoke('admin-reset-password', {
        body: { userId, newPassword }
      });

      if (error) throw error;

      toast({
        title: "Contraseña actualizada",
        description: "La contraseña del usuario ha sido actualizada correctamente"
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la contraseña",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Call edge function to delete user
      const { data, error } = await supabase.functions.invoke('admin-delete-user', {
        body: { userId }
      });

      if (error) throw error;

      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado correctamente"
      });

      await loadUsers();
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el usuario",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    loading,
    reloadUsers: loadUsers,
    resetPassword,
    deleteUser
  };
};
