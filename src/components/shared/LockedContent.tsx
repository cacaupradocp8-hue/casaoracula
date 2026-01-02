import { Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface LockedContentProps {
  message?: string;
  className?: string;
  variant?: 'card' | 'inline' | 'overlay';
}

const DEFAULT_MESSAGE = 'Este Portal será aberto no tempo certo da jornada.';

export function LockedContent({ 
  message = DEFAULT_MESSAGE, 
  className,
  variant = 'card' 
}: LockedContentProps) {
  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-2 text-muted-foreground text-sm', className)}>
        <Lock className="w-4 h-4" />
        <span>{message}</span>
      </div>
    );
  }

  if (variant === 'overlay') {
    return (
      <div className={cn(
        'absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg',
        className
      )}>
        <div className="text-center p-4">
          <Lock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground max-w-[200px]">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn('bg-muted/30 border-border/50', className)}>
      <CardContent className="p-6 text-center">
        <Lock className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}

// Pre-defined messages for common scenarios
export const LOCKED_MESSAGES = {
  portal: 'Este Portal será aberto no tempo certo da jornada.',
  sala: 'Esta Sala ainda não está disponível para você.',
  conteudo: 'Conteúdo disponível em portais superiores.',
  ferramenta: 'Esta ferramenta requer um nível de acesso maior.',
  caso: 'Você precisa de permissão para acessar este caso.',
} as const;
