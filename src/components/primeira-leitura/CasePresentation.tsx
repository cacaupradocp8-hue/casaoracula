import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BookOpen, Search, MessageSquareText } from 'lucide-react';

interface CasePresentationProps {
  onNext: (escutaId: string) => void;
}

export const CasePresentation: React.FC<CasePresentationProps> = ({ onNext }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center space-y-12 py-12 px-6 max-w-4xl mx-auto w-full"
    >
      <div className="text-center space-y-4">
        <span className="text-[10px] uppercase tracking-[0.3em] text-primary/50 font-medium">Caso-Espelho • 01</span>
        <h2 className="text-3xl md:text-4xl font-display text-primary">O Caso Marina</h2>
      </div>

      <div className="w-full bg-card/30 border border-primary/10 rounded-[32px] p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 text-primary/5">
          <BookOpen size={120} />
        </div>
        
        <div className="relative z-10 space-y-6 text-foreground/90 font-serif text-lg md:text-xl leading-relaxed italic max-w-2xl">
          <p>
            "Marina construiu uma carreira sólida, mas sente que algo nela está 'fora do ar'. Ela tem sucesso externo, mas descreve uma sensação constante de que está vivendo a vida de outra pessoa."
          </p>
          <p>
            "Ao falar sobre isso, ela menciona que parou de sonhar. Literalmente. Suas noites são um apagão cinzento, enquanto seus dias são uma sucessão impecável de planilhas e resultados."
          </p>
        </div>
      </div>

      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-display text-primary/80">Onde você ancora sua escuta?</h3>
          <p className="text-sm text-muted-foreground">Escolha a porta de entrada para esta leitura:</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => onNext('escuta-simbolica')}
            className="flex flex-col items-center p-6 rounded-2xl border border-primary/10 bg-card/50 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 text-center space-y-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6 text-primary/60" />
            </div>
            <div className="space-y-1">
              <p className="font-display text-sm text-primary">Simbólica</p>
              <p className="text-[10px] text-muted-foreground leading-tight">O apagão dos sonhos e o excesso de cinza.</p>
            </div>
          </button>

          <button 
            onClick={() => onNext('escuta-operacional')}
            className="flex flex-col items-center p-6 rounded-2xl border border-primary/10 bg-card/50 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 text-center space-y-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-primary/60" />
            </div>
            <div className="space-y-1">
              <p className="font-display text-sm text-primary">Operacional</p>
              <p className="text-[10px] text-muted-foreground leading-tight">O sucesso externo versus a vida de 'outra pessoa'.</p>
            </div>
          </button>

          <button 
            onClick={() => onNext('escuta-clinica')}
            className="flex flex-col items-center p-6 rounded-2xl border border-primary/10 bg-card/50 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 text-center space-y-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquareText className="w-6 h-6 text-primary/60" />
            </div>
            <div className="space-y-1">
              <p className="font-display text-sm text-primary">Clínica</p>
              <p className="text-[10px] text-muted-foreground leading-tight">A sensação de estar 'fora do ar' e a perda de viço.</p>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
};