// ============================================
// MANDALA ANUAL — Nova Mandala Concêntrica
// 100% database-driven, layout do zero
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, Moon, List, Columns } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useActiveCycle, useCycleBooks, useBookLinks, type Book, type CycleBook, type BookLink } from '@/hooks/useBooks';

// ============================================
// LAYER CONFIG — cores institucionais
// ============================================
const LAYER = {
  MATRIZ:    { label: 'Matriz',     color: '#C9A84C', bg: 'rgba(201,168,76,0.12)', stroke: 'rgba(201,168,76,0.5)', icon: '☽◯☾', radius: 0,   nodeR: 38 },
  TRAVESSIA: { label: 'Travessia',  color: '#2E5A88', bg: 'rgba(46,90,136,0.12)',  stroke: 'rgba(46,90,136,0.5)',  icon: '◈',    radius: 130, nodeR: 28 },
  PORTA:     { label: 'Porta',      color: '#3A7D5C', bg: 'rgba(58,125,92,0.12)',  stroke: 'rgba(58,125,92,0.5)',  icon: '🗝',   radius: 215, nodeR: 20 },
  PONTE:     { label: 'Ponte',      color: '#9B7EC8', bg: 'rgba(155,126,200,0.12)', stroke: 'rgba(155,126,200,0.5)', icon: '⌒',  radius: 280, nodeR: 15 },
  FUNDACAO:  { label: 'Fundação',   color: '#78716C', bg: 'rgba(120,113,108,0.12)', stroke: 'rgba(120,113,108,0.5)', icon: '⊞',  radius: 0,   nodeR: 14 },
} as const;

type LayerKey = keyof typeof LAYER;

function polar(angleDeg: number, r: number, cx: number, cy: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// ============================================
// Compute positions from DB data + links
// ============================================
function computePositions(
  cycleBooks: CycleBook[],
  links: BookLink[],
  cx: number,
  cy: number
) {
  const positions = new Map<string, { x: number; y: number }>();

  // Matriz → center
  const matriz = cycleBooks.filter(cb => cb.layer === 'MATRIZ');
  matriz.forEach(cb => {
    if (cb.book) positions.set(cb.book.id, { x: cx, y: cy });
  });

  // Travessias → cardinal cross (N, E, S, W)
  const travessias = cycleBooks.filter(cb => cb.layer === 'TRAVESSIA').sort((a, b) => a.layer_order - b.layer_order);
  const cardinalAngles = [0, 90, 180, 270]; // N, E, S, W
  travessias.forEach((cb, i) => {
    if (!cb.book) return;
    const angle = cardinalAngles[i % 4];
    positions.set(cb.book.id, polar(angle, LAYER.TRAVESSIA.radius, cx, cy));
  });

  // Build travessia-link map: which Portas/Pontes connect to which Travessia
  const travessiaChildren = new Map<string, { portas: string[]; pontes: string[] }>();
  travessias.forEach(cb => {
    if (cb.book) travessiaChildren.set(cb.book.id, { portas: [], pontes: [] });
  });

  // Map: ABRE links → Portas near their Travessia; INTEGRA → Pontes near their Travessia
  const portaParent = new Map<string, string>();
  const ponteParent = new Map<string, string>();

  links.forEach(link => {
    if (link.link_type === 'ABRE') {
      const children = travessiaChildren.get(link.from_book_id);
      if (children) {
        children.portas.push(link.to_book_id);
        portaParent.set(link.to_book_id, link.from_book_id);
      }
    }
    if (link.link_type === 'INTEGRA') {
      const children = travessiaChildren.get(link.from_book_id);
      if (children) {
        children.pontes.push(link.to_book_id);
        ponteParent.set(link.to_book_id, link.from_book_id);
      }
    }
  });

  // Position Portas near their parent Travessia
  const portas = cycleBooks.filter(cb => cb.layer === 'PORTA').sort((a, b) => a.layer_order - b.layer_order);
  // Group portas by parent travessia
  const portasByParent = new Map<string, CycleBook[]>();
  portas.forEach(cb => {
    if (!cb.book) return;
    const parent = portaParent.get(cb.book.id);
    if (parent) {
      if (!portasByParent.has(parent)) portasByParent.set(parent, []);
      portasByParent.get(parent)!.push(cb);
    }
  });

  // For each travessia, spread its portas around it
  travessias.forEach((tCb, tIdx) => {
    if (!tCb.book) return;
    const parentPos = positions.get(tCb.book.id);
    if (!parentPos) return;
    const childPortas = portasByParent.get(tCb.book.id) || [];
    const baseAngle = cardinalAngles[tIdx % 4];
    const spread = 30; // degrees spread around the travessia angle
    childPortas.forEach((cb, i) => {
      if (!cb.book) return;
      const offset = childPortas.length === 1 ? 0 : (i - (childPortas.length - 1) / 2) * spread;
      positions.set(cb.book.id, polar(baseAngle + offset, LAYER.PORTA.radius, cx, cy));
    });
  });

  // Position Pontes near their parent Travessia
  const pontes = cycleBooks.filter(cb => cb.layer === 'PONTE').sort((a, b) => a.layer_order - b.layer_order);
  const pontesByParent = new Map<string, CycleBook[]>();
  pontes.forEach(cb => {
    if (!cb.book) return;
    const parent = ponteParent.get(cb.book.id);
    if (parent) {
      if (!pontesByParent.has(parent)) pontesByParent.set(parent, []);
      pontesByParent.get(parent)!.push(cb);
    }
  });

  travessias.forEach((tCb, tIdx) => {
    if (!tCb.book) return;
    const childPontes = pontesByParent.get(tCb.book.id) || [];
    const baseAngle = cardinalAngles[tIdx % 4];
    const spread = 25;
    childPontes.forEach((cb, i) => {
      if (!cb.book) return;
      const offset = childPontes.length === 1 ? 0 : (i - (childPontes.length - 1) / 2) * spread;
      positions.set(cb.book.id, polar(baseAngle + offset, LAYER.PONTE.radius, cx, cy));
    });
  });

  return positions;
}

// ============================================
// Side Panel
// ============================================
function BookSidePanel({ book, onClose, onNavigate }: { book: Book; onClose: () => void; onNavigate: (p: string) => void }) {
  const layer = LAYER[book.category as LayerKey] || LAYER.PORTA;
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
      className="fixed inset-y-0 right-0 w-80 max-w-[90vw] z-50 bg-card border-l border-border shadow-2xl overflow-y-auto"
    >
      <div className="p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className="text-xs mb-2" style={{ color: layer.color, borderColor: layer.color }}>{layer.label}</Badge>
            <h3 className="font-display text-lg text-foreground">{book.title}</h3>
            <p className="text-sm text-muted-foreground">{book.author}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button>
        </div>
        {book.cover_url && <img src={book.cover_url} alt={book.title} className="w-full h-48 object-cover rounded-lg shadow-lg" />}
        {book.description_short && (
          <div className="text-sm text-muted-foreground italic border-l-2 pl-3" style={{ borderColor: layer.color + '50' }}>{book.description_short}</div>
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
        const cfg = LAYER[key];
        return (
          <div key={key} className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <span style={{ color: cfg.color }} className="text-sm">{cfg.icon}</span>
              <span style={{ color: cfg.color }} className="text-xs font-semibold uppercase tracking-widest">{cfg.label}</span>
              <span className="text-xs text-muted-foreground">({items.length})</span>
            </div>
            <div className="grid gap-2">
              {items.map(cb => cb.book && (
                <Card key={cb.book.id} className="cursor-pointer hover:border-amber-500/40 transition-all" onClick={() => onSelect(cb.book!)}>
                  <CardContent className="p-3 flex items-center gap-3">
                    {cb.book.cover_url ? (
                      <img src={cb.book.cover_url} alt={cb.book.title} className="w-10 h-14 object-cover rounded shadow" />
                    ) : (
                      <div className="w-10 h-14 rounded flex items-center justify-center shrink-0" style={{ background: cfg.bg }}>
                        <span style={{ color: cfg.color }}>{cfg.icon}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-display text-foreground truncate">{cb.book.title}</p>
                      <p className="text-xs text-muted-foreground">{cb.book.author}</p>
                      {cb.book.is_multipolar && <Badge variant="secondary" className="text-[10px] mt-1">Multipolar</Badge>}
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
// MANDALA COMPONENT (NEW FROM SCRATCH)
// ============================================
export function MandalaAnualDB() {
  const navigate = useNavigate();
  const { data: cycle, isLoading: loadingCycle } = useActiveCycle();
  const { data: cycleBooks, isLoading: loadingBooks } = useCycleBooks(cycle?.id);
  const { data: links } = useBookLinks(cycle?.id);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'mandala' | 'list'>('mandala');

  const SIZE = 640;
  const CX = SIZE / 2;
  const CY = SIZE / 2;

  if (loadingCycle || loadingBooks) {
    return <div className="flex justify-center py-16"><span className="text-muted-foreground text-sm animate-pulse">Carregando mandala…</span></div>;
  }
  if (!cycleBooks?.length) {
    return <div className="text-center py-16 text-muted-foreground">Nenhum ciclo encontrado.</div>;
  }

  const positions = computePositions(cycleBooks, links || [], CX, CY);

  // Build connection lines from links (ABRE, INTEGRA, SUPORTA)
  const connectionLines = (links || [])
    .filter(l => ['ABRE', 'INTEGRA', 'SUPORTA'].includes(l.link_type))
    .map(link => {
      const from = positions.get(link.from_book_id);
      const to = positions.get(link.to_book_id);
      if (!from || !to) return null;
      // Find target layer for color
      const toCb = cycleBooks.find(cb => cb.book_id === link.to_book_id);
      const toLayer = (toCb?.layer || 'PORTA') as LayerKey;
      return { from, to, color: LAYER[toLayer]?.color || '#666', type: link.link_type };
    })
    .filter(Boolean) as { from: { x: number; y: number }; to: { x: number; y: number }; color: string; type: string }[];

  // Separate layers
  const fundacao = cycleBooks.filter(cb => cb.layer === 'FUNDACAO');
  const mandalaBooks = cycleBooks.filter(cb => cb.layer !== 'FUNDACAO');

  const renderNode = (cb: CycleBook) => {
    const book = cb.book;
    if (!book) return null;
    const pos = positions.get(book.id);
    if (!pos) return null;
    const layerKey = (cb.layer || book.category) as LayerKey;
    const cfg = LAYER[layerKey] || LAYER.PORTA;
    const r = cfg.nodeR;
    const isHovered = hoveredId === book.id;
    const isMatriz = layerKey === 'MATRIZ';

    // Shorten title for display inside node
    const displayTitle = book.title.length > 18 ? book.title.slice(0, 16) + '…' : book.title;
    const tooltipText = `${cfg.label}: ${book.description_short?.slice(0, 120) || book.title}`;

    return (
      <TooltipProvider key={book.id} delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <g
              className="cursor-pointer"
              onClick={() => setSelectedBook(book)}
              onMouseEnter={() => setHoveredId(book.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Hover glow */}
              {isHovered && (
                <circle cx={pos.x} cy={pos.y} r={r + 6} fill="none" stroke={cfg.color} strokeWidth={1.5} strokeOpacity={0.5} />
              )}
              {/* Matriz pulse */}
              {isMatriz && (
                <circle cx={pos.x} cy={pos.y} r={r + 10} fill="none" stroke={cfg.color} strokeWidth={1} strokeOpacity={0.2}>
                  <animate attributeName="r" values={`${r + 6};${r + 14};${r + 6}`} dur="4s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" values="0.15;0.35;0.15" dur="4s" repeatCount="indefinite" />
                </circle>
              )}
              {/* Node circle */}
              <circle cx={pos.x} cy={pos.y} r={r} fill={cfg.bg} stroke={cfg.stroke} strokeWidth={isMatriz ? 2 : 1.2} />
              {/* Icon/cover inside */}
              <foreignObject x={pos.x - r + 3} y={pos.y - r + 3} width={(r - 3) * 2} height={(r - 3) * 2}>
                <div className="flex items-center justify-center w-full h-full">
                  {book.cover_url ? (
                    <img src={book.cover_url} alt={book.title} className="rounded-full object-cover" style={{ width: (r - 5) * 2, height: (r - 5) * 2 }} />
                  ) : (
                    <span className="select-none" style={{ fontSize: isMatriz ? r * 0.5 : r * 0.45, color: cfg.color, opacity: 0.8 }}>{cfg.icon}</span>
                  )}
                </div>
              </foreignObject>
              {/* Title label below */}
              <foreignObject x={pos.x - 52} y={pos.y + r + 2} width={104} height={isMatriz ? 32 : 26}>
                <div className="text-center leading-tight">
                  <span
                    className="font-medium line-clamp-2"
                    style={{ fontSize: isMatriz ? 8 : 7, color: cfg.color, opacity: 0.9 }}
                  >
                    {isMatriz ? 'A Deusa Tríplice' : displayTitle}
                  </span>
                </div>
              </foreignObject>
            </g>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[220px] text-xs">{tooltipText}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

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
          {/* SVG Mandala */}
          <div className="flex justify-center overflow-auto">
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[640px] aspect-square">
              {/* Orbit rings */}
              {[LAYER.TRAVESSIA.radius, LAYER.PORTA.radius, LAYER.PONTE.radius].map(r => (
                <circle key={r} cx={CX} cy={CY} r={r} fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth={0.5} strokeOpacity={0.08} strokeDasharray="4 10" />
              ))}

              {/* Connection lines */}
              {connectionLines.map((line, i) => (
                <line
                  key={i}
                  x1={line.from.x} y1={line.from.y}
                  x2={line.to.x} y2={line.to.y}
                  stroke={line.color}
                  strokeWidth={line.type === 'SUPORTA' ? 0.8 : 0.6}
                  strokeOpacity={0.2}
                  strokeDasharray={line.type === 'SUPORTA' ? '2 4' : 'none'}
                />
              ))}

              {/* Render nodes back-to-front: Ponte → Porta → Travessia → Matriz */}
              {mandalaBooks.filter(cb => cb.layer === 'PONTE').map(renderNode)}
              {mandalaBooks.filter(cb => cb.layer === 'PORTA').map(renderNode)}
              {mandalaBooks.filter(cb => cb.layer === 'TRAVESSIA').map(renderNode)}
              {mandalaBooks.filter(cb => cb.layer === 'MATRIZ').map(renderNode)}
            </svg>
          </div>

          {/* Fundação sidebar */}
          {fundacao.length > 0 && (
            <div className="mt-6 border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3" style={{ color: LAYER.FUNDACAO.color }}>
                <Columns className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-widest">Fundação do Método</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {fundacao.map(cb => cb.book && (
                  <Card key={cb.book.id} className="cursor-pointer hover:border-amber-500/40 transition-all" onClick={() => setSelectedBook(cb.book!)}>
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className="w-10 h-14 rounded flex items-center justify-center shrink-0" style={{ background: LAYER.FUNDACAO.bg }}>
                        <Columns className="w-4 h-4" style={{ color: LAYER.FUNDACAO.color }} />
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

      {/* Legenda */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-[10px]">
        {(['MATRIZ', 'TRAVESSIA', 'PORTA', 'PONTE', 'FUNDACAO'] as LayerKey[]).map(key => (
          <span key={key} className="flex items-center gap-1">
            <span style={{ color: LAYER[key].color }}>{LAYER[key].icon}</span>
            <span style={{ color: LAYER[key].color }} className="font-medium">{LAYER[key].label}</span>
          </span>
        ))}
      </div>

      {/* Side Panel */}
      <AnimatePresence>
        {selectedBook && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedBook(null)} />
            <BookSidePanel book={selectedBook} onClose={() => setSelectedBook(null)} onNavigate={(p) => { setSelectedBook(null); navigate(p); }} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
