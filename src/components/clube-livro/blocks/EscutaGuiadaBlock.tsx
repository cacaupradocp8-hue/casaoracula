import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Headphones, ArrowRight } from 'lucide-react';
import { ClubeEscuta } from '@/hooks/useClubeLivro';

interface EscutaGuiadaBlockProps {
  escutas: ClubeEscuta[];
  onNavigate: () => void;
}

export function EscutaGuiadaBlock({ escutas, onNavigate }: EscutaGuiadaBlockProps) {
  if (!escutas || escutas.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-display text-foreground mb-4 flex items-center gap-2">
        <Headphones className="w-5 h-5 text-gold" />
        Escuta Guiada
      </h2>
      <Card className="bg-muted/30">
        <CardContent className="py-4">
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={onNavigate}
          >
            <span className="flex items-center gap-2">
              <Headphones className="w-4 h-4" />
              {escutas.length} {escutas.length === 1 ? 'áudio/texto' : 'áudios/textos'} disponíveis
            </span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
