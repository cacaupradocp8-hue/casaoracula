// ============================================
// MANDALA ANUAL — Mandala Simbólica Funcional
// Camadas concêntricas com função clara
// Sem decoração. Sem cronologia. Mapa de consciência.
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
// CAMADAS — cada uma tem FUNÇÃO, COR, TAMANHO
// ============================================
const CAMADAS = {
  MATRIZ: {
    label: 'Matriz',
    funcao: 'Origem simbólica do ciclo',
    cor: '#C9A84C',
    corBg: 'rgba(201,168,76,0.20)',
    corStroke: 'rgba(201,168,76,0.55)',
    icon: '☽◯☾',
    nodeR: 44,
    ringInner: 0,
    ringOuter: 60,
  },
  TRAVESSIA: {
    label: 'Travessia',
    funcao: 'Eixos da jornada anual',
    cor: '#2E5A88',
    corBg: 'rgba(46,90,136,0.18)',
    corStroke: 'rgba(46,90,136,0.50)',
    icon: '◈',
    nodeR: 32,
    ringInner: 65,
    ringOuter: 160,
  },
  PORTA: {
    label: 'Porta',
    funcao: 'Aberturas de experiência',
    cor: '#3A7D5C',
    corBg: 'rgba(58,125,92,0.16)',
    corStroke: 'rgba(58,125,92,0.45)',
    icon: '🗝',
    nodeR: 24,
    ringInner: 165,
    ringOuter: 255,
  },
  PONTE: {
    label: 'Ponte',
    funcao: 'Integração prática',
    cor: '#9B7EC8',
    corBg: 'rgba(155,126,200,0.14)',
    corStroke: 'rgba(155,126,200,0.40)',
    icon: '⌒',
    nodeR: 18,
    ringInner: 260,
    ringOuter: 325,
  },
  FUNDACAO: {
    label: 'Fundação',
    funcao: 'Base teórica do método',
    cor: '#78716C',
    corBg: 'rgba(120,113,108,0.10)',
    corStroke: 'rgba(120,113,108,0.40)',
    icon: '⊞',
    nodeR: 14,
    ringInner: 0,
    ringOuter: 0,
  },
} as const;

type CamadaKey = keyof typeof CAMADAS;

const SIZE = 720;
const CX = SIZE / 2;
const CY = SIZE / 2;

function polarXY(angleDeg: number, r: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

// ============================================
// Position computation — pure functional
// ============================================
function computePositions(cycleBooks: CycleBook[], links: BookLink[]) {
  const positions = new Map<string, { x: number; y: number }>();
  const cardinals = [270, 0, 90, 180]; // S, L, N, O — qualidade, não cronologia

  // MATRIZ → centro absoluto
  cycleBooks.filter(cb => cb.layer === 'MATRIZ').forEach(cb => {
    if (cb.book) positions.set(cb.book.id, { x: CX, y: CY });
  });

  // TRAVESSIAS → cruz simbólica
  const travessias = cycleBooks.filter(cb => cb.layer === 'TRAVESSIA').sort((a, b) => a.layer_order - b.layer_order);
  const midT = (CAMADAS.TRAVESSIA.ringInner + CAMADAS.TRAVESSIA.ringOuter) / 2;
  travessias.forEach((cb, i) => {
    if (cb.book) positions.set(cb.book.id, polarXY(cardinals[i % 4], midT));
  });

  // Build parent maps from links
  const portaParent = new Map<string, string>();
  const ponteParent = new Map<string, string>();
  const travIds = new Set(travessias.map(cb => cb.book?.id).filter(Boolean));

  links.forEach(link => {
    if (link.link_type === 'ABRE' && travIds.has(link.from_book_id))
      portaParent.set(link.to_book_id, link.from_book_id);
    if (link.link_type === 'INTEGRA' && travIds.has(link.from_book_id))
      ponteParent.set(link.to_book_id, link.from_book_id);
  });

  // Helper: group children by parent
  const groupByParent = (items: CycleBook[], parentMap: Map<string, string>) => {
    const g = new Map<string, CycleBook[]>();
    items.forEach(cb => {
      if (!cb.book) return;
      const p = parentMap.get(cb.book.id);
      if (p) { if (!g.has(p)) g.set(p, []); g.get(p)!.push(cb); }
    });
    return g;
  };

  // PORTAS → anel 2, próximas da Travessia que as ABRE
  const portas = cycleBooks.filter(cb => cb.layer === 'PORTA').sort((a, b) => a.layer_order - b.layer_order);
  const portasByParent = groupByParent(portas, portaParent);
  const midP = (CAMADAS.PORTA.ringInner + CAMADAS.PORTA.ringOuter) / 2;

  travessias.forEach((tCb, tIdx) => {
    if (!tCb.book) return;
    const children = portasByParent.get(tCb.book.id) || [];
    const base = cardinals[tIdx % 4];
    const spread = 26;
    children.forEach((cb, i) => {
      if (!cb.book) return;
      const offset = children.length === 1 ? 0 : (i - (children.length - 1) / 2) * spread;
      positions.set(cb.book.id, polarXY(base + offset, midP));
    });
  });

  // PONTES → anel 3, próximas da Travessia que as INTEGRA
  const pontes = cycleBooks.filter(cb => cb.layer === 'PONTE').sort((a, b) => a.layer_order - b.layer_order);
  const pontesByParent = groupByParent(pontes, ponteParent);
  const midB = (CAMADAS.PONTE.ringInner + CAMADAS.PONTE.ringOuter) / 2;

  travessias.forEach((tCb, tIdx) => {
    if (!tCb.book) return;
    const children = pontesByParent.get(tCb.book.id) || [];
    const base = cardinals[tIdx % 4];
    const spread = 20;
    children.forEach((cb, i) => {
      if (!cb.book) return;
      const offset = children.length === 1 ? 0 : (i - (children.length - 1) / 2) * spread;
      positions.set(cb.book.id, polarXY(base + offset, midB));
    });
  });

  return positions;
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
        <p className="text-xs text-muted-foreground italic" style={{ color: cam.cor }}>{cam.funcao}</p>
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
// MANDALA — Componente Principal
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

  // Conexões
  const conexoes = (links || [])
    .filter(l => ['ABRE', 'INTEGRA', 'SUPORTA'].includes(l.link_type))
    .map(link => {
      const from = positions.get(link.from_book_id);
      const to = positions.get(link.to_book_id);
      if (!from || !to) return null;
      const toCb = cycleBooks.find(cb => cb.book_id === link.to_book_id);
      const toLayer = (toCb?.layer || 'PORTA') as CamadaKey;
      return { from, to, cor: CAMADAS[toLayer]?.cor || '#666', tipo: link.link_type };
    })
    .filter(Boolean) as { from: { x: number; y: number }; to: { x: number; y: number }; cor: string; tipo: string }[];

  const fundacao = cycleBooks.filter(cb => cb.layer === 'FUNDACAO');
  const mandalaBooks = cycleBooks.filter(cb => cb.layer !== 'FUNDACAO');

  // Render a book node
  const renderNode = (cb: CycleBook) => {
    const book = cb.book;
    if (!book) return null;
    const pos = positions.get(book.id);
    if (!pos) return null;
    const key = (cb.layer || book.category) as CamadaKey;
    const cam = CAMADAS[key] || CAMADAS.PORTA;
    const r = cam.nodeR;
    const isMatriz = key === 'MATRIZ';
    const hovered = hoveredId === book.id;
    const title = isMatriz ? 'A Deusa Tríplice' : (book.title.length > 18 ? book.title.slice(0, 16) + '…' : book.title);

    return (
      <g
        key={book.id}
        className="cursor-pointer"
        onClick={() => setSelectedBook(book)}
        onMouseEnter={() => setHoveredId(book.id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        {/* MATRIZ — pulso contínuo */}
        {isMatriz && (
          <>
            <circle cx={pos.x} cy={pos.y} r={r + 14} fill="none" stroke={cam.cor} strokeWidth={0.8} strokeOpacity={0.1}>
              <animate attributeName="r" values={`${r + 8};${r + 20};${r + 8}`} dur="5s" repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" values="0.05;0.25;0.05" dur="5s" repeatCount="indefinite" />
            </circle>
            <circle cx={pos.x} cy={pos.y} r={r + 6} fill="none" stroke={cam.cor} strokeWidth={0.5} strokeOpacity={0.12}>
              <animate attributeName="r" values={`${r + 4};${r + 10};${r + 4}`} dur="3s" repeatCount="indefinite" />
            </circle>
          </>
        )}

        {/* Hover glow */}
        {hovered && (
          <circle cx={pos.x} cy={pos.y} r={r + 5} fill="none" stroke={cam.cor} strokeWidth={2} strokeOpacity={0.6}>
            <animate attributeName="stroke-opacity" values="0.3;0.7;0.3" dur="1.2s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Nó */}
        <circle cx={pos.x} cy={pos.y} r={r} fill={cam.corBg} stroke={cam.corStroke} strokeWidth={isMatriz ? 2.5 : 1.5} />

        {/* Conteúdo: cover ou ícone */}
        <foreignObject x={pos.x - r + 3} y={pos.y - r + 3} width={(r - 3) * 2} height={(r - 3) * 2}>
          <div className="flex items-center justify-center w-full h-full rounded-full overflow-hidden">
            {book.cover_url ? (
              <img src={book.cover_url} alt="" className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="select-none" style={{ fontSize: r * 0.45, color: cam.cor }}>{cam.icon}</span>
            )}
          </div>
        </foreignObject>

        {/* Título */}
        <foreignObject x={pos.x - 52} y={pos.y + r + 3} width={104} height={isMatriz ? 36 : 28}>
          <div className="text-center leading-tight">
            <span className="font-semibold line-clamp-2 drop-shadow-sm" style={{ fontSize: isMatriz ? 9 : 7, color: cam.cor }}>{title}</span>
          </div>
        </foreignObject>

        {/* Tooltip */}
        {hovered && (
          <foreignObject x={pos.x - 100} y={pos.y - r - 48} width={200} height={44}>
            <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 text-center shadow-xl">
              <p className="text-[10px] text-foreground font-semibold truncate">{book.title}</p>
              <p className="text-[9px] text-muted-foreground">{cam.label} · {book.author}</p>
            </div>
          </foreignObject>
        )}
      </g>
    );
  };

  return (
    <div className="relative">
      {/* Toggle */}
      <div className="flex justify-center gap-2 mb-5">
        <Button variant={viewMode === 'mandala' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('mandala')} className="gap-1.5">
          <Moon className="w-3.5 h-3.5" /> Mandala
        </Button>
        <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('list')} className="gap-1.5">
          <List className="w-3.5 h-3.5" /> Lista por Camada
        </Button>
      </div>

      {viewMode === 'list' ? (
        <LayerListView cycleBooks={cycleBooks} onSelect={setSelectedBook} />
      ) : (
        <>
          <div className="flex justify-center overflow-auto">
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[720px] aspect-square">

              {/* Anéis de camada — preenchidos sutilmente */}
              {(['PONTE', 'PORTA', 'TRAVESSIA', 'MATRIZ'] as CamadaKey[]).map(key => {
                const cam = CAMADAS[key];
                if (!cam.ringOuter) return null;
                return (
                  <g key={key}>
                    <circle cx={CX} cy={CY} r={cam.ringOuter} fill={cam.corBg} stroke={cam.corStroke} strokeWidth={1} strokeOpacity={0.25} />
                    {/* Label do anel */}
                    {key !== 'MATRIZ' && (
                      <text
                        x={CX + cam.ringOuter - 4}
                        y={CY - 6}
                        textAnchor="end"
                        fontSize={7}
                        fill={cam.cor}
                        fillOpacity={0.3}
                        fontWeight="600"
                        letterSpacing="1"
                      >
                        {cam.label.toUpperCase()}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Linhas da cruz simbólica — eixos, não cronologia */}
              {[0, 90, 180, 270].map(angle => {
                const inner = polarXY(angle, CAMADAS.MATRIZ.ringOuter);
                const outer = polarXY(angle, CAMADAS.PONTE.ringOuter);
                return (
                  <line key={angle} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
                    stroke="hsl(var(--muted-foreground))" strokeWidth={0.5} strokeOpacity={0.08}
                    strokeDasharray="4 8" />
                );
              })}

              {/* Conexões */}
              {conexoes.map((c, i) => (
                <line key={i} x1={c.from.x} y1={c.from.y} x2={c.to.x} y2={c.to.y}
                  stroke={c.cor}
                  strokeWidth={c.tipo === 'SUPORTA' ? 1.2 : 0.8}
                  strokeOpacity={c.tipo === 'SUPORTA' ? 0.2 : 0.15}
                  strokeDasharray={c.tipo === 'SUPORTA' ? '3 6' : 'none'} />
              ))}

              {/* Nós — back-to-front: Ponte → Porta → Travessia → Matriz */}
              {mandalaBooks.filter(cb => cb.layer === 'PONTE').map(renderNode)}
              {mandalaBooks.filter(cb => cb.layer === 'PORTA').map(renderNode)}
              {mandalaBooks.filter(cb => cb.layer === 'TRAVESSIA').map(renderNode)}
              {mandalaBooks.filter(cb => cb.layer === 'MATRIZ').map(renderNode)}
            </svg>
          </div>

          {/* Fundação — FORA da mandala */}
          {fundacao.length > 0 && (
            <div className="mt-6 border border-border rounded-lg p-4">
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

      {/* Legenda funcional */}
      <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2">
        {(['MATRIZ', 'TRAVESSIA', 'PORTA', 'PONTE', 'FUNDACAO'] as CamadaKey[]).map(key => {
          const cam = CAMADAS[key];
          return (
            <div key={key} className="flex items-center gap-1.5">
              <span style={{ color: cam.cor }} className="text-sm">{cam.icon}</span>
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
