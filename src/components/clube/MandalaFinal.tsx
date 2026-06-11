import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Moon, Flame, Shield, Heart, Leaf, PawPrint } from 'lucide-react';

export interface Territorio {
  id: string;
  nome: string;
  icon: React.ReactNode;
  distrito: string;
}

export const TERRITORIOS: Territorio[] = [
  { id: 'intuicao', nome: 'Intuição', icon: <Moon className="w-8 h-8" />, distrito: 'Conselho Interior' },
  { id: 'desejo', nome: 'Desejo', icon: <Flame className="w-8 h-8" />, distrito: 'Portal de Renascimento' },
  { id: 'limites', nome: 'Limites', icon: <Shield className="w-8 h-8" />, distrito: 'Torres' },
  { id: 'corpo', nome: 'Corpo', icon: <Heart className="w-8 h-8" />, distrito: 'Jardim da Heroína' },
  { id: 'criatividade', nome: 'Criatividade', icon: <Leaf className="w-8 h-8" />, distrito: 'Bosque dos Arquétipos' },
  { id: 'vitalidade', nome: 'Vitalidade', icon: <PawPrint className="w-8 h-8" />, distrito: 'Coração da CidadELA' },
];

interface Props {
  estados: Record<string, 'Aceso' | 'Oscilante' | 'Soterrado' | 'Exausto'>;
}

const ESTADOS_MAP = {
  Aceso: { color: 'text-gold', shadow: 'shadow-[0_0_30px_rgba(212,175,55,0.4)]', border: 'border-gold/60', iconColor: 'text-gold' },
  Oscilante: { color: 'text-orange-400', shadow: 'shadow-[0_0_30px_rgba(251,146,60,0.3)]', border: 'border-orange-400/40', iconColor: 'text-orange-400' },
  Soterrado: { color: 'text-white/40', shadow: 'shadow-none', border: 'border-white/10', iconColor: 'text-white/40' },
  Exausto: { color: 'text-white/20', shadow: 'shadow-none', border: 'border-white/5', iconColor: 'text-white/20' },
};

export function MandalaFinal({ estados }: Props) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full aspect-square max-w-[600px] mx-auto flex items-center justify-center py-20 bg-transparent">
        {/* Background Geometric Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" viewBox="0 0 500 500">
          <circle cx="250" cy="250" r="180" stroke="rgba(212,175,55,0.2)" fill="none" strokeWidth="0.5" />
          <circle cx="250" cy="250" r="140" stroke="rgba(212,175,55,0.1)" fill="none" strokeWidth="0.5" />
          
          {/* Hexagon Pattern */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const rad = (angle - 90) * (Math.PI / 180);
            const x = 250 + Math.cos(rad) * 180;
            const y = 250 + Math.sin(rad) * 180;
            return (
              <line 
                key={i} 
                x1="250" y1="250" x2={x} y2={y} 
                stroke="rgba(212,175,55,0.15)" 
                strokeWidth="0.5" 
              />
            );
          })}
          
          {/* Inner Decorative Geometry */}
          <path 
            d="M250,70 L406,160 L406,340 L250,430 L94,340 L94,160 Z" 
            fill="none" 
            stroke="rgba(212,175,55,0.1)" 
            strokeWidth="0.5" 
          />
        </svg>

        {/* Center: A Loba */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-20 w-32 h-32 rounded-full border border-gold/40 flex flex-col items-center justify-center"
          style={{ background: 'radial-gradient(circle, rgba(20,20,20,0.9) 0%, rgba(10,10,10,0.8) 100%)' }}
        >
          <div className="relative">
            <img 
              src="/src/assets/logo-casa-icon-new.png" 
              alt="Loba" 
              className="w-16 h-16 object-contain filter brightness-125"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://lovable-project.s3.amazonaws.com/loba-icon.png";
              }}
            />
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-black text-gold mt-2">A Loba</span>
          
          <div className="absolute inset-0 rounded-full border border-gold/10 scale-125 animate-pulse" />
        </motion.div>
        
        {TERRITORIOS.map((t, i) => {
          const angle = (i * 60 - 90) * (Math.PI / 180);
          const radius = 180;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const estado = estados[t.id] || 'Oscilante';
          const config = ESTADOS_MAP[estado];

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{ opacity: 1, x, y }}
              transition={{ delay: i * 0.1, duration: 1 }}
              className="absolute z-10"
            >
              <div className="flex flex-col items-center gap-2">
                <motion.div 
                  className={cn(
                    "w-24 h-24 rounded-full border flex flex-col items-center justify-center p-2 text-center transition-all duration-700 relative",
                    config.border,
                    config.shadow,
                    "bg-midnight/80 backdrop-blur-sm"
                  )}
                >
                  <div className={cn("transition-colors duration-700", config.iconColor)}>
                    {t.icon}
                  </div>
                </motion.div>
                
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">
                    {t.nome}
                  </span>
                  <span className={cn(
                    "text-[8px] uppercase tracking-[0.1em] font-bold mt-0.5",
                    config.color
                  )}>
                    • {estado.toUpperCase()}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-12 flex flex-wrap justify-center gap-6 px-4 py-3 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm">
        {Object.entries(ESTADOS_MAP).map(([nome, config]) => (
          <div key={nome} className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", config.color.replace('text-', 'bg-'))} />
            <span className="text-[9px] uppercase tracking-widest font-black text-white/60">
              {nome.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
