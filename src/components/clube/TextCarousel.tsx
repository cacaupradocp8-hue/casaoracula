import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TextCarouselProps {
  text: string;
  maxLength?: number;
  title?: string;
  className?: string;
}

export const TextCarousel: React.FC<TextCarouselProps> = ({ 
  text, 
  maxLength = 280,
  title,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Divide o texto em blocos de no máximo maxLength caracteres, respeitando sentenças se possível
  const splitText = (input: string, limit: number): string[] => {
    if (!input) return [];
    
    // Limpa o texto de quebras de linha excessivas para o carrossel
    const cleanInput = input.replace(/\s+/g, ' ').trim();

    // Se for curto o suficiente, retorna como card único
    if (cleanInput.length <= limit) return [cleanInput];

    const sentences = cleanInput.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleanInput];
    const cards: string[] = [];
    let currentCard = "";

    sentences.forEach(sentence => {
      const trimmedSentence = sentence.trim();
      if ((currentCard + (currentCard ? " " : "") + trimmedSentence).length <= limit) {
        currentCard += (currentCard ? " " : "") + trimmedSentence;
      } else {
        if (currentCard) cards.push(currentCard);
        
        // Se uma única sentença for maior que o limite, divide por palavras
        if (trimmedSentence.length > limit) {
          const words = trimmedSentence.split(' ');
          let tempCard = "";
          words.forEach(word => {
            if ((tempCard + (tempCard ? " " : "") + word).length <= limit) {
              tempCard += (tempCard ? " " : "") + word;
            } else {
              if (tempCard) cards.push(tempCard);
              tempCard = word;
            }
          });
          currentCard = tempCard;
        } else {
          currentCard = trimmedSentence;
        }
      }
    });
    
    if (currentCard) cards.push(currentCard);
    return cards;
  };

  const cards = splitText(text, maxLength);
  const totalCards = cards.length;

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % totalCards);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  if (totalCards <= 1 && !isExpanded) {
    return <div className={cn("text-white/70 font-serif italic text-lg leading-relaxed", className)}>{text}</div>;
  }

  return (
    <div className={cn("relative space-y-4", className)}>
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-white/70 font-serif italic text-lg leading-relaxed whitespace-pre-wrap"
          >
            {text}
          </motion.div>
        ) : (
          <motion.div
            key="carousel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-[180px] md:min-h-[200px] flex flex-col justify-center"
          >
            <div className="overflow-hidden px-8 md:px-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center text-white font-serif italic text-lg md:text-2xl leading-relaxed py-4 md:py-8"
                >
                  {cards[currentIndex]}
                </motion.div>
              </AnimatePresence>
            </div>

            {totalCards > 1 && (
              <>
                <button
                  onClick={prevCard}
                  className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-gold transition-colors"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={nextCard}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-gold transition-colors"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
                
                <div className="flex justify-center items-center gap-2 mt-4">
                  <span className="text-[10px] text-gold/60 font-black tracking-widest uppercase">
                    {currentIndex + 1} / {totalCards}
                  </span>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[9px] uppercase tracking-[0.2em] text-white/40 hover:text-white hover:bg-white/5 font-black"
        >
          {isExpanded ? (
            <><Minimize2 className="w-3 h-3 mr-2" /> Ver em camadas</>
          ) : (
            <><Maximize2 className="w-3 h-3 mr-2" /> Ver texto completo</>
          )}
        </Button>
      </div>
    </div>
  );
};
