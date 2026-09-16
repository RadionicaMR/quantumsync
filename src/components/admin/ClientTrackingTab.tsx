import { useEffect, useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MessageCircle, Search, Loader2, RefreshCw, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getSubscriptionInfo } from '@/utils/subscription';

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  whatsapp_phone: string | null;
  trial_start_date: string | null;
  has_paid: boolean | null;
  created_at: string | null;
  subscription_start_date: string | null;
}

interface SessionAgg {
  total: number;
  completas: number;
  incompletas: number;
  lastSession: string | null;
}

const TRIAL_DAYS = 7;

const ClientTrackingTab = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [sessionsByEmail, setSessionsByEmail] = useState<Record<string, SessionAgg>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [profilesRes, sessionsRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, full_name, email, whatsapp_phone, trial_start_date, has_paid, created_at, subscription_start_date')
          .order('created_at', { ascending: false }),
        supabase
          .from('sessions')
          .select('therapist_id, status, created_at'),
      ]);

      if (profilesRes.data) setProfiles(profilesRes.data as Profile[]);

      if (sessionsRes.data) {
        const agg: Record<string, SessionAgg> = {};
        (sessionsRes.data as { therapist_id: string; status: string; created_at: string }[]).forEach((s) => {
          const key = s.therapist_id;
          if (!agg[key]) agg[key] = { total: 0, completas: 0, incompletas: 0, lastSession: null };
          agg[key].total += 1;
          if (s.status === 'completa') agg[key].completas += 1;
          else agg[key].incompletas += 1;
          if (!agg[key].lastSession || s.created_at > agg[key].lastSession!) {
            agg[key].lastSession = s.created_at;
          }
        });
        setSessionsByEmail(agg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getTrialInfo = (p: Profile) => {
    if (p.has_paid) {
      return { label: 'Pagado', variant: 'default' as const, icon: CheckCircle2, day: null };
    }
    if (!p.trial_start_date) {
      return { label: 'Sin prueba', variant: 'secondary' as const, icon: Clock, day: null };
    }
    const start = new Date(p.trial_start_date).getTime();
    const day = Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24)) + 1;
    if (day > TRIAL_DAYS) {
      return { label: `Prueba vencida (día ${day})`, variant: 'destructive' as const, icon: XCircle, day };
    }
    return { label: `Prueba día ${day}/${TRIAL_DAYS}`, variant: 'outline' as const, icon: Clock, day };
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return profiles;
    return profiles.filter(
      (p) =>
        (p.full_name || '').toLowerCase().includes(q) ||
        (p.email || '').toLowerCase().includes(q) ||
        (p.whatsapp_phone || '').toLowerCase().includes(q)
    );
  }, [profiles, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold">Seguimiento de Clientes</h2>
          <p className="text-sm text-muted-foreground">
            Progreso en la prueba, WhatsApp y sesiones realizadas por cada cliente.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, email o WhatsApp..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full sm:w-72"
            />
          </div>
          <Button variant="outline" size="icon" onClick={loadData} title="Actualizar">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Estado de Prueba</TableHead>
              <TableHead>Suscripción</TableHead>
              <TableHead className="text-center">Sesiones</TableHead>
              <TableHead className="text-center">Completas</TableHead>
              <TableHead className="text-center">Incompletas</TableHead>
              <TableHead>Última sesión</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => {
              const trial = getTrialInfo(p);
              const sessions = sessionsByEmail[p.email || ''] || { total: 0, completas: 0, incompletas: 0, lastSession: null };
              const TrialIcon = trial.icon;
              const waNumber = (p.whatsapp_phone || '').replace(/\D/g, '');
              return (
                <TableRow key={p.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{p.full_name || '—'}</p>
                      <p className="text-xs text-muted-foreground">{p.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {waNumber ? (
                      <a
                        href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hola ${p.full_name || ''}, te escribo de QuantumSync.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-green-500 hover:text-green-400 hover:underline"
                      >
                        <MessageCircle className="h-4 w-4" />
                        {p.whatsapp_phone}
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">Sin número</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={trial.variant} className="inline-flex items-center gap-1">
                      <TrialIcon className="h-3 w-3" />
                      {trial.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const sub = getSubscriptionInfo(p.has_paid, p.subscription_start_date);
                      if (!sub) return <span className="text-muted-foreground text-sm">—</span>;
                      const color = sub.expired
                        ? 'text-red-500'
                        : sub.daysRemaining <= 30
                        ? 'text-amber-500'
                        : 'text-green-500';
                      return (
                        <div className="whitespace-nowrap">
                          <p className={`text-sm font-medium ${color}`}>{sub.label}</p>
                          <p className="text-xs text-muted-foreground">{sub.sublabel}</p>
                        </div>
                      );
                    })()}
                  </TableCell>
                  <TableCell className="text-center font-semibold">{sessions.total}</TableCell>
                  <TableCell className="text-center text-green-500">{sessions.completas}</TableCell>
                  <TableCell className="text-center text-orange-500">{sessions.incompletas}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {sessions.lastSession
                      ? new Date(sessions.lastSession).toLocaleDateString('es-AR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '—'}
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No se encontraron clientes.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default ClientTrackingTab;
