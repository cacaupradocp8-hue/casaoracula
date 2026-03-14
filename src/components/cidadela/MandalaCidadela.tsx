import { useMemo, useState, useRef, useCallback } from 'react';

// ============================================
// CIDADELA INTERIOR — MAPA MEDIEVAL SIMBÓLICO v1
// Cartografia alquímica da cidade interior
// ============================================

export interface MandalaDistrict {
  id: string;
  numero: number;
  nome: string;
  descricao: string;
  icone: string;
  cor: string;
}

export interface MandalaDistrictState {
  district_id: string;
  state: 'inativo' | 'ativo' | 'integrado';
  sessions_count: number;
  last_session_at: string | null;
}

export type MandalaMode = 'explorar' | 'clinico' | 'coletivo';

export interface MandalaCollectiveData {
  district_id: string;
  client_count: number;
  client_names?: string[];
}

interface Props {
  districts: MandalaDistrict[];
  districtStates?: MandalaDistrictState[];
  collectiveData?: MandalaCollectiveData[];
  mode: MandalaMode;
  selectedId?: string | null;
  pathPoints?: { x: number; y: number }[];
  onDistrictClick?: (district: MandalaDistrict) => void;
  className?: string;
  showConnections?: boolean;
}

// District positions — organic city layout (viewBox 0 0 500 500)
const DISTRICT_POSITIONS: Record<number, { x: number; y: number }> = {
  11: { x: 250, y: 250 }, // Praça da Integração — center
  1:  { x: 250, y: 130 }, // Entrada — north gate
  2:  { x: 155, y: 175 }, // Torres — northwest
  3:  { x: 345, y: 175 }, // Portas — northeast
  4:  { x: 145, y: 290 }, // Jardim dos Arquétipos — west
  6:  { x: 355, y: 290 }, // Casa dos Sonhos — east
  5:  { x: 250, y: 400 }, // Praça do Abalo — south
  7:  { x: 90,  y: 200 }, // Espelho dos Vínculos — far west
  8:  { x: 410, y: 200 }, // Forja — far east
  9:  { x: 100, y: 370 }, // Conselho Interior — southwest
  10: { x: 400, y: 370 }, // Labirinto — southeast
  12: { x: 250, y: 45  }, // Portal de Renascimento — far north
};

// Paths connecting districts (as medieval roads)
const ROADS: { from: number; to: number }[] = [
  { from: 12, to: 1 },
  { from: 1, to: 11 },
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 4 },
  { from: 2, to: 7 },
  { from: 3, to: 6 },
  { from: 3, to: 8 },
  { from: 4, to: 9 },
  { from: 4, to: 11 },
  { from: 6, to: 10 },
  { from: 6, to: 11 },
  { from: 9, to: 5 },
  { from: 10, to: 5 },
  { from: 5, to: 11 },
];

const STATE_STYLES = {
  inativo: {
    fill: 'rgba(245,241,232,0.03)',
    stroke: 'rgba(245,241,232,0.12)',
    iconColor: 'rgba(245,241,232,0.18)',
    textColor: 'rgba(245,241,232,0.30)',
    glowColor: 'transparent',
    roadColor: 'rgba(245,241,232,0.06)',
  },
  ativo: {
    fill: 'rgba(201,162,74,0.10)',
    stroke: 'rgba(201,162,74,0.50)',
    iconColor: '#C9A24A',
    textColor: '#C9A24A',
    glowColor: 'rgba(201,162,74,0.12)',
    roadColor: 'rgba(201,162,74,0.20)',
  },
  integrado: {
    fill: 'rgba(74,158,107,0.10)',
    stroke: '#6bc48f',
    iconColor: '#6bc48f',
    textColor: '#7dd9a0',
    glowColor: 'rgba(74,158,107,0.15)',
    roadColor: 'rgba(74,158,107,0.20)',
  },
};

// High-fidelity SVG district icons
const DISTRICT_ICONS: Record<number, (c: string) => JSX.Element> = {
  1: (c) => <g>
    <path d="M14 24 L14 10 M8 24 L8 12 A6 6 0 0 1 20 12 L20 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
    <circle cx="14" cy="7" r="1.5" fill="none" stroke={c} strokeWidth="0.8" opacity="0.7"/>
    <circle cx="14" cy="7" r="0.5" fill={c} opacity="0.9"/>
  </g>,
  2: (c) => <g>
    <rect x="10" y="10" width="8" height="14" rx="0.8" fill="none" stroke={c} strokeWidth="1.4"/>
    <path d="M10 10 L10 7 L12 7 L12 9 L14 9 L14 7 L16 7 L16 9 L18 9 L18 7 L18 10" fill="none" stroke={c} strokeWidth="1.1"/>
    <rect x="12.5" y="18" width="3" height="6" rx="1.5" fill="none" stroke={c} strokeWidth="0.9" opacity="0.7"/>
    <circle cx="14" cy="13.5" r="1.2" fill="none" stroke={c} strokeWidth="0.7" opacity="0.5"/>
  </g>,
  3: (c) => <g>
    <path d="M9 24 L9 9 A5 5 0 0 1 19 9 L19 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
    <circle cx="16" cy="16" r="1" fill="none" stroke={c} strokeWidth="0.8"/>
    <line x1="16" y1="17" x2="16" y2="19.5" stroke={c} strokeWidth="0.7"/>
    <line x1="15.3" y1="18.5" x2="16.7" y2="18.5" stroke={c} strokeWidth="0.5"/>
  </g>,
  4: (c) => <g>
    <line x1="14" y1="13" x2="14" y2="22" stroke={c} strokeWidth="1.4"/>
    <path d="M14 22 Q12 24 10 25" fill="none" stroke={c} strokeWidth="0.8" opacity="0.5"/>
    <path d="M14 22 Q16 24 18 25" fill="none" stroke={c} strokeWidth="0.8" opacity="0.5"/>
    <circle cx="14" cy="10" r="5" fill="none" stroke={c} strokeWidth="1.1"/>
    <circle cx="11" cy="8" r="2.5" fill="none" stroke={c} strokeWidth="0.7" opacity="0.5"/>
    <circle cx="17" cy="8" r="2.5" fill="none" stroke={c} strokeWidth="0.7" opacity="0.5"/>
  </g>,
  5: (c) => <g>
    <path d="M14 14 m0,-2 a2,2 0 1,1 0,4 a4,4 0 1,1 0,-8 a6,6 0 1,1 0,12" fill="none" stroke={c} strokeWidth="1.1" strokeLinecap="round"/>
    <path d="M6 20 Q10 17 14 20 Q18 23 22 20" fill="none" stroke={c} strokeWidth="0.7" opacity="0.4"/>
    <circle cx="14" cy="14" r="1" fill={c} opacity="0.7"/>
  </g>,
  6: (c) => <g>
    <path d="M17 8 A5 5 0 1 0 17 18 A3.5 3.5 0 1 1 17 8" fill="none" stroke={c} strokeWidth="1.2"/>
    <circle cx="9" cy="9" r="0.5" fill={c} opacity="0.6"/>
    <circle cx="7" cy="13" r="0.4" fill={c} opacity="0.4"/>
    <circle cx="10" cy="16" r="0.35" fill={c} opacity="0.5"/>
  </g>,
  7: (c) => <g>
    <ellipse cx="14" cy="12" rx="5.5" ry="7" fill="none" stroke={c} strokeWidth="1.2"/>
    <ellipse cx="14" cy="12" rx="3.5" ry="5" fill="none" stroke={c} strokeWidth="0.5" opacity="0.35"/>
    <line x1="14" y1="19" x2="14" y2="24" stroke={c} strokeWidth="1.2"/>
    <path d="M10 24 Q14 22.5 18 24" fill="none" stroke={c} strokeWidth="0.9"/>
  </g>,
  8: (c) => <g>
    <path d="M9 18 L9 16 L19 16 L19 18" fill="none" stroke={c} strokeWidth="1.2"/>
    <rect x="11" y="18" width="6" height="2.5" rx="0.5" fill="none" stroke={c} strokeWidth="0.9"/>
    <line x1="14" y1="20.5" x2="14" y2="23" stroke={c} strokeWidth="1.1"/>
    <line x1="11" y1="23" x2="17" y2="23" stroke={c} strokeWidth="0.9"/>
    <path d="M18 14 L20 8 L21 8 L19 15" fill="none" stroke={c} strokeWidth="0.9" strokeLinecap="round"/>
    <path d="M11 14 Q12 11 14 12 Q16 11 15 14" fill="none" stroke={c} strokeWidth="0.6" opacity="0.5"/>
  </g>,
  9: (c) => <g>
    <circle cx="14" cy="14" r="5" fill="none" stroke={c} strokeWidth="1.1"/>
    <circle cx="14" cy="14" r="2.5" fill="none" stroke={c} strokeWidth="0.5" opacity="0.4" strokeDasharray="1.5 1"/>
    {[0,60,120,180,240,300].map((a,i) => {
      const rad = (a * Math.PI) / 180;
      const x = 14 + 6.8 * Math.cos(rad);
      const y = 14 + 6.8 * Math.sin(rad);
      return <circle key={i} cx={x} cy={y} r="0.9" fill="none" stroke={c} strokeWidth="0.6" opacity="0.6"/>;
    })}
    <circle cx="14" cy="14" r="0.7" fill={c} opacity="0.5"/>
  </g>,
  10: (c) => <g>
    <path d="M14 8 A6 6 0 0 0 8 14" fill="none" stroke={c} strokeWidth="1.1"/>
    <path d="M8 14 A6 6 0 0 0 14 20" fill="none" stroke={c} strokeWidth="1.1"/>
    <path d="M14 20 A4 4 0 0 0 18 16" fill="none" stroke={c} strokeWidth="0.9"/>
    <path d="M18 16 A4 4 0 0 0 14 12" fill="none" stroke={c} strokeWidth="0.9"/>
    <path d="M14 12 A2 2 0 0 0 12 14" fill="none" stroke={c} strokeWidth="0.7"/>
    <circle cx="14" cy="14" r="0.8" fill={c} opacity="0.7"/>
  </g>,
  11: (c) => <g>
    <circle cx="14" cy="14" r="7" fill="none" stroke={c} strokeWidth="0.9"/>
    <circle cx="14" cy="14" r="4.5" fill="none" stroke={c} strokeWidth="0.6" opacity="0.5"/>
    <circle cx="14" cy="14" r="2" fill="none" stroke={c} strokeWidth="0.7"/>
    <line x1="14" y1="7" x2="14" y2="21" stroke={c} strokeWidth="0.5" opacity="0.4"/>
    <line x1="7" y1="14" x2="21" y2="14" stroke={c} strokeWidth="0.5" opacity="0.4"/>
    <circle cx="14" cy="14" r="0.7" fill={c} opacity="0.8"/>
  </g>,
  12: (c) => <g>
    <path d="M14 22 Q14 16 10 12 Q14 15 14 8 Q14 15 18 12 Q14 16 14 22" fill="none" stroke={c} strokeWidth="1.1" strokeLinejoin="round"/>
    <path d="M14 8 Q13 5 14 3 Q15 5 14 8" fill="none" stroke={c} strokeWidth="0.7" opacity="0.6"/>
    <circle cx="14" cy="16" r="1" fill="none" stroke={c} strokeWidth="0.5" opacity="0.5"/>
    <circle cx="14" cy="16" r="0.35" fill={c} opacity="0.6"/>
  </g>,
};

// Floating particles for atmosphere
function AtmosphereParticles() {
  const particles = useMemo(
    () => Array.from({ length: 24 }, (_, i) => ({
      id: i,
      cx: 20 + Math.random() * 460,
      cy: 20 + Math.random() * 460,
      r: 0.5 + Math.random() * 1.2,
      dur: 15 + Math.random() * 20,
      delay: Math.random() * 12,
      driftX: (Math.random() - 0.5) * 30,
      driftY: (Math.random() - 0.5) * 30,
      isGold: Math.random() > 0.5,
    })),
    []
  );
  return (
    <>
      {particles.map((p) => (
        <circle key={p.id} cx={p.cx} cy={p.cy} r={p.r}
          fill={p.isGold ? '#C9A24A' : '#F5F1E8'} opacity="0">
          <animate attributeName="opacity" values="0;0.06;0.03;0.06;0" dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
          <animate attributeName="cx" values={`${p.cx};${p.cx + p.driftX};${p.cx}`} dur={`${p.dur * 1.2}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
          <animate attributeName="cy" values={`${p.cy};${p.cy + p.driftY};${p.cy}`} dur={`${p.dur * 1.3}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </>
  );
}

// Generate a winding road path between two points with Bézier
function roadPath(from: { x: number; y: number }, to: { x: number; y: number }): string {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  // slight perpendicular offset for organic feel
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const offsetScale = len * 0.12;
  const nx = -dy / len * offsetScale;
  const ny = dx / len * offsetScale;
  return `M ${from.x} ${from.y} Q ${mx + nx} ${my + ny} ${to.x} ${to.y}`;
}

export function MandalaCidadela({
  districts, districtStates = [], collectiveData = [], mode, selectedId,
  pathPoints = [], onDistrictClick, className, showConnections = false,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState({ x: -10, y: -10, w: 520, h: 520 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * viewBox.w + viewBox.x;
    const my = ((e.clientY - rect.top) / rect.height) * viewBox.h + viewBox.y;
    const scale = e.deltaY > 0 ? 1.12 : 0.89;
    const nw = Math.min(700, Math.max(200, viewBox.w * scale));
    const nh = Math.min(700, Math.max(200, viewBox.h * scale));
    setViewBox({ x: mx - ((mx - viewBox.x) / viewBox.w) * nw, y: my - ((my - viewBox.y) / viewBox.h) * nh, w: nw, h: nh });
  }, [viewBox]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as Element).closest('[data-district]')) return;
    setIsPanning(true);
    panStart.current = { x: e.clientX, y: e.clientY, vx: viewBox.x, vy: viewBox.y };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }, [viewBox]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPanning || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const dx = ((e.clientX - panStart.current.x) / rect.width) * viewBox.w;
    const dy = ((e.clientY - panStart.current.y) / rect.height) * viewBox.h;
    setViewBox(prev => ({ ...prev, x: panStart.current.vx - dx, y: panStart.current.vy - dy }));
  }, [isPanning, viewBox.w, viewBox.h]);

  const handlePointerUp = useCallback(() => setIsPanning(false), []);
  const resetZoom = useCallback(() => setViewBox({ x: -10, y: -10, w: 520, h: 520 }), []);

  const getState = (id: string): 'inativo' | 'ativo' | 'integrado' =>
    (districtStates.find(s => s.district_id === id)?.state as any) || 'inativo';
  const getSessionCount = (id: string) =>
    districtStates.find(s => s.district_id === id)?.sessions_count || 0;
  const getCollective = (id: string) =>
    collectiveData.find(c => c.district_id === id);

  const isZoomed = viewBox.w !== 520 || viewBox.h !== 520 || viewBox.x !== -10 || viewBox.y !== -10;

  const centerLabel = mode === 'clinico' ? 'Praça da Integração' : 'Praça do Ser';

  // Build road paths
  const roads = useMemo(() => {
    return ROADS.map((road) => {
      const fromPos = DISTRICT_POSITIONS[road.from];
      const toPos = DISTRICT_POSITIONS[road.to];
      if (!fromPos || !toPos) return null;
      const fromD = districts.find(d => d.numero === road.from);
      const toD = districts.find(d => d.numero === road.to);
      const fromState = fromD ? getState(fromD.id) : 'inativo';
      const toState = toD ? getState(toD.id) : 'inativo';
      // Road is lit if at least one end is active
      const lit = fromState !== 'inativo' || toState !== 'inativo';
      return {
        path: roadPath(fromPos, toPos),
        lit,
        key: `${road.from}-${road.to}`,
      };
    }).filter(Boolean) as { path: string; lit: boolean; key: string }[];
  }, [districts, districtStates]);

  // Territory radius
  const TERRITORY_R = 38;
  const CENTER_TERRITORY_R = 50;

  const renderDistrict = (d: MandalaDistrict) => {
    const pos = DISTRICT_POSITIONS[d.numero];
    if (!pos) return null;
    const state = getState(d.id);
    const style = STATE_STYLES[state];
    const isCenter = d.numero === 11;
    const isSelected = selectedId === d.id;
    const isHovered = hoveredDistrict === d.id;
    const sessCount = getSessionCount(d.id);
    const collective = getCollective(d.id);
    const r = isCenter ? CENTER_TERRITORY_R : TERRITORY_R;
    const iconSize = isCenter ? 24 : 20;
    const hoverScale = isHovered ? 1.06 : 1;

    return (
      <g key={d.id} data-district={d.id}
        className={onDistrictClick ? 'cursor-pointer' : ''}
        onClick={(e) => { e.stopPropagation(); onDistrictClick?.(d); }}
        onPointerEnter={() => setHoveredDistrict(d.id)}
        onPointerLeave={() => setHoveredDistrict(null)}
      >
        <title>{d.nome}{d.descricao ? ` — ${d.descricao}` : ''}</title>

        {/* Territory base — irregular patch */}
        {isCenter ? (
          <>
            {/* Center breathing aura */}
            <circle cx={pos.x} cy={pos.y} r={r + 15} fill="url(#center-aura)" opacity="0.5">
              <animate attributeName="r" values={`${r + 10};${r + 18};${r + 10}`} dur="9s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0.6;0.3" dur="9s" repeatCount="indefinite" />
            </circle>
            <circle cx={pos.x} cy={pos.y} r={r}
              fill={style.fill}
              stroke={style.stroke}
              strokeWidth={isHovered ? 1.8 : 1}
              style={{ transition: 'all 0.4s ease' }}
            />
            <circle cx={pos.x} cy={pos.y} r={r - 8} fill="none"
              stroke={style.stroke} strokeWidth="0.4" opacity="0.3" strokeDasharray="4 3" />
          </>
        ) : (
          <>
            {/* Glow for active/integrated */}
            {state !== 'inativo' && (
              <circle cx={pos.x} cy={pos.y} r={r + 6} fill={style.glowColor} filter="url(#territory-glow)">
                <animate attributeName="opacity" values="0.4;0.8;0.4" dur="5s" repeatCount="indefinite" />
              </circle>
            )}

            {/* Territory shape — circle with organic edge feel */}
            <circle cx={pos.x} cy={pos.y} r={r * hoverScale}
              fill={style.fill}
              stroke={style.stroke}
              strokeWidth={isSelected ? 1.8 : isHovered ? 1.4 : 0.8}
              style={{ transition: 'all 0.35s ease' }}
            />

            {/* Selection ring */}
            {isSelected && (
              <circle cx={pos.x} cy={pos.y} r={r + 4} fill="none"
                stroke="#C9A24A" strokeWidth="0.7" strokeDasharray="3 2">
                <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}

            {/* Active pulse */}
            {state === 'ativo' && (
              <circle cx={pos.x} cy={pos.y} r={r} fill="none"
                stroke={style.stroke} strokeWidth="0.3" opacity="0.4">
                <animate attributeName="r" values={`${r};${r + 5};${r}`} dur="4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0;0.4" dur="4s" repeatCount="indefinite" />
              </circle>
            )}

            {/* Integrated badge */}
            {state === 'integrado' && (
              <g transform={`translate(${pos.x + r * 0.6}, ${pos.y - r * 0.6})`}>
                <circle r="8" fill="#3a8a5c" stroke="#6bc48f" strokeWidth="1" />
                <polyline points="-3,0.5 -0.5,3 4,-2.5" fill="none" stroke="#F5F1E8" strokeWidth="1.8" strokeLinecap="round" />
              </g>
            )}
          </>
        )}

        {/* Icon */}
        <svg x={pos.x - iconSize / 2} y={pos.y - (isCenter ? iconSize / 2 + 6 : iconSize / 2 + 2)}
          width={iconSize} height={iconSize} viewBox="0 0 28 28"
          opacity={state === 'inativo' ? 0.4 : 0.85}
          style={{ transition: 'opacity 0.3s ease' }}>
          {DISTRICT_ICONS[d.numero]?.(style.iconColor)}
        </svg>

        {/* Name label */}
        <text x={pos.x} y={pos.y + (isCenter ? 22 : 14)}
          textAnchor="middle" dominantBaseline="central"
          fill={isHovered ? '#C9A24A' : style.textColor}
          fontSize={isCenter ? 13 : 10} fontWeight="600"
          opacity={isHovered ? 1 : 0.85}
          style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.02em', transition: 'fill 0.3s ease, opacity 0.3s ease' }}>
          {isCenter ? centerLabel : d.nome}
        </text>

        {/* Session count */}
        {mode === 'clinico' && sessCount > 0 && !isCenter && (
          <text x={pos.x} y={pos.y + 24}
            textAnchor="middle" fill="#C9A24A" fontSize="7.5" opacity="0.45"
            style={{ fontFamily: "'Inter', sans-serif" }}>
            {sessCount} {sessCount === 1 ? 'sessão' : 'sessões'}
          </text>
        )}

        {/* Collective */}
        {mode === 'coletivo' && collective && collective.client_count > 0 && (
          <text x={pos.x} y={pos.y + 24}
            textAnchor="middle" fill="#C9A24A" fontSize="7" opacity="0.4">
            {collective.client_count} {collective.client_count === 1 ? 'cliente' : 'clientes'}
          </text>
        )}
      </g>
    );
  };

  // Separate center from rest for layering
  const centerDistrict = districts.find(d => d.numero === 11);
  const otherDistricts = districts.filter(d => d.numero !== 11);

  return (
    <div className={`relative ${className || ''}`} style={{ aspectRatio: '1/1', maxWidth: '580px', margin: '0 auto' }}>
      {isZoomed && (
        <button onClick={resetZoom}
          className="absolute top-2 right-2 z-10 px-2.5 py-1 rounded-lg text-[10px] bg-[#C9A24A]/10 border border-[#C9A24A]/20 text-[#C9A24A]/70 hover:text-[#C9A24A] transition-colors backdrop-blur-sm">
          Resetar zoom
        </button>
      )}

      <svg
        ref={svgRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        className={`w-full h-full ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ touchAction: 'none' }}
      >
        <defs>
          <filter id="territory-glow"><feGaussianBlur stdDeviation="8" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="center-glow"><feGaussianBlur stdDeviation="12" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="road-glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>

          <radialGradient id="center-aura">
            <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#C9A24A" stopOpacity="0.04" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          <radialGradient id="bg-vignette" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#6b4ba1" stopOpacity="0.03" />
            <stop offset="60%" stopColor="#0a0a0a" stopOpacity="0.01" />
            <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0.06" />
          </radialGradient>

          {/* Parchment texture */}
          <pattern id="parchment-tex" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="0.3" fill="rgba(245,241,232,0.02)" />
            <circle cx="20" cy="12" r="0.2" fill="rgba(201,162,74,0.015)" />
            <circle cx="8" cy="22" r="0.25" fill="rgba(245,241,232,0.015)" />
            <circle cx="25" cy="28" r="0.15" fill="rgba(107,75,161,0.01)" />
          </pattern>

          {/* Compass rose gradient */}
          <linearGradient id="compass-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#C9A24A" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect x="-10" y="-10" width="520" height="520" fill="url(#bg-vignette)" />
        <rect x="-10" y="-10" width="520" height="520" fill="url(#parchment-tex)" />

        {/* Decorative outer border — map edge */}
        <rect x="5" y="5" width="490" height="490" rx="8" fill="none"
          stroke="rgba(201,162,74,0.06)" strokeWidth="1" />
        <rect x="10" y="10" width="480" height="480" rx="6" fill="none"
          stroke="rgba(201,162,74,0.04)" strokeWidth="0.5" strokeDasharray="6 4" />

        {/* Compass rose in corner */}
        <g transform="translate(460, 460)" opacity="0.12">
          <line x1="0" y1="-18" x2="0" y2="18" stroke="#C9A24A" strokeWidth="0.8" />
          <line x1="-18" y1="0" x2="18" y2="0" stroke="#C9A24A" strokeWidth="0.8" />
          <line x1="-12" y1="-12" x2="12" y2="12" stroke="#C9A24A" strokeWidth="0.4" />
          <line x1="12" y1="-12" x2="-12" y2="12" stroke="#C9A24A" strokeWidth="0.4" />
          <circle cx="0" cy="0" r="4" fill="none" stroke="#C9A24A" strokeWidth="0.6" />
          <circle cx="0" cy="0" r="1.2" fill="#C9A24A" />
          <text x="0" y="-22" textAnchor="middle" fill="#C9A24A" fontSize="6" fontWeight="bold"
            style={{ fontFamily: "'Playfair Display', serif" }}>N</text>
        </g>

        {/* Floating particles */}
        <AtmosphereParticles />

        {/* Roads — drawn under territories */}
        {roads.map((road) => (
          <g key={road.key}>
            <path d={road.path} fill="none"
              stroke={road.lit ? 'rgba(201,162,74,0.18)' : 'rgba(245,241,232,0.05)'}
              strokeWidth={road.lit ? 2.2 : 1.2}
              strokeDasharray={road.lit ? 'none' : '4 4'}
              strokeLinecap="round"
              style={{ transition: 'stroke 0.5s ease, stroke-width 0.5s ease' }}
            />
            {road.lit && (
              <path d={road.path} fill="none"
                stroke="rgba(201,162,74,0.08)" strokeWidth="5"
                strokeLinecap="round" filter="url(#road-glow)" />
            )}
          </g>
        ))}

        {/* Center territory first (under other districts) */}
        {centerDistrict && renderDistrict(centerDistrict)}

        {/* Other districts */}
        {otherDistricts.map(d => renderDistrict(d))}

        {/* Map title cartouche */}
        <g transform="translate(250, 482)" opacity="0.25">
          <text x="0" y="0" textAnchor="middle" fill="#C9A24A" fontSize="9"
            style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.15em' }}>
            CIDADELA INTERIOR
          </text>
          <line x1="-60" y1="5" x2="60" y2="5" stroke="#C9A24A" strokeWidth="0.4" />
        </g>
      </svg>
    </div>
  );
}

// ============================================
// LEGEND
// ============================================
export function MandalaLegend({ mode }: { mode: MandalaMode }) {
  return (
    <div className="space-y-2 mt-3 max-w-[580px] mx-auto">
      <div className="flex items-center justify-center gap-5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: STATE_STYLES.inativo.fill, borderColor: STATE_STYLES.inativo.stroke }} />
          <span className="text-[10px] text-muted-foreground/50">{mode === 'coletivo' ? 'Sem clientes' : 'Não explorado'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: STATE_STYLES.ativo.fill, borderColor: STATE_STYLES.ativo.stroke }} />
          <span className="text-[10px]" style={{ color: '#C9A24A', opacity: 0.7 }}>{mode === 'coletivo' ? 'Com clientes' : 'Ativo'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full border relative" style={{ backgroundColor: STATE_STYLES.integrado.fill, borderColor: STATE_STYLES.integrado.stroke }}>
            <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 5px rgba(74,158,107,0.35)' }} />
          </div>
          <span className="text-[10px]" style={{ color: '#7dd9a0' }}>Integrado</span>
        </div>
      </div>
      <p className="text-[9px] text-muted-foreground/25 text-center italic">
        {mode === 'clinico' ? 'Ferramenta de leitura simbólica. Não substitui julgamento clínico.' : 'Estados indicam o movimento da jornada.'}
      </p>
    </div>
  );
}
