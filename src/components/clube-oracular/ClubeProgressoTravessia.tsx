import { Map } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Props {
  progresso: number;
  totalTerritorios: number;
  explorados: number;
}

export function ClubeProgressoTravessia({ progresso, totalTerritorios, explorados }: Props) {
  const percent = Math.round(progresso * 100);

  return (
    <Card className="border-border/12 bg-card/40 backdrop-blur-sm hover:-translate-y-1.5 hover:shadow-[0_10px_30px_-8px_hsl(var(--primary)/0.08)] transition-all duration-500">
      <CardContent className="p-7">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/12 flex items-center justify-center">
            <Map className="w-4 h-4 text-primary" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 font-medium">
            Sua Travessia no Ciclo
          </p>
        </div>
        <Progress value={percent} className="h-2 mb-3" />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground/60">
            {explorados} de {totalTerritorios} territórios
          </p>
          <p className="text-xs font-medium text-gold">{percent}%</p>
        </div>
      </CardContent>
    </Card>
  );
}
