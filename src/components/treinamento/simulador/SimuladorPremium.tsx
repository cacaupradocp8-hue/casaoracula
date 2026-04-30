import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, GraduationCap, Eye, EyeOff, 
  MessageSquare, User, ArrowRight, CheckCircle2,
  Sparkles, Brain, Target, FlaskConical, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { TrainingCase, RespostaAluna, SimuladorStep, STEP_ORDER, STEP_LABELS } from './types';
import { BlocoFeedback } from './BlocoFeedback';
import { useAvaliacaoIA } from './useAvaliacaoIA';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useStudentTracking } from '@/hooks/useStudentTracking';
import { useCidadelaEstado } from '@/hooks/useCidadelaEstado';
import { calcularFeedback } from './feedbackEngine';
import { calculateTrainingScore, gerarFeedbackJson } from './scoringEngine';
import { cn } from '@/lib/utils';

interface Props {
  caso: TrainingCase;
  onExit: () => void;
  onNextCaso?: () => void;
}

export function SimuladorPremium({ caso, onExit, onNextCaso }: Props) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { avaliacao, isLoading: isLoadingIA, avaliar, reset: resetAvaliacao } = useAvaliacaoIA();
  const { track } = useStudentTracking();
  const { addCompetencia } = useCidadelaEstado();
  
  const [step, setStep] = useState<SimuladorStep>('caso');
  const [modoMentora, setModoMentora] = useState(false);
  const [resposta, setResposta] = useState<RespostaAluna>({
    leitura_texto: '',
    distrito_escolhido: '',
    estado_escolhido: '',
    hipotese_texto: '',
    vetor_texto: '',
    ferramenta_escolhida: '',
  });

  const stepIdx = STEP_ORDER.indexOf(step);
  const progressPct = ((stepIdx + 1) / STEP_ORDER.length) * 100;

  const handleNext = () => {
    const nextIdx = stepIdx + 1;
    if (nextIdx < STEP_ORDER.length) {
      setStep(STEP_ORDER[nextIdx]);
    }
  };

  const salvarFinal = async () => {
    if (!user || !caso) return;
    
    const result = calcularFeedback(caso, resposta);
    const score = calculateTrainingScore(caso, resposta);
    const feedbackJson = gerarFeedbackJson(caso, resposta, score);
    const feedbackFinal = `[Premium] Score: ${score.total}/9 — ${result.resumo}`;

    avaliar(caso, resposta);

    await supabase.from('co_training_attempts').insert({
      user_id: user.id,
      case_id: caso.id,
      resposta_o_que_acontece: resposta.leitura_texto,
      resposta_distrito: resposta.distrito_escolhido,
      resposta_estado: resposta.estado_escolhido,
      resposta_hipotese: resposta.hipotese_texto,
      resposta_vetor: resposta.vetor_texto,
      resposta_ferramenta: resposta.ferramenta_escolhida,
      feedback_final: feedbackFinal,
      score_total: score.total,
      score_distrito: score.distrito,
      score_hipotese: score.hipotese,
      score_ferramenta: score.ferramenta,
      feedback_json: feedbackJson as any,
      status: 'concluido',
    });

    queryClient.invalidateQueries({ queryKey: ['training-progress'] });
    track('treinamento', 'completed_premium', 'caso_camara', caso.id);
  };

  return (
    <div className="fixed inset-0 bg-[#0A0A0B] z-50 flex flex-col overflow-hidden">
      {/* Premium Navbar */}
      <nav className="p-6 flex items-center justify-between border-b border-white/[0.05] bg-black/40 backdrop-blur-xl">
        <button onClick={onExit} className="text-white/40 hover:text-white flex items-center gap-2 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Sair da Câmara
        </button>
        
        <div className="flex-1 max-w-xl mx-8 space-y-2">
          <div className="flex justify-between text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold">
            <span>{STEP_LABELS[step]}</span>
            <span>Passo {stepIdx + 1} de {STEP_ORDER.length}</span>
          </div>
          <Progress value={progressPct} className="h-1 bg-white/5" />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setModoMentora(!modoMentora)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-[10px] font-bold uppercase tracking-wider",
              modoMentora ? "bg-primary/20 border-primary/40 text-primary" : "bg-white/5 border-white/10 text-white/40"
            )}
          >
            {modoMentora ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            Modo Mentora
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-start p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-4xl space-y-10 py-8">
          
          <AnimatePresence mode="wait">
            {step === 'caso' && (
              <motion.div 
                key="step-caso"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <header className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-primary/20 text-primary/60 text-[10px] uppercase tracking-widest px-3 py-1">
                      {caso.tema || 'Caso Clínico'}
                    </Badge>
                  </div>
                  <h2 className="text-4xl font-serif text-white">{caso.title}</h2>
                  <p className="text-white/40 text-lg font-light leading-relaxed">
                    Observe o campo, sinta a fala e prepare sua escuta.
                  </p>
                </header>

                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="md:col-span-2 bg-white/[0.03] border-white/[0.08] rounded-[2rem] overflow-hidden">
                    <CardContent className="p-8 space-y-6">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary/60">
                        <MessageSquare className="w-4 h-4" /> Contexto do Campo
                      </div>
                      <p className="text-xl text-white/80 font-light leading-relaxed italic">
                        {caso.caso_texto}
                      </p>
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    <Card className="bg-white/[0.02] border-white/[0.05] rounded-[1.5rem]">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                          <User className="w-3 h-3" /> Perfil Sugerido
                        </div>
                        <p className="text-sm text-white/60">
                          Foco em leitura simbólica e manejo de transferência.
                        </p>
                      </CardContent>
                    </Card>
                    
                    {modoMentora && (
                       <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <Card className="bg-primary/5 border-primary/20 rounded-[1.5rem]">
                          <CardContent className="p-6 space-y-3">
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
                              <Sparkles className="w-3 h-3" /> Visão da Mentora
                            </div>
                            <p className="text-xs text-primary/80 leading-relaxed italic">
                              "{caso.hipotese_esperada || 'Leitura profunda sendo processada...'}"
                            </p>
                          </CardContent>
                        </Card>
                       </motion.div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center pt-8">
                  <Button 
                    onClick={handleNext} 
                    className="rounded-full px-12 py-8 text-lg bg-primary hover:bg-primary/90 text-black font-bold gap-3 shadow-[0_0_40px_rgba(212,175,55,0.15)] transition-all hover:scale-105"
                  >
                    Iniciar Prática Clínica <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 'leitura' && (
              <motion.div 
                key="step-leitura"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8 max-w-2xl mx-auto"
              >
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <GraduationCap className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-serif text-white">O que acontece aqui?</h2>
                  <p className="text-white/40">
                    Descreva em uma frase o que você percebe no campo simbólico deste cliente.
                  </p>
                </div>

                <Textarea 
                  value={resposta.leitura_texto}
                  onChange={e => setResposta({...resposta, leitura_texto: e.target.value})}
                  placeholder="Ex: Percebo uma contração defensiva no Distrito do Portão..."
                  className="min-h-[150px] bg-white/[0.03] border-white/[0.1] text-lg rounded-2xl p-6 focus:border-primary/50 transition-all"
                />

                <Button 
                  onClick={handleNext} 
                  disabled={!resposta.leitura_texto}
                  className="w-full rounded-2xl py-8 text-lg bg-primary text-black font-bold"
                >
                  Confirmar Leitura
                </Button>
              </motion.div>
            )}

            {step === 'posicionamento' && (
              <motion.div 
                key="step-posicao"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-serif text-white">Localização na Cidadela</h2>
                  <p className="text-white/40">Onde essa dor ou padrão se ancora no mapa?</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Portão', 'Torres', 'Jardim', 'Labirinto', 'Praça', 'Espelho', 'Forja', 'Portal'].map(d => (
                    <button
                      key={d}
                      onClick={() => setResposta({...resposta, distrito_escolhido: d})}
                      className={cn(
                        "p-6 rounded-2xl border transition-all text-center space-y-3",
                        resposta.distrito_escolhido === d 
                          ? "bg-primary/20 border-primary text-primary" 
                          : "bg-white/[0.02] border-white/5 hover:border-white/20"
                      )}
                    >
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                        <Target className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium">{d}</span>
                    </button>
                  ))}
                </div>

                <Button 
                  onClick={handleNext} 
                  disabled={!resposta.distrito_escolhido}
                  className="w-full rounded-2xl py-8 text-lg bg-primary text-black font-bold"
                >
                  Definir Posicionamento
                </Button>
              </motion.div>
            )}

            {step === 'direcao' && (
              <motion.div 
                key="step-direcao"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8 max-w-2xl mx-auto"
              >
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Brain className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-serif text-white">Hipótese Clínica</h2>
                  <p className="text-white/40">
                    Qual sua hipótese sobre o movimento psíquico necessário agora?
                  </p>
                </div>

                <Textarea 
                  value={resposta.hipotese_texto}
                  onChange={e => setResposta({...resposta, hipotese_texto: e.target.value})}
                  placeholder="A hipótese é que..."
                  className="min-h-[150px] bg-white/[0.03] border-white/[0.1] text-lg rounded-2xl p-6"
                />

                <Button 
                  onClick={handleNext} 
                  disabled={!resposta.hipotese_texto}
                  className="w-full rounded-2xl py-8 text-lg bg-primary text-black font-bold"
                >
                  Traçar Direção
                </Button>
              </motion.div>
            )}

            {step === 'ferramenta' && (
              <motion.div 
                key="step-ferramenta"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8 max-w-2xl mx-auto"
              >
                <div className="space-y-4 text-center">
                   <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <FlaskConical className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-serif text-white">Escolha da Ferramenta</h2>
                  <p className="text-white/40">O que você usará para operar neste campo?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Cartografia', 'Torre Viva', 'Eneagrama', 'Big5', 'Ritual', 'Onírica'].map(f => (
                    <button
                      key={f}
                      onClick={() => setResposta({...resposta, ferramenta_escolhida: f})}
                      className={cn(
                        "p-6 rounded-2xl border transition-all flex items-center gap-4",
                        resposta.ferramenta_escolhida === f 
                          ? "bg-primary/20 border-primary text-primary" 
                          : "bg-white/[0.02] border-white/5 hover:border-white/20"
                      )}
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{f}</span>
                    </button>
                  ))}
                </div>

                <Button 
                  onClick={() => { salvarFinal(); handleNext(); }} 
                  disabled={!resposta.ferramenta_escolhida}
                  className="w-full rounded-2xl py-8 text-lg bg-[#D4AF37] text-black font-bold"
                >
                  Finalizar Treino
                </Button>
              </motion.div>
            )}

            {step === 'feedback' && (
              <motion.div 
                key="step-feedback"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full"
              >
                <BlocoFeedback 
                  caso={caso}
                  resposta={resposta}
                  onReset={() => {
                    setStep('caso');
                    setResposta({
                      leitura_texto: '',
                      distrito_escolhido: '',
                      estado_escolhido: '',
                      hipotese_texto: '',
                      vetor_texto: '',
                      ferramenta_escolhida: '',
                    });
                    resetAvaliacao();
                  }}
                  onNextCaso={onNextCaso}
                  isLast={!onNextCaso}
                  avaliacaoIA={avaliacao}
                  isLoadingIA={isLoadingIA}
                />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}