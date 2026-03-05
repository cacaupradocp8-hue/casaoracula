import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Clock, Sparkles, Maximize2, Minimize2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DistrictPanel } from './DistrictPanel';
import { JourneyTimeline } from './JourneyTimeline';

interface District {
  id: string;
  numero: number;
  nome: string;
  descricao: string;
  icone: string;
  cor: string;
}

interface JourneyDistrict {
  district_id: string;
  state: string;
  sessions_count: number;
  last_session_at: string | null;
}

// Minimalist SVG icons per district number (clock position 1-12)
const DISTRICT_ICONS: Record<number, (color: string) => JSX.Element> = {
  1: (c) => (
    <g><rect x="8" y="5" width="8" height="14" rx="1" fill="none" stroke={c} strokeWidth="1.5"/><circle cx="14" cy="12" r="1" fill={c}/></g>
  ),
  2: (c) => (
    <g><rect x="9" y="7" width="6" height="12" rx="0.5" fill="none" stroke={c} strokeWidth="1.5"/><line x1="12" y1="4" x2="12" y2="7" stroke={c} strokeWidth="1.5"/><line x1="10" y1="5" x2="14" y2="5" stroke={c} strokeWidth="1.5"/></g>
  ),
  3: (c) => (
    <g><circle cx="12" cy="8" r="3" fill="none" stroke={c} strokeWidth="1.5"/><line x1="12" y1="11" x2="12" y2="18" stroke={c} strokeWidth="1.5"/><line x1="12" y1="15" x2="14" y2="15" stroke={c} strokeWidth="1.2"/></g>
  ),
  4: (c) => (
    <g><circle cx="12" cy="10" r="2" fill="none" stroke={c} strokeWidth="1.5"/><circle cx="10" cy="8" r="1.5" fill="none" stroke={c} strokeWidth="1"/><circle cx="14" cy="8" r="1.5" fill="none" stroke={c} strokeWidth="1"/><line x1="12" y1="12" x2="12" y2="18" stroke={c} strokeWidth="1.5"/></g>
  ),
  5: (c) => (
    <g><polyline points="14,4 10,11 13,11 9,20" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></g>
  ),
  6: (c) => (
    <g><path d="M14 6 A6 6 0 1 0 14 18 A4 4 0 1 1 14 6" fill="none" stroke={c} strokeWidth="1.5"/></g>
  ),
  7: (c) => (
    <g><ellipse cx="12" cy="10" rx="4" ry="5" fill="none" stroke={c} strokeWidth="1.5"/><line x1="12" y1="15" x2="12" y2="19" stroke={c} strokeWidth="1.5"/><line x1="9" y1="19" x2="15" y2="19" stroke={c} strokeWidth="1.5"/></g>
  ),
  8: (c) => (
    <g><rect x="8" y="12" width="8" height="3" rx="0.5" fill="none" stroke={c} strokeWidth="1.5"/><line x1="12" y1="5" x2="12" y2="12" stroke={c} strokeWidth="1.5"/><circle cx="12" cy="5" r="1.5" fill="none" stroke={c} strokeWidth="1.2"/></g>
  ),
  9: (c) => (
    <g><circle cx="12" cy="12" r="5" fill="none" stroke={c} strokeWidth="1.2" strokeDasharray="2 2"/><circle cx="12" cy="7" r="1" fill={c}/><circle cx="12" cy="17" r="1" fill={c}/><circle cx="7" cy="12" r="1" fill={c}/><circle cx="17" cy="12" r="1" fill={c}/></g>
  ),
  10: (c) => (
    <g><path d="M12 12 m-1,0 a1,1 0 1,1 2,0 a2,2 0 1,1 -4,0 a3,3 0 1,1 6,0 a4,4 0 1,1 -8,0 a5,5 0 1,1 10,0" fill="none" stroke={c} strokeWidth="1.2"/></g>
  ),
  11: (c) => (
    <g><circle cx="12" cy="12" r="5" fill="none" stroke={c} strokeWidth="1.2"/><line x1="12" y1="7" x2="12" y2="17" stroke={c} strokeWidth="1"/><line x1="7" y1="12" x2="17" y2="12" stroke={c} strokeWidth="1"/><circle cx="12" cy="12" r="2" fill="none" stroke={c} strokeWidth="1"/></g>
  ),
  12: (c) => (
    <g><path d="M6 16 Q12 6 18 16" fill="none" stroke={c} strokeWidth="1.5"/><line x1="12" y1="8" x2="12" y2="5" stroke={c} strokeWidth="1.2"/><line x1="8" y1="10" x2="6" y2="8" stroke={c} strokeWidth="1.2"/><line x1="16" y1="10" x2="18" y2="8" stroke={c} strokeWidth="1.2"/></g>
  ),
};

const STATE_STYLES = {
  inativo: {
    fill: 'rgba(245,241,232,0.03)',
    stroke: 'rgba(245,241,232,0.12)',
    iconColor: 'rgba(245,241,232,0.25)',
    textColor: 'rgba(245,241,232,0.3)',
    glow: 'none',
  },
  ativo: {
    fill: 'rgba(201,162,74,0.1)',
    stroke: 'rgba(201,162,74,0.5)',
    iconColor: '#C9A24A',
    textColor: '#C9A24A',
    glow: '0 0 12px rgba(201,162,74,0.3)',
  },
  integrado: {
    fill: 'rgba(85,107,87,0.12)',
    stroke: '#C9A24A',
    iconColor: '#556B57',
    textColor: '#556B57',
    glow: '0 0 8px rgba(201,162,74,0.2)',
  },
};

function Particles() {
  const particles = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      cx: Math.random() * 100,
      cy: Math.random() * 100,
      r: 0.15 + Math.random() * 0.25,
      dur: 8 + Math.random() * 12,
      delay: Math.random() * 5,
    })), []
  );
  return (
    <>
      {particles.map(p => (
        <circle key={p.id} cx={p.cx} cy={p.cy} r={p.r} fill="#C9A24A" opacity="0">
          <animate attributeName="opacity" values="0;0.25;0" dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
          <animate attributeName="cy" values={`${p.cy};${p.cy - 8};${p.cy}`} dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </>
  );
}

function MapLegend() {
  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center justify-center gap-5">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: STATE_STYLES.inativo.fill, borderColor: STATE_STYLES.inativo.stroke }} />
          <span className="text-[10px] text-[#F5F1E8]/40">Inativo <span className="text-[#F5F1E8]/25">— ainda não visitado</span></span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: STATE_STYLES.ativo.fill, borderColor: STATE_STYLES.ativo.stroke }} />
          <span className="text-[10px] text-[#C9A24A]/70">Ativo <span className="text-[#F5F1E8]/25">— em exploração</span></span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full border relative" style={{ backgroundColor: STATE_STYLES.integrado.fill, borderColor: STATE_STYLES.integrado.stroke }}>
            <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 4px rgba(201,162,74,0.3)' }} />
          </div>
          <span className="text-[10px] text-[#556B57]">Integrado <span className="text-[#F5F1E8]/25">— consolidado</span></span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#556B57] border border-[#C9A24A]/30 flex items-center justify-center text-[6px] text-[#F5F1E8]">✦</div>
          <span className="text-[10px] text-[#F5F1E8]/40">Carta usada</span>
        </div>
      </div>
      <p className="text-[9px] text-[#F5F1E8]/25 text-center italic">
        Estados indicam o movimento da jornada. Não substituem julgamento clínico.
      </p>
    </div>
  );
}

function MapSVG({ districts, getState, getSessionCount, visitCounts, cardsByDistrict, pathPoints, handleClick }: {
  districts: District[];
  getState: (id: string) => string;
  getSessionCount: (id: string) => number;
  visitCounts: Record<string, number>;
  cardsByDistrict: Record<string, number>;
  pathPoints: { x: number; y: number }[];
  handleClick: (d: District) => void;
}) {
  const cx = 50, cy = 50, r = 36, nodeR = 4.5;

  const getPos = (num: number) => {
    const a = ((num - 1) * 30 - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  const pathD = pathPoints.length > 1
    ? `M ${pathPoints.map(p => `${p.x},${p.y}`).join(' L ')}`
    : '';

  const compassLines = [0, 30, 60, 90, 120, 150].map(angle => {
    const rad = angle * (Math.PI / 180);
    return {
      x1: cx + (r - 8) * Math.cos(rad), y1: cy + (r - 8) * Math.sin(rad),
      x2: cx + (r + 5) * Math.cos(rad), y2: cy + (r + 5) * Math.sin(rad),
      x3: cx - (r - 8) * Math.cos(rad), y3: cy - (r - 8) * Math.sin(rad),
      x4: cx - (r + 5) * Math.cos(rad), y4: cy - (r + 5) * Math.sin(rad),
    };
  });

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <filter id="glow-gold">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="halo-recurrence">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="path-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#C9A24A" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#C9A24A" stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id="center-glow">
          <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#C9A24A" stopOpacity="0" />
        </radialGradient>
      </defs>

      <Particles />

      {compassLines.map((l, i) => (
        <g key={i}>
          <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="rgba(201,162,74,0.04)" strokeWidth="0.1" />
          <line x1={l.x3} y1={l.y3} x2={l.x4} y2={l.y4} stroke="rgba(201,162,74,0.04)" strokeWidth="0.1" />
        </g>
      ))}

      <circle cx={cx} cy={cy} r={r + 5} fill="none" stroke="rgba(201,162,74,0.03)" strokeWidth="0.15" />
      <circle cx={cx} cy={cy} r={r + 3} fill="none" stroke="rgba(201,162,74,0.06)" strokeWidth="0.2" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(201,162,74,0.08)" strokeWidth="0.15" strokeDasharray="0.8 1.2" />

      {pathD && (
        <>
          <path d={pathD} fill="none" stroke="url(#path-grad)" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow-gold)">
            <animate attributeName="stroke-dashoffset" from="20" to="0" dur="3s" repeatCount="indefinite" />
          </path>
          <path d={pathD} fill="none" stroke="#C9A24A" strokeWidth="0.3" strokeOpacity="0.4" strokeDasharray="1.5 1" strokeLinecap="round">
            <animate attributeName="stroke-dashoffset" values="0;-3" dur="2s" repeatCount="indefinite" />
          </path>
        </>
      )}

      <circle cx={cx} cy={cy} r="8" fill="url(#center-glow)" />
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
        const sessCount = getSessionCount(d.id);
        const realVisits = visitCounts[d.id] || 0;
        const isRecurrent = realVisits >= 5;
        const hasCard = !!cardsByDistrict[d.id];

        return (
          <g key={d.id} className="cursor-pointer" onClick={() => handleClick(d)}>
            {isRecurrent && (
              <>
                <circle cx={pos.x} cy={pos.y} r={nodeR + 3} fill="none"
                  stroke="#C9A24A" strokeWidth="0.12" strokeOpacity="0.15" filter="url(#halo-recurrence)">
                  <animate attributeName="r" values={`${nodeR + 2};${nodeR + 4};${nodeR + 2}`} dur="4s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" values="0.1;0.25;0.1" dur="4s" repeatCount="indefinite" />
                </circle>
                <circle cx={pos.x} cy={pos.y} r={nodeR + 2} fill="none"
                  stroke="#C9A24A" strokeWidth="0.08" strokeOpacity="0.1">
                  <animate attributeName="r" values={`${nodeR + 1.5};${nodeR + 2.8};${nodeR + 1.5}`} dur="3s" repeatCount="indefinite" />
                </circle>
              </>
            )}

            {state !== 'inativo' && (
              <circle cx={pos.x} cy={pos.y} r={nodeR + 1.2} fill="none"
                stroke={style.stroke} strokeWidth="0.15" strokeOpacity="0.3" filter="url(#glow-gold)">
                <animate attributeName="r" values={`${nodeR + 0.8};${nodeR + 1.5};${nodeR + 0.8}`} dur="3s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" values="0.2;0.4;0.2" dur="3s" repeatCount="indefinite" />
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

            {hasCard && (
              <g transform={`translate(${pos.x - nodeR * 0.7}, ${pos.y - nodeR * 0.7})`}>
                <circle r="1.2" fill="#556B57" stroke="#C9A24A" strokeWidth="0.2" />
                <text x="0" y="0.5" textAnchor="middle" fill="#F5F1E8" fontSize="1.4">✦</text>
              </g>
            )}

            <text x={pos.x} y={pos.y + nodeR + 2.5} textAnchor="middle" fill={style.textColor}
              fontSize="1.8" fontWeight="500" opacity="0.8">
              {d.nome.length > 12 ? d.nome.slice(0, 11) + '…' : d.nome}
            </text>

            {sessCount > 0 && (
              <text x={pos.x} y={pos.y + nodeR + 4.2} textAnchor="middle" fill="#C9A24A"
                fontSize="1.4" opacity="0.5">
                {sessCount}s
              </text>
            )}

            {isRecurrent && (
              <text x={pos.x} y={pos.y + nodeR + 5.5} textAnchor="middle" fill="#C9A24A"
                fontSize="1" opacity="0.4" fontStyle="italic">
                revisitado
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function CidadelaMap({ clienteId }: { clienteId: string }) {
  const navigate = useNavigate();
  const [districts, setDistricts] = useState<District[]>([]);
  const [journeyDistricts, setJourneyDistricts] = useState<JourneyDistrict[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [oracleCards, setOracleCards] = useState<any[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [manualChanges, setManualChanges] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadData();
  }, [clienteId]);

  const loadData = async () => {
    const [distRes, toolsRes, sessRes] = await Promise.all([
      supabase.from('districts').select('*').order('numero'),
      supabase.from('tools').select('*').eq('ativa', true).order('ordem'),
      supabase.from('sessions').select('id, district_id, created_at, checkin_state, tool_id, oracle_card_id, insight, task').eq('client_id', clienteId).order('created_at', { ascending: true }),
    ]);

    setDistricts(distRes.data || []);
    setTools(toolsRes.data || []);
    setSessions(sessRes.data || []);

    const cardIds = (sessRes.data || []).map(s => s.oracle_card_id).filter(Boolean);
    if (cardIds.length > 0) {
      const { data: cards } = await supabase
        .from('cidadela_oracle_cards').select('id, name, family, district_id').in('id', cardIds);
      setOracleCards(cards || []);
    }

    const { data: journeys } = await supabase
      .from('journeys').select('id').eq('client_id', clienteId).limit(1);

    if (journeys?.length) {
      const { data: jd } = await supabase
        .from('journey_districts').select('*').eq('journey_id', journeys[0].id);
      setJourneyDistricts(jd || []);
    }

    // Load manual state changes to detect manually integrated districts
    const { data: stateChanges } = await supabase
      .from('district_state_changes')
      .select('district_id, to_state')
      .eq('client_id', clienteId)
      .eq('to_state', 'integrado');

    const manualMap: Record<string, boolean> = {};
    (stateChanges || []).forEach(sc => { manualMap[sc.district_id] = true; });
    setManualChanges(manualMap);

    setLoading(false);
  };

  const getState = (id: string) => journeyDistricts.find(j => j.district_id === id)?.state || 'inativo';
  const getSessionCount = (id: string) => journeyDistricts.find(j => j.district_id === id)?.sessions_count || 0;

  const cardsByDistrict = useMemo(() => {
    const map: Record<string, number> = {};
    sessions.forEach(s => {
      if (s.oracle_card_id) {
        const card = oracleCards.find(c => c.id === s.oracle_card_id);
        if (card?.district_id) {
          map[card.district_id] = (map[card.district_id] || 0) + 1;
        }
      }
    });
    return map;
  }, [sessions, oracleCards]);

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

  const handleClick = (d: District) => {
    setSelectedDistrict(d);
    setPanelOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[#C9A24A]" /></div>;
  }

  const cx = 50, cy = 50, r = 36;
  const getPos = (num: number) => {
    const a = ((num - 1) * 30 - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  const pathPoints = visitedPath.map(jd => {
    const d = districts.find(dd => dd.id === jd.district_id);
    if (!d) return null;
    return getPos(d.numero);
  }).filter(Boolean) as { x: number; y: number }[];

  const mapContent = (
    <>
      <div className="relative w-full max-w-[520px] mx-auto" style={{ aspectRatio: '1/1' }}>
        <MapSVG
          districts={districts}
          getState={getState}
          getSessionCount={getSessionCount}
          visitCounts={visitCounts}
          cardsByDistrict={cardsByDistrict}
          pathPoints={pathPoints}
          handleClick={handleClick}
        />
      </div>
      <MapLegend />
    </>
  );

  return (
    <div className="relative space-y-4">
      {/* Title & buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C9A24A]/60" />
          <h3 className="text-sm font-medium text-[#F5F1E8]/70">Mapa Evolutivo da CidaDELA Interior</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-[#C9A24A]/15 text-[#C9A24A]/70 hover:text-[#C9A24A] hover:border-[#C9A24A]/30 text-xs h-8 gap-1.5"
            onClick={() => setFullscreen(true)}
          >
            <Maximize2 className="w-3 h-3" />
            Tela Cheia
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-[#C9A24A]/15 text-[#C9A24A]/70 hover:text-[#C9A24A] hover:border-[#C9A24A]/30 text-xs h-8 gap-1.5"
            onClick={() => setShowTimeline(true)}
          >
            <Clock className="w-3 h-3" />
            Linha do tempo
          </Button>
        </div>
      </div>

      {/* Map (inline) */}
      {mapContent}

      {/* Recurrence insights */}
      {Object.entries(visitCounts).filter(([, c]) => c >= 5).length > 0 && (
        <div className="bg-[#C9A24A]/[0.05] border border-[#C9A24A]/10 rounded-lg p-3 mx-auto max-w-[520px]">
          <p className="text-[10px] uppercase tracking-wider text-[#C9A24A]/60 mb-1.5">Padrões observados</p>
          {Object.entries(visitCounts)
            .filter(([, c]) => c >= 5)
            .map(([distId, count]) => {
              const d = districts.find(dd => dd.id === distId);
              return d ? (
                <p key={distId} className="text-xs text-[#F5F1E8]/50 italic leading-relaxed">
                  "{d.nome}" está sendo revisitado ({count} sessões). Isso pode indicar um ciclo de trabalho em curso.
                </p>
              ) : null;
            })}
        </div>
      )}

      {/* Fullscreen Dialog */}
      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent className="max-w-[95vw] w-[95vw] max-h-[95vh] h-[95vh] bg-[#0B1B2B] border-[#C9A24A]/15 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-[#F5F1E8]/70 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C9A24A]/60" />
              CidaDELA Interior — Tela Cheia
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="border-[#C9A24A]/15 text-[#C9A24A]/70 hover:text-[#C9A24A] text-xs h-8 gap-1.5"
              onClick={() => setFullscreen(false)}
            >
              <Minimize2 className="w-3 h-3" />
              Sair da tela cheia
            </Button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center overflow-auto">
            <div className="w-full max-w-[700px]" style={{ aspectRatio: '1/1' }}>
              <MapSVG
                districts={districts}
                getState={getState}
                getSessionCount={getSessionCount}
                visitCounts={visitCounts}
                cardsByDistrict={cardsByDistrict}
                pathPoints={pathPoints}
                handleClick={handleClick}
              />
            </div>
            <MapLegend />
          </div>
        </DialogContent>
      </Dialog>

      {/* District Panel */}
      <DistrictPanel
        district={selectedDistrict}
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        state={selectedDistrict ? getState(selectedDistrict.id) : 'inativo'}
        sessionCount={selectedDistrict ? getSessionCount(selectedDistrict.id) : 0}
        tools={selectedDistrict ? tools.filter(t => t.district_id === selectedDistrict.id) : []}
        sessions={selectedDistrict ? sessions.filter(s => s.district_id === selectedDistrict?.id) : []}
        clienteId={clienteId}
        isManuallyIntegrated={selectedDistrict ? !!manualChanges[selectedDistrict.id] : false}
        onStateChanged={loadData}
      />

      {/* Journey Timeline */}
      <JourneyTimeline
        open={showTimeline}
        onClose={() => setShowTimeline(false)}
        sessions={sessions}
        districts={districts}
        oracleCards={oracleCards}
        tools={tools}
      />
    </div>
  );
}
