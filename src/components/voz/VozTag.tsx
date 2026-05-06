import { Sparkles } from 'lucide-react';
import { useUserVoz } from '@/hooks/useUserVoz';
import { cn } from '@/lib/utils';

const VOZ_LABELS: Record<string, string> = {
  'fogo-antigo': 'Fogo Antigo',
  'cura-pelo-contato': 'Cura pelo Contato',
  'sopra-historias': 'Sopra Histórias',
  'sonha-para-o-coletivo': 'Sonha para o Coletivo',
  'tece-o-invisivel': 'Tece o Invisível',
  'lembra-caminhos-antigos': 'Lembra Caminhos Antigos',
  'escuta-as-sombras': 'Escuta as Sombras',
};

interface VozTagProps {
  className?: string;
  size?: 'sm' | 'md';
}

/**
 * Tag identitária da Voz Dominante da aluna.
 * Esconde quando não há voz primária definida.
 */
export function VozTag({ className, size = 'md' }: VozTagProps) {
  const { voz_primaria, loading } = useUserVoz();

  if (loading || !voz_primaria) return null;

  const label = VOZ_LABELS[voz_primaria] || voz_primaria.replace(/-/g, ' ');

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/5 text-gold/90 font-medium uppercase tracking-[0.25em]',
        size === 'sm' ? 'px-2.5 py-1 text-[9px]' : 'px-3 py-1.5 text-[10px]',
        className,
      )}
    >
      <Sparkles className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      Voz: <span className="text-gold capitalize">{label}</span>
    </span>
  );
}
