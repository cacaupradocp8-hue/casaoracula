import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { ClubeCiclo } from '@/hooks/useClubeLivro';

interface CicloAtualCtaBlockProps {
  ciclo: ClubeCiclo;
  onEnter: () => void;
}

export function CicloAtualCtaBlock({ ciclo, onEnter }: CicloAtualCtaBlockProps) {
  return (
    <Card className="border-gold/40 bg-gradient-to-br from-gold/5 to-card">
      <CardContent className="p-5 flex flex-col sm:flex-row items-center gap-4">
        {ciclo.capa_url ? (
          <img
            src={ciclo.capa_url}
            alt={ciclo.titulo}
            className="w-16 h-24 object-cover rounded shadow-md shrink-0"
          />
        ) : (
          <div className="w-16 h-24 bg-muted rounded flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1 text-center sm:text-left">
          <p className="text-xs uppercase tracking-widest text-gold font-medium mb-1">
            Ciclo em curso
          </p>
          <h3 className="font-display text-lg text-foreground leading-snug">
            {ciclo.titulo}
          </h3>
          {ciclo.autor_livro && (
            <p className="text-sm text-muted-foreground">{ciclo.autor_livro}</p>
          )}
        </div>
        <Button
          onClick={onEnter}
          className="bg-gold hover:bg-gold/90 text-primary-foreground shrink-0"
        >
          Entrar no Círculo
        </Button>
      </CardContent>
    </Card>
  );
}
