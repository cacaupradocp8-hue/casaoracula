import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ARQUETIPOS } from './constants';

interface Props {
  naoSelecionados: string[];
  dormindo: string;
  oQuePoderia: string;
  onDormindo: (v: string) => void;
  onOQuePoderia: (v: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function AtlasDormindo({ naoSelecionados, dormindo, oQuePoderia, onDormindo, onOQuePoderia, onNext, onPrev }: Props) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-semibold text-foreground">Arquétipo Dormindo</h3>
        <p className="text-sm text-muted-foreground">Há algum arquétipo que está dormindo?</p>
      </div>

      <Card className="border-border/20 bg-card/60">
        <CardContent className="pt-4 space-y-4">
          <p className="text-xs text-muted-foreground">Arquétipos não selecionados — possíveis adormecidos:</p>
          <div className="flex flex-wrap gap-1.5">
            {naoSelecionados.map(nome => {
              const arq = ARQUETIPOS.find(a => a.nome === nome);
              const sel = dormindo === nome;
              return (
                <button
                  key={nome}
                  onClick={() => onDormindo(sel ? '' : nome)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1 ${
                    sel
                      ? 'border-primary bg-primary/10 text-primary font-semibold'
                      : 'border-border/20 text-muted-foreground hover:border-border/40'
                  }`}
                >
                  <span>{arq?.icone}</span> {nome}
                </button>
              );
            })}
          </div>

          {dormindo && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">
                O que {dormindo} poderia trazer para sua vida?
              </label>
              <Textarea
                value={oQuePoderia}
                onChange={e => onOQuePoderia(e.target.value)}
                className="bg-background/50 border-border/30 text-foreground text-sm min-h-[80px]"
                placeholder="Reflita sobre o potencial desse arquétipo..."
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onPrev} className="flex-1">Voltar</Button>
        <Button onClick={onNext} className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground">
          Visualizar Atlas
        </Button>
      </div>
    </div>
  );
}
