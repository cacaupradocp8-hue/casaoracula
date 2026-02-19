import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, MessageCircle, ArrowRight } from 'lucide-react';
import { ClubeEncontro } from '@/hooks/useClubeLivro';

interface EncontrosBlockProps {
  encontros: ClubeEncontro[];
  onNavigate: () => void;
}

export function EncontrosBlock({ encontros, onNavigate }: EncontrosBlockProps) {
  if (!encontros || encontros.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-display text-foreground mb-4 flex items-center gap-2">
        <Video className="w-5 h-5 text-gold" />
        Encontros do Círculo
      </h2>
      <Card className="bg-muted/30">
        <CardContent className="py-4">
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={onNavigate}
          >
            <span className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              {encontros.length} {encontros.length === 1 ? 'encontro' : 'encontros'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
