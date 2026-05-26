import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/layout/Logo';

interface LimiarIntroProps {
  onNext: () => void;
}

export const LimiarIntro: React.FC<LimiarIntroProps> = ({ onNext }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center text-center space-y-10 py-12 px-6 max-w-xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 1 }}
      >
        <Logo variant="vertical" size="sm" className="opacity-80" />
      </motion.div>
      
      <div className="space-y-8">
        <h1 className="text-xl md:text-2xl font-display tracking-wide text-primary/90">
          Antes de entrar, uma pergunta.
        </h1>
        
        <div className="space-y-6 text-sm md:text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
          <p className="font-serif italic text-foreground/70">
            Nem toda terapeuta escuta a mesma coisa quando olha para uma história.
          </p>
          
          <div className="space-y-2 py-4 border-y border-primary/5">
            <p className="tracking-wide">Algumas percebem a dor.</p>
            <p className="tracking-wide">Outras, a defesa.</p>
            <p className="tracking-wide">Outras, o padrão.</p>
            <p className="tracking-wide">Outras, o símbolo.</p>
          </div>
          
          <p className="text-foreground/80 font-medium">
            A forma como você lê revela a forma como você conduz.
          </p>
        </div>
      </div>

      <Button 
        onClick={onNext}
        size="lg"
        variant="gold"
        className="px-10 py-6 text-sm md:text-base rounded-full transition-all duration-700 hover:scale-[1.01] bg-primary/90 hover:bg-primary shadow-none mt-4"
      >
        Atravessar o primeiro limiar
      </Button>
    </motion.div>

  );
};
