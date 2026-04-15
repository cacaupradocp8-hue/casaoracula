import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Play, AlertCircle, Map, Compass, Shield, AlertTriangle, Activity } from 'lucide-react';
import type { ClienteComStatus, CartografiaProfile } from '@/pages/casa-maquinas/CabineTerapeutaPage';
import type { LeituraCampo } from '@/lib/cabine/motorOracular';
import { deriveClinicalDecision, type MapaVivoState, type DecisaoClinicaResult } from '@/lib/cabine/motorMapaVivo';
import { CabineDecisaoClinica } from './CabineDecisaoClinica';
import { CabineDecisaoSessao } from './CabineDecisaoSessao';
import { useMapaVivoLive } from '@/hooks/useMapaVivoLive';
import { useNavigate } from 'react-router-dom';

const RISCO_BADGE: Record<string, string> = {
  baixo: 'border-emerald-500/20 text-emerald-400',
  moderado: 'border-amber-500/20 text-amber-400',
  elevado: 'border-red-500/20 text-red-400',
};

interface Props {
  cliente: ClienteComStatus;
  profile: CartografiaProfile | null;
  profileLoading: boolean;
  leituraCampo: LeituraCampo | null;
  onStartSession: (withoutProfile: boolean) => void;
}

export function CabinePreparacao({ cliente, profile, profileLoading, leituraCampo, onStartSession }: Props) {
  const navigate = useNavigate();
  const { state: mapaState, fetchMapaVivo, loading: mapaLoading } = useMapaVivoLive();
  const [manualOverride, setManualOverride] = useState(false);

  useEffect(() => {
    if (cliente.id) {
      fetchMapaVivo(cliente.id);
    }
  }, [cliente.id, fetchMapaVivo]);

  const decisao: DecisaoClinicaResult | null = mapaState
    ? deriveClinicalDecision(mapaState)
    : null;

  const handleFollowDecision = useCallback(() => {
    onStartSession(false);
  }, [onStartSession]);

  const handleAdjustManually = useCallback(() => {
    setManualOverride(true);
  }, []);

  return (
    <div className="space-y-4">
      {/* Identidade */}
      <Card className="border-border/20 bg-card/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="font-display font-semibold text-foreground">{cliente.nome}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="secondary" className="text-[9px]">{cliente.status || 'ativo'}</Badge>
                {cliente.lastSessionDate && (
                  <span className="text-[10px] text-muted-foreground">
                    Último atendimento: {new Date(cliente.lastSessionDate).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>
            </div>
            {mapaState && (
              <Button
                variant="ghost"
                size="sm"
                className="text-[10px] text-muted-foreground/50 gap-1"
                onClick={() => navigate(`/casa-das-maquinas/mapa-vivo/${cliente.id}`)}
              >
                <Map className="w-3 h-3" />
                Mapa Vivo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 🧭 DECISÃO DA SESSÃO — Motor do Mapa Vivo */}
      {mapaLoading ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-5 space-y-3">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ) : decisao && !manualOverride ? (
        <CabineDecisaoSessao
          decisao={decisao}
          onFollow={handleFollowDecision}
          onAdjust={handleAdjustManually}
        />
      ) : null}

      {/* CARD FIXO — ESTADO DO CAMPO (visual dominante) */}
      {profileLoading ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-5 space-y-3">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      ) : leituraCampo ? (
        <Card className="border-primary/25 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-5 space-y-4">
            {/* Estado principal — visual dominante */}
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
              {/* Risco discreto */}
              <Badge
                variant="outline"
                className={`text-[9px] px-2 shrink-0 ${RISCO_BADGE[leituraCampo.risco]}`}
              >
                {leituraCampo.risco}
              </Badge>
            </div>

            {/* Direção atual */}
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

            {/* Mensagem de permanência (se existir) */}
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
      ) : (
        /* SEM LEITURA → redirecionar para Cartografia (obrigatório) */
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="p-5">
            <div className="text-center py-4 space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-400/50 mx-auto" />
              <p className="text-sm text-foreground/70 font-medium">
                Esta cliente ainda não possui leitura de campo.
              </p>
              <p className="text-xs text-muted-foreground/60">
                Toda sessão precisa de um Estado do Campo disponível.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                onClick={() => navigate('/casa-das-maquinas/ferramentas/cartografia')}
              >
                Criar leitura agora
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TOMADA DE DECISÃO CLÍNICA — detalhes adicionais */}
      {leituraCampo && !profileLoading && (
        <CabineDecisaoClinica
          leitura={leituraCampo}
          profile={profile}
        />
      )}

      {/* Botão Iniciar Sessão — só aparece se há leitura */}
      {leituraCampo && (manualOverride || !decisao) && (
        <Button
          onClick={() => onStartSession(false)}
          disabled={decisao?.bloqueio_ferramenta && !manualOverride}
          className="w-full h-12 text-sm font-display font-semibold bg-primary hover:bg-primary/80 text-primary-foreground gap-2"
        >
          <Play className="w-4 h-4" />
          Iniciar Sessão
        </Button>
      )}
    </div>
  );
}
