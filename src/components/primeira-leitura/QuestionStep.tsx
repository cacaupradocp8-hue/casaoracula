import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface QuestionStepProps {
  question: string;
  description?: string;
  options: {
    label: string;
    value: string;
    description?: string;
  }[];
  onSelect: (value: string) => void;
  currentIndex: number;
  totalSteps: number;
}

export const QuestionStep: React.FC<QuestionStepProps> = ({ 
  question, 
  description, 
  options, 
  onSelect,
  currentIndex,
  totalSteps 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col items-center space-y-8 py-12 px-4 max-w-2xl mx-auto w-full"
    >
      <div className="w-full flex justify-between items-center mb-4">
        <span className="text-xs font-medium text-amber-500 uppercase tracking-widest">
          Sondagem {currentIndex} de {totalSteps}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div 
              key={i} 
              className={`h-1 w-8 rounded-full transition-colors duration-500 ${i < currentIndex ? 'bg-amber-500' : 'bg-muted'}`}
            />
          ))}
        </div>
      </div>

      <div className="text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-serif text-foreground leading-tight">
          {question}
        </h2>
        {description && (
          <p className="text-muted-foreground italic text-lg">
            "{description}"
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 w-full">
        {options.map((option) => (
          <Button
            key={option.value}
            variant="ghost"
            onClick={() => onSelect(option.value)}
            className="group relative flex flex-col items-start p-6 h-auto text-left border border-border/50 hover:border-amber-500/50 hover:bg-amber-500/5 rounded-2xl transition-all duration-300"
          >
            <span className="text-lg font-medium text-foreground group-hover:text-amber-500 transition-colors">
              {option.label}
            </span>
            {option.description && (
              <span className="text-sm text-muted-foreground mt-1">
                {option.description}
              </span>
            )}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
              </div>
            </div>
          </Button>
        ))}
      </div>
    </motion.div>
  );
};
