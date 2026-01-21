import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/layout/Logo';
import { Sparkles, ArrowRight } from 'lucide-react';
import { getPortal } from '@/types/portal';
import { useCopy } from '@/hooks/useCopy';

export default function Welcome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getCopyByKey } = useCopy();
  const { onboardingCompleted, isLoading: onboardingLoading } = useOnboarding();

  const isAdmin = user?.portal === 'admin';

  // Redirect ALL users to /jornada (Meu Caminho) - the real home
  // Welcome page is now deprecated - users go directly to their journey
  useEffect(() => {
    if (!onboardingLoading && user) {
      // Non-completed onboarding users go to onboarding first
      if (!onboardingCompleted && !isAdmin) {
        navigate('/onboarding', { replace: true });
        return;
      }
      
      // ALL users (including visitors) go to /jornada
      // This page should not be a destination anymore
      navigate('/jornada', { replace: true });
    }
  }, [onboardingLoading, onboardingCompleted, user, isAdmin, navigate]);

  if (!user || onboardingLoading) return null;

  const portal = getPortal(user.portal);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Logo size="xl" variant="vertical" />
        </div>

        {/* Welcome Message */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm text-gold font-medium">{portal.name}</span>
          </div>
          
          <h1 className="font-display text-3xl md:text-4xl font-light text-foreground">
            Bem-vinda de volta, <br />
            <span className="text-gold-gradient font-semibold">{user.name}</span>
          </h1>
          
          <p className="text-muted-foreground max-w-md mx-auto">
            {getCopyByKey('welcome_mensagem', 'Você não entrou para consumir conteúdo. Entrou para atravessar processos com estrutura, linguagem e cuidado simbólico.')}
          </p>
        </div>

        {/* Quote */}
        <blockquote className="font-display text-lg italic text-muted-foreground border-l-2 border-gold/30 pl-4 text-left mx-auto max-w-sm">
          "{getCopyByKey('triade_completa', 'Ego organiza a experiência • Neuroplasticidade sustenta o processo • A Alma orienta a travessia')}"
          <footer className="text-xs text-muted-foreground mt-1 not-italic">
            {getCopyByKey('triade_assinatura', '— Tríade Metodológica ORÁCULA')}
          </footer>
        </blockquote>

        {/* Enter Button */}
        <Button 
          variant="gold" 
          size="lg" 
          onClick={() => navigate('/jornada')}
          className="gap-2 text-lg px-8"
        >
          {getCopyByKey('btn_atravessar_limiar', 'Atravessar o limiar')}
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
