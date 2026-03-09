import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Porta } from './constants';

interface Props {
  titulo: string;
  subtitulo: string;
  pergunta: string;
  portas: Porta[];
  cor: string;
  reflexao: string;
  onReflexao: (v: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function TelaExploracao({ titulo, subtitulo, pergunta, portas, cor, reflexao, onReflexao, onNext, onPrev }: Props) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-semibold text-foreground">{titulo}</h3>
        <p className="text-sm text-muted-foreground">{subtitulo}</p>
      </div>

      <Card className="border-border/20 bg-card/60">
        <CardContent className="pt-4">
          {portas.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhuma porta neste estado.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {portas.map(p => (
                <span
                  key={p.emocao}
                  className="text-xs px-2.5 py-1 rounded-full border font-medium"
                  style={{ borderColor: cor + '40', color: cor, backgroundColor: cor + '15' }}
                >
                  {p.emocao}
                </span>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{pergunta}</label>
            <Textarea
              value={reflexao}
              onChange={e => onReflexao(e.target.value)}
              className="bg-background/50 border-border/30 text-foreground min-h-[100px] text-sm"
              placeholder="Escreva sua reflexão..."
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
