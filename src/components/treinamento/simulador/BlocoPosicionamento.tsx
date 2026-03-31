import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Activity } from 'lucide-react';
import { DISTRITOS_CIDADELA, ESTADOS_CLIENTE, TrainingCase } from './types';

interface Props {
  caso: TrainingCase;
  distrito: string;
  estado: string;
  onDistritoChange: (v: string) => void;
  onEstadoChange: (v: string) => void;
  onNext: () => void;
}

export function BlocoPosicionamento({ caso, distrito, estado, onDistritoChange, onEstadoChange, onNext }: Props) {
  const showHints = caso.nivel === 'guiado';

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Posicione a cliente no mapa da CidaDELA.
      </p>

      <Card className="border-border/30">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-primary" />
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Distrito da CidaDELA</p>
          </div>
          {showHints && (
            <p className="text-xs text-primary/60 italic">Onde esta cliente parece estar no mapa interior?</p>
          )}
          <div className="flex flex-wrap gap-1.5">
            {DISTRITOS_CIDADELA.map(d => (
              <button
                key={d}
                onClick={() => onDistritoChange(d)}
                className={`px-2.5 py-1.5 rounded-md text-xs border transition-all ${
                  distrito === d
                    ? 'bg-primary/15 border-primary/50 text-primary font-medium'
                    : 'border-border/30 text-muted-foreground hover:border-border hover:text-foreground'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/30">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-primary" />
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado do sistema</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ESTADOS_CLIENTE.map(e => (
              <button
                key={e}
                onClick={() => onEstadoChange(e)}
                className={`px-2.5 py-1.5 rounded-md text-xs border transition-all capitalize ${
                  estado === e
                    ? 'bg-primary/15 border-primary/50 text-primary font-medium'
                    : 'border-border/30 text-muted-foreground hover:border-border hover:text-foreground'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={onNext} disabled={!distrito || !estado} className="w-full">
        Avançar <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}
