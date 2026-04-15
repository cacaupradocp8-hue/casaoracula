import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DIRECAO_CLINICA, type MapaVivoState } from '@/lib/cabine/motorMapaVivo';
import { Compass } from 'lucide-react';

interface Props {
  state: MapaVivoState;
}

export function MapaVivoDirecaoClinica({ state }: Props) {
  const dir = state.direcao_atual || '';
  const info = DIRECAO_CLINICA[dir] || DIRECAO_CLINICA['sustentacao'];

  if (!info) return null;

  return (
    <Card className="border-border/20 bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Compass className="w-4 h-4 text-muted-foreground" />
          Direção Clínica
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-emerald-400/80 font-semibold mb-1">O que sustentar</p>
          <p className="text-xs text-foreground/90">{info.sustentar}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-red-400/80 font-semibold mb-1">O que evitar</p>
          <p className="text-xs text-foreground/90">{info.evitar}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-primary/80 font-semibold mb-1">Próxima direção</p>
          <p className="text-xs text-foreground/90">{info.proxima}</p>
        </div>
      </CardContent>
    </Card>
  );
}
