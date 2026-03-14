import { BookOpen, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ClubeCiclo } from '@/hooks/useClubeLivro';

interface Props {
  ciclo: ClubeCiclo | null;
  onAcessar: () => void;
}

export function ClubeBannerCicloAtual({ ciclo, onAcessar }: Props) {
  if (!ciclo) {
    return (
      <Card className="border-dashed border-border/25">
        <CardContent className="py-14 text-center">
          <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Nenhuma travessia em curso neste momento.</p>
          <p className="text-muted-foreground/50 text-xs mt-1">O próximo ciclo será anunciado em breve.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-gold/20 bg-gradient-to-br from-gold/[0.04] via-card to-mystic/[0.03] hover:shadow-lg hover:shadow-gold/5 transition-all duration-500">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Book cover */}
          <div className="sm:w-44 shrink-0">
            {ciclo.capa_url ? (
              <img
                src={ciclo.capa_url}
                alt={ciclo.titulo}
                className="w-full h-52 sm:h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-52 sm:h-full bg-muted/50 flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-muted-foreground/30" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-7 flex-1 flex flex-col justify-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold/70 font-medium mb-2.5">
              Ciclo Atual
            </p>
            <h2 className="font-display text-xl md:text-2xl text-foreground mb-1.5 leading-snug">
              {ciclo.titulo}
            </h2>
            {ciclo.subtitulo && (
              <p className="text-sm text-muted-foreground mb-1">{ciclo.subtitulo}</p>
            )}
            {ciclo.autor_livro && (
              <p className="text-xs text-muted-foreground/60 italic mb-5">{ciclo.autor_livro}</p>
            )}
            <Button
              onClick={onAcessar}
              className="w-fit gap-2 bg-gradient-to-r from-gold to-mystic hover:from-gold/90 hover:to-mystic/90 text-primary-foreground shadow-sm"
            >
              Entrar na Travessia
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
