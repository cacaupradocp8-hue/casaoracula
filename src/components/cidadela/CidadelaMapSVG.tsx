import { useMemo } from 'react';
import { useCityDistricts } from '@/hooks/useMapaVivoCidadela';
import {
  MapPin, Compass, Shield, Flower2, Moon, Gem, Flame, Search, Sparkles
} from 'lucide-react';

// ── Icon map ──
const DISTRICT_ICONS: Record<string, React.ElementType> = {
  gate: MapPin, maze: Compass, tower: Shield, garden: Flower2,
  moon: Moon, mirror: Gem, fire: Flame, compass: Search, circle: Sparkles,
};

// ── Layout positions for 9 districts + center ──
const CX = 300, CY = 300;
const POSITIONS: Record<number, { x: number; y: number; r: number }> = {
  9: { x: CX, y: CY, r: 42 },
  1: { x: CX, y: CY - 200, r: 34 },
  2: { x: CX - 170, y: CY - 100, r: 34 },
  3: { x: CX + 170, y: CY - 100, r: 34 },
  4: { x: CX - 200, y: CY + 40, r: 34 },
  5: { x: CX + 200, y: CY + 40, r: 34 },
  6: { x: CX - 140, y: CY + 160, r: 34 },
  7: { x: CX + 140, y: CY + 160, r: 34 },
  8: { x: CX, y: CY + 210, r: 34 },
};

const CONNECTIONS = [
  [1, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7],
  [6, 8], [7, 8], [2, 9], [3, 9], [4, 9], [5, 9],
  [6, 9], [7, 9], [8, 9], [1, 9],
];

export type DistrictDisplayState = 'nao_explorado' | 'ativo' | 'em_tensao' | 'integrado';

interface Props {
  /** Map of district name (lowercase) → state */
  districtStates?: Record<string, DistrictDisplayState>;
  /** Active district name */
  activeDistrict?: string | null;
  /** Optional click handler */
  onDistrictClick?: (districtName: string) => void;
  /** Max width in px */
  maxWidth?: number;
  /** Show archetype marker on specific districts (district name lowercase → true) */
  archetypeDistricts?: Record<string, boolean>;
  /** Event counts per district (district name lowercase → count) */
  eventCounts?: Record<string, number>;
}

export default function CidadelaMapSVG({
  districtStates = {},
  activeDistrict,
  onDistrictClick,
  maxWidth = 620,
  archetypeDistricts = {},
  eventCounts = {},
}: Props) {
  const { data: districts = [] } = useCityDistricts();

  const stateMap = useMemo(() => {
    const map: Record<string, DistrictDisplayState> = {};
    Object.entries(districtStates).forEach(([name, state]) => {
      map[name.toLowerCase()] = state;
    });
    return map;
  }, [districtStates]);

  const getState = (name: string): DistrictDisplayState => {
    const key = name.toLowerCase();
    if (activeDistrict && key === activeDistrict.toLowerCase()) return 'ativo';
    return stateMap[key] || 'nao_explorado';
  };

  return (
    <div className="relative mx-auto" style={{ maxWidth }}>
      <svg viewBox="0 0 600 520" className="w-full" style={{ filter: 'drop-shadow(0 0 40px rgba(201,162,74,0.08))' }}>
        <defs>
          <radialGradient id="cidadela-bg-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0a0a14" />
          </radialGradient>
          <filter id="cidadela-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="cidadela-softGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width="600" height="520" fill="url(#cidadela-bg-glow)" rx="16" />

        {/* Connections */}
        {CONNECTIONS.map(([a, b], i) => {
          const pa = POSITIONS[a], pb = POSITIONS[b];
          if (!pa || !pb) return null;
          const da = districts[a - 1], db = districts[b - 1];
          const sa = da ? getState(da.nome) : 'nao_explorado';
          const sb = db ? getState(db.nome) : 'nao_explorado';
          const bothActive = sa !== 'nao_explorado' && sb !== 'nao_explorado';
          return (
            <line key={i} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
              stroke={bothActive ? 'rgba(201,162,74,0.25)' : 'rgba(245,241,232,0.06)'}
              strokeWidth={bothActive ? 1.5 : 0.8}
              strokeDasharray={bothActive ? '' : '4 4'} />
          );
        })}

        {/* Districts */}
        {districts.map((d, idx) => {
          const pos = POSITIONS[d.ordem || (idx + 1)];
          if (!pos) return null;
          const state = getState(d.nome);
          const isActive = state === 'ativo' || (activeDistrict && d.nome.toLowerCase() === activeDistrict?.toLowerCase());
          const distColor = d.cor_principal || '#C9A24A';
          const Icon = DISTRICT_ICONS[d.icone || ''] || MapPin;
          const nameKey = d.nome.toLowerCase();
          const hasArch = archetypeDistricts[nameKey];
          const evtCount = eventCounts[nameKey] || 0;

          // Use district's own color for richer visuals (same as Casa das Máquinas)
          const fillColor = isActive ? `${distColor}22`
            : state === 'em_tensao' ? 'rgba(180,75,75,0.12)'
            : state === 'integrado' ? 'rgba(85,107,87,0.15)'
            : state === 'ativo' ? `${distColor}13`
            : 'rgba(245,241,232,0.02)';

          const strokeColor = isActive ? distColor
            : state === 'em_tensao' ? 'rgba(180,75,75,0.6)'
            : state === 'integrado' ? 'rgba(85,107,87,0.7)'
            : state === 'ativo' ? `${distColor}B3`
            : 'rgba(245,241,232,0.1)';

          const textOpacity = isActive ? 1 : state !== 'nao_explorado' ? 0.7 : 0.3;

          return (
            <g key={d.id}
              className={onDistrictClick ? 'cursor-pointer' : ''}
              onClick={() => onDistrictClick?.(d.nome)}
              style={{ filter: isActive ? 'url(#cidadela-softGlow)' : '' }}>

              {/* Active ring */}
              {isActive && (
                <circle cx={pos.x} cy={pos.y} r={pos.r + 6}
                  fill="none" stroke={distColor}
                  strokeWidth="1" opacity="0.4" strokeDasharray="3 3">
                  <animateTransform attributeName="transform" type="rotate"
                    from={`0 ${pos.x} ${pos.y}`} to={`360 ${pos.x} ${pos.y}`}
                    dur="20s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Tension pulse */}
              {state === 'em_tensao' && (
                <circle cx={pos.x} cy={pos.y} r={pos.r + 4}
                  fill="none" stroke="rgba(180,75,75,0.3)" strokeWidth="1">
                  <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Integrated glow */}
              {state === 'integrado' && (
                <circle cx={pos.x} cy={pos.y} r={pos.r + 4}
                  fill="none" stroke="rgba(85,107,87,0.3)" strokeWidth="1.5" />
              )}

              {/* Main circle */}
              <circle cx={pos.x} cy={pos.y} r={pos.r}
                fill={fillColor} stroke={strokeColor}
                strokeWidth={isActive ? 2 : 1} />

              {/* Archetype marker (gold dot) */}
              {hasArch && (
                <circle cx={pos.x + pos.r - 6} cy={pos.y - pos.r + 6} r="5"
                  fill="#D4B96E" stroke="#0a0a14" strokeWidth="1.5" />
              )}

              {/* Event count badge */}
              {evtCount > 0 && (
                <>
                  <circle cx={pos.x - pos.r + 8} cy={pos.y - pos.r + 8} r="8"
                    fill="rgba(201,162,74,0.2)" stroke="rgba(201,162,74,0.4)" strokeWidth="0.5" />
                  <text x={pos.x - pos.r + 8} y={pos.y - pos.r + 11}
                    textAnchor="middle" fill="#C9A24A" fontSize="8" fontWeight="600">
                    {evtCount}
                  </text>
                </>
              )}

              {/* District name */}
              <text x={pos.x} y={pos.y + pos.r + 16} textAnchor="middle"
                fill={`rgba(245,241,232,${textOpacity})`}
                fontSize="10" fontFamily="Inter, sans-serif"
                fontWeight={isActive ? '600' : '400'}>
                {d.nome}
              </text>

              {/* Icon */}
              <foreignObject x={pos.x - 10} y={pos.y - 10} width="20" height="20">
                <div className="flex items-center justify-center w-full h-full">
                  <Icon className="w-4 h-4" style={{ color: strokeColor }} />
                </div>
              </foreignObject>
            </g>
          );
        })}

        {/* Center breathing animation */}
        <circle cx={CX} cy={CY} r={48} fill="none" stroke="rgba(212,185,110,0.15)" strokeWidth="1">
          <animate attributeName="r" values="48;54;48" dur="9s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0.3;0.15" dur="9s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-3 text-[9px] text-muted-foreground/60">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: 'rgba(201,162,74,0.5)' }} /> ativo</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: 'rgba(180,75,75,0.5)' }} /> tensão</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: 'rgba(85,107,87,0.5)' }} /> integrado</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: 'rgba(245,241,232,0.1)' }} /> não explorado</span>
      </div>
    </div>
  );
}
