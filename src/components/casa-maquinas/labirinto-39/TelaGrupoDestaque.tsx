import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface GrupoStat {
  nome: string;
  cor: string;
  abertas: number;
  fechadas: number;
  trancadas: number;
}

interface Props {
  titulo: string;
  grupo: GrupoStat | undefined;
  pergunta: string;
  reflexao: string;
  onReflexao: (v: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function TelaGrupoDestaque({ titulo, grupo, pergunta, reflexao, onReflexao, onNext, onPrev }: Props) {
  if (!grupo) return null;

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-semibold text-foreground">{titulo}</h3>
      </div>

      <Card className="border-border/20 bg-card/60">
        <CardContent className="pt-4 space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-5 h-5 rounded-full" style={{ backgroundColor: grupo.cor }} />
            <div>
              <div className="text-base font-semibold text-foreground">{grupo.nome}</div>
              <div className="text-xs text-muted-foreground">
                {grupo.abertas} abertas · {grupo.fechadas} fechadas · {grupo.trancadas} trancadas
              </div>
            </div>
          </div>

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
