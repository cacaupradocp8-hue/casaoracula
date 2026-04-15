import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RITMO_LABELS, type RitmoTravessia } from '@/lib/cabine/motorMapaVivo';
import { Activity } from 'lucide-react';

interface Props {
  ritmo: RitmoTravessia;
}

export function MapaVivoRitmo({ ritmo }: Props) {
  const info = RITMO_LABELS[ritmo] || RITMO_LABELS.adequado;

  return (
    <Card className="border-border/20 bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="w-4 h-4 text-muted-foreground" />
          Ritmo da Travessia
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-2">
          <p className={`text-lg font-display font-semibold ${info.cor}`}>
            {info.label}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{info.descricao}</p>
        </div>
      </CardContent>
    </Card>
  );
}
