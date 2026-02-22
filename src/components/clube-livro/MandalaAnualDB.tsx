// ============================================
// MANDALA ANUAL — Database-Driven Symbolic Map
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Lock, X, Key, Columns, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useActiveCycle, useCycleBooks, useBookLinks, type Book, type CycleBook, type BookLink } from '@/hooks/useBooks';

// ============================================
// CATEGORY CONFIG
// ============================================

const CATEGORY_CONFIG: Record<string, { label: string; cor: string; corAccent: string; raio: number; nodeSize: number }> = {
  MATRIZ:    { label: 'Matriz',    cor: 'text-gold',             corAccent: '#D4A843', raio: 0,   nodeSize: 44 },
  TRAVESSIA: { label: 'Travessia', cor: 'text-gold',             corAccent: '#D4A843', raio: 120, nodeSize: 34 },
  PORTA:     { label: 'Porta',     cor: 'text-violet-400',       corAccent: '#8B5CF6', raio: 200, nodeSize: 26 },
  PONTE:     { label: 'Ponte',     cor: 'text-teal-400',         corAccent: '#14B8A6', raio: 260, nodeSize: 20 },
  FUNDACAO:  { label: 'Fundação',  cor: 'text-muted-foreground', corAccent: '#78716C', raio: 0,   nodeSize: 16 },
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  TRAVESSIA: <BookOpen className="w-3 h-3" />,
  PORTA: <Key className="w-3 h-3" />,
  PONTE: <BookOpen className="w-3 h-3" />,
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
      <div className="p-6 space-y-6">
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
          <div className="text-sm text-muted-foreground italic border-l-2 border-gold/30 pl-3">{book.description_short}</div>
        )}
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start gap-2" onClick={() => onNavigate(`/clube-livro/livro/${book.id}`)}>
            <BookOpen className="w-4 h-4" /> Ver Livro
          </Button>
        </div>
      </div>
    </motion.div>
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

  const size = 660;
  const cx = size / 2;
  const cy = size / 2;

  if (loadingCycle || loadingBooks) {
    return <div className="flex justify-center py-16"><span className="text-muted-foreground text-sm animate-pulse">Carregando mandala…</span></div>;
  }

  if (!cycleBooks?.length) {
    return <div className="text-center py-16 text-muted-foreground">Nenhum ciclo encontrado.</div>;
  }

  // Separate by category
  const matriz = cycleBooks.filter(cb => cb.book?.category === 'MATRIZ');
  const travessias = cycleBooks.filter(cb => cb.book?.category === 'TRAVESSIA');
  const portas = cycleBooks.filter(cb => cb.book?.category === 'PORTA');
  const pontes = cycleBooks.filter(cb => cb.book?.category === 'PONTE');
  const fundacao = cycleBooks.filter(cb => cb.book?.category === 'FUNDACAO');

  // Assign angles
  const angleStep = (count: number) => 360 / Math.max(count, 1);

  const getNodePos = (category: string, index: number, total: number) => {
    const config = CATEGORY_CONFIG[category];
    if (!config || config.raio === 0) return null;
    const angle = index * angleStep(total);
    return polarToXY(angle, config.raio, cx, cy);
  };

  // Build link lines (from → to using book_links)
  const linkLines = (links || [])
    .filter(l => l.link_type === 'ABRE' || l.link_type === 'INTEGRA')
    .map(link => {
      const fromCB = cycleBooks.find(cb => cb.book_id === link.from_book_id);
      const toCB = cycleBooks.find(cb => cb.book_id === link.to_book_id);
      if (!fromCB?.book || !toCB?.book) return null;

      const fromCat = fromCB.book.category;
      const toCat = toCB.book.category;
      const fromList = cycleBooks.filter(cb => cb.book?.category === fromCat);
      const toList = cycleBooks.filter(cb => cb.book?.category === toCat);
      const fromIdx = fromList.indexOf(fromCB);
      const toIdx = toList.indexOf(toCB);

      const fromPos = getNodePos(fromCat, fromIdx, fromList.length);
      const toPos = getNodePos(toCat, toIdx, toList.length);
      if (!fromPos || !toPos) return null;

      return { from: fromPos, to: toPos, type: link.link_type, color: CATEGORY_CONFIG[toCat]?.corAccent || '#666' };
    })
    .filter(Boolean);

  const renderNode = (cb: CycleBook, index: number, list: CycleBook[]) => {
    const book = cb.book;
    if (!book) return null;
    const config = CATEGORY_CONFIG[book.category];
    if (!config || config.raio === 0) return null;

    const pos = getNodePos(book.category, index, list.length);
    if (!pos) return null;

    const ns = config.nodeSize;
    const isHovered = hoveredId === book.id;

    return (
      <g
        key={book.id}
        className="cursor-pointer"
        onClick={() => setSelectedBook(book)}
        onMouseEnter={() => setHoveredId(book.id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        {isHovered && <circle cx={pos.x} cy={pos.y} r={ns + 6} fill="none" stroke={config.corAccent} strokeWidth={1} strokeOpacity={0.4} />}
        <circle cx={pos.x} cy={pos.y} r={ns} fill={`${config.corAccent}15`} stroke={`${config.corAccent}50`} strokeWidth={1.2} />
        <foreignObject x={pos.x - ns + 6} y={pos.y - ns + 6} width={(ns - 6) * 2} height={(ns - 6) * 2}>
          <div className="flex items-center justify-center w-full h-full">
            {book.cover_url ? (
              <img src={book.cover_url} alt={book.title} className="rounded-full object-cover" style={{ width: (ns - 8) * 2, height: (ns - 8) * 2 }} />
            ) : (
              <BookOpen className={cn('opacity-60', config.cor)} style={{ width: ns * 0.5, height: ns * 0.5 }} />
            )}
          </div>
        </foreignObject>
        <foreignObject x={pos.x - 48} y={pos.y + ns + 3} width={96} height={32}>
          <div className="text-center">
            <span className="text-[8px] text-foreground/80 leading-tight line-clamp-2 font-medium">{book.title}</span>
          </div>
        </foreignObject>
      </g>
    );
  };

  return (
    <div className="relative">
      {/* SVG Mandala */}
      <div className="flex justify-center">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[660px] aspect-square">
          {/* Orbit rings */}
          {[120, 200, 260].map(r => (
            <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth={0.5} strokeOpacity={0.1} strokeDasharray="3 8" />
          ))}

          {/* Nucleus */}
          <circle cx={cx} cy={cy} r={50} className="fill-gold/5 stroke-gold/20" strokeWidth={2}>
            <animate attributeName="opacity" values="0.6;1;0.6" dur="6s" repeatCount="indefinite" />
          </circle>
          <circle cx={cx} cy={cy} r={36} className="fill-gold/8 stroke-gold/15" strokeWidth={1} />
          <foreignObject x={cx - 28} y={cy - 22} width={56} height={44}>
            <div className="flex flex-col items-center justify-center w-full h-full select-none cursor-pointer" onClick={() => matriz[0]?.book && setSelectedBook(matriz[0].book)}>
              <span className="text-gold text-xl leading-none" style={{ opacity: 0.85 }}>☽◯☾</span>
              <span className="text-gold/60 text-[6px] uppercase tracking-[0.2em] mt-1 font-semibold">Matriz</span>
            </div>
          </foreignObject>

          {/* Link lines */}
          {linkLines.map((l, i) => l && (
            <line key={i} x1={l.from.x} y1={l.from.y} x2={l.to.x} y2={l.to.y} stroke={l.color} strokeWidth={0.8} strokeOpacity={0.18} />
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
              <Card key={cb.book.id} className="cursor-pointer hover:border-gold/40 transition-all" onClick={() => setSelectedBook(cb.book!)}>
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

      {/* Mobile list */}
      <div className="mt-8 space-y-6 md:hidden">
        {(['TRAVESSIA', 'PORTA', 'PONTE'] as const).map(cat => {
          const items = cycleBooks.filter(cb => cb.book?.category === cat);
          if (!items.length) return null;
          const config = CATEGORY_CONFIG[cat];
          return (
            <div key={cat} className="space-y-2">
              <div className={cn('flex items-center gap-2 px-2', config.cor)}>
                {CATEGORY_ICONS[cat]}
                <span className="text-xs font-semibold uppercase tracking-widest">{config.label}</span>
              </div>
              <div className="grid gap-2">
                {items.map(cb => cb.book && (
                  <Card key={cb.book.id} className="cursor-pointer hover:border-gold/40 transition-all" onClick={() => setSelectedBook(cb.book!)}>
                    <CardContent className="p-3 flex items-center gap-3">
                      {cb.book.cover_url ? (
                        <img src={cb.book.cover_url} alt={cb.book.title} className="w-10 h-14 object-cover rounded shadow" />
                      ) : (
                        <div className="w-10 h-14 rounded bg-muted flex items-center justify-center shrink-0">
                          <BookOpen className="w-4 h-4 text-muted-foreground" />
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
