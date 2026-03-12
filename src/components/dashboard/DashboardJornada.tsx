
import { motion } from 'framer-motion';
import { useJornadaHabitante, ESTAGIOS } from '@/hooks/useJornadaHabitante';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DashboardJornada() {
  const { estagio, estagioInfo, progresso, isLoading } = useJornadaHabitante();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-5 h-5 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-10"
    >
      <div className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-sm p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary/60 mb-1">
              Jornada da Habitante
            </p>
            <h2 className="font-display text-xl text-foreground">
              Você é uma <span className="text-primary">{estagioInfo.label}</span>
            </h2>
          </div>
          <div className="text-right">
            <span className="text-2xl font-display text-primary">{progresso}%</span>
            <p className="text-xs text-muted-foreground">concluído</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative mb-6">
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
              initial={{ width: 0 }}
              animate={{ width: `${progresso}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            />
          </div>
        </div>

        {/* Stages track */}
        <div className="flex items-center justify-between gap-1">
          {ESTAGIOS.map((stage, idx) => {
            const isActive = stage.key === estagio;
            const isPast = stage.index < estagioInfo.index;
            const isFuture = stage.index > estagioInfo.index;

            return (
              <div key={stage.key} className="flex-1 text-center">
                {/* Dot */}
                <div className="flex justify-center mb-2">
                  <div
                    className={cn(
                      'w-3.5 h-3.5 rounded-full border-2 transition-all',
                      isPast && 'bg-primary border-primary',
                      isActive && 'bg-primary border-primary ring-4 ring-primary/20',
                      isFuture && 'bg-card border-border/40',
                    )}
                  />
                </div>
                {/* Label */}
                <span
                  className={cn(
                    'text-[10px] md:text-xs font-medium transition-colors',
                    isPast && 'text-primary/70',
                    isActive && 'text-primary font-semibold',
                    isFuture && 'text-muted-foreground/50',
                  )}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
