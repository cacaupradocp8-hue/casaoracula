import { ReactNode } from 'react';
import { useRitualPassage } from '@/hooks/useRitualPassage';
import { RitualModal } from './RitualModal';
import { Loader2 } from 'lucide-react';

interface RitualGateProps {
  triggerEvent: string;
  contextType?: string;
  contextId?: string;
  children: ReactNode;
  fallback?: ReactNode;
  blockUntilComplete?: boolean;
}

/**
 * RitualGate wraps content that requires a ritual passage.
 * 
 * If blockUntilComplete is true and the ritual authorizes access,
 * the children will not render until the ritual is completed.
 * 
 * Otherwise, the ritual modal will overlay while allowing the content to render behind.
 */
export function RitualGate({
  triggerEvent,
  contextType,
  contextId,
  children,
  fallback,
  blockUntilComplete = false,
}: RitualGateProps) {
  const {
    ritual,
    isLoading,
    isSubmitting,
    showRitual,
    isRitualCompleted,
    authorizesAccess,
    completeRitual,
  } = useRitualPassage({ triggerEvent, contextType, contextId });

  // Loading state
  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-gold animate-spin" />
        </div>
      )
    );
  }

  // No ritual required
  if (!ritual) {
    return <>{children}</>;
  }

  // Ritual blocks access and is not complete
  if (blockUntilComplete && authorizesAccess && !isRitualCompleted) {
    return (
      <>
        {showRitual && (
          <RitualModal
            isOpen={true}
            tipo={ritual.tipo}
            textoRitual={ritual.texto_ritual}
            perguntaCompromisso={ritual.pergunta_compromisso}
            camposReflexao={ritual.campos_reflexao}
            microcopy={ritual.microcopy}
            onComplete={completeRitual}
            isSubmitting={isSubmitting}
          />
        )}
      </>
    );
  }

  // Show ritual overlay but content is accessible
  return (
    <>
      {children}
      {showRitual && ritual && (
        <RitualModal
          isOpen={true}
          tipo={ritual.tipo}
          textoRitual={ritual.texto_ritual}
          perguntaCompromisso={ritual.pergunta_compromisso}
          camposReflexao={ritual.campos_reflexao}
          microcopy={ritual.microcopy}
          onComplete={completeRitual}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}
