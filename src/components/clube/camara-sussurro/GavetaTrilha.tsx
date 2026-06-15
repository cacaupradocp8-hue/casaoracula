import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { TrainingCase } from '@/components/treinamento/simulador/types';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

interface Props {
  titulo: string;
  subtitulo?: string;
  sussurros: TrainingCase[];
  startIndex: number;
  defaultOpen?: boolean;
  onSelect: (caso: TrainingCase) => void;
}

export function GavetaTrilha({ titulo, subtitulo, sussurros, startIndex, defaultOpen, onSelect }: Props) {
  const [open, setOpen] = useState(!!defaultOpen);

  return (
    <div className="border-t border-amber-200/10">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-end justify-between py-6 group text-left"
      >
        <div>
          <p className="text-[10px] tracking-[0.5em] uppercase text-amber-200/40 mb-2">Trilha</p>
          <h3 className="text-2xl md:text-3xl font-display text-amber-100/90 group-hover:text-amber-200 transition-colors italic">
            {titulo}
          </h3>
          {subtitulo && (
            <p className="text-xs text-foreground/40 mt-1 font-body">{subtitulo}</p>
          )}
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.4 }}>
          <ChevronDown className="w-5 h-5 text-amber-200/40" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-8 space-y-1">
              {sussurros.length === 0 && (
                <p className="text-xs italic text-foreground/30 py-4">Sussurros em silêncio. Aguardando cadastro.</p>
              )}
              {sussurros.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => onSelect(s)}
                  className="w-full flex items-center gap-6 py-4 px-2 group border-b border-amber-200/5 hover:border-amber-200/30 transition-all"
                >
                  <span className="font-display text-xl text-amber-200/30 group-hover:text-amber-200/70 w-10 transition-colors">
                    {ROMAN[startIndex + i] || (startIndex + i + 1)}
                  </span>
                  <span className="flex-1 text-left font-display text-lg text-foreground/70 group-hover:text-amber-100 italic transition-colors">
                    {s.title}
                  </span>
                  <span className="w-3 h-3 rounded-full bg-amber-700/30 group-hover:bg-amber-400/80 group-hover:shadow-[0_0_12px_rgba(251,191,36,0.6)] transition-all" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
