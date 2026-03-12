import { useMemo } from 'react';

// ============================================
// MANDALA DA CIDADELA INTERIOR
// Shared SVG mandala with 2 concentric rings
// Used across: /mapa-casa, ClienteDetail, PainelClinico
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
}

// Ring assignment: inner (1-6), outer (7-12)
const INNER_RING_NUMS = [1, 2, 3, 4, 5, 6];
const OUTER_RING_NUMS = [7, 8, 9, 10, 11, 12];

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

// SVG mini-icons per district number
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
}: Props) {
  const cx = 50;
  const cy = 50;
  const innerR = 24;
  const outerR = 40;
  const nodeR = 4.2;

  const centerLabel = mode === 'clinico' ? ['Praça da', 'Integração'] : ['Praça', 'do Ser'];

  const getPos = (num: number) => {
    const isInner = INNER_RING_NUMS.includes(num);
    const ring = isInner ? INNER_RING_NUMS : OUTER_RING_NUMS;
    const idx = ring.indexOf(num);
    const count = ring.length;
    const r = isInner ? innerR : outerR;
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

  return (
    <div className={className} style={{ aspectRatio: '1/1' }}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <filter id="mandala-glow">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
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
            <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#C9A24A" stopOpacity="0" />
          </radialGradient>
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

        {/* Center */}
        <circle cx={cx} cy={cy} r="9" fill="url(#mandala-center-glow)" />
        <circle cx={cx} cy={cy} r="6.5" fill="rgba(201,162,74,0.05)" stroke="rgba(201,162,74,0.15)" strokeWidth="0.3" />
        <circle cx={cx} cy={cy} r="3.5" fill="rgba(201,162,74,0.08)" stroke="rgba(201,162,74,0.2)" strokeWidth="0.2">
          <animate attributeName="r" values="3.2;3.8;3.2" dur="4s" repeatCount="indefinite" />
        </circle>
        <text x={cx} y={cy - 1} textAnchor="middle" fill="#C9A24A" fontSize="1.8" fontWeight="600" opacity="0.7">
          {centerLabel[0]}
        </text>
        <text x={cx} y={cy + 1.5} textAnchor="middle" fill="#C9A24A" fontSize="1.8" fontWeight="600" opacity="0.7">
          {centerLabel[1]}
        </text>

        {/* Districts */}
        {districts.map((d) => {
          const pos = getPos(d.numero);
          const state = getState(d.id);
          const style = STATE_STYLES[state];
          const isIntegrado = state === 'integrado';
          const isSelected = selectedId === d.id;
          const sessCount = getSessionCount(d.id);
          const collective = getCollective(d.id);

          return (
            <g
              key={d.id}
              className={onDistrictClick ? 'cursor-pointer' : ''}
              onClick={() => onDistrictClick?.(d)}
            >
              {/* Selection ring */}
              {isSelected && (
                <circle cx={pos.x} cy={pos.y} r={nodeR + 2} fill="none" stroke="#C9A24A" strokeWidth="0.4" strokeDasharray="1 0.5">
                  <animate attributeName="stroke-opacity" values="0.4;0.8;0.4" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Glow for active/integrated */}
              {state !== 'inativo' && (
                <circle cx={pos.x} cy={pos.y} r={nodeR + 1.2} fill="none" stroke={style.stroke} strokeWidth="0.15" strokeOpacity="0.3" filter="url(#mandala-glow)">
                  <animate attributeName="r" values={`${nodeR + 0.8};${nodeR + 1.5};${nodeR + 0.8}`} dur="3s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Node */}
              <circle cx={pos.x} cy={pos.y} r={nodeR} fill={style.fill} stroke={style.stroke} strokeWidth={isIntegrado ? '0.6' : '0.4'} />

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
                {d.nome.length > 12 ? d.nome.slice(0, 11) + '…' : d.nome}
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
                  {/* Glow dots for members */}
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
          <span className="text-[10px] text-[#F5F1E8]/40">
            {mode === 'coletivo' ? 'Sem clientes' : 'Não explorado'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: STATE_STYLES.ativo.fill, borderColor: STATE_STYLES.ativo.stroke }} />
          <span className="text-[10px] text-[#C9A24A]/70">
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
      <p className="text-[9px] text-[#F5F1E8]/25 text-center italic">
        {mode === 'clinico'
          ? 'Ferramenta de leitura simbólica. Não substitui julgamento clínico.'
          : 'Estados indicam o movimento da jornada.'}
      </p>
    </div>
  );
}
