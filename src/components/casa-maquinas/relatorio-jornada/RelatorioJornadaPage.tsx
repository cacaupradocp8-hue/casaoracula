import { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Loader2, Sparkles, MapPin, TrendingUp, Clock, Eye,
  FileText, Printer, RefreshCw, Compass, Shield, Flame,
  Calendar, AlertTriangle, CheckCircle2, ArrowRight, Download,
} from 'lucide-react';
import { toast } from 'sonner';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import { RelatorioNarrativo } from '../RelatorioNarrativo';
import { generateRelatorioPDF } from '@/lib/relatorio-pdf-export';

interface Props {
  clienteId: string;
}

interface DistrictSummary {
  id: string;
  nome: string;
  state: string;
  sessions_count: number;
  last_session_at: string | null;
  tools_used: string[];
}

interface Traversal {
  date: string;
  type: 'porta' | 'arquetipo' | 'insight' | 'integracao' | 'distrito';
  label: string;
  detail: string;
}

interface PatternItem {
  pattern_name: string;
  pattern_type: string;
  occurrence_count: number;
}

export function RelatorioJornadaPage({ clienteId }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showNarrativo, setShowNarrativo] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Data
  const [clienteNome, setClienteNome] = useState('');
  const [sessions, setSessions] = useState<any[]>([]);
  const [districts, setDistricts] = useState<DistrictSummary[]>([]);
  const [patterns, setPatterns] = useState<PatternItem[]>([]);
  const [traversals, setTraversals] = useState<Traversal[]>([]);
  const [cidadelaMap, setCidadelaMap] = useState<any>(null);
  const [panorama, setPanorama] = useState<any>(null);

  useEffect(() => {
    loadAllData();
  }, [clienteId]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [clienteRes, sessRes, patternsRes, cidRes, journeysRes] = await Promise.all([
        supabase.from('clientes').select('nome, data_inicio').eq('id', clienteId).single(),
        supabase.from('sessions').select('id, district_id, created_at, checkin_state, tool_id, insight, task')
          .eq('client_id', clienteId).order('created_at', { ascending: true }),
        supabase.from('client_pattern_stats').select('pattern_name, pattern_type, occurrence_count')
          .eq('client_id', clienteId).order('occurrence_count', { ascending: false }).limit(20),
        supabase.from('client_cidadela_map').select('*').eq('client_id', clienteId).limit(1),
        supabase.from('journeys').select('id').eq('client_id', clienteId).limit(1),
      ]);

      setClienteNome(clienteRes.data?.nome || '');
      setSessions(sessRes.data || []);
      setPatterns((patternsRes.data || []) as PatternItem[]);
      setCidadelaMap(cidRes.data?.[0] || cidRes.data);

      // Load district details
      let distSummaries: DistrictSummary[] = [];
      let travList: Traversal[] = [];

      if (journeysRes.data?.length) {
        const journeyId = journeysRes.data[0].id;
        const [jdRes, scRes, distAllRes, toolsRes] = await Promise.all([
          supabase.from('journey_districts').select('district_id, state, sessions_count, last_session_at')
            .eq('journey_id', journeyId),
          supabase.from('district_state_changes').select('district_id, from_state, to_state, reason, created_at')
            .eq('client_id', clienteId).order('created_at', { ascending: true }),
          supabase.from('districts').select('id, nome'),
          supabase.from('tools').select('id, nome'),
        ]);

        const distMap = Object.fromEntries((distAllRes.data || []).map((d: any) => [d.id, d.nome]));
        const toolMap = Object.fromEntries((toolsRes.data || []).map((t: any) => [t.id, t.nome]));

        // Build district summaries
        const sessionsArr = sessRes.data || [];
        distSummaries = (jdRes.data || []).map((jd: any) => {
          const distSessions = sessionsArr.filter((s: any) => s.district_id === jd.district_id);
          const toolIds = [...new Set(distSessions.map((s: any) => s.tool_id).filter(Boolean))];
          return {
            id: jd.district_id,
            nome: distMap[jd.district_id] || 'Desconhecido',
            state: jd.state || 'inativo',
            sessions_count: jd.sessions_count || distSessions.length,
            last_session_at: jd.last_session_at,
            tools_used: toolIds.map((id: string) => toolMap[id] || id),
          };
        }).sort((a, b) => b.sessions_count - a.sessions_count);

        // Build traversals from state changes
        (scRes.data || []).forEach((sc: any) => {
          if (sc.to_state === 'integrado') {
            travList.push({
              date: new Date(sc.created_at).toLocaleDateString('pt-BR'),
              type: 'integracao',
              label: `Integração: ${distMap[sc.district_id] || 'distrito'}`,
              detail: sc.reason || 'Distrito integrado pela facilitadora',
            });
          } else if (sc.to_state === 'ativo' && sc.from_state === 'inativo') {
            travList.push({
              date: new Date(sc.created_at).toLocaleDateString('pt-BR'),
              type: 'distrito',
              label: `Ativação: ${distMap[sc.district_id] || 'distrito'}`,
              detail: 'Território ativado na jornada',
            });
          }
        });

        // Add insights as traversals
        sessionsArr.filter((s: any) => s.insight).forEach((s: any) => {
          travList.push({
            date: new Date(s.created_at).toLocaleDateString('pt-BR'),
            type: 'insight',
            label: 'Insight clínico',
            detail: s.insight,
          });
        });
      }

      // Portas e arquétipos from cidadela map
      const cm = cidRes.data?.[0] || cidRes.data;
      if (cm) {
        (cm as any)?.portas_cruzadas?.forEach((p: string) => {
          travList.push({ date: '', type: 'porta', label: `Porta: ${p}`, detail: 'Porta atravessada na jornada' });
        });
        (cm as any)?.arquetipos_emergentes?.forEach((a: string) => {
          travList.push({ date: '', type: 'arquetipo', label: `Arquétipo: ${a}`, detail: 'Arquétipo emergente identificado' });
        });
      }

      setDistricts(distSummaries);
      setTraversals(travList);
    } catch (err) {
      console.error('Error loading report data:', err);
      toast.error('Erro ao carregar dados do relatório');
    } finally {
      setLoading(false);
    }
  };

  const generatePanorama = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-journey-narrative', {
        body: { client_id: clienteId, narrative_type: 'relatorio' },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setPanorama(data);
      toast.success('Síntese gerada com sucesso');
    } catch (e: any) {
      toast.error(e.message || 'Erro ao gerar panorama');
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    const sections: { title: string; content: string }[] = [];
    if (panorama?.narrative) {
      const n = panorama.narrative;
      if (n.ponto_partida) sections.push({ title: 'Panorama — Ponto de Partida', content: n.ponto_partida });
      if (n.movimentos_principais) sections.push({ title: 'Movimentos Principais', content: n.movimentos_principais });
      if (n.repeticoes) sections.push({ title: 'Repetições e Padrões', content: n.repeticoes });
      if (n.momentos_virada) sections.push({ title: 'Momentos de Virada', content: n.momentos_virada });
      if (n.integracao) sections.push({ title: 'Sinais de Integração', content: n.integracao });
      if (n.proximo_horizonte) sections.push({ title: 'Próximo Horizonte Simbólico', content: n.proximo_horizonte });
      if (n.sintese) sections.push({ title: 'Síntese', content: n.sintese });
    }
    if (sections.length === 0) {
      sections.push({ title: 'Panorama', content: 'Gere a síntese narrativa antes de exportar o PDF completo.' });
    }

    generateRelatorioPDF({
      clienteNome,
      periodoInicio: firstSession || null,
      periodoFim: lastSession || null,
      totalSessoes: sessions.length,
      distritosAtivos: ativos.length,
      distritosIntegrados: integrados.length,
      sections,
      traversals: traversals.map(t => ({ date: t.date, label: t.label, detail: t.detail })),
      districts: districts.map(d => ({ nome: d.nome, state: d.state, sessions_count: d.sessions_count })),
      patterns: patterns.map(p => ({ pattern_name: p.pattern_name, occurrence_count: p.occurrence_count })),
    });
    toast.success('PDF exportado com sucesso');
  };

  const ativos = districts.filter(d => d.state === 'ativo');
  const integrados = districts.filter(d => d.state === 'integrado');
  const firstSession = sessions[0]?.created_at;
  const lastSession = sessions[sessions.length - 1]?.created_at;

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <>
      <div ref={printRef} className="space-y-6 print:space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary/60" />
              Relatório Narrativo da Jornada
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {clienteNome} · {sessions.length} sessões registradas
              {firstSession && lastSession && (
                <> · {new Date(firstSession).toLocaleDateString('pt-BR')} — {new Date(lastSession).toLocaleDateString('pt-BR')}</>
              )}
            </p>
          </div>
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={handleExportPDF} className="gap-1.5 text-xs">
              <Download className="w-3.5 h-3.5" /> Exportar PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5 text-xs">
              <Printer className="w-3.5 h-3.5" /> Imprimir
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowNarrativo(true)} className="gap-1.5 text-xs">
              <Sparkles className="w-3.5 h-3.5" /> Narrativa IA
            </Button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={Calendar} label="Sessões" value={sessions.length} />
          <StatCard icon={MapPin} label="Distritos Ativos" value={ativos.length} accent />
          <StatCard icon={CheckCircle2} label="Integrados" value={integrados.length} success />
          <StatCard icon={Compass} label="Travessias" value={traversals.length} />
        </div>

        <Separator className="bg-border/30" />

        {/* Section 1: Panorama */}
        <SectionCard
          title="Panorama da Jornada"
          icon={<Eye className="w-4 h-4 text-primary/50" />}
        >
          {panorama?.narrative ? (
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              {panorama.narrative.titulo_narrativo && (
                <p className="text-primary italic text-center font-medium">"{panorama.narrative.titulo_narrativo}"</p>
              )}
              {panorama.narrative.ponto_partida && <p>{panorama.narrative.ponto_partida}</p>}
              {panorama.narrative.movimentos_principais && <p>{panorama.narrative.movimentos_principais}</p>}
              {panorama.narrative.proximo_horizonte && (
                <p className="text-primary/70 italic">{panorama.narrative.proximo_horizonte}</p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center py-6 gap-3">
              <p className="text-xs text-muted-foreground">Gere uma síntese narrativa do processo terapêutico.</p>
              <Button onClick={generatePanorama} disabled={generating} size="sm" className="gap-1.5">
                {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Gerar Panorama
              </Button>
            </div>
          )}
          {panorama && (
            <div className="flex justify-center pt-3 print:hidden">
              <Button variant="ghost" size="sm" onClick={generatePanorama} disabled={generating} className="text-xs gap-1">
                <RefreshCw className="w-3 h-3" /> Regenerar
              </Button>
            </div>
          )}
        </SectionCard>

        {/* Section 2: Territórios Mais Ativos */}
        <SectionCard
          title="Territórios Mais Ativos"
          icon={<MapPin className="w-4 h-4 text-primary/50" />}
        >
          {districts.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">Nenhum território registrado ainda.</p>
          ) : (
            <div className="space-y-2">
              {districts.filter(d => d.sessions_count > 0).slice(0, 8).map(d => (
                <div key={d.id} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-border/20">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        d.state === 'integrado' ? 'border-green-500/30 text-green-400 text-[9px]'
                        : d.state === 'ativo' ? 'border-primary/30 text-primary text-[9px]'
                        : 'border-border/30 text-muted-foreground text-[9px]'
                      }
                    >
                      {d.state}
                    </Badge>
                    <span className="text-sm text-foreground/80">{d.nome}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span>{d.sessions_count} sessões</span>
                    {d.tools_used.length > 0 && (
                      <span className="hidden sm:inline">{d.tools_used.slice(0, 2).join(', ')}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Section 3: Travessias Importantes */}
        <SectionCard
          title="Travessias Importantes"
          icon={<ArrowRight className="w-4 h-4 text-primary/50" />}
        >
          {traversals.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">Nenhuma travessia registrada.</p>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {traversals.slice(0, 15).map((t, i) => (
                <div key={i} className="flex gap-3 p-2 rounded-lg bg-muted/20 border border-border/10">
                  <TraversalIcon type={t.type} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-foreground/80">{t.label}</span>
                      {t.date && <span className="text-[9px] text-muted-foreground">{t.date}</span>}
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">{t.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Section 4: Padrões Recorrentes */}
        <SectionCard
          title="Padrões Recorrentes"
          icon={<AlertTriangle className="w-4 h-4 text-primary/50" />}
        >
          {patterns.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">Nenhum padrão identificado.</p>
          ) : (
            <div className="space-y-1.5">
              {patterns.slice(0, 10).map((p, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded bg-muted/20">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[8px] border-border/20">{p.pattern_type}</Badge>
                    <span className="text-xs text-foreground/70">{p.pattern_name}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{p.occurrence_count}×</span>
                </div>
              ))}
              <p className="text-[9px] text-muted-foreground italic text-center pt-2">
                O mapa mostra recorrência nos padrões acima. A interpretação pertence à facilitadora.
              </p>
            </div>
          )}
        </SectionCard>

        {/* Section 5: Sinais de Integração */}
        <SectionCard
          title="Sinais de Integração"
          icon={<CheckCircle2 className="w-4 h-4 text-green-500/50" />}
        >
          {integrados.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">Nenhum distrito integrado até o momento.</p>
          ) : (
            <div className="space-y-2">
              {integrados.map(d => (
                <div key={d.id} className="flex items-center justify-between p-2.5 rounded-lg bg-green-500/5 border border-green-500/10">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500/60" />
                    <span className="text-sm text-foreground/80">{d.nome}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {d.sessions_count} sessões · {d.last_session_at ? new Date(d.last_session_at).toLocaleDateString('pt-BR') : '—'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Section 6: Próximo Horizonte */}
        <SectionCard
          title="Próximo Horizonte Simbólico"
          icon={<Compass className="w-4 h-4 text-primary/50" />}
        >
          {panorama?.narrative?.proximo_horizonte ? (
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              {panorama.narrative.proximo_horizonte}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">
              Gere o Panorama para revelar o próximo horizonte simbólico.
            </p>
          )}
        </SectionCard>

        {/* Ethical footer */}
        <div className="flex items-center justify-center gap-1.5 py-3 print:py-1">
          <Eye className="w-3 h-3 text-primary/30" />
          <span className="text-[9px] text-primary/30 italic">
            Leitura simbólica da jornada. Não substitui julgamento clínico. A interpretação pertence à facilitadora.
          </span>
        </div>
      </div>

      <RelatorioNarrativo
        open={showNarrativo}
        onClose={() => setShowNarrativo(false)}
        clienteId={clienteId}
        clienteNome={clienteNome}
      />
    </>
  );
}

/* --- Sub-components --- */

function StatCard({ icon: Icon, label, value, accent, success }: {
  icon: any; label: string; value: number; accent?: boolean; success?: boolean;
}) {
  return (
    <Card className="border-border/20 bg-card/50">
      <CardContent className="p-3 flex items-center gap-2.5">
        <Icon className={`w-4 h-4 ${success ? 'text-green-500/60' : accent ? 'text-primary/60' : 'text-muted-foreground/50'}`} />
        <div>
          <p className={`text-lg font-semibold ${success ? 'text-green-400' : accent ? 'text-primary' : 'text-foreground'}`}>{value}</p>
          <p className="text-[9px] text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card className="border-border/20 bg-card/60">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-medium text-foreground/80 flex items-center gap-2">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">{children}</CardContent>
    </Card>
  );
}

function TraversalIcon({ type }: { type: string }) {
  const cls = 'w-3.5 h-3.5';
  switch (type) {
    case 'integracao': return <CheckCircle2 className={`${cls} text-green-500/60`} />;
    case 'porta': return <Shield className={`${cls} text-primary/60`} />;
    case 'arquetipo': return <Flame className={`${cls} text-orange-400/60`} />;
    case 'insight': return <Sparkles className={`${cls} text-primary/60`} />;
    default: return <MapPin className={`${cls} text-muted-foreground/50`} />;
  }
}
