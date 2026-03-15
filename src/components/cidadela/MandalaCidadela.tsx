import { useMemo, useState, useRef, useCallback } from 'react';

// ============================================
// CIDADELA INTERIOR — MAPA SAGRADO v3
// Cartografia medieval da cidade interior
// Design: Cidade murada concêntrica com distritos
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

// Layout: viewBox 0 0 800 800, center at 400,400
const CX = 400, CY = 400;

// Positions arranged as a walled city
const DISTRICT_POSITIONS: Record<number, { x: number; y: number; ring: 'center' | 'inner' | 'outer' }> = {
  11: { x: CX, y: CY, ring: 'center' },           // Praça da Integração
  1:  { x: CX, y: CY - 120, ring: 'inner' },       // Entrada (N)
  2:  { x: CX - 105, y: CY - 60, ring: 'inner' },  // Torres (NW)
  3:  { x: CX + 105, y: CY - 60, ring: 'inner' },  // Portas (NE)
  4:  { x: CX - 105, y: CY + 60, ring: 'inner' },  // Jardim (SW)
  6:  { x: CX + 105, y: CY + 60, ring: 'inner' },  // Casa dos Sonhos (SE)
  5:  { x: CX, y: CY + 120, ring: 'inner' },        // Praça do Abalo (S)
  7:  { x: CX - 210, y: CY - 100, ring: 'outer' },  // Espelho dos Vínculos
  8:  { x: CX + 210, y: CY - 100, ring: 'outer' },  // Forja
  9:  { x: CX - 210, y: CY + 100, ring: 'outer' },  // Conselho Interior
  10: { x: CX + 210, y: CY + 100, ring: 'outer' },  // Labirinto
  12: { x: CX, y: CY - 250, ring: 'outer' },         // Portal de Renascimento
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
    fill: 'rgba(245,241,232,0.02)',
    stroke: 'rgba(245,241,232,0.06)',
    icon: 'rgba(245,241,232,0.12)',
    text: 'rgba(245,241,232,0.22)',
    glow: 'transparent',
    building: 'rgba(245,241,232,0.015)',
    wall: 'rgba(245,241,232,0.05)',
  },
  ativo: {
    fill: 'rgba(201,162,74,0.06)',
    stroke: 'rgba(201,162,74,0.35)',
    icon: '#C9A24A',
    text: '#C9A24A',
    glow: 'rgba(201,162,74,0.08)',
    building: 'rgba(201,162,74,0.04)',
    wall: 'rgba(201,162,74,0.25)',
  },
  integrado: {
    fill: 'rgba(74,158,107,0.06)',
    stroke: '#6bc48f',
    icon: '#6bc48f',
    text: '#7dd9a0',
    glow: 'rgba(74,158,107,0.10)',
    building: 'rgba(74,158,107,0.04)',
    wall: 'rgba(74,158,107,0.25)',
  },
};

// ============================================
// TERRITORY ART — Detailed architectural SVG for each district
// Each rendered at origin, translated via transform
// ============================================

const TERRITORY_ART: Record<number, (s: typeof STATE_STYLES.inativo) => JSX.Element> = {
  // 1 — Entrada / Portão Norte — Grande portão com arco e estrela
  1: (st) => <g>
    <ellipse cx="0" cy="26" rx="44" ry="10" fill={st.building} stroke={st.wall} strokeWidth="0.5" />
    <rect x="-30" y="-12" width="12" height="40" rx="1.5" fill={st.building} stroke={st.wall} strokeWidth="0.8" />
    <rect x="18" y="-12" width="12" height="40" rx="1.5" fill={st.building} stroke={st.wall} strokeWidth="0.8" />
    {/* Battlements on pillars */}
    {[-30,-26,-22, 18,22,26].map((x,i) => <rect key={i} x={x} y="-17" width="3" height="6" fill={st.building} stroke={st.icon} strokeWidth="0.4" opacity="0.6"/>)}
    {/* Arch */}
    <path d="M-18 28 L-18 -2 A18 20 0 0 1 18 -2 L18 28" fill="none" stroke={st.icon} strokeWidth="1.5" />
    <path d="M-14 28 L-14 2 A14 16 0 0 1 14 2 L14 28" fill="none" stroke={st.icon} strokeWidth="0.6" opacity="0.4" />
    {/* Keystone star */}
    <polygon points="0,-18 1.5,-14 5,-14 2.5,-11 3.5,-7 0,-10 -3.5,-7 -2.5,-11 -5,-14 -1.5,-14" fill={st.icon} opacity="0.5" />
    {/* Portcullis lines */}
    {[-8,-3,2,7].map((x,i) => <line key={i} x1={x} y1="28" x2={x} y2="8" stroke={st.icon} strokeWidth="0.4" opacity="0.2" strokeDasharray="2 3"/>)}
    {/* Steps */}
    <rect x="-20" y="24" width="40" height="3" rx="0.5" fill={st.building} stroke={st.wall} strokeWidth="0.3"/>
  </g>,

  // 2 — Torres — Muralha fortificada com torres gêmeas
  2: (st) => <g>
    <ellipse cx="0" cy="28" rx="42" ry="9" fill={st.building} stroke={st.wall} strokeWidth="0.4" />
    {/* Wall */}
    <rect x="-32" y="2" width="64" height="26" rx="1" fill={st.building} stroke={st.wall} strokeWidth="0.6" />
    {/* Left tower */}
    <rect x="-28" y="-28" width="16" height="56" rx="1.5" fill={st.building} stroke={st.wall} strokeWidth="0.9" />
    {[-28,-24,-20,-16].map((x,i) => <rect key={i} x={x} y="-33" width="3" height="6" fill={st.building} stroke={st.icon} strokeWidth="0.5" opacity="0.7"/>)}
    <path d="M-24 -10 A4 5 0 0 1 -16 -10" fill="none" stroke={st.icon} strokeWidth="0.7" />
    {/* Right tower */}
    <rect x="12" y="-28" width="16" height="56" rx="1.5" fill={st.building} stroke={st.wall} strokeWidth="0.9" />
    {[12,16,20,24].map((x,i) => <rect key={i} x={x} y="-33" width="3" height="6" fill={st.building} stroke={st.icon} strokeWidth="0.5" opacity="0.7"/>)}
    <path d="M16 -10 A4 5 0 0 1 24 -10" fill="none" stroke={st.icon} strokeWidth="0.7" />
    {/* Bridge between */}
    <rect x="-12" y="-14" width="24" height="6" rx="1" fill={st.building} stroke={st.wall} strokeWidth="0.5" />
    {/* Flag on left */}
    <line x1="-20" y1="-33" x2="-20" y2="-42" stroke={st.icon} strokeWidth="0.6" />
    <path d="M-20 -42 L-12 -39 L-20 -36" fill={st.icon} opacity="0.4" />
  </g>,

  // 3 — Portas — Portal misterioso com chave e cortinas
  3: (st) => <g>
    <ellipse cx="0" cy="26" rx="40" ry="9" fill={st.building} stroke={st.wall} strokeWidth="0.4" />
    {/* Main wall */}
    <rect x="-30" y="-10" width="60" height="38" rx="2" fill={st.building} stroke={st.wall} strokeWidth="0.8" />
    {/* Grand arch */}
    <path d="M-20 28 L-20 -4 A20 24 0 0 1 20 -4 L20 28" fill="none" stroke={st.icon} strokeWidth="1.5" />
    <path d="M-16 28 L-16 0 A16 20 0 0 1 16 0 L16 28" fill="none" stroke={st.icon} strokeWidth="0.7" opacity="0.4" />
    {/* Keystone decoration */}
    <path d="M-5 -20 L0 -26 L5 -20" fill="none" stroke={st.icon} strokeWidth="0.8" />
    <circle cx="0" cy="-18" r="2" fill="none" stroke={st.icon} strokeWidth="0.6" opacity="0.5" />
    {/* Key symbol */}
    <circle cx="0" cy="8" r="4" fill="none" stroke={st.icon} strokeWidth="0.9" />
    <line x1="0" y1="12" x2="0" y2="22" stroke={st.icon} strokeWidth="0.8" />
    <line x1="-2.5" y1="17" x2="2.5" y2="17" stroke={st.icon} strokeWidth="0.5" />
    <line x1="-2" y1="20" x2="2" y2="20" stroke={st.icon} strokeWidth="0.4" />
    {/* Side lanterns */}
    <circle cx="-25" cy="-2" r="2.5" fill="none" stroke={st.icon} strokeWidth="0.5" opacity="0.4" />
    <circle cx="25" cy="-2" r="2.5" fill="none" stroke={st.icon} strokeWidth="0.5" opacity="0.4" />
  </g>,

  // 4 — Jardim dos Arquétipos — Jardim circular com árvore sagrada
  4: (st) => <g>
    {/* Garden boundary - hedge */}
    <circle cx="0" cy="0" r="40" fill={st.building} stroke={st.wall} strokeWidth="0.8" />
    <circle cx="0" cy="0" r="34" fill="none" stroke={st.wall} strokeWidth="0.4" strokeDasharray="4 3" />
    {/* Cross paths */}
    <line x1="0" y1="-40" x2="0" y2="40" stroke={st.wall} strokeWidth="0.5" strokeDasharray="3 3" />
    <line x1="-40" y1="0" x2="40" y2="0" stroke={st.wall} strokeWidth="0.5" strokeDasharray="3 3" />
    {/* Sacred tree trunk */}
    <rect x="-2.5" y="-4" width="5" height="20" rx="1" fill={st.building} stroke={st.icon} strokeWidth="1" />
    {/* Root system */}
    <path d="M-2 16 Q-10 22 -16 28" fill="none" stroke={st.icon} strokeWidth="0.6" opacity="0.3" />
    <path d="M2 16 Q10 22 16 28" fill="none" stroke={st.icon} strokeWidth="0.6" opacity="0.3" />
    <path d="M0 16 Q0 24 0 30" fill="none" stroke={st.icon} strokeWidth="0.5" opacity="0.25" />
    {/* Canopy layers */}
    <ellipse cx="0" cy="-12" rx="16" ry="12" fill="none" stroke={st.icon} strokeWidth="1" />
    <ellipse cx="-7" cy="-16" rx="9" ry="8" fill="none" stroke={st.icon} strokeWidth="0.5" opacity="0.4" />
    <ellipse cx="7" cy="-16" rx="9" ry="8" fill="none" stroke={st.icon} strokeWidth="0.5" opacity="0.4" />
    <ellipse cx="0" cy="-20" rx="7" ry="6" fill="none" stroke={st.icon} strokeWidth="0.4" opacity="0.3" />
    {/* Flower/fruit dots around */}
    {[[-20,12],[-18,-8],[14,-14],[20,8],[-12,22],[16,20],[-24,0],[22,-4]].map(([x,y],i) =>
      <circle key={i} cx={x} cy={y} r={0.8+Math.random()*0.6} fill={st.icon} opacity={0.1+Math.random()*0.1} />
    )}
  </g>,

  // 5 — Praça do Abalo — Praça quebrada com fissura sísmica
  5: (st) => <g>
    {/* Broken square */}
    <path d="M-38 -20 L38 -22 L40 22 L-36 24 Z" fill={st.building} stroke={st.wall} strokeWidth="0.8" />
    <path d="M-28 -14 L28 -16 L30 14 L-26 16 Z" fill="none" stroke={st.wall} strokeWidth="0.4" strokeDasharray="3 3" />
    {/* Central fissure */}
    <path d="M-6 -22 L-3 -12 L3 -5 L-2 4 L4 14 L0 24" fill="none" stroke={st.icon} strokeWidth="1.5" strokeLinecap="round" />
    {/* Branch cracks */}
    <path d="M-3 -12 L-9 -8" fill="none" stroke={st.icon} strokeWidth="0.5" opacity="0.5" />
    <path d="M3 -5 L8 -2" fill="none" stroke={st.icon} strokeWidth="0.5" opacity="0.5" />
    <path d="M-2 4 L-7 8" fill="none" stroke={st.icon} strokeWidth="0.4" opacity="0.4" />
    <path d="M4 14 L9 16" fill="none" stroke={st.icon} strokeWidth="0.3" opacity="0.3" />
    {/* Emanating energy spiral */}
    <path d="M0 0 m0,-5 a5,5 0 1,1 0,10 a8,8 0 1,1 0,-16" fill="none" stroke={st.icon} strokeWidth="0.5" opacity="0.2" />
    {/* Scattered stones */}
    {[[-28,-6,5,3],[-24,10,4,3],[22,-8,5,3],[26,10,4,2]].map(([x,y,w,h],i) =>
      <rect key={i} x={x} y={y} width={w} height={h} rx="1" fill={st.building} stroke={st.wall} strokeWidth="0.3" />
    )}
  </g>,

  // 6 — Casa dos Sonhos — Cabana noturna com lua e estrelas
  6: (st) => <g>
    <ellipse cx="0" cy="28" rx="42" ry="9" fill={st.building} stroke={st.wall} strokeWidth="0.4" />
    {/* House body */}
    <rect x="-18" y="0" width="36" height="28" rx="1.5" fill={st.building} stroke={st.wall} strokeWidth="0.9" />
    {/* Roof */}
    <path d="M-24 0 L0 -24 L24 0" fill={st.building} stroke={st.icon} strokeWidth="1.2" />
    <path d="M-20 0 L0 -20 L20 0" fill="none" stroke={st.icon} strokeWidth="0.4" opacity="0.3" />
    {/* Round window */}
    <circle cx="-6" cy="10" r="5" fill="none" stroke={st.icon} strokeWidth="0.8" />
    <line x1="-6" y1="5" x2="-6" y2="15" stroke={st.icon} strokeWidth="0.4" />
    <line x1="-11" y1="10" x2="-1" y2="10" stroke={st.icon} strokeWidth="0.4" />
    {/* Door */}
    <path d="M7 28 L7 14 A5 5 0 0 1 17 14 L17 28" fill="none" stroke={st.icon} strokeWidth="0.8" />
    <circle cx="15" cy="20" r="0.8" fill={st.icon} opacity="0.5" />
    {/* Chimney with smoke */}
    <rect x="10" y="-20" width="5" height="10" fill={st.building} stroke={st.wall} strokeWidth="0.5" />
    <path d="M12.5 -20 Q11 -26 13 -30 Q15 -34 12 -38" fill="none" stroke={st.icon} strokeWidth="0.4" opacity="0.2" />
    {/* Crescent moon */}
    <path d="M28 -22 A8 8 0 1 0 28 -6 A6 6 0 1 1 28 -22" fill="none" stroke={st.icon} strokeWidth="1" opacity="0.5" />
    {/* Stars */}
    {[[32,-16,0.7],[36,-26,0.5],[-26,-16,0.6],[24,-32,0.4],[-20,-20,0.5]].map(([x,y,r],i) =>
      <circle key={i} cx={x} cy={y} r={r} fill={st.icon} opacity={0.15+Math.random()*0.15} />
    )}
  </g>,

  // 7 — Espelho dos Vínculos — Pátio oval com espelho de água
  7: (st) => <g>
    {/* Courtyard */}
    <ellipse cx="0" cy="2" rx="38" ry="32" fill={st.building} stroke={st.wall} strokeWidth="0.7" />
    <ellipse cx="0" cy="2" rx="30" ry="24" fill="none" stroke={st.wall} strokeWidth="0.3" strokeDasharray="3 4" />
    {/* Mirror — standing oval */}
    <ellipse cx="0" cy="-4" rx="10" ry="16" fill="none" stroke={st.icon} strokeWidth="1.3" />
    <ellipse cx="0" cy="-4" rx="7" ry="12" fill="none" stroke={st.icon} strokeWidth="0.5" opacity="0.35" />
    {/* Mirror stand */}
    <line x1="0" y1="12" x2="0" y2="22" stroke={st.icon} strokeWidth="1.4" />
    <path d="M-10 22 Q0 18 10 22" fill="none" stroke={st.icon} strokeWidth="0.9" />
    {/* Reflection glints */}
    <path d="M-3 -8 L-1 -10 L1 -8" fill="none" stroke={st.icon} strokeWidth="0.4" opacity="0.3" />
    <circle cx="3" cy="-12" r="1" fill={st.icon} opacity="0.1" />
    <circle cx="-2" cy="0" r="0.8" fill={st.icon} opacity="0.08" />
    {/* Benches */}
    <rect x="-28" y="4" width="10" height="3" rx="1.5" fill={st.building} stroke={st.wall} strokeWidth="0.4" />
    <rect x="18" y="4" width="10" height="3" rx="1.5" fill={st.building} stroke={st.wall} strokeWidth="0.4" />
  </g>,

  // 8 — Forja — Fornalha com bigorna e chamas ascendentes
  8: (st) => <g>
    <ellipse cx="0" cy="28" rx="42" ry="9" fill={st.building} stroke={st.wall} strokeWidth="0.4" />
    {/* Furnace structure */}
    <path d="M-20 28 L-20 -8 A20 14 0 0 1 20 -8 L20 28" fill={st.building} stroke={st.wall} strokeWidth="1" />
    {/* Opening */}
    <path d="M-12 28 L-12 6 A12 12 0 0 1 12 6 L12 28" fill="none" stroke={st.icon} strokeWidth="1.2" />
    {/* Flames */}
    <path d="M-4 6 Q-6 -4 0 -14 Q6 -4 4 6" fill="none" stroke={st.icon} strokeWidth="1" opacity="0.7" />
    <path d="M0 -14 Q-2 -20 0 -24 Q2 -20 0 -14" fill="none" stroke={st.icon} strokeWidth="0.6" opacity="0.5" />
    <path d="M-7 4 Q-9 -2 -4 -6" fill="none" stroke={st.icon} strokeWidth="0.5" opacity="0.4" />
    <path d="M7 4 Q9 -2 4 -6" fill="none" stroke={st.icon} strokeWidth="0.5" opacity="0.4" />
    {/* Anvil to the side */}
    <path d="M26 24 L30 16 L38 16 L42 24" fill="none" stroke={st.icon} strokeWidth="1" />
    <rect x="29" y="14" width="10" height="3" rx="0.5" fill={st.building} stroke={st.icon} strokeWidth="0.5" />
    <line x1="34" y1="16" x2="34" y2="26" stroke={st.icon} strokeWidth="0.7" />
    {/* Hammer above anvil */}
    <line x1="34" y1="6" x2="34" y2="14" stroke={st.icon} strokeWidth="0.6" opacity="0.5" />
    <rect x="31" y="4" width="6" height="3" rx="0.5" fill="none" stroke={st.icon} strokeWidth="0.5" opacity="0.5" />
    {/* Sparks */}
    {[[-3,-18,0.6],[4,-20,0.5],[-6,-14,0.4],[2,-22,0.45],[6,-16,0.35]].map(([x,y,r],i) =>
      <circle key={i} cx={x} cy={y} r={r} fill={st.icon} opacity={0.15+Math.random()*0.1} />
    )}
  </g>,

  // 9 — Conselho Interior — Salão circular com mesa e cadeiras
  9: (st) => <g>
    {/* Hall */}
    <circle cx="0" cy="0" r="38" fill={st.building} stroke={st.wall} strokeWidth="0.8" />
    <circle cx="0" cy="0" r="32" fill="none" stroke={st.wall} strokeWidth="0.3" strokeDasharray="3 3" />
    {/* Central round table */}
    <circle cx="0" cy="0" r="14" fill="none" stroke={st.icon} strokeWidth="1" />
    <circle cx="0" cy="0" r="10" fill="none" stroke={st.icon} strokeWidth="0.4" opacity="0.3" strokeDasharray="2 2" />
    <circle cx="0" cy="0" r="2.5" fill={st.icon} opacity="0.2" />
    {/* Seats arranged around */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
      const rad = (a * Math.PI) / 180;
      const x = 22 * Math.cos(rad);
      const y = 22 * Math.sin(rad);
      return <g key={i}>
        <rect x={x - 3.5} y={y - 2.5} width="7" height="5" rx="2.5" fill={st.building} stroke={st.icon} strokeWidth="0.5" opacity="0.6"
          transform={`rotate(${a}, ${x}, ${y})`}/>
      </g>;
    })}
    {/* Columns */}
    {[0, 60, 120, 180, 240, 300].map((a, i) => {
      const rad = (a * Math.PI) / 180;
      return <circle key={i} cx={32 * Math.cos(rad)} cy={32 * Math.sin(rad)} r="2.5" fill={st.building} stroke={st.icon} strokeWidth="0.5" opacity="0.35"/>;
    })}
    {/* Candle at center */}
    <line x1="0" y1="-5" x2="0" y2="-2.5" stroke={st.icon} strokeWidth="0.6" opacity="0.5" />
    <path d="M0 -5 Q-1 -7 0 -8 Q1 -7 0 -5" fill={st.icon} opacity="0.3" />
  </g>,

  // 10 — Labirinto — Labirinto de pedra com caminhos
  10: (st) => <g>
    <circle cx="0" cy="0" r="38" fill={st.building} stroke={st.wall} strokeWidth="0.7" />
    {/* Labyrinth walls — 4 concentric rings with breaks */}
    <circle cx="0" cy="0" r="34" fill="none" stroke={st.icon} strokeWidth="0.8" />
    <path d="M0 -34 L0 -26" stroke={st.building} strokeWidth="3" />
    <circle cx="0" cy="0" r="26" fill="none" stroke={st.icon} strokeWidth="0.7" />
    <path d="M26 0 L18 0" stroke={st.building} strokeWidth="3" />
    <circle cx="0" cy="0" r="18" fill="none" stroke={st.icon} strokeWidth="0.6" />
    <path d="M0 18 L0 10" stroke={st.building} strokeWidth="3" />
    <circle cx="0" cy="0" r="10" fill="none" stroke={st.icon} strokeWidth="0.5" />
    <path d="M-10 0 L-5 0" stroke={st.building} strokeWidth="3" />
    {/* Center goal — gem */}
    <circle cx="0" cy="0" r="4" fill="none" stroke={st.icon} strokeWidth="0.9" />
    <circle cx="0" cy="0" r="1.5" fill={st.icon} opacity="0.5" />
    {/* Entry marker top */}
    <path d="M0 -40 L0 -36" stroke={st.icon} strokeWidth="0.8" />
    <polygon points="0,-42 -2,-38 2,-38" fill={st.icon} opacity="0.4" />
  </g>,

  // 11 — Praça da Integração — Mandala central com raios e anéis
  11: (st) => <g>
    {/* Main plaza */}
    <circle cx="0" cy="0" r="58" fill={st.building} stroke={st.wall} strokeWidth="1" />
    <circle cx="0" cy="0" r="50" fill="none" stroke={st.wall} strokeWidth="0.5" strokeDasharray="5 4" />
    {/* Radiating stone paths */}
    {Array.from({ length: 16 }, (_, i) => {
      const a = (i / 16) * Math.PI * 2;
      return <line key={i} x1={18 * Math.cos(a)} y1={18 * Math.sin(a)}
        x2={50 * Math.cos(a)} y2={50 * Math.sin(a)}
        stroke={st.wall} strokeWidth="0.3" opacity="0.4" />;
    })}
    {/* Concentric rings */}
    <circle cx="0" cy="0" r="38" fill="none" stroke={st.icon} strokeWidth="0.4" opacity="0.3" />
    <circle cx="0" cy="0" r="26" fill="none" stroke={st.icon} strokeWidth="0.5" opacity="0.4" />
    <circle cx="0" cy="0" r="18" fill="none" stroke={st.icon} strokeWidth="0.7" />
    {/* Center mandala pattern */}
    <circle cx="0" cy="0" r="8" fill="none" stroke={st.icon} strokeWidth="1" />
    {/* Cross */}
    <line x1="0" y1="-8" x2="0" y2="8" stroke={st.icon} strokeWidth="0.5" opacity="0.5" />
    <line x1="-8" y1="0" x2="8" y2="0" stroke={st.icon} strokeWidth="0.5" opacity="0.5" />
    {/* Diagonal cross */}
    <line x1="-5.6" y1="-5.6" x2="5.6" y2="5.6" stroke={st.icon} strokeWidth="0.3" opacity="0.3" />
    <line x1="5.6" y1="-5.6" x2="-5.6" y2="5.6" stroke={st.icon} strokeWidth="0.3" opacity="0.3" />
    {/* Center jewel */}
    <circle cx="0" cy="0" r="3" fill={st.icon} opacity="0.3" />
    <circle cx="0" cy="0" r="1.2" fill={st.icon} opacity="0.6" />
    {/* Cardinal ornaments */}
    {[0, 90, 180, 270].map((a, i) => {
      const rad = (a * Math.PI) / 180;
      return <g key={i}>
        <circle cx={42 * Math.cos(rad)} cy={42 * Math.sin(rad)} r="3" fill={st.building} stroke={st.icon} strokeWidth="0.5" opacity="0.4" />
        <circle cx={42 * Math.cos(rad)} cy={42 * Math.sin(rad)} r="1" fill={st.icon} opacity="0.2" />
      </g>;
    })}
  </g>,

  // 12 — Portal de Renascimento — Arco luminoso com fênix
  12: (st) => <g>
    <ellipse cx="0" cy="28" rx="38" ry="8" fill={st.building} stroke={st.wall} strokeWidth="0.4" />
    {/* Outer arch */}
    <path d="M-24 28 L-24 -10 A24 30 0 0 1 24 -10 L24 28" fill={st.building} stroke={st.wall} strokeWidth="1" />
    {/* Inner luminous arch */}
    <path d="M-18 28 L-18 -4 A18 24 0 0 1 18 -4 L18 28" fill="none" stroke={st.icon} strokeWidth="1.5" />
    <path d="M-14 28 L-14 0 A14 18 0 0 1 14 0 L14 28" fill="none" stroke={st.icon} strokeWidth="0.6" opacity="0.3" />
    {/* Phoenix/flame rising */}
    <path d="M0 20 Q-2 12 -6 4 Q0 10 0 -10 Q0 10 6 4 Q2 12 0 20" fill="none" stroke={st.icon} strokeWidth="1" />
    <path d="M0 -10 Q-2 -16 0 -22 Q2 -16 0 -10" fill="none" stroke={st.icon} strokeWidth="0.7" opacity="0.6" />
    {/* Wings spread */}
    <path d="M-6 4 Q-14 -6 -18 -4" fill="none" stroke={st.icon} strokeWidth="0.6" opacity="0.4" />
    <path d="M6 4 Q14 -6 18 -4" fill="none" stroke={st.icon} strokeWidth="0.6" opacity="0.4" />
    {/* Light rays above */}
    {[[-8,-26,0.3],[0,-28,0.5],[8,-26,0.3],[-4,-30,0.2],[4,-30,0.2]].map(([x,y,o],i) =>
      <line key={i} x1={x} y1={y as number} x2={x as number * 1.3} y2={(y as number) - 10} stroke={st.icon} strokeWidth="0.4" opacity={o} />
    )}
    {/* Threshold stones */}
    <rect x="-22" y="24" width="10" height="3" rx="0.5" fill={st.building} stroke={st.wall} strokeWidth="0.3" />
    <rect x="12" y="24" width="10" height="3" rx="0.5" fill={st.building} stroke={st.wall} strokeWidth="0.3" />
  </g>,
};

// ============================================
// ATMOSPHERE
// ============================================
function AtmosphereParticles() {
  const particles = useMemo(
    () => Array.from({ length: 40 }, (_, i) => ({
      id: i,
      cx: 40 + Math.random() * 720,
      cy: 40 + Math.random() * 720,
      r: 0.5 + Math.random() * 1.2,
      dur: 18 + Math.random() * 24,
      delay: Math.random() * 16,
      driftX: (Math.random() - 0.5) * 40,
      driftY: (Math.random() - 0.5) * 40,
      isGold: Math.random() > 0.4,
    })),
    []
  );
  return <>
    {particles.map(p => (
      <circle key={p.id} cx={p.cx} cy={p.cy} r={p.r}
        fill={p.isGold ? '#C9A24A' : '#F5F1E8'} opacity="0">
        <animate attributeName="opacity" values="0;0.06;0.02;0.06;0" dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
        <animate attributeName="cx" values={`${p.cx};${p.cx + p.driftX};${p.cx}`} dur={`${p.dur * 1.2}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
        <animate attributeName="cy" values={`${p.cy};${p.cy + p.driftY};${p.cy}`} dur={`${p.dur * 1.3}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
      </circle>
    ))}
  </>;
}

// ============================================
// CITY WALLS
// ============================================
function CityWalls() {
  return <g opacity="0.08">
    {/* Outer wall — octagonal shape */}
    <path d="M 400 80 L 590 180 L 660 370 L 590 560 L 400 660 L 210 560 L 140 370 L 210 180 Z"
      fill="none" stroke="#C9A24A" strokeWidth="2" strokeDasharray="12 6" />
    {/* Inner wall — softer circle */}
    <circle cx={CX} cy={CY} r="180" fill="none" stroke="#C9A24A" strokeWidth="1.5" strokeDasharray="8 5" />
    {/* Wall corner towers */}
    {[[400,80],[590,180],[660,370],[590,560],[400,660],[210,560],[140,370],[210,180]].map(([x,y],i) =>
      <g key={i}>
        <circle cx={x} cy={y} r="5" fill="rgba(201,162,74,0.03)" stroke="#C9A24A" strokeWidth="0.8" />
        <circle cx={x} cy={y} r="2" fill="#C9A24A" opacity="0.15" />
      </g>
    )}
  </g>;
}

// ============================================
// COMPASS ROSE
// ============================================
function CompassRose() {
  return <g transform="translate(720, 720)" opacity="0.12">
    {/* Main cross */}
    <line x1="0" y1="-30" x2="0" y2="30" stroke="#C9A24A" strokeWidth="1" />
    <line x1="-30" y1="0" x2="30" y2="0" stroke="#C9A24A" strokeWidth="1" />
    {/* Diagonal */}
    <line x1="-18" y1="-18" x2="18" y2="18" stroke="#C9A24A" strokeWidth="0.5" />
    <line x1="18" y1="-18" x2="-18" y2="18" stroke="#C9A24A" strokeWidth="0.5" />
    {/* North pointer */}
    <polygon points="0,-30 -4,-18 4,-18" fill="#C9A24A" opacity="0.4" />
    <polygon points="0,30 -3,20 3,20" fill="#C9A24A" opacity="0.2" />
    {/* Rings */}
    <circle cx="0" cy="0" r="8" fill="none" stroke="#C9A24A" strokeWidth="0.6" />
    <circle cx="0" cy="0" r="2" fill="#C9A24A" />
    {/* N label */}
    <text x="0" y="-36" textAnchor="middle" fill="#C9A24A" fontSize="10" fontWeight="bold"
      style={{ fontFamily: "'Playfair Display', serif" }}>N</text>
  </g>;
}

// ============================================
// ROAD PATH — Winding bezier roads
// ============================================
function roadPath(from: { x: number; y: number }, to: { x: number; y: number }): string {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return `M ${from.x} ${from.y}`;
  const offsetScale = len * 0.08;
  const nx = (-dy / len) * offsetScale;
  const ny = (dx / len) * offsetScale;
  return `M ${from.x} ${from.y} Q ${mx + nx} ${my + ny} ${to.x} ${to.y}`;
}

// ============================================
// MAIN COMPONENT
// ============================================
export function MandalaCidadela({
  districts, districtStates = [], collectiveData = [], mode, selectedId,
  pathPoints = [], onDistrictClick, className, showConnections = false,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 800, h: 800 });
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
    const scale = e.deltaY > 0 ? 1.1 : 0.91;
    const nw = Math.min(1000, Math.max(300, viewBox.w * scale));
    const nh = Math.min(1000, Math.max(300, viewBox.h * scale));
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
  const resetZoom = useCallback(() => setViewBox({ x: 0, y: 0, w: 800, h: 800 }), []);

  const getState = (id: string): 'inativo' | 'ativo' | 'integrado' =>
    (districtStates.find(s => s.district_id === id)?.state as any) || 'inativo';
  const getSessionCount = (id: string) =>
    districtStates.find(s => s.district_id === id)?.sessions_count || 0;
  const getCollective = (id: string) =>
    collectiveData.find(c => c.district_id === id);

  const isZoomed = viewBox.w !== 800;
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
      const bothIntegrated = fromState === 'integrado' && toState === 'integrado';
      const lit = fromState !== 'inativo' || toState !== 'inativo';
      return { path: roadPath(fromPos, toPos), lit, integrated: bothIntegrated, key: `${road.from}-${road.to}` };
    }).filter(Boolean) as { path: string; lit: boolean; integrated: boolean; key: string }[];
  }, [districts, districtStates]);

  const renderDistrict = (d: MandalaDistrict) => {
    const pos = DISTRICT_POSITIONS[d.numero];
    if (!pos) return null;
    const state = getState(d.id);
    const st = STATE_STYLES[state];
    const isCenter = d.numero === 11;
    const isSelected = selectedId === d.id;
    const isHovered = hoveredDistrict === d.id;
    const sessCount = getSessionCount(d.id);
    const collective = getCollective(d.id);
    const artScale = isCenter ? 1.2 : 0.9;

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
          <circle cx={pos.x} cy={pos.y} r={isCenter ? 75 : 52}
            fill="rgba(201,162,74,0.03)" stroke="rgba(201,162,74,0.10)" strokeWidth="0.5"
            style={{ transition: 'all 0.3s ease' }} />
        )}

        {/* Selection ring */}
        {isSelected && (
          <circle cx={pos.x} cy={pos.y} r={isCenter ? 76 : 54} fill="none"
            stroke="#C9A24A" strokeWidth="1" strokeDasharray="5 3">
            <animate attributeName="stroke-opacity" values="0.3;0.9;0.3" dur="1.5s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Active glow */}
        {state === 'ativo' && (
          <circle cx={pos.x} cy={pos.y} r={isCenter ? 70 : 48} fill="rgba(201,162,74,0.05)" filter="url(#territory-glow)">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="5s" repeatCount="indefinite" />
          </circle>
        )}
        {state === 'integrado' && (
          <circle cx={pos.x} cy={pos.y} r={isCenter ? 70 : 48} fill="rgba(74,158,107,0.05)" filter="url(#territory-glow)">
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="6s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Center breathing aura */}
        {isCenter && (
          <circle cx={pos.x} cy={pos.y} r="80" fill="url(#center-aura)" opacity="0.35">
            <animate attributeName="r" values="72;85;72" dur="9s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;0.45;0.2" dur="9s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Territory illustration */}
        <g transform={`translate(${pos.x}, ${pos.y}) scale(${isHovered ? artScale * 1.05 : artScale})`}
          style={{ transition: 'transform 0.35s ease', transformOrigin: '0 0' }}>
          {TERRITORY_ART[d.numero]?.(st)}
        </g>

        {/* Active pulse ring */}
        {state === 'ativo' && !isCenter && (
          <circle cx={pos.x} cy={pos.y} r="46" fill="none"
            stroke={st.stroke} strokeWidth="0.4">
            <animate attributeName="r" values="44;52;44" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="4s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Integrated badge */}
        {state === 'integrado' && !isCenter && (
          <g transform={`translate(${pos.x + 34}, ${pos.y - 34})`}>
            <circle r="10" fill="#3a8a5c" stroke="#6bc48f" strokeWidth="1.2" />
            <polyline points="-4,0.5 -1,4 5,-4" fill="none" stroke="#F5F1E8" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* Name label */}
        <text x={pos.x} y={pos.y + (isCenter ? 68 : 44)}
          textAnchor="middle" dominantBaseline="central"
          fill={isHovered ? '#C9A24A' : st.text}
          fontSize={isCenter ? 15 : 11.5} fontWeight="600"
          opacity={isHovered ? 1 : 0.85}
          style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.04em', transition: 'fill 0.3s, opacity 0.3s' }}>
          {isCenter ? centerLabel : d.nome}
        </text>

        {/* Session count */}
        {mode === 'clinico' && sessCount > 0 && !isCenter && (
          <text x={pos.x} y={pos.y + 56} textAnchor="middle" fill="#C9A24A" fontSize="8.5" opacity="0.35"
            style={{ fontFamily: "'Inter', sans-serif" }}>
            {sessCount} {sessCount === 1 ? 'sessão' : 'sessões'}
          </text>
        )}
        {mode === 'coletivo' && collective && collective.client_count > 0 && (
          <text x={pos.x} y={pos.y + 56} textAnchor="middle" fill="#C9A24A" fontSize="8" opacity="0.35">
            {collective.client_count} {collective.client_count === 1 ? 'cliente' : 'clientes'}
          </text>
        )}
      </g>
    );
  };

  const centerDistrict = districts.find(d => d.numero === 11);
  const otherDistricts = districts.filter(d => d.numero !== 11);

  return (
    <div className={`relative ${className || ''}`} style={{ aspectRatio: '1/1', maxWidth: '720px', margin: '0 auto' }}>
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
          <filter id="territory-glow">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="road-glow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="soft-shadow">
            <feGaussianBlur stdDeviation="3" in="SourceAlpha" result="shadow" />
            <feOffset dx="0" dy="2" />
            <feComposite in="SourceGraphic" />
          </filter>

          <radialGradient id="center-aura">
            <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.15" />
            <stop offset="40%" stopColor="#C9A24A" stopOpacity="0.04" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          <radialGradient id="bg-vignette" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#6b4ba1" stopOpacity="0.02" />
            <stop offset="40%" stopColor="#0a0a0a" stopOpacity="0" />
            <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0.06" />
          </radialGradient>

          <pattern id="parchment-tex" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.3" fill="rgba(245,241,232,0.015)" />
            <circle cx="35" cy="18" r="0.2" fill="rgba(201,162,74,0.01)" />
            <circle cx="15" cy="38" r="0.25" fill="rgba(245,241,232,0.01)" />
            <circle cx="42" cy="42" r="0.15" fill="rgba(107,75,161,0.006)" />
            <circle cx="25" cy="28" r="0.18" fill="rgba(245,241,232,0.008)" />
          </pattern>

          {/* Road texture */}
          <pattern id="road-dots" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="0.4" fill="rgba(201,162,74,0.04)" />
          </pattern>
        </defs>

        {/* Background layers */}
        <rect x="0" y="0" width="800" height="800" fill="url(#bg-vignette)" />
        <rect x="0" y="0" width="800" height="800" fill="url(#parchment-tex)" />

        {/* Decorative outer border */}
        <rect x="15" y="15" width="770" height="770" rx="12" fill="none" stroke="rgba(201,162,74,0.04)" strokeWidth="1.5" />
        <rect x="25" y="25" width="750" height="750" rx="8" fill="none" stroke="rgba(201,162,74,0.025)" strokeWidth="0.7" strokeDasharray="10 6" />

        {/* City walls */}
        <CityWalls />

        {/* Atmosphere */}
        <AtmosphereParticles />

        {/* Roads */}
        {roads.map(road => (
          <g key={road.key}>
            <path d={road.path} fill="none"
              stroke={road.integrated ? 'rgba(74,158,107,0.15)' : road.lit ? 'rgba(201,162,74,0.13)' : 'rgba(245,241,232,0.03)'}
              strokeWidth={road.lit ? 3 : 1.5}
              strokeDasharray={road.lit ? 'none' : '6 6'}
              strokeLinecap="round"
              style={{ transition: 'stroke 0.5s, stroke-width 0.5s' }}
            />
            {road.lit && (
              <path d={road.path} fill="none"
                stroke={road.integrated ? 'rgba(74,158,107,0.05)' : 'rgba(201,162,74,0.04)'}
                strokeWidth="10" strokeLinecap="round" filter="url(#road-glow)" />
            )}
          </g>
        ))}

        {/* Render center first, then others */}
        {centerDistrict && renderDistrict(centerDistrict)}
        {otherDistricts.map(d => renderDistrict(d))}

        {/* Compass */}
        <CompassRose />

        {/* Title cartouche */}
        <g transform="translate(400, 770)" opacity="0.18">
          {/* Decorative lines */}
          <line x1="-100" y1="-6" x2="-20" y2="-6" stroke="#C9A24A" strokeWidth="0.4" />
          <line x1="20" y1="-6" x2="100" y2="-6" stroke="#C9A24A" strokeWidth="0.4" />
          <circle cx="-15" cy="-6" r="1.5" fill="#C9A24A" opacity="0.5" />
          <circle cx="15" cy="-6" r="1.5" fill="#C9A24A" opacity="0.5" />
          <text x="0" y="0" textAnchor="middle" fill="#C9A24A" fontSize="12"
            style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.25em' }}>
            CIDADELA INTERIOR
          </text>
          <line x1="-100" y1="6" x2="-20" y2="6" stroke="#C9A24A" strokeWidth="0.4" />
          <line x1="20" y1="6" x2="100" y2="6" stroke="#C9A24A" strokeWidth="0.4" />
          <circle cx="-15" cy="6" r="1.5" fill="#C9A24A" opacity="0.5" />
          <circle cx="15" cy="6" r="1.5" fill="#C9A24A" opacity="0.5" />
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
    <div className="space-y-2 mt-3 max-w-[720px] mx-auto">
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
