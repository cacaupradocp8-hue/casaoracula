import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EstacaoGridProps {
  estacoes: {
    id: string;
    nome: string;
    status: 'locked' | 'unlocked' | 'completed';
    numero: number;
    slug: string;
    imagemUrl?: string;
  }[];
  onSelect: (slug: string) => void;
}

const toRoman = (n: number) => {
  const map: [number, string][] = [
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ];
  let res = '';
  let v = n;
  for (const [val, sym] of map) {
    while (v >= val) { res += sym; v -= val; }
  }
  return res || 'I';
};

export const RotaEstacoesGrid: React.FC<EstacaoGridProps> = ({ estacoes, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-32">
      {estacoes.map((estacao, idx) => {
        const isLocked = estacao.status === 'locked';
        return (
          <motion.div
            key={estacao.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: idx * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            whileHover={!isLocked ? { y: -4 } : undefined}
            onClick={() => !isLocked && onSelect(estacao.slug)}
            className={cn(
              "group relative w-full aspect-[3/4] rounded-2xl overflow-hidden border bg-black transition-all duration-500",
              isLocked
                ? "border-white/5 grayscale pointer-events-none opacity-60"
                : "border-white/10 hover:border-[hsl(var(--gold))]/40 cursor-pointer shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)] hover:shadow-[0_20px_60px_-20px_rgba(212,175,55,0.25)]"
            )}
          >
            {/* Background image */}
            {estacao.imagemUrl && (
              <img
                src={estacao.imagemUrl}
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700 ease-out"
              />
            )}

            {/* Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />

            {/* Inner ritual frame */}
            <div className="pointer-events-none absolute inset-3 rounded-xl border-[0.5px] border-white/10 group-hover:border-[hsl(var(--gold))]/30 transition-colors duration-500" />

            {/* Corner accents */}
            <div className="pointer-events-none absolute top-5 left-5 w-3 h-3 border-t border-l border-[hsl(var(--gold))]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="pointer-events-none absolute bottom-5 right-5 w-3 h-3 border-b border-r border-[hsl(var(--gold))]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Top meta */}
            <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-start">
              <span className="text-[9px] font-bold tracking-[0.4em] text-[hsl(var(--gold))]/70 uppercase">
                {toRoman(estacao.numero)} · Estação {String(estacao.numero).padStart(2, '0')}
              </span>
              {isLocked && <Lock className="w-3.5 h-3.5 text-white/30" />}
            </div>

            {/* Bottom content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end items-center text-center">
              <h3 className="font-serif text-2xl md:text-[1.6rem] leading-tight text-white tracking-wide group-hover:text-[hsl(var(--gold))] transition-colors duration-500">
                {estacao.nome}
              </h3>
              <div className="mt-4 h-px w-8 bg-[hsl(var(--gold))]/50 group-hover:w-20 transition-all duration-500 ease-out" />
              <span className="mt-4 text-[9px] tracking-[0.3em] uppercase font-bold text-[hsl(var(--gold))]/0 group-hover:text-[hsl(var(--gold))]/80 transition-colors duration-500">
                {isLocked ? 'Selada' : 'Atravessar'}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
