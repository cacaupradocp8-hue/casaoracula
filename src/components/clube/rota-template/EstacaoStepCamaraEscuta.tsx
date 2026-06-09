import React, { useState } from 'react';
import { Headphones, Sparkles, BookOpen, Music, PenTool, CheckCircle2, ChevronRight, Play, Info, Heart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCamaraObras, CamaraObra } from '@/hooks/useClubeTemplate';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { EscutaPremium } from '@/components/clube/EscutaPremium';

interface EstacaoStepCamaraEscutaProps {
  estacaoId: string;
  onNext: () => void;
}


export const EstacaoStepCamaraEscuta: React.FC<EstacaoStepCamaraEscutaProps> = ({
  estacaoId,
  onNext
}) => {
  const { data: obras, isLoading } = useCamaraObras(estacaoId);
  const [activeObra, setActiveObra] = useState<CamaraObra | null>(null);
  const [registrando, setRegistrando] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-gold">
        <Headphones className="w-8 h-8 animate-pulse" />
        <span className="font-serif italic text-sm">Abrindo a Câmara...</span>
      </div>
    );
  }

  if (activeObra) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-12 max-w-4xl mx-auto pb-20"
      >
        <button 
          onClick={() => setActiveObra(null)}
          className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest font-bold hover:text-gold transition-colors"
        >
          <ArrowRight className="w-3 h-3 rotate-180" /> Voltar à Lista
        </button>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] text-gold uppercase tracking-[0.3em] font-bold">Obra em Estudo</span>
              <h3 className="text-4xl font-serif text-white">{activeObra.titulo}</h3>
              {activeObra.autor && <p className="text-white/40 font-serif italic">{activeObra.autor}</p>}
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
              <div className="flex items-center gap-2 text-gold/60">
                <Info className="w-4 h-4" />
                <h4 className="text-[10px] uppercase tracking-widest font-bold">Função da Escuta</h4>
              </div>
              <p className="text-sm text-white/70 font-serif leading-relaxed italic">
                {activeObra.funcao_escuta}
              </p>
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-2 text-gold/60">
                <Sparkles className="w-4 h-4" />
                <h4 className="text-[10px] uppercase tracking-widest font-bold">Impacto Cartográfico</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-[9px] text-gold uppercase tracking-widest font-bold">
                  {activeObra.territorio_principal}
                </span>
                {activeObra.territorio_secundario_1 && (
                   <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] text-white/40 uppercase tracking-widest font-bold">
                    {activeObra.territorio_secundario_1}
                   </span>
                )}
                {activeObra.territorio_secundario_2 && (
                   <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] text-white/40 uppercase tracking-widest font-bold">
                    {activeObra.territorio_secundario_2}
                   </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8 bg-white/[0.03] border border-white/5 p-8 rounded-[40px] shadow-2xl">
            <EscutaPremium 
              audioUrl={activeObra.url}
              titulo={activeObra.titulo}
            />

            {activeObra.audio_regente_url && (
              <div className="pt-4 border-t border-white/5 space-y-2">
                <span className="text-[9px] uppercase tracking-widest font-bold text-white/30">Áudio Regente da Obra</span>
                <EscutaPremium 
                  audioUrl={activeObra.audio_regente_url}
                  titulo={`Regente: ${activeObra.titulo}`}
                />
              </div>
            )}

            <div className="pt-8 border-t border-white/10 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gold/80">
                  <Heart className="w-4 h-4" />
                  <h4 className="text-xs uppercase tracking-widest font-bold font-serif">Jardim da Psique</h4>
                </div>
                <p className="text-lg text-white/90 font-serif italic leading-relaxed">
                  {activeObra.pergunta_psique}
                </p>
                <Button className="w-full bg-gold/10 hover:bg-gold/20 border border-gold/30 text-gold rounded-full h-12 uppercase tracking-widest text-[10px] font-bold">
                  Registrar no Jardim da Psique
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gold/80">
                  <BookOpen className="w-4 h-4" />
                  <h4 className="text-xs uppercase tracking-widest font-bold font-serif">Jardim do Ofício</h4>
                </div>
                <p className="text-lg text-white/90 font-serif italic leading-relaxed">
                  {activeObra.pergunta_oficio}
                </p>
                <Button className="w-full bg-gold/10 hover:bg-gold/20 border border-gold/30 text-gold rounded-full h-12 uppercase tracking-widest text-[10px] font-bold">
                  Registrar no Jardim do Ofício
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-12 text-center max-w-4xl mx-auto py-8">
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2 text-gold">
          <Headphones className="w-5 h-5" />
          <span className="text-xs uppercase tracking-[0.3em] font-bold">Câmara da Escuta</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-serif text-white">Treinamento de Percepção Simbólica</h2>
        <p className="text-white/60 font-serif italic max-w-lg mx-auto leading-relaxed">
          Este não é um espaço de entretenimento. É um refino da escuta terapêutica profunda através de símbolos.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {obras?.map((obra) => (
          <motion.button
            key={obra.id}
            whileHover={{ y: -5 }}
            onClick={() => setActiveObra(obra)}
            className="group relative overflow-hidden bg-white/[0.02] border border-white/10 rounded-[32px] p-8 text-left transition-all hover:bg-white/[0.05] hover:border-gold/30 flex flex-col h-full"
          >
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
               <Music className="w-12 h-12 text-gold" />
            </div>

            <div className="space-y-4 flex-grow">
              <span className="text-[9px] text-gold uppercase tracking-[0.3em] font-black border border-gold/20 px-2 py-0.5 rounded-full inline-block">
                {obra.tipo}
              </span>
              <h4 className="text-2xl font-serif text-white leading-tight group-hover:text-gold transition-colors">
                {obra.titulo}
              </h4>
              <p className="text-xs text-white/40 font-serif italic line-clamp-2">
                {obra.funcao_escuta}
              </p>
            </div>

            <div className="pt-8 flex items-center justify-between">
              <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold">
                {obra.territorio_principal}
              </span>
              <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-midnight transition-all">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </motion.button>
        ))}

        {(!obras || obras.length === 0) && (
          <div className="col-span-full py-20 text-white/20 border-2 border-dashed border-white/5 rounded-3xl font-serif italic">
            Aguardando o desabrochar das obras nesta estação...
          </div>
        )}
      </div>

      <div className="pt-12 border-t border-white/5 flex flex-col items-center gap-6">
        <Button 
          onClick={onNext}
          className="bg-white/10 hover:bg-white/20 text-white font-bold px-12 py-7 rounded-full uppercase tracking-widest text-xs"
        >
          Concluir Escuta e Traduzir
        </Button>
        <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10">
          <CheckCircle2 className="w-4 h-4 text-gold/40" />
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Escola de Escuta Simbólica</span>
        </div>
      </div>
    </div>
  );
};

