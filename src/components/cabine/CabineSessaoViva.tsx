/**
 * CABINE SESSÃO VIVA
 * 
 * Cockpit clínico em tempo real.
 * Sem steps, sem "próximo", sem formulário.
 * Tudo responde ao que a terapeuta faz.
 */

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Square, CheckCircle2, Ban, Compass, AlertTriangle, Activity, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ClienteComStatus, CartografiaProfile, SessionData } from '@/pages/casa-maquinas/CabineTerapeutaPage';
import type { LeituraCampo } from '@/lib/cabine/motorOracular';
import type { MapaVivoState } from '@/lib/cabine/motorMapaVivo';
import { deriveFluxoClinico, type FluxoClinico, type FluxoClinicoResult, FLUXO_AMBIENT, FLUXO_ACCENT } from '@/lib/cabine/motorSessaoVivo';
import { deriveSessionUpdate, type SessionUpdateResult } from '@/lib/cabine/motorDeteccaoVivo';
import { Badge } from '@/components/ui/badge';

const RISCO_BADGE: Record<string, string> = {
  baixo: 'border-emerald-500/20 text-emerald-400',
  moderado: 'border-amber-500/20 text-amber-400',
  elevado: 'border-red-500/20 text-red-400',
};

interface Props {
  cliente: ClienteComStatus;
  profile: CartografiaProfile | null;
  sessionData: SessionData;
  setSessionData: React.Dispatch<React.SetStateAction<SessionData>>;
  startedAt: Date;
  leituraCampo: LeituraCampo | null;
  mapaVivoState?: MapaVivoState | null;
  onEnd: () => void;
  onFluxoChange?: (result: FluxoClinicoResult) => void;
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

export function CabineSessaoViva({
  cliente, profile, sessionData, setSessionData,
  startedAt, leituraCampo, mapaVivoState, onEnd, onFluxoChange,
}: Props) {
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [previousFluxo, setPreviousFluxo] = useState<FluxoClinico | undefined>(undefined);
  const [sussurroVisible, setSussurroVisible] = useState(false);
  const sussurroTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const pj = profile?.profile_json;

  // === DETECÇÃO VIVA ===
  const [microMensagem, setMicroMensagem] = useState<string | null>(null);
  const [liveUpdate, setLiveUpdate] = useState<SessionUpdateResult | null>(null);
  const microTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounced detection on text change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const currentRisco = leituraCampo?.risco || 'baixo';
      const result = deriveSessionUpdate(
        sessionData.checkinTexto,
        sessionData.anotacoes,
        currentRisco,
      );
      setLiveUpdate(result);

      if (result.micro_mensagem) {
        setMicroMensagem(result.micro_mensagem);
        if (microTimerRef.current) clearTimeout(microTimerRef.current);
        microTimerRef.current = setTimeout(() => setMicroMensagem(null), 6000);
      }
    }, 800);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [sessionData.checkinTexto, sessionData.anotacoes, leituraCampo?.risco]);

  // Computed live estado/direcao/risco (soft override)
  const liveEstadoMsg = liveUpdate?.estado_campo_override
    ? undefined // will be shown from liveUpdate
    : leituraCampo?.mensagem_estado;
  const liveDirecaoMsg = liveUpdate?.direcao_override
    ? undefined
    : leituraCampo?.mensagem_direcao;
  const liveRisco = liveUpdate?.risco_override || leituraCampo?.risco || 'baixo';

  // Track elapsed minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedMinutes(Math.floor((Date.now() - startedAt.getTime()) / 60000));
    }, 15000);
    return () => clearInterval(interval);
  }, [startedAt]);

  // Derive fluxo
  const fluxo = useMemo(() => {
    return deriveFluxoClinico({
      elapsedMinutes,
      checkinPreenchido: !!sessionData.checkinTexto.trim(),
      checkinTexto: sessionData.checkinTexto,
      ferramentaEscolhida: !!sessionData.ferramentaEscolhida,
      anotacoesLength: sessionData.anotacoes.length,
      resumoPreenchido: !!sessionData.resumoSessao.trim(),
      mapaVivo: mapaVivoState || null,
      leitura: leituraCampo,
      previousFluxo,
    });
  }, [elapsedMinutes, sessionData, mapaVivoState, leituraCampo, previousFluxo]);

  // Notify parent + manage sussurro
  useEffect(() => {
    if (previousFluxo !== fluxo.fluxo) {
      setPreviousFluxo(fluxo.fluxo);
      onFluxoChange?.(fluxo);
    }
    if (fluxo.sussurro_ativo) {
      setSussurroVisible(true);
      if (sussurroTimerRef.current) clearTimeout(sussurroTimerRef.current);
      sussurroTimerRef.current = setTimeout(() => setSussurroVisible(false), 8000);
    }
  }, [fluxo.fluxo, fluxo.sussurro_ativo]);

  const update = (field: keyof SessionData, value: string) => {
    setSessionData(prev => ({ ...prev, [field]: value }));
  };

  const ferramentaSugerida = leituraCampo ? FERRAMENTA_SUGESTAO[leituraCampo.estado] || null : null;

  // === BLOQUEIO DE INTERVENÇÃO ===
  // Risco alto + desorganização ativa + divisão interna sem reconhecimento → bloquear ferramentas e mudança de fase
  const intervencaoBloqueada = useMemo(() => {
    const riscoAlto = liveRisco === 'elevado';
    const desorganizacaoAtiva = liveUpdate?.padrao === 'desorganizacao';
    const divisaoSemReconhecimento = liveUpdate?.padrao === 'conflito' && 
      !sessionData.checkinTexto.toLowerCase().includes('perceb') &&
      !sessionData.checkinTexto.toLowerCase().includes('reconheç') &&
      !sessionData.checkinTexto.toLowerCase().includes('noto') &&
      !sessionData.checkinTexto.toLowerCase().includes('vejo que');
    
    return riscoAlto || desorganizacaoAtiva || divisaoSemReconhecimento;
  }, [liveRisco, liveUpdate?.padrao, sessionData.checkinTexto]);
    <div className="space-y-3">
      {/* === CARD FIXO TOPO: Estado do Campo + Timer === */}
      <Card className={`border transition-colors duration-1000 ${FLUXO_AMBIENT[fluxo.fluxo]}`}>
        <CardContent className="p-4 space-y-3">
          {/* Header: nome + timer + encerrar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-background/50 flex items-center justify-center">
                <Clock className={`w-4 h-4 ${FLUXO_ACCENT[fluxo.fluxo]}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{cliente.nome}</p>
                <p className={`text-xs font-mono ${FLUXO_ACCENT[fluxo.fluxo]}`}>
                  <Timer startedAt={startedAt} />
                </p>
              </div>
            </div>
            <Button variant="destructive" size="sm" className="text-xs h-8 gap-1" onClick={onEnd}>
              <Square className="w-3 h-3" /> Encerrar
            </Button>
          </div>

          {/* Estado do Campo (visual dominante — com soft updates em tempo real) */}
          {leituraCampo && (
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-display font-semibold text-foreground transition-all duration-500">
                    {liveUpdate?.estado_campo_override
                      ? `${leituraCampo.mensagem_estado}`
                      : leituraCampo.mensagem_estado}
                  </p>
                  {liveUpdate?.padrao && (
                    <p className="text-[10px] text-primary/50 mt-0.5">
                      {liveUpdate.padrao === 'repeticao' && '↻ repetição detectada'}
                      {liveUpdate.padrao === 'racionalizacao' && '◇ racionalização ativa'}
                      {liveUpdate.padrao === 'conflito' && '⇄ conflito interno'}
                      {liveUpdate.padrao === 'desorganizacao' && '∿ desorganização'}
                    </p>
                  )}
                </div>
                <Badge
                  variant="outline"
                  className={`text-[8px] px-1.5 shrink-0 transition-colors duration-500 ${RISCO_BADGE[liveRisco]}`}
                >
                  {liveRisco}
                </Badge>
              </div>

              {/* Direção atual (com soft override) */}
              <div className="flex items-start gap-2 pl-11">
                <Compass className="w-3 h-3 text-primary/40 mt-0.5 shrink-0" />
                <p className="text-[11px] text-foreground/70 transition-all duration-500">
                  {leituraCampo.mensagem_direcao}
                </p>
              </div>

              {/* Permanência */}
              {leituraCampo.mensagem_permanencia && (
                <div className="flex items-start gap-2 pl-11">
                  <Shield className="w-3 h-3 text-amber-400/50 mt-0.5 shrink-0" />
                  <p className="text-[10px] text-amber-300/60 italic">{leituraCampo.mensagem_permanencia}</p>
                </div>
              )}
            </div>
          )}

          {/* Risco elevado alerta */}
          {liveRisco === 'elevado' && (
            <div className="flex items-center gap-2 p-2 rounded-md bg-red-500/5 border border-red-500/15">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400/70 shrink-0" />
              <p className="text-[10px] text-red-300/80">Campo em risco elevado — contenha sem aprofundar</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* === SUSSURRO CONTEXTUAL === */}
      <AnimatePresence>
        {sussurroVisible && fluxo.sussurro_motivo && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/10"
          >
            <p className="text-[11px] text-amber-400/70 italic text-center">
              {fluxo.sussurro_motivo}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === MICRO-MENSAGEM — detecção viva (máx 1, auto-desaparece) === */}
      <AnimatePresence>
        {microMensagem && !sussurroVisible && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4 }}
            className="px-3 py-2 rounded-lg bg-primary/5 border border-primary/10"
          >
            <p className="text-[11px] text-primary/60 italic text-center">
              {microMensagem}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key={fluxo.fluxo}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="p-3 rounded-lg bg-card/30 border border-border/10"
      >
        <p className={`text-[11px] leading-relaxed ${FLUXO_ACCENT[fluxo.fluxo]}`}>
          {fluxo.orientacao}
        </p>
      </motion.div>

      {/* === CHECKIN — sempre visível, campo livre === */}
      <div className="space-y-1">
        <Textarea
          value={sessionData.checkinTexto}
          onChange={e => update('checkinTexto', e.target.value)}
          placeholder="O que você observa neste momento..."
          className="bg-background/30 border-border/15 min-h-[60px] text-sm resize-none transition-all focus:min-h-[80px]"
        />
        <p className="text-[10px] text-muted-foreground/40 italic pl-1">
          Observe se há defesa ou abertura
        </p>
      </div>

      {/* === ANOTAÇÕES — sempre visível === */}
      <div className="space-y-1">
        <Textarea
          value={sessionData.anotacoes}
          onChange={e => update('anotacoes', e.target.value)}
          placeholder="Anotações da condução..."
          className="bg-background/30 border-border/15 min-h-[80px] text-sm resize-none transition-all focus:min-h-[120px]"
        />
      </div>

      {/* === PRIORIZAR / EVITAR === */}
      {(pj?.o_que_priorizar || pj?.o_que_evitar) && (
        <div className="grid grid-cols-2 gap-2">
          {pj?.o_que_priorizar && (
            <div className="p-2 rounded-md bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-1 mb-0.5">
                <CheckCircle2 className="w-2.5 h-2.5 text-primary/50" />
                <p className="text-[9px] text-primary/50 uppercase font-medium">Sustentar</p>
              </div>
              <p className="text-[10px] text-foreground/60">{pj.o_que_priorizar}</p>
            </div>
          )}
          {pj?.o_que_evitar && (
            <div className="p-2 rounded-md bg-destructive/5 border border-destructive/10">
              <div className="flex items-center gap-1 mb-0.5">
                <Ban className="w-2.5 h-2.5 text-destructive/50" />
                <p className="text-[9px] text-destructive/50 uppercase font-medium">Evitar</p>
              </div>
              <p className="text-[10px] text-foreground/60">{pj.o_que_evitar}</p>
            </div>
          )}
        </div>
      )}

      {/* === FERRAMENTA (emerge quando o campo pede) === */}
      <AnimatePresence>
        {fluxo.ferramenta_ativa && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="border-border/10 bg-card/30">
              <CardContent className="p-3 space-y-2">
                {ferramentaSugerida && !sessionData.ferramentaEscolhida && (
                  <div className="p-2 rounded-md bg-primary/5 border border-primary/10">
                    <p className="text-[9px] text-primary/40 uppercase tracking-wider">Sugestão do campo</p>
                    <p className="text-xs text-primary/70 font-medium">→ {ferramentaSugerida}</p>
                  </div>
                )}
                <Select value={sessionData.ferramentaEscolhida} onValueChange={v => update('ferramentaEscolhida', v)}>
                  <SelectTrigger className="bg-background/30 border-border/15 text-sm h-9">
                    <SelectValue placeholder="Ferramenta..." />
                  </SelectTrigger>
                  <SelectContent>
                    {FERRAMENTAS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === SÍNTESE (emerge na integração/continuidade) === */}
      <AnimatePresence>
        {fluxo.sintese_ativa && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden space-y-2"
          >
            <div className={`rounded-lg border p-3 space-y-3 ${FLUXO_AMBIENT[fluxo.fluxo]}`}>
              <Textarea
                value={sessionData.resumoSessao}
                onChange={e => update('resumoSessao', e.target.value)}
                placeholder="O que foi vivido nesta sessão..."
                className="bg-background/30 border-border/15 min-h-[60px] text-sm resize-none"
              />
              <Textarea
                value={sessionData.hipoteseSimbólica}
                onChange={e => update('hipoteseSimbólica', e.target.value)}
                placeholder="Hipótese simbólica..."
                className="bg-background/30 border-border/15 min-h-[50px] text-sm resize-none"
              />

              {leituraCampo && (
                <div className="p-2 rounded-md bg-primary/5 border border-primary/10">
                  <div className="flex items-start gap-2">
                    <Compass className="w-3 h-3 text-primary/40 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[9px] text-primary/40 uppercase tracking-wider mb-0.5">Direção para a próxima</p>
                      <p className="text-[10px] text-foreground/60">{leituraCampo.mensagem_direcao}</p>
                    </div>
                  </div>
                </div>
              )}

              <Textarea
                value={sessionData.proximosPassos}
                onChange={e => update('proximosPassos', e.target.value)}
                placeholder="O que continua trabalhando..."
                className="bg-background/30 border-border/15 min-h-[50px] text-sm resize-none"
              />

              <Button onClick={onEnd} className="w-full h-11 font-semibold" variant="gold">
                <Square className="w-3.5 h-3.5 mr-1.5" /> Encerrar sessão
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
