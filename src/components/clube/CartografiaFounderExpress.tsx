import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Compass, Sparkles, ArrowRight, ArrowLeft, Loader2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CIDADELA_TERRITORIOS } from '@/types/cidadela-territorios';

const QUESTIONS = [
  { id: 'coracao_cidadela', text: 'Você sente que possui um centro de clareza e repouso hoje?' },
  { id: 'portao_chegada', text: 'Sente que está pronta para iniciar uma nova travessia simbólica?' },
  { id: 'torres', text: 'Suas fronteiras e limites internos estão bem protegidos agora?' },
  { id: 'forja', text: 'Existe algo em você que pede transformação imediata pelo fogo?' },
  { id: 'portas', text: 'Você percebe novas passagens se abrindo na sua vida atual?' },
  { id: 'espelho_vinculos', text: 'Suas relações atuais refletem sua verdade com nitidez?' },
  { id: 'casa_sonhos', text: 'Suas imagens internas e sonhos têm falado alto ultimamente?' },
  { id: 'jardim_heroina', text: 'Sente que está cultivando sua natureza autêntica e autoral?' },
  { id: 'bosque_arquetipos', text: 'Percebe forças ancestrais ou mitos guiando seus passos?' },
  { id: 'conselho_interior', text: 'Existe diálogo e harmonia entre as diferentes vozes em você?' },
  { id: 'praca_abalo', text: 'Consegue sustentar o vazio ou a sombra sem perder o rumo?' },
  { id: 'labirinto', text: 'Sente que está navegando bem em meio às suas perguntas sem resposta?' }
];

export function CartografiaFounderExpress() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isFinishing, setIsFinishing] = useState(false);

  const currentQuestion = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  const handleAnswer = (value: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinalize = async () => {
    if (!user) return;
    setIsFinishing(true);

    try {
      // Determinar território dominante (maior nota)
      const sorted = Object.entries(answers).sort((a, b) => b[1] - a[1]);
      const dominant = sorted[0][0];
      const tension = sorted[sorted.length - 1][0];
      const activeDistricts = Object.entries(answers)
        .filter(([_, val]) => val >= 4)
        .map(([id]) => id);

      // Se nenhum for >= 4, pega os 3 maiores
      const distritosAcesos = activeDistricts.length > 0 
        ? activeDistricts 
        : sorted.slice(0, 3).map(([id]) => id);

      // Atualizar Cidadela Estado
      const { error: stateError } = await supabase
        .from('user_cidadela_estado' as any)
        .upsert({
          user_id: user.id,
          distrito_atual: dominant,
          distritos_ativados: distritosAcesos,
          intensidade_por_distrito: answers,
          ultimo_movimento: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (stateError) throw stateError;

      // Criar registro na cartografia_psiquica (simplificado)
      await supabase.from('cartografia_psiquica').insert({
        user_id: user.id,
        cor_predominante: 'Ouro',
        territorios_principais: distritosAcesos,
        ponto_partida: dominant,
        metadata_json: { 
          versao: 'founder-express',
          respostas: answers 
        },
      } as any);

      toast.success('Sua CidadELA Founder foi inicializada! ✨');
      navigate('/clube/cidadela/resultado');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao salvar sua cartografia.');
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-midnight flex flex-col items-center justify-center p-6 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(196,165,74,0.05),transparent_70%)] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-xl space-y-12">
        <header className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-gold/40 mb-2">
            <Compass className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Cartografia Founder</span>
          </div>
          <Progress value={progress} className="h-1 bg-white/5" />
          <p className="text-[10px] text-white/30 uppercase tracking-widest">Passo {currentStep + 1} de {QUESTIONS.length}</p>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            <h2 className="text-2xl md:text-4xl font-serif text-center leading-tight italic">
              "{currentQuestion.text}"
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {[
                { val: 5, label: 'Sim, intensamente' },
                { val: 4, label: 'Sim, sinto presença' },
                { val: 3, label: 'Às vezes / Neutro' },
                { val: 2, label: 'Raramente' },
                { val: 1, label: 'Ainda não percebo' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => handleAnswer(opt.val)}
                  className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-gold/10 hover:border-gold/30 transition-all text-left group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 group-hover:text-gold transition-colors">{opt.label}</span>
                    <div className="w-4 h-4 rounded-full border border-white/20 group-hover:border-gold group-hover:bg-gold/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold opacity-0 group-hover:opacity-100" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <footer className="flex items-center justify-between pt-8 border-t border-white/5">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="text-white/30 hover:text-white"
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> Voltar
          </Button>

          {currentStep === QUESTIONS.length - 1 && answers[currentQuestion.id] ? (
            <Button
              variant="gold"
              onClick={handleFinalize}
              disabled={isFinishing}
              className="rounded-full px-8 shadow-premium-glow"
            >
              {isFinishing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Revelar minha CidadELA'}
            </Button>
          ) : (
            <div className="text-[10px] text-white/20 uppercase tracking-widest italic">Escolha uma resposta</div>
          )}
        </footer>
      </div>
    </div>
  );
}
