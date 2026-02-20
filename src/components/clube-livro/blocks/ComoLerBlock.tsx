import { BookOpen } from 'lucide-react';
import { SymbolicCarouselBlock, CarouselSlide } from './SymbolicCarouselBlock';

interface ComoLerBlockProps {
  texto?: string;
  slides?: CarouselSlide[];
  audioUrl?: string | null;
}

export function ComoLerBlock({ texto, slides = [], audioUrl }: ComoLerBlockProps) {
  return (
    <SymbolicCarouselBlock
      title="Como ler este livro na Casa Orácula"
      icon={<BookOpen className="w-4 h-4" />}
      slides={slides}
      audioUrl={audioUrl}
      fallbackText={texto}
    />
  );
}
