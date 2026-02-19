// ============================================
// CLUBE DO LIVRO — Bloco Aulas e Encontros
// Cards de aulas vinculadas ao ciclo
// ============================================

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Calendar, ArrowRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ClubeEncontro } from '@/hooks/useClubeLivro';

interface AulaItem {
  id: string;
  titulo: string;
  subtitulo?: string;
  ordem?: number;
  duracao?: string;
}

interface AulasEncontrosBlockProps {
  aulas?: AulaItem[];
  encontros?: ClubeEncontro[];
  onAulaClick?: (aulaId: string) => void;
  onEncontroClick?: (encontroId: string) => void;
}

export function AulasEncontrosBlock({
  aulas = [],
  encontros = [],
  onAulaClick,
  onEncontroClick,
}: AulasEncontrosBlockProps) {
  const hasContent = aulas.length > 0 || encontros.length > 0;

  return (
    <section>
      <h2 className="text-lg font-display text-foreground mb-4 flex items-center gap-2">
        <GraduationCap className="w-5 h-5 text-gold" />
        Aulas e Encontros
      </h2>

      {!hasContent ? (
        <Card className="bg-muted/20 border-dashed">
          <CardContent className="py-8 text-center">
            <GraduationCap className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground italic">Em breve</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              As aulas deste ciclo serão disponibilizadas em breve.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {/* Aulas */}
          {aulas.map((aula) => (
            <Card
              key={aula.id}
              className={cn(
                'transition-all cursor-pointer hover:border-gold/40 group',
              )}
              onClick={() => onAulaClick?.(aula.id)}
            >
              <CardContent className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                    <span className="text-xs font-mono text-gold font-semibold">
                      {aula.ordem ?? '—'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate group-hover:text-gold transition-colors">
                      {aula.titulo}
                    </p>
                    {aula.subtitulo && (
                      <p className="text-xs text-muted-foreground truncate">
                        {aula.subtitulo}
                      </p>
                    )}
                  </div>
                  {aula.duracao && (
                    <Badge variant="outline" className="text-[10px] shrink-0 gap-1">
                      <Clock className="w-3 h-3" />
                      {aula.duracao}
                    </Badge>
                  )}
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Encontros */}
          {encontros.map((encontro) => (
            <Card
              key={encontro.id}
              className="transition-all cursor-pointer hover:border-violet-400/40 group"
              onClick={() => onEncontroClick?.(encontro.id)}
            >
              <CardContent className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate group-hover:text-violet-400 transition-colors">
                      {encontro.titulo}
                    </p>
                    {encontro.data_encontro && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(encontro.data_encontro).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-violet-400 transition-colors shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
