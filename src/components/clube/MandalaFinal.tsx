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
    <div className="flex flex-col items-center w-full min-h-[900px] justify-center overflow-visible py-20">
      <div className="relative w-full aspect-square max-w-[800px] mx-auto flex items-center justify-center bg-transparent scale-90 sm:scale-100 p-8">
        
        {/* Background Sacred Geometry & Texture */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg className="w-full h-full" viewBox="0 0 800 800">
            <defs>
              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#d4af37" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="400" cy="400" r="380" fill="url(#centerGlow)" />
            
            {/* Hexagram / Sacred Geometry Pattern */}
            <g className="opacity-20" stroke="#d4af37" strokeWidth="0.5" fill="none">
              <path d="M400,100 L660,250 L660,550 L400,700 L140,550 L140,250 Z" />
              <path d="M400,700 L660,250 L140,250 Z" />
              <path d="M400,100 L660,550 L140,550 Z" />
              <circle cx="400" cy="400" r="230" strokeDasharray="2,4" />
              <circle cx="400" cy="400" r="300" opacity="0.5" />
            </g>
          </svg>
        </div>

        {/* The Branch Structure (The living connection) */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <svg className="w-full h-full" viewBox="0 0 800 800">
            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
              const rad = (angle - 90) * (Math.PI / 180);
              const x2 = 400 + Math.cos(rad) * 230;
              const y2 = 400 + Math.sin(rad) * 230;
              
              return (
                <g key={`branch-${i}`} className="opacity-60">
                  {/* Organic Branch Line */}
                  <motion.path
                    d={`M400,400 Q${400 + Math.cos(rad-0.2)*120},${400 + Math.sin(rad-0.2)*120} ${x2},${y2}`}
                    stroke="#3d2b1f"
                    strokeWidth="4"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: i * 0.2 }}
                  />
                  {/* Subtle highlight on branch */}
                  <motion.path
                    d={`M400,400 Q${400 + Math.cos(rad-0.2)*120},${400 + Math.sin(rad-0.2)*120} ${x2},${y2}`}
                    stroke="#d4af37"
                    strokeWidth="1"
                    fill="none"
                    className="opacity-20"
                  />
                  {/* Leaves at the end of branches */}
                  <g transform={`translate(${x2},${y2}) rotate(${angle})`}>
                    <path d="M-5,0 C-15,-10 -5,-25 0,-30 C5,-25 15,-10 5,0 Z" fill="#1a2e1a" opacity="0.4" />
                    <path d="M-3,-5 C-8,-12 -3,-20 0,-24 C3,-20 8,-12 3,-5 Z" fill="#d4af37" opacity="0.2" />
                  </g>
                </g>
              );
            })}
            
            {/* The circular wreath connecting everything */}
            <circle 
              cx="400" cy="400" r="230" 
              stroke="#2a1f15" 
              strokeWidth="6" 
              fill="none" 
              className="opacity-40" 
              strokeDasharray="10,5"
            />
          </svg>
        </div>

        {/* Center: A Loba */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-30 w-44 h-44 md:w-52 md:h-52 rounded-full border border-[#d4af37]/40 flex flex-col items-center justify-center p-4 shadow-[0_0_80px_rgba(212,175,55,0.3)] overflow-hidden"
          style={{ background: 'radial-gradient(circle, rgba(20,15,10,1) 0%, rgba(5,5,5,1) 100%)' }}
        >
          {/* Inner textures */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <svg className="w-full h-full" viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="48" stroke="#d4af37" fill="none" strokeWidth="0.5" strokeDasharray="1,2" />
               <path d="M50,10 L90,75 L10,75 Z" stroke="#d4af37" fill="none" strokeWidth="0.2" />
             </svg>
          </div>

          <div className="relative flex flex-col items-center w-full h-full justify-center mt-2">
            <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center relative">
              <img 
                src="https://pviznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/content-images/galeria/loba-icon.png" 
                alt="A Loba" 
                className="w-full h-full object-contain filter brightness-125 drop-shadow-[0_0_20px_rgba(212,175,55,1)] z-10"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon') as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              <div className="fallback-icon hidden z-10">
                <PawPrint className="w-16 h-16 text-[#d4af37] animate-pulse" />
              </div>
              <div className="absolute inset-0 bg-[#d4af37]/10 blur-3xl rounded-full" />
            </div>
            <span className="text-[11px] md:text-[13px] uppercase tracking-[0.8em] font-black text-gold/90 mt-2 relative z-10">A Loba</span>
          </div>
          
          {/* Sacred Halos */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border border-[#d4af37]/5 rounded-full"
            style={{ borderStyle: 'dashed' }}
          />
        </motion.div>
        
        {TERRITORIOS.map((t, i) => {
          const angle = (i * 60 - 90) * (Math.PI / 180);
          const radius = 230; 
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const estado = estados[t.id] || 'Soterrado';
          const config = ESTADOS_MAP[estado];

          const isAceso = estado === 'Aceso';
          const isOscilante = estado === 'Oscilante';

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{ opacity: 1, x, y }}
              transition={{ delay: i * 0.1, duration: 1.5, ease: "easeOut" }}
              className="absolute z-40"
            >
              <div className="flex flex-col items-center">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={estado}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      "w-24 h-24 md:w-28 md:h-28 rounded-full border flex flex-col items-center justify-center p-2 transition-all duration-1000 relative",
                      isAceso ? "border-[#d4af37] shadow-[0_0_40px_rgba(212,175,55,0.6)]" : 
                      isOscilante ? "border-[#c5a059]/60 shadow-[0_0_20px_rgba(197,160,89,0.3)]" : 
                      "border-white/10 grayscale opacity-60",
                      "bg-black/80 backdrop-blur-md"
                    )}
                  >
                    <div className={cn("transition-colors duration-1000 scale-110", config.iconColor)}>
                      {t.icon}
                    </div>
                    
                    {/* Glowing Aura for Aceso */}
                    {isAceso && (
                      <motion.div 
                        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-[#d4af37]/10 blur-xl" 
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="flex flex-col items-center text-center mt-3 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5">
                  <span className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.3em] text-white/90">
                    {t.nome}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={cn("w-1.5 h-1.5 rounded-full", config.dotColor)} />
                    <span className={cn("text-[9px] uppercase tracking-widest font-black", config.color)}>
                      {estado.toUpperCase()}
                    </span>
                  </div>
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

