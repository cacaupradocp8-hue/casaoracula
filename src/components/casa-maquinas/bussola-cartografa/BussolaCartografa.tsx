import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Loader2, Compass, MapPin, Brain, Key, Wrench, Eye,
  TrendingUp, AlertTriangle, Sparkles, ArrowRight, Castle,
  RefreshCw, FileText, Map,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { EthicalNotice } from '@/components/shared/EthicalNotice';

interface Props {
  clienteId: string;
}

interface PatternItem {
  pattern_name: string;
  pattern_type: string;
  occurrence_count: number;
}

interface DistrictInfo {
  id: string;
  nome: string;
  sessions_count: number;
  state: string;
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  district: <MapPin className="w-3.5 h-3.5" />,
  archetype: <Brain className="w-3.5 h-3.5" />,
  tower: <Castle className="w-3.5 h-3.5" />,
  oracle_card: <Eye className="w-3.5 h-3.5" />,
  intervention: <Wrench className="w-3.5 h-3.5" />,
  tool: <Wrench className="w-3.5 h-3.5" />,
};

const TYPE_LABEL: Record<string, string> = {
  district: 'Distrito',
  tower: 'Torre',
  oracle_card: 'Carta',
  intervention: 'Intervenção',
  archetype: 'Arquétipo',
  tool: 'Ferramenta',
};

export function BussolaCartografa({ clienteId }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [generatingInsights, setGeneratingInsights] = useState(false);

  const [patterns, setPatterns] = useState<PatternItem[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [cidadelaMap, setCidadelaMap] = useState<any>(null);
  const [districts, setDistricts] = useState<DistrictInfo[]>([]);
  const [aiObservations, setAiObservations] = useState<string[]>([]);
  const [aiNextSteps, setAiNextSteps] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, [clienteId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [patternsRes, sessRes, cidRes, journeysRes] = await Promise.all([
        supabase.from('client_pattern_stats').select('pattern_name, pattern_type, occurrence_count')
          .eq('client_id', clienteId).order('occurrence_count', { ascending: false }).limit(50),
        supabase.from('sessions').select('id, district_id, created_at, tool_id, insight, checkin_state')
          .eq('client_id', clienteId).order('created_at', { ascending: true }),
        supabase.from('client_cidadela_map' as any).select('*').eq('client_id', clienteId).limit(1),
        supabase.from('journey_districts' as any).select('district_id, state')
          .eq('client_id', clienteId),
      ]);

      setPatterns((patternsRes.data || []) as PatternItem[]);
      setSessions(sessRes.data || []);
      setCidadelaMap((cidRes.data as any)?.[0] || null);

      // Build district summaries from sessions
      const distMap = new Map<string, DistrictInfo>();
      const journeyData = (journeysRes.data || []) as any[];

      for (const s of (sessRes.data || [])) {
        if (!s.district_id) continue;
        const existing = distMap.get(s.district_id);
        if (existing) {
          existing.sessions_count++;
        } else {
          distMap.set(s.district_id, {
            id: s.district_id,
            nome: s.district_id,
            sessions_count: 1,
            state: 'ativo',
          });
        }
      }

      // Merge journey states
      for (const jd of journeyData) {
        const d = distMap.get(jd.district_id);
        if (d) d.state = jd.state || 'ativo';
      }

      // Fetch district names
      const distIds = Array.from(distMap.keys());
      if (distIds.length > 0) {
        const { data: distNames } = await supabase
          .from('districts')
          .select('id, nome')
          .in('id', distIds);
        for (const dn of (distNames || [])) {
          const d = distMap.get(dn.id);
          if (d) d.nome = dn.nome;
        }
      }

      const sorted = Array.from(distMap.values()).sort((a, b) => b.sessions_count - a.sessions_count);
      setDistricts(sorted);

      // Generate local observations
      generateLocalObservations(
        (patternsRes.data || []) as PatternItem[],
        sorted,
        (cidRes.data as any)?.[0] || null
      );
    } catch (err) {
      console.error('Bússola load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateLocalObservations = (
    pats: PatternItem[],
    dists: DistrictInfo[],
    mapData: any
  ) => {
    const obs: string[] = [];
    const next: string[] = [];

    // District dominance
    if (dists.length > 0) {
      const top = dists[0];
      obs.push(`A jornada mostra permanência mais intensa no território de ${top.nome} (${top.sessions_count} sessões).`);
      if (dists.length > 1) {
        obs.push(`Há um eixo recorrente entre ${dists[0].nome} e ${dists[1].nome}.`);
      }
    }

    // Pattern recurrence
    const recurring = pats.filter(p => p.occurrence_count >= 3);
    if (recurring.length > 0) {
      const types = [...new Set(recurring.map(p => TYPE_LABEL[p.pattern_type] || p.pattern_type))];
      obs.push(`Padrões recorrentes identificados em: ${types.join(', ')}.`);
    }

    // Integrations
    const integrated = dists.filter(d => d.state === 'integrado');
    if (integrated.length > 0) {
      obs.push(`${integrated.length} território(s) alcançaram estado de integração: ${integrated.map(d => d.nome).join(', ')}.`);
    }

    // Inactive districts
    const inactive = dists.filter(d => d.state === 'inativo' || d.sessions_count === 1);
    if (inactive.length > 0 && dists.length > 3) {
      next.push(`Territórios com menor exploração podem conter material simbólico não visitado.`);
    }

    // Archetype patterns
    const archetypes = pats.filter(p => p.pattern_type === 'archetype');
    if (archetypes.length > 0) {
      next.push(`O arquétipo ${archetypes[0].pattern_name} aparece com frequência — pode haver abertura para aprofundamento.`);
    }

    // Tool diversity
    const tools = pats.filter(p => p.pattern_type === 'tool');
    if (tools.length <= 2 && sessions.length > 5) {
      next.push(`A diversidade de ferramentas é baixa — considerar ampliar o repertório de intervenções.`);
    }

    if (mapData?.labirintos_visitados?.length > 0) {
      next.push(`Labirintos ativos sugerem material em elaboração — manter observação clínica.`);
    }

    setAiObservations(obs.length > 0 ? obs : ['Dados insuficientes para gerar observações da jornada.']);
    setAiNextSteps(next.length > 0 ? next : ['Continue registrando sessões para obter sugestões de próximos movimentos.']);
  };

  const generateAiInsights = async () => {
    setGeneratingInsights(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-journey-narrative', {
        body: { client_id: clienteId, narrative_type: 'sintese' },
      });
      if (error) throw error;
      if (data?.narrative) {
        const lines = data.narrative.split('\n').filter((l: string) => l.trim());
        setAiObservations(lines.slice(0, 4));
        setAiNextSteps(lines.slice(4, 7));
        toast.success('Síntese gerada com sucesso');
      }
    } catch {
      toast.error('Não foi possível gerar a síntese');
    } finally {
      setGeneratingInsights(false);
    }
  };

  // Grouped patterns
  const archetypes = useMemo(() => patterns.filter(p => p.pattern_type === 'archetype'), [patterns]);
  const doors = useMemo(() => patterns.filter(p => p.pattern_type === 'oracle_card' || p.pattern_type === 'intervention'), [patterns]);
  const labyrinths = useMemo(() => cidadelaMap?.labirintos_visitados || [], [cidadelaMap]);
  const toolPatterns = useMemo(() => patterns.filter(p => p.pattern_type === 'tool'), [patterns]);

  const districtChartData = useMemo(() =>
    districts.slice(0, 8).map(d => ({ name: d.nome, sessões: d.sessions_count })),
    [districts]
  );
  const chartConfig = { sessões: { label: 'Sessões', color: 'hsl(var(--primary))' } };

  const STATE_BADGE: Record<string, { label: string; cls: string }> = {
    ativo: { label: 'Ativo', cls: 'border-primary/30 text-primary' },
    integrado: { label: 'Integrado', cls: 'border-accent/30 text-accent' },
    inativo: { label: 'Inativo', cls: 'border-muted-foreground/30 text-muted-foreground' },
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Bússola da Cartógrafa</h2>
          <Badge variant="outline" className="text-[10px] border-primary/20 text-primary">
            {sessions.length} sessões
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={generateAiInsights}
            disabled={generatingInsights}
            className="text-xs"
          >
            {generatingInsights ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Sparkles className="w-3 h-3 mr-1" />}
            Gerar Síntese IA
          </Button>
          <Button variant="outline" size="sm" onClick={loadData} className="text-xs">
            <RefreshCw className="w-3 h-3 mr-1" /> Atualizar
          </Button>
        </div>
      </div>

      <EthicalNotice text="Bússola clínica — organiza padrões da jornada simbólica. Não substitui a leitura da facilitadora." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* 1. Distritos Dominantes */}
        <Card className="border-border/30 bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary">
              <MapPin className="w-4 h-4" /> Distritos Dominantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {districts.length === 0 ? (
              <p className="text-xs text-muted-foreground">Nenhum distrito registrado.</p>
            ) : (
              <div className="space-y-2">
                {districts.slice(0, 6).map(d => {
                  const badge = STATE_BADGE[d.state] || STATE_BADGE.inativo;
                  return (
                    <div key={d.id} className="flex items-center justify-between p-2 rounded-lg border border-border/20 bg-background/50">
                      <div className="flex items-center gap-2 min-w-0">
                        <MapPin className="w-3 h-3 text-primary/60 shrink-0" />
                        <span className="text-xs text-foreground/80 truncate">{d.nome}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-muted-foreground">{d.sessions_count}×</span>
                        <Badge variant="outline" className={`text-[9px] ${badge.cls}`}>{badge.label}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {districtChartData.length > 0 && (
              <div className="mt-4">
                <ChartContainer config={chartConfig} className="h-[140px] w-full">
                  <BarChart data={districtChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/10" />
                    <XAxis type="number" tick={{ fontSize: 10 }} className="fill-muted-foreground" />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 9 }} className="fill-muted-foreground" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="sessões" className="fill-primary" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 2. Arquétipos Emergentes */}
        <Card className="border-border/30 bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary">
              <Brain className="w-4 h-4" /> Arquétipos Emergentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {archetypes.length === 0 ? (
              <p className="text-xs text-muted-foreground">Nenhum arquétipo registrado.</p>
            ) : (
              <div className="space-y-2">
                {archetypes.slice(0, 8).map((a, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg border border-border/20 bg-background/50">
                    <div className="flex items-center gap-2">
                      <Brain className="w-3 h-3 text-primary/60" />
                      <span className="text-xs text-foreground/80">{a.pattern_name}</span>
                    </div>
                    <Badge variant="outline" className="text-[9px] border-primary/20 text-primary">
                      {a.occurrence_count}×
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 3. Portas Recorrentes */}
        <Card className="border-border/30 bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary">
              <Key className="w-4 h-4" /> Portas e Intervenções Recorrentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {doors.length === 0 ? (
              <p className="text-xs text-muted-foreground">Nenhuma porta ou intervenção registrada.</p>
            ) : (
              <div className="space-y-2">
                {doors.slice(0, 8).map((d, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg border border-border/20 bg-background/50">
                    <div className="flex items-center gap-2">
                      {TYPE_ICON[d.pattern_type] || <Key className="w-3 h-3" />}
                      <span className="text-xs text-foreground/80">{d.pattern_name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="text-[9px] border-muted-foreground/20 text-muted-foreground">
                        {TYPE_LABEL[d.pattern_type]}
                      </Badge>
                      <Badge variant="outline" className="text-[9px] border-primary/20 text-primary">
                        {d.occurrence_count}×
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 4. Labirintos Ativos */}
        <Card className="border-border/30 bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary">
              <Castle className="w-4 h-4" /> Labirintos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {labyrinths.length === 0 ? (
              <p className="text-xs text-muted-foreground">Nenhum labirinto registrado.</p>
            ) : (
              <div className="space-y-2">
                {(labyrinths as string[]).map((lab, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg border border-border/20 bg-background/50">
                    <Castle className="w-3 h-3 text-primary/60" />
                    <span className="text-xs text-foreground/80">{lab}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 5. Ferramentas Mais Utilizadas */}
        <Card className="border-border/30 bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary">
              <Wrench className="w-4 h-4" /> Ferramentas Mais Utilizadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {toolPatterns.length === 0 ? (
              <p className="text-xs text-muted-foreground">Nenhuma ferramenta registrada.</p>
            ) : (
              <div className="space-y-2">
                {toolPatterns.slice(0, 8).map((t, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg border border-border/20 bg-background/50">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-3 h-3 text-primary/60" />
                      <span className="text-xs text-foreground/80">{t.pattern_name}</span>
                    </div>
                    <Badge variant="outline" className="text-[9px] border-primary/20 text-primary">
                      {t.occurrence_count}×
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 6. Padrões da Jornada */}
        <Card className="border-border/30 bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary">
              <TrendingUp className="w-4 h-4" /> Padrões da Jornada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiObservations.map((obs, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <Eye className="w-3 h-3 text-primary/50 mt-0.5 shrink-0" />
                  <p className="text-xs text-foreground/70 italic leading-relaxed">"{obs}"</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 7. Próximos Movimentos */}
      <Card className="border-primary/10 bg-card/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary">
            <Compass className="w-4 h-4" /> Próximos Movimentos Possíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {aiNextSteps.map((step, i) => (
              <div key={i} className="flex gap-2 items-start p-3 rounded-lg border border-primary/10 bg-primary/5">
                <ArrowRight className="w-3 h-3 text-primary/60 mt-0.5 shrink-0" />
                <p className="text-xs text-foreground/70 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
