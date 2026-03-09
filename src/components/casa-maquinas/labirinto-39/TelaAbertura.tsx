import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Compass, History } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  onStart: () => void;
  history: any[];
  onLoadMapping: (m: any) => void;
}

export function TelaAbertura({ onStart, history, onLoadMapping }: Props) {
  return (
    <div className="space-y-6">
      <Card className="border-primary/10 bg-card/80 text-center">
        <CardContent className="pt-8 pb-8 space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Compass className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Labirinto das 39 Portas</h2>
          <p className="text-primary text-sm font-medium">Qual é seu repertório emocional?</p>
          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
            Cada emoção é uma porta. Algumas estão abertas, outras fechadas, e algumas trancadas.
            Mapear essas portas permite compreender o repertório emocional e identificar bloqueios.
          </p>
          <Button onClick={onStart} className="mt-4 bg-primary hover:bg-primary/80 text-primary-foreground">
            Explorar portas
          </Button>
        </CardContent>
      </Card>

      {history.length > 0 && (
        <Card className="border-border/30 bg-card/60">
          <CardContent className="pt-4 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-2">
              <History className="w-3.5 h-3.5" /> Mapeamentos anteriores
            </div>
            {history.map((m: any) => (
              <button
                key={m.id}
                onClick={() => onLoadMapping(m)}
                className="w-full text-left p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(m.created_at), 'dd/MM/yyyy HH:mm')}
                  </span>
                  <div className="flex gap-2 text-[10px]">
                    <span className="text-green-400">⬤ {m.total_abertas}</span>
                    <span className="text-muted-foreground">⬤ {m.total_fechadas}</span>
                    <span className="text-red-400">⬤ {m.total_trancadas}</span>
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
