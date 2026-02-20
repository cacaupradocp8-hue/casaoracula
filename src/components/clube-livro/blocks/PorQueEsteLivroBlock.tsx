import { Sparkles } from 'lucide-react';
import { SymbolicCarouselBlock, CarouselSlide } from './SymbolicCarouselBlock';

interface PorQueEsteLivroBlockProps {
  texto?: string;
  slides?: CarouselSlide[];
  audioUrl?: string | null;
}

export function PorQueEsteLivroBlock({ texto, slides = [], audioUrl }: PorQueEsteLivroBlockProps) {
  return (
    <SymbolicCarouselBlock
      title="Por que este livro está aqui"
      icon={<Sparkles className="w-4 h-4" />}
      slides={slides}
      audioUrl={audioUrl}
      fallbackText={texto}
      className="border-gold/20"
    />
  );
}
