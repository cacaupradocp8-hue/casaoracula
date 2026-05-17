/**
 * CABINE SESSÃO VIVA REFINADA (SPRINT 10C)
 * 
 * Cockpit clínico imersivo com fluxo em 6 etapas.
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Clock, Square, CheckCircle2, Ban, Compass, AlertTriangle, 
  Activity, Shield, ChevronRight, ChevronLeft, BookOpen, 
  Sparkles, Pen, History, Info, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ClienteComStatus, CartografiaProfile, SessionData } from '@/pages/casa-maquinas/CabineTerapeutaPage';
import type { LeituraCampo } from '@/lib/cabine/motorOracular';
import type { MapaVivoState } from '@/lib/cabine/motorMapaVivo';
import { deriveFluxoClinico, type FluxoClinico, type FluxoClinicoResult, FLUXO_AMBIENT, FLUXO_ACCENT } from '@/lib/cabine/motorSessaoVivo';
import { deriveSessionUpdate, type SessionUpdateResult } from '@/lib/cabine/motorDeteccaoVivo';
import { Badge } from '@/components/ui/badge';
import { SessionInterventionSuggestions } from '@/components/casa-maquinas/SessionInterventionSuggestions';
import { cn } from '@/lib/utils';

const RISCO_BADGE: Record<string, string> = {
  baixo: 'border-emerald-500/20 text-emerald-400',
  moderado: 'border-amber-500/20 text-amber-400',
  elevado: 'border-red-500/20 text-red-400',
};

const STEPS = [
  { id: 1, label: 'Abertura', icon: Info },
  { id: 2, label: 'Escuta', icon: Activity },
  { id: 3, label: 'Mapeamento', icon: Compass },
  { id: 4, label: 'Intervenção', icon: Sparkles },
  { id: 5, label: 'Integração', icon: Shield },
  { id: 6, label: 'Síntese', icon: CheckCircle2 },
];

interface Props {
  cliente: ClienteComStatus;
  profile: CartografiaProfile | null;
  sessionData: SessionData;
  setSessionData: React.Dispatch<React.SetStateAction<SessionData>>;
  startedAt: Date;
  leituraCampo: LeituraCampo | null;
  mapaVivoState?: MapaVivoState | null;
  lastSession?: any | null;
  onEnd: () => void;
  onFluxoChange?: (result: FluxoClinicoResult) => void;
  onBack?: () => void;
}

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
  const [currentStep, setCurrentStep] = useState(1);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [previousFluxo, setPreviousFluxo] = useState<FluxoClinico | undefined>(undefined);
  const pj = profile?.profile_json;

  // === DETECÇÃO VIVA ===
  const [liveUpdate, setLiveUpdate] = useState<SessionUpdateResult | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

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
    }, 800);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [sessionData.checkinTexto, sessionData.anotacoes, leituraCampo?.risco]);

  const liveRisco = liveUpdate?.risco_override || leituraCampo?.risco || 'baixo';

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedMinutes(Math.floor((Date.now() - startedAt.getTime()) / 60000));
    }, 15000);
    return () => clearInterval(interval);
  }, [startedAt]);

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

  useEffect(() => {
    if (previousFluxo !== fluxo.fluxo) {
      setPreviousFluxo(fluxo.fluxo);
      onFluxoChange?.(fluxo);
    }
  }, [fluxo.fluxo]);

  const update = (field: keyof SessionData, value: string) => {
    setSessionData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto space-y-4">
      {/* 1. CABEÇALHO DA SESSÃO */}
      <Card className="border-border/10 bg-card/40 backdrop-blur-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground leading-none">{cliente.nome}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground/60">{new Date().toLocaleDateString('pt-BR')}</span>
                  <Badge variant="outline" className={cn("text-[9px] h-4", RISCO_BADGE[liveRisco])}>
                    Risco {liveRisco}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/40 font-bold">Tempo de Sessão</span>
                <span className="text-sm font-mono text-primary font-bold"><Timer startedAt={startedAt} /></span>
              </div>
              <div className="h-8 w-px bg-border/10" />
              <Button variant="ghost" size="sm" onClick={onEnd} className="text-xs text-destructive hover:bg-destructive/10 gap-1.5 h-9">
                <Square className="w-3.5 h-3.5" /> Finalizar Sessão
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. BLOCO "CAMPO ATUAL" */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-4 space-y-4">
          <Card className="border-border/10 bg-card/30">
            <CardContent className="p-4 space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/40 font-bold mb-2">Campo Atual</p>
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="text-sm font-semibold text-primary">{leituraCampo?.mensagem_estado || 'Sem leitura ativa'}</p>
                  <p className="text-[11px] text-muted-foreground/60 mt-1">{leituraCampo?.mensagem_direcao}</p>
                </div>
              </div>

              {mapaVivoState && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Distrito</span>
                    <span className="text-foreground font-medium">{mapaVivoState.estado_atual || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Tensão</span>
                    <span className="text-foreground font-medium">{mapaVivoState.tensao_principal || '—'}</span>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-border/10">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/40 font-bold mb-2">Intenção</p>
                <Textarea 
                  value={sessionData.intencaoSessao} 
                  onChange={e => update('intencaoSessao', e.target.value)}
                  placeholder="Qual o foco de hoje?"
                  className="bg-transparent border-none p-0 min-h-[40px] text-xs resize-none focus-visible:ring-0 placeholder:italic"
                />
              </div>

              {cliente.lastSessionDate && (
                <div className="pt-2 border-t border-border/10">
                  <div className="flex items-center gap-1.5 mb-1.5 text-muted-foreground/40">
                    <History className="w-3 h-3" />
                    <span className="text-[10px] uppercase tracking-wider font-bold">Último Registro</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 line-clamp-3 italic">
                    {/* Placeholder para última síntese */}
                    "Continuamos o trabalho nas torres de silêncio..."
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Orientações dinâmicas baseadas no fluxo */}
          <motion.div 
            key={fluxo.fluxo}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn("p-4 rounded-2xl border backdrop-blur-sm", FLUXO_AMBIENT[fluxo.fluxo])}
          >
            <div className="flex items-start gap-2">
              <Info className={cn("w-4 h-4 mt-0.5 shrink-0", FLUXO_ACCENT[fluxo.fluxo])} />
              <p className={cn("text-xs leading-relaxed", FLUXO_ACCENT[fluxo.fluxo])}>
                {fluxo.orientacao}
              </p>
            </div>
          </motion.div>
        </div>

        {/* 3. ETAPAS DA CONDUÇÃO (MAIN EDITOR) */}
        <div className="md:col-span-8 flex flex-col space-y-4 h-full">
          {/* STEPPER */}
          <div className="flex items-center justify-between px-2 bg-card/20 rounded-xl py-2 border border-border/5">
            {STEPS.map((s) => {
              const StepIcon = s.icon;
              const isActive = currentStep === s.id;
              const isCompleted = currentStep > s.id;
              return (
                <div key={s.id} className="flex items-center">
                  <button 
                    onClick={() => setCurrentStep(s.id)}
                    className={cn(
                      "flex flex-col items-center gap-1 transition-all",
                      isActive ? "scale-110" : "opacity-40 hover:opacity-100"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : 
                      isCompleted ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      <StepIcon className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-tighter">{s.label}</span>
                  </button>
                  {s.id < STEPS.length && (
                    <div className="w-6 lg:w-12 h-[1px] bg-border/10 mx-1 lg:mx-2 mt-[-14px]" />
                  )}
                </div>
              );
            })}
          </div>

          {/* STEP CONTENT */}
          <Card className="flex-1 border-border/10 bg-card/50 backdrop-blur-sm flex flex-col min-h-[400px]">
            <CardContent className="p-6 flex-1 flex flex-col overflow-auto">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex-1 flex flex-col space-y-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">{STEPS[currentStep - 1].label}</span>
                    <div className="h-px flex-1 bg-primary/10" />
                  </div>

                  {currentStep === 1 && (
                    <div className="space-y-4 flex-1">
                      <p className="text-sm text-muted-foreground italic">Como a cliente chega? O que você percebe no campo de imediato?</p>
                      <Textarea 
                        value={sessionData.checkinTexto}
                        onChange={e => update('checkinTexto', e.target.value)}
                        placeholder="Abertura do campo..."
                        className="flex-1 bg-background/30 border-border/10 resize-none text-base min-h-[200px]"
                      />
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4 flex-1">
                      <p className="text-sm text-muted-foreground italic">Espaço para escuta profunda, anotações de falas, temas e reações.</p>
                      <Textarea 
                        value={sessionData.anotacoes}
                        onChange={e => update('anotacoes', e.target.value)}
                        placeholder="Registro da escuta..."
                        className="flex-1 bg-background/30 border-border/10 resize-none text-base min-h-[250px]"
                      />
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <p className="text-sm text-muted-foreground italic">Onde estamos na jornada? Identifique os pilares da sessão.</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold text-muted-foreground/60">Porta Ativa</label>
                          <Textarea 
                            value={sessionData.portaAtiva}
                            onChange={e => update('portaAtiva', e.target.value)}
                            placeholder="Qual porta está sendo atravessada?"
                            className="bg-background/20 border-border/10 h-20 resize-none text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold text-muted-foreground/60">Torre Estruturante</label>
                          <Textarea 
                            value={sessionData.torreEstruturante}
                            onChange={e => update('torreEstruturante', e.target.value)}
                            placeholder="Qual torre sustenta esse campo?"
                            className="bg-background/20 border-border/10 h-20 resize-none text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-4 flex-1 overflow-auto">
                      <p className="text-sm text-muted-foreground italic">Sugestões baseadas no diagnóstico e biblioteca oracular.</p>
                      <SessionInterventionSuggestions 
                        sessionDistrictId={leituraCampo?.estado} 
                        clientId={cliente.id}
                        checkinState={liveRisco}
                        onUse={(id) => {
                          // Lógica adicional se necessário ao selecionar intervenção
                        }}
                      />
                      <div className="pt-4">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground/60 mb-2 block">Ferramenta Selecionada</label>
                        <Textarea 
                          value={sessionData.ferramentaEscolhida}
                          onChange={e => update('ferramentaEscolhida', e.target.value)}
                          placeholder="Descreva a intervenção aplicada..."
                          className="bg-background/20 border-border/10 h-24 resize-none text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 5 && (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground italic">Qual gesto simbólico ou movimento prático integra o que foi vivido?</p>
                      <Textarea 
                        value={sessionData.gestoIntegracao}
                        onChange={e => update('gestoIntegracao', e.target.value)}
                        placeholder="Defina o gesto de integração..."
                        className="bg-background/30 border-border/10 min-h-[150px] resize-none text-base"
                      />
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                        <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-xs text-primary/70 italic">O gesto deve ser simples, simbólico e executável pela cliente até a próxima sessão.</p>
                      </div>
                    </div>
                  )}

                  {currentStep === 6 && (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground italic">Consolidação simbólica. O que fica de mais valioso desta sessão?</p>
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-muted-foreground/60 mb-2 block">Síntese do Atendimento</label>
                          <Textarea 
                            value={sessionData.resumoSessao}
                            onChange={e => update('resumoSessao', e.target.value)}
                            placeholder="Resumo do que foi vivido..."
                            className="bg-background/30 border-border/10 min-h-[100px] resize-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-muted-foreground/60 mb-2 block">Hipótese Simbólica</label>
                          <Textarea 
                            value={sessionData.hipoteseSimbólica}
                            onChange={e => update('hipoteseSimbólica', e.target.value)}
                            placeholder="Para onde o inconsciente aponta?"
                            className="bg-background/30 border-border/10 min-h-[80px] resize-none text-sm italic"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </CardContent>

            {/* NAVIGATION BUTTONS */}
            <div className="p-4 border-t border-border/10 flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={prevStep} 
                disabled={currentStep === 1}
                className="gap-2 text-xs"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </Button>
              <div className="flex items-center gap-1.5">
                {STEPS.map(s => (
                  <div key={s.id} className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all",
                    currentStep === s.id ? "bg-primary w-4" : "bg-primary/20"
                  )} />
                ))}
              </div>
              {currentStep < STEPS.length ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={nextStep} 
                  className="gap-2 text-xs border-primary/20 text-primary hover:bg-primary/10"
                >
                  Próximo <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  variant="gold" 
                  size="sm" 
                  onClick={onEnd}
                  className="gap-2 text-xs"
                >
                  Finalizar Sessão <CheckCircle2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}