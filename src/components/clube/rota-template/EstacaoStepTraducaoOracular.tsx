import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, BookOpen, Sparkles, Send, CheckCircle2, FlaskConical, Map, DoorOpen, TowerControl, GitBranch, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { TextCarousel } from '@/components/clube/TextCarousel';
import { cn } from '@/lib/utils';

interface TraducaoOracularProps {
  estacaoId: string;
  rotaId: string;
  contoOrigem: string;
  traducaoData: {
    territorioPrincipal: string;
    justificativaPrincipal: string;
    territorioSecundario: string;
    justificativaSecundaria: string;
    porta: string;
    torre: string;
    labirinto: string;
    ferramentaAssociada: string;
    perguntaPessoal: string;
    perguntaProfissional: string;
  };
  onNext: () => void;
}

export const EstacaoStepTraducaoOracular: React.FC<TraducaoOracularProps> = ({ 
  estacaoId, 
  rotaId,
  contoOrigem,
  traducaoData,
  onNext 
}) => {
  const { user } = useAuth();
  const [respostaPessoal, setRespostaPessoal] = useState('');
  const [respostaProfissional, setRespostaProfissional] = useState('');
  const [view, setView] = useState<'intro' | 'cartografia' | 'pergunta' | 'concluido'>('intro');

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      
      const { error } = await supabase
        .from('clube_traducao_registros_v2')
        .insert({
          user_id: user.id,
          rota_id: rotaId,
          estacao_id: estacaoId,
          conto_origem: contoOrigem,
          territorio_principal: traducaoData.territorioPrincipal,
          territorio_secundario: traducaoData.territorioSecundario,
          porta: traducaoData.porta,
          torre: traducaoData.torre,
          labirinto: traducaoData.labirinto,
          ferramenta_associada: traducaoData.ferramentaAssociada,
          resposta_pessoal: respostaPessoal,
          resposta_profissional: respostaProfissional,
          concluido: true
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      setView('concluido');
      toast.success('Cartografia simbólica registrada!');
    },
    onError: (err: any) => {
      toast.error('Erro ao salvar registro: ' + err.message);
    }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 px-4">
      {view !== 'intro' && view !== 'concluido' && (
        <button 
          onClick={() => {
            if (view === 'cartografia') setView('intro');
            if (view === 'pergunta') setView('cartografia');
          }}
          className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-widest font-bold hover:text-white transition-colors"
        >
          <Compass className="w-3 h-3 rotate-180" />
          Voltar Tradução
        </button>
      )}
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
              <h2 className="text-2xl xs:text-3xl sm:text-5xl md:text-7xl font-display font-black text-white tracking-[0.1em] leading-tight uppercase px-4 break-words">
                <span className="bg-gradient-to-b from-white via-white to-gold/70 bg-clip-text text-transparent">
                  Tradução <br className="xs:hidden" /> Oracular
                </span>
              </h2>



              <p className="text-gold/60 text-sm md:text-xl max-w-2xl mx-auto font-serif italic leading-relaxed px-6 break-words">
                “Agora que você escutou o conto, vamos traduzi-lo para a linguagem da Casa Orácula.”
              </p>




            </div>
            
            <div className="bg-white/[0.02] border border-white/5 p-6 md:p-10 rounded-[2rem] md:rounded-[32px] space-y-6 max-w-3xl mx-auto">
              <p className="space-y-4">
                <span className="text-white/80 text-base md:text-lg leading-relaxed font-serif italic block">
                  Nesta etapa, traduzimos os símbolos de <strong>{contoOrigem}</strong> para a cartografia da psique e do ofício. 
                  Não buscamos diagnósticos, mas padrões de observação e movimentos da alma.
                </span>


              </p>
              <Button 
                onClick={() => setView('cartografia')}
                className="bg-gold hover:bg-gold/80 text-midnight font-bold px-8 md:px-12 py-6 md:py-7 rounded-full text-[10px] md:text-xs uppercase tracking-widest transition-all shadow-2xl shadow-gold/20 hover:scale-105 w-full md:w-auto"
              >
                Mapear Símbolos
              </Button>

            </div>
          </motion.div>
        )}

        {view === 'cartografia' && (
          <motion.div 
            key="cartografia"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            <div className="text-center space-y-2">
              <h3 className="text-sm uppercase tracking-[0.4em] text-gold font-bold">Cartografia Simbólica</h3>
              <p className="text-white/40 font-serif italic text-lg">Base narrativa: {contoOrigem}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Territórios */}
              <Card className="bg-white/[0.03] border-white/10 p-6 md:p-10 rounded-[2rem] md:rounded-[32px] space-y-6 relative overflow-hidden group">

                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Map className="w-24 h-24 text-gold" />
                </div>
                <div className="space-y-6 relative z-10">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-gold/60 font-black">Território Principal</span>
                    <h4 className="text-2xl md:text-3xl font-serif text-white italic">{traducaoData.territorioPrincipal}</h4>
                  </div>
                  <div className="w-16 h-px bg-gold/30" />
                  <TextCarousel 
                    text={traducaoData.justificativaPrincipal} 
                    className="text-white/60 font-serif italic text-base md:text-lg"

                  />
                </div>
              </Card>

              <Card className="bg-white/[0.03] border-white/10 p-6 md:p-10 rounded-[2rem] md:rounded-[32px] space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Map className="w-24 h-24 text-gold" />
                </div>
                <div className="space-y-6 relative z-10">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-gold/60 font-black">Território Secundário</span>
                    <h4 className="text-2xl md:text-3xl font-serif text-white italic">{traducaoData.territorioSecundario}</h4>
                  </div>
                  <div className="w-16 h-px bg-gold/30" />
                  <TextCarousel 
                    text={traducaoData.justificativaSecundaria} 
                    className="text-white/60 font-serif italic text-base md:text-lg"
                  />
                </div>
              </Card>
            </div>

            {/* Elementos da Casa */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-3xl space-y-4 text-center">

                <DoorOpen className="w-8 h-8 text-gold/40 mx-auto" />
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Porta Ativada</span>
                  <p className="text-white/80 font-serif italic">{traducaoData.porta}</p>
                </div>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-3xl space-y-4 text-center">

                <TowerControl className="w-8 h-8 text-gold/40 mx-auto" />
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Torre Relacionada</span>
                  <p className="text-white/80 font-serif italic">{traducaoData.torre}</p>
                </div>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-3xl space-y-4 text-center">
                <GitBranch className="w-8 h-8 text-gold/40 mx-auto" />
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Labirinto Observado</span>
                  <p className="text-white/80 font-serif italic">{traducaoData.labirinto}</p>
                </div>
              </div>
            </div>

            {/* Ferramenta */}
            <div className="bg-gold/5 border border-gold/10 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/20">
                  <Wrench className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-gold/60 font-black block">Ferramenta Associada</span>
                  <p className="text-xl font-serif text-white italic">{traducaoData.ferramentaAssociada}</p>
                </div>
              </div>
              <div className="text-gold/40 text-[10px] uppercase tracking-widest font-bold font-serif italic">
                Prática de Integração
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <Button 
                onClick={() => setView('pergunta')}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 md:px-12 py-6 md:py-7 rounded-full text-[10px] md:text-xs uppercase tracking-widest w-full md:w-auto"
              >
                Prosseguir para Integração
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
            className="space-y-12 py-10"
          >
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-gold/80">
                  <Sparkles className="w-6 h-6" />
                  <h4 className="text-xl font-serif italic tracking-wide">Integração Pessoal</h4>
                </div>
                <p className="text-white/90 font-serif italic text-lg sm:text-2xl leading-relaxed px-4 break-words">{traducaoData.perguntaPessoal}</p>
                <Textarea 
                  value={respostaPessoal}
                  onChange={(e) => setRespostaPessoal(e.target.value)}
                  placeholder="Sua percepção interna..."
                  className="bg-white/[0.03] border-white/10 min-h-[120px] md:min-h-[150px] rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 focus:ring-gold/30 text-white font-serif italic text-lg md:text-xl shadow-inner resize-none"
                />
              </div>

              <div className="space-y-6 pt-10 border-t border-white/5">
                <div className="flex items-center gap-4 text-emerald-400/80">
                  <FlaskConical className="w-6 h-6" />
                  <h4 className="text-xl font-serif italic tracking-wide">Olhar Profissional</h4>
                </div>
                <p className="text-white/90 font-serif italic text-lg sm:text-2xl leading-relaxed px-4 break-words">{traducaoData.perguntaProfissional}</p>
                <Textarea 
                  value={respostaProfissional}
                  onChange={(e) => setRespostaProfissional(e.target.value)}
                  placeholder="Observação da prática..."
                  className="bg-white/[0.03] border-white/10 min-h-[120px] md:min-h-[150px] rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 focus:ring-emerald-500/30 text-white font-serif italic text-lg md:text-xl shadow-inner resize-none"
                />
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <Button 
                disabled={!respostaPessoal || !respostaProfissional || saveMutation.isPending}
                onClick={() => saveMutation.mutate()}
                className="bg-gold hover:bg-gold/80 text-midnight font-bold px-8 md:px-16 h-16 md:h-20 rounded-full text-[10px] md:text-xs uppercase tracking-widest shadow-2xl shadow-gold/20 transition-all hover:scale-105 w-full md:w-auto"
              >
                {saveMutation.isPending ? (
                  <span className="flex items-center gap-3">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                      <Compass className="w-5 h-5" />
                    </motion.div>
                    Salvando Cartografia...
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-3" />
                    Registrar na CidadELA
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
            className="text-center space-y-12 py-20"
          >
            <div className="w-28 h-24 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-gold border border-gold/20 shadow-2xl shadow-gold/10">
              <CheckCircle2 className="w-14 h-14" />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif text-white italic">Cartografia Integrada</h2>
              <p className="text-white/40 text-lg max-w-md mx-auto font-serif italic">
                Sua tradução oracular foi integrada à CidadELA e ao seu Atlas Simbólico com sucesso.
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
