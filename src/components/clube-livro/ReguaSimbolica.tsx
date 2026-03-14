import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';
import type { ProgressaoStep } from '@/hooks/useCirculoProgressao';

interface ReguaSimbolicaProps {
  steps: ProgressaoStep[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

/**
 * Régua simbólica de progressão do Círculo de Leitura.
 * Mostra fases lunares sem porcentagens numéricas.
 */
export function ReguaSimbolica({ steps, activeTab, onTabChange }: ReguaSimbolicaProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Connecting line — gradient */}
        <div className="absolute top-5 left-8 right-8 h-px bg-gradient-to-r from-primary/5 via-gold/15 to-primary/5" />

        {steps.map((step) => {
          const isActive = activeTab === step.key;
          const isDone = step.concluido;
          const isLocked = !step.desbloqueado;

          return (
            <button
              key={step.key}
              onClick={() => {
                if (!isLocked) onTabChange(step.key);
              }}
              disabled={isLocked}
              className={cn(
                'relative flex flex-col items-center gap-2 z-10 transition-all duration-300 group',
                isLocked && 'cursor-not-allowed opacity-35',
                !isLocked && 'cursor-pointer',
              )}
              title={isLocked ? 'Ainda não é tempo de avançar.' : step.label}
            >
              {/* Moon / Star icon */}
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-base transition-all duration-300 border',
                  isActive && 'ring-2 ring-gold/30 scale-110 bg-gradient-to-br from-gold/15 to-mystic/10 border-gold/30 shadow-sm shadow-gold/10',
                  isDone && !isActive && 'bg-primary/10 border-primary/25',
                  !isDone && !isActive && !isLocked && 'bg-card border-border/30 hover:border-primary/20',
                  isLocked && 'bg-muted/10 border-border/15',
                )}
              >
                {isLocked ? (
                  <Lock className="w-3 h-3 text-muted-foreground/40" />
                ) : (
                  <span className={cn(isActive && 'scale-110 transition-transform')}>{step.emoji}</span>
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  'text-[10px] sm:text-xs leading-tight transition-colors font-medium',
                  isActive && 'text-gold',
                  isDone && !isActive && 'text-primary/70',
                  !isDone && !isActive && !isLocked && 'text-muted-foreground',
                  isLocked && 'text-muted-foreground/30',
                )}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
