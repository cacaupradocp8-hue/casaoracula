import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FraseTravessiaProps {
  texto: string;
  className?: string;
}

export function FraseTravessia({ texto, className }: FraseTravessiaProps) {
  if (!texto) return null;
  
  return (
    <div className={cn("py-24 flex flex-col items-center justify-center text-center px-6", className)}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="max-w-2xl"
      >
        <div className="flex flex-col items-center gap-6">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-gold/20" />
          
          <p className="font-serif italic text-2xl md:text-3xl lg:text-4xl text-white/50 leading-relaxed tracking-tight">
            "{texto}"
          </p>
          
          <div className="w-px h-12 bg-gradient-to-t from-transparent to-gold/20" />
        </div>
      </motion.div>
    </div>
  );
}
