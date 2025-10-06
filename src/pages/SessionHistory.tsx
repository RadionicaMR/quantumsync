import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
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
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
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
      .eq('therapist_id', user.id)
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default SessionHistory;
