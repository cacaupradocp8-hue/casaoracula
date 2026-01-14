import { cn } from '@/lib/utils';

interface EthicalNoticeProps {
  toolName?: string;
  className?: string;
}

export function EthicalNotice({ toolName, className }: EthicalNoticeProps) {
  return (
    <div className={cn(
      "text-center py-4 text-xs text-muted-foreground/60",
      className
    )}>
      <p>
        {toolName ? `${toolName} · ` : ''}
        Conteúdo formativo e simbólico. Não substitui supervisão clínica.
      </p>
    </div>
  );
}
