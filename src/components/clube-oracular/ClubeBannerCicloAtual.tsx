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
      <Card className="border-dashed border-border/20 bg-card/30 backdrop-blur-sm">
        <CardContent className="py-16 text-center">
          <BookOpen className="w-10 h-10 text-muted-foreground/25 mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Nenhuma travessia em curso neste momento.</p>
          <p className="text-muted-foreground/40 text-xs mt-1.5">O próximo ciclo será anunciado em breve.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-gold/15 bg-card/40 backdrop-blur-sm hover:-translate-y-1.5 hover:shadow-[0_12px_40px_-10px_hsl(var(--gold)/0.1)] transition-all duration-500">
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
              <div className="w-full h-52 sm:h-full bg-muted/30 flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-muted-foreground/20" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-8 flex-1 flex flex-col justify-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold/60 font-medium mb-3">
              Ciclo Atual
            </p>
            <h2 className="font-display text-xl md:text-2xl text-foreground mb-1.5 leading-snug">
              {ciclo.titulo}
            </h2>
            {ciclo.subtitulo && (
              <p className="text-sm text-muted-foreground mb-1">{ciclo.subtitulo}</p>
            )}
            {ciclo.autor_livro && (
              <p className="text-xs text-muted-foreground/50 italic mb-6">{ciclo.autor_livro}</p>
            )}
            <Button
              onClick={onAcessar}
              className="w-fit gap-2 bg-gradient-to-r from-gold to-mystic hover:scale-105 text-primary-foreground border border-gold/20 transition-all duration-300 shadow-[0_0_20px_-6px_hsl(var(--gold)/0.2)]"
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
