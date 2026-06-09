import React, { useState } from 'react';
import { Headphones, Sparkles, BookOpen, Music, CheckCircle2, ChevronRight, Info, Heart, ArrowLeft, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCamaraObras, CamaraObra } from '@/hooks/useClubeTemplate';
import { Button } from '@/components/ui/button';
import { EscutaPremium } from '@/components/clube/EscutaPremium';
import { JardimInput } from '@/components/clube/JardimInput';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface EstacaoStepCamaraEscutaProps {
  estacaoId: string;
  onNext: () => void;
}

export const EstacaoStepCamaraEscuta: React.FC<EstacaoStepCamaraEscutaProps> = ({
  estacaoId,
  onNext
}) => {
  const { user } = useAuth();
  const { data: obras, isLoading } = useCamaraObras(estacaoId);
  const [activeObra, setActiveObra] = useState<CamaraObra | null>(null);
  const [showRastro, setShowRastro] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-gold">
        <Headphones className="w-8 h-8 animate-pulse" />
        <span className="font-serif italic text-sm">Abrindo a Câmara...</span>
      </div>
    );
  }

  const handleConcluir = () => {
    setShowRastro(true);
  };

  if (showRastro) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto space-y-12 py-12 text-center"
      >
        <div className="space-y-6">
          <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-8">
            <History className="w-10 h-10 text-gold" />
          </div>
          <h2 className="text-4xl font-serif text-white italic">Escuta da Clareira registrada</h2>
          <p className="text-gold/80 font-serif italic text-lg max-w-xl mx-auto leading-relaxed">
            “Sua escuta deixou um rastro na Cartografia da Loba. Algo em você começou a reconhecer o que ainda canta por baixo da ferida.”
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-[40px] p-10 text-left space-y-8 backdrop-blur-sm">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <span className="text-[10px] text-gold/40 uppercase tracking-widest font-bold">Estação</span>
              <p className="text-white font-serif italic text-lg">Clareira do Chamado</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-gold/40 uppercase tracking-widest font-bold">Obra</span>
              <p className="text-white font-serif italic text-lg">Sequência de Escuta da Clareira</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-gold/40 uppercase tracking-widest font-bold">Território Principal</span>
              <p className="text-white font-serif italic text-lg">Praça do Abalo</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-gold/40 uppercase tracking-widest font-bold">Território Secundário</span>
              <p className="text-white font-serif italic text-lg">Bosque dos Arquétipos</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-gold/40 uppercase tracking-widest font-bold">Movimento Simbólico</span>
              <p className="text-white font-serif italic text-lg">reconhecer vitalidade soterrada</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-gold/40 uppercase tracking-widest font-bold">Data do Registro</span>
              <p className="text-white font-serif italic text-lg">{format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <Button 
            onClick={onNext}
            className="bg-gold hover:bg-gold/80 text-midnight font-bold px-16 h-16 rounded-full uppercase tracking-widest text-xs shadow-2xl shadow-gold/20 transition-all hover:scale-105"
          >
            Continuar a Travessia
          </Button>
        </div>
      </motion.div>
    );
  }

  if (activeObra) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-12 max-w-5xl mx-auto pb-20"
      >
        <button 
          onClick={() => setActiveObra(null)}
          className="flex items-center gap-3 text-[10px] text-white/40 uppercase tracking-widest font-bold hover:text-gold transition-all group"
        >
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gold/30">
            <ArrowLeft className="w-3 h-3" />
          </div>
          Voltar à Sequência de Escuta
        </button>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-10 sticky top-12">
            <div className="space-y-4">
              <span className="text-[10px] text-gold uppercase tracking-[0.4em] font-bold opacity-60">Escuta em Processo</span>
              <h3 className="text-5xl font-serif text-white italic leading-tight">{activeObra.titulo}</h3>
              <p className="text-gold/80 font-serif italic text-xl border-l-2 border-gold/20 pl-6 py-2">
                {activeObra.funcao_escuta}
              </p>
            </div>

            <div className="space-y-6 bg-white/[0.02] border border-white/5 p-8 rounded-[32px]">
              <div className="flex items-center gap-3 text-gold/60">
                <Sparkles className="w-5 h-5" />
                <h4 className="text-[10px] uppercase tracking-widest font-bold">Impacto Cartográfico</h4>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="px-5 py-2 rounded-full bg-gold/10 border border-gold/20 text-[10px] text-gold uppercase tracking-widest font-bold">
                  {activeObra.territorio_principal}
                </span>
                {activeObra.territorio_secundario_1 && (
                   <span className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/40 uppercase tracking-widest font-bold">
                    {activeObra.territorio_secundario_1}
                   </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <div className="bg-[#050505]/40 backdrop-blur-md border border-white/5 p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Music className="w-32 h-32 text-gold" />
              </div>
              
              <div className="relative z-10 space-y-8">
                <EscutaPremium 
                  audioUrl={activeObra.url}
                  titulo={activeObra.titulo}
                  imagemEscuta="/clareira-disco.png"
                />

                <div className="pt-10 border-t border-white/10 space-y-10">
                  <div className="text-center space-y-4">
                    <p className="text-gold/60 font-serif italic text-sm">“Depois de ouvir, registre o que permaneceu ecoando.”</p>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-gold/80">
                        <Heart className="w-4 h-4" />
                        <h4 className="text-xs uppercase tracking-widest font-bold font-serif">Jardim da Psique</h4>
                      </div>
                      <p className="text-xl text-white/90 font-serif italic leading-relaxed">
                        “O que em mim ainda canta, mesmo depois de ter sido ferido?”
                      </p>
                      <JardimInput 
                        type="psique"
                        pergunta="O que em mim ainda canta, mesmo depois de ter sido ferido?"
                        estacaoId={estacaoId}
                        pontoId={`escuta:${activeObra.id}`}
                        sourceTitle={`Escuta: ${activeObra.titulo}`}
                      />
                    </div>

                    <div className="space-y-4 pt-8 border-t border-white/5">
                      <div className="flex items-center gap-3 text-gold/80">
                        <BookOpen className="w-4 h-4" />
                        <h4 className="text-xs uppercase tracking-widest font-bold font-serif">Jardim do Ofício</h4>
                      </div>
                      <p className="text-xl text-white/90 font-serif italic leading-relaxed">
                        “Que sinais de vitalidade soterrada eu consigo reconhecer nas mulheres que acompanho?”
                      </p>
                      <JardimInput 
                        type="oficio"
                        pergunta="Que sinais de vitalidade soterrada eu consigo reconhecer nas mulheres que acompanho?"
                        estacaoId={estacaoId}
                        pontoId={`escuta:${activeObra.id}`}
                        sourceTitle={`Escuta: ${activeObra.titulo}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-8">
               <Button 
                onClick={handleConcluir}
                className="bg-white/5 hover:bg-gold/10 border border-white/10 hover:border-gold/30 text-white/60 hover:text-gold font-bold px-12 py-7 rounded-full uppercase tracking-widest text-[10px] transition-all"
              >
                Concluir Registro da Obra
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-16 max-w-5xl mx-auto py-12">
      <div className="space-y-8 text-center max-w-3xl mx-auto">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-3 text-gold/60">
            <div className="h-px w-8 bg-gold/20" />
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Câmara da Escuta</span>
            <div className="h-px w-8 bg-gold/20" />
          </div>
          <h2 className="text-4xl md:text-6xl font-serif text-white italic leading-tight">Sequência de Escuta da Clareira</h2>
        </div>
        
        <div className="space-y-6 px-4">
          <p className="text-gold/80 text-xl font-serif italic leading-relaxed">
            “Uma sequência sonora para treinar sua escuta simbólica antes de registrar seus rastros.”
          </p>
          <p className="text-white/40 font-serif italic text-base max-w-2xl mx-auto leading-relaxed">
            “Ouça sem tentar interpretar rápido. Observe imagens, emoções, frases, memórias e incômodos que surgem. A escuta simbólica começa quando algo em nós percebe antes de explicar.”
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 px-4">
        {obras?.map((obra, index) => (
          <motion.button
            key={obra.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={() => setActiveObra(obra)}
            className="group relative overflow-hidden bg-white/[0.02] border border-white/5 rounded-[40px] p-10 text-left transition-all hover:bg-gold/[0.03] hover:border-gold/20 flex flex-col h-full shadow-2xl backdrop-blur-sm"
          >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
               <Music className="w-16 h-16 text-gold" />
            </div>

            <div className="flex-grow space-y-6">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center text-gold text-[10px] font-bold">
                  {index + 1}
                </span>
                <span className="text-[9px] text-gold/40 uppercase tracking-[0.3em] font-black">
                  {obra.tipo}
                </span>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-3xl font-serif text-white italic group-hover:text-gold transition-colors leading-tight">
                  {obra.titulo}
                </h4>
                <div className="flex items-center gap-2 text-gold/60">
                  <Info className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Função</span>
                </div>
                <p className="text-base text-white/50 font-serif italic leading-relaxed line-clamp-3">
                  {obra.funcao_escuta}
                </p>
              </div>
            </div>

            <div className="pt-10 flex items-center justify-between border-t border-white/5">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-white/20 uppercase tracking-widest font-bold">Território</span>
                <span className="text-[10px] text-gold/60 uppercase tracking-widest font-bold">
                  {obra.territorio_principal}
                </span>
              </div>
              <div className="w-12 h-12 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-midnight transition-all duration-500 shadow-lg">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </motion.button>
        ))}

        {(!obras || obras.length === 0) && (
          <div className="col-span-full py-32 text-white/10 border-2 border-dashed border-white/5 rounded-[40px] font-serif italic text-2xl flex flex-col items-center gap-4">
            <Sparkles className="w-8 h-8 opacity-20" />
            Aguardando o desabrochar das obras...
          </div>
        )}
      </div>

      <div className="pt-16 flex flex-col items-center gap-8">
        <div className="flex items-center gap-4 px-8 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
          <CheckCircle2 className="w-4 h-4 text-gold/40" />
          <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">Treinamento de Percepção Simbólica</span>
        </div>
      </div>
    </div>
  );
};