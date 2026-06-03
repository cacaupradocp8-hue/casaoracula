import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface LimiarCidadelaProps {
  onEnter: () => void;
}

export const LimiarCidadela: React.FC<LimiarCidadelaProps> = ({ onEnter }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-6 text-center"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 14, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-[300px] h-[300px] rounded-full bg-gold/5 blur-[80px]" />
      </motion.div>

      <div className="relative z-10 space-y-12 max-w-lg">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.2 }}
          className="text-2xl md:text-3xl font-display text-gold leading-relaxed"
        >
          Como você costuma habitar o mundo?
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
        >
          <Button 
            variant="gold" 
            size="lg" 
            onClick={onEnter}
            className="px-12 py-6 text-lg tracking-widest uppercase shadow-premium-glow"
          >
            Atravessar o limiar
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
