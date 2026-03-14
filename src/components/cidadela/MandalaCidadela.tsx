import { useMemo, useState, useRef, useCallback } from 'react';

// ============================================
// MANDALA DA CIDADELA INTERIOR — v4
// Cartografia Simbólica com hierarquia visual forte
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
const INNER_RING_NUMS = [2, 3, 4, 6];
const OUTER_RING_NUMS = [5, 7, 8, 9, 10, 12];

const STATE_STYLES = {
  inativo: {
    fill: 'rgba(245,241,232,0.03)',
    stroke: 'rgba(245,241,232,0.12)',
    iconColor: 'rgba(245,241,232,0.25)',
    textColor: 'rgba(245,241,232,0.35)',
    glowColor: 'transparent',
  },
  ativo: {
    fill: 'rgba(201,162,74,0.12)',
    stroke: 'rgba(201,162,74,0.6)',
    iconColor: '#C9A24A',
    textColor: '#C9A24A',
    glowColor: 'rgba(201,162,74,0.15)',
  },
  integrado: {
    fill: 'rgba(107,75,161,0.12)',
    stroke: '#9b87c9',
    iconColor: '#b8a4d8',
    textColor: '#b8a4d8',
    glowColor: 'rgba(107,75,161,0.2)',
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

// Larger SVG icons (viewBox 0 0 28 28) for better legibility
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

function Particles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        cx: 10 + Math.random() * 80,
        cy: 10 + Math.random() * 80,
        r: 0.15 + Math.random() * 0.25,
        dur: 8 + Math.random() * 14,
        delay: Math.random() * 6,
      })),
    []
  );
  return (
    <>
      {particles.map((p) => (
        <circle key={p.id} cx={p.cx} cy={p.cy} r={p.r} fill="#C9A24A" opacity="0">
          <animate attributeName="opacity" values="0;0.25;0" dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
          <animate attributeName="cy" values={`${p.cy};${p.cy - 5};${p.cy}`} dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </>
  );
}

export function MandalaCidadela({
  districts,
  districtStates = [],
  collectiveData = [],
  mode,
  selectedId,
  pathPoints = [],
  onDistrictClick,
  className,
  showConnections = false,
}: Props) {
  const cx = 50;
  const cy = 50;
  const innerR = 22;
  const outerR = 40;
  const innerNodeR = 6;
  const outerNodeR = 5.2;
  const centerNodeR = 9.5;

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
    const nx = mx - ((mx - viewBox.x) / viewBox.w) * nw;
    const ny = my - ((my - viewBox.y) / viewBox.h) * nh;
    setViewBox({ x: nx, y: ny, w: nw, h: nh });
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

  const getPos = (num: number) => {
    if (num === CENTER_NUM) return { x: cx, y: cy };
    if (num === ENTRY_NUM) return { x: cx, y: cy - innerR };

    const isInner = INNER_RING_NUMS.includes(num);
    const ring = isInner ? INNER_RING_NUMS : OUTER_RING_NUMS;
    const idx = ring.indexOf(num);
    const count = ring.length;
    const r = isInner ? innerR : outerR;
    const offset = isInner ? -60 : -75;
    const angle = ((idx / count) * 360 + offset) * (Math.PI / 180);
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const getState = (id: string): 'inativo' | 'ativo' | 'integrado' => {
    return (districtStates.find(s => s.district_id === id)?.state as any) || 'inativo';
  };

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
  const ringDistricts = districts.filter(d => d.numero !== CENTER_NUM);

  return (
    <div className={`relative ${className || ''}`} style={{ aspectRatio: '1/1', maxWidth: '420px', margin: '0 auto' }}>
      {isZoomed && (
        <button onClick={resetZoom}
          className="absolute top-2 right-2 z-10 px-2 py-1 rounded text-[9px] bg-[#C9A24A]/10 border border-[#C9A24A]/20 text-[#C9A24A]/70 hover:text-[#C9A24A] transition-colors"
        >
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
          {/* Glow filters */}
          <filter id="m-glow-gold">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="m-glow-purple">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="m-center-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="m-hover-glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          {/* Gradients */}
          <radialGradient id="m-center-radial">
            <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.25" />
            <stop offset="40%" stopColor="#6b4ba1" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#6b4ba1" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="m-inner-ambient">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="70%" stopColor="#6b4ba1" stopOpacity="0.03" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="m-bg-gradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#6b4ba1" stopOpacity="0.04" />
            <stop offset="50%" stopColor="#0a0a0a" stopOpacity="0.02" />
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

        {/* Background ambient */}
        <circle cx={cx} cy={cy} r="48" fill="url(#m-bg-gradient)" />

        <Particles />

        {/* Radial guide lines — 12 directions */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          return (
            <line key={`rad-${i}`}
              x1={cx + 10 * Math.cos(angle)} y1={cy + 10 * Math.sin(angle)}
              x2={cx + (outerR + 5) * Math.cos(angle)} y2={cy + (outerR + 5) * Math.sin(angle)}
              stroke="rgba(107,75,161,0.06)" strokeWidth="0.15"
            />
          );
        })}

        {/* Outer decorative rings */}
        <circle cx={cx} cy={cy} r={outerR + 5} fill="none" stroke="rgba(107,75,161,0.04)" strokeWidth="0.15" />
        <circle cx={cx} cy={cy} r={outerR + 7} fill="none" stroke="rgba(201,162,74,0.03)" strokeWidth="0.1" />

        {/* Outer guide ring */}
        <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="rgba(201,162,74,0.1)" strokeWidth="0.25" strokeDasharray="2 1.5" />

        {/* Inner ambient glow */}
        <circle cx={cx} cy={cy} r={innerR + 2} fill="url(#m-inner-ambient)" />

        {/* Inner guide ring — stronger */}
        <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="rgba(201,162,74,0.15)" strokeWidth="0.3" strokeDasharray="1.5 1" />

        {/* Symbolic connections */}
        {connectionPaths.map((conn: any) => {
          const isHovered = hoveredConnection === conn.idx;
          return (
            <g key={`conn-${conn.idx}`}>
              <line
                x1={conn.p1.x} y1={conn.p1.y} x2={conn.p2.x} y2={conn.p2.y}
                stroke={isHovered ? 'rgba(201,162,74,0.5)' : 'rgba(107,75,161,0.08)'}
                strokeWidth={isHovered ? '0.5' : '0.15'}
                strokeDasharray={isHovered ? 'none' : '1.2 1.2'}
                markerEnd="url(#m-arrow)"
                style={{ transition: 'all 0.3s ease' }}
              />
              <line
                x1={conn.p1.x} y1={conn.p1.y} x2={conn.p2.x} y2={conn.p2.y}
                stroke="transparent" strokeWidth="2.5"
                onPointerEnter={() => setHoveredConnection(conn.idx)}
                onPointerLeave={() => setHoveredConnection(null)}
                className="cursor-help"
              />
              {isHovered && (
                <g>
                  <rect x={conn.midX - 15} y={conn.midY - 3.5} width="30" height="6" rx="1.5"
                    fill="rgba(10,10,10,0.92)" stroke="rgba(201,162,74,0.3)" strokeWidth="0.25" />
                  <text x={conn.midX} y={conn.midY + 0.8} textAnchor="middle"
                    fill="#C9A24A" fontSize="2" fontWeight="500" opacity="0.9">
                    {conn.label}
                  </text>
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

        {/* ===== CENTER — Praça do Ser / Integração ===== */}
        {/* Outer glow aura */}
        <circle cx={cx} cy={cy} r="16" fill="url(#m-center-radial)" />
        {/* Decorative rings around center */}
        <circle cx={cx} cy={cy} r="12" fill="none" stroke="rgba(201,162,74,0.08)" strokeWidth="0.2" />
        {/* Main breathing node */}
        <circle cx={cx} cy={cy} r={centerNodeR} fill="rgba(201,162,74,0.1)" stroke="rgba(201,162,74,0.4)" strokeWidth="0.4" filter="url(#m-center-glow)">
          <animate attributeName="r" values={`${centerNodeR};${centerNodeR * 1.05};${centerNodeR}`} dur="6s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.3;0.6;0.3" dur="6s" repeatCount="indefinite" />
        </circle>
        {/* Inner pulse core */}
        <circle cx={cx} cy={cy} r="4" fill="rgba(201,162,74,0.2)" stroke="none">
          <animate attributeName="r" values="3;4.5;3" dur="6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;1;0.5" dur="6s" repeatCount="indefinite" />
        </circle>
        {/* Purple subtle ring */}
        <circle cx={cx} cy={cy} r={centerNodeR + 1.5} fill="none" stroke="rgba(107,75,161,0.15)" strokeWidth="0.15">
          <animate attributeName="r" values={`${centerNodeR + 1};${centerNodeR + 2};${centerNodeR + 1}`} dur="6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.1;0.2;0.1" dur="6s" repeatCount="indefinite" />
        </circle>
        {/* Center interactive area */}
        {centerDistrict && (
          <g
            data-district={centerDistrict.id}
            className={onDistrictClick ? 'cursor-pointer' : ''}
            onClick={(e) => { e.stopPropagation(); onDistrictClick?.(centerDistrict); }}
          >
            <title>{centerDistrict.nome}</title>
            <circle cx={cx} cy={cy} r={centerNodeR} fill="transparent" />
          </g>
        )}
        {/* Center label */}
        <text x={cx} y={cy - 1.8} textAnchor="middle" fill="#C9A24A" fontSize="2.6" fontWeight="600" opacity="0.9"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          {centerLabel[0]}
        </text>
        <text x={cx} y={cy + 2.2} textAnchor="middle" fill="#C9A24A" fontSize="2.6" fontWeight="600" opacity="0.9"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          {centerLabel[1]}
        </text>

        {/* ===== RING DISTRICTS ===== */}
        {ringDistricts.map((d) => {
          const pos = getPos(d.numero);
          const state = getState(d.id);
          const style = STATE_STYLES[state];
          const isIntegrado = state === 'integrado';
          const isSelected = selectedId === d.id;
          const isHovered = hoveredDistrict === d.id;
          const sessCount = getSessionCount(d.id);
          const collective = getCollective(d.id);
          const isEntry = d.numero === ENTRY_NUM;
          const isInner = INNER_RING_NUMS.includes(d.numero);
          const nodeR = isEntry ? 4.5 : isInner ? innerNodeR : outerNodeR;
          const iconSize = nodeR * 2.2;

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
                  <animate attributeName="r" values={`${nodeR + 1};${nodeR + 2.2};${nodeR + 1}`} dur="4s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Subtle fill glow */}
              {state !== 'inativo' && (
                <circle cx={pos.x} cy={pos.y} r={nodeR} fill={style.glowColor} />
              )}

              {/* Node circle */}
              <circle cx={pos.x} cy={pos.y} r={nodeR} fill={style.fill} stroke={style.stroke}
                strokeWidth={isIntegrado ? '0.7' : '0.45'}
                style={{ transition: 'all 0.5s ease' }}
              />

              {/* Icon — larger viewbox */}
              <svg x={pos.x - iconSize / 2} y={pos.y - iconSize / 2} width={iconSize} height={iconSize} viewBox="0 0 28 28">
                {DISTRICT_ICONS[d.numero]?.(style.iconColor) ?? (
                  <text x="14" y="16" textAnchor="middle" fill={style.iconColor} fontSize="10" fontWeight="bold">
                    {d.numero}
                  </text>
                )}
              </svg>

              {/* Integration badge */}
              {isIntegrado && (
                <g transform={`translate(${pos.x + nodeR * 0.65}, ${pos.y - nodeR * 0.65})`}>
                  <circle r="2" fill="#6b4ba1" stroke="#b8a4d8" strokeWidth="0.3" />
                  <polyline points="-0.7,0.1 -0.2,0.6 0.8,-0.5" fill="none" stroke="#F5F1E8" strokeWidth="0.5" strokeLinecap="round" />
                </g>
              )}

              {/* Label */}
              <text x={pos.x} y={pos.y + nodeR + 3.2} textAnchor="middle" fill={style.textColor} fontSize="2" fontWeight="500" opacity="0.9"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                {d.nome.length > 16 ? d.nome.slice(0, 15) + '…' : d.nome}
              </text>

              {/* Session count badge */}
              {mode === 'clinico' && sessCount > 0 && (
                <text x={pos.x} y={pos.y + nodeR + 5} textAnchor="middle" fill="#C9A24A" fontSize="1.5" opacity="0.5">
                  {sessCount}s
                </text>
              )}

              {/* Collective indicators */}
              {mode === 'coletivo' && collective && collective.client_count > 0 && (
                <>
                  {Array.from({ length: Math.min(collective.client_count, 5) }).map((_, i) => {
                    const angle = (i / Math.max(collective.client_count, 1)) * Math.PI * 2;
                    const dotR = nodeR * 0.45;
                    return (
                      <circle key={i} cx={pos.x + dotR * Math.cos(angle)} cy={pos.y + dotR * Math.sin(angle)} r="0.9" fill="#C9A24A" filter="url(#m-glow-gold)">
                        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
                      </circle>
                    );
                  })}
                  <text x={pos.x} y={pos.y + nodeR + 5} textAnchor="middle" fill="#C9A24A" fontSize="1.4" opacity="0.5">
                    {collective.client_count} {collective.client_count === 1 ? 'cliente' : 'clientes'}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ============================================
// LEGEND COMPONENT
// ============================================
export function MandalaLegend({ mode }: { mode: MandalaMode }) {
  return (
    <div className="space-y-2 mt-3 max-w-[420px] mx-auto">
      <div className="flex items-center justify-center gap-5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: STATE_STYLES.inativo.fill, borderColor: STATE_STYLES.inativo.stroke }} />
          <span className="text-[10px] text-muted-foreground/50">
            {mode === 'coletivo' ? 'Sem clientes' : 'Não explorado'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: STATE_STYLES.ativo.fill, borderColor: STATE_STYLES.ativo.stroke }} />
          <span className="text-[10px]" style={{ color: '#C9A24A', opacity: 0.7 }}>
            {mode === 'coletivo' ? 'Com clientes' : 'Ativo'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full border relative" style={{ backgroundColor: STATE_STYLES.integrado.fill, borderColor: STATE_STYLES.integrado.stroke }}>
            <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 6px rgba(107,75,161,0.4)' }} />
          </div>
          <span className="text-[10px]" style={{ color: '#b8a4d8' }}>Integrado</span>
        </div>
      </div>
      <p className="text-[9px] text-muted-foreground/30 text-center italic">
        {mode === 'clinico'
          ? 'Ferramenta de leitura simbólica. Não substitui julgamento clínico.'
          : 'Estados indicam o movimento da jornada.'}
      </p>
    </div>
  );
}
