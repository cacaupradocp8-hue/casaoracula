import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ARQUETIPOS } from './constants';

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

export function AtlasApresentacao({ onNext, onPrev }: Props) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-semibold text-foreground">Os 12 Arquétipos</h3>
        <p className="text-sm text-muted-foreground">Conheça as forças antes de mapeá-las</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {ARQUETIPOS.map(a => (
          <Card key={a.nome} className="border-border/20 bg-card/60 hover:border-border/40 transition-colors">
            <CardContent className="pt-3 pb-3 px-3 text-center space-y-1.5">
              <div
                className="mx-auto w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{ backgroundColor: a.cor + '20' }}
              >
                {a.icone}
              </div>
              <div className="text-xs font-semibold text-foreground">{a.nome}</div>
              <div className="text-[10px] text-muted-foreground leading-tight">{a.keywords}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onPrev} className="flex-1">Voltar</Button>
        <Button onClick={onNext} className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground">
          Selecionar Arquétipos
        </Button>
      </div>
    </div>
  );
}
