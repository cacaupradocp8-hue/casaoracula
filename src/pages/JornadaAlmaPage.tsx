import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft, Loader2, Save, MapPin, Sparkles, BookOpen, Play,
  ChevronDown, ChevronUp, Calendar, CheckCircle2, Circle
} from 'lucide-react';
import { toast } from 'sonner';

// ── Journey Stages ──────────────────────────────────────────
const STAGES = [
  { key: 'mundo_comum', label: 'Mundo Comum', desc: 'O ponto de partida — a vida antes da transformação.', angle: -90 },
  { key: 'chamado_aventura', label: 'Chamado à Aventura', desc: 'Algo desperta. Um convite ao desconhecido.', angle: -60 },
  { key: 'recusa_chamado', label: 'Recusa do Chamado', desc: 'Resistência, medo, hesitação frente ao novo.', angle: -30 },
  { key: 'encontro_mentor', label: 'Encontro com o Mentor', desc: 'Uma guia surge — interna ou externa.', angle: 0 },
  { key: 'travessia_limiar', label: 'Travessia do Limiar', desc: 'A decisão de cruzar para o desconhecido.', angle: 30 },
  { key: 'provas_aliados', label: 'Provas e Aliados', desc: 'Desafios que revelam força e vulnerabilidade.', angle: 60 },
  { key: 'caverna_profunda', label: 'Caverna Profunda', desc: 'O confronto com a sombra mais íntima.', angle: 90 },
  { key: 'provacao_suprema', label: 'Provação Suprema', desc: 'A morte simbólica — o ponto de maior crise.', angle: 120 },
  { key: 'recompensa', label: 'Recompensa', desc: 'O tesouro encontrado — insight, cura, integração.', angle: 150 },
  { key: 'caminho_volta', label: 'Caminho de Volta', desc: 'A integração do aprendizado na vida cotidiana.', angle: 180 },
  { key: 'ressurreicao', label: 'Ressurreição', desc: 'Transformação consolidada — renascimento.', angle: 210 },
  { key: 'retorno_elixir', label: 'Retorno com o Elixir', desc: 'A sabedoria compartilhada — dom para o mundo.', angle: 240 },
];

interface JornadaEntry {
  id: string;
  etapa_jornada: string;
  reflexao_cliente: string;
  distritos_ativos: string[];
  arquetipos_emergentes: string[];
  data_registro: string;
}

export default function JornadaAlmaPage() {
  const { clienteId } = useParams<{ clienteId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [clienteNome, setClienteNome] = useState('');
  const [entries, setEntries] = useState<JornadaEntry[]>([]);
  const [districts, setDistricts] = useState<{ id: string; nome: string }[]>([]);
  const [archetypes, setArchetypes] = useState<{ chave: string; nome: string }[]>([]);

  // Modal state
  const [selectedStage, setSelectedStage] = useState<typeof STAGES[0] | null>(null);
  const [reflexao, setReflexao] = useState('');
  const [selDistricts, setSelDistricts] = useState<string[]>([]);
  const [selArchetypes, setSelArchetypes] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Diary expand
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (clienteId) loadAll();
  }, [clienteId]);

  async function loadAll() {
    setLoading(true);
    const [clienteRes, entriesRes, distRes, archRes] = await Promise.all([
      supabase.from('clientes').select('nome').eq('id', clienteId!).single(),
      supabase.from('jornada_individuacao').select('*').eq('client_id', clienteId!).order('data_registro', { ascending: false }),
      supabase.from('districts').select('id, nome').order('numero'),
      supabase.from('atlas_arquetipos_femininos').select('chave, nome').eq('ativo', true).order('ordem'),
    ]);
    setClienteNome(clienteRes.data?.nome || '');
    setEntries((entriesRes.data as JornadaEntry[]) || []);
    setDistricts(distRes.data || []);
    setArchetypes(archRes.data || []);
    setLoading(false);
  }

  function openStageModal(stage: typeof STAGES[0]) {
    // Pre-fill with existing entry if any
    const existing = entries.find(e => e.etapa_jornada === stage.key);
    setSelectedStage(stage);
    setReflexao(existing?.reflexao_cliente || '');
    setSelDistricts(existing?.distritos_ativos || []);
    setSelArchetypes(existing?.arquetipos_emergentes || []);
  }

  async function handleSaveReflection() {
    if (!selectedStage || !clienteId || !user) return;
    setSaving(true);
    try {
      const existing = entries.find(e => e.etapa_jornada === selectedStage.key);
      if (existing) {
        await supabase.from('jornada_individuacao').update({
          reflexao_cliente: reflexao,
          distritos_ativos: selDistricts,
          arquetipos_emergentes: selArchetypes,
          updated_at: new Date().toISOString(),
        } as any).eq('id', existing.id);
      } else {
        await supabase.from('jornada_individuacao').insert({
          client_id: clienteId,
          therapist_id: user.id,
          etapa_jornada: selectedStage.key,
          reflexao_cliente: reflexao,
          distritos_ativos: selDistricts,
          arquetipos_emergentes: selArchetypes,
        } as any);
      }
      toast.success('Reflexão salva');
      setSelectedStage(null);
      await loadAll();
    } catch (e) {
      console.error(e);
      toast.error('Erro ao salvar');
    }
    setSaving(false);
  }

  function toggleItem(arr: string[], item: string, setter: (v: string[]) => void) {
    setter(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]);
  }

  const stageHasEntry = (key: string) => entries.some(e => e.etapa_jornada === key);
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // SVG map positions — elliptical path
  const cx = 200, cy = 160, rx = 170, ry = 120;
  const getStagePos = (idx: number) => {
    const angle = ((idx / STAGES.length) * 360 - 90) * (Math.PI / 180);
    return { x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">Jornada da Alma</h1>
              <p className="text-xs text-muted-foreground">{clienteNome} · Mapeando a Individuação</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Visão Geral</TabsTrigger>
            <TabsTrigger value="map" className="gap-1.5"><MapPin className="w-3.5 h-3.5" /> Mapa da Jornada</TabsTrigger>
            <TabsTrigger value="diary" className="gap-1.5"><Calendar className="w-3.5 h-3.5" /> Diário</TabsTrigger>
          </TabsList>

          {/* ── Overview ──────────────────────────────────── */}
          <TabsContent value="overview">
            <Card className="border-border bg-card max-w-2xl">
              <CardContent className="p-8 space-y-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center space-y-3">
                  <h2 className="text-xl font-bold text-foreground">Jornada da Alma: Mapeando a Individuação</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
                    Esta ferramenta guia o mapeamento simbólico do processo de individuação da cliente
                    através das 12 etapas da Jornada da Heroína. Cada etapa permite registrar reflexões,
                    distritos ativos da CidaDELA e arquétipos emergentes, construindo um diário vivo
                    da transformação interior.
                  </p>
                </div>
                <Separator />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">{STAGES.length}</p>
                    <p className="text-xs text-muted-foreground">Etapas</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{entries.length}</p>
                    <p className="text-xs text-muted-foreground">Reflexões</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#556B57]">
                      {new Set(entries.map(e => e.etapa_jornada)).size}
                    </p>
                    <p className="text-xs text-muted-foreground">Etapas Visitadas</p>
                  </div>
                </div>
                <Button className="w-full gap-2" onClick={() => setTab('map')}>
                  <Play className="w-4 h-4" /> Iniciar Jornada
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Map ───────────────────────────────────────── */}
          <TabsContent value="map">
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-4 overflow-x-auto">
                <svg viewBox="0 0 400 320" className="w-full max-w-[600px] mx-auto" style={{ minWidth: 400 }}>
                  <defs>
                    <radialGradient id="jornada-center">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Ellipse path */}
                  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none"
                    stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="4 3" />
                  <circle cx={cx} cy={cy} r="20" fill="url(#jornada-center)" />
                  <text x={cx} y={cy - 3} textAnchor="middle" fill="hsl(var(--primary))" fontSize="7" fontWeight="600" opacity="0.6">Praça</text>
                  <text x={cx} y={cy + 5} textAnchor="middle" fill="hsl(var(--primary))" fontSize="7" fontWeight="600" opacity="0.6">do Ser</text>

                  {/* Connection lines */}
                  {STAGES.map((_, idx) => {
                    const p1 = getStagePos(idx);
                    const p2 = getStagePos((idx + 1) % STAGES.length);
                    const hasP1 = stageHasEntry(STAGES[idx].key);
                    const hasP2 = stageHasEntry(STAGES[(idx + 1) % STAGES.length].key);
                    return (
                      <line key={`line-${idx}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                        stroke={hasP1 && hasP2 ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                        strokeWidth={hasP1 && hasP2 ? '1.5' : '0.5'} strokeOpacity={hasP1 && hasP2 ? 0.6 : 0.3} />
                    );
                  })}

                  {/* Stage nodes */}
                  {STAGES.map((stage, idx) => {
                    const pos = getStagePos(idx);
                    const has = stageHasEntry(stage.key);
                    return (
                      <g key={stage.key} className="cursor-pointer" onClick={() => openStageModal(stage)}>
                        {has && (
                          <circle cx={pos.x} cy={pos.y} r="16" fill="none"
                            stroke="hsl(var(--primary))" strokeWidth="0.5" strokeOpacity="0.3">
                            <animate attributeName="r" values="14;17;14" dur="3s" repeatCount="indefinite" />
                          </circle>
                        )}
                        <circle cx={pos.x} cy={pos.y} r="12"
                          fill={has ? 'hsla(var(--primary), 0.12)' : 'hsla(var(--muted), 0.3)'}
                          stroke={has ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                          strokeWidth={has ? '1.5' : '0.8'} />
                        <text x={pos.x} y={pos.y + 1} textAnchor="middle"
                          fill={has ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                          fontSize="7" fontWeight="600">
                          {idx + 1}
                        </text>
                        <text x={pos.x} y={pos.y + 22} textAnchor="middle"
                          fill={has ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'}
                          fontSize="5.5" fontWeight="500">
                          {stage.label.length > 18 ? stage.label.slice(0, 17) + '…' : stage.label}
                        </text>
                        {has && (
                          <g transform={`translate(${pos.x + 8}, ${pos.y - 8})`}>
                            <circle r="3.5" fill="hsl(var(--primary))" />
                            <polyline points="-1.2,0 -0.3,1 1.2,-0.8" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth="0.8" strokeLinecap="round" />
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Stage list for mobile */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {STAGES.map((stage, idx) => {
                  const has = stageHasEntry(stage.key);
                  return (
                    <button key={stage.key} onClick={() => openStageModal(stage)}
                      className={`p-3 rounded-lg border text-left transition-all hover:shadow-sm ${
                        has ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'
                      }`}>
                      <div className="flex items-center gap-2 mb-1">
                        {has ? <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> : <Circle className="w-3.5 h-3.5 text-muted-foreground/30" />}
                        <span className="text-[10px] text-muted-foreground">Etapa {idx + 1}</span>
                      </div>
                      <p className={`text-xs font-medium ${has ? 'text-foreground' : 'text-muted-foreground'}`}>{stage.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* ── Diary ─────────────────────────────────────── */}
          <TabsContent value="diary">
            <div className="space-y-3">
              {entries.length === 0 ? (
                <Card className="border-border bg-card">
                  <CardContent className="py-12 text-center">
                    <BookOpen className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Nenhuma reflexão registrada</p>
                    <Button variant="outline" size="sm" className="mt-3" onClick={() => setTab('map')}>
                      Ir ao Mapa
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                entries.map(entry => {
                  const stage = STAGES.find(s => s.key === entry.etapa_jornada);
                  const isExpanded = expandedId === entry.id;
                  return (
                    <Card key={entry.id} className="border-border bg-card">
                      <button className="w-full text-left p-4" onClick={() => setExpandedId(isExpanded ? null : entry.id)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-primary">
                                {stage ? STAGES.indexOf(stage) + 1 : '?'}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{stage?.label || entry.etapa_jornada}</p>
                              <p className="text-[10px] text-muted-foreground">{fmtDate(entry.data_registro)}</p>
                            </div>
                          </div>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </button>
                      {isExpanded && (
                        <CardContent className="pt-0 pb-4 space-y-3">
                          <Separator />
                          <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">{entry.reflexao_cliente}</p>
                          {entry.distritos_ativos?.length > 0 && (
                            <div>
                              <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Distritos Ativos</label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {entry.distritos_ativos.map(d => (
                                  <Badge key={d} variant="outline" className="text-[10px] border-primary/20 text-primary/70">{d}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {entry.arquetipos_emergentes?.length > 0 && (
                            <div>
                              <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Arquétipos Emergentes</label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {entry.arquetipos_emergentes.map(a => (
                                  <Badge key={a} variant="outline" className="text-[10px] border-[#7B68EE]/20 text-[#7B68EE]">{a}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ── Stage Modal ────────────────────────────────────── */}
      <Dialog open={!!selectedStage} onOpenChange={open => { if (!open) setSelectedStage(null); }}>
        <DialogContent className="bg-background border-border max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">
                  {selectedStage ? STAGES.indexOf(selectedStage) + 1 : ''}
                </span>
              </div>
              {selectedStage?.label}
            </DialogTitle>
          </DialogHeader>

          {selectedStage && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground italic">{selectedStage.desc}</p>
              <Separator />

              {/* Reflexão */}
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Reflexão da Cliente</label>
                <Textarea value={reflexao} onChange={e => setReflexao(e.target.value)}
                  placeholder="O que emerge nesta etapa da jornada?"
                  className="min-h-[120px] bg-card border-border" />
              </div>

              {/* Distritos */}
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Distritos Ativos da CidaDELA</label>
                <div className="flex flex-wrap gap-1.5">
                  {districts.map(d => (
                    <button key={d.id} onClick={() => toggleItem(selDistricts, d.nome, setSelDistricts)}
                      className={`px-2.5 py-1 rounded-full text-[10px] border transition-all ${
                        selDistricts.includes(d.nome)
                          ? 'border-primary/40 bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/20'
                      }`}>
                      {d.nome}
                    </button>
                  ))}
                </div>
              </div>

              {/* Arquétipos */}
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Arquétipos Emergentes</label>
                <div className="flex flex-wrap gap-1.5">
                  {archetypes.map(a => (
                    <button key={a.chave} onClick={() => toggleItem(selArchetypes, a.nome, setSelArchetypes)}
                      className={`px-2.5 py-1 rounded-full text-[10px] border transition-all ${
                        selArchetypes.includes(a.nome)
                          ? 'border-[#7B68EE]/40 bg-[#7B68EE]/10 text-[#7B68EE]'
                          : 'border-border text-muted-foreground hover:border-[#7B68EE]/20'
                      }`}>
                      {a.nome}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedStage(null)}>Cancelar</Button>
            <Button onClick={handleSaveReflection} disabled={saving || !reflexao.trim()} className="gap-1.5">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Salvar Reflexão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
