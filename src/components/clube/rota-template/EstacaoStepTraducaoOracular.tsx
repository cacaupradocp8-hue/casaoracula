import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, BookOpen, Sparkles, Send, CheckCircle2, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface TraducaoOracularProps {
  estacaoId: string;
  onNext: () => void;
}

export const EstacaoStepTraducaoOracular: React.FC<TraducaoOracularProps> = ({ estacaoId, onNext }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [integracao, setIntegracao] = useState('');
  const [profissional, setProfissional] = useState('');
  const [view, setView] = useState<'intro' | 'traducao' | 'pergunta' | 'concluido'>('intro');

  const { data: traducao, isLoading } = useQuery({
    queryKey: ['traducao-oracular', estacaoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_traducao_oracular')
        .select('*')
        .eq('estacao_id', estacaoId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user || !traducao) return;
      
      const { error } = await supabase
        .from('clube_traducao_registros')
        .insert({
          user_id: user.id,
          traducao_id: traducao.id,
          estacao_id: estacaoId,
          resposta_integracao: integracao,
          resposta_profissional: profissional
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      setView('concluido');
      toast.success('Tradução registrada com sucesso!');
    },
    onError: (err: any) => {
      toast.error('Erro ao salvar registro: ' + err.message);
    }
  });

  if (isLoading) return null;

  if (!traducao) {
    return (
      <div className="text-center py-20 space-y-4">
        <Compass className="w-12 h-12 text-gold/20 mx-auto animate-pulse" />
        <p className="text-gold/40 italic font-serif">Aguardando cartografia simbólica...</p>
        <Button onClick={onNext} variant="ghost" className="text-white/60">Pular passo</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-20">
      <AnimatePresence mode="wait">
        {view === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-8 py-10"
          >
            <div className="space-y-4">
              <Compass className="w-16 h-16 text-gold mx-auto" />
              <h2 className="text-4xl font-serif text-white">Tradução Oracular</h2>
              <p className="text-gold/60 text-lg max-w-xl mx-auto font-serif italic">
                Aprenda a traduzir a linguagem dos símbolos para a cartografia da Casa.
              </p>
            </div>
            
            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] space-y-6">
              <p className="text-white/80 leading-relaxed">
                Nesta etapa, observamos quais territórios da psique o conto <strong>{traducao.conto_titulo}</strong> está ativando. 
                Não buscamos diagnósticos, mas padrões de observação.
              </p>
              <Button 
                onClick={() => setView('traducao')}
                className="bg-gold hover:bg-gold/80 text-midnight font-bold px-10 py-6 rounded-full"
              >
                Iniciar Tradução
              </Button>
            </div>
          </motion.div>
        )}

        {view === 'traducao' && (
          <motion.div 
            key="traducao"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            <div className="text-center space-y-2">
              <h3 className="text-sm uppercase tracking-[0.3em] text-gold font-bold">O que este conto ajuda a observar?</h3>
              <p className="text-white/40 font-serif italic">Leitura simbólica de {traducao.conto_titulo}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/[0.03] border-white/10 p-8 rounded-[2rem] space-y-6 flex flex-col items-center text-center">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-gold/60 font-bold">Território Principal</span>
                  <h4 className="text-2xl font-serif text-white">{traducao.territorio_principal}</h4>
                </div>
                <div className="w-12 h-px bg-gold/20" />
                <p className="text-sm text-white/60 leading-relaxed italic">
                  "{traducao.porque_principal}"
                </p>
              </Card>

              <Card className="bg-white/[0.03] border-white/10 p-8 rounded-[2rem] space-y-6 flex flex-col items-center text-center">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-gold/60 font-bold">Território Secundário</span>
                  <h4 className="text-2xl font-serif text-white">{traducao.territorio_secundario}</h4>
                </div>
                <div className="w-12 h-px bg-gold/20" />
                <p className="text-sm text-white/60 leading-relaxed italic">
                  "{traducao.porque_secundario}"
                </p>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={() => setView('pergunta')}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-10 py-6 rounded-full"
              >
                Avançar para Integração
              </Button>
            </div>
          </motion.div>
        )}

        {view === 'pergunta' && (
          <motion.div 
            key="pergunta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10 py-10"
          >
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gold">
                  <BookOpen className="w-5 h-5" />
                  <h4 className="text-lg font-serif">Integração na Psique</h4>
                </div>
                <p className="text-white/80 font-serif italic text-xl">{traducao.pergunta_integracao}</p>
                <Textarea 
                  value={integracao}
                  onChange={(e) => setIntegracao(e.target.value)}
                  placeholder="Escreva sua percepção..."
                  className="bg-white/5 border-white/10 min-h-[120px] rounded-2xl focus:ring-gold/40 text-white"
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-3 text-gold">
                  <FlaskConical className="w-5 h-5" />
                  <h4 className="text-lg font-serif">Olhar Profissional</h4>
                </div>
                <p className="text-white/80 font-serif italic text-xl">{traducao.pergunta_profissional}</p>
                <Textarea 
                  value={profissional}
                  onChange={(e) => setProfissional(e.target.value)}
                  placeholder="Como isso se aplica no seu ofício?"
                  className="bg-white/5 border-white/10 min-h-[120px] rounded-2xl focus:ring-gold/40 text-white"
                />
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <Button 
                disabled={!integracao || !profissional || saveMutation.isPending}
                onClick={() => saveMutation.mutate()}
                className="bg-gold hover:bg-gold/80 text-midnight font-bold px-12 py-7 rounded-full gap-3 shadow-lg"
              >
                {saveMutation.isPending ? 'Salvando...' : (
                  <>
                    <Send className="w-4 h-4" />
                    Registrar na Cartografia
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {view === 'concluido' && (
          <motion.div 
            key="concluido"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-8 py-20"
          >
            <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-gold">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-serif text-white">Escuta Registrada</h2>
              <p className="text-white/40 max-w-sm mx-auto">
                Sua tradução oracular foi integrada à CidadELA e ao seu Atlas Simbólico.
              </p>
            </div>
            <Button 
              onClick={onNext}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-12 py-6 rounded-full"
            >
              Continuar Travessia
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};