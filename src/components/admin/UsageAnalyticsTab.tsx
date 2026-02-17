import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfDay, endOfDay, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  CalendarIcon, Activity, Users, Clock, BarChart3, Target, Download,
  TrendingUp, Zap, Brain, Heart, Sparkles
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell
} from 'recharts';

interface UsageEvent {
  id: string;
  user_hash: string;
  event_type: string;
  module: string;
  protocol_name: string | null;
  is_preset: boolean | null;
  configured_duration: number | null;
  actual_duration: number | null;
  frequency: number | null;
  diagnosis_area: string | null;
  diagnosis_result: unknown;
  metadata: unknown;
  created_at: string;
}

type DateRangePreset = '7d' | '30d' | '90d' | 'custom';
type ModuleFilter = 'all' | 'treatment' | 'manifestation' | 'diagnosis' | 'balance_chakras';

const MODULE_LABELS: Record<string, string> = {
  treatment: 'Tratamiento',
  manifestation: 'Manifestación',
  diagnosis: 'Diagnóstico',
  balance_chakras: 'Balance Chakras',
};

const MODULE_ICONS: Record<string, React.ReactNode> = {
  treatment: <Zap className="h-4 w-4" />,
  manifestation: <Sparkles className="h-4 w-4" />,
  diagnosis: <Brain className="h-4 w-4" />,
  balance_chakras: <Heart className="h-4 w-4" />,
};

const COLORS = ['hsl(var(--primary))', '#8b5cf6', '#f97316', '#22c55e', '#ef4444', '#06b6d4'];

const UsageAnalyticsTab = () => {
  const [events, setEvents] = useState<UsageEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRangePreset>('30d');
  const [moduleFilter, setModuleFilter] = useState<ModuleFilter>('all');
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
    if (dateRange === '7d') setStartDate(subDays(new Date(), 7));
    else if (dateRange === '30d') setStartDate(subDays(new Date(), 30));
    else if (dateRange === '90d') setStartDate(subDays(new Date(), 90));
    setEndDate(new Date());
  }, [dateRange]);

  useEffect(() => {
    fetchEvents();
  }, [startDate, endDate]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('usage_events')
        .select('*')
        .gte('created_at', startOfDay(startDate).toISOString())
        .lte('created_at', endOfDay(endDate).toISOString())
        .order('created_at', { ascending: true });
      if (error) throw error;
      setEvents((data as UsageEvent[]) || []);
    } catch (error) {
      console.error('Error fetching usage events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (moduleFilter === 'all') return events;
    return events.filter(e => e.module === moduleFilter);
  }, [events, moduleFilter]);

  // ── Computed stats ──
  const stats = useMemo(() => {
    const sessions = filtered.filter(e => e.event_type === 'session_start');
    const sessionEnds = filtered.filter(e => e.event_type === 'session_end');
    const diagnoses = filtered.filter(e => e.event_type === 'diagnosis_run');
    const uniqueUsers = new Set(filtered.map(e => e.user_hash)).size;
    
    // Average duration from session_end events
    const durations = sessionEnds.filter(e => e.actual_duration && e.actual_duration > 0).map(e => e.actual_duration!);
    const avgDuration = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;

    // Sessions per user
    const userSessionCounts: Record<string, number> = {};
    sessions.forEach(s => {
      userSessionCounts[s.user_hash] = (userSessionCounts[s.user_hash] || 0) + 1;
    });
    const avgSessionsPerUser = uniqueUsers > 0 ? (sessions.length / uniqueUsers).toFixed(1) : '0';
    const recurringUsers = Object.values(userSessionCounts).filter(c => c > 1).length;
    const recurringRate = uniqueUsers > 0 ? ((recurringUsers / uniqueUsers) * 100).toFixed(1) : '0';

    return {
      totalSessions: sessions.length,
      totalDiagnoses: diagnoses.length,
      uniqueUsers,
      avgDuration,
      avgSessionsPerUser,
      recurringRate,
    };
  }, [filtered]);

  // ── Top protocols ──
  const topProtocols = useMemo(() => {
    const counts: Record<string, { count: number; module: string; isPreset: boolean }> = {};
    filtered.filter(e => e.event_type === 'session_start').forEach(e => {
      const name = e.protocol_name || 'Sin nombre';
      if (!counts[name]) counts[name] = { count: 0, module: e.module, isPreset: !!e.is_preset };
      counts[name].count++;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .map(([name, data]) => ({ name, ...data }));
  }, [filtered]);

  // ── Module distribution (pie) ──
  const moduleDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.filter(e => e.event_type === 'session_start' || e.event_type === 'diagnosis_run').forEach(e => {
      counts[e.module] = (counts[e.module] || 0) + 1;
    });
    return Object.entries(counts).map(([module, value]) => ({
      name: MODULE_LABELS[module] || module,
      value,
    }));
  }, [filtered]);

  // ── Duration by module ──
  const durationByModule = useMemo(() => {
    const grouped: Record<string, number[]> = {};
    filtered.filter(e => e.event_type === 'session_end' && e.actual_duration).forEach(e => {
      if (!grouped[e.module]) grouped[e.module] = [];
      grouped[e.module].push(e.actual_duration!);
    });
    return Object.entries(grouped).map(([module, durations]) => ({
      module: MODULE_LABELS[module] || module,
      avgMinutes: +(durations.reduce((a, b) => a + b, 0) / durations.length / 60).toFixed(1),
      totalSessions: durations.length,
    }));
  }, [filtered]);

  // ── Diagnosis areas ──
  const diagnosisAreas = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.filter(e => e.event_type === 'diagnosis_run' && e.diagnosis_area).forEach(e => {
      counts[e.diagnosis_area!] = (counts[e.diagnosis_area!] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([area, count]) => ({ area, count }));
  }, [filtered]);

  // ── Timeline chart ──
  const timelineData = useMemo(() => {
    const grouped: Record<string, Record<string, number>> = {};
    filtered.forEach(e => {
      const day = format(parseISO(e.created_at), 'dd/MM');
      if (!grouped[day]) grouped[day] = {};
      grouped[day][e.module] = (grouped[day][e.module] || 0) + 1;
    });
    return Object.entries(grouped).map(([name, modules]) => ({
      name,
      ...Object.fromEntries(Object.entries(modules).map(([k, v]) => [MODULE_LABELS[k] || k, v])),
    }));
  }, [filtered]);

  // ── CSV Export ──
  const exportCSV = useCallback(() => {
    const headers = ['Fecha', 'Tipo', 'Módulo', 'Protocolo', 'Preset', 'Duración Config (min)', 'Duración Real (seg)', 'Frecuencia', 'Área Diagnóstico', 'Usuario Hash'];
    const rows = filtered.map(e => [
      format(parseISO(e.created_at), 'yyyy-MM-dd HH:mm'),
      e.event_type,
      MODULE_LABELS[e.module] || e.module,
      e.protocol_name || '',
      e.is_preset ? 'Sí' : 'No',
      e.configured_duration?.toString() || '',
      e.actual_duration?.toString() || '',
      e.frequency?.toString() || '',
      e.diagnosis_area || '',
      e.user_hash,
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `usage_analytics_${format(new Date(), 'yyyyMMdd')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [filtered]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Período:</span>
            <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRangePreset)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 días</SelectItem>
                <SelectItem value="30d">Últimos 30 días</SelectItem>
                <SelectItem value="90d">Últimos 90 días</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {dateRange === 'custom' && (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[140px]">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(startDate, 'dd/MM/yy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={(d) => d && setStartDate(d)} locale={es} />
                </PopoverContent>
              </Popover>
              <span>-</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[140px]">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(endDate, 'dd/MM/yy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={(d) => d && setEndDate(d)} locale={es} />
                </PopoverContent>
              </Popover>
            </>
          )}

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Módulo:</span>
            <Select value={moduleFilter} onValueChange={(v) => setModuleFilter(v as ModuleFilter)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="treatment">Tratamiento</SelectItem>
                <SelectItem value="manifestation">Manifestación</SelectItem>
                <SelectItem value="diagnosis">Diagnóstico</SelectItem>
                <SelectItem value="balance_chakras">Balance Chakras</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="ml-auto flex gap-2">
            <Button onClick={fetchEvents} variant="outline" size="sm">Actualizar</Button>
            <Button onClick={exportCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              CSV
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-4 w-4 text-primary" />
            <p className="text-xs text-muted-foreground">Sesiones Totales</p>
          </div>
          <p className="text-2xl font-bold">{stats.totalSessions}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="h-4 w-4 text-purple-500" />
            <p className="text-xs text-muted-foreground">Diagnósticos</p>
          </div>
          <p className="text-2xl font-bold">{stats.totalDiagnoses}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-blue-500" />
            <p className="text-xs text-muted-foreground">Usuarios Activos</p>
          </div>
          <p className="text-2xl font-bold">{stats.uniqueUsers}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-orange-500" />
            <p className="text-xs text-muted-foreground">Duración Prom.</p>
          </div>
          <p className="text-2xl font-bold">{Math.floor(stats.avgDuration / 60)}m {stats.avgDuration % 60}s</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="h-4 w-4 text-green-500" />
            <p className="text-xs text-muted-foreground">Sesiones/Usuario</p>
          </div>
          <p className="text-2xl font-bold">{stats.avgSessionsPerUser}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <p className="text-xs text-muted-foreground">Tasa Retención</p>
          </div>
          <p className="text-2xl font-bold">{stats.recurringRate}%</p>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Module Distribution Pie */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Distribución por Módulo
          </h3>
          <div className="h-[250px]">
            {moduleDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={moduleDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {moduleDistribution.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">Sin datos</div>
            )}
          </div>
        </Card>

        {/* Duration by Module */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Duración Promedio por Módulo (min)
          </h3>
          <div className="h-[250px]">
            {durationByModule.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={durationByModule}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="module" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="avgMinutes" name="Min. promedio" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">Sin datos</div>
            )}
          </div>
        </Card>
      </div>

      {/* Timeline */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Línea Temporal de Uso</h3>
        <div className="h-[300px]">
          {timelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Legend />
                {Object.values(MODULE_LABELS).map((label, i) => (
                  <Line key={label} type="monotone" dataKey={label} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">Sin datos en el período</div>
          )}
        </div>
      </Card>

      {/* Two columns: Top Protocols & Diagnosis Areas */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Protocols */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Top 10 Protocolos
          </h3>
          {topProtocols.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Protocolo</TableHead>
                  <TableHead>Módulo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Usos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProtocols.map((p, i) => (
                  <TableRow key={p.name}>
                    <TableCell className="font-medium">{i + 1}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell className="flex items-center gap-1">
                      {MODULE_ICONS[p.module]}
                      {MODULE_LABELS[p.module] || p.module}
                    </TableCell>
                    <TableCell>{p.isPreset ? 'Preset' : 'Custom'}</TableCell>
                    <TableCell className="text-right font-bold">{p.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">Sin datos de protocolos</p>
          )}
        </Card>

        {/* Diagnosis Areas */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Áreas más Diagnosticadas
          </h3>
          {diagnosisAreas.length > 0 ? (
            <>
              <div className="h-[200px] mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={diagnosisAreas} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="area" type="category" className="text-xs" width={100} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Bar dataKey="count" name="Diagnósticos" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Área</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {diagnosisAreas.map(d => (
                    <TableRow key={d.area}>
                      <TableCell>{d.area}</TableCell>
                      <TableCell className="text-right font-bold">{d.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : (
            <p className="text-muted-foreground text-center py-8">Sin datos de diagnósticos</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default UsageAnalyticsTab;
