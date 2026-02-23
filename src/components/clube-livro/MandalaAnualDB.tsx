// ============================================
// MANDALA DE JORNADA DE LEITURA
// Arquitetura funcional, zero ruído cognitivo
// A usuária entende: onde está, o que vem, quanto falta
// ============================================

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, ChevronRight, Lock, CheckCircle2, Map, List, Columns, Play, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useActiveCycle, useCycleBooks, useBookLinks, type Book, type CycleBook, type BookLink } from '@/hooks/useBooks';
import { useIsMobile } from '@/hooks/use-mobile';

// ============================================
// LAYER CONFIG
// ============================================
const LAYERS = {
  MATRIZ: { label: 'Matriz', cor: 'hsl(43, 60%, 54%)', bg: 'hsl(43, 60%, 54%, 0.08)', icon: '☽◯☾' },
  TRAVESSIA: { label: 'Travessia', cor: 'hsl(212, 50%, 36%)', bg: 'hsl(212, 50%, 36%, 0.08)', icon: '◈' },
  PORTA: { label: 'Porta', cor: 'hsl(152, 37%, 36%)', bg: 'hsl(152, 37%, 36%, 0.08)', icon: '🗝' },
  PONTE: { label: 'Ponte', cor: 'hsl(268, 38%, 64%)', bg: 'hsl(268, 38%, 64%, 0.08)', icon: '⌒' },
  FUNDACAO: { label: 'Fundação', cor: 'hsl(30, 6%, 45%)', bg: 'hsl(30, 6%, 45%, 0.06)', icon: '⊞' },
} as const;

type LayerKey = keyof typeof LAYERS;

// ============================================
// HELPERS
// ============================================
function getChildBooks(parentBookId: string, links: BookLink[], cycleBooks: CycleBook[], linkType: string) {
  const childIds = links
    .filter(l => l.from_book_id === parentBookId && l.link_type === linkType)
    .map(l => l.to_book_id);
  return cycleBooks
    .filter(cb => cb.book && childIds.includes(cb.book.id))
    .sort((a, b) => a.layer_order - b.layer_order);
}

// ============================================
// MATRIZ — Centro fixo, não clicável
// ============================================
function MatrizBlock({ book }: { book: Book }) {
  return (
    <div className="text-center mb-8">
      <motion.div
        className="mx-auto w-20 h-20 rounded-full flex items-center justify-center border-2 relative"
        style={{ borderColor: LAYERS.MATRIZ.cor, background: LAYERS.MATRIZ.bg }}
        animate={{ boxShadow: ['0 0 20px hsl(43, 60%, 54%, 0.1)', '0 0 40px hsl(43, 60%, 54%, 0.2)', '0 0 20px hsl(43, 60%, 54%, 0.1)'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-2xl select-none" style={{ color: LAYERS.MATRIZ.cor }}>☽◯☾</span>
      </motion.div>
      <p className="text-xs font-semibold mt-3 uppercase tracking-[0.2em]" style={{ color: LAYERS.MATRIZ.cor }}>
        {book.title}
      </p>
      <p className="text-[11px] text-muted-foreground mt-1 max-w-xs mx-auto italic">
        Toda leitura é uma travessia da consciência
      </p>
    </div>
  );
}

// ============================================
// TRAVESSIA CARD — Grande, com progresso
// ============================================
function TravessiaCard({
  book,
  index,
  isActive,
  isCompleted,
  progress,
  onClick,
}: {
  book: Book;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  progress: number; // 0–4
  onClick: () => void;
}) {
  const romanNumerals = ['I', 'II', 'III', 'IV'];
  const progressPct = (progress / 4) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card
        className={`cursor-pointer transition-all duration-300 overflow-hidden ${
          isActive
            ? 'ring-2 ring-offset-2 ring-offset-background'
            : isCompleted
            ? 'opacity-90'
            : 'opacity-40 hover:opacity-60'
        }`}
        style={{
          borderColor: isActive ? LAYERS.TRAVESSIA.cor : isCompleted ? LAYERS.MATRIZ.cor : undefined,
          ...(isActive ? { '--tw-ring-color': LAYERS.TRAVESSIA.cor } as any : {}),
        }}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs font-bold tracking-widest"
                  style={{ color: isActive ? LAYERS.TRAVESSIA.cor : isCompleted ? LAYERS.MATRIZ.cor : 'hsl(var(--muted-foreground))' }}
                >
                  TRAVESSIA {romanNumerals[index]}
                </span>
                {isActive && (
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-current" style={{ color: LAYERS.TRAVESSIA.cor }}>
                    ATIVA
                  </Badge>
                )}
                {isCompleted && (
                  <CheckCircle2 className="w-3.5 h-3.5" style={{ color: LAYERS.MATRIZ.cor }} />
                )}
              </div>
              <h3 className="text-sm font-display text-foreground truncate">{book.title}</h3>
              <p className="text-xs text-muted-foreground truncate">{book.author}</p>
            </div>
            <div className="shrink-0 flex items-center">
              {isActive ? (
                <ChevronRight className="w-5 h-5" style={{ color: LAYERS.TRAVESSIA.cor }} />
              ) : isCompleted ? (
                <CheckCircle2 className="w-5 h-5" style={{ color: LAYERS.MATRIZ.cor }} />
              ) : (
                <Lock className="w-4 h-4 text-muted-foreground/40" />
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-muted-foreground">Progresso</span>
              <span className="text-[10px] font-medium" style={{ color: isActive ? LAYERS.TRAVESSIA.cor : 'hsl(var(--muted-foreground))' }}>
                {progress}/4 semanas
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: isCompleted ? LAYERS.MATRIZ.cor : LAYERS.TRAVESSIA.cor }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            {/* Week dots */}
            <div className="flex gap-1.5 mt-2">
              {[0, 1, 2, 3].map(w => (
                <div
                  key={w}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{
                    background: w < progress
                      ? (isCompleted ? LAYERS.MATRIZ.cor : LAYERS.TRAVESSIA.cor)
                      : 'hsl(var(--muted))',
                    opacity: w < progress ? 1 : 0.4,
                  }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================
// PORTA ITEM — Médio, com estado
// ============================================
function PortaItem({
  book,
  isUnlocked,
  onClick,
}: {
  book: Book;
  isUnlocked: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
        isUnlocked
          ? 'border-border hover:border-[hsl(152,37%,36%,0.5)] bg-card'
          : 'border-transparent opacity-40 cursor-default bg-muted/30'
      }`}
      onClick={isUnlocked ? onClick : undefined}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
        style={{ background: LAYERS.PORTA.bg, color: LAYERS.PORTA.cor }}
      >
        {isUnlocked ? <span className="text-sm">🗝</span> : <Lock className="w-3.5 h-3.5" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground truncate">{book.title}</p>
        <p className="text-xs text-muted-foreground truncate">{book.author}</p>
      </div>
      {isUnlocked && <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
    </motion.div>
  );
}

// ============================================
// PONTE ITEM — Micro-ações
// ============================================
function PonteItem({ book, onClick }: { book: Book; onClick: () => void }) {
  const icons = [Play, MessageCircle, Sparkles];
  const Icon = icons[Math.abs(book.title.length) % icons.length];

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2 px-3 py-2 rounded-md border border-border/50 hover:border-[hsl(268,38%,64%,0.4)] bg-card/50 transition-all text-left"
      onClick={onClick}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: LAYERS.PONTE.cor }} />
      <span className="text-xs text-foreground truncate">{book.title}</span>
    </motion.button>
  );
}

// ============================================
// DETAIL PANEL
// ============================================
function DetailPanel({ book, onClose, onNavigate }: { book: Book; onClose: () => void; onNavigate: (p: string) => void }) {
  const layer = LAYERS[book.category as LayerKey] || LAYERS.PORTA;
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
      className="fixed inset-y-0 right-0 w-80 max-w-[90vw] z-50 bg-card border-l border-border shadow-2xl overflow-y-auto"
    >
      <div className="p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className="text-xs mb-2" style={{ color: layer.cor, borderColor: layer.cor }}>
              {layer.label}
            </Badge>
            <h3 className="font-display text-lg text-foreground">{book.title}</h3>
            <p className="text-sm text-muted-foreground">{book.author}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button>
        </div>
        {book.cover_url && (
          <img src={book.cover_url} alt={book.title} className="w-full h-48 object-cover rounded-lg shadow-lg" />
        )}
        {book.description_short && (
          <div className="text-sm text-muted-foreground italic border-l-2 pl-3" style={{ borderColor: `${layer.cor}50` }}>
            {book.description_short}
          </div>
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
// LIST VIEW
// ============================================
function ListView({ cycleBooks, links, onSelect }: { cycleBooks: CycleBook[]; links: BookLink[]; onSelect: (b: Book) => void }) {
  const travessias = cycleBooks.filter(cb => cb.layer === 'TRAVESSIA').sort((a, b) => a.layer_order - b.layer_order);

  return (
    <div className="space-y-6">
      {travessias.map((tCb, i) => {
        if (!tCb.book) return null;
        const portas = getChildBooks(tCb.book.id, links, cycleBooks, 'ABRE');
        const pontes = getChildBooks(tCb.book.id, links, cycleBooks, 'INTEGRA');
        const romanNumerals = ['I', 'II', 'III', 'IV'];

        return (
          <div key={tCb.id} className="space-y-2">
            <div
              className="flex items-center gap-2 px-1 cursor-pointer hover:opacity-80"
              onClick={() => onSelect(tCb.book!)}
            >
              <span className="text-base" style={{ color: LAYERS.TRAVESSIA.cor }}>◈</span>
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: LAYERS.TRAVESSIA.cor }}>
                  Travessia {romanNumerals[i]}
                </span>
                <span className="text-sm text-foreground ml-2">{tCb.book.title}</span>
              </div>
            </div>

            {portas.length > 0 && (
              <div className="ml-6 space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Portas</span>
                {portas.map(pCb => pCb.book && (
                  <div
                    key={pCb.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-muted/50"
                    onClick={() => onSelect(pCb.book!)}
                  >
                    <span className="text-xs" style={{ color: LAYERS.PORTA.cor }}>🗝</span>
                    <span className="text-sm text-foreground truncate">{pCb.book.title}</span>
                  </div>
                ))}
              </div>
            )}

            {pontes.length > 0 && (
              <div className="ml-6 space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Pontes</span>
                {pontes.map(bCb => bCb.book && (
                  <div
                    key={bCb.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-muted/50"
                    onClick={() => onSelect(bCb.book!)}
                  >
                    <span className="text-xs" style={{ color: LAYERS.PONTE.cor }}>⌒</span>
                    <span className="text-sm text-foreground truncate">{bCb.book.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export function MandalaAnualDB() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { data: cycle, isLoading: loadingCycle } = useActiveCycle();
  const { data: cycleBooks, isLoading: loadingBooks } = useCycleBooks(cycle?.id);
  const { data: links } = useBookLinks(cycle?.id);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [activeTravessiaId, setActiveTravessiaId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  // Organize data
  const { matriz, travessias, fundacao } = useMemo(() => {
    if (!cycleBooks?.length) return { matriz: null, travessias: [], fundacao: [] };
    const m = cycleBooks.find(cb => cb.layer === 'MATRIZ');
    const t = cycleBooks.filter(cb => cb.layer === 'TRAVESSIA').sort((a, b) => a.layer_order - b.layer_order);
    const f = cycleBooks.filter(cb => cb.layer === 'FUNDACAO');
    return { matriz: m, travessias: t, fundacao: f };
  }, [cycleBooks]);

  // Auto-select first travessia as active
  const activeId = activeTravessiaId || travessias[0]?.book?.id || null;

  // Get children of active travessia
  const activePortas = useMemo(() => {
    if (!activeId || !links || !cycleBooks) return [];
    return getChildBooks(activeId, links, cycleBooks, 'ABRE');
  }, [activeId, links, cycleBooks]);

  const activePontes = useMemo(() => {
    if (!activeId || !links || !cycleBooks) return [];
    return getChildBooks(activeId, links, cycleBooks, 'INTEGRA');
  }, [activeId, links, cycleBooks]);

  if (loadingCycle || loadingBooks) {
    return <div className="flex justify-center py-16"><span className="text-muted-foreground text-sm animate-pulse">Carregando jornada…</span></div>;
  }
  if (!cycleBooks?.length) {
    return <div className="text-center py-16 text-muted-foreground">Nenhum ciclo encontrado.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Toggle: Mapa | Lista */}
      <div className="flex justify-center gap-1 p-1 bg-muted/50 rounded-lg w-fit mx-auto">
        <Button
          variant={viewMode === 'map' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('map')}
          className="gap-1.5 text-xs h-8"
        >
          <Map className="w-3.5 h-3.5" /> Mapa
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('list')}
          className="gap-1.5 text-xs h-8"
        >
          <List className="w-3.5 h-3.5" /> Lista
        </Button>
      </div>

      {viewMode === 'list' ? (
        <ListView cycleBooks={cycleBooks} links={links || []} onSelect={setSelectedBook} />
      ) : (
        <div className="space-y-8">
          {/* CAMADA 0 — MATRIZ */}
          {matriz?.book && <MatrizBlock book={matriz.book} />}

          {/* CAMADA 1 — TRAVESSIAS */}
          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3 px-1">
              Travessias do Ciclo
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {travessias.map((tCb, i) => {
                if (!tCb.book) return null;
                const isActive = tCb.book.id === activeId;
                // TODO: real progress from user data
                const progress = isActive ? 1 : 0;
                const isCompleted = false;

                return (
                  <TravessiaCard
                    key={tCb.id}
                    book={tCb.book}
                    index={i}
                    isActive={isActive}
                    isCompleted={isCompleted}
                    progress={progress}
                    onClick={() => setActiveTravessiaId(tCb.book!.id)}
                  />
                );
              })}
            </div>
          </div>

          {/* CAMADA 2 — PORTAS (da travessia ativa) */}
          <AnimatePresence mode="wait">
            {activePortas.length > 0 && (
              <motion.div
                key={`portas-${activeId}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-3 px-1" style={{ color: LAYERS.PORTA.cor }}>
                  Portas desta Travessia
                </h2>
                <div className="space-y-2">
                  {activePortas.map((pCb, i) => pCb.book && (
                    <PortaItem
                      key={pCb.id}
                      book={pCb.book}
                      isUnlocked={i === 0} // TODO: real unlock logic
                      onClick={() => setSelectedBook(pCb.book!)}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CAMADA 3 — PONTES (da travessia ativa) */}
          <AnimatePresence mode="wait">
            {activePontes.length > 0 && (
              <motion.div
                key={`pontes-${activeId}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-3 px-1" style={{ color: LAYERS.PONTE.cor }}>
                  Pontes de Integração
                </h2>
                <div className="flex flex-wrap gap-2">
                  {activePontes.map(bCb => bCb.book && (
                    <PonteItem
                      key={bCb.id}
                      book={bCb.book}
                      onClick={() => setSelectedBook(bCb.book!)}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* FORA DA MANDALA — FUNDAÇÃO */}
          {fundacao.length > 0 && (
            <div className="border border-border rounded-lg p-4 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Columns className="w-4 h-4" style={{ color: LAYERS.FUNDACAO.cor }} />
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: LAYERS.FUNDACAO.cor }}>
                    Fundação
                  </span>
                  <span className="text-[10px] text-muted-foreground ml-2">Base teórica do método</span>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {fundacao.map(cb => cb.book && (
                  <Card
                    key={cb.book.id}
                    className="cursor-pointer hover:border-border/80 transition-all"
                    onClick={() => setSelectedBook(cb.book!)}
                  >
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className="w-8 h-10 rounded flex items-center justify-center shrink-0" style={{ background: LAYERS.FUNDACAO.bg }}>
                        <Columns className="w-3.5 h-3.5" style={{ color: LAYERS.FUNDACAO.cor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{cb.book.title}</p>
                        <p className="text-xs text-muted-foreground">{cb.book.author}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 pt-2">
        {(['MATRIZ', 'TRAVESSIA', 'PORTA', 'PONTE', 'FUNDACAO'] as LayerKey[]).map(key => {
          const l = LAYERS[key];
          return (
            <div key={key} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.cor, opacity: 0.6 }} />
              <span className="text-[10px] font-medium" style={{ color: l.cor }}>{l.label}</span>
            </div>
          );
        })}
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedBook && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedBook(null)}
            />
            <DetailPanel
              book={selectedBook}
              onClose={() => setSelectedBook(null)}
              onNavigate={(p) => { setSelectedBook(null); navigate(p); }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
