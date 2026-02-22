// ============================================
// MANDALA ANUAL — Database-Driven Symbolic Map
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, Key, Columns, Moon, List, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useActiveCycle, useCycleBooks, useBookLinks, type Book, type CycleBook } from '@/hooks/useBooks';

// ============================================
// CATEGORY CONFIG
// ============================================

const CATEGORY_CONFIG: Record<string, { label: string; iconLabel: string; cor: string; corAccent: string; raio: number; nodeSize: number }> = {
  MATRIZ:    { label: 'Matriz',    iconLabel: '☽◯☾', cor: 'text-amber-400',  corAccent: '#D4A843', raio: 0,   nodeSize: 44 },
  TRAVESSIA: { label: 'Travessia', iconLabel: '◈',   cor: 'text-amber-300',  corAccent: '#D4A843', raio: 120, nodeSize: 32 },
  PORTA:     { label: 'Porta',     iconLabel: '🗝',   cor: 'text-violet-400', corAccent: '#8B5CF6', raio: 200, nodeSize: 24 },
  PONTE:     { label: 'Ponte',     iconLabel: '⌒',   cor: 'text-teal-400',   corAccent: '#14B8A6', raio: 260, nodeSize: 18 },
  FUNDACAO:  { label: 'Fundação',  iconLabel: '⊞',   cor: 'text-muted-foreground', corAccent: '#78716C', raio: 0, nodeSize: 16 },
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  TRAVESSIA: <BookOpen className="w-3 h-3" />,
  PORTA: <Key className="w-3 h-3" />,
  PONTE: <Circle className="w-3 h-3" />,
  FUNDACAO: <Columns className="w-3 h-3" />,
  MATRIZ: <Moon className="w-3 h-3" />,
};

function polarToXY(angleDeg: number, radius: number, cx: number, cy: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

// ============================================
// SIDE PANEL
// ============================================

function BookSidePanel({ book, onClose, onNavigate }: { book: Book; onClose: () => void; onNavigate: (p: string) => void }) {
  const cat = CATEGORY_CONFIG[book.category] || CATEGORY_CONFIG.PORTA;
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      className="fixed inset-y-0 right-0 w-80 max-w-[90vw] z-50 bg-card border-l border-border shadow-2xl overflow-y-auto"
    >
      <div className="p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className={cn('text-xs mb-2', cat.cor)}>{cat.label}</Badge>
            <h3 className="font-display text-lg text-foreground">{book.title}</h3>
            <p className="text-sm text-muted-foreground">{book.author}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button>
        </div>
        {book.cover_url && <img src={book.cover_url} alt={book.title} className="w-full h-48 object-cover rounded-lg shadow-lg" />}
        {book.description_short && (
          <div className="text-sm text-muted-foreground italic border-l-2 border-amber-500/30 pl-3">{book.description_short}</div>
        )}
        {book.manifesto_short && (
          <p className="text-sm text-foreground/80">{book.manifesto_short}</p>
        )}
        <Button variant="outline" className="w-full justify-start gap-2" onClick={() => onNavigate(`/clube-livro/livro/${book.id}`)}>
          <BookOpen className="w-4 h-4" /> Abrir Página do Livro
        </Button>
      </div>
    </motion.div>
  );
}

// ============================================
// LIST VIEW
// ============================================

function LayerListView({ cycleBooks, onSelect }: { cycleBooks: CycleBook[]; onSelect: (b: Book) => void }) {
  const layers: { key: string; label: string }[] = [
    { key: 'MATRIZ', label: 'Matriz' },
    { key: 'TRAVESSIA', label: 'Travessias' },
    { key: 'PORTA', label: 'Portas' },
    { key: 'PONTE', label: 'Pontes' },
    { key: 'FUNDACAO', label: 'Fundação' },
  ];

  return (
    <div className="space-y-6">
      {layers.map(({ key, label }) => {
        const items = cycleBooks.filter(cb => (cb.layer || cb.book?.category) === key);
        if (!items.length) return null;
        const config = CATEGORY_CONFIG[key];
        return (
          <div key={key} className="space-y-2">
            <div className={cn('flex items-center gap-2 px-1', config.cor)}>
              {CATEGORY_ICONS[key]}
              <span className="text-xs font-semibold uppercase tracking-widest">{label}</span>
              <span className="text-xs text-muted-foreground">({items.length})</span>
            </div>
            <div className="grid gap-2">
              {items.map(cb => cb.book && (
                <Card key={cb.book.id} className="cursor-pointer hover:border-amber-500/40 transition-all" onClick={() => onSelect(cb.book!)}>
                  <CardContent className="p-3 flex items-center gap-3">
                    {cb.book.cover_url ? (
                      <img src={cb.book.cover_url} alt={cb.book.title} className="w-10 h-14 object-cover rounded shadow" />
                    ) : (
                      <div className="w-10 h-14 rounded bg-muted flex items-center justify-center shrink-0">
                        {CATEGORY_ICONS[key] || <BookOpen className="w-4 h-4 text-muted-foreground" />}
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
// MANDALA COMPONENT
// ============================================

export function MandalaAnualDB() {
  const navigate = useNavigate();
  const { data: cycle, isLoading: loadingCycle } = useActiveCycle();
  const { data: cycleBooks, isLoading: loadingBooks } = useCycleBooks(cycle?.id);
  const { data: links } = useBookLinks(cycle?.id);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'mandala' | 'list'>('mandala');

  const size = 660;
  const cx = size / 2;
  const cy = size / 2;

  if (loadingCycle || loadingBooks) {
    return <div className="flex justify-center py-16"><span className="text-muted-foreground text-sm animate-pulse">Carregando mandala…</span></div>;
  }

  if (!cycleBooks?.length) {
    return <div className="text-center py-16 text-muted-foreground">Nenhum ciclo encontrado.</div>;
  }

  // Separate by layer (fallback to book.category)
  const getLayer = (cb: CycleBook) => cb.layer || cb.book?.category || '';
  const matriz = cycleBooks.filter(cb => getLayer(cb) === 'MATRIZ');
  const travessias = cycleBooks.filter(cb => getLayer(cb) === 'TRAVESSIA');
  const portas = cycleBooks.filter(cb => getLayer(cb) === 'PORTA');
  const pontes = cycleBooks.filter(cb => getLayer(cb) === 'PONTE');
  const fundacao = cycleBooks.filter(cb => getLayer(cb) === 'FUNDACAO');

  const angleStep = (count: number) => 360 / Math.max(count, 1);

  const getNodePos = (layer: string, index: number, total: number) => {
    const config = CATEGORY_CONFIG[layer];
    if (!config || config.raio === 0) return null;
    const angle = index * angleStep(total);
    return polarToXY(angle, config.raio, cx, cy);
  };

  // Build link lines
  const linkLines = (links || [])
    .filter(l => l.link_type === 'ABRE' || l.link_type === 'INTEGRA')
    .map(link => {
      const fromCB = cycleBooks.find(cb => cb.book_id === link.from_book_id);
      const toCB = cycleBooks.find(cb => cb.book_id === link.to_book_id);
      if (!fromCB?.book || !toCB?.book) return null;

      const fromLayer = getLayer(fromCB);
      const toLayer = getLayer(toCB);
      const fromList = cycleBooks.filter(cb => getLayer(cb) === fromLayer);
      const toList = cycleBooks.filter(cb => getLayer(cb) === toLayer);
      const fromIdx = fromList.indexOf(fromCB);
      const toIdx = toList.indexOf(toCB);

      const fromPos = getNodePos(fromLayer, fromIdx, fromList.length);
      const toPos = getNodePos(toLayer, toIdx, toList.length);
      if (!fromPos || !toPos) return null;

      return { from: fromPos, to: toPos, color: CATEGORY_CONFIG[toLayer]?.corAccent || '#666' };
    })
    .filter(Boolean);

  const renderNode = (cb: CycleBook, index: number, list: CycleBook[]) => {
    const book = cb.book;
    if (!book) return null;
    const layer = getLayer(cb);
    const config = CATEGORY_CONFIG[layer];
    if (!config || config.raio === 0) return null;

    const pos = getNodePos(layer, index, list.length);
    if (!pos) return null;

    const ns = config.nodeSize;
    const isHovered = hoveredId === book.id;
    const tooltipText = `${config.label}: ${book.description_short?.slice(0, 120) || book.title}`;

    return (
      <TooltipProvider key={book.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <g
              className="cursor-pointer"
              onClick={() => setSelectedBook(book)}
              onMouseEnter={() => setHoveredId(book.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {isHovered && <circle cx={pos.x} cy={pos.y} r={ns + 6} fill="none" stroke={config.corAccent} strokeWidth={1} strokeOpacity={0.4} />}
              <circle cx={pos.x} cy={pos.y} r={ns} fill={`${config.corAccent}15`} stroke={`${config.corAccent}50`} strokeWidth={1.2} />
              <foreignObject x={pos.x - ns + 4} y={pos.y - ns + 4} width={(ns - 4) * 2} height={(ns - 4) * 2}>
                <div className="flex items-center justify-center w-full h-full">
                  {book.cover_url ? (
                    <img src={book.cover_url} alt={book.title} className="rounded-full object-cover" style={{ width: (ns - 6) * 2, height: (ns - 6) * 2 }} />
                  ) : (
                    <span className="opacity-60" style={{ fontSize: ns * 0.4 }}>{config.iconLabel}</span>
                  )}
                </div>
              </foreignObject>
              <foreignObject x={pos.x - 50} y={pos.y + ns + 2} width={100} height={30}>
                <div className="text-center">
                  <span className="text-[7px] text-foreground/70 leading-tight line-clamp-2 font-medium">{book.title}</span>
                </div>
              </foreignObject>
            </g>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[200px] text-xs">
            {tooltipText}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="relative">
      {/* View toggle */}
      <div className="flex justify-center gap-2 mb-4">
        <Button
          variant={viewMode === 'mandala' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('mandala')}
          className="gap-1.5"
        >
          <Moon className="w-3.5 h-3.5" /> Mandala
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('list')}
          className="gap-1.5"
        >
          <List className="w-3.5 h-3.5" /> Lista
        </Button>
      </div>

      {viewMode === 'list' ? (
        <LayerListView cycleBooks={cycleBooks} onSelect={setSelectedBook} />
      ) : (
        <>
          {/* SVG Mandala */}
          <div className="flex justify-center">
            <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[660px] aspect-square">
              {/* Orbit rings */}
              {[120, 200, 260].map(r => (
                <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth={0.5} strokeOpacity={0.1} strokeDasharray="3 8" />
              ))}

              {/* Nucleus */}
              <circle cx={cx} cy={cy} r={50} fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeOpacity={0.2}>
                <animate attributeName="stroke-opacity" values="0.1;0.3;0.1" dur="6s" repeatCount="indefinite" />
              </circle>
              <circle cx={cx} cy={cy} r={36} fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth={0.8} strokeOpacity={0.15} />
              <foreignObject x={cx - 30} y={cy - 24} width={60} height={48}>
                <div className="flex flex-col items-center justify-center w-full h-full select-none cursor-pointer" onClick={() => matriz[0]?.book && setSelectedBook(matriz[0].book)}>
                  <span className="text-amber-400 text-xl leading-none" style={{ opacity: 0.85 }}>☽◯☾</span>
                  <span className="text-amber-400/60 text-[6px] uppercase tracking-[0.15em] mt-1 font-semibold">Matriz</span>
                </div>
              </foreignObject>

              {/* Link lines */}
              {linkLines.map((l, i) => l && (
                <line key={i} x1={l.from.x} y1={l.from.y} x2={l.to.x} y2={l.to.y} stroke={l.color} strokeWidth={0.6} strokeOpacity={0.15} />
              ))}

              {/* Nodes */}
              {travessias.map((cb, i) => renderNode(cb, i, travessias))}
              {portas.map((cb, i) => renderNode(cb, i, portas))}
              {pontes.map((cb, i) => renderNode(cb, i, pontes))}
            </svg>
          </div>

          {/* Fundação sidebar */}
          {fundacao.length > 0 && (
            <div className="mt-6 border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                <Columns className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-widest">Fundação do Método</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {fundacao.map(cb => cb.book && (
                  <Card key={cb.book.id} className="cursor-pointer hover:border-amber-500/40 transition-all" onClick={() => setSelectedBook(cb.book!)}>
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className="w-10 h-14 rounded bg-muted flex items-center justify-center shrink-0">
                        <Columns className="w-4 h-4 text-muted-foreground" />
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
      <div className="mt-4 flex flex-wrap justify-center gap-3 text-[10px] text-muted-foreground">
        {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
          <span key={key} className="flex items-center gap-1">
            {CATEGORY_ICONS[key]} <span className={cfg.cor}>{cfg.label}</span>
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
