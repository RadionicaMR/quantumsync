
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AdminUser, NewUserForm } from '@/types/admin';
import AddUserForm from './AddUserForm';
import UsersTable from './UsersTable';

interface UsersManagementTabProps {
  users: AdminUser[];
  loading: boolean;
  onAddUser: (userData: NewUserForm) => void;
  onDeleteUser: (id: string) => void;
  onUpdatePassword: (userId: string, newPassword: string) => void;
}

const UsersManagementTab = ({
  users,
  loading,
  onAddUser,
  onDeleteUser,
  onUpdatePassword
}: UsersManagementTabProps) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddUser = (userData: NewUserForm) => {
    onAddUser(userData);
    setShowAddForm(false);
  };

  return (
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
          onDeleteUser={onDeleteUser}
          onUpdatePassword={onUpdatePassword}
        />
      )}
    </Card>
  );
};

export default UsersManagementTab;
