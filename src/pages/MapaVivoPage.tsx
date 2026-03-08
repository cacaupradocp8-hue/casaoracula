import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import {
  ArrowLeft, Save, MapPin, Sparkles, X, Maximize2, Minimize2, Info,
  Loader2, Brain, Compass, Link2, AlertTriangle, RefreshCw, Eye
} from 'lucide-react';
import { toast } from 'sonner';

// ── Types ───────────────────────────────────────────────────
interface District {
  id: string;
  numero: number;
  nome: string;
  descricao: string;
  icone: string;
  cor: string;
}

interface JourneyDistrict {
  id: string;
  district_id: string;
  state: string;
  sessions_count: number;
  last_session_at: string | null;
  notes: string | null;
}

interface AiInsights {
  voz_cidadela: string;
  proximo_limiar: string;
  conexoes_simbolicas: string[];
}

// ── Styles ──────────────────────────────────────────────────
const STATE_STYLES = {
  inativo: { fill: 'rgba(245,241,232,0.03)', stroke: 'rgba(245,241,232,0.12)', iconColor: 'rgba(245,241,232,0.25)', textColor: 'rgba(245,241,232,0.3)' },
  ativo: { fill: 'rgba(201,162,74,0.1)', stroke: 'rgba(201,162,74,0.5)', iconColor: '#C9A24A', textColor: '#C9A24A' },
  integrado: { fill: 'rgba(85,107,87,0.12)', stroke: '#C9A24A', iconColor: '#556B57', textColor: '#556B57' },
};

const STATE_LABELS: Record<string, { label: string; cls: string }> = {
  inativo: { label: 'Inativo', cls: 'border-muted-foreground/20 text-muted-foreground' },
  ativo: { label: 'Ativo', cls: 'border-primary/30 text-primary' },
  integrado: { label: 'Integrado', cls: 'border-[#556B57]/30 text-[#556B57]' },
};

const DISTRICT_ICONS: Record<number, (color: string) => JSX.Element> = {
  1: (c) => <g><rect x="8" y="5" width="8" height="14" rx="1" fill="none" stroke={c} strokeWidth="1.5"/><circle cx="14" cy="12" r="1" fill={c}/></g>,
  2: (c) => <g><rect x="9" y="7" width="6" height="12" rx="0.5" fill="none" stroke={c} strokeWidth="1.5"/><line x1="12" y1="4" x2="12" y2="7" stroke={c} strokeWidth="1.5"/><line x1="10" y1="5" x2="14" y2="5" stroke={c} strokeWidth="1.5"/></g>,
  3: (c) => <g><circle cx="12" cy="8" r="3" fill="none" stroke={c} strokeWidth="1.5"/><line x1="12" y1="11" x2="12" y2="18" stroke={c} strokeWidth="1.5"/><line x1="12" y1="15" x2="14" y2="15" stroke={c} strokeWidth="1.2"/></g>,
  4: (c) => <g><circle cx="12" cy="10" r="2" fill="none" stroke={c} strokeWidth="1.5"/><circle cx="10" cy="8" r="1.5" fill="none" stroke={c} strokeWidth="1"/><circle cx="14" cy="8" r="1.5" fill="none" stroke={c} strokeWidth="1"/><line x1="12" y1="12" x2="12" y2="18" stroke={c} strokeWidth="1.5"/></g>,
  5: (c) => <g><polyline points="14,4 10,11 13,11 9,20" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></g>,
  6: (c) => <g><path d="M14 6 A6 6 0 1 0 14 18 A4 4 0 1 1 14 6" fill="none" stroke={c} strokeWidth="1.5"/></g>,
  7: (c) => <g><ellipse cx="12" cy="10" rx="4" ry="5" fill="none" stroke={c} strokeWidth="1.5"/><line x1="12" y1="15" x2="12" y2="19" stroke={c} strokeWidth="1.5"/><line x1="9" y1="19" x2="15" y2="19" stroke={c} strokeWidth="1.5"/></g>,
  8: (c) => <g><rect x="8" y="12" width="8" height="3" rx="0.5" fill="none" stroke={c} strokeWidth="1.5"/><line x1="12" y1="5" x2="12" y2="12" stroke={c} strokeWidth="1.5"/><circle cx="12" cy="5" r="1.5" fill="none" stroke={c} strokeWidth="1.2"/></g>,
  9: (c) => <g><circle cx="12" cy="12" r="5" fill="none" stroke={c} strokeWidth="1.2" strokeDasharray="2 2"/><circle cx="12" cy="7" r="1" fill={c}/><circle cx="12" cy="17" r="1" fill={c}/><circle cx="7" cy="12" r="1" fill={c}/><circle cx="17" cy="12" r="1" fill={c}/></g>,
  10: (c) => <g><path d="M12 12 m-1,0 a1,1 0 1,1 2,0 a2,2 0 1,1 -4,0 a3,3 0 1,1 6,0 a4,4 0 1,1 -8,0 a5,5 0 1,1 10,0" fill="none" stroke={c} strokeWidth="1.2"/></g>,
  11: (c) => <g><circle cx="12" cy="12" r="5" fill="none" stroke={c} strokeWidth="1.2"/><line x1="12" y1="7" x2="12" y2="17" stroke={c} strokeWidth="1"/><line x1="7" y1="12" x2="17" y2="12" stroke={c} strokeWidth="1"/><circle cx="12" cy="12" r="2" fill="none" stroke={c} strokeWidth="1"/></g>,
  12: (c) => <g><path d="M6 16 Q12 6 18 16" fill="none" stroke={c} strokeWidth="1.5"/><line x1="12" y1="8" x2="12" y2="5" stroke={c} strokeWidth="1.2"/><line x1="8" y1="10" x2="6" y2="8" stroke={c} strokeWidth="1.2"/><line x1="16" y1="10" x2="18" y2="8" stroke={c} strokeWidth="1.2"/></g>,
};

// ── Page ────────────────────────────────────────────────────
export default function MapaVivoPage() {
  const { clienteId } = useParams<{ clienteId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [cliente, setCliente] = useState<any>(null);
  const [districts, setDistricts] = useState<District[]>([]);
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [journeyDistricts, setJourneyDistricts] = useState<JourneyDistrict[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [patterns, setPatterns] = useState<any[]>([]);

  // District editing
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editState, setEditState] = useState('inativo');
  const [saving, setSaving] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  // State change modal
  const [changeModalOpen, setChangeModalOpen] = useState(false);
  const [pendingState, setPendingState] = useState('');
  const [changeReason, setChangeReason] = useState('');

  // AI Insights
  const [insights, setInsights] = useState<AiInsights | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  // ── Data loading ──────────────────────────────────────────
  useEffect(() => {
    if (clienteId) loadAll();
  }, [clienteId]);

  const loadAll = async () => {
    setLoading(true);
    const [clienteRes, distRes, sessRes, patternsRes] = await Promise.all([
      supabase.from('clientes').select('id, nome, archetypal_profile_json').eq('id', clienteId!).single(),
      supabase.from('districts').select('*').order('numero'),
      supabase.from('sessions').select('id, district_id, created_at, checkin_state').eq('client_id', clienteId!).order('created_at', { ascending: true }),
      supabase.from('client_pattern_stats').select('pattern_type, pattern_name, occurrence_count').eq('client_id', clienteId!).order('occurrence_count', { ascending: false }).limit(20),
    ]);

    setCliente(clienteRes.data);
    setDistricts(distRes.data || []);
    setSessions(sessRes.data || []);
    setPatterns(patternsRes.data || []);

    const { data: journeys } = await supabase
      .from('journeys').select('id').eq('client_id', clienteId!).limit(1);

    if (journeys?.length) {
      setJourneyId(journeys[0].id);
      const { data: jd } = await supabase
        .from('journey_districts').select('id, district_id, state, sessions_count, last_session_at, notes')
        .eq('journey_id', journeys[0].id);
      setJourneyDistricts((jd as JourneyDistrict[]) || []);
    } else {
      const { data: newJ } = await supabase
        .from('journeys').insert({ client_id: clienteId! }).select('id').single();
      if (newJ) {
        setJourneyId(newJ.id);
        const allDists = distRes.data || [];
        const inserts = allDists.map(d => ({ journey_id: newJ.id, district_id: d.id, state: 'inativo' }));
        if (inserts.length) {
          await supabase.from('journey_districts').insert(inserts);
          const { data: jd } = await supabase
            .from('journey_districts').select('id, district_id, state, sessions_count, last_session_at, notes')
            .eq('journey_id', newJ.id);
          setJourneyDistricts((jd as JourneyDistrict[]) || []);
        }
      }
    }
    setLoading(false);
  };

  // ── AI Insights ───────────────────────────────────────────
  const loadInsights = async () => {
    if (!clienteId) return;
    setInsightsLoading(true);
    setInsightsError(null);
    try {
      const { data, error } = await supabase.functions.invoke('mapa-vivo-insights', {
        body: { client_id: clienteId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setInsights(data as AiInsights);
    } catch (e: any) {
      console.error('Insights error:', e);
      setInsightsError(e.message || 'Erro ao gerar insights');
    } finally {
      setInsightsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && clienteId) loadInsights();
  }, [loading, clienteId]);

  // ── Helpers ───────────────────────────────────────────────
  const getJD = (districtId: string) => journeyDistricts.find(j => j.district_id === districtId);
  const getState = (id: string) => getJD(id)?.state || 'inativo';

  const visitCounts = useMemo(() => {
    const map: Record<string, number> = {};
    sessions.forEach(s => { if (s.district_id) map[s.district_id] = (map[s.district_id] || 0) + 1; });
    return map;
  }, [sessions]);

  const visitedPath = journeyDistricts
    .filter(jd => jd.state !== 'inativo' && jd.last_session_at)
    .sort((a, b) => new Date(a.last_session_at!).getTime() - new Date(b.last_session_at!).getTime());

  // ── District click / edit ─────────────────────────────────
  const handleDistrictClick = (d: District) => {
    setSelectedDistrict(d);
    const jd = getJD(d.id);
    setEditNotes(jd?.notes || '');
    setEditState(jd?.state || 'inativo');
  };

  const handleStateChangeRequest = (newState: string) => {
    if (newState === editState) return;
    setPendingState(newState);
    setChangeReason('');
    setChangeModalOpen(true);
  };

  const confirmStateChange = async () => {
    if (!changeReason.trim()) { toast.error('Justificativa é obrigatória.'); return; }
    if (!selectedDistrict || !journeyId) return;
    setSaving(true);
    try {
      await supabase.from('district_state_changes').insert({
        client_id: clienteId!, district_id: selectedDistrict.id,
        changed_by_user_id: user?.id || '', from_state: editState,
        to_state: pendingState, reason: changeReason.trim(),
      });
      await supabase.from('journey_districts').update({ state: pendingState })
        .eq('journey_id', journeyId).eq('district_id', selectedDistrict.id);
      setEditState(pendingState);
      setChangeModalOpen(false);
      toast.success(`Distrito atualizado para ${pendingState}.`);
      await loadAll();
    } catch { toast.error('Erro ao alterar estado.'); }
    finally { setSaving(false); }
  };

  const handleSaveNotes = async () => {
    if (!selectedDistrict || !journeyId) return;
    setSaving(true);
    try {
      await supabase.from('journey_districts').update({ notes: editNotes || null } as any)
        .eq('journey_id', journeyId).eq('district_id', selectedDistrict.id);
      toast.success('Anotações salvas.');
      setJourneyDistricts(prev => prev.map(jd => jd.district_id === selectedDistrict.id ? { ...jd, notes: editNotes || null } : jd));
    } catch { toast.error('Erro ao salvar.'); }
    finally { setSaving(false); }
  };

  // ── SVG helpers ───────────────────────────────────────────
  const cx = 50, cy = 50, r = 36, nodeR = 4.5;
  const getPos = (num: number) => {
    const a = ((num - 1) * 30 - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  const pathPoints = visitedPath.map(jd => {
    const d = districts.find(dd => dd.id === jd.district_id);
    return d ? getPos(d.numero) : null;
  }).filter(Boolean) as { x: number; y: number }[];

  const pathD = pathPoints.length > 1
    ? `M ${pathPoints.map(p => `${p.x},${p.y}`).join(' L ')}` : '';

  // District archetypes + interventions from patterns
  const districtArchetypes = useMemo(() => {
    return patterns.filter(p => p.pattern_type === 'archetype').slice(0, 5);
  }, [patterns]);

  const districtInterventions = useMemo(() => {
    return patterns.filter(p => p.pattern_type === 'tool').slice(0, 5);
  }, [patterns]);

  // ── Render ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const badge = selectedDistrict ? (STATE_LABELS[editState] || STATE_LABELS.inativo) : null;

  const renderMap = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <filter id="glow-mv"><feGaussianBlur stdDeviation="0.8" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <linearGradient id="path-grad-mv" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.1" /><stop offset="50%" stopColor="#C9A24A" stopOpacity="0.6" /><stop offset="100%" stopColor="#C9A24A" stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id="center-glow-mv"><stop offset="0%" stopColor="#C9A24A" stopOpacity="0.08" /><stop offset="100%" stopColor="#C9A24A" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r + 5} fill="none" stroke="rgba(201,162,74,0.03)" strokeWidth="0.15" />
      <circle cx={cx} cy={cy} r={r + 3} fill="none" stroke="rgba(201,162,74,0.06)" strokeWidth="0.2" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(201,162,74,0.08)" strokeWidth="0.15" strokeDasharray="0.8 1.2" />
      {pathD && (
        <>
          <path d={pathD} fill="none" stroke="url(#path-grad-mv)" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow-mv)">
            <animate attributeName="stroke-dashoffset" from="20" to="0" dur="3s" repeatCount="indefinite" />
          </path>
          <path d={pathD} fill="none" stroke="#C9A24A" strokeWidth="0.3" strokeOpacity="0.4" strokeDasharray="1.5 1" strokeLinecap="round">
            <animate attributeName="stroke-dashoffset" values="0;-3" dur="2s" repeatCount="indefinite" />
          </path>
        </>
      )}
      <circle cx={cx} cy={cy} r="8" fill="url(#center-glow-mv)" />
      <circle cx={cx} cy={cy} r="6" fill="rgba(201,162,74,0.05)" stroke="rgba(201,162,74,0.15)" strokeWidth="0.3" />
      <circle cx={cx} cy={cy} r="3" fill="rgba(201,162,74,0.08)" stroke="rgba(201,162,74,0.2)" strokeWidth="0.2">
        <animate attributeName="r" values="2.8;3.2;2.8" dur="4s" repeatCount="indefinite" />
      </circle>
      <text x={cx} y={cy - 1} textAnchor="middle" fill="#C9A24A" fontSize="2" fontWeight="600" opacity="0.7">Praça</text>
      <text x={cx} y={cy + 1.5} textAnchor="middle" fill="#C9A24A" fontSize="2" fontWeight="600" opacity="0.7">do Ser</text>
      {districts.map(d => {
        const pos = getPos(d.numero);
        const state = getState(d.id);
        const style = STATE_STYLES[state as keyof typeof STATE_STYLES] || STATE_STYLES.inativo;
        const isIntegrado = state === 'integrado';
        const isSelected = selectedDistrict?.id === d.id;
        const visits = visitCounts[d.id] || 0;
        return (
          <g key={d.id} className="cursor-pointer" onClick={() => handleDistrictClick(d)}>
            {isSelected && (
              <circle cx={pos.x} cy={pos.y} r={nodeR + 2} fill="none" stroke="#C9A24A" strokeWidth="0.4" strokeDasharray="1 0.5">
                <animate attributeName="stroke-opacity" values="0.4;0.8;0.4" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}
            {state !== 'inativo' && (
              <circle cx={pos.x} cy={pos.y} r={nodeR + 1.2} fill="none" stroke={style.stroke} strokeWidth="0.15" strokeOpacity="0.3" filter="url(#glow-mv)">
                <animate attributeName="r" values={`${nodeR + 0.8};${nodeR + 1.5};${nodeR + 0.8}`} dur="3s" repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={pos.x} cy={pos.y} r={nodeR} fill={style.fill} stroke={style.stroke} strokeWidth={isIntegrado ? '0.6' : '0.4'} />
            <svg x={pos.x - nodeR} y={pos.y - nodeR} width={nodeR * 2} height={nodeR * 2} viewBox="0 0 24 24">
              {DISTRICT_ICONS[d.numero]?.(style.iconColor) ?? (
                <text x="12" y="14" textAnchor="middle" fill={style.iconColor} fontSize="8" fontWeight="bold">{d.numero}</text>
              )}
            </svg>
            {isIntegrado && (
              <g transform={`translate(${pos.x + nodeR * 0.6}, ${pos.y - nodeR * 0.6})`}>
                <circle r="1.5" fill="#C9A24A" />
                <polyline points="-0.6,0 -0.15,0.5 0.6,-0.4" fill="none" stroke="#0B1B2B" strokeWidth="0.4" strokeLinecap="round" />
              </g>
            )}
            <text x={pos.x} y={pos.y + nodeR + 2.5} textAnchor="middle" fill={style.textColor} fontSize="1.8" fontWeight="500" opacity="0.8">
              {d.nome.length > 12 ? d.nome.slice(0, 11) + '…' : d.nome}
            </text>
            {visits > 0 && (
              <text x={pos.x} y={pos.y + nodeR + 4.2} textAnchor="middle" fill="#C9A24A" fontSize="1.4" opacity="0.5">{visits}s</text>
            )}
          </g>
        );
      })}
    </svg>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" /> Mapa Vivo da Psique
              </h1>
              <p className="text-xs text-muted-foreground">{cliente?.nome}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs"
              onClick={() => navigate(`/saas/clientes/${clienteId}/mapa-cidadela`)}>
              <MapPin className="w-3.5 h-3.5" /> Mapa Clássico
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs"
              onClick={() => setFullscreen(true)}>
              <Maximize2 className="w-3.5 h-3.5" /> Tela Cheia
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6 flex-col lg:flex-row">

          {/* ── Map + District Detail ────────────────────── */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Map */}
            <div className="relative w-full max-w-[520px] mx-auto" style={{ aspectRatio: '1/1' }}>
              {renderMap()}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-5">
              {Object.entries(STATE_LABELS).map(([key, { label, cls }]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full border"
                    style={{
                      backgroundColor: STATE_STYLES[key as keyof typeof STATE_STYLES].fill,
                      borderColor: STATE_STYLES[key as keyof typeof STATE_STYLES].stroke,
                    }} />
                  <span className={`text-[10px] ${cls}`}>{label}</span>
                </div>
              ))}
            </div>
            <p className="text-[9px] text-muted-foreground/40 text-center italic">
              Ferramenta de leitura simbólica. Não substitui julgamento clínico.
            </p>

            {/* District Detail Panel */}
            {selectedDistrict && (
              <Card className="border-border bg-card">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{selectedDistrict.nome}</CardTitle>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="outline" className={`text-[9px] ${badge?.cls}`}>{badge?.label}</Badge>
                          <span className="text-[10px] text-muted-foreground">Distrito {selectedDistrict.numero} · {visitCounts[selectedDistrict.id] || 0} sessões</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedDistrict(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-muted-foreground">{selectedDistrict.descricao}</p>
                  <Separator />

                  {/* State controls */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-primary/60 mb-2">
                      <Info className="w-3 h-3" /> Estado do Distrito
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(['inativo', 'ativo', 'integrado'] as const).map(st => (
                        <Button key={st} variant="outline" size="sm"
                          className={`text-xs h-8 ${editState === st ? 'border-primary/40 text-primary bg-primary/10' : 'border-border text-muted-foreground'}`}
                          onClick={() => handleStateChangeRequest(st)} disabled={editState === st}>
                          {STATE_LABELS[st].label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Archetypes associated */}
                  {districtArchetypes.length > 0 && (
                    <div>
                      <label className="text-xs uppercase tracking-wider text-primary/60 mb-2 block">Arquétipos Associados</label>
                      <div className="flex flex-wrap gap-1.5">
                        {districtArchetypes.map(a => (
                          <Badge key={a.pattern_name} variant="outline" className="text-xs border-primary/20 text-primary/70">
                            {a.pattern_name} ({a.occurrence_count}x)
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested interventions */}
                  {districtInterventions.length > 0 && (
                    <div>
                      <label className="text-xs uppercase tracking-wider text-primary/60 mb-2 block">Intervenções Sugeridas</label>
                      <div className="flex flex-wrap gap-1.5">
                        {districtInterventions.map(i => (
                          <Badge key={i.pattern_name} variant="outline" className="text-xs border-[#7B68EE]/20 text-[#7B68EE]">
                            {i.pattern_name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Notes */}
                  <div>
                    <label className="text-xs uppercase tracking-wider text-primary/60 mb-2 block">Anotações</label>
                    <Textarea
                      value={editNotes} onChange={e => setEditNotes(e.target.value)}
                      placeholder="Anotações sobre este distrito..."
                      className="min-h-[80px] text-sm bg-card border-border"
                    />
                  </div>

                  <Button onClick={handleSaveNotes} disabled={saving} className="w-full gap-2" size="sm">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Salvar Alterações
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ── AI Insights Sidebar ─────────────────────── */}
          <div className="w-full lg:w-80 shrink-0 space-y-4">

            {/* Voz da CidaDELA */}
            <Card className="border-primary/10 bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                  <Brain className="w-4 h-4 text-primary" /> Voz da CidaDELA
                </CardTitle>
              </CardHeader>
              <CardContent>
                {insightsLoading ? (
                  <div className="flex items-center gap-2 py-4">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground">Escutando a CidaDELA…</span>
                  </div>
                ) : insightsError ? (
                  <div className="space-y-2">
                    <p className="text-xs text-destructive">{insightsError}</p>
                    <Button variant="outline" size="sm" onClick={loadInsights} className="gap-1.5 text-xs">
                      <RefreshCw className="w-3 h-3" /> Tentar novamente
                    </Button>
                  </div>
                ) : insights ? (
                  <p className="text-xs text-muted-foreground leading-relaxed italic">{insights.voz_cidadela}</p>
                ) : null}
              </CardContent>
            </Card>

            {/* Próximo Limiar */}
            <Card className="border-primary/10 bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                  <Compass className="w-4 h-4 text-primary" /> Próximo Limiar Sugerido
                </CardTitle>
              </CardHeader>
              <CardContent>
                {insightsLoading ? (
                  <div className="h-8 flex items-center"><Loader2 className="w-4 h-4 animate-spin text-primary" /></div>
                ) : insights ? (
                  <p className="text-xs text-muted-foreground leading-relaxed">{insights.proximo_limiar}</p>
                ) : (
                  <p className="text-xs text-muted-foreground/40 italic">Aguardando leitura…</p>
                )}
              </CardContent>
            </Card>

            {/* Conexões Simbólicas */}
            <Card className="border-primary/10 bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                  <Link2 className="w-4 h-4 text-primary" /> Conexões Simbólicas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {insightsLoading ? (
                  <div className="h-8 flex items-center"><Loader2 className="w-4 h-4 animate-spin text-primary" /></div>
                ) : insights?.conexoes_simbolicas?.length ? (
                  <ul className="space-y-2">
                    {insights.conexoes_simbolicas.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Sparkles className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                        <span className="text-xs text-muted-foreground leading-relaxed">{c}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground/40 italic">Nenhuma conexão identificada</p>
                )}
              </CardContent>
            </Card>

            {/* Refresh */}
            <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs" onClick={loadInsights} disabled={insightsLoading}>
              <RefreshCw className={`w-3 h-3 ${insightsLoading ? 'animate-spin' : ''}`} />
              Atualizar Insights
            </Button>

            {/* Ethical notice */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border">
              <AlertTriangle className="w-3.5 h-3.5 text-primary/50 mt-0.5 shrink-0" />
              <p className="text-[9px] text-muted-foreground/60 leading-relaxed">
                Ferramenta de leitura simbólica. Os insights são hipóteses e não substituem o julgamento clínico da facilitadora. Uso exclusivamente profissional.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Dialog */}
      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent className="max-w-[95vw] w-[95vw] max-h-[95vh] h-[95vh] bg-background border-border p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-foreground/70 flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary/60" />
              Mapa Vivo — {cliente?.nome}
            </h2>
            <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5" onClick={() => setFullscreen(false)}>
              <Minimize2 className="w-3 h-3" /> Sair
            </Button>
          </div>
          <div className="flex-1 flex items-center justify-center overflow-auto">
            <div className="w-full max-w-[700px]" style={{ aspectRatio: '1/1' }}>
              {renderMap()}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* State change modal */}
      <Dialog open={changeModalOpen} onOpenChange={setChangeModalOpen}>
        <DialogContent className="bg-background border-border max-w-md">
          <DialogHeader>
            <DialogTitle>Alterar Estado do Distrito</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {selectedDistrict?.nome}: {editState} → {pendingState}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <label className="text-xs text-muted-foreground">Justificativa (obrigatório)</label>
            <Textarea value={changeReason} onChange={e => setChangeReason(e.target.value)}
              placeholder="Descreva o motivo da alteração..."
              className="min-h-[80px] bg-card border-border" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangeModalOpen(false)}>Cancelar</Button>
            <Button onClick={confirmStateChange} disabled={saving || !changeReason.trim()}>
              {saving ? 'Salvando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
