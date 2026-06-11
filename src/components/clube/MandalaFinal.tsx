import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface Territorio {
  id: string;
  nome: string;
  icon: string;
  distrito: string;
}

export const TERRITORIOS: Territorio[] = [
  { id: 'corpo', nome: 'Corpo', icon: '❤️', distrito: 'Jardim da Heroína' },
  { id: 'intuicao', nome: 'Intuição', icon: '🌙', distrito: 'Conselho Interior' },
  { id: 'desejo', nome: 'Desejo', icon: '🔥', distrito: 'Portal de Renascimento' },
  { id: 'limites', nome: 'Limites', icon: '🛡', distrito: 'Torres' },
  { id: 'criatividade', nome: 'Criatividade', icon: '🌿', distrito: 'Bosque dos Arquétipos' },
  { id: 'vitalidade', nome: 'Vitalidade', icon: '🐺', distrito: 'Coração da CidadELA' },
];

interface Props {
  estados: Record<string, 'Aceso' | 'Oscilante' | 'Soterrado' | 'Exausto'>;
}

export function MandalaFinal({ estados }: Props) {
  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto flex items-center justify-center">
      {/* Mandala Background Ring */}
      <div className="absolute inset-0 rounded-full border border-gold/10 scale-90" />
      
      {TERRITORIOS.map((t, i) => {
        const angle = (i * 60) * (Math.PI / 180);
        const radius = 120;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="absolute"
            style={{ x, y }}
          >
            <div className={cn(
              "w-20 h-20 rounded-full flex flex-col items-center justify-center p-2 text-center transition-all duration-700",
              "bg-midnight/80 border border-gold/30 shadow-[0_0_20px_rgba(212,175,55,0.1)]",
              estados[t.id] === 'Aceso' && "border-gold shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            )}>
              <span className="text-xl mb-1">{t.icon}</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/90">{t.nome}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
