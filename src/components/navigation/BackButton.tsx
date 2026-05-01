import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  /** Path to navigate to. If omitted, uses history -1. */
  to?: string;
  /** Custom click handler — overrides `to`. */
  onClick?: () => void;
  label?: string;
  className?: string;
}

/**
 * Botão de retorno padronizado, discreto, usado em rotas profundas.
 * Mantém cor primary suave + hover sem trocar a paleta.
 */
export function BackButton({ to, onClick, label = 'Voltar', className }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) return onClick();
    if (to) return navigate(to);
    navigate(-1);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={cn(
        'p-0 h-auto -ml-1 mb-2 text-primary/80 hover:text-primary hover:bg-primary/10 transition-colors gap-1',
        className
      )}
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="text-sm">{label}</span>
    </Button>
  );
}
