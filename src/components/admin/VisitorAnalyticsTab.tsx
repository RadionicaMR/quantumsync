import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfDay, endOfDay, startOfHour, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Eye, MousePointer, ShoppingCart, CreditCard, TrendingUp, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

interface AnalyticsEvent {
  id: string;
  event_type: string;
  page_url: string | null;
  referrer: string | null;
  session_id: string | null;
  metadata: unknown;
  created_at: string;
}

type DateRangePreset = '24h' | '7d' | '30d' | 'custom';
type GroupBy = 'hour' | 'day';

const VisitorAnalyticsTab = () => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRangePreset>('7d');
  const [groupBy, setGroupBy] = useState<GroupBy>('day');
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
    if (dateRange === '24h') {
      setStartDate(subDays(new Date(), 1));
      setGroupBy('hour');
    } else if (dateRange === '7d') {
      setStartDate(subDays(new Date(), 7));
      setGroupBy('day');
    } else if (dateRange === '30d') {
      setStartDate(subDays(new Date(), 30));
      setGroupBy('day');
    }
    setEndDate(new Date());
  }, [dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [startDate, endDate]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .gte('created_at', startOfDay(startDate).toISOString())
        .lte('created_at', endOfDay(endDate).toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const uniqueSessions = new Set(events.map(e => e.session_id)).size;
    const pageVisits = events.filter(e => e.event_type === 'page_visit').length;
    const ctaClicks = events.filter(e => e.event_type === 'cta_click').length;
    const purchasePageViews = events.filter(e => e.event_type === 'purchase_page').length;
    const paymentClicks = events.filter(e => e.event_type === 'payment_click').length;

    return {
      uniqueSessions,
      pageVisits,
      ctaClicks,
      purchasePageViews,
      paymentClicks,
      ctaRate: pageVisits > 0 ? ((ctaClicks / pageVisits) * 100).toFixed(1) : '0',
      purchaseRate: ctaClicks > 0 ? ((purchasePageViews / ctaClicks) * 100).toFixed(1) : '0',
      conversionRate: purchasePageViews > 0 ? ((paymentClicks / purchasePageViews) * 100).toFixed(1) : '0'
    };
  }, [events]);

  const chartData = useMemo(() => {
    const groupedData: Record<string, { pageVisits: number; ctaClicks: number; purchasePage: number; paymentClicks: number }> = {};

    events.forEach(event => {
      const date = parseISO(event.created_at);
      const key = groupBy === 'hour' 
        ? format(startOfHour(date), 'HH:00')
        : format(date, 'dd/MM');

      if (!groupedData[key]) {
        groupedData[key] = { pageVisits: 0, ctaClicks: 0, purchasePage: 0, paymentClicks: 0 };
      }

      switch (event.event_type) {
        case 'page_visit':
          groupedData[key].pageVisits++;
          break;
        case 'cta_click':
          groupedData[key].ctaClicks++;
          break;
        case 'purchase_page':
          groupedData[key].purchasePage++;
          break;
        case 'payment_click':
          groupedData[key].paymentClicks++;
          break;
      }
    });

    return Object.entries(groupedData).map(([name, data]) => ({
      name,
      ...data
    }));
  }, [events, groupBy]);

  const funnelData = [
    { step: 'Visitantes', value: stats.pageVisits, icon: Eye },
    { step: 'Click CTA', value: stats.ctaClicks, icon: MousePointer },
    { step: 'Página Compra', value: stats.purchasePageViews, icon: ShoppingCart },
    { step: 'Click Pagar', value: stats.paymentClicks, icon: CreditCard }
  ];

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
                <SelectItem value="24h">Últimas 24h</SelectItem>
                <SelectItem value="7d">Últimos 7 días</SelectItem>
                <SelectItem value="30d">Últimos 30 días</SelectItem>
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
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(d) => d && setStartDate(d)}
                    locale={es}
                  />
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
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(d) => d && setEndDate(d)}
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm font-medium">Agrupar por:</span>
            <Select value={groupBy} onValueChange={(v) => setGroupBy(v as GroupBy)}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hour">Hora</SelectItem>
                <SelectItem value="day">Día</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={fetchAnalytics} variant="outline" size="sm">
            Actualizar
          </Button>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Visitas Totales</p>
              <p className="text-2xl font-bold">{stats.pageVisits}</p>
            </div>
            <Eye className="h-6 w-6 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Clicks "Inicia Ahora"</p>
              <p className="text-2xl font-bold">{stats.ctaClicks}</p>
              <p className="text-xs text-green-500">{stats.ctaRate}% de visitas</p>
            </div>
            <MousePointer className="h-6 w-6 text-purple-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Página de Compra</p>
              <p className="text-2xl font-bold">{stats.purchasePageViews}</p>
              <p className="text-xs text-green-500">{stats.purchaseRate}% de clicks</p>
            </div>
            <ShoppingCart className="h-6 w-6 text-orange-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Clicks "Pagar con"</p>
              <p className="text-2xl font-bold">{stats.paymentClicks}</p>
              <p className="text-xs text-green-500">{stats.conversionRate}% conversión</p>
            </div>
            <CreditCard className="h-6 w-6 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Funnel Visualization */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Funnel de Conversión
        </h3>
        <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
          {funnelData.map((item, index) => (
            <div key={item.step} className="flex items-center gap-2">
              <div className="text-center">
                <div className="w-20 md:w-24 h-20 md:h-24 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex flex-col items-center justify-center border border-primary/20">
                  <item.icon className="h-5 w-5 md:h-6 md:w-6 text-primary mb-1" />
                  <span className="text-lg md:text-xl font-bold">{item.value}</span>
                </div>
                <p className="text-xs mt-1 text-muted-foreground max-w-[80px]">{item.step}</p>
              </div>
              {index < funnelData.length - 1 && (
                <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Eventos por {groupBy === 'hour' ? 'Hora' : 'Día'}</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="pageVisits" name="Visitas" fill="hsl(var(--primary))" />
              <Bar dataKey="ctaClicks" name="CTA Clicks" fill="#8b5cf6" />
              <Bar dataKey="purchasePage" name="Pág. Compra" fill="#f97316" />
              <Bar dataKey="paymentClicks" name="Pagar" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Sessions info */}
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          <strong>{stats.uniqueSessions}</strong> sesiones únicas en el período seleccionado
        </p>
      </Card>
    </div>
  );
};

export default VisitorAnalyticsTab;
