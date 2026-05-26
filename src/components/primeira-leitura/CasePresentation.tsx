import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

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
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-primary/10 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative bg-card border border-border/50 rounded-2xl p-1 overflow-hidden shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop" 
            alt="Caso-espelho: O Silêncio da Presença" 
            className="w-full h-64 md:h-80 object-cover rounded-xl"
          />
        </div>

      </div>

      <div className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-serif text-primary">
          O Caso-Espelho: O Olhar que Escuta
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
          Observe a imagem acima. Uma mulher em silêncio, onde o olhar parece atravessar o que é visível. Se você fosse realizar uma leitura deste campo agora, qual seria sua primeira escolha de escuta?
        </p>

      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button 
          onClick={onNext}
          variant="outline"
          className="flex-1 py-8 border-primary/20 hover:bg-primary/5 group"

        >
          <Eye className="mr-2 h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
          Escutar o Olhar

        </Button>
        <Button 
          onClick={onNext}
          variant="outline"
          className="flex-1 py-8 border-primary/20 hover:bg-primary/5 group"
        >
          Escutar o Silêncio
        </Button>
      </div>
    </motion.div>
  );
};
