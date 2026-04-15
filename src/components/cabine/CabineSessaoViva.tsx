/**
 * CABINE SESSÃO VIVA
 * 
 * Cockpit clínico em tempo real.
 * Sem steps, sem "próximo", sem formulário.
 * Tudo responde ao que a terapeuta faz.
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Square, CheckCircle2, Ban, Compass, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ClienteComStatus, CartografiaProfile, SessionData } from '@/pages/casa-maquinas/CabineTerapeutaPage';
import type { LeituraCampo } from '@/lib/cabine/motorOracular';
import type { MapaVivoState } from '@/lib/cabine/motorMapaVivo';
import { deriveFluxoClinico, type FluxoClinico, type FluxoClinicoResult, FLUXO_AMBIENT, FLUXO_ACCENT } from '@/lib/cabine/motorSessaoVivo';

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

  return (
    <div className="space-y-3">
      {/* === HEADER: Timer + Encerrar === */}
      <div className={`rounded-lg border p-3 flex items-center justify-between transition-colors duration-1000 ${FLUXO_AMBIENT[fluxo.fluxo]}`}>
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

      {/* === SUSSURRO CONTEXTUAL (aparece e desaparece) === */}
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

      {/* === ORIENTAÇÃO VIVA (muda com o fluxo) === */}
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

      {/* === RISCO (sempre visível se elevado) === */}
      {leituraCampo?.risco === 'elevado' && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/5 border border-red-500/15">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400/70 shrink-0" />
          <p className="text-[10px] text-red-300/80">Campo em risco elevado — contenha sem aprofundar</p>
        </div>
      )}

      {/* === ESTADO DO CAMPO (compacto, sempre visível) === */}
      {leituraCampo && (
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-lg bg-card/40 border border-border/10">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground/40 mb-0.5">Estado</p>
            <p className="text-[11px] text-foreground/70">{leituraCampo.mensagem_estado}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-card/40 border border-border/10">
            <Compass className="w-3 h-3 text-primary/40 mb-0.5" />
            <p className="text-[11px] text-foreground/70">{leituraCampo.mensagem_direcao}</p>
          </div>
        </div>
      )}

      {/* === PRIORIZAR / EVITAR (sempre visível se existir) === */}
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

      {/* === CAMPO DE PRESENÇA (sempre aberto — é o check-in vivo) === */}
      <div className="space-y-1.5">
        <Textarea
          value={sessionData.checkinTexto}
          onChange={e => update('checkinTexto', e.target.value)}
          placeholder="O que você observa neste momento..."
          className="bg-background/30 border-border/15 min-h-[60px] text-sm resize-none transition-all focus:min-h-[80px]"
        />
      </div>

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

      {/* === ANOTAÇÕES DE CONDUÇÃO (sempre aberto quando campo está ativo) === */}
      {fluxo.campo_aberto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Textarea
            value={sessionData.anotacoes}
            onChange={e => update('anotacoes', e.target.value)}
            placeholder="Anotações da condução..."
            className="bg-background/30 border-border/15 min-h-[80px] text-sm resize-none transition-all focus:min-h-[120px]"
          />
        </motion.div>
      )}

      {/* === SÍNTESE (emerge naturalmente na integração/continuidade) === */}
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
