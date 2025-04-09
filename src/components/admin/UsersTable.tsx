
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Eye, EyeOff, Edit, Save, X } from 'lucide-react';
import { AdminUser } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';

interface UsersTableProps {
  users: AdminUser[];
  onDeleteUser: (id: string) => void;
  onUpdatePassword: (id: string, newPassword: string) => void;
}

const UsersTable = ({ users, onDeleteUser, onUpdatePassword }: UsersTableProps) => {
  const { toast } = useToast();
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const startPasswordEdit = (userId: string) => {
    setEditingUser(userId);
    const user = users.find(u => u.id === userId);
    if (user) {
      setNewPassword(user.password);
    }
  };

  const saveNewPassword = (userId: string) => {
    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
      });
      return;
    }

    onUpdatePassword(userId, newPassword);
    setEditingUser(null);
    setNewPassword('');

    toast({
      title: "Contraseña actualizada",
      description: "La contraseña ha sido actualizada exitosamente",
    });
  };

  const cancelPasswordEdit = () => {
    setEditingUser(null);
    setNewPassword('');
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contraseña</TableHead>
            <TableHead>Fecha Creación</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No hay usuarios registrados
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {editingUser === user.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="max-w-[150px]"
                      />
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-green-500"
                        onClick={() => saveNewPassword(user.id)}
                      >
                        <Save size={16} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-red-500"
                        onClick={cancelPasswordEdit}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>{showPasswords[user.id] ? user.password : '********'}</span>
                      <Button 
                        size="sm"
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-muted-foreground"
                        onClick={() => togglePasswordVisibility(user.id)}
                      >
                        {showPasswords[user.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                      <Button 
                        size="sm"
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-blue-500"
                        onClick={() => startPasswordEdit(user.id)}
                      >
                        <Edit size={16} />
                      </Button>
                    </div>
                  )}
                </TableCell>
                <TableCell>{user.dateCreated}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => onDeleteUser(user.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
