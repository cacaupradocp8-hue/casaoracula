import { useMemo, useState, useRef, useCallback } from 'react';

// ============================================
// CIDADELA INTERIOR — MANDALA SAGRADA v5
// Cartografia simbólica vibrante da cidade interior
// 12 territórios + centro (Coração da CidaDELA)
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

const CX = 400, CY = 400;

// ============================================
// NAME OVERRIDES — renames sem alterar DB
// ============================================
const NAME_OVERRIDES: Record<number, string> = {
  4: 'Bosque dos Arquétipos',
};

// ============================================
// VIRTUAL DISTRICTS — exibidos sem precisar de DB
// ============================================
const VIRTUAL_DISTRICTS: MandalaDistrict[] = [
  {
    id: 'virtual-jardim-heroina',
    numero: 13,
    nome: 'Jardim da Heroína',
    descricao: 'O território da jornada pessoal e da coragem interior.',
    icone: '🌺',
    cor: '#C9A24A',
  },
];

// ============================================
// POSITIONS — Mandala com 3 camadas
// Centro + 6 inner + 6 outer
// ============================================
const INNER_R = 155;
const OUTER_R = 290;

function ringPos(i: number, count: number, radius: number, offsetDeg = -90) {
  const angle = ((offsetDeg + (i / count) * 360) * Math.PI) / 180;
  return { x: CX + radius * Math.cos(angle), y: CY + radius * Math.sin(angle) };
}

// Inner ring (6): Portão(1), Torres(2), Portas(3), Casa Sonhos(6), Jardim Heroína(13), Jardim Imagens(4)
// Outer ring (6): Labirinto(10), Forja(8), Espelho(7), Praça Abalo(5), Conselho(9), Portal Renascimento(12)
const INNER_ORDER = [1, 2, 3, 6, 13, 4];
const OUTER_ORDER = [10, 8, 7, 5, 9, 12];

const DISTRICT_POSITIONS: Record<number, { x: number; y: number; ring: 'center' | 'inner' | 'outer' }> = {
  11: { x: CX, y: CY, ring: 'center' },
  ...Object.fromEntries(INNER_ORDER.map((num, i) => [num, { ...ringPos(i, 6, INNER_R), ring: 'inner' as const }])),
  ...Object.fromEntries(OUTER_ORDER.map((num, i) => [num, { ...ringPos(i, 6, OUTER_R, -60), ring: 'outer' as const }])),
};

// ============================================
// ROADS — caminhos da cidade
// ============================================
const ROADS: { from: number; to: number }[] = [
  // Centro → inner
  { from: 11, to: 1 }, { from: 11, to: 2 }, { from: 11, to: 3 },
  { from: 11, to: 6 }, { from: 11, to: 13 }, { from: 11, to: 4 },
  // Inner ring (hexagonal)
  { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 6 },
  { from: 6, to: 13 }, { from: 13, to: 4 }, { from: 4, to: 1 },
  // Inner → outer bridges
  { from: 1, to: 10 }, { from: 1, to: 12 },
  { from: 2, to: 10 }, { from: 3, to: 8 },
  { from: 6, to: 8 }, { from: 6, to: 7 },
  { from: 13, to: 7 }, { from: 13, to: 5 },
  { from: 4, to: 5 }, { from: 4, to: 9 },
  { from: 2, to: 9 },
  // Outer ring partial
  { from: 12, to: 9 }, { from: 10, to: 8 },
  { from: 7, to: 5 },
];

// ============================================
// PALETA VIBRANTE — hierarquia visual forte
// ============================================
const STATE_STYLES = {
  inativo: {
    fill: 'rgba(180,170,150,0.10)',
    stroke: 'rgba(180,170,150,0.30)',
    icon: 'rgba(200,190,170,0.50)',
    text: 'rgba(220,215,205,0.60)',
    glow: 'transparent',
    building: 'rgba(160,150,130,0.15)',
    wall: 'rgba(180,170,150,0.35)',
    accent: 'rgba(180,170,150,0.25)',
  },
  ativo: {
    fill: 'rgba(201,162,74,0.22)',
    stroke: 'rgba(212,175,55,0.85)',
    icon: '#D4AF37',
    text: '#F5E6B8',
    glow: 'rgba(201,162,74,0.30)',
    building: 'rgba(201,162,74,0.20)',
    wall: 'rgba(212,175,55,0.70)',
    accent: '#C9A24A',
  },
  integrado: {
    fill: 'rgba(74,178,107,0.22)',
    stroke: 'rgba(107,196,143,0.85)',
    icon: '#7dd9a0',
    text: '#a8e6c3',
    glow: 'rgba(74,178,107,0.30)',
    building: 'rgba(74,178,107,0.20)',
    wall: 'rgba(107,196,143,0.70)',
    accent: '#6bc48f',
  },
};

// Scale factors per ring for visual hierarchy
const RING_SCALE = { center: 1.35, inner: 1.0, outer: 0.82 };
const RING_BASE_R = { center: 82, inner: 56, outer: 46 };
const RING_LABEL_OFFSET = { center: 76, inner: 52, outer: 42 };

// ============================================
// TERRITORY ART — Architectural SVG illustrations
// ============================================
const TERRITORY_ART: Record<number, (s: typeof STATE_STYLES.inativo) => JSX.Element> = {
  // 1 — Portão da Chegada
  1: (st) => <g>
    <ellipse cx="0" cy="22" rx="38" ry="8" fill={st.building} stroke={st.wall} strokeWidth="1" />
    <rect x="-26" y="-10" width="10" height="34" rx="1.5" fill={st.building} stroke={st.wall} strokeWidth="1.2" />
    <rect x="16" y="-10" width="10" height="34" rx="1.5" fill={st.building} stroke={st.wall} strokeWidth="1.2" />
    {[-26,-22,-18, 16,20,24].map((x,i) => <rect key={i} x={x} y="-15" width="3" height="5" fill={st.building} stroke={st.icon} strokeWidth="0.8" />)}
    <path d="M-16 24 L-16 -2 A16 18 0 0 1 16 -2 L16 24" fill="none" stroke={st.icon} strokeWidth="2.2" />
    <path d="M-12 24 L-12 2 A12 14 0 0 1 12 2 L12 24" fill="none" stroke={st.icon} strokeWidth="1" opacity="0.6" />
    <polygon points="0,-14 1.5,-10 5,-10 2,-7 3,-3 0,-6 -3,-3 -2,-7 -5,-10 -1.5,-10" fill={st.icon} opacity="0.9" />
  </g>,

  // 2 — Torre medieval robusta
  2: (st) => <g>
    {/* Sombra/base */}
    <ellipse cx="0" cy="30" rx="32" ry="7" fill={st.building} stroke={st.wall} strokeWidth="0.6" />

    {/* Corpo principal — pedra sólida, largo na base, afinando no topo */}
    <path d="M-16 28 L-18 -20 L-14 -20 L-14 -30 L14 -30 L14 -20 L18 -20 L16 28 Z"
      fill={st.building} stroke={st.wall} strokeWidth="1.8" strokeLinejoin="round" />

    {/* Ameias no topo — battlements */}
    {[-14,-9,-4,1,6,11].map((x,i) =>
      <rect key={`b${i}`} x={x} y="-38" width="4" height="8" rx="0.5"
        fill={st.building} stroke={st.icon} strokeWidth="1" />
    )}

    {/* Pedras horizontais — textura */}
    {[-22,-14,-6,2,10,18].map((y,i) =>
      <line key={`s${i}`} x1={-15 + i*0.3} y1={y} x2={15 - i*0.3} y2={y}
        stroke={st.icon} strokeWidth="0.5" opacity="0.3" />
    )}

    {/* Janela em arco — grande, no alto */}
    <rect x="-7" y="-24" width="14" height="16" rx="1" fill={st.accent} stroke={st.icon} strokeWidth="1.2" />
    <path d="M-7 -24 A7 7 0 0 1 7 -24" fill={st.accent} stroke={st.icon} strokeWidth="1.2" />
    {/* Cruz da janela */}
    <line x1="0" y1="-30" x2="0" y2="-8" stroke={st.icon} strokeWidth="0.7" opacity="0.5" />
    <line x1="-7" y1="-16" x2="7" y2="-16" stroke={st.icon} strokeWidth="0.7" opacity="0.5" />

    {/* Janela pequena inferior */}
    <rect x="-4" y="0" width="8" height="10" rx="0.8" fill={st.accent} stroke={st.icon} strokeWidth="0.9" opacity="0.7" />
    <path d="M-4 0 A4 4 0 0 1 4 0" fill={st.accent} stroke={st.icon} strokeWidth="0.9" opacity="0.7" />

    {/* Porta na base */}
    <path d="M-5 28 L-5 18 A5 5 0 0 1 5 18 L5 28" fill={st.accent} stroke={st.icon} strokeWidth="1" />

    {/* Mastro com bandeira */}
    <line x1="0" y1="-38" x2="0" y2="-54" stroke={st.icon} strokeWidth="1.5" />
    <path d="M0 -54 L10 -50 L0 -46" fill={st.icon} opacity="0.8" />

    {/* Reforços laterais — contrafortes */}
    <path d="M-16 28 L-22 28 L-18 8" fill={st.building} stroke={st.wall} strokeWidth="0.8" />
    <path d="M16 28 L22 28 L18 8" fill={st.building} stroke={st.wall} strokeWidth="0.8" />
  </g>,

  // 3 — Portas
  3: (st) => <g>
    <ellipse cx="0" cy="22" rx="34" ry="8" fill={st.building} stroke={st.wall} strokeWidth="0.8" />
    <rect x="-26" y="-8" width="52" height="32" rx="2" fill={st.building} stroke={st.wall} strokeWidth="1.2" />
    <path d="M-18 24 L-18 -4 A18 22 0 0 1 18 -4 L18 24" fill="none" stroke={st.icon} strokeWidth="2.2" />
    <path d="M-14 24 L-14 0 A14 18 0 0 1 14 0 L14 24" fill="none" stroke={st.icon} strokeWidth="1" opacity="0.6" />
    <circle cx="0" cy="6" r="3.5" fill="none" stroke={st.icon} strokeWidth="1.3" />
    <line x1="0" y1="9.5" x2="0" y2="18" stroke={st.icon} strokeWidth="1.2" />
    <circle cx="-22" cy="-2" r="2.5" fill={st.accent} stroke={st.icon} strokeWidth="0.8" />
    <circle cx="22" cy="-2" r="2.5" fill={st.accent} stroke={st.icon} strokeWidth="0.8" />
  </g>,

  // 4 — Jardim das Imagens
  4: (st) => <g>
    <circle cx="0" cy="0" r="36" fill={st.building} stroke={st.wall} strokeWidth="1.2" />
    <circle cx="0" cy="0" r="30" fill="none" stroke={st.wall} strokeWidth="0.7" strokeDasharray="4 3" />
    <line x1="0" y1="-36" x2="0" y2="36" stroke={st.wall} strokeWidth="0.8" strokeDasharray="3 3" />
    <line x1="-36" y1="0" x2="36" y2="0" stroke={st.wall} strokeWidth="0.8" strokeDasharray="3 3" />
    <rect x="-2" y="-2" width="4" height="18" rx="1" fill={st.building} stroke={st.icon} strokeWidth="1.5" />
    <ellipse cx="0" cy="-10" rx="14" ry="10" fill={st.accent} stroke={st.icon} strokeWidth="1.5" />
    <ellipse cx="-6" cy="-14" rx="8" ry="7" fill="none" stroke={st.icon} strokeWidth="0.8" opacity="0.6" />
    <ellipse cx="6" cy="-14" rx="8" ry="7" fill="none" stroke={st.icon} strokeWidth="0.8" opacity="0.6" />
    {/* floating image symbols */}
    {[[-18,10],[-16,-6],[12,-12],[18,6],[-10,20],[14,18]].map(([x,y],i) =>
      <circle key={i} cx={x} cy={y} r={1.8} fill={st.icon} opacity={0.5} />
    )}
    {/* eye symbol — seeing images */}
    <ellipse cx="0" cy="-10" rx="6" ry="3.5" fill="none" stroke={st.icon} strokeWidth="0.8" opacity="0.5" />
    <circle cx="0" cy="-10" r="1.5" fill={st.icon} opacity="0.4" />
  </g>,

  // 5 — Praça do Abalo
  5: (st) => <g>
    <path d="M-34 -18 L34 -20 L36 20 L-32 22 Z" fill={st.building} stroke={st.wall} strokeWidth="1.2" />
    <path d="M-24 -12 L24 -14 L26 12 L-22 14 Z" fill="none" stroke={st.wall} strokeWidth="0.7" strokeDasharray="3 3" />
    <path d="M-5 -20 L-2 -10 L3 -4 L-2 4 L4 12 L0 22" fill="none" stroke={st.icon} strokeWidth="2.8" strokeLinecap="round" />
    <path d="M-2 -10 L-8 -6" fill="none" stroke={st.icon} strokeWidth="1" opacity="0.7" />
    <path d="M3 -4 L8 -1" fill="none" stroke={st.icon} strokeWidth="1" opacity="0.7" />
    {[[-24,-4,4,3],[-20,8,3,2],[18,-6,4,3],[22,8,3,2]].map(([x,y,w,h],i) =>
      <rect key={i} x={x} y={y} width={w} height={h} rx="1" fill={st.building} stroke={st.wall} strokeWidth="0.6" />
    )}
  </g>,

  // 6 — Casa dos Sonhos
  6: (st) => <g>
    <ellipse cx="0" cy="24" rx="38" ry="8" fill={st.building} stroke={st.wall} strokeWidth="0.8" />
    <rect x="-16" y="0" width="32" height="24" rx="1.5" fill={st.building} stroke={st.wall} strokeWidth="1.2" />
    <path d="M-22 0 L0 -22 L22 0" fill={st.building} stroke={st.icon} strokeWidth="1.8" />
    <circle cx="-5" cy="8" r="4" fill={st.accent} stroke={st.icon} strokeWidth="1" />
    <line x1="-5" y1="4" x2="-5" y2="12" stroke={st.icon} strokeWidth="0.6" />
    <line x1="-9" y1="8" x2="-1" y2="8" stroke={st.icon} strokeWidth="0.6" />
    <path d="M6 24 L6 12 A5 5 0 0 1 16 12 L16 24" fill={st.accent} stroke={st.icon} strokeWidth="1" />
    <circle cx="14" cy="18" r="1" fill={st.icon} opacity="0.7" />
    {/* Moon */}
    <path d="M24 -18 A7 7 0 1 0 24 -4 A5 5 0 1 1 24 -18" fill={st.accent} stroke={st.icon} strokeWidth="1.2" />
    {[[28,-12,1.2],[32,-22,0.8],[-22,-14,1],[-18,-18,0.8]].map(([x,y,r],i) =>
      <circle key={i} cx={x} cy={y} r={r} fill={st.icon} opacity={0.6} />
    )}
  </g>,

  // 7 — Espelho dos Vínculos
  7: (st) => <g>
    <ellipse cx="0" cy="2" rx="34" ry="28" fill={st.building} stroke={st.wall} strokeWidth="1" />
    <ellipse cx="0" cy="2" rx="26" ry="20" fill="none" stroke={st.wall} strokeWidth="0.6" strokeDasharray="3 4" />
    <ellipse cx="0" cy="-2" rx="9" ry="14" fill={st.accent} stroke={st.icon} strokeWidth="1.8" />
    <ellipse cx="0" cy="-2" rx="6" ry="10" fill="none" stroke={st.icon} strokeWidth="0.8" opacity="0.5" />
    <line x1="0" y1="12" x2="0" y2="20" stroke={st.icon} strokeWidth="1.8" />
    <path d="M-8 20 Q0 16 8 20" fill="none" stroke={st.icon} strokeWidth="1.2" />
    <rect x="-24" y="2" width="8" height="3" rx="1.5" fill={st.building} stroke={st.wall} strokeWidth="0.6" />
    <rect x="16" y="2" width="8" height="3" rx="1.5" fill={st.building} stroke={st.wall} strokeWidth="0.6" />
  </g>,

  // 8 — Forja
  8: (st) => <g>
    <ellipse cx="0" cy="24" rx="38" ry="8" fill={st.building} stroke={st.wall} strokeWidth="0.8" />
    <path d="M-18 24 L-18 -6 A18 12 0 0 1 18 -6 L18 24" fill={st.building} stroke={st.wall} strokeWidth="1.5" />
    <path d="M-10 24 L-10 6 A10 10 0 0 1 10 6 L10 24" fill={st.accent} stroke={st.icon} strokeWidth="1.5" />
    {/* Flame */}
    <path d="M-4 6 Q-5 -4 0 -12 Q5 -4 4 6" fill={st.accent} stroke={st.icon} strokeWidth="1.5" />
    <path d="M0 -12 Q-1 -18 0 -22 Q1 -18 0 -12" fill="none" stroke={st.icon} strokeWidth="1" opacity="0.8" />
    {/* Anvil */}
    <path d="M22 20 L26 14 L34 14 L38 20" fill="none" stroke={st.icon} strokeWidth="1.5" />
    <rect x="25" y="12" width="10" height="3" rx="0.5" fill={st.building} stroke={st.icon} strokeWidth="0.8" />
    {/* Sparks */}
    {[[-3,-16,1],[4,-18,0.8],[-5,-12,0.7],[2,-20,0.6]].map(([x,y,r],i) =>
      <circle key={i} cx={x} cy={y} r={r} fill={st.icon} opacity={0.6} />
    )}
  </g>,

  // 9 — Conselho Interior
  9: (st) => <g>
    <circle cx="0" cy="0" r="34" fill={st.building} stroke={st.wall} strokeWidth="1.2" />
    <circle cx="0" cy="0" r="28" fill="none" stroke={st.wall} strokeWidth="0.6" strokeDasharray="3 3" />
    <circle cx="0" cy="0" r="12" fill="none" stroke={st.icon} strokeWidth="1.5" />
    <circle cx="0" cy="0" r="3" fill={st.icon} opacity="0.6" />
    {/* Seats around the council */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
      const rad = (a * Math.PI) / 180;
      const x = 20 * Math.cos(rad);
      const y = 20 * Math.sin(rad);
      return <rect key={i} x={x - 3} y={y - 2} width="6" height="4" rx="2" fill={st.accent} stroke={st.icon} strokeWidth="0.8"
        transform={`rotate(${a}, ${x}, ${y})`}/>;
    })}
    {[0, 60, 120, 180, 240, 300].map((a, i) => {
      const rad = (a * Math.PI) / 180;
      return <circle key={i} cx={28 * Math.cos(rad)} cy={28 * Math.sin(rad)} r="2.5" fill={st.accent} stroke={st.icon} strokeWidth="0.8" />;
    })}
  </g>,

  // 10 — Labirinto
  10: (st) => <g>
    <circle cx="0" cy="0" r="34" fill={st.building} stroke={st.wall} strokeWidth="1" />
    <circle cx="0" cy="0" r="30" fill="none" stroke={st.icon} strokeWidth="1.2" />
    <path d="M0 -30 L0 -22" stroke={st.building} strokeWidth="4" />
    <circle cx="0" cy="0" r="22" fill="none" stroke={st.icon} strokeWidth="1" />
    <path d="M22 0 L16 0" stroke={st.building} strokeWidth="4" />
    <circle cx="0" cy="0" r="16" fill="none" stroke={st.icon} strokeWidth="0.9" />
    <path d="M0 16 L0 10" stroke={st.building} strokeWidth="4" />
    <circle cx="0" cy="0" r="10" fill="none" stroke={st.icon} strokeWidth="0.8" />
    <path d="M-10 0 L-5 0" stroke={st.building} strokeWidth="4" />
    <circle cx="0" cy="0" r="4" fill={st.accent} stroke={st.icon} strokeWidth="1.2" />
    <circle cx="0" cy="0" r="2" fill={st.icon} opacity="0.8" />
    <polygon points="0,-36 -2,-32 2,-32" fill={st.icon} opacity="0.8" />
  </g>,

  // 11 — Coração da CidaDELA (centro)
  11: (st) => <g>
    {/* Sacred geometry rings */}
    <circle cx="0" cy="0" r="60" fill={st.building} stroke={st.wall} strokeWidth="1.8" />
    <circle cx="0" cy="0" r="52" fill="none" stroke={st.wall} strokeWidth="1" strokeDasharray="5 4" />
    {/* Radial lines */}
    {Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return <line key={i} x1={18 * Math.cos(a)} y1={18 * Math.sin(a)}
        x2={52 * Math.cos(a)} y2={52 * Math.sin(a)}
        stroke={st.icon} strokeWidth="0.8" opacity="0.6" />;
    })}
    <circle cx="0" cy="0" r="40" fill="none" stroke={st.icon} strokeWidth="0.9" opacity="0.6" />
    <circle cx="0" cy="0" r="28" fill="none" stroke={st.icon} strokeWidth="1" opacity="0.7" />
    <circle cx="0" cy="0" r="18" fill="none" stroke={st.icon} strokeWidth="1.2" />
    {/* Heart cross */}
    <line x1="0" y1="-18" x2="0" y2="18" stroke={st.icon} strokeWidth="1" opacity="0.8" />
    <line x1="-18" y1="0" x2="18" y2="0" stroke={st.icon} strokeWidth="1" opacity="0.8" />
    <line x1="-12" y1="-12" x2="12" y2="12" stroke={st.icon} strokeWidth="0.6" opacity="0.5" />
    <line x1="12" y1="-12" x2="-12" y2="12" stroke={st.icon} strokeWidth="0.6" opacity="0.5" />
    {/* Heart center */}
    <circle cx="0" cy="0" r="6" fill={st.icon} opacity="0.7" />
    <circle cx="0" cy="0" r="2.5" fill={st.icon} opacity="1" />
    {/* Cardinal jewels */}
    {[0, 90, 180, 270].map((a, i) => {
      const rad = (a * Math.PI) / 180;
      return <g key={i}>
        <circle cx={44 * Math.cos(rad)} cy={44 * Math.sin(rad)} r="5" fill={st.accent} stroke={st.icon} strokeWidth="1" />
        <circle cx={44 * Math.cos(rad)} cy={44 * Math.sin(rad)} r="2" fill={st.icon} opacity="0.6" />
      </g>;
    })}
  </g>,

  // 12 — Portal de Renascimento
  12: (st) => <g>
    <ellipse cx="0" cy="24" rx="34" ry="7" fill={st.building} stroke={st.wall} strokeWidth="0.8" />
    <path d="M-22 24 L-22 -8 A22 28 0 0 1 22 -8 L22 24" fill={st.building} stroke={st.wall} strokeWidth="1.5" />
    <path d="M-16 24 L-16 -2 A16 22 0 0 1 16 -2 L16 24" fill="none" stroke={st.icon} strokeWidth="2" />
    <path d="M-12 24 L-12 2 A12 16 0 0 1 12 2 L12 24" fill="none" stroke={st.icon} strokeWidth="0.8" opacity="0.5" />
    {/* Phoenix flame */}
    <path d="M0 18 Q-2 10 -5 4 Q0 8 0 -8 Q0 8 5 4 Q2 10 0 18" fill={st.accent} stroke={st.icon} strokeWidth="1.5" />
    <path d="M0 -8 Q-2 -14 0 -20 Q2 -14 0 -8" fill="none" stroke={st.icon} strokeWidth="1" opacity="0.8" />
    {/* Light rays */}
    {[[-6,-24],[0,-26],[6,-24],[-4,-28],[4,-28]].map(([x,y],i) =>
      <line key={i} x1={x} y1={y as number} x2={(x as number) * 1.3} y2={(y as number) - 8} stroke={st.icon} strokeWidth="0.8" opacity={0.6} />
    )}
  </g>,

  // 13 — Jardim da Heroína (NOVO)
  13: (st) => <g>
    <circle cx="0" cy="0" r="36" fill={st.building} stroke={st.wall} strokeWidth="1.2" />
    <circle cx="0" cy="0" r="30" fill="none" stroke={st.wall} strokeWidth="0.6" strokeDasharray="4 3" />
    {/* Flower spiral — pétala central */}
    {[0, 72, 144, 216, 288].map((a, i) => {
      const rad = (a * Math.PI) / 180;
      const px = 12 * Math.cos(rad);
      const py = 12 * Math.sin(rad);
      return <ellipse key={i} cx={px} cy={py} rx="10" ry="5"
        transform={`rotate(${a + 36}, ${px}, ${py})`}
        fill={st.accent} stroke={st.icon} strokeWidth="1.2" opacity="0.7" />;
    })}
    {/* Center pistil */}
    <circle cx="0" cy="0" r="5" fill={st.accent} stroke={st.icon} strokeWidth="1.5" />
    <circle cx="0" cy="0" r="2" fill={st.icon} opacity="0.7" />
    {/* Spiral vine */}
    <path d="M0 5 Q8 12 4 20 Q0 28 -6 24 Q-12 20 -8 12" fill="none" stroke={st.icon} strokeWidth="0.8" opacity="0.5" />
    {/* Leaf crown hints */}
    {[[-20,-16],[20,-16],[-22,14],[22,14]].map(([x,y],i) =>
      <path key={i} d={`M${x} ${y} Q${(x as number)*0.6} ${(y as number)*0.4} ${(x as number)*0.3} ${(y as number)*0.8}`}
        fill="none" stroke={st.icon} strokeWidth="0.8" opacity="0.4" />
    )}
    {/* Small buds */}
    {[[-14,-20],[16,-18],[-18,18],[20,16]].map(([x,y],i) =>
      <circle key={i} cx={x} cy={y} r="2" fill={st.icon} opacity="0.4" />
    )}
  </g>,
};

// ============================================
// ATMOSPHERE PARTICLES
// ============================================
function AtmosphereParticles() {
  const particles = useMemo(
    () => Array.from({ length: 35 }, (_, i) => ({
      id: i,
      cx: 60 + Math.random() * 680,
      cy: 60 + Math.random() * 680,
      r: 0.6 + Math.random() * 1.0,
      dur: 14 + Math.random() * 16,
      delay: Math.random() * 10,
      driftX: (Math.random() - 0.5) * 30,
      driftY: (Math.random() - 0.5) * 30,
      isGold: Math.random() > 0.25,
    })),
    []
  );
  return <>
    {particles.map(p => (
      <circle key={p.id} cx={p.cx} cy={p.cy} r={p.r}
        fill={p.isGold ? '#D4AF37' : '#F5F1E8'} opacity="0">
        <animate attributeName="opacity" values="0;0.30;0.12;0.30;0" dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
        <animate attributeName="cx" values={`${p.cx};${p.cx + p.driftX};${p.cx}`} dur={`${p.dur * 1.2}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
        <animate attributeName="cy" values={`${p.cy};${p.cy + p.driftY};${p.cy}`} dur={`${p.dur * 1.3}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
      </circle>
    ))}
  </>;
}

// ============================================
// MANDALA RINGS — decorative concentric rings
// ============================================
function MandalaRings() {
  return <g>
    {/* Anel do centro — forte e visível */}
    <circle cx={CX} cy={CY} r={90} fill="none" stroke="#C9A24A" strokeWidth="1.8" opacity="0.35" />
    {/* Anel interno — bem marcado */}
    <circle cx={CX} cy={CY} r={INNER_R + 25} fill="none" stroke="#C9A24A" strokeWidth="1.5" opacity="0.30" />
    <circle cx={CX} cy={CY} r={INNER_R - 15} fill="none" stroke="#C9A24A" strokeWidth="1.0" opacity="0.22" />
    {/* Anel externo — contorno da mandala */}
    <circle cx={CX} cy={CY} r={OUTER_R + 22} fill="none" stroke="#C9A24A" strokeWidth="2" opacity="0.28" />
    <circle cx={CX} cy={CY} r={OUTER_R - 15} fill="none" stroke="#C9A24A" strokeWidth="1.2" opacity="0.20" />
    {/* Anel mais externo — borda decorativa */}
    <circle cx={CX} cy={CY} r={OUTER_R + 50} fill="none" stroke="#C9A24A" strokeWidth="1" strokeDasharray="12 6" opacity="0.18" />
    {/* Geometria de 12 pontas conectando anéis */}
    {Array.from({ length: 12 }, (_, i) => {
      const a = ((i / 12) * 360 - 90) * Math.PI / 180;
      const r1 = 90;
      const r2 = OUTER_R + 22;
      return <line key={i}
        x1={CX + r1 * Math.cos(a)} y1={CY + r1 * Math.sin(a)}
        x2={CX + r2 * Math.cos(a)} y2={CY + r2 * Math.sin(a)}
        stroke="#C9A24A" strokeWidth="0.5" opacity="0.14" />;
    })}
    {/* Marcadores nos cruzamentos anel/raio */}
    {Array.from({ length: 6 }, (_, i) => {
      const a = ((i / 6) * 360 - 90) * Math.PI / 180;
      const r = INNER_R + 25;
      return <circle key={`dot-i${i}`} cx={CX + r * Math.cos(a)} cy={CY + r * Math.sin(a)}
        r="3" fill="#C9A24A" opacity="0.18" />;
    })}
    {Array.from({ length: 6 }, (_, i) => {
      const a = ((i / 6) * 360 - 60) * Math.PI / 180;
      const r = OUTER_R + 22;
      return <circle key={`dot-o${i}`} cx={CX + r * Math.cos(a)} cy={CY + r * Math.sin(a)}
        r="3.5" fill="#C9A24A" opacity="0.16" />;
    })}
  </g>;
}

// ============================================
// COMPASS ROSE
// ============================================
function CompassRose() {
  return <g transform="translate(720, 720)" opacity="0.40">
    <line x1="0" y1="-30" x2="0" y2="30" stroke="#C9A24A" strokeWidth="1" />
    <line x1="-30" y1="0" x2="30" y2="0" stroke="#C9A24A" strokeWidth="1" />
    <line x1="-18" y1="-18" x2="18" y2="18" stroke="#C9A24A" strokeWidth="0.5" />
    <line x1="18" y1="-18" x2="-18" y2="18" stroke="#C9A24A" strokeWidth="0.5" />
    <polygon points="0,-30 -4,-18 4,-18" fill="#C9A24A" opacity="0.7" />
    <polygon points="0,30 -3,20 3,20" fill="#C9A24A" opacity="0.3" />
    <circle cx="0" cy="0" r="8" fill="none" stroke="#C9A24A" strokeWidth="0.8" />
    <circle cx="0" cy="0" r="2" fill="#C9A24A" opacity="0.8" />
    <text x="0" y="-36" textAnchor="middle" fill="#C9A24A" fontSize="10" fontWeight="bold"
      style={{ fontFamily: "'Playfair Display', serif" }}>N</text>
  </g>;
}

// ============================================
// ROAD PATH — winding bezier
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

  // Merge real districts with virtual ones (only if not already present)
  const allDistricts = useMemo(() => {
    const existingNums = new Set(districts.map(d => d.numero));
    const virtuals = VIRTUAL_DISTRICTS.filter(v => !existingNums.has(v.numero));
    return [...districts, ...virtuals];
  }, [districts]);

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

  const roads = useMemo(() => {
    return ROADS.map((road) => {
      const fromPos = DISTRICT_POSITIONS[road.from];
      const toPos = DISTRICT_POSITIONS[road.to];
      if (!fromPos || !toPos) return null;
      const fromD = allDistricts.find(d => d.numero === road.from);
      const toD = allDistricts.find(d => d.numero === road.to);
      const fromState = fromD ? getState(fromD.id) : 'inativo';
      const toState = toD ? getState(toD.id) : 'inativo';
      const bothIntegrated = fromState === 'integrado' && toState === 'integrado';
      const lit = fromState !== 'inativo' || toState !== 'inativo';
      return { path: roadPath(fromPos, toPos), lit, integrated: bothIntegrated, key: `${road.from}-${road.to}` };
    }).filter(Boolean) as { path: string; lit: boolean; integrated: boolean; key: string }[];
  }, [allDistricts, districtStates]);

  const renderDistrict = (d: MandalaDistrict) => {
    const pos = DISTRICT_POSITIONS[d.numero];
    if (!pos) return null;
    const state = getState(d.id);
    const st = STATE_STYLES[state];
    const isCenter = d.numero === 11;
    const ring = pos.ring;
    const isSelected = selectedId === d.id;
    const isHovered = hoveredDistrict === d.id;
    const sessCount = getSessionCount(d.id);
    const collective = getCollective(d.id);
    const artScale = RING_SCALE[ring];
    const baseR = RING_BASE_R[ring];
    const labelOffset = RING_LABEL_OFFSET[ring];

    // Display name with overrides
    const displayName = isCenter ? 'Coração da CidaDELA' : (NAME_OVERRIDES[d.numero] || d.nome);

    // Outer ring opacity reduction for hierarchy
    const ringOpacityMult = ring === 'outer' ? 0.75 : 1;

    return (
      <g key={d.id} data-district={d.id}
        className={onDistrictClick ? 'cursor-pointer' : ''}
        onClick={(e) => { e.stopPropagation(); onDistrictClick?.(d); }}
        onPointerEnter={() => setHoveredDistrict(d.id)}
        onPointerLeave={() => setHoveredDistrict(null)}
      >
        <title>{displayName}{d.descricao ? ` — ${d.descricao}` : ''}</title>

        {/* Territory base — visible ground */}
        <circle cx={pos.x} cy={pos.y} r={baseR}
          fill={st.fill}
          stroke={st.stroke} strokeWidth={isCenter ? 1.5 : ring === 'inner' ? 1 : 0.7}
          opacity={(isHovered ? 1 : 0.8) * ringOpacityMult}
          style={{ transition: 'all 0.3s ease' }} />

        {/* Hover highlight */}
        {isHovered && (
          <circle cx={pos.x} cy={pos.y} r={baseR + 4}
            fill="rgba(201,162,74,0.10)" stroke="rgba(212,175,55,0.30)" strokeWidth="1.2"
            style={{ transition: 'all 0.3s ease' }} />
        )}

        {/* Selection ring */}
        {isSelected && (
          <circle cx={pos.x} cy={pos.y} r={baseR + 6} fill="none"
            stroke="#D4AF37" strokeWidth="2.5" strokeDasharray="5 3">
            <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Active glow */}
        {state === 'ativo' && (
          <circle cx={pos.x} cy={pos.y} r={baseR - 4} fill="rgba(201,162,74,0.15)" filter="url(#territory-glow)">
            <animate attributeName="opacity" values="0.5;0.9;0.5" dur="5s" repeatCount="indefinite" />
          </circle>
        )}
        {state === 'integrado' && (
          <circle cx={pos.x} cy={pos.y} r={baseR - 4} fill="rgba(74,178,107,0.15)" filter="url(#territory-glow)">
            <animate attributeName="opacity" values="0.5;0.85;0.5" dur="6s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Center breathing aura */}
        {isCenter && (
          <circle cx={pos.x} cy={pos.y} r="90" fill="url(#center-aura)" opacity="0.7">
            <animate attributeName="r" values="78;95;78" dur="9s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.8;0.5" dur="9s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Territory illustration */}
        <g transform={`translate(${pos.x}, ${pos.y}) scale(${isHovered ? artScale * 1.06 : artScale})`}
          opacity={ringOpacityMult}
          style={{ transition: 'transform 0.35s ease', transformOrigin: '0 0' }}>
          {TERRITORY_ART[d.numero]?.(st)}
        </g>

        {/* Active pulse ring */}
        {state === 'ativo' && !isCenter && (
          <circle cx={pos.x} cy={pos.y} r={baseR - 2} fill="none"
            stroke={st.stroke} strokeWidth="0.8">
            <animate attributeName="r" values={`${baseR - 4};${baseR + 6};${baseR - 4}`} dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0;0.6" dur="4s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Integrated badge */}
        {state === 'integrado' && !isCenter && (
          <g transform={`translate(${pos.x + baseR * 0.7}, ${pos.y - baseR * 0.7})`}>
            <circle r="10" fill="#2d7a4a" stroke="#6bc48f" strokeWidth="1.5" />
            <polyline points="-3.5,0.5 -1,3.5 4.5,-3.5" fill="none" stroke="#F5F1E8" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        )}

        {/* Name label */}
        <text x={pos.x} y={pos.y + labelOffset}
          textAnchor="middle" dominantBaseline="central"
          fill={isHovered ? '#F5E6B8' : st.text}
          fontSize={isCenter ? 15 : ring === 'inner' ? 11.5 : 10}
          fontWeight={isCenter ? '700' : '600'}
          opacity={ringOpacityMult}
          style={{ fontFamily: "'Playfair Display', serif", letterSpacing: isCenter ? '0.06em' : '0.03em', transition: 'fill 0.3s' }}>
          {displayName}
        </text>

        {/* Session count */}
        {mode === 'clinico' && sessCount > 0 && !isCenter && (
          <text x={pos.x} y={pos.y + labelOffset + 14} textAnchor="middle" fill="#C9A24A" fontSize="9" opacity={0.6 * ringOpacityMult}
            style={{ fontFamily: "'Inter', sans-serif" }}>
            {sessCount} {sessCount === 1 ? 'sessão' : 'sessões'}
          </text>
        )}
        {mode === 'coletivo' && collective && collective.client_count > 0 && (
          <text x={pos.x} y={pos.y + labelOffset + 14} textAnchor="middle" fill="#C9A24A" fontSize="9" opacity={0.6 * ringOpacityMult}>
            {collective.client_count} {collective.client_count === 1 ? 'cliente' : 'clientes'}
          </text>
        )}
      </g>
    );
  };

  const centerDistrict = allDistricts.find(d => d.numero === 11);
  const innerDistricts = allDistricts.filter(d => INNER_ORDER.includes(d.numero));
  const outerDistricts = allDistricts.filter(d => OUTER_ORDER.includes(d.numero));

  return (
    <div className={`relative ${className || ''}`} style={{ aspectRatio: '1/1', maxWidth: '720px', margin: '0 auto' }}>
      {isZoomed && (
        <button onClick={resetZoom}
          className="absolute top-2 right-2 z-10 px-2.5 py-1 rounded-lg text-[10px] bg-primary/10 border border-primary/20 text-primary/70 hover:text-primary transition-colors backdrop-blur-sm">
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
          <filter id="center-glow">
            <feGaussianBlur stdDeviation="18" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          <radialGradient id="center-aura">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.40" />
            <stop offset="35%" stopColor="#C9A24A" stopOpacity="0.15" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          <radialGradient id="bg-vignette" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#1a2a3a" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#0E1A24" stopOpacity="0" />
            <stop offset="100%" stopColor="#050a10" stopOpacity="0.20" />
          </radialGradient>

          <pattern id="parchment-tex" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="0.5" fill="rgba(201,162,74,0.07)" />
            <circle cx="38" cy="20" r="0.4" fill="rgba(201,162,74,0.05)" />
            <circle cx="18" cy="42" r="0.45" fill="rgba(245,241,232,0.05)" />
            <circle cx="48" cy="48" r="0.3" fill="rgba(107,75,161,0.03)" />
            <circle cx="28" cy="30" r="0.35" fill="rgba(201,162,74,0.04)" />
          </pattern>
        </defs>

        {/* Background layers */}
        <rect x="0" y="0" width="800" height="800" fill="url(#bg-vignette)" />
        <rect x="0" y="0" width="800" height="800" fill="url(#parchment-tex)" />

        {/* Decorative outer border */}
        <rect x="15" y="15" width="770" height="770" rx="12" fill="none" stroke="rgba(201,162,74,0.15)" strokeWidth="1.5" />
        <rect x="25" y="25" width="750" height="750" rx="8" fill="none" stroke="rgba(201,162,74,0.08)" strokeWidth="0.7" strokeDasharray="10 6" />

        {/* Mandala rings */}
        <MandalaRings />

        {/* Atmosphere */}
        <AtmosphereParticles />

        {/* Roads */}
        {roads.map(road => (
          <g key={road.key}>
            <path d={road.path} fill="none"
              stroke={road.integrated ? 'rgba(107,196,143,0.45)' : road.lit ? 'rgba(212,175,55,0.40)' : 'rgba(180,170,150,0.14)'}
              strokeWidth={road.lit ? 3 : 1.8}
              strokeDasharray={road.lit ? 'none' : '5 5'}
              strokeLinecap="round"
              style={{ transition: 'stroke 0.5s, stroke-width 0.5s' }}
            />
            {road.lit && (
              <path d={road.path} fill="none"
                stroke={road.integrated ? 'rgba(107,196,143,0.14)' : 'rgba(212,175,55,0.12)'}
                strokeWidth="12" strokeLinecap="round" filter="url(#road-glow)" />
            )}
          </g>
        ))}

        {/* Render: outer first (back), then inner, then center (front) */}
        {outerDistricts.map(d => renderDistrict(d))}
        {innerDistricts.map(d => renderDistrict(d))}
        {centerDistrict && renderDistrict(centerDistrict)}

        {/* Compass */}
        <CompassRose />

        {/* Title cartouche */}
        <g transform="translate(400, 770)" opacity="0.55">
          <line x1="-100" y1="-6" x2="-20" y2="-6" stroke="#C9A24A" strokeWidth="0.6" />
          <line x1="20" y1="-6" x2="100" y2="-6" stroke="#C9A24A" strokeWidth="0.6" />
          <circle cx="-15" cy="-6" r="2" fill="#C9A24A" opacity="0.6" />
          <circle cx="15" cy="-6" r="2" fill="#C9A24A" opacity="0.6" />
          <text x="0" y="0" textAnchor="middle" fill="#D4AF37" fontSize="13" fontWeight="600"
            style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.25em' }}>
            CIDADELA INTERIOR
          </text>
          <line x1="-100" y1="6" x2="-20" y2="6" stroke="#C9A24A" strokeWidth="0.6" />
          <line x1="20" y1="6" x2="100" y2="6" stroke="#C9A24A" strokeWidth="0.6" />
          <circle cx="-15" cy="6" r="2" fill="#C9A24A" opacity="0.6" />
          <circle cx="15" cy="6" r="2" fill="#C9A24A" opacity="0.6" />
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
          <div className="w-3 h-3 rounded-full border-2" style={{ backgroundColor: 'rgba(180,170,150,0.18)', borderColor: 'rgba(180,170,150,0.40)' }} />
          <span className="text-[11px] text-muted-foreground/60">{mode === 'coletivo' ? 'Sem clientes' : 'Não explorado'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full border-2" style={{ backgroundColor: 'rgba(201,162,74,0.30)', borderColor: 'rgba(212,175,55,0.85)' }} />
          <span className="text-[11px] font-medium" style={{ color: '#F5E6B8' }}>{mode === 'coletivo' ? 'Com clientes' : 'Ativo'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full border-2 relative" style={{ backgroundColor: 'rgba(74,178,107,0.30)', borderColor: 'rgba(107,196,143,0.85)' }}>
            <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 6px rgba(107,196,143,0.55)' }} />
          </div>
          <span className="text-[11px] font-medium" style={{ color: '#a8e6c3' }}>Integrado</span>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground/40 text-center italic">
        {mode === 'clinico' ? 'Ferramenta de leitura simbólica. Não substitui julgamento clínico.' : 'Estados indicam o movimento da jornada.'}
      </p>
    </div>
  );
}
