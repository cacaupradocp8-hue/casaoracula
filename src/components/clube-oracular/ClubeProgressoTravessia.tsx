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
    <Card className="border-border/15 hover:border-primary/15 transition-colors duration-300">
      <CardContent className="p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/15 to-mystic/10 flex items-center justify-center">
            <Map className="w-4 h-4 text-primary" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
            Sua Travessia no Ciclo
          </p>
        </div>
        <Progress value={percent} className="h-2 mb-3" />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {explorados} de {totalTerritorios} territórios
          </p>
          <p className="text-xs font-medium text-foreground">{percent}%</p>
        </div>
      </CardContent>
    </Card>
  );
}
