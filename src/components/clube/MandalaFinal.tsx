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
    <div className="relative w-full aspect-square max-w-[420px] mx-auto flex items-center justify-center py-10">
      {/* Mandala Background Rings */}
      <div className="absolute inset-0 rounded-full border border-gold/5 scale-100" />
      <div className="absolute inset-0 rounded-full border border-gold/10 scale-90" />
      <div className="absolute inset-0 rounded-full border border-gold/20 scale-75" />
      
      {/* Center Glow */}
      <div className="absolute w-24 h-24 bg-gold/10 blur-[60px] rounded-full" />
      
      {TERRITORIOS.map((t, i) => {
        const angle = (i * 60 - 90) * (Math.PI / 180); // Start from top (-90 deg)
        const radius = 135;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const estado = estados[t.id] || 'Oscilante';

        return (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
            className="absolute z-10"
            style={{ x, y }}
          >
            <div className="flex flex-col items-center group">
              <div className={cn(
                "w-20 h-20 rounded-full flex flex-col items-center justify-center p-2 text-center transition-all duration-700 relative",
                "bg-midnight/90 border-2 backdrop-blur-sm",
                
                estado === 'Aceso' && "border-gold shadow-[0_0_30px_rgba(212,175,55,0.6)] ring-1 ring-gold/50",
                estado === 'Oscilante' && "border-gold/40 shadow-[0_0_15px_rgba(212,175,55,0.2)] animate-pulse",
                estado === 'Soterrado' && "border-white/10 opacity-60 grayscale-[0.5]",
                estado === 'Exausto' && "border-white/5 opacity-40 grayscale"
              )}>
                {/* Visual state indicator */}
                {estado === 'Aceso' && (
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-gold/10" 
                  />
                )}
                
                <span className={cn(
                  "text-2xl mb-1 transition-transform duration-500",
                  estado === 'Aceso' && "scale-110",
                  estado === 'Exausto' && "scale-90"
                )}>{t.icon}</span>
              </div>
              
              <div className="mt-2 text-center">
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 leading-none">{t.nome}</span>
                <span className={cn(
                  "text-[8px] uppercase tracking-widest font-black mt-1 block",
                  estado === 'Aceso' && "text-gold",
                  estado === 'Oscilante' && "text-gold/60",
                  estado === 'Soterrado' && "text-white/40",
                  estado === 'Exausto' && "text-white/20"
                )}>
                  {estado}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
