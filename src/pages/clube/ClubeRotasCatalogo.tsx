import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Check, Compass, ArrowRight, Sparkles } from 'lucide-react';
import { useTodasRotas, type EstacaoCatalogo, type EstacaoStatusUI } from '@/hooks/useTodasRotas';
import { useEffectivePortal } from '@/hooks/useEffectivePortal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

type Filtro = 'todas' | 'em_curso' | 'concluidas' | 'proximas';

export default function ClubeRotasCatalogo() {
  const navigate = useNavigate();
  const { isAdmin } = useEffectivePortal();
  const { data: estacoes, isLoading } = useTodasRotas({ isAdmin });
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const [bloqueada, setBloqueada] = useState<EstacaoCatalogo | null>(null);

  const filtradas = useMemo(() => {
    if (!estacoes) return [];
    switch (filtro) {
      case 'em_curso':
        return estacoes.filter((e) => e.status === 'in_progress');
      case 'concluidas':
        return estacoes.filter((e) => e.status === 'completed');
      case 'proximas':
        return estacoes.filter((e) => e.status === 'locked' || e.status === 'available');
      default:
        return estacoes;
    }
  }, [estacoes, filtro]);

  const filtros: { id: Filtro; label: string }[] = [
    { id: 'todas', label: 'Todas' },
    { id: 'em_curso', label: 'Em curso' },
    { id: 'concluidas', label: 'Concluídas' },
    { id: 'proximas', label: 'Próximas' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gold/10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-20 w-[520px] h-[520px] bg-gold/[0.06] rounded-full blur-[140px]" />
          <div className="absolute -bottom-40 -left-20 w-[460px] h-[460px] bg-[hsl(206_70%_30%/0.18)] rounded-full blur-[140px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 md:px-10 py-14 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-5 max-w-3xl"
          >
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-gold/40" />
              <span className="text-[9px] tracking-[0.4em] uppercase text-gold/70">
                Mapa das travessias
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-foreground leading-[1.05]">
              A jornada não cabe em um livro só.
            </h1>
            <p className="font-serif italic text-base md:text-lg text-foreground/55 max-w-xl">
              Cada estação é uma porta. Você atravessa uma — outra se abre. O que vem depois
              já está esperando.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filtros */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 pt-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {filtros.map((f) => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              className={cn(
                'shrink-0 px-4 py-1.5 rounded-full text-xs tracking-wide border transition-all',
                filtro === f.id
                  ? 'border-gold/60 bg-gold/10 text-gold'
                  : 'border-foreground/10 text-foreground/50 hover:border-foreground/25 hover:text-foreground/80',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 md:py-14">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
            ))}
          </div>
        ) : filtradas.length === 0 ? (
          <p className="text-center text-foreground/40 py-20 font-serif italic">
            Nenhuma estação por aqui ainda.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtradas.map((estacao, idx) => (
              <RotaCard
                key={estacao.id}
                estacao={estacao}
                index={idx}
                onClickLocked={() => setBloqueada(estacao)}
                onOpen={() => {
                  if (estacao.primeiro_slug) {
                    navigate(`/clube/rota/${estacao.primeiro_slug}`);
                  } else {
                    navigate('/clube');
                  }
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modal estação bloqueada */}
      <Dialog open={!!bloqueada} onOpenChange={(o) => !o && setBloqueada(null)}>
        <DialogContent className="bg-midnight border-gold/20">
          <DialogHeader>
            <div className="mx-auto w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-2">
              <Lock className="w-5 h-5 text-gold" />
            </div>
            <DialogTitle className="font-display text-2xl text-center text-foreground">
              Esta porta ainda não se abriu
            </DialogTitle>
            <DialogDescription className="font-serif italic text-center text-foreground/60 pt-2">
              Conclua a estação anterior para que esta travessia se revele. Cada passo prepara
              o terreno do próximo.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-3">
            <Button
              variant="outline"
              className="border-gold/40 hover:bg-gold/10"
              onClick={() => setBloqueada(null)}
            >
              Voltar ao mapa
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface RotaCardProps {
  estacao: EstacaoCatalogo;
  index: number;
  onOpen: () => void;
  onClickLocked: () => void;
}

function RotaCard({ estacao, index, onOpen, onClickLocked }: RotaCardProps) {
  const locked = estacao.status === 'locked';
  const completed = estacao.status === 'completed';
  const inProgress = estacao.status === 'in_progress';
  const cover = estacao.livro_capa_url || estacao.banner_url || estacao.livro_imagem_banner_url;

  const handleClick = () => {
    if (locked) onClickLocked();
    else onOpen();
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.6 }}
      whileHover={{ y: -4 }}
      onClick={handleClick}
      className={cn(
        'group relative text-left w-full overflow-hidden rounded-2xl border transition-all duration-500',
        'aspect-[4/5] flex flex-col',
        locked
          ? 'border-foreground/10 bg-foreground/[0.02]'
          : 'border-gold/15 bg-midnight hover:border-gold/40 hover:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.7)]',
      )}
    >
      {/* Cover */}
      <div className="absolute inset-0">
        {cover ? (
          <img
            src={cover}
            alt={estacao.livro_titulo}
            className={cn(
              'w-full h-full object-cover transition-all duration-700',
              locked ? 'opacity-25 blur-[6px] scale-110' : 'opacity-40 group-hover:opacity-55 group-hover:scale-105',
            )}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-midnight via-midnight to-[hsl(206_70%_18%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/85 to-midnight/30" />
      </div>

      {/* Status badge */}
      <div className="relative p-5 flex items-start justify-between">
        <span className="text-[9px] tracking-[0.35em] uppercase text-foreground/50">
          Estação {estacao.numero}
        </span>
        <StatusBadge status={estacao.status} />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Content */}
      <div className="relative p-5 space-y-3">
        <div className="space-y-1.5">
          <h3
            className={cn(
              'font-display text-xl leading-tight',
              locked ? 'text-foreground/40' : 'text-foreground',
            )}
          >
            {estacao.livro_titulo}
          </h3>
          {estacao.livro_autor && !locked && (
            <p className="font-serif italic text-xs text-foreground/45">
              {estacao.livro_autor}
            </p>
          )}
        </div>

        {!locked && estacao.essencia_nucleo && (
          <p className="text-[13px] text-foreground/55 line-clamp-2 leading-relaxed">
            {estacao.essencia_nucleo}
          </p>
        )}

        {/* Progress */}
        {!locked && estacao.total_itens > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[10px] tracking-wide text-foreground/45">
              <span>
                {estacao.itens_concluidos}/{estacao.total_itens} fases
              </span>
              <span className="text-gold/80 font-medium">{estacao.progresso_pct}%</span>
            </div>
            <div className="h-1 rounded-full bg-foreground/10 overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-700',
                  completed ? 'bg-gold' : 'bg-gradient-to-r from-gold to-gold/40',
                )}
                style={{ width: `${estacao.progresso_pct}%` }}
              />
            </div>
          </div>
        )}

        {/* CTA hint */}
        <div className="pt-2">
          {locked ? (
            <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-foreground/35">
              <Lock className="w-3 h-3" /> Conclua a anterior
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-gold/80 group-hover:text-gold">
              {completed ? 'Revisitar' : inProgress ? 'Continuar' : 'Iniciar'}
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

function StatusBadge({ status }: { status: EstacaoStatusUI }) {
  if (status === 'completed') {
    return (
      <span className="flex items-center gap-1 text-[9px] tracking-[0.3em] uppercase text-gold">
        <Check className="w-3 h-3" strokeWidth={3} /> Concluída
      </span>
    );
  }
  if (status === 'in_progress') {
    return (
      <span className="flex items-center gap-1 text-[9px] tracking-[0.3em] uppercase text-gold/90">
        <Sparkles className="w-3 h-3" /> Você está aqui
      </span>
    );
  }
  if (status === 'locked') {
    return (
      <span className="flex items-center gap-1 text-[9px] tracking-[0.3em] uppercase text-foreground/40">
        <Lock className="w-3 h-3" /> Bloqueada
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-[9px] tracking-[0.3em] uppercase text-foreground/55">
      <Compass className="w-3 h-3" /> Disponível
    </span>
  );
}
