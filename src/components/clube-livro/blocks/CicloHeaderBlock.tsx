import { Badge } from '@/components/ui/badge';
import { BookMarked } from 'lucide-react';
import { ClubeCiclo } from '@/hooks/useClubeLivro';

interface CicloHeaderBlockProps {
  ciclo: ClubeCiclo;
}

export function CicloHeaderBlock({ ciclo }: CicloHeaderBlockProps) {
  return (
    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
      {ciclo.capa_url ? (
        <div className="w-36 md:w-44 shrink-0">
          <img
            src={ciclo.capa_url}
            alt={ciclo.titulo}
            className="w-full rounded-xl shadow-xl shadow-primary/10 border border-border/20 hover:scale-[1.02] transition-transform duration-500"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="w-36 md:w-44 h-52 md:h-60 shrink-0 bg-gradient-to-br from-primary/10 to-mystic/10 rounded-xl flex items-center justify-center border border-border/20 shadow-lg">
          <BookMarked className="w-14 h-14 text-muted-foreground/30" />
        </div>
      )}

      <div className="flex-1 text-center md:text-left space-y-3">
        <div className="flex items-center gap-2 justify-center md:justify-start flex-wrap">
          {ciclo.ativo && (
            <Badge className="bg-primary/15 text-primary border-primary/20 text-[10px] uppercase tracking-wider">
              Ciclo Atual
            </Badge>
          )}
          {ciclo.tema_simbolico && (
            <Badge variant="outline" className="text-gold border-gold/25 text-[10px] uppercase tracking-wider">
              {ciclo.tema_simbolico}
            </Badge>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-display text-foreground tracking-wide leading-tight">
          {ciclo.titulo}
        </h1>

        {ciclo.subtitulo && (
          <p className="text-muted-foreground font-display italic text-base leading-relaxed">
            {ciclo.subtitulo}
          </p>
        )}

        {ciclo.autor_livro && (
          <p className="text-sm text-gold/80 tracking-wide">
            {ciclo.autor_livro}
          </p>
        )}
      </div>
    </div>
  );
}
