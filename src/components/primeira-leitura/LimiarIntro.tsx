import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface LimiarIntroProps {
  onNext: () => void;
}

export const LimiarIntro: React.FC<LimiarIntroProps> = ({ onNext }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center text-center space-y-8 py-12 px-4 max-w-2xl mx-auto"
    >
      <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center animate-pulse">
        <Sparkles className="w-10 h-10 text-amber-500" />
      </div>
      
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-amber-500">
          O Limiar do Ver
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed italic">
          "Onde a razão silencia, a imagem fala. Onde o caminho se bifurca, o símbolo guia."
        </p>
      </div>

      <div className="max-w-md bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-2xl shadow-xl">
        <p className="text-base text-foreground/80 leading-relaxed mb-6">
          Você acaba de cruzar o portal da Casa Orácula. Esta não é uma análise lógica, mas uma Primeira Leitura — um lampejo de como sua psique se projeta nos símbolos que habitam este espaço.
        </p>
        <p className="text-sm text-amber-500 font-medium mb-8">
          Sinta a atmosfera. Não tente entender. Apenas observe.
        </p>
        
        <Button 
          onClick={onNext}
          size="lg"
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-6 rounded-xl transition-all duration-300"
        >
          Iniciar Primeira Leitura
        </Button>
      </div>
    </motion.div>
  );
};
