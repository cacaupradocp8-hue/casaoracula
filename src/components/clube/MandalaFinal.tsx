import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    shadow: 'shadow-[0_0_50px_rgba(212,175,55,0.6)]', 
    border: 'border-[#d4af37]/80', 
    iconColor: 'text-[#d4af37]',
    dotColor: 'bg-[#d4af37]',
    glowIntensity: '0.8'
  },
  Oscilante: { 
    color: 'text-[#c5a059]', 
    shadow: 'shadow-[0_0_30px_rgba(197,160,89,0.4)]', 
    border: 'border-[#c5a059]/50', 
    iconColor: 'text-[#c5a059]',
    dotColor: 'bg-[#c5a059]',
    glowIntensity: '0.4'
  },
  Soterrado: { 
    color: 'text-white/40', 
    shadow: 'shadow-none', 
    border: 'border-white/20', 
    iconColor: 'text-white/30',
    dotColor: 'bg-white/30',
    glowIntensity: '0'
  },
  Exausto: { 
    color: 'text-white/20', 
    shadow: 'shadow-none', 
    border: 'border-white/10', 
    iconColor: 'text-white/20',
    dotColor: 'bg-white/10',
    glowIntensity: '0'
  },
};

export function MandalaFinal({ estados }: Props) {
  return (
    <div className="flex flex-col items-center w-full min-h-[800px] justify-center overflow-visible">
      <div className="relative w-full aspect-square max-w-[750px] mx-auto flex items-center justify-center bg-transparent scale-90 sm:scale-100 p-8">
        
        {/* Organic Flowing Lines / Ribbons to give "cara de mandala" */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" viewBox="0 0 800 800">
            <defs>
              <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d4af37" stopOpacity="0" />
                <stop offset="50%" stopColor="#d4af37" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[...Array(3)].map((_, i) => (
              <motion.circle
                key={`orb-${i}`}
                cx="400" cy="400"
                r={280 + i * 40}
                stroke="url(#gold-grad)"
                strokeWidth="1.5"
                fill="none"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.05, 1],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ 
                  rotate: { duration: 40 + i * 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut" }
                }}
              />
            ))}
            {/* Wave paths */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <motion.path
                key={`wave-${i}`}
                d="M400,400 Q450,300 500,400 T600,400"
                stroke="#d4af37"
                strokeWidth="0.5"
                fill="none"
                className="opacity-10"
                style={{ originX: "400px", originY: "400px" }}
                animate={{ rotate: angle, scale: [1, 1.1, 1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </svg>
        </div>
        
        {/* Background Decorative Element (Leaves/Branches) as seen in the model */}
        <div className="absolute inset-0 opacity-40 pointer-events-none overflow-visible flex items-center justify-center">
          <div className="relative w-[500px] h-[500px]">
             {/* Branch Circle */}
             <svg className="absolute inset-0 w-full h-full rotate-45 scale-125" viewBox="0 0 500 500">
               <circle cx="250" cy="250" r="220" stroke="#d4af37" fill="none" strokeWidth="1" className="opacity-10" />
               <path 
                 d="M250,30 A220,220 0 0,1 470,250 A220,220 0 0,1 250,470 A220,220 0 0,1 30,250 A220,220 0 0,1 250,30" 
                 stroke="#d4af37" fill="none" strokeWidth="2" strokeDasharray="5,15" className="opacity-20"
               />
               {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                 <g key={`leaf-${i}`} transform={`rotate(${angle} 250 250)`}>
                   <path 
                     d="M250,30 L260,10 L250,5 L240,10 Z" 
                     fill="#d4af37" 
                     className="opacity-40"
                   />
                 </g>
               ))}
             </svg>
          </div>
        </div>

        {/* Background Geometric Lines - Sacred Geometry Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" viewBox="0 0 500 500">
          <circle cx="250" cy="250" r="140" stroke="#d4af37" fill="none" strokeWidth="0.5" className="opacity-20" />
          
          {/* Main Axis Lines Connecting Center to Territorios */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const rad = (angle - 90) * (Math.PI / 180);
            const x = 250 + Math.cos(rad) * 200;
            const y = 250 + Math.sin(rad) * 200;
            return (
              <line 
                key={i} 
                x1="250" y1="250" x2={x} y2={y} 
                stroke="#d4af37" 
                strokeWidth="1" 
                className="opacity-20"
              />
            );
          })}
          
          {/* Inner Hexagon Pattern */}
          <path 
            d="M250,110 L371,180 L371,320 L250,390 L129,320 L129,180 Z" 
            fill="none" 
            stroke="#d4af37" 
            strokeWidth="0.5" 
            className="opacity-15"
          />
          
          {/* Outer Connection Lines */}
          <path 
            d="M250,50 L423,150 L423,350 L250,450 L77,350 L77,150 Z" 
            fill="none" 
            stroke="#d4af37" 
            strokeWidth="0.5" 
            className="opacity-10"
          />
        </svg>

        {/* Center: A Loba */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-30 w-36 h-36 md:w-44 md:h-44 rounded-full border border-[#d4af37]/60 flex flex-col items-center justify-center p-4 shadow-[0_0_60px_rgba(212,175,55,0.3)]"
          style={{ background: 'radial-gradient(circle, rgba(15,15,20,0.98) 0%, rgba(5,5,10,0.9) 100%)' }}
        >
          <div className="relative flex flex-col items-center">
            {/* The Wolf Icon - Using a more reliable path or SVG directly if image fails */}
            <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
              <img 
                src="https://pviznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/content-images/galeria/loba-icon.png" 
                alt="A Loba" 
                className="w-full h-full object-contain filter brightness-125 drop-shadow-[0_0_20px_rgba(212,175,55,0.6)]"
                onError={(e) => {
                  // Fallback to PawPrint if image fails
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon') as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              <div className="fallback-icon hidden">
                <PawPrint className="w-12 h-12 text-[#d4af37] animate-pulse" />
              </div>
            </div>
            <span className="text-[12px] md:text-[14px] uppercase tracking-[0.5em] font-black text-[#d4af37] mt-3">A Loba</span>
          </div>
          
          {/* Decorative Halo - Pulsing */}
          <motion.div 
            animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-[-15px] rounded-full border border-[#d4af37]/20" 
          />
          <div className="absolute inset-[-30px] rounded-full border border-[#d4af37]/5" />
        </motion.div>
        
        {TERRITORIOS.map((t, i) => {
          const angle = (i * 60 - 90) * (Math.PI / 180);
          const radius = 230; 
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const estado = estados[t.id] || 'Soterrado';
          const config = ESTADOS_MAP[estado];

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{ opacity: 1, x, y }}
              transition={{ delay: i * 0.1, duration: 1.5, ease: "easeOut" }}
              className="absolute z-20"
            >
              <div className="flex flex-col items-center gap-4">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={estado}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={cn(
                      "w-28 h-28 md:w-32 md:h-32 rounded-full border flex flex-col items-center justify-center p-2 text-center transition-all duration-1000 relative",
                      config.border,
                      config.shadow,
                      "bg-[#050507]/90 backdrop-blur-xl"
                    )}
                  >
                    <div className={cn("transition-colors duration-1000", config.iconColor)}>
                      {t.icon}
                    </div>
                    
                    {/* Pulsing Light Aura for Aceso/Oscilante */}
                    {(estado === 'Aceso' || estado === 'Oscilante') && (
                      <motion.div 
                        animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.15, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className={cn("absolute inset-0 rounded-full border-2 border-current", config.iconColor)} 
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="flex flex-col items-center text-center">
                  <span className="text-[12px] md:text-[14px] font-black uppercase tracking-[0.4em] text-[#e5e7eb] drop-shadow-sm">
                    {t.nome}
                  </span>
                  <span className={cn(
                    "text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold mt-1.5 flex items-center gap-1.5",
                    config.color
                  )}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", config.dotColor)} />
                    {estado.toUpperCase()}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend Box - Styled as per model */}
      <div className="mt-24 px-10 py-5 rounded-full border border-white/10 bg-[#050507]/60 backdrop-blur-xl flex flex-wrap justify-center gap-10">
        {Object.entries(ESTADOS_MAP).map(([nome, config]) => (
          <div key={nome} className="flex items-center gap-3 group cursor-default">
            <motion.div 
              animate={nome === 'Aceso' ? { scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className={cn("w-2.5 h-2.5 rounded-full shadow-sm", config.dotColor)} 
            />
            <span className="text-[11px] uppercase tracking-[0.3em] font-bold text-white/50 group-hover:text-white/80 transition-colors">
              {nome.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

