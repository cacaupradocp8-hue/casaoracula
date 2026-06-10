import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, CheckCircle2, Send, Info, Calendar, Target, MessageSquare, ClipboardCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MissaoCampoProps {
  estacaoId: string;
  rotaId: string;
  titulo: string;
  texto: string;
  checklist: string[];
  labelObservacao: string;
  labelSinal: string;
  labelPergunta: string;
  onNext: () => void;
}

export const EstacaoStepMissaoCampo: React.FC<MissaoCampoProps> = ({
  estacaoId,
  rotaId,
  titulo,
  texto,
  checklist,
  labelObservacao,
  labelSinal,
  labelPergunta,
  onNext
}) => {
  const { user } = useAuth();
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [respostas, setRespostas] = useState({
    observacao: '',
    sinal: '',
    pergunta: ''
  });
  const [view, setView] = useState<'orientacao' | 'registro' | 'concluido'>('orientacao');

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      
      const { error } = await supabase
        .from('clube_missao_campo_registros')
        .insert({
          user_id: user.id,
          rota_id: rotaId,
          estacao_id: estacaoId,
          titulo_missao: titulo,
          checklist_concluido: checkedItems,
          resposta_observacao: respostas.observacao,
          resposta_sinal: respostas.sinal,
          resposta_pergunta: respostas.pergunta,
          status: 'concluido'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      setView('concluido');
      toast.success('Missão de campo registrada!');
    },
    onError: (err: any) => {
      toast.error('Erro ao salvar registro: ' + err.message);
    }
  });

  const handleCheck = (idx: number) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const isFormValid = respostas.observacao.length > 10 && 
                      respostas.sinal.length > 5 && 
                      respostas.pergunta.length > 5 &&
                      Object.values(checkedItems).filter(Boolean).length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 px-4">
      {view !== 'orientacao' && view !== 'concluido' && (
        <button 
          onClick={() => {
            if (view === 'registro') setView('orientacao');
          }}
          className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-widest font-bold hover:text-white transition-colors"
        >
          <Sword className="w-3 h-3 rotate-180" />
          Voltar na Missão
        </button>
      )}
      <AnimatePresence mode="wait">

        {view === 'orientacao' && (
          <motion.div
            key="orientacao"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4">
                <Sword className="w-8 h-8 text-gold" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.4em] text-gold/60 font-black">Missão de Campo</span>
                <h2 className="text-3xl md:text-5xl font-serif text-white italic">{titulo}</h2>
              </div>
            </div>

            <Card className="bg-white/[0.02] border-white/5 p-10 rounded-[40px] space-y-8 relative overflow-hidden">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-gold/80">
                  <Calendar className="w-5 h-5" />
                  <span className="text-[10px] uppercase tracking-widest font-black">Tempo de Observação: 3 dias</span>
                </div>
                
                <div className="prose prose-invert prose-p:font-serif prose-p:italic prose-p:text-xl prose-p:text-white/80 prose-p:leading-relaxed">
                  {texto.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>

              <div className="flex justify-center pt-8 border-t border-white/5">
                <Button 
                  onClick={() => setView('registro')}
                  className="bg-gold hover:bg-gold/80 text-midnight font-bold px-12 py-7 rounded-full text-xs uppercase tracking-widest transition-all shadow-2xl shadow-gold/20 hover:scale-105"
                >
                  Registrar Observação
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {view === 'registro' && (
          <motion.div
            key="registro"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            <div className="text-center space-y-4">
              <h3 className="text-sm uppercase tracking-[0.4em] text-gold font-bold">Registro de Campo</h3>
              <p className="text-white/40 font-serif italic text-lg">Mapeando sinais de vitalidade</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 space-y-6">
                <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[32px] space-y-6">
                  <div className="flex items-center gap-3 text-gold/60 mb-2">
                    <ClipboardCheck className="w-4 h-4" />
                    <span className="text-[10px] uppercase tracking-widest font-black">Checklist de Observação</span>
                  </div>
                  
                  <div className="space-y-4">
                    {checklist.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 group cursor-pointer" onClick={() => handleCheck(idx)}>
                        <Checkbox 
                          id={`item-${idx}`} 
                          checked={checkedItems[idx]} 
                          onCheckedChange={() => handleCheck(idx)}
                          className="mt-1 border-white/20 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                        />
                        <label 
                          htmlFor={`item-${idx}`}
                          className={cn(
                            "text-sm font-serif italic leading-relaxed transition-colors cursor-pointer",
                            checkedItems[idx] ? "text-white/80" : "text-white/30 group-hover:text-white/50"
                          )}
                        >
                          {item}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gold/60">
                    <Target className="w-4 h-4" />
                    <Label className="text-[10px] uppercase tracking-widest font-black">{labelObservacao}</Label>
                  </div>
                  <Textarea 
                    value={respostas.observacao}
                    onChange={(e) => setRespostas(prev => ({ ...prev, observacao: e.target.value }))}
                    placeholder="Descreva a situação observada..."
                    className="bg-white/5 border-white/10 min-h-[120px] rounded-2xl p-6 font-serif italic text-lg"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-emerald-400/60">
                    <Sparkles className="w-4 h-4" />
                    <Label className="text-[10px] uppercase tracking-widest font-black">{labelSinal}</Label>
                  </div>
                  <Textarea 
                    value={respostas.sinal}
                    onChange={(e) => setRespostas(prev => ({ ...prev, sinal: e.target.value }))}
                    placeholder="Quais sinais simbólicos apareceram?"
                    className="bg-white/5 border-white/10 min-h-[100px] rounded-2xl p-6 font-serif italic text-lg"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-blue-400/60">
                    <MessageSquare className="w-4 h-4" />
                    <Label className="text-[10px] uppercase tracking-widest font-black">{labelPergunta}</Label>
                  </div>
                  <Textarea 
                    value={respostas.pergunta}
                    onChange={(e) => setRespostas(prev => ({ ...prev, pergunta: e.target.value }))}
                    placeholder="Que pergunta segura você faria?"
                    className="bg-white/5 border-white/10 min-h-[100px] rounded-2xl p-6 font-serif italic text-lg"
                  />
                </div>

                <div className="flex justify-center pt-8">
                  <Button
                    disabled={!isFormValid || saveMutation.isPending}
                    onClick={() => saveMutation.mutate()}
                    className="bg-gold hover:bg-gold/80 text-midnight font-bold px-16 h-16 rounded-full text-xs uppercase tracking-widest shadow-2xl shadow-gold/20 transition-all hover:scale-105"
                  >
                    {saveMutation.isPending ? 'Salvando...' : 'Registrar Missão de Campo'}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'concluido' && (
          <motion.div
            key="concluido"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-12 py-20"
          >
            <div className="w-28 h-24 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-gold border border-gold/20 shadow-2xl shadow-gold/10">
              <CheckCircle2 className="w-14 h-14" />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif text-white italic">Missão Cumprida</h2>
              <p className="text-white/40 text-lg max-w-md mx-auto font-serif italic">
                Sua observação de campo foi registrada. Estes rastros de integração são fundamentais para sua caminhada profissional e pessoal.
              </p>
            </div>
            <Button 
              onClick={onNext}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-16 h-16 rounded-full text-[10px] uppercase tracking-[0.3em]"
            >
              Continuar Travessia
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import { Label } from '@/components/ui/label';
