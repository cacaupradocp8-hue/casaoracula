import { useMemo, useState, useRef, useCallback } from 'react';

// ============================================
// MANDALA DA CIDADELA INTERIOR — v7
// Refined radial mandala with cartographic feel
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
const INNER_RING_NUMS = [1, 2, 3, 4, 6];
const OUTER_RING_NUMS = [5, 7, 8, 9, 10, 12];

const STATE_STYLES = {
  inativo: {
    fill: 'rgba(245,241,232,0.02)',
    stroke: 'rgba(245,241,232,0.12)',
    sectorFill: 'rgba(245,241,232,0.012)',
    sectorStroke: 'rgba(245,241,232,0.04)',
    iconColor: 'rgba(245,241,232,0.22)',
    textColor: 'rgba(245,241,232,0.30)',
    glowColor: 'transparent',
  },
  ativo: {
    fill: 'rgba(201,162,74,0.14)',
    stroke: 'rgba(201,162,74,0.55)',
    sectorFill: 'rgba(201,162,74,0.05)',
    sectorStroke: 'rgba(201,162,74,0.12)',
    iconColor: '#C9A24A',
    textColor: '#C9A24A',
    glowColor: 'rgba(201,162,74,0.12)',
  },
  integrado: {
    fill: 'rgba(74,158,107,0.14)',
    stroke: '#6bc48f',
    sectorFill: 'rgba(74,158,107,0.05)',
    sectorStroke: 'rgba(74,158,107,0.12)',
    iconColor: '#6bc48f',
    textColor: '#7dd9a0',
    glowColor: 'rgba(74,158,107,0.15)',
  },
};

const SYMBOLIC_CONNECTIONS: { from: number; to: number; label: string }[] = [
  { from: 1, to: 2, label: 'Da chegada às torres' },
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

function Particles() {
  const particles = useMemo(
    () => Array.from({ length: 16 }, (_, i) => ({
      id: i, cx: 10 + Math.random() * 80, cy: 10 + Math.random() * 80,
      r: 0.1 + Math.random() * 0.18, dur: 10 + Math.random() * 16, delay: Math.random() * 8,
    })),
    []
  );
  return (
    <>
      {particles.map((p) => (
        <circle key={p.id} cx={p.cx} cy={p.cy} r={p.r} fill="#C9A24A" opacity="0">
          <animate attributeName="opacity" values="0;0.15;0" dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
          <animate attributeName="cy" values={`${p.cy};${p.cy - 2};${p.cy}`} dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </>
  );
}

function splitName(nome: string): string[] {
  if (nome.length <= 14) return [nome];
  const mid = Math.floor(nome.length / 2);
  let splitIdx = nome.lastIndexOf(' ', mid + 4);
  if (splitIdx < 4) splitIdx = nome.indexOf(' ', mid - 4);
  if (splitIdx < 0) return [nome];
  return [nome.slice(0, splitIdx), nome.slice(splitIdx + 1)];
}

export function MandalaCidadela({
  districts, districtStates = [], collectiveData = [], mode, selectedId,
  pathPoints = [], onDistrictClick, className, showConnections = false,
}: Props) {
  const CX = 50, CY = 50;
  const CENTER_R = 10;
  const INNER_BAND_IN = 16;
  const INNER_BAND_OUT = 29;
  const OUTER_BAND_IN = 31;
  const OUTER_BAND_OUT = 46;
  const INNER_NODE_R = 22.5;
  const OUTER_NODE_R = 38.5;
  const NODE_R_INNER = 5.2;
  const NODE_R_OUTER = 4.6;

  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState({ x: -4, y: -4, w: 108, h: 108 });
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
    const nw = Math.min(140, Math.max(40, viewBox.w * scale));
    const nh = Math.min(140, Math.max(40, viewBox.h * scale));
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
  const resetZoom = useCallback(() => setViewBox({ x: -4, y: -4, w: 108, h: 108 }), []);

  const centerLabel = mode === 'clinico' ? ['Praça da', 'Integração'] : ['Praça', 'do Ser'];

  const getAngleDeg = (num: number): number => {
    if (num === CENTER_NUM) return 0;
    const isInner = INNER_RING_NUMS.includes(num);
    const ring = isInner ? INNER_RING_NUMS : OUTER_RING_NUMS;
    const idx = ring.indexOf(num);
    const count = ring.length;
    return -90 + idx * (360 / count);
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
      const mx = (p1.x + p2.x) / 2;
      const my = (p1.y + p2.y) / 2;
      const cpx = mx + (CX - mx) * 0.4;
      const cpy = my + (CY - my) * 0.4;
      const curvePath = `M ${p1.x} ${p1.y} Q ${cpx} ${cpy} ${p2.x} ${p2.y}`;
      return { ...conn, p1, p2, midX: mx, midY: my, cpx, cpy, curvePath, idx: i };
    }).filter(Boolean) as any[];
  }, [showConnections, districts]);

  const isZoomed = viewBox.w !== 108 || viewBox.h !== 108 || viewBox.x !== -4 || viewBox.y !== -4;
  const centerDistrict = districts.find(d => d.numero === CENTER_NUM);
  const innerDistricts = districts.filter(d => INNER_RING_NUMS.includes(d.numero));
  const outerDistricts = districts.filter(d => OUTER_RING_NUMS.includes(d.numero));

  const innerSectors = useMemo(() => {
    const count = INNER_RING_NUMS.length;
    const slice = 360 / count;
    return INNER_RING_NUMS.map((num, i) => {
      const startDeg = -90 + i * slice - slice / 2;
      return { num, startDeg, endDeg: startDeg + slice, district: districts.find(dd => dd.numero === num) };
    });
  }, [districts]);

  const outerSectors = useMemo(() => {
    const count = OUTER_RING_NUMS.length;
    const slice = 360 / count;
    return OUTER_RING_NUMS.map((num, i) => {
      const startDeg = -90 + i * slice - slice / 2;
      return { num, startDeg, endDeg: startDeg + slice, district: districts.find(dd => dd.numero === num) };
    });
  }, [districts]);

  // Label position - inner labels between rings, outer labels outside
  const getLabelPos = (num: number) => {
    const angleDeg = getAngleDeg(num);
    const rad = (angleDeg * Math.PI) / 180;
    const isInner = INNER_RING_NUMS.includes(num);
    const r = isInner ? INNER_NODE_R + 7 : OUTER_NODE_R + 6.5;
    return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad), angleDeg };
  };

  const renderDistrictNode = (d: MandalaDistrict, isInner: boolean) => {
    const pos = getPos(d.numero);
    const state = getState(d.id);
    const style = STATE_STYLES[state];
    const isIntegrado = state === 'integrado';
    const isAtivo = state === 'ativo';
    const isSelected = selectedId === d.id;
    const isHovered = hoveredDistrict === d.id;
    const sessCount = getSessionCount(d.id);
    const collective = getCollective(d.id);
    const nodeR = isInner ? NODE_R_INNER : NODE_R_OUTER;
    const iconSize = nodeR * 2.2;
    const labelPos = getLabelPos(d.numero);
    const nameLines = splitName(d.nome);

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
            <animate attributeName="stroke-opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Hover glow */}
        {isHovered && (
          <circle cx={pos.x} cy={pos.y} r={nodeR + 2} fill="rgba(201,162,74,0.06)" stroke="rgba(201,162,74,0.18)" strokeWidth="0.2" filter="url(#m-hover-glow)" />
        )}

        {/* Active pulse */}
        {isAtivo && (
          <circle cx={pos.x} cy={pos.y} r={nodeR + 1.2} fill="none" stroke={style.stroke} strokeWidth="0.2" strokeOpacity="0.35" filter="url(#m-glow-gold)">
            <animate attributeName="r" values={`${nodeR + 0.8};${nodeR + 2};${nodeR + 0.8}`} dur="4s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Integrated halo */}
        {isIntegrado && (
          <>
            <circle cx={pos.x} cy={pos.y} r={nodeR + 1.5} fill="none" stroke="#6bc48f" strokeWidth="0.25" strokeOpacity="0.3" filter="url(#m-glow-green)">
              <animate attributeName="r" values={`${nodeR + 1};${nodeR + 2.5};${nodeR + 1}`} dur="5s" repeatCount="indefinite" />
            </circle>
            <circle cx={pos.x} cy={pos.y} r={nodeR + 0.5} fill="rgba(74,158,107,0.04)" />
          </>
        )}

        {/* Node circle */}
        <circle cx={pos.x} cy={pos.y} r={nodeR} fill={style.fill} stroke={style.stroke}
          strokeWidth={isIntegrado ? '0.7' : isAtivo ? '0.5' : '0.3'}
          style={{ transition: 'all 0.6s ease' }} />

        {/* Inner glow fill */}
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
            <circle r="1.8" fill="#3a8a5c" stroke="#6bc48f" strokeWidth="0.3" />
            <polyline points="-0.6,0.1 -0.1,0.5 0.7,-0.4" fill="none" stroke="#F5F1E8" strokeWidth="0.45" strokeLinecap="round" />
          </g>
        )}

        {/* Label — full name with line break */}
        <text x={labelPos.x} y={labelPos.y - (nameLines.length > 1 ? 1 : 0)} textAnchor="middle" dominantBaseline="central"
          fill={style.textColor} fontSize={isInner ? "2" : "1.8"} fontWeight="500" opacity="0.85"
          style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.02em' }}>
          {nameLines.map((line, i) => (
            <tspan key={i} x={labelPos.x} dy={i === 0 ? 0 : 2.2}>{line}</tspan>
          ))}
        </text>

        {/* Session count */}
        {mode === 'clinico' && sessCount > 0 && (
          <text x={labelPos.x} y={labelPos.y + (nameLines.length > 1 ? 3.5 : 2.5)} textAnchor="middle" fill="#C9A24A" fontSize="1.3" opacity="0.45">
            {sessCount} {sessCount === 1 ? 'sessão' : 'sessões'}
          </text>
        )}

        {/* Collective */}
        {mode === 'coletivo' && collective && collective.client_count > 0 && (
          <>
            {Array.from({ length: Math.min(collective.client_count, 5) }).map((_, i) => {
              const a = (i / Math.max(collective.client_count, 1)) * Math.PI * 2;
              const dr = nodeR * 0.4;
              return (
                <circle key={i} cx={pos.x + dr * Math.cos(a)} cy={pos.y + dr * Math.sin(a)} r="0.7" fill="#C9A24A" filter="url(#m-glow-gold)">
                  <animate attributeName="opacity" values="0.3;0.85;0.3" dur="3s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
                </circle>
              );
            })}
            <text x={labelPos.x} y={labelPos.y + (nameLines.length > 1 ? 3.5 : 2.5)} textAnchor="middle" fill="#C9A24A" fontSize="1.2" opacity="0.4">
              {collective.client_count} {collective.client_count === 1 ? 'cliente' : 'clientes'}
            </text>
          </>
        )}
      </g>
    );
  };

  return (
    <div className={`relative ${className || ''}`} style={{ aspectRatio: '1/1', maxWidth: '520px', margin: '0 auto' }}>
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
          <filter id="m-glow-gold"><feGaussianBlur stdDeviation="1.2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="m-glow-green"><feGaussianBlur stdDeviation="1.8" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="m-center-glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="m-hover-glow"><feGaussianBlur stdDeviation="1.5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="m-soft-glow"><feGaussianBlur stdDeviation="3.5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>

          <radialGradient id="m-center-radial">
            <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.30" />
            <stop offset="35%" stopColor="#C9A24A" stopOpacity="0.08" />
            <stop offset="60%" stopColor="#6b4ba1" stopOpacity="0.03" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="m-bg-gradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#6b4ba1" stopOpacity="0.03" />
            <stop offset="50%" stopColor="#0a0a0a" stopOpacity="0.01" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="m-inner-sector-grad">
            <stop offset="30%" stopColor="#C9A24A" stopOpacity="0.02" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="m-outer-sector-grad">
            <stop offset="30%" stopColor="#6b4ba1" stopOpacity="0.015" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="m-path-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#C9A24A" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#4a9e6b" stopOpacity="0.35" />
          </linearGradient>
          <marker id="m-arrow" markerWidth="3.5" markerHeight="2.5" refX="2.5" refY="1.25" orient="auto">
            <polygon points="0 0, 3.5 1.25, 0 2.5" fill="rgba(201,162,74,0.25)" />
          </marker>
        </defs>

        {/* Background */}
        <circle cx={CX} cy={CY} r="52" fill="url(#m-bg-gradient)" />
        <Particles />

        {/* ===== OUTER RING SECTORS ===== */}
        {outerSectors.map((sec) => {
          const d = sec.district;
          const state = d ? getState(d.id) : 'inativo';
          const style = STATE_STYLES[state];
          return (
            <path key={`outer-sec-${sec.num}`}
              d={sectorPath(CX, CY, OUTER_BAND_IN, OUTER_BAND_OUT, sec.startDeg, sec.endDeg)}
              fill={state !== 'inativo' ? style.sectorFill : 'url(#m-outer-sector-grad)'}
              stroke={style.sectorStroke} strokeWidth="0.15"
              style={{ transition: 'fill 0.8s ease, stroke 0.8s ease' }}
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
              fill={state !== 'inativo' ? style.sectorFill : 'url(#m-inner-sector-grad)'}
              stroke={style.sectorStroke} strokeWidth="0.18"
              style={{ transition: 'fill 0.8s ease, stroke 0.8s ease' }}
            />
          );
        })}

        {/* Ring boundaries */}
        <circle cx={CX} cy={CY} r={OUTER_BAND_OUT} fill="none" stroke="rgba(201,162,74,0.06)" strokeWidth="0.2" />
        <circle cx={CX} cy={CY} r={OUTER_BAND_IN} fill="none" stroke="rgba(107,75,161,0.05)" strokeWidth="0.12" />
        <circle cx={CX} cy={CY} r={INNER_BAND_OUT} fill="none" stroke="rgba(201,162,74,0.10)" strokeWidth="0.25" />
        <circle cx={CX} cy={CY} r={INNER_BAND_IN} fill="none" stroke="rgba(201,162,74,0.08)" strokeWidth="0.2" />

        {/* Decorative outer ring */}
        <circle cx={CX} cy={CY} r={OUTER_BAND_OUT + 2} fill="none" stroke="rgba(107,75,161,0.03)" strokeWidth="0.1" />

        {/* Radial dividers — inner */}
        {INNER_RING_NUMS.map((_, i) => {
          const slice = 360 / INNER_RING_NUMS.length;
          const angleDeg = -90 + i * slice - slice / 2;
          const rad = (angleDeg * Math.PI) / 180;
          return (
            <line key={`idiv-${i}`}
              x1={CX + INNER_BAND_IN * Math.cos(rad)} y1={CY + INNER_BAND_IN * Math.sin(rad)}
              x2={CX + INNER_BAND_OUT * Math.cos(rad)} y2={CY + INNER_BAND_OUT * Math.sin(rad)}
              stroke="rgba(201,162,74,0.06)" strokeWidth="0.12"
            />
          );
        })}
        {/* Radial dividers — outer */}
        {OUTER_RING_NUMS.map((_, i) => {
          const slice = 360 / OUTER_RING_NUMS.length;
          const angleDeg = -90 + i * slice - slice / 2;
          const rad = (angleDeg * Math.PI) / 180;
          return (
            <line key={`odiv-${i}`}
              x1={CX + OUTER_BAND_IN * Math.cos(rad)} y1={CY + OUTER_BAND_IN * Math.sin(rad)}
              x2={CX + OUTER_BAND_OUT * Math.cos(rad)} y2={CY + OUTER_BAND_OUT * Math.sin(rad)}
              stroke="rgba(107,75,161,0.04)" strokeWidth="0.1"
            />
          );
        })}

        {/* Arc connections between adjacent nodes */}
        {INNER_RING_NUMS.map((_, i) => {
          const slice = 360 / INNER_RING_NUMS.length;
          return (
            <path key={`iarc-${i}`}
              d={arcPath(CX, CY, INNER_NODE_R, -90 + i * slice, -90 + (i + 1) * slice)}
              fill="none" stroke="rgba(201,162,74,0.05)" strokeWidth="0.15" strokeDasharray="0.8 1.2"
            />
          );
        })}
        {OUTER_RING_NUMS.map((_, i) => {
          const slice = 360 / OUTER_RING_NUMS.length;
          return (
            <path key={`oarc-${i}`}
              d={arcPath(CX, CY, OUTER_NODE_R, -90 + i * slice, -90 + (i + 1) * slice)}
              fill="none" stroke="rgba(107,75,161,0.04)" strokeWidth="0.12" strokeDasharray="0.6 1"
            />
          );
        })}

        {/* Symbolic connections — curved */}
        {connectionPaths.map((conn: any) => {
          const isHov = hoveredConnection === conn.idx;
          return (
            <g key={`conn-${conn.idx}`}>
              <path d={conn.curvePath}
                fill="none"
                stroke={isHov ? 'rgba(201,162,74,0.45)' : 'rgba(201,162,74,0.05)'}
                strokeWidth={isHov ? '0.4' : '0.12'}
                strokeDasharray={isHov ? 'none' : '1.2 1.8'}
                markerEnd="url(#m-arrow)" style={{ transition: 'all 0.4s ease' }} />
              {/* Invisible hitarea */}
              <path d={conn.curvePath} fill="none" stroke="transparent" strokeWidth="3"
                onPointerEnter={() => setHoveredConnection(conn.idx)}
                onPointerLeave={() => setHoveredConnection(null)}
                className="cursor-help" />
              {isHov && (
                <g>
                  <rect x={conn.midX - 15} y={conn.midY - 3.5} width="30" height="6" rx="1.2"
                    fill="rgba(10,10,10,0.92)" stroke="rgba(201,162,74,0.3)" strokeWidth="0.25" />
                  <text x={conn.midX} y={conn.midY + 0.5} textAnchor="middle"
                    fill="#C9A24A" fontSize="1.8" fontWeight="500" opacity="0.85"
                    style={{ fontFamily: "'Inter', sans-serif" }}>{conn.label}</text>
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
            <path d={pathD} fill="none" stroke="#C9A24A" strokeWidth="0.25" strokeOpacity="0.25" strokeDasharray="1.5 0.8" strokeLinecap="round">
              <animate attributeName="stroke-dashoffset" values="0;-3" dur="2s" repeatCount="indefinite" />
            </path>
          </>
        )}

        {/* ===== CENTER — Praça da Integração ===== */}
        {/* Outer aura */}
        <circle cx={CX} cy={CY} r={CENTER_R + 5} fill="url(#m-center-radial)" filter="url(#m-soft-glow)" />
        {/* Decorative ring */}
        <circle cx={CX} cy={CY} r={CENTER_R + 2} fill="none" stroke="rgba(201,162,74,0.08)" strokeWidth="0.15">
          <animate attributeName="stroke-opacity" values="0.05;0.12;0.05" dur="6s" repeatCount="indefinite" />
        </circle>
        {/* Main breathing circle */}
        <circle cx={CX} cy={CY} r={CENTER_R} fill="rgba(201,162,74,0.08)" stroke="rgba(201,162,74,0.4)" strokeWidth="0.4" filter="url(#m-center-glow)">
          <animate attributeName="r" values={`${CENTER_R};${CENTER_R * 1.05};${CENTER_R}`} dur="6s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.25;0.55;0.25" dur="6s" repeatCount="indefinite" />
        </circle>
        {/* Inner core */}
        <circle cx={CX} cy={CY} r="4" fill="rgba(201,162,74,0.15)" stroke="none">
          <animate attributeName="r" values="3.5;4.5;3.5" dur="6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.35;0.85;0.35" dur="6s" repeatCount="indefinite" />
        </circle>
        {/* Purple accent halo */}
        <circle cx={CX} cy={CY} r={CENTER_R + 1.5} fill="none" stroke="rgba(107,75,161,0.1)" strokeWidth="0.12">
          <animate attributeName="r" values={`${CENTER_R + 1};${CENTER_R + 2.5};${CENTER_R + 1}`} dur="6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.05;0.15;0.05" dur="6s" repeatCount="indefinite" />
        </circle>
        {/* Center icon */}
        <svg x={CX - 4} y={CY - 5.5} width="8" height="8" viewBox="0 0 28 28" opacity="0.5">
          {DISTRICT_ICONS[11]?.('#C9A24A')}
        </svg>
        {/* Center interactive area */}
        {centerDistrict && (
          <g data-district={centerDistrict.id} className={onDistrictClick ? 'cursor-pointer' : ''}
            onClick={(e) => { e.stopPropagation(); onDistrictClick?.(centerDistrict); }}>
            <title>{centerDistrict.nome}</title>
            <circle cx={CX} cy={CY} r={CENTER_R} fill="transparent" />
          </g>
        )}
        {/* Center label */}
        <text x={CX} y={CY + 4} textAnchor="middle" fill="#C9A24A" fontSize="2.5" fontWeight="600" opacity="0.9"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          <tspan x={CX} dy="0">{centerLabel[0]}</tspan>
          <tspan x={CX} dy="2.8">{centerLabel[1]}</tspan>
        </text>

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
    <div className="space-y-2 mt-3 max-w-[520px] mx-auto">
      <div className="flex items-center justify-center gap-5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: STATE_STYLES.inativo.fill, borderColor: STATE_STYLES.inativo.stroke }} />
          <span className="text-[10px] text-muted-foreground/50">{mode === 'coletivo' ? 'Sem clientes' : 'Não explorado'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: STATE_STYLES.ativo.fill, borderColor: STATE_STYLES.ativo.stroke }} />
          <span className="text-[10px]" style={{ color: '#C9A24A', opacity: 0.75 }}>{mode === 'coletivo' ? 'Com clientes' : 'Ativo'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full border relative" style={{ backgroundColor: STATE_STYLES.integrado.fill, borderColor: STATE_STYLES.integrado.stroke }}>
            <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 6px rgba(74,158,107,0.4)' }} />
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
