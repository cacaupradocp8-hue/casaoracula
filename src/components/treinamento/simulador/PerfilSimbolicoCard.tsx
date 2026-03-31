import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, MapPin, Activity, TrendingUp } from 'lucide-react';
import { PerfilSimbolico } from './scoringEngine';

interface Props {
  perfil: PerfilSimbolico;
}

export function PerfilSimbolicoCard({ perfil }: Props) {
  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-medium text-primary/80 uppercase tracking-wider">Perfil Simbólico Emergente</p>
            <p className="text-[10px] text-muted-foreground">Baseado na leitura do caso</p>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-primary/60 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Padrão dominante</p>
              <p className="text-sm text-foreground capitalize">{perfil.padrao_dominante}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Activity className="w-3.5 h-3.5 text-primary/60 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Estado atual</p>
              <p className="text-sm text-foreground capitalize">{perfil.estado_atual}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-primary/60 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Vetor de crescimento</p>
              <p className="text-sm text-foreground">{perfil.vetor_crescimento}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
