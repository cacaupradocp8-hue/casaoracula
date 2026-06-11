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
  { id: 'intuicao', nome: 'Intuição', icon: <Moon className="w-8 h-8 md:w-10 md:h-10" />, distrito: 'Conselho Interior' },
  { id: 'desejo', nome: 'Desejo', icon: <Flame className="w-8 h-8 md:w-10 md:h-10" />, distrito: 'Portal de Renascimento' },
  { id: 'limites', nome: 'Limites', icon: <Shield className="w-8 h-8 md:w-10 md:h-10" />, distrito: 'Torres' },
  { id: 'corpo', nome: 'Corpo', icon: <Heart className="w-8 h-8 md:w-10 md:h-10" />, distrito: 'Jardim da Heroína' },
  { id: 'criatividade', nome: 'Criatividade', icon: <Leaf className="w-8 h-8 md:w-10 md:h-10" />, distrito: 'Bosque dos Arquétipos' },
  { id: 'vitalidade', nome: 'Vitalidade', icon: <PawPrint className="w-8 h-8 md:w-10 md:h-10" />, distrito: 'Coração da CidadELA' },
];

interface Props {
  estados: Record<string, 'Aceso' | 'Oscilante' | 'Soterrado' | 'Exausto'>;
}

const ESTADOS_MAP = {
  Aceso: { 
    color: 'text-[#d4af37]', 
    shadow: 'shadow-[0_0_40px_rgba(212,175,55,0.4)]', 
    border: 'border-[#d4af37]/60', 
    iconColor: 'text-[#d4af37]',
    dotColor: 'bg-[#d4af37]'
  },
  Oscilante: { 
    color: 'text-[#c5a059]', 
    shadow: 'shadow-[0_0_30px_rgba(197,160,89,0.3)]', 
    border: 'border-[#c5a059]/40', 
    iconColor: 'text-[#c5a059]',
    dotColor: 'bg-[#c5a059]/60'
  },
  Soterrado: { 
    color: 'text-white/40', 
    shadow: 'shadow-none', 
    border: 'border-white/10', 
    iconColor: 'text-white/20',
    dotColor: 'bg-white/20'
  },
  Exausto: { 
    color: 'text-white/20', 
    shadow: 'shadow-none', 
    border: 'border-white/5', 
    iconColor: 'text-white/10',
    dotColor: 'bg-white/10'
  },
};

export function MandalaFinal({ estados }: Props) {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full aspect-square max-w-[650px] mx-auto flex items-center justify-center py-24 bg-transparent scale-90 sm:scale-100">
        
        {/* Decorative Nature Background (Leaves/Branches simulation) */}
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-visible">
          <svg className="w-full h-full" viewBox="0 0 500 500">
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <g key={`branch-${i}`} transform={`rotate(${angle} 250 250)`}>
                <path 
                  d="M250,250 C250,200 240,150 250,70 M250,150 L230,130 M250,120 L270,100" 
                  stroke="#d4af37" 
                  strokeWidth="0.5" 
                  fill="none" 
                  className="opacity-40"
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Background Geometric Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" viewBox="0 0 500 500">
          <circle cx="250" cy="250" r="180" stroke="#d4af37" fill="none" strokeWidth="0.5" className="opacity-40" />
          <circle cx="250" cy="250" r="140" stroke="#d4af37" fill="none" strokeWidth="0.5" className="opacity-20" />
          
          {/* Main Axis Lines */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const rad = (angle - 90) * (Math.PI / 180);
            const x = 250 + Math.cos(rad) * 180;
            const y = 250 + Math.sin(rad) * 180;
            return (
              <line 
                key={i} 
                x1="250" y1="250" x2={x} y2={y} 
                stroke="#d4af37" 
                strokeWidth="0.5" 
                className="opacity-30"
              />
            );
          })}
          
          {/* Geometric Inner Star Pattern */}
          <path 
            d="M250,70 L300,200 L430,250 L300,300 L250,430 L200,300 L70,250 L200,200 Z" 
            fill="none" 
            stroke="#d4af37" 
            strokeWidth="0.3" 
            className="opacity-10" 
          />
          <path 
            d="M250,70 L406,160 L406,340 L250,430 L94,340 L94,160 Z" 
            fill="none" 
            stroke="#d4af37" 
            strokeWidth="0.5" 
            className="opacity-20"
          />
        </svg>

        {/* Center: A Loba */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-20 w-32 h-32 md:w-40 md:h-40 rounded-full border border-[#d4af37]/40 flex flex-col items-center justify-center p-4"
          style={{ background: 'radial-gradient(circle, rgba(10,10,12,0.95) 0%, rgba(5,5,7,0.85) 100%)' }}
        >
          <div className="relative flex flex-col items-center">
            <img 
              src="/src/assets/logo-casa-icon-new.png" 
              alt="Loba" 
              className="w-16 h-16 md:w-20 md:h-20 object-contain filter brightness-110 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://lovable-project.s3.amazonaws.com/loba-icon.png";
              }}
            />
            <span className="text-[11px] md:text-[12px] uppercase tracking-[0.4em] font-black text-[#d4af37] mt-3">A Loba</span>
          </div>
          
          {/* Decorative Halo */}
          <div className="absolute inset-[-10px] rounded-full border border-[#d4af37]/10 animate-pulse" />
          <div className="absolute inset-[-20px] rounded-full border border-[#d4af37]/5" />
        </motion.div>
        
        {TERRITORIOS.map((t, i) => {
          const angle = (i * 60 - 90) * (Math.PI / 180);
          const radius = 200; // Increased radius for better spacing
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const estado = estados[t.id] || 'Oscilante';
          const config = ESTADOS_MAP[estado];

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{ opacity: 1, x, y }}
              transition={{ delay: i * 0.1, duration: 1.2, ease: "easeOut" }}
              className="absolute z-10"
            >
              <div className="flex flex-col items-center gap-3">
                <motion.div 
                  className={cn(
                    "w-24 h-24 md:w-28 md:h-28 rounded-full border flex flex-col items-center justify-center p-2 text-center transition-all duration-1000 relative",
                    config.border,
                    config.shadow,
                    "bg-[#0a0a0c]/90 backdrop-blur-md"
                  )}
                >
                  <div className={cn("transition-colors duration-1000", config.iconColor)}>
                    {t.icon}
                  </div>
                  
                  {/* Subtle highlight ring for aceso/oscilante */}
                  {(estado === 'Aceso' || estado === 'Oscilante') && (
                    <div className={cn("absolute inset-0 rounded-full border border-current opacity-20 scale-105 animate-pulse", config.iconColor)} />
                  )}
                </motion.div>
                
                <div className="flex flex-col items-center">
                  <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-white/90">
                    {t.nome}
                  </span>
                  <span className={cn(
                    "text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold mt-1 opacity-80",
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

      {/* Legend - Centered at bottom */}
      <div className="mt-16 flex flex-wrap justify-center gap-8 px-8 py-4 rounded-full border border-white/5 bg-white/2 backdrop-blur-md">
        {Object.entries(ESTADOS_MAP).map(([nome, config]) => (
          <div key={nome} className="flex items-center gap-3">
            <div className={cn("w-2 h-2 rounded-full", config.dotColor)} />
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/50">
              {nome.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
