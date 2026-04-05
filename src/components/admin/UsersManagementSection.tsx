import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Trash2, KeyRound, Loader2, Pencil, Save, X } from 'lucide-react';
import { useUsersManagement } from '@/hooks/useUsersManagement';
import { toast } from '@/hooks/use-toast';
import CreateUserDialog from './CreateUserDialog';

const UsersManagementSection = () => {
  const { users, loading, reloadUsers, resetPassword, deleteUser, updateUserName, togglePaymentStatus } = useUsersManagement();
  const [passwordDialog, setPasswordDialog] = useState<{ open: boolean; userId: string; userEmail: string }>({
    open: false,
    userId: '',
    userEmail: ''
  });
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState('');

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    const result = await resetPassword(passwordDialog.userId, newPassword);
    setIsUpdating(false);

    if (result.success) {
      setPasswordDialog({ open: false, userId: '', userEmail: '' });
      setNewPassword('');
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar al usuario ${userEmail}?`)) {
      return;
    }
    await deleteUser(userId);
  };

  const startEditName = (userId: string, currentName: string) => {
    setEditingNameId(userId);
    setEditNameValue(currentName);
  };

  const cancelEditName = () => {
    setEditingNameId(null);
    setEditNameValue('');
  };

  const saveEditName = async (userId: string) => {
    if (!editNameValue.trim()) {
      toast({ title: "Error", description: "El nombre no puede estar vacío", variant: "destructive" });
      return;
    }
    setIsUpdating(true);
    const result = await updateUserName(userId, editNameValue.trim());
    setIsUpdating(false);
    if (result.success) {
      setEditingNameId(null);
      setEditNameValue('');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Card className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Gestión de Usuarios</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Total de usuarios registrados: {users.length}
            </p>
          </div>
          <CreateUserDialog onUserCreated={reloadUsers} />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Pagado</TableHead>
                <TableHead>Trial</TableHead>
                <TableHead>Fecha de Registro</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No hay usuarios registrados
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>
                      {editingNameId === user.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editNameValue}
                            onChange={(e) => setEditNameValue(e.target.value)}
                            className="h-8 max-w-[180px]"
                            disabled={isUpdating}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEditName(user.id);
                              if (e.key === 'Escape') cancelEditName();
                            }}
                          />
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-green-500" onClick={() => saveEditName(user.id)} disabled={isUpdating}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500" onClick={cancelEditName} disabled={isUpdating}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>{user.full_name || '-'}</span>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground" onClick={() => startEditName(user.id, user.full_name || '')}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={user.has_paid}
                        onCheckedChange={() => togglePaymentStatus(user.id, user.has_paid)}
                        disabled={isUpdating}
                      />
                    </TableCell>
                    <TableCell>
                      {(() => {
                        if (user.has_paid) return <Badge variant="default">Pagado</Badge>;
                        if (!user.trial_start_date) return <Badge variant="secondary">Sin trial</Badge>;
                        const trialEnd = new Date(new Date(user.trial_start_date).getTime() + 7 * 24 * 60 * 60 * 1000);
                        const now = new Date();
                        if (now < trialEnd) {
                          const days = Math.ceil((trialEnd.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
                          return <Badge variant="outline" className="text-green-500 border-green-500">{days}d restantes</Badge>;
                        }
                        return <Badge variant="destructive">Expirado</Badge>;
                      })()}
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString('es-AR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPasswordDialog({
                            open: true,
                            userId: user.id,
                            userEmail: user.email
                          })}
                        >
                          <KeyRound className="h-4 w-4 mr-1" />
                          Contraseña
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id, user.email)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          ⚠️ Las contraseñas están protegidas con hash de seguridad y no pueden visualizarse. Solo es posible resetearlas.
        </p>
      </Card>

      <Dialog open={passwordDialog.open} onOpenChange={(open) => {
        if (!open) {
          setPasswordDialog({ open: false, userId: '', userEmail: '' });
          setNewPassword('');
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resetear Contraseña</DialogTitle>
            <DialogDescription>
              Ingresa la nueva contraseña para: {passwordDialog.userEmail}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nueva Contraseña</Label>
              <Input
                id="new-password"
                type="text"
                placeholder="Mínimo 6 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isUpdating}
              />
              <p className="text-xs text-muted-foreground">
                La contraseña será visible aquí antes de guardarla. Una vez guardada, no podrá recuperarse.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPasswordDialog({ open: false, userId: '', userEmail: '' });
                setNewPassword('');
              }}
              disabled={isUpdating}
            >
              Cancelar
            </Button>
            <Button onClick={handleResetPassword} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Actualizando...
                </>
              ) : (
                'Guardar Contraseña'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UsersManagementSection;
