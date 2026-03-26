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
}

const STATE_COLORS: Record<DistrictDisplayState, { fill: string; stroke: string; opacity: number }> = {
  nao_explorado: { fill: 'rgba(245,241,232,0.02)', stroke: 'rgba(245,241,232,0.1)', opacity: 0.3 },
  ativo: { fill: 'rgba(201,162,74,0.13)', stroke: 'rgba(201,162,74,0.7)', opacity: 0.85 },
  em_tensao: { fill: 'rgba(180,75,75,0.12)', stroke: 'rgba(180,75,75,0.6)', opacity: 0.8 },
  integrado: { fill: 'rgba(85,107,87,0.15)', stroke: 'rgba(85,107,87,0.7)', opacity: 0.9 },
};

export default function CidadelaMapSVG({ districtStates = {}, activeDistrict, onDistrictClick, maxWidth = 620 }: Props) {
  const { data: districts = [] } = useCityDistricts();

  const stateMap = useMemo(() => {
    const map: Record<string, DistrictDisplayState> = {};
    // Normalize: match by lowercase name
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
            <stop offset="0%" stopColor="hsl(var(--background))" />
            <stop offset="100%" stopColor="hsl(var(--background))" stopOpacity="0.8" />
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
          const active = sa !== 'nao_explorado' && sb !== 'nao_explorado';
          return (
            <line key={i} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
              stroke={active ? 'rgba(201,162,74,0.25)' : 'rgba(245,241,232,0.06)'}
              strokeWidth={active ? 1.5 : 0.8}
              strokeDasharray={active ? '' : '4 4'} />
          );
        })}

        {/* Districts */}
        {districts.map((d, idx) => {
          const pos = POSITIONS[d.ordem || (idx + 1)];
          if (!pos) return null;
          const state = getState(d.nome);
          const colors = STATE_COLORS[state];
          const isActive = state === 'ativo' || (activeDistrict && d.nome.toLowerCase() === activeDistrict.toLowerCase());
          const Icon = DISTRICT_ICONS[d.icone || ''] || MapPin;

          return (
            <g key={d.id}
              className={onDistrictClick ? 'cursor-pointer' : ''}
              onClick={() => onDistrictClick?.(d.nome)}
              style={{ filter: isActive ? 'url(#cidadela-softGlow)' : '' }}>
              
              {/* Active ring */}
              {isActive && (
                <circle cx={pos.x} cy={pos.y} r={pos.r + 6}
                  fill="none" stroke={d.cor_principal || '#C9A24A'}
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
                fill={colors.fill} stroke={colors.stroke} strokeWidth={isActive ? 2 : 1} />

              {/* District name */}
              <text x={pos.x} y={pos.y + pos.r + 16} textAnchor="middle"
                fill={`rgba(245,241,232,${colors.opacity})`}
                fontSize="10" fontFamily="Inter, sans-serif"
                fontWeight={isActive ? '600' : '400'}>
                {d.nome}
              </text>

              {/* Icon */}
              <foreignObject x={pos.x - 10} y={pos.y - 10} width="20" height="20">
                <div className="flex items-center justify-center w-full h-full">
                  <Icon className="w-4 h-4" style={{ color: colors.stroke }} />
                </div>
              </foreignObject>
            </g>
          );
        })}

        {/* Center breathing */}
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
