import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Compass, Activity, Shield } from 'lucide-react';
import type { LeituraCampo } from '@/lib/cabine/motorOracular';

interface Props {
  leitura: LeituraCampo;
}

const RISCO_COLORS = {
  baixo: 'border-emerald-500/20 text-emerald-400',
  moderado: 'border-amber-500/20 text-amber-400',
  elevado: 'border-red-500/20 text-red-400',
};

const RISCO_BG = {
  baixo: 'bg-emerald-500/5',
  moderado: 'bg-amber-500/5',
  elevado: 'bg-red-500/5',
};

export function CabineEstadoCampo({ leitura }: Props) {
  return (
    <Card className="border-primary/25 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary/70 font-semibold">
            Estado do Campo
          </p>
          <Badge
            variant="outline"
            className={`text-[9px] px-2 ${RISCO_COLORS[leitura.risco]}`}
          >
            Risco {leitura.risco}
          </Badge>
        </div>

        {/* Estado principal — elemento central */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-display font-semibold text-foreground">
              {leitura.mensagem_estado}
            </h3>
          </div>
        </div>

        {/* Direção de condução */}
        <div className={`p-3 rounded-lg ${RISCO_BG[leitura.risco]} border border-primary/10`}>
          <div className="flex items-start gap-2">
            <Compass className="w-4 h-4 text-primary/60 mt-0.5 shrink-0" />
            <div>
              <p className="text-[9px] text-primary/50 uppercase tracking-wider mb-0.5">
                Direção de condução
              </p>
              <p className="text-sm text-foreground/90 font-medium">
                {leitura.mensagem_direcao}
              </p>
            </div>
          </div>
        </div>

        {/* Mensagem de permanência */}
        {leitura.mensagem_permanencia && (
          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/15">
            <div className="flex items-start gap-2">
              <Shield className="w-3.5 h-3.5 text-amber-400/70 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-300/80 italic">
                {leitura.mensagem_permanencia}
              </p>
            </div>
          </div>
        )}

        {/* Alerta de segurança */}
        {leitura.alerta_seguranca && (
          <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/15">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400/70 mt-0.5 shrink-0" />
              <p className="text-xs text-red-300/80">
                {leitura.alerta_seguranca}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
