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
      className="flex flex-col items-center text-center space-y-12 py-12 px-6 max-w-2xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 1 }}
      >
        <Logo variant="vertical" size="sm" className="opacity-40" />
      </motion.div>
      
      <div className="space-y-6">
        <h1 className="text-3xl md:text-4xl font-display tracking-tight text-primary">
          Antes de entrar, uma pergunta.
        </h1>
        <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg mx-auto font-serif italic">
          <p>Nem toda terapeuta escuta a mesma coisa quando olha para uma história.</p>
          <div className="space-y-1 not-italic font-sans text-xs md:text-sm tracking-wide uppercase opacity-70">
            <p>Algumas percebem a dor.</p>
            <p>Outras, a defesa.</p>
            <p>Outras, o padrão.</p>
            <p>Outras, o símbolo.</p>
          </div>
          <p className="pt-4 text-foreground/80 not-italic font-sans text-base md:text-lg">
            A forma como você lê revela a forma como você conduz.
          </p>
        </div>
      </div>

      <Button 
        onClick={onNext}
        size="lg"
        variant="gold"
        className="px-12 py-7 text-base rounded-full transition-all duration-500 shadow-xl shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02]"
      >
        Atravessar o primeiro limiar
      </Button>
    </motion.div>
  );
};
