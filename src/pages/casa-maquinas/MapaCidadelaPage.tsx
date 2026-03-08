import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Loader2, ArrowLeft, Save, MapPin, Sparkles, X, Maximize2, Minimize2, Info, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

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

const STATE_STYLES = {
  inativo: {
    fill: 'rgba(245,241,232,0.03)',
    stroke: 'rgba(245,241,232,0.12)',
    iconColor: 'rgba(245,241,232,0.25)',
    textColor: 'rgba(245,241,232,0.3)',
  },
  ativo: {
    fill: 'rgba(201,162,74,0.1)',
    stroke: 'rgba(201,162,74,0.5)',
    iconColor: '#C9A24A',
    textColor: '#C9A24A',
  },
  integrado: {
    fill: 'rgba(85,107,87,0.12)',
    stroke: '#C9A24A',
    iconColor: '#556B57',
    textColor: '#556B57',
  },
};

const STATE_LABELS: Record<string, { label: string; cls: string }> = {
  inativo: { label: 'Inativo', cls: 'border-[#F5F1E8]/10 text-[#F5F1E8]/30' },
  ativo: { label: 'Ativo', cls: 'border-[#C9A24A]/30 text-[#C9A24A]' },
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

export default function MapaCidadelaPage() {
  const { clienteId } = useParams<{ clienteId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [cliente, setCliente] = useState<any>(null);
  const [districts, setDistricts] = useState<District[]>([]);
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [journeyDistricts, setJourneyDistricts] = useState<JourneyDistrict[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editing
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editState, setEditState] = useState('inativo');
  const [fullscreen, setFullscreen] = useState(false);

  // State change modal
  const [changeModalOpen, setChangeModalOpen] = useState(false);
  const [pendingState, setPendingState] = useState('');
  const [changeReason, setChangeReason] = useState('');

  useEffect(() => {
    if (clienteId) loadAll();
  }, [clienteId]);

  const loadAll = async () => {
    setLoading(true);
    const [clienteRes, distRes, sessRes] = await Promise.all([
      supabase.from('clientes').select('id, nome').eq('id', clienteId!).single(),
      supabase.from('districts').select('*').order('numero'),
      supabase.from('sessions').select('id, district_id, created_at').eq('client_id', clienteId!).order('created_at', { ascending: true }),
    ]);

    setCliente(clienteRes.data);
    setDistricts(distRes.data || []);
    setSessions(sessRes.data || []);

    const { data: journeys } = await supabase
      .from('journeys').select('id').eq('client_id', clienteId!).limit(1);

    if (journeys?.length) {
      setJourneyId(journeys[0].id);
      const { data: jd } = await supabase
        .from('journey_districts').select('id, district_id, state, sessions_count, last_session_at, notes')
        .eq('journey_id', journeys[0].id);
      setJourneyDistricts((jd as JourneyDistrict[]) || []);
    } else {
      // Create journey if none exists
      const { data: newJ } = await supabase
        .from('journeys').insert({ client_id: clienteId! }).select('id').single();
      if (newJ) {
        setJourneyId(newJ.id);
        // Create journey_districts for all districts
        const allDists = distRes.data || [];
        const inserts = allDists.map(d => ({
          journey_id: newJ.id,
          district_id: d.id,
          state: 'inativo',
        }));
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

  const getJD = (districtId: string) => journeyDistricts.find(j => j.district_id === districtId);
  const getState = (id: string) => getJD(id)?.state || 'inativo';

  const visitCounts = useMemo(() => {
    const map: Record<string, number> = {};
    sessions.forEach(s => {
      if (s.district_id) map[s.district_id] = (map[s.district_id] || 0) + 1;
    });
    return map;
  }, [sessions]);

  const visitedPath = journeyDistricts
    .filter(jd => jd.state !== 'inativo' && jd.last_session_at)
    .sort((a, b) => new Date(a.last_session_at!).getTime() - new Date(b.last_session_at!).getTime());

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
    if (!changeReason.trim()) {
      toast.error('Justificativa é obrigatória.');
      return;
    }
    if (!selectedDistrict || !journeyId) return;

    setSaving(true);
    try {
      await supabase.from('district_state_changes').insert({
        client_id: clienteId!,
        district_id: selectedDistrict.id,
        changed_by_user_id: user?.id || '',
        from_state: editState,
        to_state: pendingState,
        reason: changeReason.trim(),
      });

      await supabase
        .from('journey_districts')
        .update({ state: pendingState })
        .eq('journey_id', journeyId)
        .eq('district_id', selectedDistrict.id);

      setEditState(pendingState);
      setChangeModalOpen(false);
      toast.success(`Distrito atualizado para ${pendingState}.`);
      await loadAll();
    } catch {
      toast.error('Erro ao alterar estado.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedDistrict || !journeyId) return;
    setSaving(true);
    try {
      await supabase
        .from('journey_districts')
        .update({ notes: editNotes || null } as any)
        .eq('journey_id', journeyId)
        .eq('district_id', selectedDistrict.id);

      toast.success('Anotações salvas.');
      setJourneyDistricts(prev =>
        prev.map(jd => jd.district_id === selectedDistrict.id ? { ...jd, notes: editNotes || null } : jd)
      );
    } catch {
      toast.error('Erro ao salvar anotações.');
    } finally {
      setSaving(false);
    }
  };

  // SVG helpers
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
    ? `M ${pathPoints.map(p => `${p.x},${p.y}`).join(' L ')}`
    : '';

  if (loading) {
    return (
      <CasaMaquinasLayout title="Mapa da CidaDELA">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-6 h-6 animate-spin text-[#C9A24A]" />
        </div>
      </CasaMaquinasLayout>
    );
  }

  const renderMap = (maxW: string) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <filter id="glow-gold-map">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="path-grad-map" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#C9A24A" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#C9A24A" stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id="center-glow-map">
          <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#C9A24A" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Rings */}
      <circle cx={cx} cy={cy} r={r + 5} fill="none" stroke="rgba(201,162,74,0.03)" strokeWidth="0.15" />
      <circle cx={cx} cy={cy} r={r + 3} fill="none" stroke="rgba(201,162,74,0.06)" strokeWidth="0.2" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(201,162,74,0.08)" strokeWidth="0.15" strokeDasharray="0.8 1.2" />

      {/* Journey path */}
      {pathD && (
        <>
          <path d={pathD} fill="none" stroke="url(#path-grad-map)" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow-gold-map)">
            <animate attributeName="stroke-dashoffset" from="20" to="0" dur="3s" repeatCount="indefinite" />
          </path>
          <path d={pathD} fill="none" stroke="#C9A24A" strokeWidth="0.3" strokeOpacity="0.4" strokeDasharray="1.5 1" strokeLinecap="round">
            <animate attributeName="stroke-dashoffset" values="0;-3" dur="2s" repeatCount="indefinite" />
          </path>
        </>
      )}

      {/* Center */}
      <circle cx={cx} cy={cy} r="8" fill="url(#center-glow-map)" />
      <circle cx={cx} cy={cy} r="6" fill="rgba(201,162,74,0.05)" stroke="rgba(201,162,74,0.15)" strokeWidth="0.3" />
      <circle cx={cx} cy={cy} r="3" fill="rgba(201,162,74,0.08)" stroke="rgba(201,162,74,0.2)" strokeWidth="0.2">
        <animate attributeName="r" values="2.8;3.2;2.8" dur="4s" repeatCount="indefinite" />
      </circle>
      <text x={cx} y={cy - 1} textAnchor="middle" fill="#C9A24A" fontSize="2" fontWeight="600" opacity="0.7">Praça</text>
      <text x={cx} y={cy + 1.5} textAnchor="middle" fill="#C9A24A" fontSize="2" fontWeight="600" opacity="0.7">do Ser</text>

      {/* Districts */}
      {districts.map(d => {
        const pos = getPos(d.numero);
        const state = getState(d.id);
        const style = STATE_STYLES[state as keyof typeof STATE_STYLES] || STATE_STYLES.inativo;
        const isIntegrado = state === 'integrado';
        const isSelected = selectedDistrict?.id === d.id;
        const visits = visitCounts[d.id] || 0;

        return (
          <g key={d.id} className="cursor-pointer" onClick={() => handleDistrictClick(d)}>
            {/* Selection ring */}
            {isSelected && (
              <circle cx={pos.x} cy={pos.y} r={nodeR + 2} fill="none" stroke="#C9A24A" strokeWidth="0.4" strokeDasharray="1 0.5">
                <animate attributeName="stroke-opacity" values="0.4;0.8;0.4" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}

            {state !== 'inativo' && (
              <circle cx={pos.x} cy={pos.y} r={nodeR + 1.2} fill="none"
                stroke={style.stroke} strokeWidth="0.15" strokeOpacity="0.3" filter="url(#glow-gold-map)">
                <animate attributeName="r" values={`${nodeR + 0.8};${nodeR + 1.5};${nodeR + 0.8}`} dur="3s" repeatCount="indefinite" />
              </circle>
            )}

            <circle cx={pos.x} cy={pos.y} r={nodeR} fill={style.fill}
              stroke={style.stroke} strokeWidth={isIntegrado ? '0.6' : '0.4'} />

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

            <text x={pos.x} y={pos.y + nodeR + 2.5} textAnchor="middle" fill={style.textColor}
              fontSize="1.8" fontWeight="500" opacity="0.8">
              {d.nome.length > 12 ? d.nome.slice(0, 11) + '…' : d.nome}
            </text>

            {visits > 0 && (
              <text x={pos.x} y={pos.y + nodeR + 4.2} textAnchor="middle" fill="#C9A24A"
                fontSize="1.4" opacity="0.5">
                {visits}s
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );

  const badge = selectedDistrict ? (STATE_LABELS[editState] || STATE_LABELS.inativo) : null;

  return (
    <CasaMaquinasLayout title={`Mapa da CidaDELA — ${cliente?.nome || ''}`} subtitle="Cartografia da psique interior">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          className="border-[#C9A24A]/15 text-[#C9A24A]/70 hover:text-[#C9A24A] text-xs h-8 gap-1.5"
          onClick={() => navigate(`/casa-das-maquinas/clientes/${clienteId}`)}
        >
          <ArrowLeft className="w-3 h-3" />
          Voltar ao Perfil
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-[#C9A24A]/15 text-[#C9A24A]/70 hover:text-[#C9A24A] text-xs h-8 gap-1.5"
          onClick={() => setFullscreen(true)}
        >
          <Maximize2 className="w-3 h-3" />
          Tela Cheia
        </Button>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Map area */}
        <div className="flex-1 min-w-0">
          <div className="relative w-full max-w-[560px] mx-auto" style={{ aspectRatio: '1/1' }}>
            {renderMap('560px')}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-5 mt-3">
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
          <p className="text-[9px] text-[#F5F1E8]/25 text-center italic mt-1">
            Estados indicam o movimento da jornada. Não substituem julgamento clínico.
          </p>
        </div>

        {/* Editing sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          {selectedDistrict ? (
            <div className="bg-[#0B1B2B]/60 border border-[#C9A24A]/10 rounded-xl p-5 space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C9A24A]/10 border border-[#C9A24A]/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#C9A24A]" />
                  </div>
                  <div>
                    <h3 className="text-[#F5F1E8] font-medium">{selectedDistrict.nome}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className={`text-[9px] ${badge?.cls}`}>{badge?.label}</Badge>
                      <span className="text-[10px] text-[#F5F1E8]/30">Distrito {selectedDistrict.numero}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-[#F5F1E8]/30 hover:text-[#F5F1E8]/60"
                  onClick={() => setSelectedDistrict(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-xs text-[#F5F1E8]/40 leading-relaxed">{selectedDistrict.descricao}</p>

              <Separator className="bg-[#C9A24A]/10" />

              {/* State controls */}
              <div>
                <label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#C9A24A]/60 mb-2">
                  <Info className="w-3 h-3" /> Estado do Distrito
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['inativo', 'ativo', 'integrado'] as const).map(st => (
                    <Button
                      key={st}
                      variant="outline"
                      size="sm"
                      className={`text-xs h-8 ${
                        editState === st
                          ? 'border-[#C9A24A]/40 text-[#C9A24A] bg-[#C9A24A]/10'
                          : 'border-[#C9A24A]/15 text-[#F5F1E8]/50 hover:text-[#C9A24A] hover:border-[#C9A24A]/30'
                      }`}
                      onClick={() => handleStateChangeRequest(st)}
                      disabled={editState === st}
                    >
                      {STATE_LABELS[st].label}
                    </Button>
                  ))}
                </div>
                <p className="text-[9px] text-[#F5F1E8]/20 mt-1.5 italic">
                  Alterações de estado requerem justificativa e ficam registradas.
                </p>
              </div>

              <Separator className="bg-[#C9A24A]/10" />

              {/* Notes */}
              <div>
                <label className="text-xs uppercase tracking-wider text-[#C9A24A]/60 mb-2 block">
                  Anotações sobre o Distrito
                </label>
                <Textarea
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  placeholder="Ex: Torre do Silêncio ativa devido a trauma infantil..."
                  className="bg-[#0B1B2B] border-[#C9A24A]/15 text-[#F5F1E8] placeholder:text-[#F5F1E8]/20 min-h-[100px] text-sm"
                />
              </div>

              {/* Session count */}
              <div className="flex items-center justify-between text-xs text-[#F5F1E8]/40">
                <span>Sessões neste distrito</span>
                <span className="text-[#C9A24A]">{visitCounts[selectedDistrict.id] || 0}</span>
              </div>

              {/* Save */}
              <Button
                onClick={handleSaveNotes}
                disabled={saving}
                className="w-full bg-[#C9A24A] hover:bg-[#C9A24A]/80 text-[#0B1B2B] font-medium gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Salvar Alterações
              </Button>
            </div>
          ) : (
            <div className="bg-[#0B1B2B]/40 border border-[#C9A24A]/8 rounded-xl p-8 text-center">
              <Sparkles className="w-8 h-8 text-[#C9A24A]/20 mx-auto mb-3" />
              <p className="text-sm text-[#F5F1E8]/30">Selecione um distrito no mapa para editar</p>
              <p className="text-[10px] text-[#F5F1E8]/15 mt-1">Clique em qualquer nó para ver detalhes e anotações</p>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Dialog */}
      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent className="max-w-[95vw] w-[95vw] max-h-[95vh] h-[95vh] bg-[#0B1B2B] border-[#C9A24A]/15 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-[#F5F1E8]/70 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C9A24A]/60" />
              CidaDELA Interior — {cliente?.nome}
            </h2>
            <Button variant="outline" size="sm" className="border-[#C9A24A]/15 text-[#C9A24A]/70 text-xs h-8 gap-1.5"
              onClick={() => setFullscreen(false)}>
              <Minimize2 className="w-3 h-3" />
              Sair
            </Button>
          </div>
          <div className="flex-1 flex items-center justify-center overflow-auto">
            <div className="w-full max-w-[700px]" style={{ aspectRatio: '1/1' }}>
              {renderMap('700px')}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* State change justification modal */}
      <Dialog open={changeModalOpen} onOpenChange={setChangeModalOpen}>
        <DialogContent className="bg-[#0B1B2B] border-[#C9A24A]/15 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#F5F1E8]">Alterar Estado do Distrito</DialogTitle>
            <DialogDescription className="text-[#F5F1E8]/40">
              {selectedDistrict?.nome}: {editState} → {pendingState}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <label className="text-xs text-[#F5F1E8]/60">Justificativa (obrigatório)</label>
            <Textarea
              value={changeReason}
              onChange={e => setChangeReason(e.target.value)}
              placeholder="Descreva o motivo da alteração..."
              className="bg-[#0B1B2B] border-[#C9A24A]/15 text-[#F5F1E8] placeholder:text-[#F5F1E8]/20 min-h-[80px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangeModalOpen(false)}
              className="border-[#C9A24A]/15 text-[#F5F1E8]/60">
              Cancelar
            </Button>
            <Button onClick={confirmStateChange} disabled={saving || !changeReason.trim()}
              className="bg-[#C9A24A] hover:bg-[#C9A24A]/80 text-[#0B1B2B]">
              {saving ? 'Salvando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CasaMaquinasLayout>
  );
}
