import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookMarked, ArrowRight } from 'lucide-react';
import { ClubeFase } from '@/hooks/useClubeLivro';
import { cn } from '@/lib/utils';

const FASE_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  chamado: { label: 'Chamado', color: 'bg-blue-500/20 text-blue-400' },
  ruptura: { label: 'Ruptura', color: 'bg-red-500/20 text-red-400' },
  reorganizacao: { label: 'Reorganização', color: 'bg-amber-500/20 text-amber-400' },
  integracao: { label: 'Integração', color: 'bg-green-500/20 text-green-400' },
};

interface FasesLeituraBlockProps {
  fases: ClubeFase[];
  onFaseClick: (faseId: string) => void;
}

export function FasesLeituraBlock({ fases, onFaseClick }: FasesLeituraBlockProps) {
  if (!fases || fases.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-display text-foreground mb-4 flex items-center gap-2">
        <BookMarked className="w-5 h-5 text-gold" />
        Fases da Leitura
      </h2>
      <div className="space-y-3">
        {fases.map((fase, index) => {
          const typeConfig = fase.tipo_fase ? FASE_TYPE_CONFIG[fase.tipo_fase] : null;

          return (
            <Card
              key={fase.id}
              className="cursor-pointer transition-all hover:border-gold/50 group"
              onClick={() => onFaseClick(fase.id)}
            >
              <CardContent className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground group-hover:text-gold transition-colors">
                        {fase.titulo}
                      </h3>
                      {typeConfig && (
                        <Badge variant="outline" className={cn('text-xs', typeConfig.color)}>
                          {typeConfig.label}
                        </Badge>
                      )}
                    </div>
                    {(fase.descricao || fase.orientacao_curta) && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {fase.orientacao_curta || fase.descricao}
                      </p>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
