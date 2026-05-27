import React from 'react';
import { motion } from 'framer-motion';

interface CasePresentationProps {
  onNext: (escutaId: string) => void;
}

export const CasePresentation: React.FC<CasePresentationProps> = ({ onNext }) => {
  const options = [
    { id: 'padrao-relacional', label: 'Um padrão relacional repetitivo' },
    { id: 'crenca-central', label: 'Uma crença silenciosa sobre valor e merecimento' },
    { id: 'hipercontrole', label: 'Uma tentativa de controlar tudo para não desmoronar' },
    { id: 'exaustao-emocional', label: 'Exaustão emocional' },
    { id: 'ferida-vinculo', label: 'Uma ferida de vínculo' },
    { id: 'conflito-simbolico', label: 'Algo na história que parece pedir um significado maior' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center space-y-10 py-12 px-6 max-w-4xl mx-auto w-full"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-display text-primary">A Primeira Leitura Orácula</h2>
        <p className="text-sm md:text-base text-muted-foreground font-serif italic">
          Você não receberá um rótulo. Receberá um espelho.
        </p>
      </div>

      <div className="w-full bg-card/40 border border-primary/10 rounded-[32px] p-8 md:p-12 shadow-sm backdrop-blur-sm">
        <div className="space-y-8 text-foreground/90 max-w-2xl mx-auto">
          <div className="space-y-4">
            <p className="font-display text-xl tracking-wide text-primary">Marina, 42 anos.</p>
            <p className="text-sm md:text-base opacity-80">Muito competente.</p>
            <p className="text-sm md:text-base opacity-80">Sustenta todos à sua volta.</p>
            <p className="text-sm md:text-base opacity-80">Relacionamentos intensos e exaustivos.</p>
            <p className="text-sm md:text-base opacity-80">Dorme mal.</p>
            <p className="text-sm md:text-base opacity-80">Sente culpa quando descansa.</p>
          </div>
          
          <div className="pt-4 border-t border-primary/5">
            <p className="text-muted-foreground text-xs uppercase tracking-widest mb-3">Costuma dizer:</p>
            <p className="font-serif italic text-lg md:text-xl text-primary/90 pl-4 border-l-2 border-primary/30">
              “Se eu parar, tudo desmorona.”
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl space-y-6">
        <h3 className="text-lg font-display text-primary/80 text-center">O que sua escuta percebe primeiro?</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {options.map((option) => (
            <button 
              key={option.id}
              onClick={() => onNext(option.id)}
              className="flex items-center justify-center p-5 rounded-2xl border border-primary/10 bg-card/50 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 text-center text-sm font-medium text-foreground/80 group"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
