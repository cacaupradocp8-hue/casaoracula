// ============================================
// MANDALA ANUAL — Roda Medicinal Oracular
// Visual de roda com anéis preenchidos, setores,
// ícones simbólicos e livros posicionados
// 100% database-driven
// ============================================

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, Moon, List, Columns } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useActiveCycle, useCycleBooks, useBookLinks, type Book, type CycleBook, type BookLink } from '@/hooks/useBooks';

// ============================================
// CONSTANTS
// ============================================
const SIZE = 720;
const CX = SIZE / 2;
const CY = SIZE / 2;

// Ring radii (inner → outer edge of each ring)
const RINGS = {
  MATRIZ:    { inner: 0,   outer: 58  },
  TRAVESSIA: { inner: 62,  outer: 155 },
  PORTA:     { inner: 160, outer: 250 },
  PONTE:     { inner: 255, outer: 320 },
};

// Quadrant definitions — 4 Jornadas
const QUADRANTS = [
  { key: 'CHAMADO',        label: 'Caminho do Mestre',      element: 'Ar',    bodyLabel: 'Corpo Mental',     startAngle: 225, endAngle: 315, hue: 210 },
  { key: 'RUPTURA',        label: 'Caminho do Guerreiro',   element: 'Terra', bodyLabel: 'Corpo Físico',     startAngle: 315, endAngle: 405, hue: 140 },
  { key: 'REORGANIZACAO',  label: 'Caminho do Curador',     element: 'Água',  bodyLabel: 'Corpo Emocional',  startAngle: 45,  endAngle: 135, hue: 25  },
  { key: 'INTEGRACAO',     label: 'Caminho do Visionário',  element: 'Fogo',  bodyLabel: 'Corpo Espiritual', startAngle: 135, endAngle: 225, hue: 42  },
];

const DIRECTIONS = [
  { label: 'S', angle: 270, x: CX, y: CY - RINGS.PONTE.outer - 18 },
  { label: 'L', angle: 0,   x: CX + RINGS.PONTE.outer + 18, y: CY + 5 },
  { label: 'N', angle: 90,  x: CX, y: CY + RINGS.PONTE.outer + 22 },
  { label: 'O', angle: 180, x: CX - RINGS.PONTE.outer - 18, y: CY + 5 },
];

const LAYER_COLORS = {
  MATRIZ:    { fill: '#C9A84C', text: '#C9A84C', bg: 'rgba(201,168,76,0.25)',  stroke: 'rgba(201,168,76,0.6)' },
  TRAVESSIA: { fill: '#2E5A88', text: '#2E5A88', bg: 'rgba(46,90,136,0.20)',   stroke: 'rgba(46,90,136,0.5)' },
  PORTA:     { fill: '#3A7D5C', text: '#3A7D5C', bg: 'rgba(58,125,92,0.18)',   stroke: 'rgba(58,125,92,0.5)' },
  PONTE:     { fill: '#9B7EC8', text: '#9B7EC8', bg: 'rgba(155,126,200,0.18)', stroke: 'rgba(155,126,200,0.5)' },
  FUNDACAO:  { fill: '#78716C', text: '#78716C', bg: 'rgba(120,113,108,0.12)', stroke: 'rgba(120,113,108,0.5)' },
};

type LayerKey = keyof typeof LAYER_COLORS;

// ============================================
// SVG Helpers
// ============================================
function polarXY(angleDeg: number, r: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function describeArc(startAngle: number, endAngle: number, innerR: number, outerR: number) {
  const s1 = polarXY(startAngle, outerR);
  const e1 = polarXY(endAngle, outerR);
  const s2 = polarXY(endAngle, innerR);
  const e2 = polarXY(startAngle, innerR);
  const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;
  return [
    `M ${s1.x} ${s1.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${e1.x} ${e1.y}`,
    `L ${s2.x} ${s2.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${e2.x} ${e2.y}`,
    `Z`
  ].join(' ');
}

function describeArcPath(startAngle: number, endAngle: number, r: number) {
  const s = polarXY(startAngle, r);
  const e = polarXY(endAngle, r);
  const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
}

// ============================================
// Position books
// ============================================
function computePositions(cycleBooks: CycleBook[], links: BookLink[]) {
  const positions = new Map<string, { x: number; y: number; angle: number }>();
  const cardinalAngles = [270, 0, 90, 180]; // S, L, N, O

  // Matriz → center
  cycleBooks.filter(cb => cb.layer === 'MATRIZ').forEach(cb => {
    if (cb.book) positions.set(cb.book.id, { x: CX, y: CY, angle: 0 });
  });

  // Travessias → cardinal
  const travessias = cycleBooks.filter(cb => cb.layer === 'TRAVESSIA').sort((a, b) => a.layer_order - b.layer_order);
  const midR_T = (RINGS.TRAVESSIA.inner + RINGS.TRAVESSIA.outer) / 2;
  travessias.forEach((cb, i) => {
    if (!cb.book) return;
    const angle = cardinalAngles[i % 4];
    const p = polarXY(angle, midR_T);
    positions.set(cb.book.id, { ...p, angle });
  });

  // Build parent maps
  const portaParent = new Map<string, string>();
  const ponteParent = new Map<string, string>();
  const travIds = new Set(travessias.map(cb => cb.book?.id).filter(Boolean));
  links.forEach(link => {
    if (link.link_type === 'ABRE' && travIds.has(link.from_book_id)) portaParent.set(link.to_book_id, link.from_book_id);
    if (link.link_type === 'INTEGRA' && travIds.has(link.from_book_id)) ponteParent.set(link.to_book_id, link.from_book_id);
  });

  // Group children
  const groupByParent = (items: CycleBook[], parentMap: Map<string, string>) => {
    const grouped = new Map<string, CycleBook[]>();
    items.forEach(cb => {
      if (!cb.book) return;
      const parent = parentMap.get(cb.book.id);
      if (parent) {
        if (!grouped.has(parent)) grouped.set(parent, []);
        grouped.get(parent)!.push(cb);
      }
    });
    return grouped;
  };

  // Portas
  const portas = cycleBooks.filter(cb => cb.layer === 'PORTA').sort((a, b) => a.layer_order - b.layer_order);
  const portasByParent = groupByParent(portas, portaParent);
  const midR_P = (RINGS.PORTA.inner + RINGS.PORTA.outer) / 2;

  travessias.forEach((tCb, tIdx) => {
    if (!tCb.book) return;
    const children = portasByParent.get(tCb.book.id) || [];
    const baseAngle = cardinalAngles[tIdx % 4];
    const spread = 25;
    children.forEach((cb, i) => {
      if (!cb.book) return;
      const offset = children.length === 1 ? 0 : (i - (children.length - 1) / 2) * spread;
      const angle = baseAngle + offset;
      const p = polarXY(angle, midR_P);
      positions.set(cb.book.id, { ...p, angle });
    });
  });

  // Pontes
  const pontes = cycleBooks.filter(cb => cb.layer === 'PONTE').sort((a, b) => a.layer_order - b.layer_order);
  const pontesByParent = groupByParent(pontes, ponteParent);
  const midR_B = (RINGS.PONTE.inner + RINGS.PONTE.outer) / 2;

  travessias.forEach((tCb, tIdx) => {
    if (!tCb.book) return;
    const children = pontesByParent.get(tCb.book.id) || [];
    const baseAngle = cardinalAngles[tIdx % 4];
    const spread = 20;
    children.forEach((cb, i) => {
      if (!cb.book) return;
      const offset = children.length === 1 ? 0 : (i - (children.length - 1) / 2) * spread;
      const angle = baseAngle + offset;
      const p = polarXY(angle, midR_B);
      positions.set(cb.book.id, { ...p, angle });
    });
  });

  return positions;
}

// ============================================
// Book Node Component
// ============================================
function BookNode({
  book, pos, layer, isHovered, onHover, onClick, nodeR
}: {
  book: Book; pos: { x: number; y: number }; layer: LayerKey;
  isHovered: boolean; onHover: (id: string | null) => void;
  onClick: (b: Book) => void; nodeR: number;
}) {
  const col = LAYER_COLORS[layer];
  const isMatriz = layer === 'MATRIZ';
  const title = isMatriz ? 'A Deusa Tríplice' : (book.title.length > 16 ? book.title.slice(0, 14) + '…' : book.title);
  const icon = isMatriz ? '☽◯☾' : layer === 'TRAVESSIA' ? '◈' : layer === 'PORTA' ? '🗝' : '⌒';

  return (
    <g
      className="cursor-pointer"
      onClick={() => onClick(book)}
      onMouseEnter={() => onHover(book.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Glow on hover */}
      {isHovered && (
        <circle cx={pos.x} cy={pos.y} r={nodeR + 5} fill="none" stroke={col.fill} strokeWidth={2} strokeOpacity={0.7}>
          <animate attributeName="stroke-opacity" values="0.4;0.8;0.4" dur="1.5s" repeatCount="indefinite" />
        </circle>
      )}
      {/* Matriz pulse */}
      {isMatriz && (
        <circle cx={pos.x} cy={pos.y} r={nodeR + 10} fill="none" stroke={col.fill} strokeWidth={1} strokeOpacity={0.15}>
          <animate attributeName="r" values={`${nodeR + 6};${nodeR + 16};${nodeR + 6}`} dur="4s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.1;0.3;0.1" dur="4s" repeatCount="indefinite" />
        </circle>
      )}
      {/* Background circle */}
      <circle cx={pos.x} cy={pos.y} r={nodeR} fill={col.bg} stroke={col.stroke} strokeWidth={isMatriz ? 2.5 : 1.5} />
      {/* Cover or icon */}
      <foreignObject x={pos.x - nodeR + 2} y={pos.y - nodeR + 2} width={(nodeR - 2) * 2} height={(nodeR - 2) * 2}>
        <div className="flex items-center justify-center w-full h-full rounded-full overflow-hidden">
          {book.cover_url ? (
            <img src={book.cover_url} alt="" className="w-full h-full object-cover rounded-full" />
          ) : (
            <span className="select-none" style={{ fontSize: nodeR * 0.5, color: col.fill }}>{icon}</span>
          )}
        </div>
      </foreignObject>
      {/* Title */}
      <foreignObject x={pos.x - 50} y={pos.y + nodeR + 2} width={100} height={28}>
        <div className="text-center leading-tight">
          <span className="font-semibold line-clamp-2 drop-shadow-sm" style={{ fontSize: isMatriz ? 9 : 7, color: col.text }}>{title}</span>
        </div>
      </foreignObject>
      {/* Tooltip on hover */}
      {isHovered && (
        <foreignObject x={pos.x - 90} y={pos.y - nodeR - 42} width={180} height={38}>
          <div className="bg-card/95 backdrop-blur border border-border rounded-md px-2 py-1 text-center shadow-lg">
            <p className="text-[9px] text-foreground font-medium truncate">{book.title}</p>
            <p className="text-[8px] text-muted-foreground truncate">{book.author}</p>
          </div>
        </foreignObject>
      )}
    </g>
  );
}

// ============================================
// Side Panel
// ============================================
function BookSidePanel({ book, onClose, onNavigate }: { book: Book; onClose: () => void; onNavigate: (p: string) => void }) {
  const col = LAYER_COLORS[book.category as LayerKey] || LAYER_COLORS.PORTA;
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
      className="fixed inset-y-0 right-0 w-80 max-w-[90vw] z-50 bg-card border-l border-border shadow-2xl overflow-y-auto"
    >
      <div className="p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className="text-xs mb-2" style={{ color: col.fill, borderColor: col.fill }}>{book.category}</Badge>
            <h3 className="font-display text-lg text-foreground">{book.title}</h3>
            <p className="text-sm text-muted-foreground">{book.author}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button>
        </div>
        {book.cover_url && <img src={book.cover_url} alt={book.title} className="w-full h-48 object-cover rounded-lg shadow-lg" />}
        {book.description_short && (
          <div className="text-sm text-muted-foreground italic border-l-2 pl-3" style={{ borderColor: col.fill + '50' }}>{book.description_short}</div>
        )}
        {book.manifesto_short && <p className="text-sm text-foreground/80">{book.manifesto_short}</p>}
        <Button variant="outline" className="w-full justify-start gap-2" onClick={() => onNavigate(`/clube-livro/livro/${book.id}`)}>
          <BookOpen className="w-4 h-4" /> Abrir Página do Livro
        </Button>
      </div>
    </motion.div>
  );
}

// ============================================
// List View
// ============================================
function LayerListView({ cycleBooks, onSelect }: { cycleBooks: CycleBook[]; onSelect: (b: Book) => void }) {
  const layers: LayerKey[] = ['MATRIZ', 'TRAVESSIA', 'PORTA', 'PONTE', 'FUNDACAO'];
  return (
    <div className="space-y-6">
      {layers.map(key => {
        const items = cycleBooks.filter(cb => cb.layer === key);
        if (!items.length) return null;
        const col = LAYER_COLORS[key];
        const icons: Record<string, string> = { MATRIZ: '☽◯☾', TRAVESSIA: '◈', PORTA: '🗝', PONTE: '⌒', FUNDACAO: '⊞' };
        return (
          <div key={key} className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <span style={{ color: col.fill }}>{icons[key]}</span>
              <span style={{ color: col.fill }} className="text-xs font-semibold uppercase tracking-widest">{key}</span>
              <span className="text-xs text-muted-foreground">({items.length})</span>
            </div>
            <div className="grid gap-2">
              {items.map(cb => cb.book && (
                <Card key={cb.book.id} className="cursor-pointer hover:border-amber-500/40 transition-all" onClick={() => onSelect(cb.book!)}>
                  <CardContent className="p-3 flex items-center gap-3">
                    {cb.book.cover_url ? (
                      <img src={cb.book.cover_url} alt="" className="w-10 h-14 object-cover rounded shadow" />
                    ) : (
                      <div className="w-10 h-14 rounded flex items-center justify-center shrink-0" style={{ background: col.bg }}>
                        <span style={{ color: col.fill }}>{icons[key]}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-display text-foreground truncate">{cb.book.title}</p>
                      <p className="text-xs text-muted-foreground">{cb.book.author}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// MAIN MANDALA COMPONENT
// ============================================
export function MandalaAnualDB() {
  const navigate = useNavigate();
  const { data: cycle, isLoading: loadingCycle } = useActiveCycle();
  const { data: cycleBooks, isLoading: loadingBooks } = useCycleBooks(cycle?.id);
  const { data: links } = useBookLinks(cycle?.id);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'mandala' | 'list'>('mandala');

  const positions = useMemo(() => {
    if (!cycleBooks?.length) return new Map();
    return computePositions(cycleBooks, links || []);
  }, [cycleBooks, links]);

  if (loadingCycle || loadingBooks) {
    return <div className="flex justify-center py-16"><span className="text-muted-foreground text-sm animate-pulse">Carregando mandala…</span></div>;
  }
  if (!cycleBooks?.length) {
    return <div className="text-center py-16 text-muted-foreground">Nenhum ciclo encontrado.</div>;
  }

  const connectionLines = (links || [])
    .filter(l => ['ABRE', 'INTEGRA', 'SUPORTA'].includes(l.link_type))
    .map(link => {
      const from = positions.get(link.from_book_id);
      const to = positions.get(link.to_book_id);
      if (!from || !to) return null;
      const toCb = cycleBooks.find(cb => cb.book_id === link.to_book_id);
      const toLayer = (toCb?.layer || 'PORTA') as LayerKey;
      return { from, to, color: LAYER_COLORS[toLayer]?.fill || '#666', type: link.link_type };
    })
    .filter(Boolean) as { from: { x: number; y: number }; to: { x: number; y: number }; color: string; type: string }[];

  const fundacao = cycleBooks.filter(cb => cb.layer === 'FUNDACAO');
  const mandalaBooks = cycleBooks.filter(cb => cb.layer !== 'FUNDACAO');

  const nodeRadii: Record<string, number> = { MATRIZ: 40, TRAVESSIA: 30, PORTA: 22, PONTE: 16 };

  return (
    <div className="relative">
      {/* Toggle */}
      <div className="flex justify-center gap-2 mb-4">
        <Button variant={viewMode === 'mandala' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('mandala')} className="gap-1.5">
          <Moon className="w-3.5 h-3.5" /> Mandala
        </Button>
        <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('list')} className="gap-1.5">
          <List className="w-3.5 h-3.5" /> Lista
        </Button>
      </div>

      {viewMode === 'list' ? (
        <LayerListView cycleBooks={cycleBooks} onSelect={setSelectedBook} />
      ) : (
        <>
          <div className="flex justify-center overflow-auto">
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[720px] aspect-square" style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.15))' }}>
              {/* Quadrant sectors — colored ring segments */}
              {QUADRANTS.map((q) => {
                const rings = [
                  { ...RINGS.TRAVESSIA, opacity: 0.12 },
                  { ...RINGS.PORTA,     opacity: 0.10 },
                  { ...RINGS.PONTE,     opacity: 0.08 },
                ];
                return (
                  <g key={q.key}>
                    {rings.map((ring, ri) => (
                      <path
                        key={ri}
                        d={describeArc(q.startAngle, q.endAngle, ring.inner, ring.outer)}
                        fill={`hsla(${q.hue}, 50%, 50%, ${ring.opacity})`}
                        stroke={`hsla(${q.hue}, 40%, 50%, 0.12)`}
                        strokeWidth={0.5}
                      />
                    ))}
                  </g>
                );
              })}

              {/* Matriz center disc */}
              <circle cx={CX} cy={CY} r={RINGS.MATRIZ.outer} fill="rgba(201,168,76,0.15)" stroke="rgba(201,168,76,0.4)" strokeWidth={2} />

              {/* Ring borders */}
              {[RINGS.TRAVESSIA.inner, RINGS.TRAVESSIA.outer, RINGS.PORTA.outer, RINGS.PONTE.outer].map((r, i) => (
                <circle key={i} cx={CX} cy={CY} r={r} fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth={0.8} strokeOpacity={0.12} />
              ))}

              {/* Cross dividers */}
              {[0, 90, 180, 270].map(angle => {
                const inner = polarXY(angle + 45, RINGS.TRAVESSIA.inner);
                const outer = polarXY(angle + 45, RINGS.PONTE.outer);
                return <line key={angle} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="hsl(var(--muted-foreground))" strokeWidth={0.5} strokeOpacity={0.1} />;
              })}

              {/* Curved quadrant labels */}
              {QUADRANTS.map((q, qi) => {
                const midAngle = (q.startAngle + q.endAngle) / 2;
                const labelR = RINGS.PONTE.outer + 2;
                const pathId = `quad-label-${qi}`;
                // Body label in the middle of the quadrant
                const bodyPos = polarXY(midAngle, (RINGS.PORTA.inner + RINGS.PORTA.outer) / 2);
                const elementPos = polarXY(midAngle, (RINGS.TRAVESSIA.inner + RINGS.TRAVESSIA.outer) / 2 - 5);
                return (
                  <g key={qi}>
                    {/* Curved path for outer label */}
                    <defs>
                      <path id={pathId} d={describeArcPath(q.startAngle + 10, q.endAngle - 10, labelR)} fill="none" />
                    </defs>
                    <text fontSize={8} fill="hsl(var(--muted-foreground))" fillOpacity={0.35} fontWeight="600" letterSpacing="2">
                      <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">{q.label.toUpperCase()}</textPath>
                    </text>
                    {/* Body label */}
                    <text x={bodyPos.x} y={bodyPos.y} textAnchor="middle" fontSize={8} fontWeight="600"
                      fill={`hsla(${q.hue}, 45%, 55%, 0.3)`} dominantBaseline="central">
                      {q.bodyLabel}
                    </text>
                    {/* Element label */}
                    <text x={elementPos.x} y={elementPos.y} textAnchor="middle" fontSize={7}
                      fill={`hsla(${q.hue}, 40%, 50%, 0.2)`} dominantBaseline="central" fontStyle="italic">
                      {q.element}
                    </text>
                  </g>
                );
              })}

              {/* Cardinal directions */}
              {DIRECTIONS.map(d => (
                <text key={d.label} x={d.x} y={d.y} textAnchor="middle" fontSize={16} fontWeight="bold"
                  fill="hsl(var(--muted-foreground))" fillOpacity={0.3} dominantBaseline="central">
                  {d.label}
                </text>
              ))}

              {/* Connection lines */}
              {connectionLines.map((line, i) => (
                <line key={i} x1={line.from.x} y1={line.from.y} x2={line.to.x} y2={line.to.y}
                  stroke={line.color} strokeWidth={line.type === 'SUPORTA' ? 1 : 0.7}
                  strokeOpacity={0.18} strokeDasharray={line.type === 'SUPORTA' ? '3 5' : 'none'} />
              ))}

              {/* Book nodes — back-to-front */}
              {['PONTE', 'PORTA', 'TRAVESSIA', 'MATRIZ'].map(layerName =>
                mandalaBooks
                  .filter(cb => cb.layer === layerName)
                  .map(cb => {
                    if (!cb.book) return null;
                    const pos = positions.get(cb.book.id);
                    if (!pos) return null;
                    return (
                      <BookNode
                        key={cb.book.id}
                        book={cb.book}
                        pos={pos}
                        layer={layerName as LayerKey}
                        isHovered={hoveredId === cb.book.id}
                        onHover={setHoveredId}
                        onClick={setSelectedBook}
                        nodeR={nodeRadii[layerName] || 20}
                      />
                    );
                  })
              )}
            </svg>
          </div>

          {/* Fundação */}
          {fundacao.length > 0 && (
            <div className="mt-6 border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3" style={{ color: LAYER_COLORS.FUNDACAO.fill }}>
                <Columns className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-widest">Fundação do Método</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {fundacao.map(cb => cb.book && (
                  <Card key={cb.book.id} className="cursor-pointer hover:border-amber-500/40 transition-all" onClick={() => setSelectedBook(cb.book!)}>
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className="w-10 h-14 rounded flex items-center justify-center shrink-0" style={{ background: LAYER_COLORS.FUNDACAO.bg }}>
                        <Columns className="w-4 h-4" style={{ color: LAYER_COLORS.FUNDACAO.fill }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-display text-foreground truncate">{cb.book.title}</p>
                        <p className="text-xs text-muted-foreground">{cb.book.author}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-[10px]">
        {(['MATRIZ', 'TRAVESSIA', 'PORTA', 'PONTE', 'FUNDACAO'] as LayerKey[]).map(key => {
          const icons: Record<string, string> = { MATRIZ: '☽◯☾', TRAVESSIA: '◈', PORTA: '🗝', PONTE: '⌒', FUNDACAO: '⊞' };
          return (
            <span key={key} className="flex items-center gap-1">
              <span style={{ color: LAYER_COLORS[key].fill }}>{icons[key]}</span>
              <span style={{ color: LAYER_COLORS[key].fill }} className="font-medium">{key}</span>
            </span>
          );
        })}
      </div>

      {/* Side Panel */}
      <AnimatePresence>
        {selectedBook && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedBook(null)} />
            <BookSidePanel book={selectedBook} onClose={() => setSelectedBook(null)}
              onNavigate={(p) => { setSelectedBook(null); navigate(p); }} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
