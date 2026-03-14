import { useMemo, useState, useRef, useCallback } from 'react';

// ============================================
// MANDALA DA CIDADELA INTERIOR
// Shared SVG mandala with 2 concentric rings
// Zoom/Pan + Symbolic Connections
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

// Ring assignment based on actual DB structure:
// Center: Praça da Integração (11) — rendered as center node
// Entry: Portão da Chegada (1) — rendered at top of inner ring
// Inner ring (4): Torres(2), Portas(3), Jardim dos Arquétipos(4), Casa dos Sonhos(6)
// Outer ring (6): Praça do Abalo(5), Espelho dos Vínculos(7), A Forja(8), Conselho Interior(9), Labirinto(10), Portal de Renascimento(12)
const CENTER_NUM = 11;
const ENTRY_NUM = 1;
const INNER_RING_NUMS = [2, 3, 4, 6];
const OUTER_RING_NUMS = [5, 7, 8, 9, 10, 12];

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

// Symbolic connections between districts with therapeutic descriptions
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

// SVG mini-icons per district number
const DISTRICT_ICONS: Record<number, (color: string) => JSX.Element> = {
  1: (c) => <g><path d="M8 18 L12 6 L16 18" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round"/><line x1="10" y1="14" x2="14" y2="14" stroke={c} strokeWidth="1.2"/></g>,
  2: (c) => <g><rect x="8" y="5" width="8" height="14" rx="1" fill="none" stroke={c} strokeWidth="1.5"/><circle cx="14" cy="12" r="1" fill={c}/></g>,
  3: (c) => <g><rect x="9" y="7" width="6" height="12" rx="0.5" fill="none" stroke={c} strokeWidth="1.5"/><line x1="12" y1="4" x2="12" y2="7" stroke={c} strokeWidth="1.5"/><line x1="10" y1="5" x2="14" y2="5" stroke={c} strokeWidth="1.5"/></g>,
  4: (c) => <g><circle cx="12" cy="8" r="3" fill="none" stroke={c} strokeWidth="1.5"/><line x1="12" y1="11" x2="12" y2="18" stroke={c} strokeWidth="1.5"/><line x1="12" y1="15" x2="14" y2="15" stroke={c} strokeWidth="1.2"/></g>,
  5: (c) => <g><path d="M12 12 m-1,0 a1,1 0 1,1 2,0 a2,2 0 1,1 -4,0 a3,3 0 1,1 6,0 a4,4 0 1,1 -8,0 a5,5 0 1,1 10,0" fill="none" stroke={c} strokeWidth="1.2"/></g>,
  6: (c) => <g><circle cx="12" cy="10" r="2" fill="none" stroke={c} strokeWidth="1.5"/><circle cx="10" cy="8" r="1.5" fill="none" stroke={c} strokeWidth="1"/><circle cx="14" cy="8" r="1.5" fill="none" stroke={c} strokeWidth="1"/><line x1="12" y1="12" x2="12" y2="18" stroke={c} strokeWidth="1.5"/></g>,
  7: (c) => <g><ellipse cx="12" cy="10" rx="4" ry="5" fill="none" stroke={c} strokeWidth="1.5"/><line x1="12" y1="15" x2="12" y2="19" stroke={c} strokeWidth="1.5"/><line x1="9" y1="19" x2="15" y2="19" stroke={c} strokeWidth="1.5"/></g>,
  8: (c) => <g><rect x="8" y="12" width="8" height="3" rx="0.5" fill="none" stroke={c} strokeWidth="1.5"/><line x1="12" y1="5" x2="12" y2="12" stroke={c} strokeWidth="1.5"/><circle cx="12" cy="5" r="1.5" fill="none" stroke={c} strokeWidth="1.2"/></g>,
  9: (c) => <g><circle cx="12" cy="12" r="5" fill="none" stroke={c} strokeWidth="1.2" strokeDasharray="2 2"/><circle cx="12" cy="7" r="1" fill={c}/><circle cx="12" cy="17" r="1" fill={c}/><circle cx="7" cy="12" r="1" fill={c}/><circle cx="17" cy="12" r="1" fill={c}/></g>,
  10: (c) => <g><path d="M14 6 A6 6 0 1 0 14 18 A4 4 0 1 1 14 6" fill="none" stroke={c} strokeWidth="1.5"/></g>,
  11: (c) => <g><circle cx="12" cy="12" r="5" fill="none" stroke={c} strokeWidth="1.2"/><line x1="12" y1="7" x2="12" y2="17" stroke={c} strokeWidth="1"/><line x1="7" y1="12" x2="17" y2="12" stroke={c} strokeWidth="1"/><circle cx="12" cy="12" r="2" fill="none" stroke={c} strokeWidth="1"/></g>,
  12: (c) => <g><path d="M6 16 Q12 6 18 16" fill="none" stroke={c} strokeWidth="1.5"/><line x1="12" y1="8" x2="12" y2="5" stroke={c} strokeWidth="1.2"/><line x1="8" y1="10" x2="6" y2="8" stroke={c} strokeWidth="1.2"/><line x1="16" y1="10" x2="18" y2="8" stroke={c} strokeWidth="1.2"/></g>,
};

function Particles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        cx: Math.random() * 100,
        cy: Math.random() * 100,
        r: 0.12 + Math.random() * 0.2,
        dur: 8 + Math.random() * 12,
        delay: Math.random() * 5,
      })),
    []
  );
  return (
    <>
      {particles.map((p) => (
        <circle key={p.id} cx={p.cx} cy={p.cy} r={p.r} fill="#C9A24A" opacity="0">
          <animate attributeName="opacity" values="0;0.2;0" dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
          <animate attributeName="cy" values={`${p.cy};${p.cy - 6};${p.cy}`} dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
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
  const innerR = 24;
  const outerR = 42;
  const innerNodeR = 5.2;
  const outerNodeR = 4.5;
  const centerNodeR = 8;

  // Zoom/Pan state
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 100, h: 100 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const [hoveredConnection, setHoveredConnection] = useState<number | null>(null);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * viewBox.w + viewBox.x;
    const my = ((e.clientY - rect.top) / rect.height) * viewBox.h + viewBox.y;
    const scale = e.deltaY > 0 ? 1.15 : 0.87;
    const nw = Math.min(120, Math.max(30, viewBox.w * scale));
    const nh = Math.min(120, Math.max(30, viewBox.h * scale));
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

  const handlePointerUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const resetZoom = useCallback(() => {
    setViewBox({ x: 0, y: 0, w: 100, h: 100 });
  }, []);

  // Center label: "Praça da Integração" for clinical, "Praça do Ser" for personal
  const centerLabel = mode === 'clinico' ? ['Praça da', 'Integração'] : ['Praça', 'do Ser'];

  const getPos = (num: number) => {
    // Center district
    if (num === CENTER_NUM) return { x: cx, y: cy };
    // Entry at top
    if (num === ENTRY_NUM) return { x: cx, y: cy - innerR + 2 };

    const isInner = INNER_RING_NUMS.includes(num);
    const ring = isInner ? INNER_RING_NUMS : OUTER_RING_NUMS;
    const idx = ring.indexOf(num);
    const count = ring.length;
    const r = isInner ? innerR : outerR;
    // Start from top (-90°), distribute evenly
    const angle = ((idx / count) * 360 - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const getState = (id: string): 'inativo' | 'ativo' | 'integrado' => {
    const ds = districtStates.find((s) => s.district_id === id);
    return (ds?.state as 'inativo' | 'ativo' | 'integrado') || 'inativo';
  };

  const getSessionCount = (id: string) => {
    return districtStates.find((s) => s.district_id === id)?.sessions_count || 0;
  };

  const getCollective = (id: string) => {
    return collectiveData.find((c) => c.district_id === id);
  };

  const pathD = useMemo(() => {
    if (pathPoints.length < 2) return '';
    return `M ${pathPoints.map((p) => `${p.x},${p.y}`).join(' L ')}`;
  }, [pathPoints]);

  // Build connection positions from district numbers
  const connectionPaths = useMemo(() => {
    if (!showConnections || districts.length === 0) return [];
    return SYMBOLIC_CONNECTIONS.map((conn, i) => {
      const fromD = districts.find(d => d.numero === conn.from);
      const toD = districts.find(d => d.numero === conn.to);
      if (!fromD || !toD) return null;
      const p1 = getPos(conn.from);
      const p2 = getPos(conn.to);
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      return { ...conn, p1, p2, midX, midY, idx: i };
    }).filter(Boolean) as (typeof SYMBOLIC_CONNECTIONS[0] & { p1: { x: number; y: number }; p2: { x: number; y: number }; midX: number; midY: number; idx: number })[];
  }, [showConnections, districts]);

  // Compass reference lines
  const compassLines = [0, 60, 120].map((angle) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x1: cx + (outerR - 6) * Math.cos(rad),
      y1: cy + (outerR - 6) * Math.sin(rad),
      x2: cx + (outerR + 4) * Math.cos(rad),
      y2: cy + (outerR + 4) * Math.sin(rad),
      x3: cx - (outerR - 6) * Math.cos(rad),
      y3: cy - (outerR - 6) * Math.sin(rad),
      x4: cx - (outerR + 4) * Math.cos(rad),
      y4: cy - (outerR + 4) * Math.sin(rad),
    };
  });

  const isZoomed = viewBox.w !== 100 || viewBox.h !== 100 || viewBox.x !== 0 || viewBox.y !== 0;

  // Separate center district, entry district, and ring districts
  const centerDistrict = districts.find(d => d.numero === CENTER_NUM);
  const entryDistrict = districts.find(d => d.numero === ENTRY_NUM);
  const ringDistricts = districts.filter(d => d.numero !== CENTER_NUM);

  return (
    <div className={`relative ${className || ''}`} style={{ aspectRatio: '1/1' }}>
      {/* Zoom controls */}
      {isZoomed && (
        <button
          onClick={resetZoom}
          className="absolute top-2 right-2 z-10 px-2 py-1 rounded text-[9px] bg-gold/10 border border-gold/20 text-gold/70 hover:text-gold transition-colors"
        >
          Reset zoom
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
          <filter id="mandala-glow">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="mandala-center-pulse">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="mandala-path-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#C9A24A" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#C9A24A" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="mandala-center-glow">
            <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.2" />
            <stop offset="60%" stopColor="#C9A24A" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#C9A24A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="mandala-inner-ring-glow">
            <stop offset="0%" stopColor="#C9A24A" stopOpacity="0" />
            <stop offset="80%" stopColor="#C9A24A" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#C9A24A" stopOpacity="0" />
          </radialGradient>
          <marker id="conn-arrow" markerWidth="4" markerHeight="3" refX="3" refY="1.5" orient="auto">
            <polygon points="0 0, 4 1.5, 0 3" fill="rgba(201,162,74,0.3)" />
          </marker>
        </defs>

        <Particles />

        {/* Compass lines */}
        {compassLines.map((l, i) => (
          <g key={i}>
            <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="rgba(201,162,74,0.04)" strokeWidth="0.1" />
            <line x1={l.x3} y1={l.y3} x2={l.x4} y2={l.y4} stroke="rgba(201,162,74,0.04)" strokeWidth="0.1" />
          </g>
        ))}

        {/* Outer decorative ring */}
        <circle cx={cx} cy={cy} r={outerR + 4} fill="none" stroke="rgba(201,162,74,0.03)" strokeWidth="0.15" />

        {/* Outer ring guide */}
        <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="rgba(201,162,74,0.06)" strokeWidth="0.15" strokeDasharray="1 1.5" />

        {/* Inner ring guide */}
        <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="rgba(201,162,74,0.08)" strokeWidth="0.15" strokeDasharray="0.8 1.2" />

        {/* Symbolic connections between districts */}
        {connectionPaths.map((conn) => {
          const isHovered = hoveredConnection === conn.idx;
          return (
            <g key={`conn-${conn.idx}`}>
              <line
                x1={conn.p1.x} y1={conn.p1.y} x2={conn.p2.x} y2={conn.p2.y}
                stroke={isHovered ? 'rgba(201,162,74,0.5)' : 'rgba(201,162,74,0.08)'}
                strokeWidth={isHovered ? '0.4' : '0.15'}
                strokeDasharray={isHovered ? 'none' : '1 1'}
                markerEnd="url(#conn-arrow)"
                style={{ transition: 'all 0.3s ease' }}
              />
              <line
                x1={conn.p1.x} y1={conn.p1.y} x2={conn.p2.x} y2={conn.p2.y}
                stroke="transparent" strokeWidth="2"
                onPointerEnter={() => setHoveredConnection(conn.idx)}
                onPointerLeave={() => setHoveredConnection(null)}
                className="cursor-help"
              />
              {isHovered && (
                <g>
                  <rect x={conn.midX - 14} y={conn.midY - 3} width="28" height="5" rx="1"
                    fill="rgba(11,27,43,0.9)" stroke="rgba(201,162,74,0.3)" strokeWidth="0.2" />
                  <text x={conn.midX} y={conn.midY + 0.8} textAnchor="middle"
                    fill="#C9A24A" fontSize="1.8" fontWeight="500" opacity="0.9">
                    {conn.label}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Journey path (clinical mode) */}
        {pathD && (
          <>
            <path d={pathD} fill="none" stroke="url(#mandala-path-grad)" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#mandala-glow)">
              <animate attributeName="stroke-dashoffset" from="20" to="0" dur="3s" repeatCount="indefinite" />
            </path>
            <path d={pathD} fill="none" stroke="#C9A24A" strokeWidth="0.25" strokeOpacity="0.4" strokeDasharray="1.5 1" strokeLinecap="round">
              <animate attributeName="stroke-dashoffset" values="0;-3" dur="2s" repeatCount="indefinite" />
            </path>
          </>
        )}

        {/* Center — Praça da Integração */}
        <circle cx={cx} cy={cy} r="10" fill="url(#mandala-center-glow)" />
        <circle cx={cx} cy={cy} r="7" fill="rgba(201,162,74,0.05)" stroke="rgba(201,162,74,0.15)" strokeWidth="0.3" />
        <circle cx={cx} cy={cy} r="4" fill="rgba(201,162,74,0.08)" stroke="rgba(201,162,74,0.2)" strokeWidth="0.2">
          <animate attributeName="r" values="3.5;4.2;3.5" dur="4s" repeatCount="indefinite" />
        </circle>
        {/* Center icon for district 11 */}
        {centerDistrict && (
          <g
            data-district={centerDistrict.id}
            className={onDistrictClick ? 'cursor-pointer' : ''}
            onClick={(e) => { e.stopPropagation(); onDistrictClick?.(centerDistrict); }}
          >
            <title>{centerDistrict.nome}</title>
            <circle cx={cx} cy={cy} r="7" fill="transparent" />
          </g>
        )}
        <text x={cx} y={cy - 1.2} textAnchor="middle" fill="#C9A24A" fontSize="1.8" fontWeight="600" opacity="0.7">
          {centerLabel[0]}
        </text>
        <text x={cx} y={cy + 1.5} textAnchor="middle" fill="#C9A24A" fontSize="1.8" fontWeight="600" opacity="0.7">
          {centerLabel[1]}
        </text>

        {/* Ring Districts */}
        {ringDistricts.map((d) => {
          const pos = getPos(d.numero);
          const state = getState(d.id);
          const style = STATE_STYLES[state];
          const isIntegrado = state === 'integrado';
          const isSelected = selectedId === d.id;
          const sessCount = getSessionCount(d.id);
          const collective = getCollective(d.id);
          const isEntry = d.numero === ENTRY_NUM;
          const isInner = INNER_RING_NUMS.includes(d.numero);
          const nodeR = isEntry ? 3.5 : isInner ? innerNodeR : outerNodeR;

          return (
            <g
              key={d.id}
              data-district={d.id}
              className={onDistrictClick ? 'cursor-pointer' : ''}
              onClick={(e) => {
                e.stopPropagation();
                onDistrictClick?.(d);
              }}
            >
              <title>{d.nome}</title>

              {/* Selection ring */}
              {isSelected && (
                <circle cx={pos.x} cy={pos.y} r={nodeR + 2} fill="none" stroke="#C9A24A" strokeWidth="0.4" strokeDasharray="1 0.5">
                  <animate attributeName="stroke-opacity" values="0.4;0.8;0.4" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Glow for active/integrated — smooth pulse */}
              {state !== 'inativo' && (
                <circle cx={pos.x} cy={pos.y} r={nodeR + 1.2} fill="none" stroke={style.stroke} strokeWidth="0.15" strokeOpacity="0.3" filter="url(#mandala-glow)">
                  <animate attributeName="r" values={`${nodeR + 0.8};${nodeR + 1.5};${nodeR + 0.8}`} dur="3s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Node circle */}
              <circle cx={pos.x} cy={pos.y} r={nodeR} fill={style.fill} stroke={style.stroke}
                strokeWidth={isIntegrado ? '0.6' : '0.4'}
                style={{ transition: 'fill 0.5s ease, stroke 0.5s ease' }}
              />

              {/* Icon */}
              <svg x={pos.x - nodeR} y={pos.y - nodeR} width={nodeR * 2} height={nodeR * 2} viewBox="0 0 24 24">
                {DISTRICT_ICONS[d.numero]?.(style.iconColor) ?? (
                  <text x="12" y="14" textAnchor="middle" fill={style.iconColor} fontSize="8" fontWeight="bold">
                    {d.numero}
                  </text>
                )}
              </svg>

              {/* Integration check */}
              {isIntegrado && (
                <g transform={`translate(${pos.x + nodeR * 0.6}, ${pos.y - nodeR * 0.6})`}>
                  <circle r="1.5" fill="#C9A24A" />
                  <polyline points="-0.6,0 -0.15,0.5 0.6,-0.4" fill="none" stroke="#0B1B2B" strokeWidth="0.4" strokeLinecap="round" />
                </g>
              )}

              {/* Label */}
              <text x={pos.x} y={pos.y + nodeR + 2.5} textAnchor="middle" fill={style.textColor} fontSize="1.6" fontWeight="500" opacity="0.8">
                {d.nome.length > 14 ? d.nome.slice(0, 13) + '…' : d.nome}
              </text>

              {/* Session count (clinical mode) */}
              {mode === 'clinico' && sessCount > 0 && (
                <text x={pos.x} y={pos.y + nodeR + 4} textAnchor="middle" fill="#C9A24A" fontSize="1.3" opacity="0.5">
                  {sessCount}s
                </text>
              )}

              {/* Collective count */}
              {mode === 'coletivo' && collective && collective.client_count > 0 && (
                <>
                  {Array.from({ length: Math.min(collective.client_count, 5) }).map((_, i) => {
                    const angle = (i / Math.max(collective.client_count, 1)) * Math.PI * 2;
                    const dotR = 2;
                    const dx = pos.x + dotR * Math.cos(angle);
                    const dy = pos.y + dotR * Math.sin(angle);
                    return (
                      <circle key={i} cx={dx} cy={dy} r="0.7" fill="#C9A24A" filter="url(#mandala-glow)">
                        <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
                      </circle>
                    );
                  })}
                  <text x={pos.x} y={pos.y + nodeR + 4} textAnchor="middle" fill="#C9A24A" fontSize="1.2" opacity="0.5">
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
    <div className="space-y-2 mt-2">
      <div className="flex items-center justify-center gap-5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: STATE_STYLES.inativo.fill, borderColor: STATE_STYLES.inativo.stroke }} />
          <span className="text-[10px] text-muted-foreground/50">
            {mode === 'coletivo' ? 'Sem clientes' : 'Não explorado'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: STATE_STYLES.ativo.fill, borderColor: STATE_STYLES.ativo.stroke }} />
          <span className="text-[10px] text-gold/70">
            {mode === 'coletivo' ? 'Com clientes' : 'Ativo'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full border relative" style={{ backgroundColor: STATE_STYLES.integrado.fill, borderColor: STATE_STYLES.integrado.stroke }}>
            <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 4px rgba(201,162,74,0.3)' }} />
          </div>
          <span className="text-[10px] text-[#556B57]">Integrado</span>
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
