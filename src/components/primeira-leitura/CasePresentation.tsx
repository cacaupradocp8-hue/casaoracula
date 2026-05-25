import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Compass } from 'lucide-react';

interface CasePresentationProps {
  onNext: () => void;
}

export const CasePresentation: React.FC<CasePresentationProps> = ({ onNext }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex flex-col items-center text-center space-y-8 py-12 px-4 max-w-3xl mx-auto"
    >
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-700 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative bg-card border border-border/50 rounded-2xl p-1 overflow-hidden shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop" 
            alt="Objeto Simbólico" 
            className="w-full h-64 md:h-80 object-cover rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-serif text-amber-500">
          O Primeiro Símbolo: A Bússola sem Ponteiro
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
          Imagine que você encontra este objeto sobre uma mesa de carvalho negro. Ela brilha com uma luz que não vem de fora, mas sim de dentro do vidro. Não há ponteiro, apenas um redemoinho de luz em constante movimento.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button 
          onClick={onNext}
          variant="outline"
          className="flex-1 py-8 border-amber-500/20 hover:bg-amber-500/5 group"
        >
          <Compass className="mr-2 h-5 w-5 text-amber-500 group-hover:rotate-12 transition-transform" />
          Tocar na Bússola
        </Button>
        <Button 
          onClick={onNext}
          variant="outline"
          className="flex-1 py-8 border-amber-500/20 hover:bg-amber-500/5 group"
        >
          Apenas Observar
        </Button>
      </div>
    </motion.div>
  );
};
