import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * VisitorEscapeNav
 *
 * Barra discreta fixa para que a visitante nunca fique presa em páginas
 * de venda (Planos / Formação). Sempre oferece volta para a Casa e para a
 * Sala da Visitante.
 */
export function VisitorEscapeNav() {
  const navigate = useNavigate();

  return (
    <div className="fixed top-3 left-3 right-3 z-50 flex items-center justify-between gap-2 pointer-events-none">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/sala-da-visitante')}
        className="pointer-events-auto bg-background/70 backdrop-blur-md border border-border/50 text-foreground/90 hover:text-foreground hover:bg-background/90 rounded-full h-9 px-4 text-xs uppercase tracking-widest"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-2" />
        Sala da Visitante
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/')}
        className="pointer-events-auto bg-background/70 backdrop-blur-md border border-border/50 text-foreground/90 hover:text-foreground hover:bg-background/90 rounded-full h-9 px-4 text-xs uppercase tracking-widest"
      >
        <Home className="w-3.5 h-3.5 mr-2" />
        Casa
      </Button>
    </div>
  );
}
