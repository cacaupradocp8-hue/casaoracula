import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface PorQueEsteLivroBlockProps {
  texto: string;
}

export function PorQueEsteLivroBlock({ texto }: PorQueEsteLivroBlockProps) {
  return (
    <Card className="bg-card/50 border-gold/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm uppercase tracking-widest text-gold flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Por que este livro está aqui
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {texto}
        </p>
      </CardContent>
    </Card>
  );
}
