// ============================================
// MANDALA ANUAL — Mapa de Consciência
// Design limpo, espaçado, legível
// 100% database-driven
// ============================================

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, Moon, List, Columns } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useActiveCycle, useCycleBooks, useBookLinks, type Book, type CycleBook, type BookLink } from '@/hooks/useBooks';

// ============================================
// CAMADAS — função, cor, raio
// ============================================
const CAMADAS = {
  MATRIZ: {
    label: 'Matriz',
    funcao: 'Origem simbólica',
    cor: '#C9A84C',
    corBg: 'rgba(201,168,76,0.15)',
    corGlow: 'rgba(201,168,76,0.08)',
    icon: '☽◯☾',
  },
  TRAVESSIA: {
    label: 'Travessia',
    funcao: 'Eixos da jornada',
    cor: '#2E5A88',
    corBg: 'rgba(46,90,136,0.12)',
    corGlow: 'rgba(46,90,136,0.06)',
    icon: '◈',
  },
  PORTA: {
    label: 'Porta',
    funcao: 'Experiência',
    cor: '#3A7D5C',
    corBg: 'rgba(58,125,92,0.10)',
    corGlow: 'rgba(58,125,92,0.05)',
    icon: '🗝',
  },
  PONTE: {
    label: 'Ponte',
    funcao: 'Integração',
    cor: '#9B7EC8',
    corBg: 'rgba(155,126,200,0.10)',
    corGlow: 'rgba(155,126,200,0.05)',
    icon: '⌒',
  },
  FUNDACAO: {
    label: 'Fundação',
    funcao: 'Base teórica',
    cor: '#78716C',
    corBg: 'rgba(120,113,108,0.08)',
    corGlow: 'rgba(120,113,108,0.04)',
    icon: '⊞',
  },
} as const;

type CamadaKey = keyof typeof CAMADAS;

// Radii for each ring
const RING = {
  MATRIZ: 0,
  TRAVESSIA: 140,
  PORTA: 250,
  PONTE: 340,
};

// Node sizes
const NODE_SIZE = {
  MATRIZ: 56,
  TRAVESSIA: 40,
  PORTA: 30,
  PONTE: 22,
};

const SIZE = 780;
const CX = SIZE / 2;
const CY = SIZE / 2;

function polarXY(angleDeg: number, r: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

// ============================================
// Position computation
// ============================================
function computePositions(cycleBooks: CycleBook[], links: BookLink[]) {
  const positions = new Map<string, { x: number; y: number; layer: CamadaKey }>();
  const cardinals = [270, 0, 90, 180]; // Top, Right, Bottom, Left

  // MATRIZ → center
  cycleBooks.filter(cb => cb.layer === 'MATRIZ').forEach(cb => {
    if (cb.book) positions.set(cb.book.id, { x: CX, y: CY, layer: 'MATRIZ' });
  });

  // TRAVESSIAS → cardinal cross
  const travessias = cycleBooks.filter(cb => cb.layer === 'TRAVESSIA').sort((a, b) => a.layer_order - b.layer_order);
  travessias.forEach((cb, i) => {
    if (cb.book) positions.set(cb.book.id, { ...polarXY(cardinals[i % 4], RING.TRAVESSIA), layer: 'TRAVESSIA' });
  });

  // Build parent maps
  const travIds = new Set(travessias.map(cb => cb.book?.id).filter(Boolean));
  const portaParent = new Map<string, string>();
  const ponteParent = new Map<string, string>();

  links.forEach(link => {
    if (link.link_type === 'ABRE' && travIds.has(link.from_book_id))
      portaParent.set(link.to_book_id, link.from_book_id);
    if (link.link_type === 'INTEGRA' && travIds.has(link.from_book_id))
      ponteParent.set(link.to_book_id, link.from_book_id);
  });

  const groupByParent = (items: CycleBook[], parentMap: Map<string, string>) => {
    const g = new Map<string, CycleBook[]>();
    items.forEach(cb => {
      if (!cb.book) return;
      const p = parentMap.get(cb.book.id);
      if (p) { if (!g.has(p)) g.set(p, []); g.get(p)!.push(cb); }
    });
    return g;
  };

  // PORTAS → ring 2, clustered near parent Travessia
  const portas = cycleBooks.filter(cb => cb.layer === 'PORTA').sort((a, b) => a.layer_order - b.layer_order);
  const portasByParent = groupByParent(portas, portaParent);

  travessias.forEach((tCb, tIdx) => {
    if (!tCb.book) return;
    const children = portasByParent.get(tCb.book.id) || [];
    const base = cardinals[tIdx % 4];
    const spread = 22;
    children.forEach((cb, i) => {
      if (!cb.book) return;
      const offset = children.length === 1 ? 0 : (i - (children.length - 1) / 2) * spread;
      positions.set(cb.book.id, { ...polarXY(base + offset, RING.PORTA), layer: 'PORTA' });
    });
  });

  // Unlinked portas — distribute evenly
  const unlinkedPortas = portas.filter(cb => cb.book && !positions.has(cb.book.id));
  if (unlinkedPortas.length) {
    const startAngle = 45;
    const step = 360 / Math.max(unlinkedPortas.length, 1);
    unlinkedPortas.forEach((cb, i) => {
      if (cb.book) positions.set(cb.book.id, { ...polarXY(startAngle + i * step, RING.PORTA), layer: 'PORTA' });
    });
  }

  // PONTES → ring 3
  const pontes = cycleBooks.filter(cb => cb.layer === 'PONTE').sort((a, b) => a.layer_order - b.layer_order);
  const pontesByParent = groupByParent(pontes, ponteParent);

  travessias.forEach((tCb, tIdx) => {
    if (!tCb.book) return;
    const children = pontesByParent.get(tCb.book.id) || [];
    const base = cardinals[tIdx % 4];
    const spread = 18;
    children.forEach((cb, i) => {
      if (!cb.book) return;
      const offset = children.length === 1 ? 0 : (i - (children.length - 1) / 2) * spread;
      positions.set(cb.book.id, { ...polarXY(base + offset, RING.PONTE), layer: 'PONTE' });
    });
  });

  // Unlinked pontes
  const unlinkedPontes = pontes.filter(cb => cb.book && !positions.has(cb.book.id));
  if (unlinkedPontes.length) {
    const startAngle = 30;
    const step = 360 / Math.max(unlinkedPontes.length, 1);
    unlinkedPontes.forEach((cb, i) => {
      if (cb.book) positions.set(cb.book.id, { ...polarXY(startAngle + i * step, RING.PONTE), layer: 'PONTE' });
    });
  }

  return positions;
}

// ============================================
// Truncate helper
// ============================================
function truncTitle(title: string, max: number) {
  return title.length > max ? title.slice(0, max - 1) + '…' : title;
}

// ============================================
// Side Panel
// ============================================
function BookSidePanel({ book, onClose, onNavigate }: { book: Book; onClose: () => void; onNavigate: (p: string) => void }) {
  const cam = CAMADAS[book.category as CamadaKey] || CAMADAS.PORTA;
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
      className="fixed inset-y-0 right-0 w-80 max-w-[90vw] z-50 bg-card border-l border-border shadow-2xl overflow-y-auto"
    >
      <div className="p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className="text-xs mb-2" style={{ color: cam.cor, borderColor: cam.cor }}>{cam.label}</Badge>
            <h3 className="font-display text-lg text-foreground">{book.title}</h3>
            <p className="text-sm text-muted-foreground">{book.author}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button>
        </div>
        <p className="text-xs italic" style={{ color: cam.cor }}>{cam.funcao}</p>
        {book.cover_url && <img src={book.cover_url} alt={book.title} className="w-full h-48 object-cover rounded-lg shadow-lg" />}
        {book.description_short && (
          <div className="text-sm text-muted-foreground italic border-l-2 pl-3" style={{ borderColor: cam.cor + '50' }}>{book.description_short}</div>
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
  const ordem: CamadaKey[] = ['MATRIZ', 'TRAVESSIA', 'PORTA', 'PONTE', 'FUNDACAO'];
  return (
    <div className="space-y-6">
      {ordem.map(key => {
        const items = cycleBooks.filter(cb => cb.layer === key);
        if (!items.length) return null;
        const cam = CAMADAS[key];
        return (
          <div key={key} className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <span style={{ color: cam.cor }} className="text-base">{cam.icon}</span>
              <div>
                <span style={{ color: cam.cor }} className="text-xs font-semibold uppercase tracking-widest">{cam.label}</span>
                <span className="text-[10px] text-muted-foreground ml-2">{cam.funcao}</span>
              </div>
            </div>
            <div className="grid gap-2">
              {items.map(cb => cb.book && (
                <Card key={cb.book.id} className="cursor-pointer hover:border-amber-500/40 transition-all" onClick={() => onSelect(cb.book!)}>
                  <CardContent className="p-3 flex items-center gap-3">
                    {cb.book.cover_url ? (
                      <img src={cb.book.cover_url} alt="" className="w-10 h-14 object-cover rounded shadow" />
                    ) : (
                      <div className="w-10 h-14 rounded flex items-center justify-center shrink-0" style={{ background: cam.corBg }}>
                        <span style={{ color: cam.cor }} className="text-lg">{cam.icon}</span>
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
// Direction labels
// ============================================
const DIRECTIONS = [
  { angle: 270, label: 'Norte', sub: 'Consciência' },
  { angle: 0, label: 'Leste', sub: 'Ação' },
  { angle: 90, label: 'Sul', sub: 'Sombra' },
  { angle: 180, label: 'Oeste', sub: 'Mistério' },
];

// ============================================
// MANDALA — Main Component
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
    if (!cycleBooks?.length) return new Map<string, { x: number; y: number; layer: CamadaKey }>();
    return computePositions(cycleBooks, links || []);
  }, [cycleBooks, links]);

  if (loadingCycle || loadingBooks) {
    return <div className="flex justify-center py-16"><span className="text-muted-foreground text-sm animate-pulse">Carregando mandala…</span></div>;
  }
  if (!cycleBooks?.length) {
    return <div className="text-center py-16 text-muted-foreground">Nenhum ciclo encontrado.</div>;
  }

  const fundacao = cycleBooks.filter(cb => cb.layer === 'FUNDACAO');
  const mandalaBooks = cycleBooks.filter(cb => cb.layer !== 'FUNDACAO');

  // Connection lines
  const conexoes = (links || [])
    .filter(l => ['ABRE', 'INTEGRA', 'SUPORTA'].includes(l.link_type))
    .map(link => {
      const from = positions.get(link.from_book_id);
      const to = positions.get(link.to_book_id);
      if (!from || !to) return null;
      const toLayer = to.layer;
      return { from, to, cor: CAMADAS[toLayer]?.cor || '#666', tipo: link.link_type };
    })
    .filter(Boolean) as { from: { x: number; y: number }; to: { x: number; y: number }; cor: string; tipo: string }[];

  return (
    <div className="relative">
      {/* Toggle */}
      <div className="flex justify-center gap-2 mb-6">
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
          <div className="flex justify-center overflow-auto px-2">
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[780px] aspect-square" style={{ minWidth: 320 }}>
              <defs>
                <filter id="glow-gold" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Background rings — clean, subtle */}
              <circle cx={CX} cy={CY} r={RING.PONTE + 30} fill="none" stroke="hsl(var(--border))" strokeWidth={0.5} strokeOpacity={0.15} />
              <circle cx={CX} cy={CY} r={RING.PORTA} fill="none" stroke="hsl(var(--border))" strokeWidth={0.5} strokeOpacity={0.12} strokeDasharray="2 6" />
              <circle cx={CX} cy={CY} r={RING.TRAVESSIA} fill="none" stroke="hsl(var(--border))" strokeWidth={0.5} strokeOpacity={0.12} strokeDasharray="2 6" />

              {/* Direction labels at edges */}
              {DIRECTIONS.map(d => {
                const pos = polarXY(d.angle, RING.PONTE + 55);
                return (
                  <g key={d.label}>
                    <text x={pos.x} y={pos.y - 5} textAnchor="middle" fontSize={9} fill="hsl(var(--muted-foreground))" fillOpacity={0.4} fontWeight="600" letterSpacing="2">
                      {d.label.toUpperCase()}
                    </text>
                    <text x={pos.x} y={pos.y + 7} textAnchor="middle" fontSize={7} fill="hsl(var(--muted-foreground))" fillOpacity={0.25}>
                      {d.sub}
                    </text>
                  </g>
                );
              })}

              {/* Connection lines — very subtle curves */}
              {conexoes.map((c, i) => {
                const mx = (c.from.x + c.to.x) / 2;
                const my = (c.from.y + c.to.y) / 2;
                // Slight curve toward center
                const cx1 = mx + (CX - mx) * 0.25;
                const cy1 = my + (CY - my) * 0.25;
                return (
                  <path
                    key={i}
                    d={`M ${c.from.x} ${c.from.y} Q ${cx1} ${cy1} ${c.to.x} ${c.to.y}`}
                    fill="none"
                    stroke={c.cor}
                    strokeWidth={c.tipo === 'SUPORTA' ? 1.5 : 1}
                    strokeOpacity={c.tipo === 'SUPORTA' ? 0.12 : 0.1}
                    strokeDasharray={c.tipo === 'SUPORTA' ? '4 4' : 'none'}
                  />
                );
              })}

              {/* NODES — render back to front: Ponte → Porta → Travessia → Matriz */}
              {(['PONTE', 'PORTA', 'TRAVESSIA', 'MATRIZ'] as CamadaKey[]).map(layerKey =>
                mandalaBooks
                  .filter(cb => cb.layer === layerKey)
                  .map(cb => {
                    const book = cb.book;
                    if (!book) return null;
                    const pos = positions.get(book.id);
                    if (!pos) return null;
                    const cam = CAMADAS[layerKey];
                    const r = NODE_SIZE[layerKey as keyof typeof NODE_SIZE] || 20;
                    const isMatriz = layerKey === 'MATRIZ';
                    const hovered = hoveredId === book.id;
                    const titleMax = isMatriz ? 22 : layerKey === 'TRAVESSIA' ? 20 : 16;
                    const fontSize = isMatriz ? 10 : layerKey === 'TRAVESSIA' ? 9 : layerKey === 'PORTA' ? 8 : 7;
                    const labelW = isMatriz ? 130 : layerKey === 'TRAVESSIA' ? 120 : 100;

                    return (
                      <g
                        key={book.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedBook(book)}
                        onMouseEnter={() => setHoveredId(book.id)}
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        {/* Matriz pulse */}
                        {isMatriz && (
                          <>
                            <circle cx={pos.x} cy={pos.y} r={r + 18} fill="none" stroke={cam.cor} strokeWidth={1} strokeOpacity={0.06}>
                              <animate attributeName="r" values={`${r + 10};${r + 24};${r + 10}`} dur="6s" repeatCount="indefinite" />
                              <animate attributeName="stroke-opacity" values="0.03;0.15;0.03" dur="6s" repeatCount="indefinite" />
                            </circle>
                            <circle cx={pos.x} cy={pos.y} r={r + 8} fill="none" stroke={cam.cor} strokeWidth={0.5} strokeOpacity={0.08}>
                              <animate attributeName="r" values={`${r + 5};${r + 12};${r + 5}`} dur="4s" repeatCount="indefinite" />
                            </circle>
                          </>
                        )}

                        {/* Hover ring */}
                        {hovered && (
                          <circle cx={pos.x} cy={pos.y} r={r + 4} fill="none" stroke={cam.cor} strokeWidth={2} strokeOpacity={0.5}>
                            <animate attributeName="stroke-opacity" values="0.3;0.6;0.3" dur="1.5s" repeatCount="indefinite" />
                          </circle>
                        )}

                        {/* Main circle */}
                        <circle
                          cx={pos.x} cy={pos.y} r={r}
                          fill={cam.corBg}
                          stroke={cam.cor}
                          strokeWidth={isMatriz ? 2 : 1.2}
                          strokeOpacity={hovered ? 0.8 : 0.4}
                        />

                        {/* Icon inside */}
                        <text
                          x={pos.x} y={pos.y + (isMatriz ? 5 : 3)}
                          textAnchor="middle"
                          fontSize={isMatriz ? 18 : layerKey === 'TRAVESSIA' ? 14 : 11}
                          fill={cam.cor}
                          fillOpacity={0.7}
                          className="select-none pointer-events-none"
                        >
                          {cam.icon}
                        </text>

                        {/* Title below node */}
                        <foreignObject
                          x={pos.x - labelW / 2}
                          y={pos.y + r + 4}
                          width={labelW}
                          height={isMatriz ? 38 : 30}
                        >
                          <div className="text-center leading-tight pointer-events-none">
                            <span
                              className="font-semibold line-clamp-2 drop-shadow-sm"
                              style={{ fontSize, color: cam.cor, display: 'block' }}
                            >
                              {truncTitle(book.title, titleMax)}
                            </span>
                            {(isMatriz || layerKey === 'TRAVESSIA') && (
                              <span
                                className="block mt-0.5"
                                style={{ fontSize: fontSize - 2, color: cam.cor, opacity: 0.5 }}
                              >
                                {truncTitle(book.author || '', 20)}
                              </span>
                            )}
                          </div>
                        </foreignObject>

                        {/* Tooltip on hover */}
                        {hovered && (
                          <foreignObject x={pos.x - 110} y={pos.y - r - 52} width={220} height={48}>
                            <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 text-center shadow-xl">
                              <p className="text-[11px] text-foreground font-semibold truncate">{book.title}</p>
                              <p className="text-[10px] text-muted-foreground">{cam.label} · {book.author}</p>
                            </div>
                          </foreignObject>
                        )}
                      </g>
                    );
                  })
              )}
            </svg>
          </div>

          {/* Fundação — outside mandala */}
          {fundacao.length > 0 && (
            <div className="mt-8 border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3" style={{ color: CAMADAS.FUNDACAO.cor }}>
                <Columns className="w-4 h-4" />
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest">Fundação do Método</span>
                  <span className="text-[10px] text-muted-foreground ml-2">Base teórica e estrutural</span>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {fundacao.map(cb => cb.book && (
                  <Card key={cb.book.id} className="cursor-pointer hover:border-amber-500/40 transition-all" onClick={() => setSelectedBook(cb.book!)}>
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className="w-10 h-14 rounded flex items-center justify-center shrink-0" style={{ background: CAMADAS.FUNDACAO.corBg }}>
                        <Columns className="w-4 h-4" style={{ color: CAMADAS.FUNDACAO.cor }} />
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
      <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2">
        {(['MATRIZ', 'TRAVESSIA', 'PORTA', 'PONTE', 'FUNDACAO'] as CamadaKey[]).map(key => {
          const cam = CAMADAS[key];
          return (
            <div key={key} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: cam.cor, opacity: 0.6 }} />
              <div className="leading-tight">
                <span style={{ color: cam.cor }} className="text-[10px] font-semibold">{cam.label}</span>
                <span className="text-[9px] text-muted-foreground ml-1">{cam.funcao}</span>
              </div>
            </div>
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
