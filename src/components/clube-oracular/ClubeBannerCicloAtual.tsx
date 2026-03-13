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
      <Card className="border-dashed border-border/30">
        <CardContent className="py-12 text-center">
          <BookOpen className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Nenhuma travessia em curso neste momento.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Book cover */}
          <div className="sm:w-40 shrink-0">
            {ciclo.capa_url ? (
              <img
                src={ciclo.capa_url}
                alt={ciclo.titulo}
                className="w-full h-48 sm:h-full object-cover"
              />
            ) : (
              <div className="w-full h-48 sm:h-full bg-muted flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-muted-foreground/40" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-6 flex-1 flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-2">
              Ciclo Atual
            </p>
            <h2 className="font-display text-xl md:text-2xl text-foreground mb-1">
              {ciclo.titulo}
            </h2>
            {ciclo.subtitulo && (
              <p className="text-sm text-muted-foreground mb-1">{ciclo.subtitulo}</p>
            )}
            {ciclo.autor_livro && (
              <p className="text-xs text-muted-foreground/70 italic mb-4">{ciclo.autor_livro}</p>
            )}
            <Button onClick={onAcessar} className="w-fit gap-2">
              Acessar Conteúdo do Ciclo
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
