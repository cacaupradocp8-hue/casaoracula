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
  districtStates?: Record<string, DistrictDisplayState>;
  activeDistrict?: string | null;
  onDistrictClick?: (districtName: string) => void;
  maxWidth?: number;
  archetypeDistricts?: Record<string, boolean>;
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

  // Check if there's a dominant district to apply focus dimming
  const hasDominant = !!activeDistrict;

  return (
    <div className="relative mx-auto w-full overflow-hidden" style={{ maxWidth }}>
      <svg viewBox="0 0 600 520" className="w-full max-w-full block" style={{ filter: 'drop-shadow(0 0 40px rgba(201,162,74,0.08))' }}>
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
          {/* Tension vibration filter */}
          <filter id="cidadela-vibrate">
            <feTurbulence type="turbulence" baseFrequency="0.08" numOctaves="2" result="turb">
              <animate attributeName="baseFrequency" values="0.08;0.12;0.08" dur="2s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="turb" scale="1.5" />
          </filter>
          {/* Active golden glow */}
          <filter id="cidadela-activeGlow">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feFlood floodColor="#C9A24A" floodOpacity="0.3" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width="600" height="520" fill="url(#cidadela-bg-glow)" rx="16" />

        {/* Ambient breathing rings */}
        <circle cx={CX} cy={CY} r={100} fill="none" stroke="rgba(201,162,74,0.04)" strokeWidth="0.5">
          <animate attributeName="r" values="100;110;100" dur="12s" repeatCount="indefinite" />
        </circle>
        <circle cx={CX} cy={CY} r={180} fill="none" stroke="rgba(201,162,74,0.03)" strokeWidth="0.5">
          <animate attributeName="r" values="180;190;180" dur="15s" repeatCount="indefinite" />
        </circle>
        <circle cx={CX} cy={CY} r={240} fill="none" stroke="rgba(201,162,74,0.02)" strokeWidth="0.5">
          <animate attributeName="r" values="240;248;240" dur="18s" repeatCount="indefinite" />
        </circle>

        {/* Connections with energy flow */}
        {CONNECTIONS.map(([a, b], i) => {
          const pa = POSITIONS[a], pb = POSITIONS[b];
          if (!pa || !pb) return null;
          const da = districts[a - 1], db = districts[b - 1];
          const sa = da ? getState(da.nome) : 'nao_explorado';
          const sb = db ? getState(db.nome) : 'nao_explorado';
          const bothActive = sa !== 'nao_explorado' && sb !== 'nao_explorado';
          const oneActive = sa !== 'nao_explorado' || sb !== 'nao_explorado';
          return (
            <g key={`conn-${i}`}>
              <line x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                stroke={bothActive ? 'rgba(201,162,74,0.25)' : oneActive ? 'rgba(201,162,74,0.08)' : 'rgba(245,241,232,0.05)'}
                strokeWidth={bothActive ? 1.5 : 0.8}
                strokeDasharray={bothActive ? '' : '4 4'} />
              {/* Energy pulse along active connections */}
              {bothActive && (
                <circle r="2" fill="#C9A24A" opacity="0.6">
                  <animateMotion dur={`${4 + i % 3}s`} repeatCount="indefinite"
                    path={`M${pa.x},${pa.y} L${pb.x},${pb.y}`} />
                  <animate attributeName="opacity" values="0.2;0.7;0.2" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          );
        })}

        {/* Districts — living organisms */}
        {districts.map((d, idx) => {
          const pos = POSITIONS[d.ordem || (idx + 1)];
          if (!pos) return null;
          const state = getState(d.nome);
          const isActive = state === 'ativo' || Boolean(activeDistrict && d.nome.toLowerCase() === activeDistrict?.toLowerCase());
          const isTensao = state === 'em_tensao';
          const isIntegrado = state === 'integrado';
          const isExplored = state !== 'nao_explorado';
          const distColor = d.cor_principal || '#C9A24A';
          const Icon = DISTRICT_ICONS[d.icone || ''] || MapPin;
          const nameKey = d.nome.toLowerCase();
          const hasArch = archetypeDistricts[nameKey];
          const evtCount = eventCounts[nameKey] || 0;

          // Focus dimming: non-dominant districts get dimmed when a dominant exists
          const isDimmed = hasDominant && !isActive && !isTensao;

          const fillColor = isActive ? `${distColor}22`
            : isTensao ? 'rgba(180,75,75,0.12)'
            : isIntegrado ? 'rgba(85,107,87,0.15)'
            : 'rgba(245,241,232,0.02)';

          const strokeColor = isActive ? distColor
            : isTensao ? 'rgba(180,75,75,0.6)'
            : isIntegrado ? 'rgba(85,107,87,0.7)'
            : 'rgba(245,241,232,0.1)';

          const textOpacity = isActive ? 1 : isExplored ? 0.7 : 0.3;
          const groupOpacity = isDimmed ? 0.4 : 1;

          // Staggered animation delay per district
          const pulseDelay = `${(idx * 0.7) % 6}s`;

          return (
            <g key={d.id}
              className={onDistrictClick ? 'cursor-pointer' : ''}
              onClick={() => onDistrictClick?.(d.nome)}
              style={{
                filter: isActive ? 'url(#cidadela-activeGlow)' : isTensao ? 'url(#cidadela-vibrate)' : '',
                opacity: groupOpacity,
                transition: 'opacity 0.6s ease',
              }}>

              {/* ── ATIVO: rotating dashed ring + pulsing glow ── */}
              {isActive && (
                <>
                  <circle cx={pos.x} cy={pos.y} r={pos.r + 10}
                    fill="none" stroke={distColor} strokeWidth="0.5" opacity="0.15">
                    <animate attributeName="r" values={`${pos.r + 10};${pos.r + 16};${pos.r + 10}`} dur="6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.1;0.25;0.1" dur="6s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={pos.x} cy={pos.y} r={pos.r + 6}
                    fill="none" stroke={distColor}
                    strokeWidth="1.2" opacity="0.5" strokeDasharray="3 3">
                    <animateTransform attributeName="transform" type="rotate"
                      from={`0 ${pos.x} ${pos.y}`} to={`360 ${pos.x} ${pos.y}`}
                      dur="16s" repeatCount="indefinite" />
                  </circle>
                  {/* Inner pulse */}
                  <circle cx={pos.x} cy={pos.y} r={pos.r - 2}
                    fill={`${distColor}`} opacity="0">
                    <animate attributeName="opacity" values="0;0.08;0" dur="4s" repeatCount="indefinite" begin={pulseDelay} />
                  </circle>
                </>
              )}

              {/* ── TENSÃO: warm pulsing aura + micro-vibration ── */}
              {isTensao && (
                <>
                  <circle cx={pos.x} cy={pos.y} r={pos.r + 8}
                    fill="none" stroke="rgba(200,80,60,0.2)" strokeWidth="1.5">
                    <animate attributeName="r" values={`${pos.r + 6};${pos.r + 12};${pos.r + 6}`} dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.15;0.4;0.15" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={pos.x} cy={pos.y} r={pos.r + 4}
                    fill="none" stroke="rgba(180,75,75,0.35)" strokeWidth="1">
                    <animate attributeName="opacity" values="0.2;0.5;0.2" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                </>
              )}

              {/* ── INTEGRADO: stable green aura ── */}
              {isIntegrado && (
                <>
                  <circle cx={pos.x} cy={pos.y} r={pos.r + 5}
                    fill="none" stroke="rgba(85,107,87,0.25)" strokeWidth="1.5">
                    <animate attributeName="opacity" values="0.2;0.35;0.2" dur="8s" repeatCount="indefinite" begin={pulseDelay} />
                  </circle>
                  <circle cx={pos.x} cy={pos.y} r={pos.r + 2}
                    fill="rgba(85,107,87,0.05)" stroke="none">
                    <animate attributeName="opacity" values="0.05;0.1;0.05" dur="6s" repeatCount="indefinite" />
                  </circle>
                </>
              )}

              {/* ── NÃO EXPLORADO: subtle breathing ── */}
              {!isExplored && (
                <circle cx={pos.x} cy={pos.y} r={pos.r}
                  fill="none" stroke="rgba(245,241,232,0.06)" strokeWidth="0.5">
                  <animate attributeName="opacity" values="0.03;0.08;0.03" dur="7s" repeatCount="indefinite" begin={pulseDelay} />
                </circle>
              )}

              {/* Main circle with breathing */}
              <circle cx={pos.x} cy={pos.y} r={pos.r}
                fill={fillColor} stroke={strokeColor}
                strokeWidth={isActive ? 2 : isTensao ? 1.5 : 1}>
                {isExplored && (
                  <animate attributeName="r" values={`${pos.r};${pos.r + 1.5};${pos.r}`}
                    dur={isActive ? '4s' : isTensao ? '2s' : '6s'} repeatCount="indefinite" begin={pulseDelay} />
                )}
              </circle>

              {/* Archetype marker (gold dot) */}
              {hasArch && (
                <circle cx={pos.x + pos.r - 6} cy={pos.y - pos.r + 6} r="5"
                  fill="#D4B96E" stroke="#0a0a14" strokeWidth="1.5">
                  <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
                </circle>
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

        {/* Center breathing heart */}
        <circle cx={CX} cy={CY} r={48} fill="none" stroke="rgba(212,185,110,0.15)" strokeWidth="1">
          <animate attributeName="r" values="48;56;48" dur="6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.1;0.3;0.1" dur="6s" repeatCount="indefinite" />
        </circle>
        <circle cx={CX} cy={CY} r={52} fill="none" stroke="rgba(212,185,110,0.06)" strokeWidth="0.5">
          <animate attributeName="r" values="52;60;52" dur="9s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.05;0.15;0.05" dur="9s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-3 text-[9px] text-muted-foreground/60">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: 'rgba(201,162,74,0.5)' }} /> ativo</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: 'rgba(180,75,75,0.5)' }} /> tensão</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: 'rgba(85,107,87,0.5)' }} /> integrado</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: 'rgba(245,241,232,0.1)' }} /> não explorado</span>
      </div>
    </div>
  );
}
