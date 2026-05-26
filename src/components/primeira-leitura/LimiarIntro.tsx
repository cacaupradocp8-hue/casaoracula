import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface LimiarIntroProps {
  onNext: () => void;
}

export const LimiarIntro: React.FC<LimiarIntroProps> = ({ onNext }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center text-center space-y-8 py-12 px-6 max-w-2xl mx-auto"
    >
      <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
        <ShieldCheck className="w-8 h-8 text-primary/60" />
      </div>
      
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-display tracking-tight text-primary">
          Primeira Leitura Orácula
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
          Uma demonstração prática da inteligência simbólica da Casa. Através de um caso real, você experimentará como o método oráculo organiza a complexidade humana.
        </p>
      </div>

      <div className="w-full max-w-md bg-card/40 backdrop-blur-sm border border-primary/5 p-8 rounded-3xl shadow-sm space-y-6">
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-primary/40 mb-2">
            <span className="w-1 h-1 rounded-full bg-primary/40" />
            O Protocolo
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">
            Você será apresentada a um fragmento de vida — o Caso Marina. Sua tarefa é decidir por onde começar a escuta.
          </p>
        </div>
        
        <Button 
          onClick={onNext}
          size="lg"
          variant="gold"
          className="w-full py-7 text-base rounded-2xl transition-all duration-300 shadow-lg shadow-primary/10"
        >
          Iniciar Demonstração
        </Button>

        <p className="text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em]">
          Duração estimada: 2 minutos
        </p>
      </div>
    </motion.div>
  );
};