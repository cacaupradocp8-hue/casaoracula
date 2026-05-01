import { useNavigate } from 'react-router-dom';
import { Clock, Sparkles, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCasaMaquinasAccess } from '@/hooks/useCasaMaquinasAccess';
import { cn } from '@/lib/utils';

interface TrialBannerProps {
  variant?: 'banner' | 'inline';
  className?: string;
}

/**
 * Indicador de tempo restante do período de degustação (3 meses) da Casa das Máquinas.
 * Aparece apenas quando a aluna está em trial. Some para assinantes/admin.
 */
export function CasaMaquinasTrialBanner({ variant = 'banner', className }: TrialBannerProps) {
  const access = useCasaMaquinasAccess();
  const navigate = useNavigate();

  if (access.reason !== 'trial_period' || !access.remainingLabel) return null;

  const expiringSoon = !!access.isExpiringSoon;

  if (variant === 'inline') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium',
          expiringSoon
            ? 'border-destructive/40 bg-destructive/10 text-destructive'
            : 'border-primary/30 bg-primary/10 text-primary',
          className
        )}
      >
        <Clock className="w-3.5 h-3.5" />
        <span>Degustação Casa das Máquinas — {access.remainingLabel}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border p-4 md:p-5',
        expiringSoon
          ? 'border-destructive/40 bg-destructive/10'
          : 'border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
            expiringSoon ? 'bg-destructive/20 text-destructive' : 'bg-primary/15 text-primary'
          )}
        >
          {expiringSoon ? <AlertTriangle className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            {expiringSoon
              ? 'Sua degustação está terminando'
              : 'Período de degustação ativo'}
          </p>
          <p className="text-xs text-muted-foreground">
            Acesso completo à Casa das Máquinas — <span className="font-medium text-foreground">{access.remainingLabel}</span>
            {access.trialEndsAt && (
              <> até {access.trialEndsAt.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</>
            )}.
          </p>
        </div>
      </div>
      <Button
        size="sm"
        variant={expiringSoon ? 'default' : 'outline'}
        onClick={() => navigate('/planos')}
        className="shrink-0"
      >
        {expiringSoon ? 'Assinar agora' : 'Ver planos profissionais'}
      </Button>
    </div>
  );
}
