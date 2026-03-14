import { useMemo, useState, useRef, useCallback } from 'react';

// ============================================
// MANDALA DA CIDADELA INTERIOR — v8
// Cartographic symbolic mandala with depth & balance
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
    fill: 'rgba(245,241,232,0.015)',
    stroke: 'rgba(245,241,232,0.10)',
    sectorFill: 'rgba(245,241,232,0.008)',
    sectorStroke: 'rgba(245,241,232,0.035)',
    iconColor: 'rgba(245,241,232,0.20)',
    textColor: 'rgba(245,241,232,0.28)',
    glowColor: 'transparent',
  },
  ativo: {
    fill: 'rgba(201,162,74,0.12)',
    stroke: 'rgba(201,162,74,0.50)',
    sectorFill: 'rgba(201,162,74,0.04)',
    sectorStroke: 'rgba(201,162,74,0.10)',
    iconColor: '#C9A24A',
    textColor: '#C9A24A',
    glowColor: 'rgba(201,162,74,0.10)',
  },
  integrado: {
    fill: 'rgba(74,158,107,0.12)',
    stroke: '#6bc48f',
    sectorFill: 'rgba(74,158,107,0.04)',
    sectorStroke: 'rgba(74,158,107,0.10)',
    iconColor: '#6bc48f',
    textColor: '#7dd9a0',
    glowColor: 'rgba(74,158,107,0.12)',
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

// Floating cosmos particles with gentle drift
function CosmosLayer() {
  const particles = useMemo(
    () => Array.from({ length: 32 }, (_, i) => {
      const cx = 5 + Math.random() * 90;
      const cy = 5 + Math.random() * 90;
      const driftX = (Math.random() - 0.5) * 6;
      const driftY = (Math.random() - 0.5) * 6;
      return {
        id: i,
        cx, cy, driftX, driftY,
        r: 0.06 + Math.random() * 0.16,
        fadeDur: 14 + Math.random() * 20,
        moveDur: 20 + Math.random() * 30,
        delay: Math.random() * 12,
        isGold: Math.random() > 0.55,
      };
    }),
    []
  );
  return (
    <>
      {particles.map((p) => (
        <circle key={p.id} cx={p.cx} cy={p.cy} r={p.r} fill={p.isGold ? '#C9A24A' : '#F5F1E8'} opacity="0">
          <animate attributeName="opacity" values="0;0.10;0.06;0.10;0" dur={`${p.fadeDur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
          <animate attributeName="cx" values={`${p.cx};${p.cx + p.driftX};${p.cx}`} dur={`${p.moveDur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
          <animate attributeName="cy" values={`${p.cy};${p.cy + p.driftY};${p.cy}`} dur={`${p.moveDur * 1.1}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
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
  // === GEOMETRY — increased spacing for depth ===
  const CX = 50, CY = 50;
  const CENTER_R = 8;
  const INNER_BAND_IN = 17;
  const INNER_BAND_OUT = 28;
  const OUTER_BAND_IN = 33;
  const OUTER_BAND_OUT = 46;
  const INNER_NODE_R = 22.5;
  const OUTER_NODE_R = 39.5;
  // Standardized node size
  const NODE_R = 4.8;

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

  // Sector lookup for hover highlight
  const getSectorForDistrict = (num: number) => {
    const isInner = INNER_RING_NUMS.includes(num);
    const sectors = isInner ? innerSectors : outerSectors;
    return sectors.find(s => s.num === num);
  };

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
    const iconSize = NODE_R * 2.2;
    const hoverScale = isHovered ? 1.05 : 1;
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
          <circle cx={pos.x} cy={pos.y} r={NODE_R + 2.5} fill="none" stroke="#C9A24A" strokeWidth="0.45" strokeDasharray="1.5 0.8">
            <animate attributeName="stroke-opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Hover glow */}
        {isHovered && (
          <circle cx={pos.x} cy={pos.y} r={NODE_R + 2.5} fill="rgba(201,162,74,0.05)" stroke="rgba(201,162,74,0.15)" strokeWidth="0.2" filter="url(#m-hover-glow)" />
        )}

        {/* Active pulse */}
        {isAtivo && (
          <circle cx={pos.x} cy={pos.y} r={NODE_R + 1.2} fill="none" stroke={style.stroke} strokeWidth="0.18" strokeOpacity="0.3" filter="url(#m-glow-gold)">
            <animate attributeName="r" values={`${NODE_R + 0.8};${NODE_R + 2};${NODE_R + 0.8}`} dur="4s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Integrated halo */}
        {isIntegrado && (
          <>
            <circle cx={pos.x} cy={pos.y} r={NODE_R + 1.5} fill="none" stroke="#6bc48f" strokeWidth="0.2" strokeOpacity="0.25" filter="url(#m-glow-green)">
              <animate attributeName="r" values={`${NODE_R + 1};${NODE_R + 2.5};${NODE_R + 1}`} dur="5s" repeatCount="indefinite" />
            </circle>
            <circle cx={pos.x} cy={pos.y} r={NODE_R + 0.3} fill="rgba(74,158,107,0.03)" />
          </>
        )}

        {/* Node circle — with hover scale */}
        <circle cx={pos.x} cy={pos.y} r={NODE_R * hoverScale} fill={style.fill} stroke={style.stroke}
          strokeWidth={isIntegrado ? '0.6' : isAtivo ? '0.45' : '0.25'}
          style={{ transition: 'all 0.4s ease', transformOrigin: `${pos.x}px ${pos.y}px` }} />

        {/* Inner glow fill */}
        {state !== 'inativo' && <circle cx={pos.x} cy={pos.y} r={(NODE_R - 0.3) * hoverScale} fill={style.glowColor} style={{ transition: 'all 0.4s ease' }} />}

        {/* Icon — with hover scale */}
        <svg x={pos.x - (iconSize * hoverScale) / 2} y={pos.y - (iconSize * hoverScale) / 2}
          width={iconSize * hoverScale} height={iconSize * hoverScale} viewBox="0 0 28 28"
          style={{ transition: 'all 0.3s ease' }}>
          {DISTRICT_ICONS[d.numero]?.(style.iconColor) ?? (
            <text x="14" y="16" textAnchor="middle" fill={style.iconColor} fontSize="10" fontWeight="bold">{d.numero}</text>
          )}
        </svg>

        {/* Integration badge */}
        {isIntegrado && (
          <g transform={`translate(${pos.x + NODE_R * 0.6}, ${pos.y - NODE_R * 0.6})`}>
            <circle r="1.6" fill="#3a8a5c" stroke="#6bc48f" strokeWidth="0.25" />
            <polyline points="-0.5,0.1 -0.1,0.45 0.6,-0.35" fill="none" stroke="#F5F1E8" strokeWidth="0.4" strokeLinecap="round" />
          </g>
        )}

        {/* Label — Playfair Display, full name */}
        <text x={labelPos.x} y={labelPos.y - (nameLines.length > 1 ? 1 : 0)} textAnchor="middle" dominantBaseline="central"
          fill={isHovered ? '#C9A24A' : style.textColor} fontSize="1.85" fontWeight="500"
          opacity={isHovered ? 1 : 0.8}
          style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.02em', transition: 'fill 0.3s ease, opacity 0.3s ease' }}>
          {nameLines.map((line, i) => (
            <tspan key={i} x={labelPos.x} dy={i === 0 ? 0 : 2.1}>{line}</tspan>
          ))}
        </text>

        {/* Session count */}
        {mode === 'clinico' && sessCount > 0 && (
          <text x={labelPos.x} y={labelPos.y + (nameLines.length > 1 ? 3.2 : 2.3)} textAnchor="middle" fill="#C9A24A" fontSize="1.2" opacity="0.4"
            style={{ fontFamily: "'Inter', sans-serif" }}>
            {sessCount} {sessCount === 1 ? 'sessão' : 'sessões'}
          </text>
        )}

        {/* Collective */}
        {mode === 'coletivo' && collective && collective.client_count > 0 && (
          <>
            {Array.from({ length: Math.min(collective.client_count, 5) }).map((_, i) => {
              const a = (i / Math.max(collective.client_count, 1)) * Math.PI * 2;
              const dr = NODE_R * 0.4;
              return (
                <circle key={i} cx={pos.x + dr * Math.cos(a)} cy={pos.y + dr * Math.sin(a)} r="0.6" fill="#C9A24A" filter="url(#m-glow-gold)">
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
                </circle>
              );
            })}
            <text x={labelPos.x} y={labelPos.y + (nameLines.length > 1 ? 3.2 : 2.3)} textAnchor="middle" fill="#C9A24A" fontSize="1.1" opacity="0.35">
              {collective.client_count} {collective.client_count === 1 ? 'cliente' : 'clientes'}
            </text>
          </>
        )}
      </g>
    );
  };

  return (
    <div className={`relative ${className || ''}`} style={{ aspectRatio: '1/1', maxWidth: '540px', margin: '0 auto' }}>
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
          <filter id="m-glow-gold"><feGaussianBlur stdDeviation="1" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="m-glow-green"><feGaussianBlur stdDeviation="1.5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="m-center-glow"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="m-hover-glow"><feGaussianBlur stdDeviation="1.2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="m-soft-glow"><feGaussianBlur stdDeviation="2.5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>

          {/* Subtle texture pattern */}
          <pattern id="m-cosmos-texture" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="0.08" fill="rgba(245,241,232,0.04)" />
          </pattern>

          <radialGradient id="m-center-radial">
            <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.18" />
            <stop offset="40%" stopColor="#C9A24A" stopOpacity="0.05" />
            <stop offset="70%" stopColor="#6b4ba1" stopOpacity="0.02" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="m-bg-gradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#6b4ba1" stopOpacity="0.025" />
            <stop offset="40%" stopColor="#0a0a0a" stopOpacity="0.01" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          {/* Inter-ring depth gradient */}
          <radialGradient id="m-depth-inner" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.015" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="m-depth-outer" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#6b4ba1" stopOpacity="0.01" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="m-path-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.12" />
            <stop offset="50%" stopColor="#C9A24A" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#4a9e6b" stopOpacity="0.3" />
          </linearGradient>
          <marker id="m-arrow" markerWidth="3" markerHeight="2" refX="2.2" refY="1" orient="auto">
            <polygon points="0 0, 3 1, 0 2" fill="rgba(201,162,74,0.2)" />
          </marker>
          {/* Sector hover highlight */}
          <radialGradient id="m-sector-hover" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#C9A24A" stopOpacity="0.02" />
          </radialGradient>
        </defs>

        {/* Background field */}
        <circle cx={CX} cy={CY} r="52" fill="url(#m-bg-gradient)" />
        {/* Cosmos texture overlay */}
        <circle cx={CX} cy={CY} r="50" fill="url(#m-cosmos-texture)" opacity="0.5" />
        <CosmosLayer />

        {/* Depth ring between inner and outer (the "void") */}
        <circle cx={CX} cy={CY} r={(INNER_BAND_OUT + OUTER_BAND_IN) / 2} fill="none" stroke="rgba(107,75,161,0.025)" strokeWidth="3" />

        {/* ===== OUTER RING SECTORS ===== */}
        {outerSectors.map((sec) => {
          const d = sec.district;
          const state = d ? getState(d.id) : 'inativo';
          const style = STATE_STYLES[state];
          const isHov = d && hoveredDistrict === d.id;
          return (
            <path key={`outer-sec-${sec.num}`}
              d={sectorPath(CX, CY, OUTER_BAND_IN, OUTER_BAND_OUT, sec.startDeg, sec.endDeg)}
              fill={isHov ? 'url(#m-sector-hover)' : (state !== 'inativo' ? style.sectorFill : 'url(#m-depth-outer)')}
              stroke={isHov ? 'rgba(201,162,74,0.12)' : style.sectorStroke}
              strokeWidth={isHov ? '0.25' : '0.12'}
              style={{ transition: 'fill 0.5s ease, stroke 0.5s ease' }}
            />
          );
        })}

        {/* ===== INNER RING SECTORS ===== */}
        {innerSectors.map((sec) => {
          const d = sec.district;
          const state = d ? getState(d.id) : 'inativo';
          const style = STATE_STYLES[state];
          const isHov = d && hoveredDistrict === d.id;
          return (
            <path key={`inner-sec-${sec.num}`}
              d={sectorPath(CX, CY, INNER_BAND_IN, INNER_BAND_OUT, sec.startDeg, sec.endDeg)}
              fill={isHov ? 'url(#m-sector-hover)' : (state !== 'inativo' ? style.sectorFill : 'url(#m-depth-inner)')}
              stroke={isHov ? 'rgba(201,162,74,0.12)' : style.sectorStroke}
              strokeWidth={isHov ? '0.3' : '0.15'}
              style={{ transition: 'fill 0.5s ease, stroke 0.5s ease' }}
            />
          );
        })}

        {/* Ring boundaries */}
        <circle cx={CX} cy={CY} r={OUTER_BAND_OUT} fill="none" stroke="rgba(201,162,74,0.05)" strokeWidth="0.18" />
        <circle cx={CX} cy={CY} r={OUTER_BAND_IN} fill="none" stroke="rgba(107,75,161,0.04)" strokeWidth="0.1" />
        <circle cx={CX} cy={CY} r={INNER_BAND_OUT} fill="none" stroke="rgba(201,162,74,0.08)" strokeWidth="0.2" />
        <circle cx={CX} cy={CY} r={INNER_BAND_IN} fill="none" stroke="rgba(201,162,74,0.06)" strokeWidth="0.15" />

        {/* Decorative outer boundary */}
        <circle cx={CX} cy={CY} r={OUTER_BAND_OUT + 2} fill="none" stroke="rgba(107,75,161,0.025)" strokeWidth="0.08" />

        {/* Radial dividers — inner */}
        {INNER_RING_NUMS.map((_, i) => {
          const slice = 360 / INNER_RING_NUMS.length;
          const angleDeg = -90 + i * slice - slice / 2;
          const rad = (angleDeg * Math.PI) / 180;
          return (
            <line key={`idiv-${i}`}
              x1={CX + INNER_BAND_IN * Math.cos(rad)} y1={CY + INNER_BAND_IN * Math.sin(rad)}
              x2={CX + INNER_BAND_OUT * Math.cos(rad)} y2={CY + INNER_BAND_OUT * Math.sin(rad)}
              stroke="rgba(201,162,74,0.04)" strokeWidth="0.1"
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
              stroke="rgba(107,75,161,0.03)" strokeWidth="0.08"
            />
          );
        })}

        {/* Arc connections between adjacent nodes */}
        {INNER_RING_NUMS.map((_, i) => {
          const slice = 360 / INNER_RING_NUMS.length;
          return (
            <path key={`iarc-${i}`}
              d={arcPath(CX, CY, INNER_NODE_R, -90 + i * slice, -90 + (i + 1) * slice)}
              fill="none" stroke="rgba(201,162,74,0.035)" strokeWidth="0.12" strokeDasharray="0.6 1"
            />
          );
        })}
        {OUTER_RING_NUMS.map((_, i) => {
          const slice = 360 / OUTER_RING_NUMS.length;
          return (
            <path key={`oarc-${i}`}
              d={arcPath(CX, CY, OUTER_NODE_R, -90 + i * slice, -90 + (i + 1) * slice)}
              fill="none" stroke="rgba(107,75,161,0.03)" strokeWidth="0.1" strokeDasharray="0.5 0.8"
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
                stroke={isHov ? 'rgba(201,162,74,0.4)' : 'rgba(201,162,74,0.04)'}
                strokeWidth={isHov ? '0.35' : '0.1'}
                strokeDasharray={isHov ? 'none' : '1 1.5'}
                markerEnd="url(#m-arrow)" style={{ transition: 'all 0.4s ease' }} />
              <path d={conn.curvePath} fill="none" stroke="transparent" strokeWidth="3"
                onPointerEnter={() => setHoveredConnection(conn.idx)}
                onPointerLeave={() => setHoveredConnection(null)}
                className="cursor-help" />
              {isHov && (
                <g>
                  <rect x={conn.midX - 14} y={conn.midY - 3} width="28" height="5.5" rx="1"
                    fill="rgba(10,10,10,0.9)" stroke="rgba(201,162,74,0.25)" strokeWidth="0.2" />
                  <text x={conn.midX} y={conn.midY + 0.3} textAnchor="middle"
                    fill="#C9A24A" fontSize="1.7" fontWeight="500" opacity="0.8"
                    style={{ fontFamily: "'Inter', sans-serif" }}>{conn.label}</text>
                </g>
              )}
            </g>
          );
        })}

        {/* Journey path */}
        {pathD && (
          <>
            <path d={pathD} fill="none" stroke="url(#m-path-grad)" strokeWidth="0.5" strokeLinecap="round" filter="url(#m-glow-gold)">
              <animate attributeName="stroke-dashoffset" from="20" to="0" dur="3s" repeatCount="indefinite" />
            </path>
            <path d={pathD} fill="none" stroke="#C9A24A" strokeWidth="0.2" strokeOpacity="0.2" strokeDasharray="1.2 0.6" strokeLinecap="round">
              <animate attributeName="stroke-dashoffset" values="0;-3" dur="2s" repeatCount="indefinite" />
            </path>
          </>
        )}

        {/* ===== CENTER — Praça da Integração (subdued glow) ===== */}
        <circle cx={CX} cy={CY} r={CENTER_R + 4} fill="url(#m-center-radial)" filter="url(#m-soft-glow)" />
        <circle cx={CX} cy={CY} r={CENTER_R + 1.5} fill="none" stroke="rgba(201,162,74,0.06)" strokeWidth="0.12">
          <animate attributeName="stroke-opacity" values="0.04;0.07;0.04" dur="9s" repeatCount="indefinite" />
        </circle>
        <circle cx={CX} cy={CY} r={CENTER_R} fill="rgba(201,162,74,0.05)" stroke="rgba(201,162,74,0.3)" strokeWidth="0.35" filter="url(#m-center-glow)">
          <animate attributeName="r" values={`${CENTER_R};${CENTER_R * 1.03};${CENTER_R}`} dur="9s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.2;0.35;0.2" dur="9s" repeatCount="indefinite" />
        </circle>
        <circle cx={CX} cy={CY} r="3" fill="rgba(201,162,74,0.10)" stroke="none">
          <animate attributeName="r" values="2.8;3.4;2.8" dur="9s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.20;0.50;0.20" dur="9s" repeatCount="indefinite" />
        </circle>
        <circle cx={CX} cy={CY} r={CENTER_R + 1} fill="none" stroke="rgba(107,75,161,0.06)" strokeWidth="0.1">
          <animate attributeName="r" values={`${CENTER_R + 0.5};${CENTER_R + 1.8};${CENTER_R + 0.5}`} dur="9s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.03;0.08;0.03" dur="9s" repeatCount="indefinite" />
        </circle>
        {/* Center icon */}
        <svg x={CX - 3.5} y={CY - 5} width="7" height="7" viewBox="0 0 28 28" opacity="0.35">
          {DISTRICT_ICONS[11]?.('#C9A24A')}
        </svg>
        {centerDistrict && (
          <g data-district={centerDistrict.id} className={onDistrictClick ? 'cursor-pointer' : ''}
            onClick={(e) => { e.stopPropagation(); onDistrictClick?.(centerDistrict); }}>
            <title>{centerDistrict.nome}</title>
            <circle cx={CX} cy={CY} r={CENTER_R} fill="transparent" />
          </g>
        )}
        <text x={CX} y={CY + 3.5} textAnchor="middle" fill="#C9A24A" fontSize="2.2" fontWeight="600" opacity="0.75"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          <tspan x={CX} dy="0">{centerLabel[0]}</tspan>
          <tspan x={CX} dy="2.5">{centerLabel[1]}</tspan>
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
    <div className="space-y-2 mt-3 max-w-[540px] mx-auto">
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
