import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PremiumGateProps {
  children: ReactNode;
  featureName?: string;
}

/**
 * Wraps premium content. If user is free-tier, shows an elegant gate
 * inviting them to unlock the full experience.
 */
export function PremiumGate({ children, featureName }: PremiumGateProps) {
  const { isPremium } = usePremiumAccess();
  const navigate = useNavigate();

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
          <div className="relative w-20 h-20 rounded-full bg-card border border-primary/30 flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h2 className="text-2xl font-display font-semibold text-foreground">
            Área Premium
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {featureName
              ? `"${featureName}" faz parte da experiência completa da Casa Orácula.`
              : 'Esse recurso faz parte da experiência completa da Casa Orácula.'}
          </p>
        </div>

        {/* CTA */}
        <Button
          variant="gold"
          size="lg"
          className="w-full"
          onClick={() => navigate('/desbloqueie')}
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Quero desbloquear
        </Button>
      </div>
    </div>
  );
}
