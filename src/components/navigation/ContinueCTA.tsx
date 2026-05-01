import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ContinueCTAProps {
  title: string;
  /** Linha discreta acima do título — ex: "Continue de onde parou" */
  eyebrow?: string;
  description?: string;
  /** Rota de destino. Se omitido, usa onClick. */
  to?: string;
  onClick?: () => void;
  /** Progresso 0-100. Se fornecido, exibe barra. */
  progress?: number;
  ctaLabel?: string;
  className?: string;
}

/**
 * Card-CTA discreto para retomada de jornada.
 * Usado quando há um item parcialmente concluído ou em andamento.
 * Não introduz cores novas — usa primary + bg-card existentes.
 */
export function ContinueCTA({
  title,
  eyebrow = 'Continue de onde parou',
  description,
  to,
  onClick,
  progress,
  ctaLabel = 'Continuar',
  className,
}: ContinueCTAProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) return onClick();
    if (to) return navigate(to);
  };

  const showProgress = typeof progress === 'number' && progress > 0 && progress < 100;

  return (
    <div
      className={cn(
        'rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-card/40 to-transparent backdrop-blur-sm p-4 sm:p-5',
        'flex flex-col sm:flex-row sm:items-center gap-4',
        className
      )}
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
        <Play className="w-4 h-4 text-primary fill-primary" />
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary/70 font-medium">
          {eyebrow}
        </p>
        <h3 className="text-sm sm:text-base font-semibold text-foreground truncate">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>
        )}
        {showProgress && (
          <div className="flex items-center gap-2 pt-1">
            <Progress value={progress} className="h-1 flex-1" />
            <span className="text-[10px] text-muted-foreground tabular-nums">{progress}%</span>
          </div>
        )}
      </div>

      <Button
        size="sm"
        onClick={handleClick}
        className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 self-start sm:self-auto flex-shrink-0"
      >
        {ctaLabel}
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
