import { motion } from 'framer-motion';
import { JORNADA_ANO_1 } from '@/constants/jornadaAnual';
import { cn } from '@/lib/utils';

interface Props {
  mesAtual: number;
  onSelectMes: (mes: number) => void;
}

export function JornadaAnualTimeline({ mesAtual, onSelectMes }: Props) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold/50 font-medium mb-1">
          Ano 1
        </p>
        <h3 className="font-display text-lg text-foreground">
          Jornada da Facilitadora Oracular
        </h3>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2">
        {JORNADA_ANO_1.map((m) => {
          const isAtual = m.mes === mesAtual;
          const isPast = m.mes < mesAtual;

          return (
            <motion.button
              key={m.mes}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectMes(m.mes)}
              className={cn(
                'relative flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300 border',
                isAtual
                  ? 'border-gold/40 bg-gold/10 shadow-[0_0_12px_-4px_hsl(var(--gold)/0.3)]'
                  : isPast
                    ? 'border-border/20 bg-card/30 opacity-70'
                    : 'border-border/10 bg-card/10 opacity-50 hover:opacity-80'
              )}
            >
              {isAtual && (
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gold animate-pulse" />
              )}
              <span className={cn(
                'text-xs font-semibold',
                isAtual ? 'text-gold' : 'text-muted-foreground'
              )}>
                {m.mes}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
