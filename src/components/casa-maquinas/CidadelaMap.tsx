import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle } from 'lucide-react';
import { DistrictPanel } from './DistrictPanel';

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
  1: (c) => ( // Portão da Chegada - door
    <g><rect x="8" y="5" width="8" height="14" rx="1" fill="none" stroke={c} strokeWidth="1.5"/><circle cx="14" cy="12" r="1" fill={c}/></g>
  ),
  2: (c) => ( // Torres - tower
    <g><rect x="9" y="7" width="6" height="12" rx="0.5" fill="none" stroke={c} strokeWidth="1.5"/><line x1="12" y1="4" x2="12" y2="7" stroke={c} strokeWidth="1.5"/><line x1="10" y1="5" x2="14" y2="5" stroke={c} strokeWidth="1.5"/></g>
  ),
  3: (c) => ( // Portas - key
    <g><circle cx="12" cy="8" r="3" fill="none" stroke={c} strokeWidth="1.5"/><line x1="12" y1="11" x2="12" y2="18" stroke={c} strokeWidth="1.5"/><line x1="12" y1="15" x2="14" y2="15" stroke={c} strokeWidth="1.2"/></g>
  ),
  4: (c) => ( // Jardim dos Arquétipos - flower
    <g><circle cx="12" cy="10" r="2" fill="none" stroke={c} strokeWidth="1.5"/><circle cx="10" cy="8" r="1.5" fill="none" stroke={c} strokeWidth="1"/><circle cx="14" cy="8" r="1.5" fill="none" stroke={c} strokeWidth="1"/><line x1="12" y1="12" x2="12" y2="18" stroke={c} strokeWidth="1.5"/></g>
  ),
  5: (c) => ( // Praça do Abalo - crack/lightning
    <g><polyline points="14,4 10,11 13,11 9,20" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></g>
  ),
  6: (c) => ( // Casa dos Sonhos - moon
    <g><path d="M14 6 A6 6 0 1 0 14 18 A4 4 0 1 1 14 6" fill="none" stroke={c} strokeWidth="1.5"/></g>
  ),
  7: (c) => ( // Espelho dos Vínculos - mirror
    <g><ellipse cx="12" cy="10" rx="4" ry="5" fill="none" stroke={c} strokeWidth="1.5"/><line x1="12" y1="15" x2="12" y2="19" stroke={c} strokeWidth="1.5"/><line x1="9" y1="19" x2="15" y2="19" stroke={c} strokeWidth="1.5"/></g>
  ),
  8: (c) => ( // A Forja - anvil/hammer
    <g><rect x="8" y="12" width="8" height="3" rx="0.5" fill="none" stroke={c} strokeWidth="1.5"/><line x1="12" y1="5" x2="12" y2="12" stroke={c} strokeWidth="1.5"/><circle cx="12" cy="5" r="1.5" fill="none" stroke={c} strokeWidth="1.2"/></g>
  ),
  9: (c) => ( // Conselho Interior - circle of dots
    <g><circle cx="12" cy="12" r="5" fill="none" stroke={c} strokeWidth="1.2" strokeDasharray="2 2"/><circle cx="12" cy="7" r="1" fill={c}/><circle cx="12" cy="17" r="1" fill={c}/><circle cx="7" cy="12" r="1" fill={c}/><circle cx="17" cy="12" r="1" fill={c}/></g>
  ),
  10: (c) => ( // Labirinto - spiral
    <g><path d="M12 12 m-1,0 a1,1 0 1,1 2,0 a2,2 0 1,1 -4,0 a3,3 0 1,1 6,0 a4,4 0 1,1 -8,0 a5,5 0 1,1 10,0" fill="none" stroke={c} strokeWidth="1.2"/></g>
  ),
  11: (c) => ( // Praça da Integração - mandala
    <g><circle cx="12" cy="12" r="5" fill="none" stroke={c} strokeWidth="1.2"/><line x1="12" y1="7" x2="12" y2="17" stroke={c} strokeWidth="1"/><line x1="7" y1="12" x2="17" y2="12" stroke={c} strokeWidth="1"/><circle cx="12" cy="12" r="2" fill="none" stroke={c} strokeWidth="1"/></g>
  ),
  12: (c) => ( // Portal de Renascimento - rising sun
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

export function CidadelaMap({ clienteId }: { clienteId: string }) {
  const navigate = useNavigate();
  const [districts, setDistricts] = useState<District[]>([]);
  const [journeyDistricts, setJourneyDistricts] = useState<JourneyDistrict[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [clienteId]);

  const loadData = async () => {
    const [distRes, toolsRes, sessRes] = await Promise.all([
      supabase.from('districts').select('*').order('numero'),
      supabase.from('tools').select('*').eq('ativa', true).order('ordem'),
      supabase.from('sessions').select('id, district_id, created_at, checkin_state, tool_id').eq('client_id', clienteId).order('created_at', { ascending: false }),
    ]);

    setDistricts(distRes.data || []);
    setTools(toolsRes.data || []);
    setSessions(sessRes.data || []);

    const { data: journeys } = await supabase
      .from('journeys').select('id').eq('client_id', clienteId).limit(1);

    if (journeys?.length) {
      const { data: jd } = await supabase
        .from('journey_districts').select('*').eq('journey_id', journeys[0].id);
      setJourneyDistricts(jd || []);
    }
    setLoading(false);
  };

  const getState = (id: string) => journeyDistricts.find(j => j.district_id === id)?.state || 'inativo';
  const getSessionCount = (id: string) => journeyDistricts.find(j => j.district_id === id)?.sessions_count || 0;

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
  const nodeR = 4.5;

  const getPos = (num: number) => {
    const a = ((num - 1) * 30 - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  // Build luminous path points
  const pathPoints = visitedPath.map(jd => {
    const d = districts.find(dd => dd.id === jd.district_id);
    if (!d) return null;
    return getPos(d.numero);
  }).filter(Boolean) as { x: number; y: number }[];

  const pathD = pathPoints.length > 1
    ? `M ${pathPoints.map(p => `${p.x},${p.y}`).join(' L ')}`
    : '';

  return (
    <div className="relative">
      <div className="relative w-full max-w-[500px] mx-auto" style={{ aspectRatio: '1/1' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <filter id="glow-gold">
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <linearGradient id="path-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#C9A24A" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#C9A24A" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Outer decorative rings */}
          <circle cx={cx} cy={cy} r={r + 3} fill="none" stroke="rgba(201,162,74,0.06)" strokeWidth="0.2" />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(201,162,74,0.08)" strokeWidth="0.15" strokeDasharray="0.8 1.2" />

          {/* Luminous path */}
          {pathD && (
            <>
              <path d={pathD} fill="none" stroke="url(#path-grad)" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow-gold)">
                <animate attributeName="stroke-dashoffset" from="20" to="0" dur="3s" repeatCount="indefinite" />
              </path>
              <path d={pathD} fill="none" stroke="#C9A24A" strokeWidth="0.3" strokeOpacity="0.4" strokeDasharray="1.5 1" strokeLinecap="round" />
            </>
          )}

          {/* Center - Praça do Ser */}
          <circle cx={cx} cy={cy} r="6" fill="rgba(201,162,74,0.05)" stroke="rgba(201,162,74,0.15)" strokeWidth="0.3" />
          <circle cx={cx} cy={cy} r="3" fill="rgba(201,162,74,0.08)" stroke="rgba(201,162,74,0.2)" strokeWidth="0.2" />
          <text x={cx} y={cy - 1} textAnchor="middle" fill="#C9A24A" fontSize="2" fontWeight="600" opacity="0.7">Praça</text>
          <text x={cx} y={cy + 1.5} textAnchor="middle" fill="#C9A24A" fontSize="2" fontWeight="600" opacity="0.7">do Ser</text>

          {/* District nodes */}
          {districts.map(d => {
            const pos = getPos(d.numero);
            const state = getState(d.id);
            const style = STATE_STYLES[state as keyof typeof STATE_STYLES] || STATE_STYLES.inativo;
            const isIntegrado = state === 'integrado';
            const sessCount = getSessionCount(d.id);

            return (
              <g key={d.id} className="cursor-pointer" onClick={() => handleClick(d)}
                style={{ transition: 'transform 0.2s ease' }}>
                {/* Glow ring for active/integrado */}
                {state !== 'inativo' && (
                  <circle cx={pos.x} cy={pos.y} r={nodeR + 1.2} fill="none"
                    stroke={style.stroke} strokeWidth="0.15" strokeOpacity="0.3" filter="url(#glow-gold)">
                    <animate attributeName="r" values={`${nodeR + 0.8};${nodeR + 1.5};${nodeR + 0.8}`} dur="3s" repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity" values="0.2;0.4;0.2" dur="3s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Main circle */}
                <circle cx={pos.x} cy={pos.y} r={nodeR} fill={style.fill}
                  stroke={style.stroke} strokeWidth={isIntegrado ? '0.6' : '0.4'} />

                {/* Icon inside */}
                <svg x={pos.x - nodeR} y={pos.y - nodeR} width={nodeR * 2} height={nodeR * 2}
                  viewBox="0 0 24 24">
                  {DISTRICT_ICONS[d.numero]?.(style.iconColor) ?? (
                    <text x="12" y="14" textAnchor="middle" fill={style.iconColor} fontSize="8" fontWeight="bold">{d.numero}</text>
                  )}
                </svg>

                {/* Integrado checkmark */}
                {isIntegrado && (
                  <g transform={`translate(${pos.x + nodeR * 0.6}, ${pos.y - nodeR * 0.6})`}>
                    <circle r="1.5" fill="#C9A24A" />
                    <polyline points="-0.6,0 -0.15,0.5 0.6,-0.4" fill="none" stroke="#0B1B2B" strokeWidth="0.4" strokeLinecap="round" />
                  </g>
                )}

                {/* Label */}
                <text x={pos.x} y={pos.y + nodeR + 2.5} textAnchor="middle" fill={style.textColor}
                  fontSize="1.8" fontWeight="500" opacity="0.8">
                  {d.nome.length > 12 ? d.nome.slice(0, 11) + '…' : d.nome}
                </text>

                {/* Session count */}
                {sessCount > 0 && (
                  <text x={pos.x} y={pos.y + nodeR + 4.2} textAnchor="middle" fill="#C9A24A"
                    fontSize="1.4" opacity="0.5">
                    {sessCount}s
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 mt-3">
        {(['inativo', 'ativo', 'integrado'] as const).map(s => {
          const st = STATE_STYLES[s];
          return (
            <div key={s} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: st.fill, borderColor: st.stroke }} />
              <span className="text-[10px] text-[#F5F1E8]/40 capitalize">{s}</span>
            </div>
          );
        })}
      </div>

      {/* District Panel (bottom sheet on mobile) */}
      <DistrictPanel
        district={selectedDistrict}
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        state={selectedDistrict ? getState(selectedDistrict.id) : 'inativo'}
        sessionCount={selectedDistrict ? getSessionCount(selectedDistrict.id) : 0}
        tools={selectedDistrict ? tools.filter(t => t.district_id === selectedDistrict.id) : []}
        sessions={selectedDistrict ? sessions.filter(s => s.district_id === selectedDistrict?.id) : []}
        clienteId={clienteId}
      />
    </div>
  );
}
