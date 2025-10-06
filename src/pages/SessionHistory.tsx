import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Repeat, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Session {
  id: string;
  session_type: string;
  created_at: string;
  patient: {
    name: string;
  };
  session_data: any;
}

const SessionHistory = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email) {
      toast({
        title: 'Error',
        description: 'Debes iniciar sesión',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('sessions')
      .select(`
        id,
        session_type,
        created_at,
        session_data,
        patient:patients(name)
      `)
      .eq('therapist_id', user.email)
      .order('created_at', { ascending: false });

    setLoading(false);

    if (error) {
      console.error('Error loading sessions:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las sesiones',
        variant: 'destructive',
      });
      return;
    }

    setSessions(data || []);
  };

  const getSessionTypeLabel = (type: string) => {
    switch (type) {
      case 'diagnosis':
        return 'Diagnóstico';
      case 'treatment':
        return 'Tratamiento';
      case 'manifestation':
        return 'Manifestación';
      case 'balance_chakras':
        return 'Balance de Chakras';
      default:
        return type;
    }
  };

  const getSessionTypeBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case 'diagnosis':
        return 'default';
      case 'treatment':
        return 'secondary';
      case 'manifestation':
        return 'outline';
      case 'balance_chakras':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const handleRepeatSession = (session: Session) => {
    // Only treatment sessions can be repeated for now
    if (session.session_type === 'treatment') {
      const sessionData = session.session_data;
      // Navigate to treatment page with session data
      navigate('/treat', { 
        state: { 
          repeatSession: true,
          sessionData: {
            frequency: sessionData.frequency,
            duration: sessionData.duration,
            rates: sessionData.rates || [],
            receptorName: sessionData.receptorName,
            preset: sessionData.preset
          }
        } 
      });
      toast({
        title: 'Tratamiento cargado',
        description: 'Los datos del tratamiento han sido cargados',
      });
    }
  };

  const confirmDelete = (sessionId: string) => {
    setSessionToDelete(sessionId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSession = async () => {
    if (!sessionToDelete) return;

    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', sessionToDelete);

    if (error) {
      console.error('Error deleting session:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la sesión',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Sesión eliminada',
        description: 'La sesión ha sido eliminada correctamente',
      });
      // Reload sessions
      loadSessions();
    }

    setDeleteDialogOpen(false);
    setSessionToDelete(null);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <p>Cargando sesiones...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Historial de Sesiones</h1>

        {sessions.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No hay sesiones registradas aún
            </p>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Detalles</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      {format(new Date(session.created_at), 'PPp', {
                        locale: es,
                      })}
                    </TableCell>
                    <TableCell>
                      {session.patient?.name || 'Sin nombre'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getSessionTypeBadgeVariant(session.session_type)}>
                        {getSessionTypeLabel(session.session_type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {JSON.stringify(session.session_data)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {session.session_type === 'treatment' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRepeatSession(session)}
                            title="Repetir tratamiento"
                          >
                            <Repeat className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => confirmDelete(session.id)}
                          title="Eliminar sesión"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar sesión?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. La sesión será eliminada permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteSession}>
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default SessionHistory;
