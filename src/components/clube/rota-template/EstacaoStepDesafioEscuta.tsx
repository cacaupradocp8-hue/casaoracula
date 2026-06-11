import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Send, Brain, Target, MessageSquare, Info, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Alternativa {
  titulo: string;
  descricao: string;
  classificacao: 'adequada' | 'parcial' | 'apressada';
  feedback: string;
}

interface DesafioEscutaProps {
  estacaoId: string;
  rotaId: string;
  pergunta: string;
  alternativas: Alternativa[];
  leituraModelo: string;
  cuidadoEtico: string;
  onNext: () => void;
}

export const EstacaoStepDesafioEscuta: React.FC<DesafioEscutaProps> = ({
  estacaoId,
  rotaId,
  pergunta,
  alternativas,
  leituraModelo,
  cuidadoEtico,
  onNext
}) => {
  const { user } = useAuth();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [status, setStatus] = useState<'pendente' | 'concluido'>('pendente');

  const saveMutation = useMutation({
    mutationFn: async (idx: number) => {
      if (!user) return;
      
      const alternativa = alternativas[idx];
      
      const { error } = await supabase
        .from('clube_desafio_escuta_registros')
        .insert({
          user_id: user.id,
          rota_id: rotaId,
          estacao_id: estacaoId,
          alternativa_escolhida: alternativa.titulo,
          classificacao: alternativa.classificacao,
          feedback_exibido: alternativa.feedback,
          status: 'concluido'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      setStatus('concluido');
      toast.success('Desafio de escuta registrado!');
    },
    onError: (err: any) => {
      toast.error('Erro ao salvar registro: ' + err.message);
    }
  });

  const handleSelect = (idx: number) => {
    if (showFeedback) return;
    setSelectedIdx(idx);
  };

  const handleConfirm = () => {
    if (selectedIdx === null) return;
    setShowFeedback(true);
    saveMutation.mutate(selectedIdx);
  };

  const getBadgeColor = (classificacao: string) => {
    switch (classificacao) {
      case 'adequada': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'parcial': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'apressada': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-white/5 text-white/40 border-white/10';
    }
  };

  const getClassificacaoLabel = (classificacao: string) => {
    switch (classificacao) {
      case 'adequada': return 'Leitura Adequada';
      case 'parcial': return 'Leitura Parcial';
      case 'apressada': return 'Leitura Apressada';
      default: return classificacao;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 px-4">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-gold" />
        </div>
        <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl font-display font-black text-white tracking-[0.1em] leading-tight uppercase px-4 break-words">
          <span className="bg-gradient-to-b from-white via-white to-gold/70 bg-clip-text text-transparent">
            Laboratório <br className="xs:hidden" /> de Escuta
          </span>
        </h2>

        <p className="text-gold/60 text-lg max-w-2xl mx-auto font-serif italic leading-relaxed">
          “Agora observe o caso sem pressa. O objetivo não é acertar uma resposta clínica. É perceber qual camada simbólica se apresenta primeiro.”
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] space-y-4">
          <div className="flex items-center gap-3 text-gold/80">
            <Target className="w-6 h-6" />
            <span className="text-[10px] uppercase tracking-widest font-black">Investigação Ativa</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-serif text-white italic">{pergunta}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alternativas.map((alt, idx) => (
            <motion.div
              key={idx}
              whileHover={!showFeedback ? { scale: 1.02 } : {}}
              whileTap={!showFeedback ? { scale: 0.98 } : {}}
            >
              <Card
                onClick={() => handleSelect(idx)}
                className={cn(
                  "p-6 rounded-[24px] cursor-pointer transition-all h-full border-2",
                  selectedIdx === idx 
                    ? "bg-gold/10 border-gold shadow-[0_0_30px_rgba(212,175,55,0.1)]" 
                    : "bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]",
                  showFeedback && selectedIdx !== idx && "opacity-40 grayscale pointer-events-none"
                )}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className={cn(
                      "text-xl font-serif italic",
                      selectedIdx === idx ? "text-gold" : "text-white/90"
                    )}>
                      {alt.titulo}
                    </h4>
                    {selectedIdx === idx && !showFeedback && (
                      <div className="w-5 h-5 rounded-full bg-gold flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-midnight" />
                      </div>
                    )}
                  </div>
                  <p className="text-white/60 font-serif italic text-sm leading-relaxed">
                    {alt.descricao}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {!showFeedback && (
          <div className="flex justify-center pt-8">
            <Button
              disabled={selectedIdx === null}
              onClick={handleConfirm}
              className="bg-gold hover:bg-gold/80 text-midnight font-bold px-16 h-16 rounded-full text-xs uppercase tracking-widest shadow-2xl shadow-gold/20 disabled:opacity-30"
            >
              Registrar Minha Escuta
            </Button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="relative">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                <div className={cn(
                  "px-6 py-2 rounded-full border text-[10px] uppercase tracking-[0.2em] font-black",
                  getBadgeColor(alternativas[selectedIdx!].classificacao)
                )}>
                  {getClassificacaoLabel(alternativas[selectedIdx!].classificacao)}
                </div>
              </div>

              <Card className="bg-white/[0.03] border-white/10 p-10 rounded-[40px] space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-gold/60">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-[10px] uppercase tracking-widest font-black">Sua Leitura</span>
                      </div>
                      <p className="text-white font-serif italic text-lg leading-relaxed">
                        "{alternativas[selectedIdx!].titulo}: {alternativas[selectedIdx!].descricao}"
                      </p>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-3 text-gold/60">
                        <Info className="w-4 h-4" />
                        <span className="text-[10px] uppercase tracking-widest font-black">Feedback da Casa</span>
                      </div>
                      <p className="text-gold/80 font-serif italic text-lg leading-relaxed">
                        {alternativas[selectedIdx!].feedback}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-emerald-400/60">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-[10px] uppercase tracking-widest font-black">Leitura-Modelo</span>
                      </div>
                      <p className="text-white/80 font-serif italic text-lg leading-relaxed">
                        {leituraModelo}
                      </p>
                    </div>

                    <div className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-2xl space-y-3">
                      <div className="flex items-center gap-3 text-blue-400/80">
                        <ShieldAlert className="w-4 h-4" />
                        <span className="text-[10px] uppercase tracking-widest font-black">Cuidado Ético</span>
                      </div>
                      <p className="text-white/60 font-serif italic text-base leading-relaxed">
                        {cuidadoEtico}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-8 border-t border-white/5">
                  <Button
                    onClick={onNext}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold px-16 h-16 rounded-full text-[10px] uppercase tracking-[0.3em]"
                  >
                    Continuar Travessia
                  </Button>
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};