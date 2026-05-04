import React from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Laboratorio8020Modal } from './Laboratorio8020Modal';

interface Laboratorio8020CardProps {
  bookId: string;
  bookTitle: string;
  className?: string;
}

export function Laboratorio8020Card({ bookId, bookTitle, className }: Laboratorio8020CardProps) {
  return (
    <Laboratorio8020Modal
      bookId={bookId}
      bookTitle={bookTitle}
      trigger={
        <motion.div
          whileHover={{ scale: 1.01, y: -4 }}
          className={className || "cursor-pointer group relative overflow-hidden rounded-[2.5rem] border border-gold/20 bg-midnight/40 p-8 md:p-10 shadow-2xl backdrop-blur-sm transition-all duration-500"}
        >
          {/* Atmosfera */}
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
            <FlaskConical className="w-48 h-48 text-gold" />
          </div>
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-gold/10 text-gold border-gold/30 uppercase tracking-[0.2em] text-[9px] py-1 px-3 rounded-full font-bold">
                Módulo Oficial
              </Badge>
              <div className="flex items-center gap-1.5 text-white/30">
                <Sparkles className="w-3 h-3" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em]">80/20 Essence</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl md:text-3xl font-display text-white leading-tight tracking-tight">
                Laboratório 80/20: <span className="text-gold/90">{bookTitle}</span>
              </h3>
              <p className="text-white/40 text-base font-serif italic leading-relaxed max-w-xl">
                "A essência destilada da obra para sua prática clínica. O núcleo simbólico que organiza o atendimento."
              </p>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <Button variant="gold" className="rounded-full px-8 h-12 font-bold shadow-gold group-hover:shadow-[0_0_25px_rgba(234,179,8,0.3)] transition-all">
                Acessar Laboratório
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <div className="hidden sm:flex items-center gap-2 text-white/20 text-[10px] uppercase tracking-widest font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                Núcleo Vivo & Tensão
              </div>
            </div>
          </div>
        </motion.div>
      }
    />
  );
}
