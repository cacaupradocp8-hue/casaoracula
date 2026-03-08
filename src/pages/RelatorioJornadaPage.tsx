import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft, Calendar, MapPin, Shield, Sparkles, DoorOpen, Eye,
  FileText, Save, Filter, Loader2, Download, Clock, Milestone
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────
interface JourneyEvent {
  id: string;
  tipo: string;
  titulo: string;
  descricao: string | null;
  data_evento: string;
  metadata_json: Record<string, any>;
  session_id: string | null;
}

interface DistrictSummary {
  nome: string;
  state: string;
  sessions_count: number;
}

const EVENT_ICONS: Record<string, typeof MapPin> = {
  sessao: Clock,
  distrito_ativado: MapPin,
  distrito_integrado: Sparkles,
  porta_atravessada: DoorOpen,
  labirinto_desvelado: Eye,
  arquetipo_convocado: Sparkles,
  travessia_concluida: Milestone,
};

const EVENT_LABELS: Record<string, string> = {
  sessao: 'Sessão',
  distrito_ativado: 'Distrito Ativado',
  distrito_integrado: 'Distrito Integrado',
  porta_atravessada: 'Porta Atravessada',
  labirinto_desvelado: 'Labirinto Desvelado',
  arquetipo_convocado: 'Arquétipo Convocado',
  travessia_concluida: 'Travessia Concluída',
};

const EVENT_COLORS: Record<string, string> = {
  sessao: 'border-primary/30 bg-primary/5',
  distrito_ativado: 'border-[#C9A24A]/30 bg-[#C9A24A]/5',
  distrito_integrado: 'border-[#556B57]/30 bg-[#556B57]/5',
  porta_atravessada: 'border-[#7B68EE]/30 bg-[#7B68EE]/5',
  labirinto_desvelado: 'border-red-400/30 bg-red-400/5',
  arquetipo_convocado: 'border-[#C9A24A]/30 bg-[#C9A24A]/5',
  travessia_concluida: 'border-[#556B57]/30 bg-[#556B57]/5',
};

export default function RelatorioJornadaPage() {
  const { clienteId } = useParams<{ clienteId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [clienteNome, setClienteNome] = useState('');
  const [events, setEvents] = useState<JourneyEvent[]>([]);
  const [districts, setDistricts] = useState<DistrictSummary[]>([]);
  const [reflections, setReflections] = useState('');
  const [savingReflections, setSavingReflections] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [archetypes, setArchetypes] = useState<string[]>([]);
  const [labyrinths, setLabyrinths] = useState<string[]>([]);
  const [doors, setDoors] = useState<string[]>([]);

  // ── Load data ──────────────────────────────────────────────
  useEffect(() => {
    if (!clienteId || !user) return;
    loadAll();
  }, [clienteId, user]);

  async function loadAll() {
    setLoading(true);
    try {
      await Promise.all([
        loadCliente(),
        loadEvents(),
        loadDistricts(),
        loadReflections(),
        loadPatterns(),
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function loadCliente() {
    const { data } = await supabase
      .from('clientes')
      .select('nome')
      .eq('id', clienteId!)
      .single();
    if (data) setClienteNome(data.nome);
  }

  async function loadEvents() {
    const { data } = await supabase
      .from('journey_events')
      .select('id, tipo, titulo, descricao, data_evento, metadata_json, session_id')
      .eq('client_id', clienteId!)
      .order('data_evento', { ascending: false });
    setEvents((data as JourneyEvent[]) || []);
  }

  async function loadDistricts() {
    const { data: journeys } = await supabase
      .from('journeys')
      .select('id')
      .eq('client_id', clienteId!)
      .limit(1);

    if (!journeys?.length) { setDistricts([]); return; }

    const { data: jd } = await supabase
      .from('journey_districts')
      .select('district_id, state, sessions_count')
      .eq('journey_id', journeys[0].id);

    if (!jd?.length) { setDistricts([]); return; }

    const distIds = jd.map(j => j.district_id);
    const { data: dists } = await supabase
      .from('districts')
      .select('id, nome')
      .in('id', distIds);

    const nameMap = Object.fromEntries((dists || []).map(d => [d.id, d.nome]));
    setDistricts(jd.map(j => ({
      nome: nameMap[j.district_id] || 'Desconhecido',
      state: j.state,
      sessions_count: j.sessions_count,
    })));
  }

  async function loadReflections() {
    const { data } = await supabase
      .from('reflexoes_jornada')
      .select('texto')
      .eq('client_id', clienteId!)
      .eq('therapist_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) setReflections(data.texto);
  }

  async function loadPatterns() {
    const { data } = await supabase
      .from('client_pattern_stats')
      .select('pattern_type, pattern_name, occurrence_count')
      .eq('client_id', clienteId!)
      .order('occurrence_count', { ascending: false });

    if (!data) return;
    setArchetypes(data.filter(p => p.pattern_type === 'archetype').map(p => p.pattern_name).slice(0, 5));
    setLabyrinths(data.filter(p => p.pattern_type === 'district').map(p => p.pattern_name).slice(0, 5));
    setDoors(data.filter(p => p.pattern_type === 'tool').map(p => p.pattern_name).slice(0, 5));
  }

  // ── Save reflections ──────────────────────────────────────
  async function handleSaveReflections() {
    if (!clienteId || !user || !reflections.trim()) return;
    setSavingReflections(true);
    const { error } = await supabase
      .from('reflexoes_jornada')
      .insert({
        client_id: clienteId,
        therapist_id: user.id,
        texto: reflections.trim(),
      } as any);

    if (error) toast.error('Erro ao salvar reflexões');
    else toast.success('Reflexões salvas');
    setSavingReflections(false);
  }

  // ── Computed ──────────────────────────────────────────────
  const filteredEvents = useMemo(() => {
    if (!filterType) return events;
    return events.filter(e => e.tipo === filterType);
  }, [events, filterType]);

  const districtStats = useMemo(() => {
    const total = districts.length || 1;
    const inativo = districts.filter(d => d.state === 'inativo').length;
    const ativo = districts.filter(d => d.state === 'ativo').length;
    const integrado = districts.filter(d => d.state === 'integrado').length;
    return {
      inativo, ativo, integrado, total: districts.length,
      pctInativo: Math.round((inativo / total) * 100),
      pctAtivo: Math.round((ativo / total) * 100),
      pctIntegrado: Math.round((integrado / total) * 100),
    };
  }, [districts]);

  const eventTypes = useMemo(() => {
    const types = new Set(events.map(e => e.tipo));
    return Array.from(types);
  }, [events]);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });

  // ── Render ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">Relatório de Jornada</h1>
              <p className="text-xs text-muted-foreground">{clienteNome}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5"
            onClick={() => navigate(`/casa-das-maquinas/clientes/${clienteId}`)}>
            <FileText className="w-3.5 h-3.5" /> Prontuário
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">

        {/* ── Summary Cards ────────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Progresso da CidaDELA */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                <MapPin className="w-4 h-4 text-primary" /> Progresso da CidaDELA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-2xl font-bold text-foreground">{districtStats.total} <span className="text-sm font-normal text-muted-foreground">distritos</span></div>
              <div className="space-y-2">
                <ProgressRow label="Integrados" value={districtStats.pctIntegrado} count={districtStats.integrado} color="bg-[#556B57]" />
                <ProgressRow label="Ativos" value={districtStats.pctAtivo} count={districtStats.ativo} color="bg-primary" />
                <ProgressRow label="Inativos" value={districtStats.pctInativo} count={districtStats.inativo} color="bg-muted" />
              </div>
            </CardContent>
          </Card>

          {/* Labirintos Recorrentes */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                <Eye className="w-4 h-4 text-primary" /> Labirintos Recorrentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {labyrinths.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Nenhum padrão registrado</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {labyrinths.map(l => (
                    <Badge key={l} variant="outline" className="text-xs border-border text-foreground/70">{l}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Portas Abertas */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                <DoorOpen className="w-4 h-4 text-primary" /> Portas Abertas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {doors.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Nenhuma porta registrada</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {doors.map(d => (
                    <Badge key={d} variant="outline" className="text-xs border-[#7B68EE]/30 text-[#7B68EE]">{d}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Arquétipos em Destaque */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                <Sparkles className="w-4 h-4 text-primary" /> Arquétipos em Destaque
              </CardTitle>
            </CardHeader>
            <CardContent>
              {archetypes.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Nenhum arquétipo registrado</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {archetypes.map(a => (
                    <Badge key={a} variant="outline" className="text-xs border-primary/30 text-primary">{a}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* ── Timeline ──────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Linha do Tempo da Jornada
            </h2>
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              <select
                value={filterType || ''}
                onChange={e => setFilterType(e.target.value || null)}
                className="text-xs bg-card border border-border rounded-md px-2 py-1 text-foreground"
              >
                <option value="">Todos os eventos</option>
                {eventTypes.map(t => (
                  <option key={t} value={t}>{EVENT_LABELS[t] || t}</option>
                ))}
              </select>
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <Card className="border-border bg-card">
              <CardContent className="py-12 text-center">
                <Calendar className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Nenhum evento registrado na jornada</p>
                <p className="text-xs text-muted-foreground/50 mt-1">
                  Eventos são criados automaticamente durante sessões e marcos clínicos
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

              <div className="space-y-4">
                {filteredEvents.map((event, idx) => {
                  const Icon = EVENT_ICONS[event.tipo] || Milestone;
                  const colorClass = EVENT_COLORS[event.tipo] || 'border-border bg-card';

                  return (
                    <div key={event.id} className="relative flex items-start gap-4 pl-2">
                      {/* Dot */}
                      <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${colorClass}`}>
                        <Icon className="w-3.5 h-3.5 text-foreground/60" />
                      </div>

                      {/* Content */}
                      <Card className={`flex-1 border ${colorClass} cursor-pointer hover:shadow-md transition-shadow`}
                        onClick={() => {
                          if (event.session_id) {
                            navigate(`/casa-das-maquinas/clientes/${clienteId}`);
                          }
                        }}>
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">
                                {EVENT_LABELS[event.tipo] || event.tipo}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground">{fmtDate(event.data_evento)}</span>
                            </div>
                          </div>
                          <p className="text-sm font-medium text-foreground">{event.titulo}</p>
                          {event.descricao && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{event.descricao}</p>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <Separator className="bg-border" />

        {/* ── Therapist Reflections ─────────────────────────── */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" /> Reflexões da Terapeuta
          </h2>
          <p className="text-xs text-muted-foreground">
            Registre suas análises, observações clínicas e planos para a jornada desta cliente.
          </p>
          <Textarea
            value={reflections}
            onChange={e => setReflections(e.target.value)}
            placeholder="Escreva suas reflexões sobre a jornada terapêutica..."
            className="min-h-[180px] bg-card border-border text-foreground placeholder:text-muted-foreground"
          />
          <div className="flex justify-end">
            <Button onClick={handleSaveReflections} disabled={savingReflections} className="gap-1.5" size="sm">
              {savingReflections ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Salvar Reflexões
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

// ── Helper component ──────────────────────────────────────────
function ProgressRow({ label, value, count, color }: { label: string; value: number; count: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px]">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground font-medium">{count} ({value}%)</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
