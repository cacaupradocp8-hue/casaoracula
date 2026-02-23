// ============================================
// MANDALA DE JORNADA — Estações Simbólicas 2026
// Layout visual preservado, dados de clube_estacoes
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, ChevronRight, Lock, Map, List, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useEstacoes, type Estacao } from '@/hooks/useEstacoes';
import { useIsMobile } from '@/hooks/use-mobile';

// ============================================
// LAYER CONFIG (PRESERVADO)
// ============================================
const LAYERS = {
  MATRIZ: { label: 'Matriz', cor: 'hsl(43, 60%, 54%)', bg: 'hsl(43, 60%, 54%, 0.12)', icon: '☽◯☾' },
  ESTACAO: { label: 'Estação', cor: 'hsl(212, 50%, 50%)', bg: 'hsl(212, 50%, 36%, 0.12)', icon: '◈' },
} as const;

// ============================================
// NÚCLEO — Centro fixo (PRESERVADO)
// ============================================
function MatrizBlock() {
  return (
    <div className="text-center mb-8">
      <motion.div
        className="mx-auto w-24 h-24 rounded-full flex items-center justify-center border-2 relative"
        style={{ borderColor: LAYERS.MATRIZ.cor, background: LAYERS.MATRIZ.bg }}
        animate={{ boxShadow: ['0 0 20px hsl(43, 60%, 54%, 0.15)', '0 0 45px hsl(43, 60%, 54%, 0.3)', '0 0 20px hsl(43, 60%, 54%, 0.15)'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-3xl select-none" style={{ color: LAYERS.MATRIZ.cor }}>☽◯☾</span>
      </motion.div>
      <p className="text-xs font-bold mt-3 uppercase tracking-[0.2em]" style={{ color: LAYERS.MATRIZ.cor }}>
        Ano Oracular 2026
      </p>
      <p className="text-[11px] text-muted-foreground mt-1 max-w-xs mx-auto italic">
        Toda leitura é uma travessia da consciência
      </p>
    </div>
  );
}

// ============================================
// ESTAÇÃO CARD (mesmo layout visual do TravessiaCard)
// ============================================
function EstacaoCard({
  estacao,
  index,
  onClick,
}: {
  estacao: Estacao;
  index: number;
  onClick: () => void;
}) {
  const isActive = estacao.ativa;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Card
        className={`cursor-pointer transition-all duration-300 overflow-hidden hover:shadow-lg hover:scale-[1.02] ${
          isActive
            ? 'ring-2 ring-offset-2 ring-offset-background shadow-md'
            : 'opacity-60 hover:opacity-90'
        }`}
        style={{
          borderColor: isActive ? LAYERS.ESTACAO.cor : undefined,
          ...(isActive ? { '--tw-ring-color': LAYERS.ESTACAO.cor } as any : {}),
        }}
        onClick={onClick}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Fase lunar */}
              <span className="text-2xl select-none shrink-0 mt-0.5">
                {estacao.fase_lunar || '◯'}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="text-xs font-bold tracking-widest"
                    style={{ color: isActive ? LAYERS.ESTACAO.cor : 'hsl(var(--muted-foreground))' }}
                  >
                    {estacao.titulo.toUpperCase()}
                  </span>
                  {isActive && (
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-current font-bold" style={{ color: LAYERS.ESTACAO.cor }}>
                      ATIVA
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-1">{estacao.subtitulo}</p>
                <h3 className="text-base font-display text-foreground truncate">{estacao.livro_titulo}</h3>
                {estacao.livro_autor && (
                  <p className="text-xs text-muted-foreground truncate">{estacao.livro_autor}</p>
                )}
              </div>
            </div>
            <div className="shrink-0 flex items-center">
              {isActive ? (
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: LAYERS.ESTACAO.bg }}>
                  <ChevronRight className="w-5 h-5" style={{ color: LAYERS.ESTACAO.cor }} />
                </div>
              ) : (
                <Lock className="w-4 h-4 text-muted-foreground/40" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================
// DETAIL PANEL (PRESERVADO)
// ============================================
function DetailPanel({ estacao, onClose, onNavigate }: { estacao: Estacao; onClose: () => void; onNavigate: (p: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
      className="fixed inset-y-0 right-0 w-80 max-w-[90vw] z-50 bg-card border-l border-border shadow-2xl overflow-y-auto"
    >
      <div className="p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className="text-xs mb-2 font-bold" style={{ color: LAYERS.ESTACAO.cor, borderColor: LAYERS.ESTACAO.cor }}>
              {estacao.titulo}
            </Badge>
            <p className="text-xs text-muted-foreground mb-1">{estacao.subtitulo}</p>
            <h3 className="font-display text-lg text-foreground">{estacao.livro_titulo}</h3>
            {estacao.livro_autor && <p className="text-sm text-muted-foreground">{estacao.livro_autor}</p>}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button>
        </div>

        {estacao.livro_capa_url && (
          <img src={estacao.livro_capa_url} alt={estacao.livro_titulo} className="w-full h-48 object-cover rounded-lg shadow-lg" />
        )}

        <div className="text-2xl text-center select-none py-2">{estacao.fase_lunar || '◯'}</div>

        {estacao.essencia_nucleo && (
          <div className="text-sm text-muted-foreground italic border-l-2 pl-3" style={{ borderColor: `${LAYERS.ESTACAO.cor}50` }}>
            {estacao.essencia_nucleo}
          </div>
        )}

        {/* CTA */}
        <Button
          className="w-full justify-center gap-2 h-12 text-sm font-semibold"
          onClick={() => onNavigate(`/clube-livro/estacao/${estacao.id}`)}
        >
          <BookOpen className="w-4 h-4" /> Entrar na Estação
        </Button>
        <p className="text-[10px] text-center text-muted-foreground -mt-3">
          Acessar o Laboratório 80/20
        </p>
      </div>
    </motion.div>
  );
}

// ============================================
// LIST VIEW
// ============================================
function ListView({ estacoes, onSelect }: { estacoes: Estacao[]; onSelect: (e: Estacao) => void }) {
  return (
    <div className="space-y-2">
      {estacoes.map((est) => (
        <div
          key={est.id}
          className="flex items-center gap-3 px-2 py-2.5 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => onSelect(est)}
        >
          <span className="text-xl select-none shrink-0">{est.fase_lunar || '◯'}</span>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: est.ativa ? LAYERS.ESTACAO.cor : 'hsl(var(--muted-foreground))' }}>
              {est.titulo}
            </span>
            <p className="text-sm text-foreground truncate">{est.livro_titulo}</p>
            <p className="text-xs text-muted-foreground truncate">{est.livro_autor}</p>
          </div>
          {est.ativa ? (
            <Badge variant="outline" className="text-[10px] shrink-0" style={{ color: LAYERS.ESTACAO.cor, borderColor: LAYERS.ESTACAO.cor }}>
              ATIVA
            </Badge>
          ) : (
            <Lock className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export function MandalaAnualDB() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { data: estacoes, isLoading } = useEstacoes();
  const [selectedEstacao, setSelectedEstacao] = useState<Estacao | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  if (isLoading) {
    return <div className="flex justify-center py-16"><span className="text-muted-foreground text-sm animate-pulse">Carregando jornada…</span></div>;
  }
  if (!estacoes?.length) {
    return <div className="text-center py-16 text-muted-foreground">Nenhuma estação encontrada.</div>;
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
        <ListView estacoes={estacoes} onSelect={setSelectedEstacao} />
      ) : (
        <div className="space-y-8">
          {/* NÚCLEO — MATRIZ */}
          <MatrizBlock />

          {/* ESTAÇÕES */}
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 px-1">
              Estações do Ano Oracular
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {estacoes.map((est, i) => (
                <EstacaoCard
                  key={est.id}
                  estacao={est}
                  index={i}
                  onClick={() => setSelectedEstacao(est)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 pt-2">
        {[
          { label: 'Matriz', cor: LAYERS.MATRIZ.cor },
          { label: 'Estação', cor: LAYERS.ESTACAO.cor },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: l.cor }} />
            <span className="text-[10px] font-semibold" style={{ color: l.cor }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedEstacao && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedEstacao(null)}
            />
            <DetailPanel
              estacao={selectedEstacao}
              onClose={() => setSelectedEstacao(null)}
              onNavigate={(p) => { setSelectedEstacao(null); navigate(p); }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
