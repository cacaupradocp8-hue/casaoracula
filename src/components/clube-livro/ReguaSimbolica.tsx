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
    <div className="w-full mb-6">
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-4 left-6 right-6 h-px bg-primary/10" />

        {steps.map((step, i) => {
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
                'relative flex flex-col items-center gap-1.5 z-10 transition-all group',
                isLocked && 'cursor-not-allowed opacity-40',
                !isLocked && 'cursor-pointer',
              )}
              title={isLocked ? 'Ainda não é tempo de avançar.' : step.label}
            >
              {/* Moon / Star icon */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-base transition-all border',
                  isActive && 'ring-2 ring-primary/30 scale-110',
                  isDone && !isActive && 'bg-primary/15 border-primary/30',
                  !isDone && !isActive && !isLocked && 'bg-muted/30 border-border/50',
                  isLocked && 'bg-muted/10 border-border/20',
                )}
              >
                {isLocked ? (
                  <Lock className="w-3 h-3 text-muted-foreground/50" />
                ) : (
                  <span>{step.emoji}</span>
                )}
              </div>

              {/* Label (hidden on mobile for space) */}
              <span
                className={cn(
                  'text-[10px] sm:text-xs leading-tight transition-colors',
                  isActive && 'text-primary font-medium',
                  isDone && !isActive && 'text-primary/70',
                  !isDone && !isActive && !isLocked && 'text-muted-foreground',
                  isLocked && 'text-muted-foreground/40',
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
