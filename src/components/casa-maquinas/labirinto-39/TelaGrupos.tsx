import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GrupoEmocional } from './constants';

interface Props {
  grupos: GrupoEmocional[];
  onNext: () => void;
  onPrev: () => void;
}

export function TelaGrupos({ grupos, onNext, onPrev }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground text-center">As 39 Portas Emocionais</h3>
      <p className="text-muted-foreground text-sm text-center">8 grupos, 39 emoções. Conheça o território antes de mapeá-lo.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {grupos.map(g => (
          <Card key={g.nome} className="border-border/20 bg-card/60">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.cor }} />
                {g.nome}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <div className="flex flex-wrap gap-1">
                {g.emocoes.map(e => (
                  <span key={e} className="text-[11px] px-2 py-0.5 rounded-full bg-muted/40 text-muted-foreground">
                    {e}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onPrev} className="flex-1">Voltar</Button>
        <Button onClick={onNext} className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground">
          Iniciar Mapeamento
        </Button>
      </div>
    </div>
  );
}
