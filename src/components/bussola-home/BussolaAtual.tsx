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
        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-gold/40 font-semibold ml-1">
          Seu momento na jornada
        </p>
        <span className={cn("text-[10px] px-3 py-1 rounded-full border border-gold/20 font-bold tracking-widest uppercase bg-gold/5", badge.style)}>
          {badge.label}
        </span>
      </div>

      <div className="premium-card relative overflow-hidden p-6 sm:p-10 space-y-8 group">
        {/* Background glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[100px] -mr-32 -mt-32 transition-all group-hover:bg-gold/10" />
        
        {/* Distrito + Estado */}
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {distritoDominante && (
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] bg-gradient-to-br from-gold/10 to-transparent border border-gold/20 flex items-center justify-center shrink-0 shadow-premium group-hover:shadow-premium-glow transition-all"
            >
              <span className="text-4xl sm:text-5xl drop-shadow-lg">{distritoDominante.icon}</span>
            </motion.div>
          )}
          <div className="min-w-0 flex-1 pt-1">
            {distritoDominante && (
              <h2 className="text-2xl sm:text-3xl font-display text-white leading-tight mb-2 tracking-wide">
                Território: <span className="text-gold">{distritoDominante.nome}</span>
              </h2>
            )}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                {distritoDominante?.estado === 'central' ? 'ativo' : distritoDominante?.estado}
              </span>
              {distritoTensao && (
                <span className="px-3 py-1 rounded-md bg-destructive/5 border border-destructive/10 text-[11px] text-destructive/70 uppercase tracking-widest font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  Tensão: {distritoTensao.nome}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Leitura clínica direta */}
        {leituraMomento && (
          <div className="relative pt-2">
            <div className="absolute left-0 top-0 w-8 h-px bg-gradient-to-r from-gold/50 to-transparent" />
            <p className="text-lg sm:text-xl text-foreground/90 leading-relaxed font-display italic tracking-wide pl-2 border-l-2 border-gold/20">
              "{leituraMomento}"
            </p>
          </div>
        )}
      </div>
    </motion.section>
  );
}
