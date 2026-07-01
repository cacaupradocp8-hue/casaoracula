import React from 'react';
import { motion } from 'framer-motion';

interface FechamentoLentesProps {
  onContinue: () => void;
}

const lentes = [
  'padrões narrativos',
  'traços de personalidade',
  'símbolos',
  'arquétipos',
  'formas de proteção',
  'vínculos',
  'modos de adaptação',
];

export const FechamentoLentes: React.FC<FechamentoLentesProps> = ({ onContinue }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      className="flex flex-col items-center space-y-10 py-12 px-6 max-w-3xl mx-auto w-full"
    >
      <div className="text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-display text-primary leading-tight">
          Na Casa Orácula fazemos esse movimento o tempo todo.
        </h2>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent mx-auto" />
      </div>

      <div className="space-y-5 text-foreground/80 font-serif text-base md:text-lg leading-relaxed max-w-2xl text-center">
        <p>Nenhuma pessoa pode ser compreendida por uma única lente.</p>
        <p>
          Ao longo da sua jornada você aprenderá a integrar diferentes formas de observação.
          Entre elas:
        </p>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-center sm:text-left">
        {lentes.map((l) => (
          <li key={l} className="font-serif text-primary/85 text-base md:text-lg">
            <span className="text-primary/50 mr-2">·</span>
            {l}
          </li>
        ))}
      </ul>

      <div className="space-y-4 text-foreground/80 font-serif text-base md:text-lg leading-relaxed max-w-2xl text-center pt-2">
        <p>Cada nova lente amplia a anterior.</p>
        <p>Nenhuma substitui aquilo que você já percebeu.</p>
        <p className="text-primary/90 italic">É assim que a escuta se torna mais profunda.</p>
      </div>

      <button
        onClick={onContinue}
        className="mt-4 px-8 py-3 rounded-full bg-primary/90 text-primary-foreground text-sm uppercase tracking-[0.2em] font-display hover:bg-primary transition-all"
      >
        Continuar minha travessia
      </button>
    </motion.div>
  );
};
