import { useMemo, useState, useRef, useCallback } from 'react';

// ============================================
// MANDALA DA CIDADELA INTERIOR — v5
// True radial mandala with sector geometry
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

const CENTER_NUM = 11;
const ENTRY_NUM = 1;
// Inner ring: 5 districts (entry + 4) evenly at 72° each
const INNER_RING_NUMS = [1, 2, 3, 4, 6];
// Outer ring: 6 districts evenly at 60° each
const OUTER_RING_NUMS = [5, 7, 8, 9, 10, 12];

const STATE_STYLES = {
  inativo: {
    fill: 'rgba(245,241,232,0.02)',
    stroke: 'rgba(245,241,232,0.1)',
    sectorFill: 'rgba(245,241,232,0.015)',
    sectorStroke: 'rgba(245,241,232,0.04)',
    iconColor: 'rgba(245,241,232,0.2)',
    textColor: 'rgba(245,241,232,0.3)',
    glowColor: 'transparent',
  },
  ativo: {
    fill: 'rgba(201,162,74,0.12)',
    stroke: 'rgba(201,162,74,0.55)',
    sectorFill: 'rgba(201,162,74,0.04)',
    sectorStroke: 'rgba(201,162,74,0.12)',
    iconColor: '#C9A24A',
    textColor: '#C9A24A',
    glowColor: 'rgba(201,162,74,0.12)',
  },
  integrado: {
    fill: 'rgba(107,75,161,0.12)',
    stroke: '#9b87c9',
    sectorFill: 'rgba(107,75,161,0.04)',
    sectorStroke: 'rgba(107,75,161,0.12)',
    iconColor: '#b8a4d8',
    textColor: '#b8a4d8',
    glowColor: 'rgba(107,75,161,0.15)',
  },
};

const SYMBOLIC_CONNECTIONS: { from: number; to: number; label: string }[] = [
  { from: 2, to: 3, label: 'Da defesa ao limiar' },
  { from: 3, to: 10, label: 'Do limiar ao labirinto' },
  { from: 10, to: 8, label: 'Do labirinto à forja' },
  { from: 8, to: 11, label: 'Da forja à integração' },
  { from: 4, to: 6, label: 'Do arquétipo ao sonho' },
  { from: 6, to: 5, label: 'Do sonho ao abalo' },
  { from: 7, to: 9, label: 'Do espelho ao conselho' },
  { from: 9, to: 5, label: 'Do conselho ao abalo' },
  { from: 5, to: 12, label: 'Do abalo ao renascimento' },
  { from: 12, to: 11, label: 'Do renascimento à integração' },
  { from: 1, to: 2, label: 'Da chegada às torres' },
];

const DISTRICT_ICONS: Record<number, (c: string) => JSX.Element> = {
  1: (c) => <g><path d="M10 22 L14 6 L18 22" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"/><line x1="11.5" y1="16" x2="16.5" y2="16" stroke={c} strokeWidth="1.5"/></g>,
  2: (c) => <g><rect x="9" y="5" width="10" height="18" rx="1.5" fill="none" stroke={c} strokeWidth="2"/><circle cx="16" cy="14" r="1.2" fill={c}/></g>,
  3: (c) => <g><rect x="10" y="8" width="8" height="14" rx="1" fill="none" stroke={c} strokeWidth="2"/><line x1="14" y1="4" x2="14" y2="8" stroke={c} strokeWidth="2"/><line x1="11" y1="5.5" x2="17" y2="5.5" stroke={c} strokeWidth="1.5"/></g>,
  4: (c) => <g><circle cx="14" cy="9" r="4" fill="none" stroke={c} strokeWidth="2"/><line x1="14" y1="13" x2="14" y2="22" stroke={c} strokeWidth="2"/><line x1="14" y1="18" x2="17" y2="17" stroke={c} strokeWidth="1.5"/></g>,
  5: (c) => <g><path d="M14 14 m-1.5,0 a1.5,1.5 0 1,1 3,0 a3,3 0 1,1 -6,0 a5,5 0 1,1 10,0 a7,7 0 1,1 -14,0" fill="none" stroke={c} strokeWidth="1.5"/></g>,
  6: (c) => <g><circle cx="14" cy="11" r="3" fill="none" stroke={c} strokeWidth="2"/><circle cx="11" cy="8.5" r="2" fill="none" stroke={c} strokeWidth="1.2"/><circle cx="17" cy="8.5" r="2" fill="none" stroke={c} strokeWidth="1.2"/><line x1="14" y1="14" x2="14" y2="22" stroke={c} strokeWidth="2"/></g>,
  7: (c) => <g><ellipse cx="14" cy="12" rx="5" ry="6.5" fill="none" stroke={c} strokeWidth="2"/><line x1="14" y1="18.5" x2="14" y2="23" stroke={c} strokeWidth="2"/><line x1="10" y1="23" x2="18" y2="23" stroke={c} strokeWidth="1.5"/></g>,
  8: (c) => <g><rect x="9" y="14" width="10" height="4" rx="1" fill="none" stroke={c} strokeWidth="2"/><line x1="14" y1="5" x2="14" y2="14" stroke={c} strokeWidth="2"/><circle cx="14" cy="5" r="2" fill="none" stroke={c} strokeWidth="1.5"/></g>,
  9: (c) => <g><circle cx="14" cy="14" r="6.5" fill="none" stroke={c} strokeWidth="1.5" strokeDasharray="2.5 2.5"/><circle cx="14" cy="7.5" r="1.5" fill={c}/><circle cx="14" cy="20.5" r="1.5" fill={c}/><circle cx="7.5" cy="14" r="1.5" fill={c}/><circle cx="20.5" cy="14" r="1.5" fill={c}/></g>,
  10: (c) => <g><path d="M16 6 A7 7 0 1 0 16 22 A5 5 0 1 1 16 6" fill="none" stroke={c} strokeWidth="2"/></g>,
  11: (c) => <g><circle cx="14" cy="14" r="6" fill="none" stroke={c} strokeWidth="1.5"/><line x1="14" y1="8" x2="14" y2="20" stroke={c} strokeWidth="1.2"/><line x1="8" y1="14" x2="20" y2="14" stroke={c} strokeWidth="1.2"/><circle cx="14" cy="14" r="2.5" fill="none" stroke={c} strokeWidth="1.2"/></g>,
  12: (c) => <g><path d="M6 20 Q14 6 22 20" fill="none" stroke={c} strokeWidth="2"/><line x1="14" y1="9" x2="14" y2="5" stroke={c} strokeWidth="1.5"/><line x1="9" y1="12" x2="7" y2="9" stroke={c} strokeWidth="1.5"/><line x1="19" y1="12" x2="21" y2="9" stroke={c} strokeWidth="1.5"/></g>,
};

// SVG arc path helper
function arcPath(cx: number, cy: number, r: number, startAngleDeg: number, endAngleDeg: number): string {
  const startRad = (startAngleDeg * Math.PI) / 180;
  const endRad = (endAngleDeg * Math.PI) / 180;
  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy + r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);
  const largeArc = endAngleDeg - startAngleDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

// Sector (wedge) path between two radii
function sectorPath(cx: number, cy: number, innerR: number, outerR: number, startDeg: number, endDeg: number): string {
  const s1 = (startDeg * Math.PI) / 180;
  const e1 = (endDeg * Math.PI) / 180;
  const ix1 = cx + innerR * Math.cos(s1), iy1 = cy + innerR * Math.sin(s1);
  const ix2 = cx + innerR * Math.cos(e1), iy2 = cy + innerR * Math.sin(e1);
  const ox1 = cx + outerR * Math.cos(s1), oy1 = cy + outerR * Math.sin(s1);
  const ox2 = cx + outerR * Math.cos(e1), oy2 = cy + outerR * Math.sin(e1);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${ix1} ${iy1} L ${ox1} ${oy1} A ${outerR} ${outerR} 0 ${large} 1 ${ox2} ${oy2} L ${ix2} ${iy2} A ${innerR} ${innerR} 0 ${large} 0 ${ix1} ${iy1} Z`;
}

function Particles() {
  const particles = useMemo(
    () => Array.from({ length: 18 }, (_, i) => ({
      id: i, cx: 10 + Math.random() * 80, cy: 10 + Math.random() * 80,
      r: 0.12 + Math.random() * 0.2, dur: 9 + Math.random() * 12, delay: Math.random() * 6,
    })),
    []
  );
  return (
    <>
      {particles.map((p) => (
        <circle key={p.id} cx={p.cx} cy={p.cy} r={p.r} fill="#C9A24A" opacity="0">
          <animate attributeName="opacity" values="0;0.2;0" dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
          <animate attributeName="cy" values={`${p.cy};${p.cy - 4};${p.cy}`} dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </>
  );
}

export function MandalaCidadela({
  districts, districtStates = [], collectiveData = [], mode, selectedId,
  pathPoints = [], onDistrictClick, className, showConnections = false,
}: Props) {
  const CX = 50, CY = 50;
  const CENTER_R = 11;        // center node radius
  const INNER_BAND_IN = 14;   // inner band starts
  const INNER_BAND_OUT = 28;  // inner band ends
  const OUTER_BAND_IN = 30;   // outer band starts  
  const OUTER_BAND_OUT = 46;  // outer band ends
  const INNER_NODE_R = 21;    // radius where inner nodes sit
  const OUTER_NODE_R = 38;    // radius where outer nodes sit
  const NODE_R_INNER = 5.5;
  const NODE_R_OUTER = 4.8;

  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState({ x: -2, y: -2, w: 104, h: 104 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const [hoveredConnection, setHoveredConnection] = useState<number | null>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * viewBox.w + viewBox.x;
    const my = ((e.clientY - rect.top) / rect.height) * viewBox.h + viewBox.y;
    const scale = e.deltaY > 0 ? 1.12 : 0.89;
    const nw = Math.min(130, Math.max(35, viewBox.w * scale));
    const nh = Math.min(130, Math.max(35, viewBox.h * scale));
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
  const resetZoom = useCallback(() => setViewBox({ x: -2, y: -2, w: 104, h: 104 }), []);

  const centerLabel = mode === 'clinico' ? ['Praça da', 'Integração'] : ['Praça', 'do Ser'];

  // Position calculator — true radial symmetry
  const getAngleDeg = (num: number): number => {
    if (num === CENTER_NUM) return 0;
    const isInner = INNER_RING_NUMS.includes(num);
    const ring = isInner ? INNER_RING_NUMS : OUTER_RING_NUMS;
    const idx = ring.indexOf(num);
    const count = ring.length;
    const sliceAngle = 360 / count;
    return -90 + idx * sliceAngle; // start from top
  };

  const getPos = (num: number) => {
    if (num === CENTER_NUM) return { x: CX, y: CY };
    const angleDeg = getAngleDeg(num);
    const rad = (angleDeg * Math.PI) / 180;
    const isInner = INNER_RING_NUMS.includes(num);
    const r = isInner ? INNER_NODE_R : OUTER_NODE_R;
    return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
  };

  const getState = (id: string): 'inativo' | 'ativo' | 'integrado' =>
    (districtStates.find(s => s.district_id === id)?.state as any) || 'inativo';
  const getSessionCount = (id: string) =>
    districtStates.find(s => s.district_id === id)?.sessions_count || 0;
  const getCollective = (id: string) =>
    collectiveData.find(c => c.district_id === id);

  const pathD = useMemo(() => {
    if (pathPoints.length < 2) return '';
    return `M ${pathPoints.map(p => `${p.x},${p.y}`).join(' L ')}`;
  }, [pathPoints]);

  const connectionPaths = useMemo(() => {
    if (!showConnections || districts.length === 0) return [];
    return SYMBOLIC_CONNECTIONS.map((conn, i) => {
      const fromD = districts.find(d => d.numero === conn.from);
      const toD = districts.find(d => d.numero === conn.to);
      if (!fromD || !toD) return null;
      const p1 = getPos(conn.from);
      const p2 = getPos(conn.to);
      return { ...conn, p1, p2, midX: (p1.x + p2.x) / 2, midY: (p1.y + p2.y) / 2, idx: i };
    }).filter(Boolean) as any[];
  }, [showConnections, districts]);

  const isZoomed = viewBox.w !== 104 || viewBox.h !== 104 || viewBox.x !== -2 || viewBox.y !== -2;
  const centerDistrict = districts.find(d => d.numero === CENTER_NUM);
  const innerDistricts = districts.filter(d => INNER_RING_NUMS.includes(d.numero));
  const outerDistricts = districts.filter(d => OUTER_RING_NUMS.includes(d.numero));

  // Build sector data for each ring
  const innerSectors = useMemo(() => {
    const count = INNER_RING_NUMS.length;
    const slice = 360 / count;
    return INNER_RING_NUMS.map((num, i) => {
      const startDeg = -90 + i * slice - slice / 2;
      const endDeg = startDeg + slice;
      const d = districts.find(dd => dd.numero === num);
      return { num, startDeg, endDeg, district: d };
    });
  }, [districts]);

  const outerSectors = useMemo(() => {
    const count = OUTER_RING_NUMS.length;
    const slice = 360 / count;
    return OUTER_RING_NUMS.map((num, i) => {
      const startDeg = -90 + i * slice - slice / 2;
      const endDeg = startDeg + slice;
      const d = districts.find(dd => dd.numero === num);
      return { num, startDeg, endDeg, district: d };
    });
  }, [districts]);

  // Label position: pushed outward from node
  const getLabelPos = (num: number) => {
    const angleDeg = getAngleDeg(num);
    const rad = (angleDeg * Math.PI) / 180;
    const isInner = INNER_RING_NUMS.includes(num);
    const labelR = isInner ? INNER_NODE_R : OUTER_NODE_R + 7;
    // For inner ring, labels go between node and inner band edge
    const r = isInner ? INNER_NODE_R + 7.5 : labelR;
    return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
  };

  const renderDistrictNode = (d: MandalaDistrict, isInner: boolean) => {
    const pos = getPos(d.numero);
    const state = getState(d.id);
    const style = STATE_STYLES[state];
    const isIntegrado = state === 'integrado';
    const isSelected = selectedId === d.id;
    const isHovered = hoveredDistrict === d.id;
    const sessCount = getSessionCount(d.id);
    const collective = getCollective(d.id);
    const nodeR = isInner ? NODE_R_INNER : NODE_R_OUTER;
    const iconSize = nodeR * 2.2;
    const labelPos = getLabelPos(d.numero);

    return (
      <g
        key={d.id}
        data-district={d.id}
        className={onDistrictClick ? 'cursor-pointer' : ''}
        onClick={(e) => { e.stopPropagation(); onDistrictClick?.(d); }}
        onPointerEnter={() => setHoveredDistrict(d.id)}
        onPointerLeave={() => setHoveredDistrict(null)}
      >
        <title>{d.nome}{d.descricao ? ` — ${d.descricao}` : ''}</title>

        {/* Selection ring */}
        {isSelected && (
          <circle cx={pos.x} cy={pos.y} r={nodeR + 2.5} fill="none" stroke="#C9A24A" strokeWidth="0.5" strokeDasharray="1.5 0.8">
            <animate attributeName="stroke-opacity" values="0.4;0.9;0.4" dur="1.5s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Hover glow */}
        {isHovered && (
          <circle cx={pos.x} cy={pos.y} r={nodeR + 3} fill="rgba(201,162,74,0.06)" stroke="rgba(201,162,74,0.15)" strokeWidth="0.2" filter="url(#m-hover-glow)" />
        )}

        {/* Active/Integrated glow pulse */}
        {state !== 'inativo' && (
          <circle cx={pos.x} cy={pos.y} r={nodeR + 1.5} fill="none" stroke={style.stroke} strokeWidth="0.2" strokeOpacity="0.3"
            filter={isIntegrado ? 'url(#m-glow-purple)' : 'url(#m-glow-gold)'}>
            <animate attributeName="r" values={`${nodeR + 1};${nodeR + 2};${nodeR + 1}`} dur="4s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Node circle */}
        <circle cx={pos.x} cy={pos.y} r={nodeR} fill={style.fill} stroke={style.stroke}
          strokeWidth={isIntegrado ? '0.7' : '0.4'} style={{ transition: 'all 0.5s ease' }} />

        {/* Glow fill */}
        {state !== 'inativo' && <circle cx={pos.x} cy={pos.y} r={nodeR - 0.3} fill={style.glowColor} />}

        {/* Icon */}
        <svg x={pos.x - iconSize / 2} y={pos.y - iconSize / 2} width={iconSize} height={iconSize} viewBox="0 0 28 28">
          {DISTRICT_ICONS[d.numero]?.(style.iconColor) ?? (
            <text x="14" y="16" textAnchor="middle" fill={style.iconColor} fontSize="10" fontWeight="bold">{d.numero}</text>
          )}
        </svg>

        {/* Integration badge */}
        {isIntegrado && (
          <g transform={`translate(${pos.x + nodeR * 0.6}, ${pos.y - nodeR * 0.6})`}>
            <circle r="1.8" fill="#6b4ba1" stroke="#b8a4d8" strokeWidth="0.3" />
            <polyline points="-0.6,0.1 -0.15,0.5 0.7,-0.4" fill="none" stroke="#F5F1E8" strokeWidth="0.45" strokeLinecap="round" />
          </g>
        )}

        {/* Label — positioned radially outward */}
        <text x={labelPos.x} y={labelPos.y} textAnchor="middle" dominantBaseline="central"
          fill={style.textColor} fontSize={isInner ? "2.1" : "1.8"} fontWeight="500" opacity="0.85"
          style={{ fontFamily: "'Inter', sans-serif" }}>
          {d.nome.length > 18 ? d.nome.slice(0, 17) + '…' : d.nome}
        </text>

        {/* Session count */}
        {mode === 'clinico' && sessCount > 0 && (
          <text x={labelPos.x} y={labelPos.y + 2.5} textAnchor="middle" fill="#C9A24A" fontSize="1.4" opacity="0.45">
            {sessCount}s
          </text>
        )}

        {/* Collective */}
        {mode === 'coletivo' && collective && collective.client_count > 0 && (
          <>
            {Array.from({ length: Math.min(collective.client_count, 5) }).map((_, i) => {
              const a = (i / Math.max(collective.client_count, 1)) * Math.PI * 2;
              const dr = nodeR * 0.4;
              return (
                <circle key={i} cx={pos.x + dr * Math.cos(a)} cy={pos.y + dr * Math.sin(a)} r="0.8" fill="#C9A24A" filter="url(#m-glow-gold)">
                  <animate attributeName="opacity" values="0.3;0.85;0.3" dur="3s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
                </circle>
              );
            })}
            <text x={labelPos.x} y={labelPos.y + 2.5} textAnchor="middle" fill="#C9A24A" fontSize="1.3" opacity="0.45">
              {collective.client_count} {collective.client_count === 1 ? 'cliente' : 'clientes'}
            </text>
          </>
        )}
      </g>
    );
  };

  return (
    <div className={`relative ${className || ''}`} style={{ aspectRatio: '1/1', maxWidth: '420px', margin: '0 auto' }}>
      {isZoomed && (
        <button onClick={resetZoom}
          className="absolute top-2 right-2 z-10 px-2 py-1 rounded text-[9px] bg-[#C9A24A]/10 border border-[#C9A24A]/20 text-[#C9A24A]/70 hover:text-[#C9A24A] transition-colors">
          Reset
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
          <filter id="m-glow-gold"><feGaussianBlur stdDeviation="1.5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="m-glow-purple"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="m-center-glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="m-hover-glow"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>

          <radialGradient id="m-center-radial">
            <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#6b4ba1" stopOpacity="0.06" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="m-bg-gradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#6b4ba1" stopOpacity="0.03" />
            <stop offset="60%" stopColor="#0a0a0a" stopOpacity="0.01" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="m-path-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#C9A24A" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#6b4ba1" stopOpacity="0.3" />
          </linearGradient>
          <marker id="m-arrow" markerWidth="4" markerHeight="3" refX="3" refY="1.5" orient="auto">
            <polygon points="0 0, 4 1.5, 0 3" fill="rgba(201,162,74,0.25)" />
          </marker>
        </defs>

        {/* Background */}
        <circle cx={CX} cy={CY} r="49" fill="url(#m-bg-gradient)" />
        <Particles />

        {/* ===== OUTER RING SECTORS ===== */}
        {outerSectors.map((sec) => {
          const d = sec.district;
          const state = d ? getState(d.id) : 'inativo';
          const style = STATE_STYLES[state];
          return (
            <path key={`outer-sec-${sec.num}`}
              d={sectorPath(CX, CY, OUTER_BAND_IN, OUTER_BAND_OUT, sec.startDeg, sec.endDeg)}
              fill={style.sectorFill} stroke={style.sectorStroke} strokeWidth="0.15"
              style={{ transition: 'fill 0.5s ease' }}
            />
          );
        })}

        {/* ===== INNER RING SECTORS ===== */}
        {innerSectors.map((sec) => {
          const d = sec.district;
          const state = d ? getState(d.id) : 'inativo';
          const style = STATE_STYLES[state];
          return (
            <path key={`inner-sec-${sec.num}`}
              d={sectorPath(CX, CY, INNER_BAND_IN, INNER_BAND_OUT, sec.startDeg, sec.endDeg)}
              fill={style.sectorFill} stroke={style.sectorStroke} strokeWidth="0.2"
              style={{ transition: 'fill 0.5s ease' }}
            />
          );
        })}

        {/* Outer ring boundary circles */}
        <circle cx={CX} cy={CY} r={OUTER_BAND_OUT} fill="none" stroke="rgba(201,162,74,0.06)" strokeWidth="0.2" />
        <circle cx={CX} cy={CY} r={OUTER_BAND_IN} fill="none" stroke="rgba(107,75,161,0.06)" strokeWidth="0.15" />

        {/* Inner ring boundary circles */}
        <circle cx={CX} cy={CY} r={INNER_BAND_OUT} fill="none" stroke="rgba(201,162,74,0.1)" strokeWidth="0.25" />
        <circle cx={CX} cy={CY} r={INNER_BAND_IN} fill="none" stroke="rgba(201,162,74,0.08)" strokeWidth="0.2" />

        {/* Decorative outer-most ring */}
        <circle cx={CX} cy={CY} r={OUTER_BAND_OUT + 2} fill="none" stroke="rgba(107,75,161,0.03)" strokeWidth="0.1" />

        {/* Radial divider lines from center through both rings */}
        {/* Inner ring dividers: 5 lines */}
        {INNER_RING_NUMS.map((_, i) => {
          const slice = 360 / INNER_RING_NUMS.length;
          const angleDeg = -90 + i * slice - slice / 2;
          const rad = (angleDeg * Math.PI) / 180;
          return (
            <line key={`idiv-${i}`}
              x1={CX + INNER_BAND_IN * Math.cos(rad)} y1={CY + INNER_BAND_IN * Math.sin(rad)}
              x2={CX + INNER_BAND_OUT * Math.cos(rad)} y2={CY + INNER_BAND_OUT * Math.sin(rad)}
              stroke="rgba(201,162,74,0.06)" strokeWidth="0.15"
            />
          );
        })}
        {/* Outer ring dividers: 6 lines */}
        {OUTER_RING_NUMS.map((_, i) => {
          const slice = 360 / OUTER_RING_NUMS.length;
          const angleDeg = -90 + i * slice - slice / 2;
          const rad = (angleDeg * Math.PI) / 180;
          return (
            <line key={`odiv-${i}`}
              x1={CX + OUTER_BAND_IN * Math.cos(rad)} y1={CY + OUTER_BAND_IN * Math.sin(rad)}
              x2={CX + OUTER_BAND_OUT * Math.cos(rad)} y2={CY + OUTER_BAND_OUT * Math.sin(rad)}
              stroke="rgba(107,75,161,0.05)" strokeWidth="0.12"
            />
          );
        })}

        {/* Soft arc connections between adjacent inner districts */}
        {INNER_RING_NUMS.map((_, i) => {
          const slice = 360 / INNER_RING_NUMS.length;
          const startDeg = -90 + i * slice;
          const endDeg = startDeg + slice;
          return (
            <path key={`iarc-${i}`}
              d={arcPath(CX, CY, INNER_NODE_R, startDeg, endDeg)}
              fill="none" stroke="rgba(201,162,74,0.06)" strokeWidth="0.2" strokeDasharray="1 1.5"
            />
          );
        })}

        {/* Soft arc connections between adjacent outer districts */}
        {OUTER_RING_NUMS.map((_, i) => {
          const slice = 360 / OUTER_RING_NUMS.length;
          const startDeg = -90 + i * slice;
          const endDeg = startDeg + slice;
          return (
            <path key={`oarc-${i}`}
              d={arcPath(CX, CY, OUTER_NODE_R, startDeg, endDeg)}
              fill="none" stroke="rgba(107,75,161,0.05)" strokeWidth="0.15" strokeDasharray="0.8 1.2"
            />
          );
        })}

        {/* Symbolic connections */}
        {connectionPaths.map((conn: any) => {
          const isHovered = hoveredConnection === conn.idx;
          return (
            <g key={`conn-${conn.idx}`}>
              <line x1={conn.p1.x} y1={conn.p1.y} x2={conn.p2.x} y2={conn.p2.y}
                stroke={isHovered ? 'rgba(201,162,74,0.45)' : 'rgba(107,75,161,0.06)'}
                strokeWidth={isHovered ? '0.45' : '0.12'}
                strokeDasharray={isHovered ? 'none' : '1 1.5'}
                markerEnd="url(#m-arrow)" style={{ transition: 'all 0.3s ease' }} />
              <line x1={conn.p1.x} y1={conn.p1.y} x2={conn.p2.x} y2={conn.p2.y}
                stroke="transparent" strokeWidth="2.5"
                onPointerEnter={() => setHoveredConnection(conn.idx)}
                onPointerLeave={() => setHoveredConnection(null)}
                className="cursor-help" />
              {isHovered && (
                <g>
                  <rect x={conn.midX - 15} y={conn.midY - 3.5} width="30" height="6" rx="1.5"
                    fill="rgba(10,10,10,0.92)" stroke="rgba(201,162,74,0.3)" strokeWidth="0.25" />
                  <text x={conn.midX} y={conn.midY + 0.8} textAnchor="middle"
                    fill="#C9A24A" fontSize="1.9" fontWeight="500" opacity="0.9">{conn.label}</text>
                </g>
              )}
            </g>
          );
        })}

        {/* Journey path */}
        {pathD && (
          <>
            <path d={pathD} fill="none" stroke="url(#m-path-grad)" strokeWidth="0.6" strokeLinecap="round" filter="url(#m-glow-gold)">
              <animate attributeName="stroke-dashoffset" from="20" to="0" dur="3s" repeatCount="indefinite" />
            </path>
            <path d={pathD} fill="none" stroke="#C9A24A" strokeWidth="0.3" strokeOpacity="0.3" strokeDasharray="2 1" strokeLinecap="round">
              <animate attributeName="stroke-dashoffset" values="0;-3" dur="2s" repeatCount="indefinite" />
            </path>
          </>
        )}

        {/* ===== CENTER — Praça do Ser ===== */}
        <circle cx={CX} cy={CY} r={CENTER_R + 5} fill="url(#m-center-radial)" />
        <circle cx={CX} cy={CY} r={CENTER_R + 2} fill="none" stroke="rgba(201,162,74,0.08)" strokeWidth="0.2" />
        {/* Main breathing circle */}
        <circle cx={CX} cy={CY} r={CENTER_R} fill="rgba(201,162,74,0.08)" stroke="rgba(201,162,74,0.4)" strokeWidth="0.45" filter="url(#m-center-glow)">
          <animate attributeName="r" values={`${CENTER_R};${CENTER_R * 1.05};${CENTER_R}`} dur="6s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.3;0.6;0.3" dur="6s" repeatCount="indefinite" />
        </circle>
        {/* Inner core pulse */}
        <circle cx={CX} cy={CY} r="4.5" fill="rgba(201,162,74,0.18)" stroke="none">
          <animate attributeName="r" values="3.5;5;3.5" dur="6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;1;0.4" dur="6s" repeatCount="indefinite" />
        </circle>
        {/* Purple halo */}
        <circle cx={CX} cy={CY} r={CENTER_R + 1.5} fill="none" stroke="rgba(107,75,161,0.12)" strokeWidth="0.15">
          <animate attributeName="r" values={`${CENTER_R + 1};${CENTER_R + 2.5};${CENTER_R + 1}`} dur="6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.08;0.18;0.08" dur="6s" repeatCount="indefinite" />
        </circle>
        {/* Center interactive */}
        {centerDistrict && (
          <g data-district={centerDistrict.id} className={onDistrictClick ? 'cursor-pointer' : ''}
            onClick={(e) => { e.stopPropagation(); onDistrictClick?.(centerDistrict); }}>
            <title>{centerDistrict.nome}</title>
            <circle cx={CX} cy={CY} r={CENTER_R} fill="transparent" />
          </g>
        )}
        {/* Center label */}
        <text x={CX} y={CY - 2} textAnchor="middle" fill="#C9A24A" fontSize="2.8" fontWeight="600" opacity="0.9"
          style={{ fontFamily: "'Playfair Display', serif" }}>{centerLabel[0]}</text>
        <text x={CX} y={CY + 2.5} textAnchor="middle" fill="#C9A24A" fontSize="2.8" fontWeight="600" opacity="0.9"
          style={{ fontFamily: "'Playfair Display', serif" }}>{centerLabel[1]}</text>

        {/* ===== RENDER DISTRICTS ===== */}
        {innerDistricts.map(d => renderDistrictNode(d, true))}
        {outerDistricts.map(d => renderDistrictNode(d, false))}
      </svg>
    </div>
  );
}

// ============================================
// LEGEND
// ============================================
export function MandalaLegend({ mode }: { mode: MandalaMode }) {
  return (
    <div className="space-y-2 mt-3 max-w-[420px] mx-auto">
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
            <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 6px rgba(107,75,161,0.4)' }} />
          </div>
          <span className="text-[10px]" style={{ color: '#b8a4d8' }}>Integrado</span>
        </div>
      </div>
      <p className="text-[9px] text-muted-foreground/30 text-center italic">
        {mode === 'clinico' ? 'Ferramenta de leitura simbólica. Não substitui julgamento clínico.' : 'Estados indicam o movimento da jornada.'}
      </p>
    </div>
  );
}
