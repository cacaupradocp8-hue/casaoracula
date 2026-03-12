import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Users, MapPin, Sparkles, Lightbulb, Download, Filter, ArrowRight, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { subDays, format } from 'date-fns';
import { MandalaCidadela, MandalaLegend } from '@/components/cidadela/MandalaCidadela';
import type { MandalaDistrict, MandalaCollectiveData } from '@/components/cidadela/MandalaCidadela';

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  '#C9A24A',
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
  '#F97316',
  '#6366F1',
];

type PeriodFilter = '7' | '30' | '90' | 'all';

// Inline collective mandala that reuses districtCounts from the dashboard
function MandalaColetivaPainel({ districtCounts }: { districtCounts: { name: string; count: number }[] }) {
  const [districts, setDistricts] = useState<MandalaDistrict[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (supabase as any).from('districts').select('id, numero, nome, descricao, icone, cor').order('numero')
      .then(({ data }: any) => { setDistricts(data || []); setLoaded(true); });
  }, []);

  const collectiveData = useMemo<MandalaCollectiveData[]>(() => {
    return districtCounts.map(dc => {
      const d = districts.find(dd => dd.nome === dc.name);
      return d ? { district_id: d.id, client_count: dc.count } : null;
    }).filter(Boolean) as MandalaCollectiveData[];
  }, [districtCounts, districts]);

  if (!loaded || districts.length === 0) return null;

  return (
    <div className="space-y-3">
      <MandalaCidadela
        districts={districts}
        collectiveData={collectiveData}
        mode="coletivo"
        className="w-full max-w-[400px] mx-auto"
      />
      <MandalaLegend mode="coletivo" />
    </div>
  );
}

type InsightType = 'all' | 'labirintos' | 'portas' | 'arquetipos' | 'torres' | 'distritos';

interface ArchetypeCount {
  name: string;
  count: number;
}

interface ClientRow {
  id: string;
  nome: string;
  status: string;
  distrito_atual?: string;
  processo_estado?: string;
}

export default function PainelClinicoPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<PeriodFilter>('30');
  const [insightType, setInsightType] = useState<InsightType>('all');

  // Data
  const [totalClientes, setTotalClientes] = useState(0);
  const [clientesAtivos, setClientesAtivos] = useState(0);
  const [sessoesPeriodo, setSessoesPeriodo] = useState(0);
  const [archetypeCounts, setArchetypeCounts] = useState<ArchetypeCount[]>([]);
  const [districtCounts, setDistrictCounts] = useState<{ name: string; count: number }[]>([]);
  const [processStates, setProcessStates] = useState<{ name: string; count: number }[]>([]);
  const [filteredClients, setFilteredClients] = useState<ClientRow[]>([]);

  const dateFrom = useMemo(() => {
    if (period === 'all') return null;
    return subDays(new Date(), parseInt(period)).toISOString();
  }, [period]);

  useEffect(() => {
    if (!user) return;
    loadDashboardData();
  }, [user, period, insightType]);

  async function loadDashboardData() {
    setLoading(true);
    try {
      await Promise.all([
        loadClientStats(),
        loadSessionStats(),
        loadArchetypeStats(),
        loadDistrictStats(),
        loadFilteredClients(),
      ]);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadClientStats() {
    const { count: total } = await supabase
      .from('clientes')
      .select('*', { count: 'exact', head: true });
    setTotalClientes(total || 0);

    const { count: ativos } = await supabase
      .from('clientes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ativo');
    setClientesAtivos(ativos || 0);
  }

  async function loadSessionStats() {
    let query = supabase.from('sessions').select('*', { count: 'exact', head: true });
    if (dateFrom) query = query.gte('date', dateFrom);
    const { count } = await query;
    setSessoesPeriodo(count || 0);
  }

  async function loadArchetypeStats() {
    let query = supabase
      .from('session_archetypes')
      .select('archetype_id, atlas_arquetipos_femininos(nome)');
    if (dateFrom) query = query.gte('created_at', dateFrom);
    const { data } = await query;

    if (data) {
      const counts: Record<string, number> = {};
      data.forEach((row: any) => {
        const nome = row.atlas_arquetipos_femininos?.nome || 'Desconhecido';
        counts[nome] = (counts[nome] || 0) + 1;
      });
      const sorted = Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
      setArchetypeCounts(sorted);
    }
  }

  async function loadDistrictStats() {
    const { data: journeys } = await supabase
      .from('journeys')
      .select('process_state, current_district_id, districts(name)');

    if (journeys) {
      // Process states
      const stateMap: Record<string, number> = {};
      journeys.forEach((j: any) => {
        const st = j.process_state || 'indefinido';
        stateMap[st] = (stateMap[st] || 0) + 1;
      });
      setProcessStates(
        Object.entries(stateMap).map(([name, count]) => ({ name, count }))
      );

      // District distribution
      const distMap: Record<string, number> = {};
      journeys.forEach((j: any) => {
        const name = j.districts?.name || 'Sem distrito';
        distMap[name] = (distMap[name] || 0) + 1;
      });
      setDistrictCounts(
        Object.entries(distMap)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
      );
    }
  }

  async function loadFilteredClients() {
    const { data } = await supabase
      .from('clientes')
      .select('id, nome, status')
      .order('updated_at', { ascending: false })
      .limit(20);

    if (data) {
      // Enrich with journey data
      const clientIds = data.map(c => c.id);
      const { data: journeys } = await supabase
        .from('journeys')
        .select('client_id, process_state, districts(name)')
        .in('client_id', clientIds);

      const journeyMap = new Map<string, { state: string; district: string }>();
      journeys?.forEach((j: any) => {
        journeyMap.set(j.client_id, {
          state: j.process_state,
          district: j.districts?.name || '—',
        });
      });

      setFilteredClients(
        data.map(c => ({
          id: c.id,
          nome: c.nome,
          status: c.status,
          distrito_atual: journeyMap.get(c.id)?.district,
          processo_estado: journeyMap.get(c.id)?.state,
        }))
      );
    }
  }

  const topArchetypes = archetypeCounts.slice(0, 3);
  const suggestionText = useMemo(() => {
    if (topArchetypes.length === 0) return null;
    const top = topArchetypes[0];
    return `Considerar aprofundamento no arquétipo "${top.name}" — apareceu ${top.count} vezes no período. Verifique intervenções relacionadas na Biblioteca.`;
  }, [topArchetypes]);

  const handleExportCSV = () => {
    const headers = ['Cliente', 'Status', 'Distrito Atual', 'Estado do Processo'];
    const rows = filteredClients.map(c => [c.nome, c.status, c.distrito_atual || '—', c.processo_estado || '—']);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `painel-clinico-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <CasaMaquinasLayout title="Painel Clínico" subtitle="Inteligência simbólica da sua prática">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* SECTION 1 — Insight Cards */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">Visão Geral</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* Card: Clientes Ativos */}
              <Card className="bg-card/80 border-border/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-primary">
                    <Users className="w-5 h-5" />
                    <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">{clientesAtivos}</p>
                  <p className="text-xs text-muted-foreground mt-1">de {totalClientes} clientes no total</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 text-xs text-primary"
                    onClick={() => navigate('/casa-das-maquinas/clientes')}
                  >
                    Ver Clientes <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>

              {/* Card: Sessões no Período */}
              <Card className="bg-card/80 border-border/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-primary">
                    <MapPin className="w-5 h-5" />
                    <CardTitle className="text-sm font-medium">Sessões no Período</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">{sessoesPeriodo}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {period === 'all' ? 'Todas as sessões' : `Últimos ${period} dias`}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 text-xs text-primary"
                    onClick={() => navigate('/casa-das-maquinas/sessoes')}
                  >
                    Ver Sessões <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>

              {/* Card: Arquétipos Emergentes */}
              <Card className="bg-card/80 border-border/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-primary">
                    <Sparkles className="w-5 h-5" />
                    <CardTitle className="text-sm font-medium">Arquétipos Emergentes</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {topArchetypes.length > 0 ? (
                    <ul className="space-y-1">
                      {topArchetypes.map((a, i) => (
                        <li key={a.name} className="flex items-center justify-between text-sm">
                          <span className="text-foreground/80">
                            {i + 1}. {a.name}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">{a.count}x</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">Sem dados no período</p>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 text-xs text-primary"
                    onClick={() => navigate('/casa-das-maquinas/ferramentas/atlas-arquetipos')}
                  >
                    Ver Detalhes <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>

              {/* Card: Sugestão de Intervenção */}
              <Card className="bg-card/80 border-primary/20 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-primary">
                    <Lightbulb className="w-5 h-5" />
                    <CardTitle className="text-sm font-medium">Sugestão de Intervenção</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    {suggestionText || 'Registre mais sessões para receber sugestões baseadas em padrões.'}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 text-xs text-primary"
                    onClick={() => navigate('/casa-das-maquinas/biblioteca')}
                  >
                    Biblioteca <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* SECTION 2 — Filters */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filtros:</span>
              </div>

              <Select value={period} onValueChange={(v) => setPeriod(v as PeriodFilter)}>
                <SelectTrigger className="w-44 bg-card/60 border-border/50">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 dias</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="90">Últimos 90 dias</SelectItem>
                  <SelectItem value="all">Todo o histórico</SelectItem>
                </SelectContent>
              </Select>

              <Select value={insightType} onValueChange={(v) => setInsightType(v as InsightType)}>
                <SelectTrigger className="w-44 bg-card/60 border-border/50">
                  <SelectValue placeholder="Tipo de Insight" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="distritos">Distritos</SelectItem>
                  <SelectItem value="arquetipos">Arquétipos</SelectItem>
                  <SelectItem value="torres">Torres</SelectItem>
                  <SelectItem value="portas">Portas</SelectItem>
                  <SelectItem value="labirintos">Labirintos</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                className="ml-auto gap-2"
                onClick={handleExportCSV}
              >
                <Download className="w-4 h-4" />
                Exportar CSV
              </Button>
            </div>
          </motion.div>

          {/* SECTION 3 — Charts */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* District Distribution */}
            {(insightType === 'all' || insightType === 'distritos') && (
              <Card className="bg-card/80 border-border/50">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    Distribuição por Distrito
                  </CardTitle>
                  <CardDescription className="text-xs">Distritos atuais das jornadas</CardDescription>
                </CardHeader>
                <CardContent>
                  {districtCounts.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={districtCounts}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                          angle={-20}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{
                            background: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: 8,
                            color: 'hsl(var(--foreground))',
                          }}
                        />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-10">Sem dados de distritos</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Process States Pie */}
            {(insightType === 'all' || insightType === 'labirintos') && (
              <Card className="bg-card/80 border-border/50">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Estados de Processo
                  </CardTitle>
                  <CardDescription className="text-xs">Distribuição dos estados das jornadas</CardDescription>
                </CardHeader>
                <CardContent>
                  {processStates.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie
                          data={processStates}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={90}
                          dataKey="count"
                          nameKey="name"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {processStates.map((_, idx) => (
                            <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: 8,
                            color: 'hsl(var(--foreground))',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-10">Sem dados de jornadas</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Archetype bar chart */}
            {(insightType === 'all' || insightType === 'arquetipos') && archetypeCounts.length > 0 && (
              <Card className="bg-card/80 border-border/50 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Frequência de Arquétipos
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {period === 'all' ? 'Todo o histórico' : `Últimos ${period} dias`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={archetypeCounts.slice(0, 10)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={140}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: 8,
                          color: 'hsl(var(--foreground))',
                        }}
                      />
                      <Bar dataKey="count" fill="#C9A24A" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* SECTION 3.5 — Mandala Coletiva */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <Card className="bg-card/80 border-border/50">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Mandala Coletiva — CidaDELA
                </CardTitle>
                <CardDescription className="text-xs">Distribuição visual das clientes nos distritos</CardDescription>
              </CardHeader>
              <CardContent>
                <MandalaColetivaPainel districtCounts={districtCounts} />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="bg-card/80 border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Clientes Recentes</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-primary"
                    onClick={() => navigate('/casa-das-maquinas/clientes')}
                  >
                    Ver todos <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/30">
                      <TableHead className="text-muted-foreground">Cliente</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-muted-foreground">Distrito Atual</TableHead>
                      <TableHead className="text-muted-foreground">Estado</TableHead>
                      <TableHead className="text-muted-foreground text-right">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id} className="border-border/20 hover:bg-secondary/30">
                        <TableCell className="font-medium text-foreground">{client.nome}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            client.status === 'ativo'
                              ? 'bg-primary/20 text-primary'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {client.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">{client.distrito_atual || '—'}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{client.processo_estado || '—'}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                            onClick={() => navigate(`/casa-das-maquinas/clientes/${client.id}`)}
                          >
                            Abrir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredClients.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          Nenhum cliente encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </CasaMaquinasLayout>
  );
}
