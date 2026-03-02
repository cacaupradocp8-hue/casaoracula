import { Badge } from '@/components/ui/badge';
import { BookMarked } from 'lucide-react';
import { ClubeCiclo } from '@/hooks/useClubeLivro';

interface CicloHeaderBlockProps {
  ciclo: ClubeCiclo;
}

export function CicloHeaderBlock({ ciclo }: CicloHeaderBlockProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {ciclo.capa_url ? (
        <div className="w-32 md:w-40 shrink-0 mx-auto md:mx-0">
          <img
            src={ciclo.capa_url}
            alt={ciclo.titulo}
            className="w-full rounded-lg shadow-lg border border-border/50"
          />
        </div>
      ) : (
        <div className="w-32 md:w-40 h-48 shrink-0 mx-auto md:mx-0 bg-muted rounded-lg flex items-center justify-center border border-border/50">
          <BookMarked className="w-12 h-12 text-muted-foreground" />
        </div>
      )}
      <div className="flex-1 text-center md:text-left">
        <div className="flex items-center gap-2 justify-center md:justify-start mb-2 flex-wrap">
          {ciclo.ativo && <Badge variant="secondary">Ciclo Atual</Badge>}
          {ciclo.tema_simbolico && (
            <Badge variant="outline" className="text-gold border-gold/30">
              {ciclo.tema_simbolico}
            </Badge>
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-display text-foreground mb-1">
          {ciclo.titulo}
        </h1>
        {ciclo.subtitulo && (
          <p className="text-muted-foreground mb-2">{ciclo.subtitulo}</p>
        )}
        {ciclo.autor_livro && (
          <p className="text-sm text-gold">{ciclo.autor_livro}</p>
        )}
      </div>
    </div>
  );
}
