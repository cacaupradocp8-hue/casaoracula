import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Compass, ShieldAlert, Lock } from 'lucide-react';
import type { DecisaoClinicaResult } from '@/lib/cabine/motorMapaVivo';

interface Props {
  decisao: DecisaoClinicaResult;
  onFollow: () => void;
  onAdjust: () => void;
}

const DECISAO_COLORS: Record<string, string> = {
  manter_direcao: 'border-emerald-500/20 bg-emerald-500/5',
  ajustar_direcao: 'border-amber-500/20 bg-amber-500/5',
  mudar_direcao: 'border-blue-500/20 bg-blue-500/5',
  conter_processo: 'border-red-500/20 bg-red-500/5',
  aprofundar_processo: 'border-primary/20 bg-primary/5',
};

const DECISAO_BADGE: Record<string, string> = {
  manter_direcao: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  ajustar_direcao: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  mudar_direcao: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  conter_processo: 'bg-red-500/20 text-red-300 border-red-500/30',
  aprofundar_processo: 'bg-primary/20 text-primary border-primary/30',
};

const DECISAO_LABEL: Record<string, string> = {
  manter_direcao: 'Manter direção',
  ajustar_direcao: 'Ajustar direção',
  mudar_direcao: 'Mudar direção',
  conter_processo: 'Conter processo',
  aprofundar_processo: 'Aprofundar processo',
};

export function CabineDecisaoSessao({ decisao, onFollow, onAdjust }: Props) {
  return (
    <Card className={`${DECISAO_COLORS[decisao.decisao] || 'border-border/20 bg-card/50'}`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-primary/70" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary/70 font-semibold">
              Decisão da Sessão
            </p>
          </div>
          <Badge variant="outline" className={`text-[9px] px-2 ${DECISAO_BADGE[decisao.decisao] || ''}`}>
            {DECISAO_LABEL[decisao.decisao] || decisao.decisao}
          </Badge>
        </div>

        <p className="text-sm font-medium text-foreground/90">{decisao.justificativa}</p>
        
        <div className="p-2.5 rounded-md bg-muted/20 border border-border/10">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium mb-0.5">
            Impacto clínico
          </p>
          <p className="text-xs text-foreground/80">{decisao.impacto}</p>
        </div>

        {decisao.bloqueio_ferramenta && decisao.aviso_bloqueio && (
          <div className="flex items-start gap-2 p-2.5 rounded-md bg-red-500/5 border border-red-500/15">
            <Lock className="w-3.5 h-3.5 text-red-400/70 mt-0.5 shrink-0" />
            <p className="text-xs text-red-300/80">{decisao.aviso_bloqueio}</p>
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <Button
            onClick={onFollow}
            size="sm"
            className="flex-1 text-xs h-9 bg-primary/80 hover:bg-primary text-primary-foreground"
          >
            Seguir decisão
          </Button>
          <Button
            onClick={onAdjust}
            variant="outline"
            size="sm"
            className="flex-1 text-xs h-9"
          >
            Ajustar manualmente
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
