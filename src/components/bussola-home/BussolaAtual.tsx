import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { DistritoResumo } from '@/hooks/useBussolaOracular';

interface Props {
  leituraMomento: string | null;
  distritoDominante: DistritoResumo | null;
  distritoTensao: DistritoResumo | null;
  nivelIntegracao: 'inicio' | 'travessia' | 'integracao';
  temCartografia: boolean;
  welcomeName: string;
}

const NIVEL_BADGE: Record<string, { label: string; style: string }> = {
  inicio: { label: 'Início', style: 'bg-primary/10 text-primary/70 border-primary/15' },
  travessia: { label: 'Travessia', style: 'bg-amber-500/10 text-amber-600/70 border-amber-500/15' },
  integracao: { label: 'Integração', style: 'bg-emerald-500/10 text-emerald-600/70 border-emerald-500/15' },
};

export function BussolaAtual({ leituraMomento, distritoDominante, distritoTensao, nivelIntegracao, temCartografia, welcomeName }: Props) {
  if (!temCartografia) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="font-display text-2xl sm:text-3xl text-foreground mb-2">
          Bem-vinda, <span className="text-primary">{welcomeName}</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground/60 max-w-lg">
          Sua jornada começa pela revelação do seu mapa interior. Explore a Casa e descubra os territórios da sua alma.
        </p>
      </motion.section>
    );
  }

  const badge = NIVEL_BADGE[nivelIntegracao];

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-muted-foreground/40 font-medium">
          Seu momento na jornada
        </p>
        <span className={cn("text-[10px] px-2.5 py-1 rounded-full border font-semibold tracking-wide", badge.style)}>
          {badge.label}
        </span>
      </div>

      <div className="rounded-2xl border border-border/15 bg-card/30 p-6 sm:p-8 space-y-6 shadow-soft backdrop-blur-sm">
        {/* Distrito + Estado */}
        <div className="flex items-center gap-4 sm:gap-6">
          {distritoDominante && (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0 shadow-glow">
              <span className="text-2xl sm:text-3xl">{distritoDominante.icon}</span>
            </div>
          )}
          <div className="min-w-0 flex-1">
            {distritoDominante && (
              <h2 className="text-lg sm:text-xl font-display text-foreground leading-tight mb-1">
                {distritoDominante.nome}
              </h2>
            )}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-xs text-muted-foreground/60 capitalize flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                {distritoDominante?.estado === 'central' ? 'ativo' : distritoDominante?.estado}
              </span>
              {distritoTensao && (
                <span className="text-xs text-destructive/60 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive/40" />
                  Tensão: {distritoTensao.nome}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Leitura clínica direta */}
        {leituraMomento && (
          <div className="relative">
            <div className="absolute -left-6 top-0 bottom-0 w-1 bg-primary/20 rounded-full hidden sm:block" />
            <p className="text-base sm:text-lg text-foreground/80 leading-relaxed font-serif italic">
              "{leituraMomento}"
            </p>
          </div>
        )}
      </div>
    </motion.section>
  );
}
