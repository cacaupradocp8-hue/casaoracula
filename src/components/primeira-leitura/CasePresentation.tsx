import React from 'react';
import { motion } from 'framer-motion';

interface CasePresentationProps {
  onNext: (escutaId: string) => void;
}

export const CasePresentation: React.FC<CasePresentationProps> = ({ onNext }) => {
  const options = [
    { id: 'padrao-relacional', label: 'Um padrão relacional repetitivo' },
    { id: 'crenca-central', label: 'Uma crença central de valor condicionado' },
    { id: 'hipercontrole', label: 'Uma estratégia de hipercontrole' },
    { id: 'exaustao-emocional', label: 'Exaustão emocional' },
    { id: 'ferida-vinculo', label: 'Uma ferida de vínculo' },
    { id: 'conflito-simbolico', label: 'Um conflito simbólico mais profundo' },
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
        <div className="space-y-6 text-foreground/90 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="font-display text-lg tracking-wide text-primary">Marina, 42 anos.</span>
          </div>
          
          <div className="space-y-4 text-sm md:text-base leading-relaxed opacity-90">
            <p>Muito competente. Sustenta todos à sua volta.</p>
            <p>Relacionamentos intensos e exaustivos. Dorme mal.</p>
            <p>Sente culpa quando descansa.</p>
            <p className="pt-2 font-serif italic text-base md:text-lg border-l-2 border-primary/20 pl-4">
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
