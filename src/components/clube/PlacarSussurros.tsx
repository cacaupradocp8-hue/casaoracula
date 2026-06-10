import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Phrase {
  texto: string;
  ordem?: number;
}

interface PlacarSussurrosProps {
  frases: Phrase[];
  className?: string;
  autoPlayInterval?: number;
}

export const PlacarSussurros: React.FC<PlacarSussurrosProps> = ({
  frases,
  className,
  autoPlayInterval = 6000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const sortedFrases = [...frases].sort((a, b) => (a.ordem || 0) - (b.ordem || 0));

  useEffect(() => {
    let interval: any;
    if (isPlaying && sortedFrases.length > 1) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % sortedFrases.length);
      }, autoPlayInterval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, sortedFrases.length, autoPlayInterval]);

  if (!sortedFrases.length) return null;

  const next = () => setCurrentIndex((prev) => (prev + 1) % sortedFrases.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + sortedFrases.length) % sortedFrases.length);

  return (
    <div 
      className={cn(
        "relative bg-white/[0.02] border border-white/10 rounded-[2rem] p-10 md:p-16 overflow-hidden min-h-[280px] flex flex-col justify-center items-center text-center group cursor-pointer",
        className
      )}
      onClick={() => setIsPlaying(!isPlaying)}
    >
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[9px] uppercase tracking-[0.3em] text-gold/40 font-black">
          {isPlaying ? 'Sussurrando...' : 'Sussurro em Pausa'}
        </span>
        {isPlaying ? <Pause className="w-3 h-3 text-gold/40" /> : <Play className="w-3 h-3 text-gold/40" />}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <p className="text-2xl md:text-4xl font-serif italic text-white leading-relaxed max-w-2xl">
            "{sortedFrases[currentIndex].texto}"
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-y-0 left-4 flex items-center">
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="p-2 text-white/10 hover:text-gold transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute inset-y-0 right-4 flex items-center">
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="p-2 text-white/10 hover:text-gold transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute bottom-8 flex gap-1.5">
        {sortedFrases.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 rounded-full transition-all duration-1000",
              i === currentIndex ? "w-8 bg-gold" : "w-1.5 bg-white/10"
            )}
          />
        ))}
      </div>
      
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gold/5 blur-[100px] rounded-full pointer-events-none" />
    </div>
  );
};
