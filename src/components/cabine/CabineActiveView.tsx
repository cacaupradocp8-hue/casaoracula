import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Compass, ShieldCheck, ShieldAlert, ShieldX, Lock, Play, Pen, VolumeX, ChevronDown, ChevronUp, ArrowLeft, AlertTriangle, Shield, Eye, Map, Clock, ChevronRight, UserPlus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { LeituraCampo } from '@/lib/cabine/motorOracular';
import type { MapaVivoState, DecisaoClinicaResult } from '@/lib/cabine/motorMapaVivo';
import type { CartografiaProfile, SessionData, CabineMode, ClienteComStatus } from '@/pages/casa-maquinas/CabineTerapeutaPage';
import { deriveClinicalDecision } from '@/lib/cabine/motorMapaVivo';
import { CabineSessaoViva } from './CabineSessaoViva';
import { CabineIntegracao } from './CabineIntegracao';
import { CabineDecisaoClinica } from './CabineDecisaoClinica';
import type { FluxoClinicoResult } from '@/lib/cabine/motorSessaoVivo';

interface Props {
  cliente: ClienteComStatus;
  profile: CartografiaProfile | null;
  leituraCampo: LeituraCampo | null;
  mapaVivoState: MapaVivoState | null;
  mode: CabineMode;
  sessionData: SessionData;
  setSessionData: (data: SessionData | ((prev: SessionData) => SessionData)) => void;
  sessionStartedAt: Date | null;
  savedSessionId: string | null;
  currentFluxo: FluxoClinicoResult | null;
  onStartSession: (withoutProfile: boolean) => void;
  onEndSession: () => void;
  onFluxoChange: (f: FluxoClinicoResult | null) => void;
  onBack: () => void;
}

const RISCO_STYLES: Record<string, { bg: string; text: string; Icon: typeof ShieldCheck }> = {
  baixo: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', Icon: ShieldCheck },
  moderado: { bg: 'bg-amber-500/10', text: 'text-amber-400', Icon: ShieldAlert },
  elevado: { bg: 'bg-red-500/10', text: 'text-red-400', Icon: ShieldX },
};

export function CabineActiveView({
  cliente,
  profile,
  leituraCampo,
  mapaVivoState,
  mode,
  sessionData,
  setSessionData,
  sessionStartedAt,
  savedSessionId,
  currentFluxo,
  onStartSession,
  onEndSession,
  onFluxoChange,
  onBack,
}: Props) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const decisao: DecisaoClinicaResult | null = mapaVivoState
    ? deriveClinicalDecision(mapaVivoState)
    : null;

  const riscoStyle = leituraCampo
    ? RISCO_STYLES[leituraCampo.risco] || RISCO_STYLES.baixo
    : RISCO_STYLES.baixo;
  const RiscoIcon = riscoStyle.Icon;

  // During active session — full screen session view
  if (mode === 'sessao' && sessionStartedAt) {
    return (
      <div className="min-h-[calc(100vh-2rem)] flex flex-col">
        <CabineSessaoViva
          cliente={cliente}
          profile={profile}
          sessionData={sessionData}
          setSessionData={setSessionData}
          startedAt={sessionStartedAt}
          leituraCampo={leituraCampo}
          mapaVivoState={mapaVivoState}
          onEnd={onEndSession}
          onFluxoChange={onFluxoChange}
        />
      </div>
    );
  }

  // Integration mode
  if (mode === 'integracao' && savedSessionId) {
    return (
      <CabineIntegracao
        cliente={cliente}
        sessionId={savedSessionId}
        sessionData={sessionData}
        leituraCampo={leituraCampo}
        mapaVivoState={mapaVivoState}
        fluxoFinal={currentFluxo}
        onDone={onBack}
      />
    );
  }

  // PREPARAÇÃO — Premium 3-column cockpit
  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Top bar — client name + back */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground/40 hover:text-foreground hover:bg-card/60 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-display font-bold text-foreground tracking-tight">
              {cliente.nome}
            </h2>
            {cliente.lastSessionDate && (
              <p className="text-[10px] text-muted-foreground/40">
                Último atendimento: {new Date(cliente.lastSessionDate).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
        </div>

        {leituraCampo && (
          <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full', riscoStyle.bg)}>
            <RiscoIcon className={cn('w-3.5 h-3.5', riscoStyle.text)} />
            <span className={cn('text-xs font-semibold uppercase', riscoStyle.text)}>
              Risco {leituraCampo.risco}
            </span>
          </div>
        )}
      </div>

      {!leituraCampo ? (
        /* No field reading — diagnostic needed */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-400/60" />
          </div>
          <h3 className="text-lg font-display font-semibold text-foreground mb-1">
            Diagnóstico necessário
          </h3>
          <p className="text-sm text-muted-foreground/50 max-w-sm mb-4">
            Para ativar a leitura do campo, esta cliente precisa da Cartografia Psíquica Orácula
          </p>
          <Button
            variant="outline"
            className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
            onClick={() => {
              window.location.href = `/ferramenta/cartografia-psiquica-oracula?clienteId=${cliente.id}&fromCabine=true`;
            }}
          >
            Iniciar Diagnóstico
          </Button>
        </div>
      ) : (
        /* ═══ 3-COLUMN COCKPIT ═══ */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ─── LEFT: CAMPO ─── */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-card/50 border border-border/15 space-y-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/40 font-semibold">
                Campo
              </p>

              {/* Estado */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/12 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] text-primary/50 uppercase tracking-wider mb-0.5">Estado</p>
                  <p className="text-base font-display font-semibold text-foreground leading-snug">
                    {leituraCampo.mensagem_estado}
                  </p>
                </div>
              </div>

              {/* Direção */}
              <div className="p-3 rounded-xl bg-background/30 border border-primary/10">
                <div className="flex items-start gap-2">
                  <Compass className="w-4 h-4 text-primary/50 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[9px] text-primary/40 uppercase tracking-wider mb-0.5">Direção</p>
                    <p className="text-sm text-foreground/85 font-medium">
                      {leituraCampo.mensagem_direcao}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mapa Vivo mini */}
              {mapaVivoState?.estado_atual && (
                <div className="grid grid-cols-2 gap-2">
                  {mapaVivoState.estado_atual && (
                    <div className="p-2 rounded-lg bg-background/20 border border-border/10">
                      <p className="text-[8px] text-muted-foreground/40 uppercase tracking-wider">Campo</p>
                      <p className="text-[11px] text-foreground/70 font-medium mt-0.5">{mapaVivoState.estado_atual}</p>
                    </div>
                  )}
                  {mapaVivoState.tensao_principal && (
                    <div className="p-2 rounded-lg bg-background/20 border border-border/10">
                      <p className="text-[8px] text-muted-foreground/40 uppercase tracking-wider">Tensão</p>
                      <p className="text-[11px] text-foreground/70 font-medium mt-0.5">{mapaVivoState.tensao_principal}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Permanência */}
              {leituraCampo.mensagem_permanencia && (
                <div className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/12">
                  <div className="flex items-start gap-1.5">
                    <Shield className="w-3 h-3 text-amber-400/60 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-amber-300/70 italic leading-relaxed">
                      {leituraCampo.mensagem_permanencia}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ─── CENTER: DECISÃO ─── */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-gradient-to-b from-primary/5 to-primary/10 border border-primary/15 space-y-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-primary/60 font-semibold">
                Decisão
              </p>

              {/* Can deepen? */}
              {decisao && (
                <div className="space-y-3">
                  <div className={cn(
                    'p-3 rounded-xl border',
                    decisao.decisao === 'aprofundar_processo'
                      ? 'bg-emerald-500/8 border-emerald-500/15'
                      : decisao.decisao === 'conter_processo'
                        ? 'bg-red-500/8 border-red-500/15'
                        : 'bg-amber-500/8 border-amber-500/15'
                  )}>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-1">Recomendação</p>
                    <p className="text-sm font-medium text-foreground/90">{decisao.justificativa}</p>
                  </div>
                </div>
              )}

              {/* Nível de intervenção */}
              <div className="p-3 rounded-xl bg-background/30 border border-primary/10">
                <p className="text-[9px] text-primary/40 uppercase tracking-wider mb-1">Ação Recomendada</p>
                <p className="text-sm text-foreground/85">{leituraCampo.mensagem_direcao}</p>
              </div>

              {/* Alerta */}
              {leituraCampo.alerta_seguranca && (
                <div className="p-2.5 rounded-lg bg-red-500/5 border border-red-500/12">
                  <div className="flex items-start gap-1.5">
                    <AlertTriangle className="w-3 h-3 text-red-400/60 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-red-300/70 leading-relaxed">
                      {leituraCampo.alerta_seguranca}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ─── RIGHT: AÇÃO ─── */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-card/50 border border-border/15 space-y-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/40 font-semibold">
                Ação
              </p>

              {/* Diagnóstico pendente — bloco fixo */}
              {!cliente.has_initial_cartography && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400/60 shrink-0" />
                    <p className="text-xs text-foreground/70 font-medium">
                      Diagnóstico inicial pendente
                    </p>
                  </div>
                  <p className="text-[10px] text-muted-foreground/50 leading-relaxed">
                    Sessão clínica requer Cartografia Psíquica.
                  </p>
                  <Button
                    onClick={() => navigate(`/ferramenta/cartografia-psiquica-oracula?clienteId=${cliente.id}&fromCabine=true`)}
                    className="w-full h-10 text-xs font-medium bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded-xl gap-1.5"
                    variant="outline"
                  >
                    Iniciar Diagnóstico Inicial
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}

              {/* Primary CTA */}
              <Button
                onClick={() => onStartSession(false)}
                className="w-full h-12 text-sm font-display font-semibold bg-primary hover:bg-primary/85 text-primary-foreground rounded-xl gap-2 shadow-[0_0_25px_-5px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_35px_-5px_hsl(var(--primary)/0.5)] transition-all duration-300"
              >
                <Play className="w-4 h-4" />
                Iniciar Sessão
              </Button>

              {/* Secondary actions — hidden until session starts but shown as references */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="h-10 text-xs rounded-xl border-border/20 text-muted-foreground/60 hover:text-foreground gap-1.5"
                  disabled
                >
                  <Pen className="w-3.5 h-3.5" />
                  Registrar
                </Button>
                <Button
                  variant="outline"
                  className="h-10 text-xs rounded-xl border-border/20 text-muted-foreground/60 hover:text-foreground gap-1.5"
                  disabled
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  Silenciar
                </Button>
              </div>

              {/* Session without profile */}
              {!profile && cliente.has_initial_cartography && (
                <button
                  onClick={() => onStartSession(true)}
                  className="w-full text-[10px] text-muted-foreground/30 hover:text-muted-foreground/50 transition-colors py-1"
                >
                  Sessão sem perfil cartográfico
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ VER MAIS — EXPANDABLE ═══ */}
      {leituraCampo && (
        <div className="mt-6">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors mx-auto"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {expanded ? 'Ocultar detalhes' : 'Ver mais'}
          </button>

          {expanded && (
            <div className="mt-4 animate-fade-in">
              <CabineDecisaoClinica leitura={leituraCampo} profile={profile} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
