import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Send, CheckCircle2, ChevronRight, ChevronLeft, Info, Target, Sparkles, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Eixo {
  id: string;
  tipo: 'multipla' | 'aberta';
  pergunta: string;
  opcoes?: string[];
}

interface Resultado {
  estado: string;
  texto: string;
}

interface FerramentaOracularProps {
  estacaoId: string;
  rotaId: string;
  nome: string;
  descricao: string;
  eixos: Eixo[];
  resultados: Resultado[];
  onNext: () => void;
}

export const EstacaoStepFerramentaOracular: React.FC<FerramentaOracularProps> = ({
  estacaoId,
  rotaId,
  nome,
  descricao,
  eixos,
  resultados,
  onNext
}) => {
  const { user } = useAuth();
  const [currentEixoIdx, setCurrentEixoIdx] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [view, setView] = useState<'intro' | 'perguntas' | 'resultado'>('intro');

  const currentEixo = eixos[currentEixoIdx];

  const saveMutation = useMutation({
    mutationFn: async (resultadoFinal: string) => {
      if (!user) return;
      
      const { error } = await supabase
        .from('clube_ferramenta_oracular_registros')
        .insert({
          user_id: user.id,
          rota_id: rotaId,
          estacao_id: estacaoId,
          nome_ferramenta: nome,
          respostas: respostas,
          resultado_simbolico: resultadoFinal,
          territorio_impactado: 'Bosque dos Arquétipos',
          rastro: 'Reconhecimento do Instinto Soterrado',
          status: 'concluido'
        });
      
      if (error) throw error;
      return resultadoFinal;
    },
    onSuccess: () => {
      setView('resultado');
      toast.success('Ferramenta concluída com sucesso!');
    },
    onError: (err: any) => {
      toast.error('Erro ao salvar registro: ' + err.message);
    }
  });

  const handleAnswer = (val: string) => {
    setRespostas(prev => ({ ...prev, [currentEixo.id]: val }));
  };

  const calculateResult = () => {
    // Lógica simbólica baseada nas respostas de múltipla escolha
    // Opção 0 = Preservado (3 pts), 1 = Oscilante (2 pts), 2 = Soterrado (1 pt), 3 = Soterrado (0 pt)
    let totalScore = 0;
    let count = 0;

    eixos.forEach(eixo => {
      if (eixo.tipo === 'multipla' && respostas[eixo.id]) {
        const optIdx = eixo.opcoes?.indexOf(respostas[eixo.id]) ?? 0;
        if (optIdx === 0) totalScore += 3;
        else if (optIdx === 1) totalScore += 2;
        else if (optIdx === 2) totalScore += 1;
        count++;
      }
    });

    const average = totalScore / count;
    
    let resultado;
    if (average >= 2.5) resultado = resultados[0]; // Instinto Preservado
    else if (average >= 1.5) resultado = resultados[1]; // Instinto Oscilante
    else resultado = resultados[2]; // Instinto Soterrado

    saveMutation.mutate(resultado.estado);
    return resultado;
  };

  const handleNextEixo = () => {
    if (currentEixoIdx < eixos.length - 1) {
      setCurrentEixoIdx(prev => prev + 1);
    } else {
      calculateResult();
    }
  };

  const canContinue = currentEixo?.tipo === 'multipla' 
    ? !!respostas[currentEixo.id] 
    : (respostas[currentEixo.id]?.length > 5);

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 px-4">
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
              <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-6">
                <Compass className="w-10 h-10 text-gold" />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-white italic">{nome}</h2>
              <p className="text-gold/60 text-xl max-w-2xl mx-auto font-serif italic leading-relaxed">
                “Mapeando o que foi abafado pela adaptação.”
              </p>
            </div>

            <Card className="bg-white/[0.02] border-white/5 p-10 rounded-[32px] space-y-6 max-w-3xl mx-auto text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Map className="w-24 h-24 text-gold" />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3 text-gold/80">
                  <Info className="w-5 h-5" />
                  <span className="text-[10px] uppercase tracking-widest font-black">Sobre a Ferramenta</span>
                </div>
                <p className="text-white/80 text-lg leading-relaxed font-serif italic">
                  {descricao}
                </p>
              </div>

              <div className="flex justify-center pt-4">
                <Button 
                  onClick={() => setView('perguntas')}
                  className="bg-gold hover:bg-gold/80 text-midnight font-bold px-12 py-7 rounded-full text-xs uppercase tracking-widest transition-all shadow-2xl shadow-gold/20 hover:scale-105"
                >
                  Iniciar Mapeamento
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {view === 'perguntas' && (
          <motion.div
            key="perguntas"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-end mb-8">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold">Mapeamento em curso</span>
                <h3 className="text-white/40 font-serif italic text-lg">Eixo: {currentEixo.id.charAt(0).toUpperCase() + currentEixo.id.slice(1)}</h3>
              </div>
              <span className="text-gold/40 font-mono text-sm">{currentEixoIdx + 1} / {eixos.length}</span>
            </div>

            <div className="bg-white/5 h-1.5 w-full rounded-full overflow-hidden mb-12">
              <motion.div 
                className="bg-gold h-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentEixoIdx + 1) / eixos.length) * 100}%` }}
              />
            </div>

            <Card className="bg-white/[0.03] border-white/10 p-10 rounded-[40px] space-y-8">
              <h4 className="text-2xl md:text-3xl font-serif text-white italic leading-relaxed text-center">
                {currentEixo.pergunta}
              </h4>

              {currentEixo.tipo === 'multipla' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentEixo.opcoes?.map((opt, i) => (
                    <Button
                      key={i}
                      variant="ghost"
                      onClick={() => handleAnswer(opt)}
                      className={cn(
                        "h-auto py-6 px-8 rounded-2xl border transition-all text-left justify-start font-serif italic text-lg",
                        respostas[currentEixo.id] === opt
                          ? "bg-gold/10 border-gold text-gold"
                          : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:border-white/20"
                      )}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <Textarea
                    value={respostas[currentEixo.id] || ''}
                    onChange={(e) => handleAnswer(e.target.value)}
                    placeholder="Escreva sua percepção aqui..."
                    className="bg-white/5 border-white/10 min-h-[150px] rounded-2xl p-6 text-lg font-serif italic text-white/80 placeholder:text-white/20"
                  />
                  <p className="text-[10px] text-white/20 uppercase tracking-widest text-center">
                    Mínimo de 5 caracteres para prosseguir
                  </p>
                </div>
              )}

              <div className="flex justify-between pt-8 border-t border-white/5">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentEixoIdx(prev => Math.max(0, prev - 1))}
                  disabled={currentEixoIdx === 0}
                  className="text-white/40 hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Anterior
                </Button>

                <Button
                  onClick={handleNextEixo}
                  disabled={!canContinue || saveMutation.isPending}
                  className="bg-gold hover:bg-gold/80 text-midnight font-bold px-10 h-14 rounded-full text-[10px] uppercase tracking-widest"
                >
                  {saveMutation.isPending ? 'Processando...' : (
                    currentEixoIdx === eixos.length - 1 ? 'Concluir Mapeamento' : 'Próximo Eixo'
                  )}
                  {!saveMutation.isPending && <ChevronRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {view === 'resultado' && (
          <motion.div
            key="resultado"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-12"
          >
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-sm uppercase tracking-[0.4em] text-gold font-bold">Mapeamento Concluído</h2>
              <h3 className="text-4xl md:text-5xl font-serif text-white italic">Seu Resultado Simbólico</h3>
            </div>

            <Card className="bg-white/[0.03] border-white/10 p-12 rounded-[48px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                <Sparkles className="w-32 h-32 text-gold" />
              </div>
              
              <div className="relative z-10 space-y-8 text-center">
                <div className="inline-block px-8 py-3 rounded-full bg-gold/10 border border-gold/20 text-gold text-2xl font-serif italic">
                  {resultados.find(r => r.estado === saveMutation.data)?.estado || resultados[1].estado}
                </div>
                
                <p className="text-white/90 font-serif italic text-3xl leading-relaxed max-w-2xl mx-auto">
                  {resultados.find(r => r.estado === saveMutation.data)?.texto || resultados[1].texto}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                  <div className="bg-white/5 p-6 rounded-3xl space-y-2">
                    <Target className="w-6 h-6 text-gold/40 mx-auto" />
                    <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold block">Ferramenta</span>
                    <p className="text-white/80 font-serif italic text-sm">{nome}</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-3xl space-y-2">
                    <Map className="w-6 h-6 text-gold/40 mx-auto" />
                    <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold block">Território</span>
                    <p className="text-white/80 font-serif italic text-sm">Bosque dos Arquétipos</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-3xl space-y-2">
                    <Sparkles className="w-6 h-6 text-gold/40 mx-auto" />
                    <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold block">Rastro</span>
                    <p className="text-white/80 font-serif italic text-sm">Instinto Reconhecido</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-16 border-t border-white/5 mt-16">
                <Button
                  onClick={onNext}
                  className="bg-white text-midnight hover:bg-white/90 font-bold px-16 h-20 rounded-full text-xs uppercase tracking-widest shadow-2xl transition-all hover:scale-105"
                >
                  <Send className="w-4 h-4 mr-3" />
                  Continuar Travessia
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};