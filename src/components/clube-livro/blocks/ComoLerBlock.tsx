import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

interface ComoLerBlockProps {
  texto: string;
}

export function ComoLerBlock({ texto }: ComoLerBlockProps) {
  return (
    <Card className="bg-muted/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Como ler este livro na Casa Orácula
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
