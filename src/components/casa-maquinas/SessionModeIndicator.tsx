import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Compass, Feather, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SessionMode, NextStepSuggestion } from '@/hooks/useSessionMode';

interface SessionModeIndicatorProps {
  mode: SessionMode;
  onToggle: () => void;
  nextStep?: NextStepSuggestion | null;
  loadingNext?: boolean;
  onFollowNextStep?: (rota: string) => void;
  onRequestSuggestion?: () => void;
  compact?: boolean;
}

export function SessionModeIndicator({
  mode,
  onToggle,
  nextStep,
  loadingNext,
  onFollowNextStep,
  onRequestSuggestion,
  compact = false,
}: SessionModeIndicatorProps) {
  const isOracula = mode === 'oracula';

  return (
    <div className="space-y-2">
      {/* Mode badge + toggle */}
      <div className="flex items-center gap-2">
        <Badge
          variant={isOracula ? 'default' : 'outline'}
          className={`gap-1.5 text-xs px-3 py-1 ${
            isOracula
              ? 'bg-primary/20 text-primary border-primary/30'
              : 'border-border/40 text-muted-foreground'
          }`}
        >
          {isOracula ? (
            <Compass className="w-3 h-3" />
          ) : (
            <Feather className="w-3 h-3" />
          )}
          {isOracula ? 'Modo Orácula ativo' : 'Modo Livre ativo'}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-6 text-[10px] text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Alternar
        </Button>
      </div>

      {/* Next step suggestion (Orácula mode) */}
      <AnimatePresence>
        {isOracula && nextStep && !compact && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
              <p className="text-[10px] text-primary/60 uppercase tracking-wider font-semibold mb-1">
                Próximo passo sugerido
              </p>
              <p className="text-sm font-medium text-foreground">
                {nextStep.ferramenta_nome}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {nextStep.motivo}
              </p>
              {onFollowNextStep && nextStep.ferramenta_rota && (
                <Button
                  variant="gold"
                  size="sm"
                  className="mt-2 gap-1.5 text-xs w-full"
                  onClick={() => onFollowNextStep(nextStep.ferramenta_rota)}
                >
                  <ArrowRight className="w-3 h-3" />
                  Ir para {nextStep.ferramenta_nome}
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      {isOracula && loadingNext && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="w-3 h-3 animate-spin" />
          Buscando sugestão...
        </div>
      )}

      {/* Livre mode: optional suggestion button */}
      {!isOracula && onRequestSuggestion && !compact && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRequestSuggestion}
          className="text-[10px] text-muted-foreground hover:text-primary gap-1"
        >
          <Compass className="w-3 h-3" />
          Ativar sugestão pontual
        </Button>
      )}
    </div>
  );
}
