import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  dinamica: string;
  conflitos: string;
  harmonias: string;
  onDinamica: (v: string) => void;
  onConflitos: (v: string) => void;
  onHarmonias: (v: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function AtlasDinamica({ dinamica, conflitos, harmonias, onDinamica, onConflitos, onHarmonias, onNext, onPrev }: Props) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-semibold text-foreground">Dinâmica entre Arquétipos</h3>
        <p className="text-sm text-muted-foreground">Como essas forças se relacionam?</p>
      </div>

      <Card className="border-border/20 bg-card/60">
        <CardContent className="pt-4 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Como esses arquétipos trabalham juntos?</label>
            <Textarea
              value={dinamica}
              onChange={e => onDinamica(e.target.value)}
              className="bg-background/50 border-border/30 text-foreground text-sm min-h-[80px]"
              placeholder="Descreva a dinâmica geral..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Há arquétipos em conflito?</label>
            <Textarea
              value={conflitos}
              onChange={e => onConflitos(e.target.value)}
              className="bg-background/50 border-border/30 text-foreground text-sm min-h-[60px]"
              placeholder="Quais tensões existem..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Há arquétipos em harmonia?</label>
            <Textarea
              value={harmonias}
              onChange={e => onHarmonias(e.target.value)}
              className="bg-background/50 border-border/30 text-foreground text-sm min-h-[60px]"
              placeholder="Quais se complementam..."
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onPrev} className="flex-1">Voltar</Button>
        <Button onClick={onNext} className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground">Próxima</Button>
      </div>
    </div>
  );
}
