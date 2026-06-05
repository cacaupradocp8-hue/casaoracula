import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Sparkles } from 'lucide-react';
import { CIDADELA_TERRITORIOS } from '@/types/cidadela-territorios';

interface Props {
  territoriosAtivados?: string[];
}

export function MiniMandalaTerritorios({ territoriosAtivados }: Props) {
  if (!territoriosAtivados || territoriosAtivados.length === 0) return null;

  const territorios = territoriosAtivados
    .map(idOrName => CIDADELA_TERRITORIOS.find(
      t => t.id === idOrName || t.nome.toLowerCase() === idOrName.toLowerCase()
    ))
    .filter((t): t is typeof CIDADELA_TERRITORIOS[number] => !!t);

  return (
    <div className="flex flex-wrap justify-center gap-12 py-10">
      {territorios.map((t, i) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.2 }}
          className="relative group"
        >
          {/* Symbolic Ring */}
          <div className="absolute inset-0 rounded-full border border-gold/10 group-hover:border-gold/30 group-hover:scale-125 transition-all duration-1000 animate-spin-slow" />
          
          <div className="relative w-32 h-32 rounded-full bg-gold/5 border border-gold/20 flex flex-col items-center justify-center p-4 text-center backdrop-blur-sm group-hover:bg-gold/10 transition-colors">
            <Compass className="w-8 h-8 text-gold/60 mb-2 group-hover:rotate-45 transition-transform duration-700" />
            <span className="text-[9px] leading-tight font-display text-white/80 uppercase tracking-widest">
              {t.nome}
            </span>
            <Sparkles className="absolute top-2 right-2 w-3 h-3 text-gold/40 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Label below */}
          <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <p className="text-[8px] text-gold/50 uppercase tracking-[0.3em] font-bold">Ativado</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
