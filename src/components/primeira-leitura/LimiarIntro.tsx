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
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
        <Sparkles className="w-10 h-10 text-primary" />
      </div>
      
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-primary">
          Primeira Leitura Orácula
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed italic">
          "A imagem é a porta pela qual a alma se comunica com o mundo."
        </p>
      </div>


      <div className="max-w-md bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-2xl shadow-xl">
        <p className="text-base text-foreground/80 leading-relaxed mb-6">
          Esta não é uma análise lógica, mas uma demonstração do método da Casa — uma Primeira Leitura baseada em um caso-espelho para observar seu modo de escuta.
        </p>
        <p className="text-sm text-primary font-medium mb-8">
          Observe a imagem e sinta como ela ressoa em você.
        </p>

        
        <Button 
          onClick={onNext}
          size="lg"
          className="w-full bg-primary hover:opacity-90 text-primary-foreground font-medium py-6 rounded-xl transition-all duration-300"
        >
          Iniciar Primeira Leitura
        </Button>
      </div>
    </motion.div>
  );
};
