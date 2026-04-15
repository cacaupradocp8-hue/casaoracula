import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Pause, Square, Sparkles, MessageCircle, Ban, CheckCircle2, Compass } from 'lucide-react';
import type { ClienteComStatus, CartografiaProfile, SessionData } from '@/pages/casa-maquinas/CabineTerapeutaPage';
import type { LeituraCampo } from '@/lib/cabine/motorOracular';
import type { MapaVivoState } from '@/lib/cabine/motorMapaVivo';
import { CabineDecisaoClinica } from './CabineDecisaoClinica';
import { CabineStageIndicator } from './CabineStageIndicator';
import { deriveSessionStage, type SessionStage, type SessionStageResult } from '@/lib/cabine/motorSessao';

interface Props {
  cliente: ClienteComStatus;
  profile: CartografiaProfile | null;
  sessionData: SessionData;
  setSessionData: React.Dispatch<React.SetStateAction<SessionData>>;
  startedAt: Date;
  leituraCampo: LeituraCampo | null;
  mapaVivoState?: MapaVivoState | null;
  onEnd: () => void;
  onStageChange?: (stage: SessionStageResult) => void;
}

const FERRAMENTAS = [
  'Cartografia', 'Torres', 'Portas', 'Arquétipos', 'Sonhos', 'Biblioteca de Intervenções',
];

const FERRAMENTA_SUGESTAO: Record<string, string> = {
  excesso_de_mente: 'Cartografia',
  repeticao_de_padrao: 'Portas',
  divisao_interna: 'Arquétipos',
  desorganizacao_leve: 'Torres',
  integracao_emergente: 'Cartografia',
  ciclo_em_fechamento: 'Biblioteca de Intervenções',
  inicio_de_processo: 'Cartografia',
  campo_estavel: 'Cartografia',
};

function Timer({ startedAt }: { startedAt: Date }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);
  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;
  return <span className="tabular-nums">{m.toString().padStart(2, '0')}:{s.toString().padStart(2, '0')}</span>;
}

export function CabineSessao({ cliente, profile, sessionData, setSessionData, startedAt, leituraCampo, mapaVivoState, onEnd, onStageChange }: Props) {
  const [step, setStep] = useState(1);
  const [paused, setPaused] = useState(false);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [previousStage, setPreviousStage] = useState<SessionStage | undefined>(undefined);
  const pj = profile?.profile_json;

  // Track elapsed minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedMinutes(Math.floor((Date.now() - startedAt.getTime()) / 60000));
    }, 30000); // update every 30s
    return () => clearInterval(interval);
  }, [startedAt]);

  // Derive session stage
  const stageResult = useMemo(() => {
    return deriveSessionStage({
      elapsedMinutes,
      checkinPreenchido: !!sessionData.checkinTexto.trim(),
      ferramentaEscolhida: !!sessionData.ferramentaEscolhida,
      anotacoesPreenchidas: !!sessionData.anotacoes.trim(),
      resumoPreenchido: !!sessionData.resumoSessao.trim(),
      mapaVivo: mapaVivoState || null,
      leitura: leituraCampo,
      previousStage,
    });
  }, [elapsedMinutes, sessionData, mapaVivoState, leituraCampo, previousStage]);

  // Notify parent of stage changes
  useEffect(() => {
    if (previousStage !== stageResult.stage) {
      setPreviousStage(stageResult.stage);
      onStageChange?.(stageResult);
    }
  }, [stageResult.stage, previousStage, onStageChange]);

  const update = (field: keyof SessionData, value: string) => {
    setSessionData(prev => ({ ...prev, [field]: value }));
  };

  const ferramentaSugerida = leituraCampo ? FERRAMENTA_SUGESTAO[leituraCampo.estado] || 'Cartografia' : null;

  return (
    <div className="space-y-4">
      {/* Header fixo com timer */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{cliente.nome}</p>
              <p className="text-xs text-primary/70 font-mono">
                <Timer startedAt={startedAt} />
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPaused(!paused)}>
              <Pause className="w-3.5 h-3.5" />
            </Button>
            <Button variant="destructive" size="sm" className="text-xs h-8" onClick={onEnd}>
              <Square className="w-3 h-3 mr-1" /> Encerrar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* COREOGRAFIA: Indicador de estágio */}
      <CabineStageIndicator stageResult={stageResult} />

      {/* CARD FIXO: Decisão Clínica (compacto durante sessão) */}
      {leituraCampo && (
        <CabineDecisaoClinica leitura={leituraCampo} profile={profile} compact />
      )}

      {/* Step indicator */}
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(n => (
          <button
            key={n}
            onClick={() => setStep(n)}
            className={`flex-1 h-1 rounded-full transition-all ${
              step >= n ? 'bg-primary' : 'bg-muted/30'
            }`}
          />
        ))}
      </div>

      {/* ETAPA 1 — CHECK-IN */}
      {step === 1 && (
        <Card className="border-border/20 bg-card/50">
          <CardContent className="p-4 space-y-3">
            <p className="text-[10px] uppercase tracking-widest text-primary/60 font-medium">Etapa 1 — Check-in</p>
            <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-[11px] text-primary/70 italic">
                Observe o nível de abertura vs defesa antes de conduzir.
              </p>
            </div>
            <Textarea
              value={sessionData.checkinTexto}
              onChange={e => update('checkinTexto', e.target.value)}
              placeholder="Estado inicial observado..."
              className="bg-background/40 border-border/20 min-h-[80px] text-sm"
            />
            <Button onClick={() => setStep(2)} className="w-full" size="sm">
              Registrar e avançar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ETAPA 2 — FERRAMENTA */}
      {step === 2 && (
        <Card className="border-border/20 bg-card/50">
          <CardContent className="p-4 space-y-3">
            <p className="text-[10px] uppercase tracking-widest text-primary/60 font-medium">Etapa 2 — Ferramenta</p>
            
            {ferramentaSugerida && (
              <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-[9px] text-primary/50 uppercase tracking-wider mb-0.5">Sugestão baseada na leitura do campo</p>
                <p className="text-sm text-primary font-medium">→ {ferramentaSugerida}</p>
              </div>
            )}

            <Select value={sessionData.ferramentaEscolhida} onValueChange={v => update('ferramentaEscolhida', v)}>
              <SelectTrigger className="bg-background/40 border-border/20">
                <SelectValue placeholder="Selecione a ferramenta..." />
              </SelectTrigger>
              <SelectContent>
                {FERRAMENTAS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={() => setStep(3)} className="w-full" size="sm">Avançar</Button>
          </CardContent>
        </Card>
      )}

      {/* ETAPA 3 — CONDUÇÃO */}
      {step === 3 && (
        <Card className="border-border/20 bg-card/50">
          <CardContent className="p-4 space-y-3">
            <p className="text-[10px] uppercase tracking-widest text-primary/60 font-medium">Etapa 3 — Condução</p>

            {(pj?.o_que_priorizar || pj?.o_que_evitar) && (
              <div className="grid grid-cols-2 gap-2">
                {pj?.o_que_priorizar && (
                  <div className="p-2 rounded-md bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-1 mb-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5 text-primary/60" />
                      <p className="text-[9px] text-primary/60 uppercase font-medium">Sustentar</p>
                    </div>
                    <p className="text-[10px] text-foreground/70">{pj.o_que_priorizar}</p>
                  </div>
                )}
                {pj?.o_que_evitar && (
                  <div className="p-2 rounded-md bg-destructive/5 border border-destructive/10">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Ban className="w-2.5 h-2.5 text-destructive/60" />
                      <p className="text-[9px] text-destructive/60 uppercase font-medium">Evitar</p>
                    </div>
                    <p className="text-[10px] text-foreground/70">{pj.o_que_evitar}</p>
                  </div>
                )}
              </div>
            )}

            <Textarea
              value={sessionData.anotacoes}
              onChange={e => update('anotacoes', e.target.value)}
              placeholder="Anotações da condução..."
              className="bg-background/40 border-border/20 min-h-[120px] text-sm"
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 text-xs gap-1 opacity-50 cursor-default" disabled>
                <Sparkles className="w-3 h-3" /> Sugerir próxima pergunta
              </Button>
              <Button variant="ghost" size="sm" className="text-xs gap-1 opacity-40 cursor-default" disabled>
                <MessageCircle className="w-3 h-3" /> Ampliação simbólica
              </Button>
            </div>
            <Button onClick={() => setStep(4)} className="w-full" size="sm">Avançar para síntese</Button>
          </CardContent>
        </Card>
      )}

      {/* ETAPA 4 — SÍNTESE */}
      {step === 4 && (
        <Card className="border-border/20 bg-card/50">
          <CardContent className="p-4 space-y-3">
            <p className="text-[10px] uppercase tracking-widest text-primary/60 font-medium">Etapa 4 — Síntese</p>
            <Textarea value={sessionData.resumoSessao} onChange={e => update('resumoSessao', e.target.value)}
              placeholder="Resumo da sessão..." className="bg-background/40 border-border/20 min-h-[80px] text-sm" />
            <Textarea value={sessionData.hipoteseSimbólica} onChange={e => update('hipoteseSimbólica', e.target.value)}
              placeholder="Hipótese simbólica..." className="bg-background/40 border-border/20 min-h-[60px] text-sm" />

            {leituraCampo && (
              <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10">
                <div className="flex items-start gap-2">
                  <Compass className="w-3.5 h-3.5 text-primary/50 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[9px] text-primary/50 uppercase tracking-wider mb-0.5">Direção sugerida para a próxima sessão</p>
                    <p className="text-xs text-foreground/80">{leituraCampo.mensagem_direcao}</p>
                  </div>
                </div>
              </div>
            )}

            <Textarea value={sessionData.proximosPassos} onChange={e => update('proximosPassos', e.target.value)}
              placeholder="Próximos passos..." className="bg-background/40 border-border/20 min-h-[60px] text-sm" />
            <Button onClick={onEnd} className="w-full h-11 font-semibold" variant="gold">
              <Square className="w-3.5 h-3.5 mr-1" /> Encerrar Sessão
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
