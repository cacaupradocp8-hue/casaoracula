import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, Compass, Map, Shield, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { LeituraCampo } from '@/lib/cabine/motorOracular';
import type { CartografiaProfile } from '@/pages/casa-maquinas/CabineTerapeutaPage';
import type { MapaVivoState } from '@/lib/cabine/motorMapaVivo';
import { deriveClinicalDecision, type DecisaoClinicaResult } from '@/lib/cabine/motorMapaVivo';
import { CabineDecisaoClinica } from './CabineDecisaoClinica';

const RISCO_BADGE: Record<string, string> = {
  baixo: 'border-emerald-500/20 text-emerald-400',
  moderado: 'border-amber-500/20 text-amber-400',
  elevado: 'border-red-500/20 text-red-400',
};

interface Props {
  leituraCampo: LeituraCampo | null;
  profile: CartografiaProfile | null;
  profileLoading: boolean;
  mapaVivoState: MapaVivoState | null;
  mapaVivoLoading: boolean;
  hasCartography: boolean;
}

export function CabineMapaVivoPanel({
  leituraCampo,
  profile,
  profileLoading,
  mapaVivoState,
  mapaVivoLoading,
  hasCartography,
}: Props) {
  const decisao: DecisaoClinicaResult | null = mapaVivoState
    ? deriveClinicalDecision(mapaVivoState)
    : null;

  if (profileLoading || mapaVivoLoading) {
    return (
      <Card className="border-border/20 bg-card/40">
        <CardContent className="p-5 space-y-4">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-8 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  if (!hasCartography) {
    return (
      <Card className="border-border/15 bg-card/30">
        <CardContent className="p-8">
          <div className="text-center space-y-3">
            <Map className="w-10 h-10 text-muted-foreground/20 mx-auto" />
            <p className="text-sm text-muted-foreground/50 italic">
              Aguardando diagnóstico inicial
            </p>
            <p className="text-[10px] text-muted-foreground/30">
              O mapa será gerado após a Cartografia Psíquica
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!leituraCampo) {
    return (
      <Card className="border-border/15 bg-card/30">
        <CardContent className="p-8">
          <div className="text-center space-y-3">
            <Activity className="w-10 h-10 text-muted-foreground/20 mx-auto" />
            <p className="text-sm text-muted-foreground/50 italic">
              Leitura de campo indisponível
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Estado do Campo — Visual Dominante */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary/70 font-semibold mb-1">
                Estado do Campo
              </p>
              <h3 className="text-base font-display font-semibold text-foreground">
                {leituraCampo.mensagem_estado}
              </h3>
            </div>
            <Badge
              variant="outline"
              className={`text-[9px] px-2 shrink-0 ${RISCO_BADGE[leituraCampo.risco]}`}
            >
              {leituraCampo.risco}
            </Badge>
          </div>

          {/* Direção de condução */}
          <div className="p-3 rounded-lg bg-background/30 border border-primary/10">
            <div className="flex items-start gap-2">
              <Compass className="w-4 h-4 text-primary/60 mt-0.5 shrink-0" />
              <div>
                <p className="text-[9px] text-primary/50 uppercase tracking-wider mb-0.5">
                  Direção de condução
                </p>
                <p className="text-sm text-foreground/90 font-medium">
                  {leituraCampo.mensagem_direcao}
                </p>
              </div>
            </div>
          </div>

          {/* Mapa Vivo data (se disponível) */}
          {mapaVivoState && (
            <div className="grid grid-cols-2 gap-2">
              {mapaVivoState.estado_atual && (
                <div className="p-2.5 rounded-lg bg-background/20 border border-border/10">
                  <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-0.5">Campo atual</p>
                  <p className="text-xs text-foreground/80 font-medium">{mapaVivoState.estado_atual}</p>
                </div>
              )}
              {mapaVivoState.direcao_atual && (
                <div className="p-2.5 rounded-lg bg-background/20 border border-border/10">
                  <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-0.5">Direção clínica</p>
                  <p className="text-xs text-foreground/80 font-medium">{mapaVivoState.direcao_atual}</p>
                </div>
              )}
              {mapaVivoState.tensao_principal && (
                <div className="p-2.5 rounded-lg bg-background/20 border border-border/10">
                  <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-0.5">Tensão principal</p>
                  <p className="text-xs text-foreground/80 font-medium">{mapaVivoState.tensao_principal}</p>
                </div>
              )}
              {mapaVivoState.ritmo_atual && (
                <div className="p-2.5 rounded-lg bg-background/20 border border-border/10">
                  <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-0.5">Ritmo</p>
                  <p className="text-xs text-foreground/80 font-medium">{mapaVivoState.ritmo_atual}</p>
                </div>
              )}
            </div>
          )}

          {/* Permanência */}
          {leituraCampo.mensagem_permanencia && (
            <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/15">
              <div className="flex items-start gap-2">
                <Shield className="w-3.5 h-3.5 text-amber-400/70 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-300/80 italic">
                  {leituraCampo.mensagem_permanencia}
                </p>
              </div>
            </div>
          )}

          {/* Alerta de segurança */}
          {leituraCampo.alerta_seguranca && (
            <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/15">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400/70 mt-0.5 shrink-0" />
                <p className="text-xs text-red-300/80">
                  {leituraCampo.alerta_seguranca}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Decisão Clínica detalhada */}
      <CabineDecisaoClinica leitura={leituraCampo} profile={profile} />
    </div>
  );
}
