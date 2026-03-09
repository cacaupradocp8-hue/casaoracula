import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ARQUETIPOS } from './constants';

interface Props {
  dominante: { nome: string; val: number } | undefined;
  reflexao: string;
  onReflexao: (v: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function AtlasDominante({ dominante, reflexao, onReflexao, onNext, onPrev }: Props) {
  const arq = dominante ? ARQUETIPOS.find(a => a.nome === dominante.nome) : undefined;

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-semibold text-foreground">Arquétipo Dominante</h3>
        <p className="text-sm text-muted-foreground">A força mais ativa na sua psique</p>
      </div>

      <Card className="border-primary/10 bg-card/80">
        <CardContent className="pt-4 space-y-4">
          {arq ? (
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: arq.cor + '20' }}
              >
                {arq.icone}
              </div>
              <div>
                <div className="text-base font-bold text-foreground">{arq.nome}</div>
                <div className="text-xs text-muted-foreground">Atividade: {dominante!.val}/10</div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum arquétipo selecionado ainda.</p>
          )}

          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Como esse arquétipo molda sua vida?</label>
            <Textarea
              value={reflexao}
              onChange={e => onReflexao(e.target.value)}
              className="bg-background/50 border-border/30 text-foreground text-sm min-h-[100px]"
              placeholder="Reflita sobre a influência desse arquétipo..."
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
