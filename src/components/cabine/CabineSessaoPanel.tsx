import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Send } from 'lucide-react';
import type { LeituraCampo } from '@/lib/cabine/motorOracular';
import type { MapaVivoState, DecisaoClinicaResult } from '@/lib/cabine/motorMapaVivo';
import { deriveClinicalDecision } from '@/lib/cabine/motorMapaVivo';
import { CabineDecisaoSessao } from './CabineDecisaoSessao';
import type { CabineMode, SessionData } from '@/pages/casa-maquinas/CabineTerapeutaPage';

interface Props {
  mode: CabineMode;
  leituraCampo: LeituraCampo | null;
  mapaVivoState: MapaVivoState | null;
  sessionData: SessionData;
  hasCartography: boolean;
  onStartSession: (withoutProfile: boolean) => void;
}

export function CabineSessaoPanel({
  mode,
  leituraCampo,
  mapaVivoState,
  sessionData,
  hasCartography,
  onStartSession,
}: Props) {
  const decisao: DecisaoClinicaResult | null = mapaVivoState
    ? deriveClinicalDecision(mapaVivoState)
    : null;

  // Pre-session state
  if (mode === 'preparacao') {
    if (!hasCartography || !leituraCampo) {
      return (
        <Card className="border-border/15 bg-card/30">
          <CardContent className="p-5">
            <div className="text-center space-y-2 py-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">
                Sessão
              </p>
              <p className="text-xs text-muted-foreground/50 italic">
                {!hasCartography
                  ? 'Diagnóstico necessário antes da sessão'
                  : 'Aguardando leitura de campo'}
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="border-border/20 bg-card/40">
        <CardContent className="p-4 space-y-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary/60 font-medium">
            Sessão
          </p>

          {/* Resumo do campo */}
          <div className="space-y-2">
            <div className="p-2.5 rounded-lg bg-background/20 border border-border/10">
              <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-0.5">
                Estado
              </p>
              <p className="text-xs text-foreground/80">
                {leituraCampo.estado}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-background/20 border border-border/10">
              <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-0.5">
                Direção
              </p>
              <p className="text-xs text-foreground/80">
                {leituraCampo.direcao}
              </p>
            </div>
          </div>

          {/* Motor decisão sessão */}
          {decisao && (
            <CabineDecisaoSessao
              decisao={decisao}
              onFollow={() => onStartSession(false)}
              onAdjust={() => onStartSession(false)}
            />
          )}

          {/* Botão iniciar */}
          {!decisao && (
            <Button
              onClick={() => onStartSession(false)}
              className="w-full h-10 text-xs font-display font-semibold bg-primary hover:bg-primary/80 text-primary-foreground gap-2"
            >
              <Play className="w-3.5 h-3.5" />
              Iniciar Sessão
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // During/after session — show minimal status (the main content is in center)
  return (
    <Card className="border-border/20 bg-card/40">
      <CardContent className="p-4 space-y-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary/60 font-medium">
          {mode === 'sessao' ? 'Sessão em andamento' : 'Integração'}
        </p>

        {mode === 'sessao' && sessionData.checkinTexto && (
          <div className="p-2.5 rounded-lg bg-background/20 border border-border/10">
            <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-0.5">
              Check-in
            </p>
            <p className="text-xs text-foreground/70 line-clamp-3">
              {sessionData.checkinTexto}
            </p>
          </div>
        )}

        {mode === 'integracao' && (
          <div className="flex items-center gap-2 text-xs text-primary/70">
            <Send className="w-3.5 h-3.5" />
            <span>Sessão finalizada</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
