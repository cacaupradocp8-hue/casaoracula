import { useMemo, useState, useRef, useCallback } from 'react';

// ============================================
// CIDADELA INTERIOR — MAPA MEDIEVAL SIMBÓLICO v2
// Cartografia alquímica da cidade interior
// Cada distrito é um território arquitetônico
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

// Organic city layout positions (viewBox 0 0 600 600)
const DISTRICT_POSITIONS: Record<number, { x: number; y: number }> = {
  11: { x: 300, y: 300 },  // Praça da Integração — center
  1:  { x: 300, y: 150 },  // Entrada — north gate
  2:  { x: 170, y: 195 },  // Torres — northwest
  3:  { x: 430, y: 195 },  // Portas — northeast
  4:  { x: 145, y: 340 },  // Jardim dos Arquétipos — west
  6:  { x: 455, y: 340 },  // Casa dos Sonhos — east
  5:  { x: 300, y: 490 },  // Praça do Abalo — south
  7:  { x: 82,  y: 230 },  // Espelho dos Vínculos — far west
  8:  { x: 518, y: 230 },  // Forja — far east
  9:  { x: 110, y: 450 },  // Conselho Interior — southwest
  10: { x: 490, y: 450 },  // Labirinto — southeast
  12: { x: 300, y: 52  },  // Portal de Renascimento — far north
};

const ROADS: { from: number; to: number }[] = [
  { from: 12, to: 1 }, { from: 1, to: 11 }, { from: 1, to: 2 }, { from: 1, to: 3 },
  { from: 2, to: 4 }, { from: 2, to: 7 }, { from: 3, to: 6 }, { from: 3, to: 8 },
  { from: 4, to: 9 }, { from: 4, to: 11 }, { from: 6, to: 10 }, { from: 6, to: 11 },
  { from: 9, to: 5 }, { from: 10, to: 5 }, { from: 5, to: 11 },
  { from: 7, to: 9 }, { from: 8, to: 10 },
];

const STATE_STYLES = {
  inativo: {
    fill: 'rgba(245,241,232,0.025)',
    stroke: 'rgba(245,241,232,0.10)',
    iconColor: 'rgba(245,241,232,0.15)',
    textColor: 'rgba(245,241,232,0.28)',
    glowColor: 'transparent',
    buildingFill: 'rgba(245,241,232,0.02)',
    buildingStroke: 'rgba(245,241,232,0.08)',
  },
  ativo: {
    fill: 'rgba(201,162,74,0.08)',
    stroke: 'rgba(201,162,74,0.45)',
    iconColor: '#C9A24A',
    textColor: '#C9A24A',
    glowColor: 'rgba(201,162,74,0.10)',
    buildingFill: 'rgba(201,162,74,0.06)',
    buildingStroke: 'rgba(201,162,74,0.35)',
  },
  integrado: {
    fill: 'rgba(74,158,107,0.08)',
    stroke: '#6bc48f',
    iconColor: '#6bc48f',
    textColor: '#7dd9a0',
    glowColor: 'rgba(74,158,107,0.12)',
    buildingFill: 'rgba(74,158,107,0.06)',
    buildingStroke: 'rgba(74,158,107,0.35)',
  },
};

// ============================================
// TERRITORY ILLUSTRATIONS — Each district as a building/structure
// Rendered relative to (0,0) center, scaled via transform
// ============================================
const TERRITORY_ART: Record<number, (c: string, f: string, s: string) => JSX.Element> = {
  // 1 — Entrada / Ponto de Chegada — Grand gate with towers
  1: (c, f, s) => <g>
    {/* Ground platform */}
    <ellipse cx="0" cy="20" rx="38" ry="8" fill={f} stroke={s} strokeWidth="0.6"/>
    {/* Left pillar */}
    <rect x="-22" y="-18" width="10" height="38" rx="1" fill={f} stroke={s} strokeWidth="0.8"/>
    <rect x="-22" y="-22" width="10" height="6" rx="0.5" fill={f} stroke={s} strokeWidth="0.6"/>
    {/* Right pillar */}
    <rect x="12" y="-18" width="10" height="38" rx="1" fill={f} stroke={s} strokeWidth="0.8"/>
    <rect x="12" y="-22" width="10" height="6" rx="0.5" fill={f} stroke={s} strokeWidth="0.6"/>
    {/* Arch */}
    <path d="M-12 20 L-12 -5 A12 14 0 0 1 12 -5 L12 20" fill="none" stroke={c} strokeWidth="1.2"/>
    {/* Star above */}
    <circle cx="0" cy="-16" r="3" fill="none" stroke={c} strokeWidth="0.7" opacity="0.6"/>
    <circle cx="0" cy="-16" r="1" fill={c} opacity="0.5"/>
    {/* Steps */}
    <rect x="-14" y="16" width="28" height="3" rx="0.5" fill={f} stroke={s} strokeWidth="0.4"/>
    <rect x="-10" y="19" width="20" height="2" rx="0.5" fill={f} stroke={s} strokeWidth="0.3"/>
  </g>,

  // 2 — Torres — Fortified tower with battlements
  2: (c, f, s) => <g>
    <ellipse cx="0" cy="22" rx="32" ry="7" fill={f} stroke={s} strokeWidth="0.5"/>
    {/* Main tower */}
    <rect x="-10" y="-20" width="20" height="40" rx="1" fill={f} stroke={s} strokeWidth="0.9"/>
    {/* Battlements */}
    <rect x="-12" y="-24" width="5" height="6" fill={f} stroke={c} strokeWidth="0.7"/>
    <rect x="-3" y="-24" width="5" height="6" fill={f} stroke={c} strokeWidth="0.7"/>
    <rect x="7" y="-24" width="5" height="6" fill={f} stroke={c} strokeWidth="0.7"/>
    {/* Window */}
    <path d="M-4 -8 L-4 -14 A4 4 0 0 1 4 -14 L4 -8" fill="none" stroke={c} strokeWidth="0.8"/>
    <circle cx="0" cy="-14" r="0.8" fill={c} opacity="0.4"/>
    {/* Door */}
    <path d="M-5 22 L-5 8 A5 5 0 0 1 5 8 L5 22" fill="none" stroke={c} strokeWidth="0.7"/>
    {/* Side wall */}
    <line x1="-10" y1="10" x2="-28" y2="18" stroke={s} strokeWidth="0.5"/>
    <line x1="10" y1="10" x2="28" y2="18" stroke={s} strokeWidth="0.5"/>
  </g>,

  // 3 — Portas — Grand portal gate with key
  3: (c, f, s) => <g>
    <ellipse cx="0" cy="20" rx="35" ry="7" fill={f} stroke={s} strokeWidth="0.5"/>
    {/* Portal frame */}
    <path d="M-18 22 L-18 -8 A18 20 0 0 1 18 -8 L18 22" fill={f} stroke={s} strokeWidth="1"/>
    {/* Inner arch */}
    <path d="M-12 22 L-12 -2 A12 14 0 0 1 12 -2 L12 22" fill="none" stroke={c} strokeWidth="1.2"/>
    {/* Keystone */}
    <path d="M-3 -14 L0 -18 L3 -14" fill="none" stroke={c} strokeWidth="0.8"/>
    {/* Key symbol */}
    <circle cx="0" cy="5" r="3" fill="none" stroke={c} strokeWidth="0.7"/>
    <line x1="0" y1="8" x2="0" y2="16" stroke={c} strokeWidth="0.6"/>
    <line x1="-2" y1="13" x2="2" y2="13" stroke={c} strokeWidth="0.5"/>
    <line x1="-1.5" y1="15" x2="1.5" y2="15" stroke={c} strokeWidth="0.4"/>
    {/* Hinges */}
    <circle cx="-12" cy="5" r="1.2" fill={f} stroke={c} strokeWidth="0.5"/>
    <circle cx="-12" cy="14" r="1.2" fill={f} stroke={c} strokeWidth="0.5"/>
  </g>,

  // 4 — Jardim dos Arquétipos — Circular garden with tree
  4: (c, f, s) => <g>
    {/* Garden bed — circular hedge */}
    <circle cx="0" cy="2" r="30" fill={f} stroke={s} strokeWidth="0.8"/>
    <circle cx="0" cy="2" r="24" fill="none" stroke={s} strokeWidth="0.4" strokeDasharray="3 2"/>
    {/* Path through garden */}
    <path d="M0 32 L0 16 M-22 2 L-10 2 M10 2 L22 2" stroke={s} strokeWidth="0.6" strokeDasharray="2 2"/>
    {/* Central tree trunk */}
    <line x1="0" y1="2" x2="0" y2="14" stroke={c} strokeWidth="1.5"/>
    {/* Roots */}
    <path d="M0 14 Q-5 18 -8 20" fill="none" stroke={c} strokeWidth="0.6" opacity="0.4"/>
    <path d="M0 14 Q5 18 8 20" fill="none" stroke={c} strokeWidth="0.6" opacity="0.4"/>
    {/* Canopy */}
    <circle cx="0" cy="-5" r="10" fill="none" stroke={c} strokeWidth="1"/>
    <circle cx="-5" cy="-8" r="6" fill="none" stroke={c} strokeWidth="0.6" opacity="0.5"/>
    <circle cx="5" cy="-8" r="6" fill="none" stroke={c} strokeWidth="0.6" opacity="0.5"/>
    <circle cx="0" cy="-12" r="5" fill="none" stroke={c} strokeWidth="0.5" opacity="0.4"/>
    {/* Flower dots */}
    <circle cx="-15" cy="8" r="1.2" fill={c} opacity="0.2"/>
    <circle cx="12" cy="-5" r="1" fill={c} opacity="0.2"/>
    <circle cx="-10" cy="-2" r="0.8" fill={c} opacity="0.15"/>
    <circle cx="16" cy="10" r="1.1" fill={c} opacity="0.18"/>
  </g>,

  // 5 — Praça do Abalo — Cracked square with fissure
  5: (c, f, s) => <g>
    {/* Square base — irregular */}
    <path d="M-30 -15 L30 -18 L32 18 L-28 20 Z" fill={f} stroke={s} strokeWidth="0.8"/>
    {/* Inner paving */}
    <path d="M-20 -10 L20 -12 L22 12 L-18 14 Z" fill="none" stroke={s} strokeWidth="0.4" strokeDasharray="2 2"/>
    {/* Fissure / crack */}
    <path d="M-5 -18 L-2 -8 L2 -3 L-1 5 L3 12 L0 20" fill="none" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M-2 -8 L-6 -4" fill="none" stroke={c} strokeWidth="0.5" opacity="0.5"/>
    <path d="M2 -3 L5 0" fill="none" stroke={c} strokeWidth="0.5" opacity="0.5"/>
    <path d="M-1 5 L-4 8" fill="none" stroke={c} strokeWidth="0.4" opacity="0.4"/>
    {/* Spiral energy from crack */}
    <path d="M0 0 m0,-3 a3,3 0 1,1 0,6 a5,5 0 1,1 0,-10" fill="none" stroke={c} strokeWidth="0.5" opacity="0.3"/>
    {/* Stones */}
    <rect x="-25" y="-4" width="5" height="3" rx="1" fill={f} stroke={s} strokeWidth="0.3"/>
    <rect x="20" y="5" width="4" height="3" rx="0.8" fill={f} stroke={s} strokeWidth="0.3"/>
  </g>,

  // 6 — Casa dos Sonhos — House with moon and clouds
  6: (c, f, s) => <g>
    <ellipse cx="0" cy="22" rx="34" ry="7" fill={f} stroke={s} strokeWidth="0.5"/>
    {/* House */}
    <rect x="-14" y="-2" width="28" height="22" rx="1" fill={f} stroke={s} strokeWidth="0.9"/>
    {/* Roof */}
    <path d="M-18 -2 L0 -20 L18 -2" fill={f} stroke={c} strokeWidth="1"/>
    {/* Window — round */}
    <circle cx="-5" cy="6" r="3.5" fill="none" stroke={c} strokeWidth="0.7"/>
    <line x1="-5" y1="2.5" x2="-5" y2="9.5" stroke={c} strokeWidth="0.4"/>
    <line x1="-8.5" y1="6" x2="-1.5" y2="6" stroke={c} strokeWidth="0.4"/>
    {/* Door */}
    <path d="M5 20 L5 10 A4 4 0 0 1 13 10 L13 20" fill="none" stroke={c} strokeWidth="0.7"/>
    {/* Chimney */}
    <rect x="8" y="-16" width="4" height="8" fill={f} stroke={s} strokeWidth="0.5"/>
    {/* Moon */}
    <path d="M20 -18 A6 6 0 1 0 20 -6 A4.5 4.5 0 1 1 20 -18" fill="none" stroke={c} strokeWidth="0.8" opacity="0.6"/>
    {/* Stars */}
    <circle cx="28" cy="-14" r="0.6" fill={c} opacity="0.35"/>
    <circle cx="-22" cy="-12" r="0.5" fill={c} opacity="0.25"/>
    <circle cx="24" cy="-22" r="0.4" fill={c} opacity="0.3"/>
  </g>,

  // 7 — Espelho dos Vínculos — Courtyard with mirror
  7: (c, f, s) => <g>
    {/* Courtyard */}
    <circle cx="0" cy="2" r="28" fill={f} stroke={s} strokeWidth="0.7"/>
    <circle cx="0" cy="2" r="22" fill="none" stroke={s} strokeWidth="0.3" strokeDasharray="2 3"/>
    {/* Mirror frame */}
    <ellipse cx="0" cy="-2" rx="8" ry="12" fill="none" stroke={c} strokeWidth="1.2"/>
    <ellipse cx="0" cy="-2" rx="5.5" ry="9" fill="none" stroke={c} strokeWidth="0.5" opacity="0.4"/>
    {/* Mirror stand */}
    <line x1="0" y1="10" x2="0" y2="18" stroke={c} strokeWidth="1.2"/>
    <path d="M-7 18 Q0 15 7 18" fill="none" stroke={c} strokeWidth="0.8"/>
    {/* Reflection glints */}
    <circle cx="-2" cy="-5" r="1" fill={c} opacity="0.15"/>
    <path d="M3 -8 L4 -9 L5 -8" fill="none" stroke={c} strokeWidth="0.4" opacity="0.3"/>
    {/* Bench/seat */}
    <rect x="-18" y="8" width="8" height="3" rx="1" fill={f} stroke={s} strokeWidth="0.4"/>
    <rect x="10" y="8" width="8" height="3" rx="1" fill={f} stroke={s} strokeWidth="0.4"/>
  </g>,

  // 8 — Forja — Furnace with anvil and flames
  8: (c, f, s) => <g>
    <ellipse cx="0" cy="22" rx="34" ry="7" fill={f} stroke={s} strokeWidth="0.5"/>
    {/* Furnace */}
    <path d="M-15 22 L-15 -5 A15 10 0 0 1 15 -5 L15 22" fill={f} stroke={s} strokeWidth="0.9"/>
    {/* Opening */}
    <path d="M-8 22 L-8 6 A8 8 0 0 1 8 6 L8 22" fill="none" stroke={c} strokeWidth="1"/>
    {/* Flames */}
    <path d="M-3 6 Q-4 -2 0 -8 Q4 -2 3 6" fill="none" stroke={c} strokeWidth="0.8" opacity="0.7"/>
    <path d="M0 -8 Q-1 -12 0 -15 Q1 -12 0 -8" fill="none" stroke={c} strokeWidth="0.5" opacity="0.5"/>
    <path d="M-5 4 Q-6 0 -3 -3" fill="none" stroke={c} strokeWidth="0.4" opacity="0.4"/>
    <path d="M5 4 Q6 0 3 -3" fill="none" stroke={c} strokeWidth="0.4" opacity="0.4"/>
    {/* Anvil */}
    <path d="M20 18 L24 12 L30 12 L34 18" fill="none" stroke={c} strokeWidth="0.8"/>
    <line x1="27" y1="12" x2="27" y2="20" stroke={c} strokeWidth="0.6"/>
    {/* Sparks */}
    <circle cx="-2" cy="-12" r="0.5" fill={c} opacity="0.3"/>
    <circle cx="3" cy="-14" r="0.4" fill={c} opacity="0.25"/>
    <circle cx="-4" cy="-10" r="0.35" fill={c} opacity="0.2"/>
  </g>,

  // 9 — Conselho Interior — Circular hall with seats
  9: (c, f, s) => <g>
    {/* Hall floor */}
    <circle cx="0" cy="0" r="28" fill={f} stroke={s} strokeWidth="0.8"/>
    {/* Central table */}
    <circle cx="0" cy="0" r="10" fill="none" stroke={c} strokeWidth="0.9"/>
    <circle cx="0" cy="0" r="7" fill="none" stroke={c} strokeWidth="0.4" opacity="0.3" strokeDasharray="2 1.5"/>
    <circle cx="0" cy="0" r="1.5" fill={c} opacity="0.3"/>
    {/* Seats around the table */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
      const rad = (a * Math.PI) / 180;
      const x = 18 * Math.cos(rad);
      const y = 18 * Math.sin(rad);
      return <g key={i}>
        <rect x={x - 3} y={y - 2} width="6" height="4" rx="2" fill={f} stroke={c} strokeWidth="0.5" opacity="0.6"
          transform={`rotate(${a}, ${x}, ${y})`}/>
      </g>;
    })}
    {/* Columns */}
    {[0, 90, 180, 270].map((a, i) => {
      const rad = (a * Math.PI) / 180;
      const x = 25 * Math.cos(rad);
      const y = 25 * Math.sin(rad);
      return <circle key={i} cx={x} cy={y} r="2" fill={f} stroke={c} strokeWidth="0.5" opacity="0.4"/>;
    })}
  </g>,

  // 10 — Labirinto — Stone spiral labyrinth
  10: (c, f, s) => <g>
    {/* Ground */}
    <circle cx="0" cy="0" r="30" fill={f} stroke={s} strokeWidth="0.7"/>
    {/* Labyrinth walls — concentric irregular paths */}
    <circle cx="0" cy="0" r="26" fill="none" stroke={c} strokeWidth="0.7"/>
    <path d="M0 -26 L0 -20" stroke={f} strokeWidth="2"/>
    <circle cx="0" cy="0" r="20" fill="none" stroke={c} strokeWidth="0.6"/>
    <path d="M20 0 L14 0" stroke={f} strokeWidth="2"/>
    <circle cx="0" cy="0" r="14" fill="none" stroke={c} strokeWidth="0.6"/>
    <path d="M0 14 L0 8" stroke={f} strokeWidth="2"/>
    <circle cx="0" cy="0" r="8" fill="none" stroke={c} strokeWidth="0.5"/>
    <path d="M-8 0 L-4 0" stroke={f} strokeWidth="2"/>
    {/* Center goal */}
    <circle cx="0" cy="0" r="3" fill="none" stroke={c} strokeWidth="0.8"/>
    <circle cx="0" cy="0" r="1" fill={c} opacity="0.6"/>
    {/* Entry marker */}
    <path d="M0 -30 L0 -28" stroke={c} strokeWidth="0.8"/>
    <polygon points="0,-32 -1.5,-29 1.5,-29" fill={c} opacity="0.4"/>
  </g>,

  // 11 — Praça da Integração — Central square with radiating pattern
  11: (c, f, s) => <g>
    {/* Main plaza circle */}
    <circle cx="0" cy="0" r="42" fill={f} stroke={s} strokeWidth="1"/>
    <circle cx="0" cy="0" r="35" fill="none" stroke={s} strokeWidth="0.5" strokeDasharray="4 3"/>
    {/* Radiating stone pattern */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a, i) => {
      const rad = (a * Math.PI) / 180;
      return <line key={i} x1={12 * Math.cos(rad)} y1={12 * Math.sin(rad)}
        x2={35 * Math.cos(rad)} y2={35 * Math.sin(rad)}
        stroke={s} strokeWidth="0.3" opacity="0.5"/>;
    })}
    {/* Inner rings */}
    <circle cx="0" cy="0" r="20" fill="none" stroke={c} strokeWidth="0.6" opacity="0.4"/>
    <circle cx="0" cy="0" r="12" fill="none" stroke={c} strokeWidth="0.7"/>
    {/* Center mandala */}
    <circle cx="0" cy="0" r="5" fill="none" stroke={c} strokeWidth="0.9"/>
    <line x1="0" y1="-5" x2="0" y2="5" stroke={c} strokeWidth="0.5" opacity="0.5"/>
    <line x1="-5" y1="0" x2="5" y2="0" stroke={c} strokeWidth="0.5" opacity="0.5"/>
    <circle cx="0" cy="0" r="1.5" fill={c} opacity="0.6"/>
    {/* Cardinal gems */}
    {[0, 90, 180, 270].map((a, i) => {
      const rad = (a * Math.PI) / 180;
      return <circle key={i} cx={27 * Math.cos(rad)} cy={27 * Math.sin(rad)}
        r="2" fill={f} stroke={c} strokeWidth="0.5" opacity="0.5"/>;
    })}
  </g>,

  // 12 — Portal de Renascimento — Luminous arch with phoenix
  12: (c, f, s) => <g>
    <ellipse cx="0" cy="22" rx="32" ry="6" fill={f} stroke={s} strokeWidth="0.5"/>
    {/* Arch structure */}
    <path d="M-20 22 L-20 -8 A20 24 0 0 1 20 -8 L20 22" fill={f} stroke={s} strokeWidth="0.9"/>
    {/* Inner arch — luminous */}
    <path d="M-14 22 L-14 -2 A14 18 0 0 1 14 -2 L14 22" fill="none" stroke={c} strokeWidth="1.3"/>
    {/* Phoenix/flame rising */}
    <path d="M0 16 Q0 8 -4 2 Q0 6 0 -6 Q0 6 4 2 Q0 8 0 16" fill="none" stroke={c} strokeWidth="0.9"/>
    <path d="M0 -6 Q-1 -10 0 -14 Q1 -10 0 -6" fill="none" stroke={c} strokeWidth="0.6" opacity="0.6"/>
    {/* Wings */}
    <path d="M-4 2 Q-10 -4 -14 -2" fill="none" stroke={c} strokeWidth="0.5" opacity="0.4"/>
    <path d="M4 2 Q10 -4 14 -2" fill="none" stroke={c} strokeWidth="0.5" opacity="0.4"/>
    {/* Light rays */}
    <line x1="0" y1="-16" x2="0" y2="-22" stroke={c} strokeWidth="0.5" opacity="0.3"/>
    <line x1="-6" y1="-18" x2="-9" y2="-24" stroke={c} strokeWidth="0.3" opacity="0.2"/>
    <line x1="6" y1="-18" x2="9" y2="-24" stroke={c} strokeWidth="0.3" opacity="0.2"/>
    {/* Threshold stones */}
    <rect x="-18" y="18" width="8" height="3" rx="0.5" fill={f} stroke={s} strokeWidth="0.3"/>
    <rect x="10" y="18" width="8" height="3" rx="0.5" fill={f} stroke={s} strokeWidth="0.3"/>
  </g>,
};

// Atmosphere particles
function AtmosphereParticles() {
  const particles = useMemo(
    () => Array.from({ length: 28 }, (_, i) => ({
      id: i,
      cx: 20 + Math.random() * 560,
      cy: 20 + Math.random() * 560,
      r: 0.6 + Math.random() * 1.4,
      dur: 16 + Math.random() * 22,
      delay: Math.random() * 14,
      driftX: (Math.random() - 0.5) * 35,
      driftY: (Math.random() - 0.5) * 35,
      isGold: Math.random() > 0.45,
    })),
    []
  );
  return <>
    {particles.map(p => (
      <circle key={p.id} cx={p.cx} cy={p.cy} r={p.r}
        fill={p.isGold ? '#C9A24A' : '#F5F1E8'} opacity="0">
        <animate attributeName="opacity" values="0;0.07;0.03;0.07;0" dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
        <animate attributeName="cx" values={`${p.cx};${p.cx + p.driftX};${p.cx}`} dur={`${p.dur * 1.2}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
        <animate attributeName="cy" values={`${p.cy};${p.cy + p.driftY};${p.cy}`} dur={`${p.dur * 1.3}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
      </circle>
    ))}
  </>;
}

function roadPath(from: { x: number; y: number }, to: { x: number; y: number }): string {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const offsetScale = len * 0.10;
  const nx = -dy / len * offsetScale;
  const ny = dx / len * offsetScale;
  return `M ${from.x} ${from.y} Q ${mx + nx} ${my + ny} ${to.x} ${to.y}`;
}

export function MandalaCidadela({
  districts, districtStates = [], collectiveData = [], mode, selectedId,
  pathPoints = [], onDistrictClick, className, showConnections = false,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState({ x: -20, y: -20, w: 640, h: 640 });
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
    const nw = Math.min(800, Math.max(250, viewBox.w * scale));
    const nh = Math.min(800, Math.max(250, viewBox.h * scale));
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
  const resetZoom = useCallback(() => setViewBox({ x: -20, y: -20, w: 640, h: 640 }), []);

  const getState = (id: string): 'inativo' | 'ativo' | 'integrado' =>
    (districtStates.find(s => s.district_id === id)?.state as any) || 'inativo';
  const getSessionCount = (id: string) =>
    districtStates.find(s => s.district_id === id)?.sessions_count || 0;
  const getCollective = (id: string) =>
    collectiveData.find(c => c.district_id === id);

  const isZoomed = viewBox.w !== 640;
  const centerLabel = mode === 'clinico' ? 'Praça da Integração' : 'Praça do Ser';

  const roads = useMemo(() => {
    return ROADS.map((road) => {
      const fromPos = DISTRICT_POSITIONS[road.from];
      const toPos = DISTRICT_POSITIONS[road.to];
      if (!fromPos || !toPos) return null;
      const fromD = districts.find(d => d.numero === road.from);
      const toD = districts.find(d => d.numero === road.to);
      const fromState = fromD ? getState(fromD.id) : 'inativo';
      const toState = toD ? getState(toD.id) : 'inativo';
      const lit = fromState !== 'inativo' || toState !== 'inativo';
      return { path: roadPath(fromPos, toPos), lit, key: `${road.from}-${road.to}` };
    }).filter(Boolean) as { path: string; lit: boolean; key: string }[];
  }, [districts, districtStates]);

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
    const artScale = isCenter ? 1.3 : 1;

    return (
      <g key={d.id} data-district={d.id}
        className={onDistrictClick ? 'cursor-pointer' : ''}
        onClick={(e) => { e.stopPropagation(); onDistrictClick?.(d); }}
        onPointerEnter={() => setHoveredDistrict(d.id)}
        onPointerLeave={() => setHoveredDistrict(null)}
      >
        <title>{d.nome}{d.descricao ? ` — ${d.descricao}` : ''}</title>

        {/* Hover highlight */}
        {isHovered && (
          <circle cx={pos.x} cy={pos.y} r={isCenter ? 58 : 42} fill="rgba(201,162,74,0.04)" stroke="rgba(201,162,74,0.12)" strokeWidth="0.5"
            style={{ transition: 'all 0.3s ease' }} />
        )}

        {/* Selection ring */}
        {isSelected && (
          <circle cx={pos.x} cy={pos.y} r={isCenter ? 58 : 44} fill="none"
            stroke="#C9A24A" strokeWidth="0.8" strokeDasharray="4 2.5">
            <animate attributeName="stroke-opacity" values="0.3;0.9;0.3" dur="1.5s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Active glow */}
        {state === 'ativo' && (
          <circle cx={pos.x} cy={pos.y} r={isCenter ? 55 : 40} fill="rgba(201,162,74,0.06)" filter="url(#territory-glow)">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="5s" repeatCount="indefinite" />
          </circle>
        )}
        {state === 'integrado' && (
          <circle cx={pos.x} cy={pos.y} r={isCenter ? 55 : 40} fill="rgba(74,158,107,0.06)" filter="url(#territory-glow)">
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="6s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Center breathing aura */}
        {isCenter && (
          <circle cx={pos.x} cy={pos.y} r="62" fill="url(#center-aura)" opacity="0.4">
            <animate attributeName="r" values="55;65;55" dur="9s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.25;0.5;0.25" dur="9s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Territory illustration */}
        <g transform={`translate(${pos.x}, ${pos.y}) scale(${isHovered ? artScale * 1.04 : artScale})`}
          style={{ transition: 'transform 0.35s ease', transformOrigin: '0 0' }}>
          {TERRITORY_ART[d.numero]?.(style.iconColor, style.buildingFill, style.buildingStroke)}
        </g>

        {/* Active pulse ring */}
        {state === 'ativo' && !isCenter && (
          <circle cx={pos.x} cy={pos.y} r="38" fill="none"
            stroke={style.stroke} strokeWidth="0.4">
            <animate attributeName="r" values="36;44;36" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="4s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Integrated badge */}
        {state === 'integrado' && !isCenter && (
          <g transform={`translate(${pos.x + 28}, ${pos.y - 28})`}>
            <circle r="9" fill="#3a8a5c" stroke="#6bc48f" strokeWidth="1" />
            <polyline points="-3.5,0.5 -0.5,3.5 4.5,-3" fill="none" stroke="#F5F1E8" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* Name label */}
        <text x={pos.x} y={pos.y + (isCenter ? 52 : 34)}
          textAnchor="middle" dominantBaseline="central"
          fill={isHovered ? '#C9A24A' : style.textColor}
          fontSize={isCenter ? 14 : 11} fontWeight="600"
          opacity={isHovered ? 1 : 0.85}
          style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.03em', transition: 'fill 0.3s, opacity 0.3s' }}>
          {isCenter ? centerLabel : d.nome}
        </text>

        {/* Session count or collective */}
        {mode === 'clinico' && sessCount > 0 && !isCenter && (
          <text x={pos.x} y={pos.y + 44} textAnchor="middle" fill="#C9A24A" fontSize="8" opacity="0.4"
            style={{ fontFamily: "'Inter', sans-serif" }}>
            {sessCount} {sessCount === 1 ? 'sessão' : 'sessões'}
          </text>
        )}
        {mode === 'coletivo' && collective && collective.client_count > 0 && (
          <text x={pos.x} y={pos.y + 44} textAnchor="middle" fill="#C9A24A" fontSize="7.5" opacity="0.4">
            {collective.client_count} {collective.client_count === 1 ? 'cliente' : 'clientes'}
          </text>
        )}
      </g>
    );
  };

  const centerDistrict = districts.find(d => d.numero === 11);
  const otherDistricts = districts.filter(d => d.numero !== 11);

  return (
    <div className={`relative ${className || ''}`} style={{ aspectRatio: '1/1', maxWidth: '620px', margin: '0 auto' }}>
      {isZoomed && (
        <button onClick={resetZoom}
          className="absolute top-2 right-2 z-10 px-2.5 py-1 rounded-lg text-[10px] bg-[#C9A24A]/10 border border-[#C9A24A]/20 text-[#C9A24A]/70 hover:text-[#C9A24A] transition-colors backdrop-blur-sm">
          Resetar zoom
        </button>
      )}

      <svg ref={svgRef}
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
          <filter id="territory-glow"><feGaussianBlur stdDeviation="10" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="road-glow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>

          <radialGradient id="center-aura">
            <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.12" />
            <stop offset="50%" stopColor="#C9A24A" stopOpacity="0.03" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          <radialGradient id="bg-vignette" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#6b4ba1" stopOpacity="0.025" />
            <stop offset="50%" stopColor="#0a0a0a" stopOpacity="0.005" />
            <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0.05" />
          </radialGradient>

          <pattern id="parchment-tex" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r="0.3" fill="rgba(245,241,232,0.02)" />
            <circle cx="28" cy="15" r="0.2" fill="rgba(201,162,74,0.012)" />
            <circle cx="12" cy="30" r="0.25" fill="rgba(245,241,232,0.012)" />
            <circle cx="35" cy="35" r="0.15" fill="rgba(107,75,161,0.008)" />
          </pattern>
        </defs>

        {/* Background */}
        <rect x="-20" y="-20" width="640" height="640" fill="url(#bg-vignette)" />
        <rect x="-20" y="-20" width="640" height="640" fill="url(#parchment-tex)" />

        {/* Map border */}
        <rect x="5" y="5" width="590" height="590" rx="10" fill="none" stroke="rgba(201,162,74,0.05)" strokeWidth="1.2" />
        <rect x="12" y="12" width="576" height="576" rx="7" fill="none" stroke="rgba(201,162,74,0.03)" strokeWidth="0.6" strokeDasharray="8 5" />

        {/* Compass rose */}
        <g transform="translate(555, 555)" opacity="0.10">
          <line x1="0" y1="-22" x2="0" y2="22" stroke="#C9A24A" strokeWidth="0.8" />
          <line x1="-22" y1="0" x2="22" y2="0" stroke="#C9A24A" strokeWidth="0.8" />
          <line x1="-14" y1="-14" x2="14" y2="14" stroke="#C9A24A" strokeWidth="0.4" />
          <line x1="14" y1="-14" x2="-14" y2="14" stroke="#C9A24A" strokeWidth="0.4" />
          <circle cx="0" cy="0" r="5" fill="none" stroke="#C9A24A" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="1.5" fill="#C9A24A" />
          <text x="0" y="-26" textAnchor="middle" fill="#C9A24A" fontSize="7" fontWeight="bold"
            style={{ fontFamily: "'Playfair Display', serif" }}>N</text>
        </g>

        <AtmosphereParticles />

        {/* Roads */}
        {roads.map(road => (
          <g key={road.key}>
            <path d={road.path} fill="none"
              stroke={road.lit ? 'rgba(201,162,74,0.15)' : 'rgba(245,241,232,0.04)'}
              strokeWidth={road.lit ? 2.5 : 1.5}
              strokeDasharray={road.lit ? 'none' : '5 5'}
              strokeLinecap="round"
              style={{ transition: 'stroke 0.5s, stroke-width 0.5s' }}
            />
            {road.lit && (
              <path d={road.path} fill="none" stroke="rgba(201,162,74,0.06)" strokeWidth="7"
                strokeLinecap="round" filter="url(#road-glow)" />
            )}
          </g>
        ))}

        {/* Render center first, then others on top */}
        {centerDistrict && renderDistrict(centerDistrict)}
        {otherDistricts.map(d => renderDistrict(d))}

        {/* Title cartouche */}
        <g transform="translate(300, 580)" opacity="0.20">
          <line x1="-75" y1="-4" x2="75" y2="-4" stroke="#C9A24A" strokeWidth="0.3" />
          <text x="0" y="0" textAnchor="middle" fill="#C9A24A" fontSize="10"
            style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.2em' }}>
            CIDADELA INTERIOR
          </text>
          <line x1="-75" y1="5" x2="75" y2="5" stroke="#C9A24A" strokeWidth="0.3" />
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
    <div className="space-y-2 mt-3 max-w-[620px] mx-auto">
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
