import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EthicalNoticeProps {
  toolName?: string;
  className?: string;
}

export function EthicalNotice({ toolName, className }: EthicalNoticeProps) {
  return (
    <div className={cn(
      "rounded-lg border border-amber-500/30 bg-amber-500/10 p-4",
      className
    )}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">
            Aviso Ético{toolName ? ` — ${toolName}` : ''}
          </p>
          <p>
            Este app não substitui supervisão clínica, psicoterapia ou psiquiatria. 
            Conteúdo formativo e simbólico, exclusivo para profissionais.
          </p>
        </div>
      </div>
    </div>
  );
}
