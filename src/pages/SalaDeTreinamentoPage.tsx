import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Flame, Zap, Play, ChevronRight, 
  BookOpen, Search, AlertCircle, History,
  Star, Clock, CheckCircle2, ArrowRight, Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  useSimCases, useSimSteps, useSimOptions, useSimProgress, 
  useSaveSimChoice, type SimCase, type SimOption, type SimStep 
} from '@/hooks/useSimuladorInterativo';
import { useCidadelaEstado } from '@/hooks/useCidadelaEstado';
import { cn } from '@/lib/utils';

// Componente principal da Sala de Treinamento Premium
export default function SalaDeTreinamentoPage() {
  const { user } = useAuth();
  const { estado } = useCidadelaEstado();
  const [activeCase, setActiveCase] = useState<SimCase | null>(null);
  const { data: allCases = [] } = useSimCases();
  const { data: progress = [] } = useSimProgress();

  // Mock de streak e nível (depois pode vir do DB)
  const streak = 5;
  const nivel = "Expert";
  const xpProgress = 75;

  const handleStartCase = (c: SimCase) => setActiveCase(c);
  const handleBack = () => {
    if (activeCase) {
      setActiveCase(null);
    } else {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#EAEAEA] font-sans selection:bg-primary/30 pb-20">
      <AnimatePresence mode="wait">
        {!activeCase ? (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-5xl mx-auto px-6 py-12 space-y-12"
          >
            {/* Header / Topo */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBack}
                  className="p-0 h-auto text-primary hover:text-primary/80 hover:bg-transparent -ml-1 mb-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
                </Button>
                <h1 className="text-3xl font-light tracking-tight text-white/90">
                  Bom dia, <span className="font-semibold text-white">{user?.name || 'Oraculista'}</span>
                </h1>
                <p className="text-muted-foreground/60 text-sm tracking-wide uppercase font-medium">
                  Pronto para refinar sua escuta na Câmara do Sussurro?
                </p>
              </div>
              
              <div className="flex items-center gap-8 bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 py-4 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2 text-[#D4AF37]">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm font-bold tracking-widest">{nivel}</span>
                  </div>
                  <Progress value={xpProgress} className="w-24 h-1 bg-white/10" />
                </div>
                
                <div className="w-px h-8 bg-white/10" />
                
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2 text-orange-500">
                    <Flame className="w-4 h-4 fill-orange-500" />
                    <span className="text-lg font-bold">{streak}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-tighter text-muted-foreground/60 font-bold">Streak</span>
                </div>
              </div>
            </header>

            {/* Treino de Hoje (Card Principal Estilo Netflix/Apple) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between ml-1">
                <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/30">Câmara de Simulação</h2>
                <Badge variant="outline" className="text-[9px] border-primary/20 text-primary/60">Treino Recomendado</Badge>
              </div>
              <TreinoPrincipalCard onStart={handleStartCase} />
            </section>

            {/* Grid de Modais Extras (Cards Menores) */}
            <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <MiniCard icon={Zap} title="Treino Rápido" description="3 min" />
              <MiniCard icon={BookOpen} title="Caso Clínico" description="Complexo" />
              <MiniCard icon={Search} title="Leitura de Campo" description="Simbólico" />
              <MiniCard icon={AlertCircle} title="Erro Oculto" description="Ache a falha" />
              <MiniCard icon={History} title="Histórico" description="Seus treinos" />
            </section>

            {/* Progresso e Ranking (Sutil) */}
            <footer className="grid md:grid-cols-2 gap-8 pt-8 border-t border-white/[0.05]">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white/50 flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#D4AF37]" /> Progresso Mensal
                </h3>
                <div className="h-32 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 flex items-end gap-2">
                  {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                    <div key={i} className="flex-1 bg-primary/20 rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/10 rounded-2xl p-6 flex items-center justify-between">
                <div className="space-y-2">
                  <h4 className="text-primary font-medium">Recomendação da IA</h4>
                  <p className="text-sm text-white/60 leading-relaxed max-w-[240px]">
                    "Sua escuta no Distrito Vínculo está excelente, mas notamos que a transferência pode ser refinada."
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
              </div>
            </footer>
          </motion.div>
        ) : (
          <motion.div 
            key="simulation"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="h-screen w-full"
          >
            <ExperienciaTreinoFull activeCase={activeCase} onExit={handleBack} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Card de Destaque Estilo Premium
function TreinoPrincipalCard({ onStart }: { onStart: (c: SimCase) => void }) {
  const { data: cases = [] } = useSimCases();
  const { estado } = useCidadelaEstado();
  
  const targetCase = useMemo(() => {
    return cases.find(c => c.distrito?.toLowerCase() === (estado?.distrito_atual || '').toLowerCase()) || cases[0];
  }, [cases, estado]);

  if (!targetCase) return <div className="h-64 rounded-3xl bg-white/5 animate-pulse" />;

  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-card transition-all duration-500 hover:border-primary/30">
      {/* Background Gradient / Image */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B] via-[#0A0A0B]/80 to-transparent z-10" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[100px] -z-0" />
      
      <div className="relative z-20 p-10 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-6 max-w-xl">
          <div className="flex items-center gap-3">
            <Badge className="bg-primary/20 text-primary border-none text-[10px] px-3 py-1 font-bold uppercase tracking-widest">
              Câmara de Simulação
            </Badge>
            <Badge variant="outline" className="border-white/10 text-white/40 text-[10px] px-3 py-1 font-bold uppercase tracking-widest">
              Distrito: {targetCase.distrito || 'Vínculo'}
            </Badge>
            <span className="text-white/30 text-xs flex items-center gap-1.5 ml-auto">
              <Clock className="w-3 h-3" /> 6 min
            </span>
          </div>
          
          <h3 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
            {targetCase.titulo}
          </h3>
          
          <p className="text-lg text-white/50 leading-relaxed font-light">
            Pratique a contenção e o manejo de campo em uma situação de alta tensão simbólica.
          </p>
          
          <Button 
            size="lg" 
            onClick={() => onStart(targetCase)}
            className="rounded-full px-10 py-7 text-lg bg-[#D4AF37] hover:bg-[#B8962E] text-black font-bold gap-3 shadow-[0_0_30px_rgba(212,175,55,0.2)] transition-all hover:scale-105"
          >
            <Play className="w-5 h-5 fill-current" /> Iniciar Treino
          </Button>
        </div>

        <div className="hidden md:flex flex-col items-center gap-4">
           {/* Visual Representação do Caso */}
           <div className="w-64 h-80 rounded-2xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/[0.1] flex items-center justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-2 border-primary/20 animate-ping absolute inset-0" />
                <div className="w-24 h-24 rounded-full border border-primary/40 flex items-center justify-center bg-[#0A0A0B] relative z-10">
                  <Zap className="w-10 h-10 text-primary" />
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

// Mini Cards Inferiores
function MiniCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="group bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 space-y-4 hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer">
      <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium text-white/80 tracking-wide">{title}</h4>
        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">{description}</p>
      </div>
    </div>
  );
}

// Experiência de Treino Full Screen (Apple Style)
function ExperienciaTreinoFull({ activeCase, onExit }: { activeCase: SimCase, onExit: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<SimOption | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isConcluded, setIsConcluded] = useState(false);
  
  const { data: steps = [] } = useSimSteps(activeCase.id);
  const currentStep = steps[stepIndex];
  const { data: options = [] } = useSimOptions(currentStep?.id);
  const saveChoice = useSaveSimChoice();
  const { addCompetencia } = useCidadelaEstado();

  const handleSelect = async (opt: SimOption) => {
    if (showFeedback) return;
    setSelectedOpt(opt);
    setShowFeedback(true);
    
    // Track choice
    await saveChoice.mutateAsync({
      caseId: activeCase.id,
      stepId: currentStep.id,
      escolhaId: opt.id
    });

    // Update global competencies if correct
    if (activeCase.distrito && opt.tipo_resultado === 'correto') {
      addCompetencia.mutate({
        distrito: activeCase.distrito,
        tipo: 'escrita', // assuming default type for simulation
        nivel: activeCase.nivel,
        acerto: true
      });
    }
  };

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(s => s + 1);
      setSelectedOpt(null);
      setShowFeedback(false);
    } else {
      setIsConcluded(true);
    }
  };

  if (isConcluded) return <ConclusaoTreino activeCase={activeCase} onFinish={onExit} />;

  return (
    <div className="fixed inset-0 bg-[#0A0A0B] z-50 flex flex-col">
      {/* Top Progress */}
      <nav className="p-6 flex items-center justify-between border-b border-white/[0.05] bg-black/40 backdrop-blur-xl">
        <button onClick={onExit} className="text-white/40 hover:text-white flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Sair do treino
        </button>
        <div className="flex-1 max-w-md mx-8">
          <Progress value={((stepIndex + 1) / (steps?.length || 1)) * 100} className="h-1.5 bg-white/5" />
        </div>
        <div className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">
          Etapa {stepIndex + 1} de {steps.length}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-3xl space-y-12">
          
          {/* Pergunta / Situação */}
          <motion.div 
            key={stepIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 text-center"
          >
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[10px] uppercase tracking-widest text-primary/80 font-bold mb-4">
                <BookOpen className="w-3 h-3" /> Situação Atual
             </div>
             <h2 className="text-2xl md:text-3xl font-light leading-relaxed text-white/90 italic">
               "{currentStep?.situacao_texto}"
             </h2>
             <p className="text-lg font-medium text-[#D4AF37]/90 mt-8">
               {currentStep?.pergunta}
             </p>
          </motion.div>

          {/* Opções */}
          <div className="grid gap-4">
            {options.map((opt, i) => (
              <motion.button
                key={opt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleSelect(opt)}
                disabled={showFeedback}
                className={cn(
                  "relative w-full text-left p-6 rounded-2xl border transition-all duration-300",
                  "hover:scale-[1.01] active:scale-100",
                  !showFeedback && "bg-white/[0.03] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.05]",
                  showFeedback && selectedOpt?.id === opt.id && opt.tipo_resultado === 'correto' && "bg-emerald-500/10 border-emerald-500/40",
                  showFeedback && selectedOpt?.id === opt.id && opt.tipo_resultado === 'erro' && "bg-rose-500/10 border-rose-500/40",
                  showFeedback && selectedOpt?.id === opt.id && opt.tipo_resultado === 'parcial' && "bg-amber-500/10 border-amber-500/40",
                  showFeedback && selectedOpt?.id !== opt.id && "opacity-40 grayscale-[0.5]"
                )}
              >
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-white/40">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-lg font-light text-white/80">{opt.texto_opcao}</span>
                </div>

                {/* Feedback Imediato Integrado */}
                <AnimatePresence>
                  {showFeedback && selectedOpt?.id === opt.id && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6 pt-6 border-t border-white/10 space-y-4"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                        <CheckCircle2 className="w-4 h-4" /> Feedback da Mentora
                      </div>
                      <p className="text-sm text-white/60 leading-relaxed">
                        {opt.feedback_texto}
                      </p>
                      {opt.explicacao_simbolica && (
                        <div className="p-4 rounded-xl bg-black/40 border border-white/5 italic text-sm text-white/40">
                          {opt.explicacao_simbolica}
                        </div>
                      )}
                      
                      <Button onClick={handleNext} className="w-full mt-4 bg-primary text-black hover:bg-primary/90 font-bold">
                        {stepIndex < steps.length - 1 ? 'Continuar para próxima etapa' : 'Finalizar Simulação'}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// Tela de Conclusão com Animação
function ConclusaoTreino({ activeCase, onFinish }: { activeCase: SimCase, onFinish: () => void }) {
  return (
    <div className="fixed inset-0 bg-[#0A0A0B] z-[60] flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-8 max-w-md"
      >
        {/* Visual do Distrito Acendendo */}
        <div className="relative mx-auto w-32 h-32 mb-12">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"
          />
          <div className="relative w-32 h-32 rounded-full border-2 border-primary/30 flex items-center justify-center bg-black">
            <Trophy className="w-12 h-12 text-[#D4AF37]" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-white">Treino Concluído</h2>
          <p className="text-xl text-[#D4AF37] font-light">Você refinou sua escuta hoje.</p>
          <p className="text-muted-foreground/60 leading-relaxed">
            O distrito da <span className="text-white font-medium italic">CidaDELA</span> brilha um pouco mais forte com sua prática consciente.
          </p>
        </div>

        <div className="pt-8">
           <Button 
            onClick={onFinish}
            size="lg"
            className="rounded-full px-12 bg-white text-black hover:bg-white/90 font-bold gap-2"
           >
             Próximo treino <ArrowRight className="w-4 h-4" />
           </Button>
        </div>
      </motion.div>
    </div>
  );
}
