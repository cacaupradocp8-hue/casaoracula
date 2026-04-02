import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical, ChevronRight, Filter, Lock, CheckCircle2,
  Play, BookOpen, Shield, Flame, Compass, Eye, EyeOff,
  ArrowRight, AlertCircle, Sparkles, Wrench
} from 'lucide-react';
import { GerarCasoIA } from './GerarCasoIA';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  useSimCases, useSimSteps, useSimOptions, useSimProgress,
  useSimCaseProgress, useSaveSimChoice, getCaseStatus,
  type SimCase, type SimOption, type SimStep,
} from '@/hooks/useSimuladorInterativo';
import { useAuth } from '@/contexts/AuthContext';

const nivelConfig: Record<number, { label: string; icon: typeof Compass; color: string }> = {
  1: { label: 'Nível 1', icon: Compass, color: 'text-emerald-400' },
  2: { label: 'Nível 2', icon: Flame, color: 'text-amber-400' },
  3: { label: 'Nível 3', icon: Shield, color: 'text-rose-400' },
};

const tipoLabels: Record<string, string> = {
  individual: 'Individual',
  grupo: 'Grupo',
  misto: 'Misto',
};

const resultColors: Record<string, string> = {
  correto: 'border-emerald-500/30 bg-emerald-500/10',
  parcial: 'border-amber-500/30 bg-amber-500/10',
  erro: 'border-rose-500/30 bg-rose-500/10',
};

const resultLabels: Record<string, string> = {
  correto: '✦ Condução adequada',
  parcial: '◈ Parcialmente adequada',
  erro: '✕ Condução inadequada',
};

export function SimuladorInterativo() {
  const [activeCase, setActiveCase] = useState<SimCase | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<SimOption | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showMentora, setShowMentora] = useState(false);
  const [filterTipo, setFilterTipo] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [sessionResults, setSessionResults] = useState<Array<{ step: SimStep; option: SimOption }>>([]);
  const [showSummary, setShowSummary] = useState(false);

  const { user } = useAuth();
  const isAdmin = user?.portal === 'admin';
  const isTerapeuta = user?.portal === 'oracula' || isAdmin;

  const { data: cases = [], isLoading } = useSimCases();
  const { data: allProgress = [] } = useSimProgress();
  const { data: steps = [] } = useSimSteps(activeCase?.id);
  const currentStep = steps[currentStepIndex];
  const { data: options = [] } = useSimOptions(currentStep?.id);
  const saveChoice = useSaveSimChoice();

  // Check what levels are completed
  const completedLevels = useMemo(() => {
    const levels = new Set<number>();
    cases.forEach(c => {
      if (getCaseStatus(allProgress, c.id, 3) === 'completed') {
        levels.add(c.nivel);
      }
    });
    return levels;
  }, [cases, allProgress]);

  const isLevelUnlocked = (nivel: number) => {
    if (nivel === 1) return true;
    // At least one case from prev level must be completed
    return completedLevels.has(nivel - 1);
  };

  const filteredCases = useMemo(() => {
    let filtered = cases;
    if (filterTipo) filtered = filtered.filter(c => c.tipo === filterTipo);
    return filtered;
  }, [cases, filterTipo]);

  const handleStartCase = (c: SimCase) => {
    setActiveCase(c);
    setCurrentStepIndex(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setCompletedSteps([]);
    setSessionResults([]);
    setShowSummary(false);
  };

  const handleSelectOption = async (opt: SimOption) => {
    if (showFeedback) return;
    setSelectedOption(opt);
    setShowFeedback(true);

    if (activeCase && currentStep) {
      await saveChoice.mutateAsync({
        caseId: activeCase.id,
        stepId: currentStep.id,
        escolhaId: opt.id,
      });
      setSessionResults(prev => [...prev, { step: currentStep, option: opt }]);
    }
  };

  const handleNextStep = () => {
    if (currentStep) {
      setCompletedSteps(prev => [...prev, currentStep.id]);
    }

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setShowSummary(true);
    }
  };

  const handleBackToList = () => {
    setActiveCase(null);
    setCurrentStepIndex(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setCompletedSteps([]);
    setSessionResults([]);
    setShowSummary(false);
  };

  // ===== SUMMARY VIEW =====
  if (showSummary && activeCase) {
    const corretos = sessionResults.filter(r => r.option.tipo_resultado === 'correto').length;
    const parciais = sessionResults.filter(r => r.option.tipo_resultado === 'parcial').length;
    const erros = sessionResults.filter(r => r.option.tipo_resultado === 'erro').length;
    const total = sessionResults.length;
    const score = Math.round(((corretos * 2 + parciais) / (total * 2)) * 100);

    return (
      <div className="space-y-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-border/12 bg-card/40">
            <CardContent className="p-6 text-center">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
              <h2 className="text-xl font-display text-foreground mb-1">Simulação Concluída</h2>
              <p className="text-sm text-muted-foreground mb-4">{activeCase.titulo}</p>
              <div className="text-4xl font-bold text-primary mb-2">{score}%</div>
              <Progress value={score} className="h-2 max-w-xs mx-auto mb-4" />
              <div className="flex justify-center gap-4 text-xs">
                <span className="text-emerald-400">✦ {corretos} corretas</span>
                <span className="text-amber-400">◈ {parciais} parciais</span>
                <span className="text-rose-400">✕ {erros} erros</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed results */}
        <div className="space-y-3">
          {sessionResults.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`border ${resultColors[r.option.tipo_resultado]}`}>
                <CardContent className="p-4">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 mb-1">
                    Etapa {i + 1}
                  </p>
                  <p className="text-xs text-foreground/70 mb-2 italic">"{r.step.situacao_texto.slice(0, 80)}..."</p>
                  <p className="text-xs font-medium text-foreground/80 mb-1">
                    Sua escolha: {r.option.texto_opcao.slice(0, 60)}...
                  </p>
                  <p className="text-[10px] text-muted-foreground/60">
                    {resultLabels[r.option.tipo_resultado]}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={handleBackToList}>
            Voltar aos casos
          </Button>
          <Button className="flex-1" onClick={() => handleStartCase(activeCase)}>
            Refazer simulação
          </Button>
        </div>
      </div>
    );
  }

  // ===== SIMULATION VIEW =====
  if (activeCase && currentStep) {
    const progressPercent = Math.round(((currentStepIndex + (showFeedback ? 1 : 0)) / steps.length) * 100);

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-primary/50 uppercase tracking-[0.2em]">
              Etapa {currentStepIndex + 1} de {steps.length}
            </p>
            <h3 className="text-sm font-medium text-foreground">{activeCase.titulo}</h3>
          </div>
          {isTerapeuta && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMentora(!showMentora)}
              className="gap-1 text-xs"
            >
              {showMentora ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {showMentora ? 'Ocultar' : 'Ver leitura'}
            </Button>
          )}
        </div>

        <Progress value={progressPercent} className="h-1.5" />

        {/* Mentora view */}
        <AnimatePresence>
          {showMentora && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Card className="border-amber-500/15 bg-amber-500/5">
                <CardContent className="p-4 space-y-2">
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-amber-500/20 text-amber-400">
                    Leitura da Mentora
                  </Badge>
                  {activeCase.leitura_mentora && (
                    <p className="text-xs text-muted-foreground/80">{activeCase.leitura_mentora}</p>
                  )}
                  {activeCase.ferramenta_sugerida && (
                    <p className="text-xs text-muted-foreground/60 flex items-center gap-1">
                      <Wrench className="w-3 h-3" /> {activeCase.ferramenta_sugerida}
                    </p>
                  )}
                  {currentStep.objetivo_oculto && (
                    <p className="text-xs text-muted-foreground/60">
                      <strong>Objetivo desta etapa:</strong> {currentStep.objetivo_oculto}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Situation */}
        <motion.div key={currentStep.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-border/12 bg-card/40">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-primary/60" />
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 font-medium">Situação</p>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed italic">
                {currentStep.situacao_texto}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Question + Options */}
        <div>
          <p className="text-xs font-medium text-foreground/70 mb-3">{currentStep.pergunta}</p>
          <div className="space-y-2">
            {options.map((opt, i) => {
              const isSelected = selectedOption?.id === opt.id;
              const showResult = showFeedback;

              return (
                <motion.div
                  key={opt.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <button
                    onClick={() => handleSelectOption(opt)}
                    disabled={showFeedback}
                    className={`w-full text-left p-4 rounded-lg border transition-all text-sm ${
                      showResult && isSelected
                        ? resultColors[opt.tipo_resultado]
                        : showResult
                        ? 'border-border/10 opacity-50'
                        : 'border-border/20 hover:border-primary/30 hover:bg-primary/5 bg-card/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-[10px] text-muted-foreground/40 mt-0.5 font-mono shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-foreground/80">{opt.texto_opcao}</span>
                    </div>
                    {showResult && isSelected && (
                      <p className="text-[10px] mt-2 ml-5 text-muted-foreground/60">
                        {resultLabels[opt.tipo_resultado]}
                      </p>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {showFeedback && selectedOption && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <Card className={`border ${resultColors[selectedOption.tipo_resultado]}`}>
                <CardContent className="p-5 space-y-3">
                  {selectedOption.feedback_texto && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 mb-1">Consequência</p>
                      <p className="text-sm text-foreground/80 leading-relaxed">{selectedOption.feedback_texto}</p>
                    </div>
                  )}
                  {selectedOption.explicacao_simbolica && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 mb-1">Leitura Simbólica</p>
                      <p className="text-sm text-foreground/70 leading-relaxed italic">{selectedOption.explicacao_simbolica}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button onClick={handleNextStep} className="w-full gap-1">
                {currentStepIndex < steps.length - 1 ? (
                  <>Continuar simulação <ArrowRight className="w-3 h-3" /></>
                ) : (
                  <>Ver resultado final <Sparkles className="w-3 h-3" /></>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <Button variant="ghost" size="sm" className="w-full" onClick={handleBackToList}>
          Sair da simulação
        </Button>
      </div>
    );
  }

  // ===== CASE LIST VIEW =====
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-medium text-foreground mb-1">Simulador de Decisão Clínica</h2>
        <p className="text-xs text-muted-foreground/70">
          Pratique condução terapêutica com cenários interativos. Cada escolha gera consequências e feedback.
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['individual', 'grupo', 'misto'].map(t => (
          <Button
            key={t}
            variant={filterTipo === t ? 'default' : 'outline'}
            size="sm"
            className="text-xs h-7"
            onClick={() => setFilterTipo(filterTipo === t ? null : t)}
          >
            {tipoLabels[t]}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 rounded-lg bg-muted/20 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCases.map(c => {
            const cfg = nivelConfig[c.nivel] || nivelConfig[1];
            const Icon = cfg.icon;
            const status = getCaseStatus(allProgress, c.id, 3);
            const unlocked = isLevelUnlocked(c.nivel);

            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card
                  className={`border-border/12 transition-all duration-300 ${
                    unlocked
                      ? 'bg-card/40 hover:-translate-y-0.5 hover:shadow-md cursor-pointer'
                      : 'bg-muted/10 opacity-50'
                  } ${status === 'completed' ? 'border-primary/20' : ''}`}
                  onClick={() => unlocked && handleStartCase(c)}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      status === 'completed' ? 'bg-primary/15' : unlocked ? 'bg-muted/20' : 'bg-muted/10'
                    }`}>
                      {!unlocked ? (
                        <Lock className="w-4 h-4 text-muted-foreground/30" />
                      ) : status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      ) : (
                        <Play className="w-4 h-4 text-foreground/60" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <Icon className={`w-3 h-3 ${cfg.color}`} />
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50">{cfg.label}</span>
                        <Badge variant="outline" className="text-[9px] border-border/15 px-1.5 py-0">
                          {tipoLabels[c.tipo]}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-foreground truncate">{c.titulo}</p>
                      {c.descricao && (
                        <p className="text-xs text-muted-foreground/50 truncate">{c.descricao}</p>
                      )}
                    </div>
                    {unlocked && (
                      <ChevronRight className="w-4 h-4 text-muted-foreground/30 shrink-0" />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
