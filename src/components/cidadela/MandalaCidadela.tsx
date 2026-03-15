import { useMemo, useState, useRef, useCallback } from 'react';

// ============================================
// CIDADELA INTERIOR — MAPA SAGRADO v4
// Cartografia medieval vibrante da cidade interior
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

const DISTRICT_POSITIONS: Record<number, { x: number; y: number; ring: 'center' | 'inner' | 'outer' }> = {
  11: { x: CX, y: CY, ring: 'center' },
  1:  { x: CX, y: CY - 130, ring: 'inner' },
  2:  { x: CX - 115, y: CY - 65, ring: 'inner' },
  3:  { x: CX + 115, y: CY - 65, ring: 'inner' },
  4:  { x: CX - 115, y: CY + 65, ring: 'inner' },
  6:  { x: CX + 115, y: CY + 65, ring: 'inner' },
  5:  { x: CX, y: CY + 130, ring: 'inner' },
  7:  { x: CX - 220, y: CY - 110, ring: 'outer' },
  8:  { x: CX + 220, y: CY - 110, ring: 'outer' },
  9:  { x: CX - 220, y: CY + 110, ring: 'outer' },
  10: { x: CX + 220, y: CY + 110, ring: 'outer' },
  12: { x: CX, y: CY - 260, ring: 'outer' },
};

const ROADS: { from: number; to: number }[] = [
  { from: 12, to: 1 }, { from: 1, to: 11 }, { from: 1, to: 2 }, { from: 1, to: 3 },
  { from: 2, to: 4 }, { from: 2, to: 7 }, { from: 3, to: 6 }, { from: 3, to: 8 },
  { from: 4, to: 9 }, { from: 4, to: 11 }, { from: 6, to: 10 }, { from: 6, to: 11 },
  { from: 9, to: 5 }, { from: 10, to: 5 }, { from: 5, to: 11 },
  { from: 7, to: 9 }, { from: 8, to: 10 },
];

// ============================================
// PALETA VIBRANTE — visível e elegante
// ============================================
const STATE_STYLES = {
  inativo: {
    fill: 'rgba(180,170,150,0.08)',
    stroke: 'rgba(180,170,150,0.25)',
    icon: 'rgba(180,170,150,0.45)',
    text: 'rgba(200,195,185,0.55)',
    glow: 'transparent',
    building: 'rgba(160,150,130,0.12)',
    wall: 'rgba(180,170,150,0.30)',
    accent: 'rgba(180,170,150,0.20)',
  },
  ativo: {
    fill: 'rgba(201,162,74,0.18)',
    stroke: 'rgba(201,162,74,0.75)',
    icon: '#D4AF37',
    text: '#D4AF37',
    glow: 'rgba(201,162,74,0.25)',
    building: 'rgba(201,162,74,0.15)',
    wall: 'rgba(201,162,74,0.60)',
    accent: '#C9A24A',
  },
  integrado: {
    fill: 'rgba(74,178,107,0.18)',
    stroke: 'rgba(107,196,143,0.75)',
    icon: '#7dd9a0',
    text: '#7dd9a0',
    glow: 'rgba(74,178,107,0.25)',
    building: 'rgba(74,178,107,0.15)',
    wall: 'rgba(107,196,143,0.60)',
    accent: '#6bc48f',
  },
};

// ============================================
// TERRITORY ART — Architectural SVG illustrations
// ============================================
const TERRITORY_ART: Record<number, (s: typeof STATE_STYLES.inativo) => JSX.Element> = {
  // 1 — Portão Norte
  1: (st) => <g>
    <ellipse cx="0" cy="26" rx="44" ry="10" fill={st.building} stroke={st.wall} strokeWidth="1" />
    <rect x="-30" y="-12" width="12" height="40" rx="1.5" fill={st.building} stroke={st.wall} strokeWidth="1.2" />
    <rect x="18" y="-12" width="12" height="40" rx="1.5" fill={st.building} stroke={st.wall} strokeWidth="1.2" />
    {[-30,-26,-22, 18,22,26].map((x,i) => <rect key={i} x={x} y="-17" width="3" height="6" fill={st.building} stroke={st.icon} strokeWidth="0.8" />)}
    <path d="M-18 28 L-18 -2 A18 20 0 0 1 18 -2 L18 28" fill="none" stroke={st.icon} strokeWidth="2" />
    <path d="M-14 28 L-14 2 A14 16 0 0 1 14 2 L14 28" fill="none" stroke={st.icon} strokeWidth="1" opacity="0.6" />
    <polygon points="0,-18 1.5,-14 5,-14 2.5,-11 3.5,-7 0,-10 -3.5,-7 -2.5,-11 -5,-14 -1.5,-14" fill={st.icon} opacity="0.8" />
    {[-8,-3,2,7].map((x,i) => <line key={i} x1={x} y1="28" x2={x} y2="8" stroke={st.icon} strokeWidth="0.6" opacity="0.35" strokeDasharray="2 3"/>)}
    <rect x="-20" y="24" width="40" height="3" rx="0.5" fill={st.building} stroke={st.wall} strokeWidth="0.6"/>
  </g>,

  // 2 — Torres
  2: (st) => <g>
    <ellipse cx="0" cy="28" rx="42" ry="9" fill={st.building} stroke={st.wall} strokeWidth="0.8" />
    <rect x="-32" y="2" width="64" height="26" rx="1" fill={st.building} stroke={st.wall} strokeWidth="1" />
    <rect x="-28" y="-28" width="16" height="56" rx="1.5" fill={st.building} stroke={st.wall} strokeWidth="1.2" />
    {[-28,-24,-20,-16].map((x,i) => <rect key={i} x={x} y="-33" width="3" height="6" fill={st.building} stroke={st.icon} strokeWidth="0.8" />)}
    <path d="M-24 -10 A4 5 0 0 1 -16 -10" fill="none" stroke={st.icon} strokeWidth="1" />
    <rect x="12" y="-28" width="16" height="56" rx="1.5" fill={st.building} stroke={st.wall} strokeWidth="1.2" />
    {[12,16,20,24].map((x,i) => <rect key={i} x={x} y="-33" width="3" height="6" fill={st.building} stroke={st.icon} strokeWidth="0.8" />)}
    <path d="M16 -10 A4 5 0 0 1 24 -10" fill="none" stroke={st.icon} strokeWidth="1" />
    <rect x="-12" y="-14" width="24" height="6" rx="1" fill={st.building} stroke={st.wall} strokeWidth="0.8" />
    <line x1="-20" y1="-33" x2="-20" y2="-42" stroke={st.icon} strokeWidth="1" />
    <path d="M-20 -42 L-12 -39 L-20 -36" fill={st.icon} opacity="0.7" />
  </g>,

  // 3 — Portas
  3: (st) => <g>
    <ellipse cx="0" cy="26" rx="40" ry="9" fill={st.building} stroke={st.wall} strokeWidth="0.8" />
    <rect x="-30" y="-10" width="60" height="38" rx="2" fill={st.building} stroke={st.wall} strokeWidth="1.2" />
    <path d="M-20 28 L-20 -4 A20 24 0 0 1 20 -4 L20 28" fill="none" stroke={st.icon} strokeWidth="2" />
    <path d="M-16 28 L-16 0 A16 20 0 0 1 16 0 L16 28" fill="none" stroke={st.icon} strokeWidth="1" opacity="0.6" />
    <path d="M-5 -20 L0 -26 L5 -20" fill="none" stroke={st.icon} strokeWidth="1.2" />
    <circle cx="0" cy="-18" r="2" fill="none" stroke={st.icon} strokeWidth="1" opacity="0.7" />
    <circle cx="0" cy="8" r="4" fill="none" stroke={st.icon} strokeWidth="1.2" />
    <line x1="0" y1="12" x2="0" y2="22" stroke={st.icon} strokeWidth="1.2" />
    <line x1="-2.5" y1="17" x2="2.5" y2="17" stroke={st.icon} strokeWidth="0.8" />
    <line x1="-2" y1="20" x2="2" y2="20" stroke={st.icon} strokeWidth="0.6" />
    <circle cx="-25" cy="-2" r="3" fill={st.accent} stroke={st.icon} strokeWidth="0.8" />
    <circle cx="25" cy="-2" r="3" fill={st.accent} stroke={st.icon} strokeWidth="0.8" />
  </g>,

  // 4 — Jardim dos Arquétipos
  4: (st) => <g>
    <circle cx="0" cy="0" r="40" fill={st.building} stroke={st.wall} strokeWidth="1.2" />
    <circle cx="0" cy="0" r="34" fill="none" stroke={st.wall} strokeWidth="0.7" strokeDasharray="4 3" />
    <line x1="0" y1="-40" x2="0" y2="40" stroke={st.wall} strokeWidth="0.8" strokeDasharray="3 3" />
    <line x1="-40" y1="0" x2="40" y2="0" stroke={st.wall} strokeWidth="0.8" strokeDasharray="3 3" />
    <rect x="-2.5" y="-4" width="5" height="20" rx="1" fill={st.building} stroke={st.icon} strokeWidth="1.5" />
    <path d="M-2 16 Q-10 22 -16 28" fill="none" stroke={st.icon} strokeWidth="1" opacity="0.5" />
    <path d="M2 16 Q10 22 16 28" fill="none" stroke={st.icon} strokeWidth="1" opacity="0.5" />
    <ellipse cx="0" cy="-12" rx="16" ry="12" fill={st.accent} stroke={st.icon} strokeWidth="1.5" />
    <ellipse cx="-7" cy="-16" rx="9" ry="8" fill="none" stroke={st.icon} strokeWidth="0.8" opacity="0.6" />
    <ellipse cx="7" cy="-16" rx="9" ry="8" fill="none" stroke={st.icon} strokeWidth="0.8" opacity="0.6" />
    {[[-20,12],[-18,-8],[14,-14],[20,8],[-12,22],[16,20]].map(([x,y],i) =>
      <circle key={i} cx={x} cy={y} r={1.5} fill={st.icon} opacity={0.4} />
    )}
  </g>,

  // 5 — Praça do Abalo
  5: (st) => <g>
    <path d="M-38 -20 L38 -22 L40 22 L-36 24 Z" fill={st.building} stroke={st.wall} strokeWidth="1.2" />
    <path d="M-28 -14 L28 -16 L30 14 L-26 16 Z" fill="none" stroke={st.wall} strokeWidth="0.7" strokeDasharray="3 3" />
    <path d="M-6 -22 L-3 -12 L3 -5 L-2 4 L4 14 L0 24" fill="none" stroke={st.icon} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M-3 -12 L-9 -8" fill="none" stroke={st.icon} strokeWidth="1" opacity="0.7" />
    <path d="M3 -5 L8 -2" fill="none" stroke={st.icon} strokeWidth="1" opacity="0.7" />
    <path d="M-2 4 L-7 8" fill="none" stroke={st.icon} strokeWidth="0.8" opacity="0.6" />
    <path d="M4 14 L9 16" fill="none" stroke={st.icon} strokeWidth="0.6" opacity="0.5" />
    {[[-28,-6,5,3],[-24,10,4,3],[22,-8,5,3],[26,10,4,2]].map(([x,y,w,h],i) =>
      <rect key={i} x={x} y={y} width={w} height={h} rx="1" fill={st.building} stroke={st.wall} strokeWidth="0.6" />
    )}
  </g>,

  // 6 — Casa dos Sonhos
  6: (st) => <g>
    <ellipse cx="0" cy="28" rx="42" ry="9" fill={st.building} stroke={st.wall} strokeWidth="0.8" />
    <rect x="-18" y="0" width="36" height="28" rx="1.5" fill={st.building} stroke={st.wall} strokeWidth="1.2" />
    <path d="M-24 0 L0 -24 L24 0" fill={st.building} stroke={st.icon} strokeWidth="1.8" />
    <circle cx="-6" cy="10" r="5" fill={st.accent} stroke={st.icon} strokeWidth="1" />
    <line x1="-6" y1="5" x2="-6" y2="15" stroke={st.icon} strokeWidth="0.6" />
    <line x1="-11" y1="10" x2="-1" y2="10" stroke={st.icon} strokeWidth="0.6" />
    <path d="M7 28 L7 14 A5 5 0 0 1 17 14 L17 28" fill={st.accent} stroke={st.icon} strokeWidth="1" />
    <circle cx="15" cy="20" r="1" fill={st.icon} opacity="0.7" />
    <rect x="10" y="-20" width="5" height="10" fill={st.building} stroke={st.wall} strokeWidth="0.8" />
    <path d="M12.5 -20 Q11 -26 13 -30 Q15 -34 12 -38" fill="none" stroke={st.icon} strokeWidth="0.7" opacity="0.4" />
    <path d="M28 -22 A8 8 0 1 0 28 -6 A6 6 0 1 1 28 -22" fill={st.accent} stroke={st.icon} strokeWidth="1.2" />
    {[[32,-16,1.2],[36,-26,0.8],[-26,-16,1],[24,-32,0.7],[-20,-20,0.8]].map(([x,y,r],i) =>
      <circle key={i} cx={x} cy={y} r={r} fill={st.icon} opacity={0.5} />
    )}
  </g>,

  // 7 — Espelho dos Vínculos
  7: (st) => <g>
    <ellipse cx="0" cy="2" rx="38" ry="32" fill={st.building} stroke={st.wall} strokeWidth="1" />
    <ellipse cx="0" cy="2" rx="30" ry="24" fill="none" stroke={st.wall} strokeWidth="0.6" strokeDasharray="3 4" />
    <ellipse cx="0" cy="-4" rx="10" ry="16" fill={st.accent} stroke={st.icon} strokeWidth="1.8" />
    <ellipse cx="0" cy="-4" rx="7" ry="12" fill="none" stroke={st.icon} strokeWidth="0.8" opacity="0.5" />
    <line x1="0" y1="12" x2="0" y2="22" stroke={st.icon} strokeWidth="1.8" />
    <path d="M-10 22 Q0 18 10 22" fill="none" stroke={st.icon} strokeWidth="1.2" />
    <path d="M-3 -8 L-1 -10 L1 -8" fill="none" stroke={st.icon} strokeWidth="0.7" opacity="0.5" />
    <circle cx="3" cy="-12" r="1.5" fill={st.icon} opacity="0.3" />
    <rect x="-28" y="4" width="10" height="3" rx="1.5" fill={st.building} stroke={st.wall} strokeWidth="0.6" />
    <rect x="18" y="4" width="10" height="3" rx="1.5" fill={st.building} stroke={st.wall} strokeWidth="0.6" />
  </g>,

  // 8 — Forja
  8: (st) => <g>
    <ellipse cx="0" cy="28" rx="42" ry="9" fill={st.building} stroke={st.wall} strokeWidth="0.8" />
    <path d="M-20 28 L-20 -8 A20 14 0 0 1 20 -8 L20 28" fill={st.building} stroke={st.wall} strokeWidth="1.5" />
    <path d="M-12 28 L-12 6 A12 12 0 0 1 12 6 L12 28" fill={st.accent} stroke={st.icon} strokeWidth="1.5" />
    <path d="M-4 6 Q-6 -4 0 -14 Q6 -4 4 6" fill={st.accent} stroke={st.icon} strokeWidth="1.5" />
    <path d="M0 -14 Q-2 -20 0 -24 Q2 -20 0 -14" fill="none" stroke={st.icon} strokeWidth="1" opacity="0.7" />
    <path d="M-7 4 Q-9 -2 -4 -6" fill="none" stroke={st.icon} strokeWidth="0.8" opacity="0.6" />
    <path d="M7 4 Q9 -2 4 -6" fill="none" stroke={st.icon} strokeWidth="0.8" opacity="0.6" />
    <path d="M26 24 L30 16 L38 16 L42 24" fill="none" stroke={st.icon} strokeWidth="1.5" />
    <rect x="29" y="14" width="10" height="3" rx="0.5" fill={st.building} stroke={st.icon} strokeWidth="0.8" />
    <line x1="34" y1="16" x2="34" y2="26" stroke={st.icon} strokeWidth="1" />
    {[[-3,-18,1],[4,-20,0.8],[-6,-14,0.7],[2,-22,0.6],[6,-16,0.5]].map(([x,y,r],i) =>
      <circle key={i} cx={x} cy={y} r={r} fill={st.icon} opacity={0.5} />
    )}
  </g>,

  // 9 — Conselho Interior
  9: (st) => <g>
    <circle cx="0" cy="0" r="38" fill={st.building} stroke={st.wall} strokeWidth="1.2" />
    <circle cx="0" cy="0" r="32" fill="none" stroke={st.wall} strokeWidth="0.6" strokeDasharray="3 3" />
    <circle cx="0" cy="0" r="14" fill="none" stroke={st.icon} strokeWidth="1.5" />
    <circle cx="0" cy="0" r="10" fill="none" stroke={st.icon} strokeWidth="0.7" opacity="0.5" strokeDasharray="2 2" />
    <circle cx="0" cy="0" r="3" fill={st.icon} opacity="0.5" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
      const rad = (a * Math.PI) / 180;
      const x = 22 * Math.cos(rad);
      const y = 22 * Math.sin(rad);
      return <rect key={i} x={x - 3.5} y={y - 2.5} width="7" height="5" rx="2.5" fill={st.accent} stroke={st.icon} strokeWidth="0.8"
        transform={`rotate(${a}, ${x}, ${y})`}/>;
    })}
    {[0, 60, 120, 180, 240, 300].map((a, i) => {
      const rad = (a * Math.PI) / 180;
      return <circle key={i} cx={32 * Math.cos(rad)} cy={32 * Math.sin(rad)} r="3" fill={st.accent} stroke={st.icon} strokeWidth="0.8" />;
    })}
    <path d="M0 -5 Q-1 -7 0 -8 Q1 -7 0 -5" fill={st.icon} opacity="0.6" />
  </g>,

  // 10 — Labirinto
  10: (st) => <g>
    <circle cx="0" cy="0" r="38" fill={st.building} stroke={st.wall} strokeWidth="1" />
    <circle cx="0" cy="0" r="34" fill="none" stroke={st.icon} strokeWidth="1.2" />
    <path d="M0 -34 L0 -26" stroke={st.building} strokeWidth="4" />
    <circle cx="0" cy="0" r="26" fill="none" stroke={st.icon} strokeWidth="1" />
    <path d="M26 0 L18 0" stroke={st.building} strokeWidth="4" />
    <circle cx="0" cy="0" r="18" fill="none" stroke={st.icon} strokeWidth="0.9" />
    <path d="M0 18 L0 10" stroke={st.building} strokeWidth="4" />
    <circle cx="0" cy="0" r="10" fill="none" stroke={st.icon} strokeWidth="0.8" />
    <path d="M-10 0 L-5 0" stroke={st.building} strokeWidth="4" />
    <circle cx="0" cy="0" r="4" fill={st.accent} stroke={st.icon} strokeWidth="1.2" />
    <circle cx="0" cy="0" r="2" fill={st.icon} opacity="0.7" />
    <path d="M0 -40 L0 -36" stroke={st.icon} strokeWidth="1.2" />
    <polygon points="0,-42 -2.5,-38 2.5,-38" fill={st.icon} opacity="0.7" />
  </g>,

  // 11 — Praça da Integração (centro)
  11: (st) => <g>
    <circle cx="0" cy="0" r="60" fill={st.building} stroke={st.wall} strokeWidth="1.5" />
    <circle cx="0" cy="0" r="52" fill="none" stroke={st.wall} strokeWidth="0.8" strokeDasharray="5 4" />
    {Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return <line key={i} x1={20 * Math.cos(a)} y1={20 * Math.sin(a)}
        x2={52 * Math.cos(a)} y2={52 * Math.sin(a)}
        stroke={st.icon} strokeWidth="0.6" opacity="0.5" />;
    })}
    <circle cx="0" cy="0" r="40" fill="none" stroke={st.icon} strokeWidth="0.7" opacity="0.5" />
    <circle cx="0" cy="0" r="28" fill="none" stroke={st.icon} strokeWidth="0.8" opacity="0.6" />
    <circle cx="0" cy="0" r="20" fill="none" stroke={st.icon} strokeWidth="1" />
    <circle cx="0" cy="0" r="10" fill="none" stroke={st.icon} strokeWidth="1.5" />
    <line x1="0" y1="-10" x2="0" y2="10" stroke={st.icon} strokeWidth="0.8" opacity="0.7" />
    <line x1="-10" y1="0" x2="10" y2="0" stroke={st.icon} strokeWidth="0.8" opacity="0.7" />
    <line x1="-7" y1="-7" x2="7" y2="7" stroke={st.icon} strokeWidth="0.5" opacity="0.5" />
    <line x1="7" y1="-7" x2="-7" y2="7" stroke={st.icon} strokeWidth="0.5" opacity="0.5" />
    <circle cx="0" cy="0" r="4" fill={st.icon} opacity="0.6" />
    <circle cx="0" cy="0" r="1.5" fill={st.icon} opacity="0.9" />
    {[0, 90, 180, 270].map((a, i) => {
      const rad = (a * Math.PI) / 180;
      return <g key={i}>
        <circle cx={44 * Math.cos(rad)} cy={44 * Math.sin(rad)} r="4" fill={st.accent} stroke={st.icon} strokeWidth="0.8" />
        <circle cx={44 * Math.cos(rad)} cy={44 * Math.sin(rad)} r="1.5" fill={st.icon} opacity="0.5" />
      </g>;
    })}
  </g>,

  // 12 — Portal de Renascimento
  12: (st) => <g>
    <ellipse cx="0" cy="28" rx="38" ry="8" fill={st.building} stroke={st.wall} strokeWidth="0.8" />
    <path d="M-24 28 L-24 -10 A24 30 0 0 1 24 -10 L24 28" fill={st.building} stroke={st.wall} strokeWidth="1.5" />
    <path d="M-18 28 L-18 -4 A18 24 0 0 1 18 -4 L18 28" fill="none" stroke={st.icon} strokeWidth="2" />
    <path d="M-14 28 L-14 0 A14 18 0 0 1 14 0 L14 28" fill="none" stroke={st.icon} strokeWidth="0.8" opacity="0.5" />
    <path d="M0 20 Q-2 12 -6 4 Q0 10 0 -10 Q0 10 6 4 Q2 12 0 20" fill={st.accent} stroke={st.icon} strokeWidth="1.5" />
    <path d="M0 -10 Q-2 -16 0 -22 Q2 -16 0 -10" fill="none" stroke={st.icon} strokeWidth="1" opacity="0.8" />
    <path d="M-6 4 Q-14 -6 -18 -4" fill="none" stroke={st.icon} strokeWidth="0.8" opacity="0.6" />
    <path d="M6 4 Q14 -6 18 -4" fill="none" stroke={st.icon} strokeWidth="0.8" opacity="0.6" />
    {[[-8,-26],[0,-28],[8,-26],[-4,-30],[4,-30]].map(([x,y],i) =>
      <line key={i} x1={x} y1={y as number} x2={(x as number) * 1.3} y2={(y as number) - 10} stroke={st.icon} strokeWidth="0.7" opacity={0.5} />
    )}
    <rect x="-22" y="24" width="10" height="3" rx="0.5" fill={st.building} stroke={st.wall} strokeWidth="0.5" />
    <rect x="12" y="24" width="10" height="3" rx="0.5" fill={st.building} stroke={st.wall} strokeWidth="0.5" />
  </g>,
};

// ============================================
// ATMOSPHERE PARTICLES
// ============================================
function AtmosphereParticles() {
  const particles = useMemo(
    () => Array.from({ length: 30 }, (_, i) => ({
      id: i,
      cx: 60 + Math.random() * 680,
      cy: 60 + Math.random() * 680,
      r: 0.6 + Math.random() * 1.0,
      dur: 14 + Math.random() * 16,
      delay: Math.random() * 10,
      driftX: (Math.random() - 0.5) * 30,
      driftY: (Math.random() - 0.5) * 30,
      isGold: Math.random() > 0.3,
    })),
    []
  );
  return <>
    {particles.map(p => (
      <circle key={p.id} cx={p.cx} cy={p.cy} r={p.r}
        fill={p.isGold ? '#D4AF37' : '#F5F1E8'} opacity="0">
        <animate attributeName="opacity" values="0;0.25;0.10;0.25;0" dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
        <animate attributeName="cx" values={`${p.cx};${p.cx + p.driftX};${p.cx}`} dur={`${p.dur * 1.2}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
        <animate attributeName="cy" values={`${p.cy};${p.cy + p.driftY};${p.cy}`} dur={`${p.dur * 1.3}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
      </circle>
    ))}
  </>;
}

// ============================================
// CITY WALLS — visíveis e elegantes
// ============================================
function CityWalls() {
  return <g>
    {/* Outer wall — octagonal */}
    <path d="M 400 70 L 600 175 L 670 370 L 600 565 L 400 670 L 200 565 L 130 370 L 200 175 Z"
      fill="none" stroke="#C9A24A" strokeWidth="1.5" strokeDasharray="12 6" opacity="0.30" />
    {/* Inner wall — circle */}
    <circle cx={CX} cy={CY} r="185" fill="none" stroke="#C9A24A" strokeWidth="1" strokeDasharray="8 5" opacity="0.22" />
    {/* Corner towers */}
    {[[400,70],[600,175],[670,370],[600,565],[400,670],[200,565],[130,370],[200,175]].map(([x,y],i) =>
      <g key={i}>
        <circle cx={x} cy={y} r="6" fill="rgba(201,162,74,0.08)" stroke="#C9A24A" strokeWidth="1" opacity="0.35" />
        <circle cx={x} cy={y} r="2.5" fill="#C9A24A" opacity="0.25" />
      </g>
    )}
  </g>;
}

// ============================================
// COMPASS ROSE
// ============================================
function CompassRose() {
  return <g transform="translate(720, 720)" opacity="0.35">
    <line x1="0" y1="-30" x2="0" y2="30" stroke="#C9A24A" strokeWidth="1" />
    <line x1="-30" y1="0" x2="30" y2="0" stroke="#C9A24A" strokeWidth="1" />
    <line x1="-18" y1="-18" x2="18" y2="18" stroke="#C9A24A" strokeWidth="0.5" />
    <line x1="18" y1="-18" x2="-18" y2="18" stroke="#C9A24A" strokeWidth="0.5" />
    <polygon points="0,-30 -4,-18 4,-18" fill="#C9A24A" opacity="0.6" />
    <polygon points="0,30 -3,20 3,20" fill="#C9A24A" opacity="0.3" />
    <circle cx="0" cy="0" r="8" fill="none" stroke="#C9A24A" strokeWidth="0.8" />
    <circle cx="0" cy="0" r="2" fill="#C9A24A" opacity="0.7" />
    <text x="0" y="-36" textAnchor="middle" fill="#C9A24A" fontSize="10" fontWeight="bold"
      style={{ fontFamily: "'Playfair Display', serif" }}>N</text>
  </g>;
}

// ============================================
// ROAD PATH
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

        {/* Territory base glow — sempre visível */}
        <circle cx={pos.x} cy={pos.y} r={isCenter ? 78 : 52}
          fill={st.fill}
          stroke={st.stroke} strokeWidth={isCenter ? 1 : 0.6}
          opacity={isHovered ? 1 : 0.7}
          style={{ transition: 'all 0.3s ease' }} />

        {/* Hover highlight */}
        {isHovered && (
          <circle cx={pos.x} cy={pos.y} r={isCenter ? 80 : 55}
            fill="rgba(201,162,74,0.08)" stroke="rgba(201,162,74,0.25)" strokeWidth="1"
            style={{ transition: 'all 0.3s ease' }} />
        )}

        {/* Selection ring */}
        {isSelected && (
          <circle cx={pos.x} cy={pos.y} r={isCenter ? 82 : 57} fill="none"
            stroke="#D4AF37" strokeWidth="2" strokeDasharray="5 3">
            <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Active glow */}
        {state === 'ativo' && (
          <circle cx={pos.x} cy={pos.y} r={isCenter ? 72 : 50} fill="rgba(201,162,74,0.12)" filter="url(#territory-glow)">
            <animate attributeName="opacity" values="0.5;0.9;0.5" dur="5s" repeatCount="indefinite" />
          </circle>
        )}
        {state === 'integrado' && (
          <circle cx={pos.x} cy={pos.y} r={isCenter ? 72 : 50} fill="rgba(74,178,107,0.12)" filter="url(#territory-glow)">
            <animate attributeName="opacity" values="0.5;0.85;0.5" dur="6s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Center breathing aura */}
        {isCenter && (
          <circle cx={pos.x} cy={pos.y} r="85" fill="url(#center-aura)" opacity="0.6">
            <animate attributeName="r" values="75;90;75" dur="9s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.7;0.4" dur="9s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Territory illustration */}
        <g transform={`translate(${pos.x}, ${pos.y}) scale(${isHovered ? artScale * 1.06 : artScale})`}
          style={{ transition: 'transform 0.35s ease', transformOrigin: '0 0' }}>
          {TERRITORY_ART[d.numero]?.(st)}
        </g>

        {/* Active pulse ring */}
        {state === 'ativo' && !isCenter && (
          <circle cx={pos.x} cy={pos.y} r="48" fill="none"
            stroke={st.stroke} strokeWidth="0.8">
            <animate attributeName="r" values="46;54;46" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0;0.6" dur="4s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Integrated badge */}
        {state === 'integrado' && !isCenter && (
          <g transform={`translate(${pos.x + 36}, ${pos.y - 36})`}>
            <circle r="11" fill="#2d7a4a" stroke="#6bc48f" strokeWidth="1.5" />
            <polyline points="-4,0.5 -1,4 5,-4" fill="none" stroke="#F5F1E8" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {/* Name label */}
        <text x={pos.x} y={pos.y + (isCenter ? 72 : 48)}
          textAnchor="middle" dominantBaseline="central"
          fill={isHovered ? '#F5E6B8' : st.text}
          fontSize={isCenter ? 16 : 12} fontWeight="600"
          style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.04em', transition: 'fill 0.3s' }}>
          {isCenter ? centerLabel : d.nome}
        </text>

        {/* Session count */}
        {mode === 'clinico' && sessCount > 0 && !isCenter && (
          <text x={pos.x} y={pos.y + 60} textAnchor="middle" fill="#C9A24A" fontSize="9" opacity="0.6"
            style={{ fontFamily: "'Inter', sans-serif" }}>
            {sessCount} {sessCount === 1 ? 'sessão' : 'sessões'}
          </text>
        )}
        {mode === 'coletivo' && collective && collective.client_count > 0 && (
          <text x={pos.x} y={pos.y + 60} textAnchor="middle" fill="#C9A24A" fontSize="9" opacity="0.6">
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
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="road-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          <radialGradient id="center-aura">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.30" />
            <stop offset="40%" stopColor="#C9A24A" stopOpacity="0.10" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          <radialGradient id="bg-vignette" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#1a2a3a" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#0E1A24" stopOpacity="0" />
            <stop offset="100%" stopColor="#050a10" stopOpacity="0.20" />
          </radialGradient>

          <pattern id="parchment-tex" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="0.5" fill="rgba(201,162,74,0.06)" />
            <circle cx="38" cy="20" r="0.4" fill="rgba(201,162,74,0.04)" />
            <circle cx="18" cy="42" r="0.45" fill="rgba(245,241,232,0.04)" />
            <circle cx="48" cy="48" r="0.3" fill="rgba(107,75,161,0.03)" />
            <circle cx="28" cy="30" r="0.35" fill="rgba(201,162,74,0.03)" />
          </pattern>
        </defs>

        {/* Background layers */}
        <rect x="0" y="0" width="800" height="800" fill="url(#bg-vignette)" />
        <rect x="0" y="0" width="800" height="800" fill="url(#parchment-tex)" />

        {/* Decorative outer border */}
        <rect x="15" y="15" width="770" height="770" rx="12" fill="none" stroke="rgba(201,162,74,0.12)" strokeWidth="1.5" />
        <rect x="25" y="25" width="750" height="750" rx="8" fill="none" stroke="rgba(201,162,74,0.06)" strokeWidth="0.7" strokeDasharray="10 6" />

        {/* City walls */}
        <CityWalls />

        {/* Atmosphere */}
        <AtmosphereParticles />

        {/* Roads */}
        {roads.map(road => (
          <g key={road.key}>
            <path d={road.path} fill="none"
              stroke={road.integrated ? 'rgba(107,196,143,0.40)' : road.lit ? 'rgba(201,162,74,0.35)' : 'rgba(180,170,150,0.12)'}
              strokeWidth={road.lit ? 3.5 : 2}
              strokeDasharray={road.lit ? 'none' : '6 6'}
              strokeLinecap="round"
              style={{ transition: 'stroke 0.5s, stroke-width 0.5s' }}
            />
            {road.lit && (
              <path d={road.path} fill="none"
                stroke={road.integrated ? 'rgba(107,196,143,0.12)' : 'rgba(201,162,74,0.10)'}
                strokeWidth="12" strokeLinecap="round" filter="url(#road-glow)" />
            )}
          </g>
        ))}

        {/* Render center first, then others */}
        {centerDistrict && renderDistrict(centerDistrict)}
        {otherDistricts.map(d => renderDistrict(d))}

        {/* Compass */}
        <CompassRose />

        {/* Title cartouche */}
        <g transform="translate(400, 770)" opacity="0.50">
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
          <div className="w-3 h-3 rounded-full border-2" style={{ backgroundColor: 'rgba(180,170,150,0.15)', borderColor: 'rgba(180,170,150,0.35)' }} />
          <span className="text-[11px] text-muted-foreground/60">{mode === 'coletivo' ? 'Sem clientes' : 'Não explorado'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full border-2" style={{ backgroundColor: 'rgba(201,162,74,0.25)', borderColor: 'rgba(201,162,74,0.75)' }} />
          <span className="text-[11px] font-medium" style={{ color: '#D4AF37' }}>{mode === 'coletivo' ? 'Com clientes' : 'Ativo'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full border-2 relative" style={{ backgroundColor: 'rgba(74,178,107,0.25)', borderColor: 'rgba(107,196,143,0.75)' }}>
            <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 6px rgba(107,196,143,0.50)' }} />
          </div>
          <span className="text-[11px] font-medium" style={{ color: '#7dd9a0' }}>Integrado</span>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground/40 text-center italic">
        {mode === 'clinico' ? 'Ferramenta de leitura simbólica. Não substitui julgamento clínico.' : 'Estados indicam o movimento da jornada.'}
      </p>
    </div>
  );
}
