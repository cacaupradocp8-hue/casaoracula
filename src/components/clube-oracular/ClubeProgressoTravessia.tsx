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
    <Card className="border-border/20">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Map className="w-4 h-4 text-primary" />
          <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-medium">
            Sua Travessia no Ciclo Atual
          </p>
        </div>
        <Progress value={percent} className="h-2 mb-2" />
        <p className="text-xs text-muted-foreground">
          {percent}% concluído — Você explorou {explorados} de {totalTerritorios} territórios.
        </p>
      </CardContent>
    </Card>
  );
}
