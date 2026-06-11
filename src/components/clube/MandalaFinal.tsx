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

// Fixed order according to reference image starting from Top and going clockwise
export const TERRITORIOS: Territorio[] = [
  { id: 'intuicao', nome: 'Intuição', icon: <Moon className="w-10 h-10" />, distrito: 'Conselho Interior' }, // Top
  { id: 'desejo', nome: 'Desejo', icon: <Flame className="w-10 h-10" />, distrito: 'Portal de Renascimento' }, // Right Top
  { id: 'limites', nome: 'Limites', icon: <Shield className="w-10 h-10" />, distrito: 'Torres' }, // Right Bottom
  { id: 'corpo', nome: 'Corpo', icon: <Heart className="w-10 h-10" />, distrito: 'Jardim da Heroína' }, // Bottom
  { id: 'criatividade', nome: 'Criatividade', icon: <Leaf className="w-10 h-10" />, distrito: 'Bosque dos Arquétipos' }, // Left Bottom
  { id: 'vitalidade', nome: 'Vitalidade', icon: <PawPrint className="w-10 h-10" />, distrito: 'Coração da CidadELA' }, // Left Top
];

interface Props {
  estados: Record<string, 'Aceso' | 'Oscilante' | 'Soterrado' | 'Exausto'>;
}

const ESTADOS_MAP = {
  Aceso: { 
    color: 'text-[#d4af37]', 
    dotColor: 'bg-[#d4af37]',
    label: 'ACESO',
    glow: 'rgba(212, 175, 55, 0.4)'
  },
  Oscilante: { 
    color: 'text-[#c5a059]', 
    dotColor: 'bg-[#c5a059]',
    label: 'OSCILANTE',
    glow: 'rgba(197, 160, 89, 0.2)'
  },
  Soterrado: { 
    color: 'text-white/40', 
    dotColor: 'bg-white/30',
    label: 'SOTERRADO',
    glow: 'transparent'
  },
  Exausto: { 
    color: 'text-white/20', 
    dotColor: 'bg-white/10',
    label: 'EXAUSTO',
    glow: 'transparent'
  },
};

export function MandalaFinal({ estados }: Props) {
  return (
    <div className="flex flex-col items-center w-full min-h-[500px] md:min-h-[700px] justify-center overflow-visible py-4 md:py-10 relative">
      
      {/* Container Principal da Mandala */}
      <div className="relative w-full aspect-square max-w-[320px] sm:max-w-[450px] md:max-w-[700px] mx-auto flex items-center justify-center p-2 md:p-4">
        
        {/* Camadas de Fundo da Mandala (Geometria Sagrada) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <svg className="w-full h-full opacity-30" viewBox="0 0 800 800">
            <defs>
              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#d4af37" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
              </radialGradient>
              
              <filter id="mist" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
              </filter>
            </defs>
            
            {/* Center Glow Background */}
            <circle cx="400" cy="400" r="300" fill="url(#centerGlow)" />

            {/* Geometry Lines (Faint) */}
            <g stroke="#d4af37" strokeWidth="0.5" fill="none" className="opacity-40">
              <circle cx="400" cy="400" r="230" strokeDasharray="4 8" />
              <circle cx="400" cy="400" r="180" opacity="0.5" />
              <path d="M400,170 L600,285 L600,515 L400,630 L200,515 L200,285 Z" strokeDasharray="2 4" />
              <path d="M400,100 L700,400 L400,700 L100,400 Z" opacity="0.2" />
            </g>

            {/* The Outer Vine Ring (Branches) */}
            <g className="opacity-40">
              <circle cx="400" cy="400" r="230" stroke="#3d2b1f" strokeWidth="12" fill="none" />
              <circle cx="400" cy="400" r="230" stroke="#d4af37" strokeWidth="1" fill="none" className="opacity-30" />
            </g>

            {/* Connecting Branches (Spokes) */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
              const rad = (angle - 90) * (Math.PI / 180);
              const x2 = 400 + Math.cos(rad) * 230;
              const y2 = 400 + Math.sin(rad) * 230;
              return (
                <line 
                  key={`spoke-${i}`}
                  x1="400" y1="400" x2={x2} y2={y2}
                  stroke="#3d2b1f" strokeWidth="6"
                  className="opacity-60"
                />
              );
            })}
          </svg>
        </div>

        {/* Partículas Lentas no Fundo */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gold/30 rounded-full"
              initial={{ 
                x: Math.random() * 800, 
                y: Math.random() * 800,
                opacity: 0
              }}
              animate={{ 
                y: [null, -100],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 5 + Math.random() * 5, 
                repeat: Infinity, 
                delay: Math.random() * 10 
              }}
            />
          ))}
        </div>

        {/* Centro: A Loba */}
        <motion.div 
          className="relative z-30 w-24 h-24 sm:w-36 sm:h-36 md:w-56 md:h-56 flex flex-col items-center justify-center p-2 md:p-4"
        >
          {/* Altar Central Halo */}
          <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border border-gold/30 bg-gold/5 blur-lg md:blur-xl"
          />
          
          <div className="relative flex flex-col items-center w-full h-full justify-center">
             <div className="w-12 h-12 sm:w-20 sm:h-20 md:w-32 md:h-32 flex items-center justify-center relative">
               <img 
                 src="https://pviznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/content-images/galeria/loba-icon.png" 
                 alt="A Loba" 
                 className="w-full h-full object-contain filter brightness-125 drop-shadow-[0_0_15px_rgba(212,175,55,0.8)] z-10"
               />
             </div>
             <span className="text-[8px] sm:text-[10px] md:text-[14px] uppercase tracking-[0.3em] md:tracking-[0.5em] font-serif text-gold/90 mt-1 md:mt-3 relative z-10">A Loba</span>
          </div>
          
          {/* Subtle Rotating Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute inset-1 md:inset-2 border border-gold/10 rounded-full border-dashed"
          />
        </motion.div>
        
        {/* Renderização dos Territórios em Posições 1:1 com Referência */}
        {TERRITORIOS.map((t, i) => {
          // Angle mapping to match positions:
          // 0: Top (Intuicao) - 270 deg
          // 1: Right Top (Desejo) - 330 deg
          // 2: Right Bottom (Limites) - 30 deg
          // 3: Bottom (Corpo) - 90 deg
          // 4: Left Bottom (Criatividade) - 150 deg
          // 5: Left Top (Vitalidade) - 210 deg
          const angles = [-90, -30, 30, 90, 150, 210];
          const angleRad = (angles[i]) * (Math.PI / 180);
          
          // Responsive radius
          const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
          const isSmallMobile = typeof window !== 'undefined' && window.innerWidth < 480;
          const radius = isSmallMobile ? 110 : isMobile ? 160 : 230; 

          const x = Math.cos(angleRad) * radius;
          const y = Math.sin(angleRad) * radius;
          
          const estado = estados[t.id] || 'Soterrado';
          const config = ESTADOS_MAP[estado];
          const isAceso = estado === 'Aceso';
          const isOscilante = estado === 'Oscilante';

          return (
            <motion.div
              key={t.id}
              style={{ x, y }}
              className="absolute z-40 flex flex-col items-center"
            >
              <div className="relative group">
                {/* Aura de Brilho */}
                {(isAceso || isOscilante) && (
                   <motion.div 
                      animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.3, 1] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-[-40px] rounded-full blur-3xl"
                      style={{ backgroundColor: config.glow }}
                   />
                )}
                
                {/* Território - Sem círculos rígidos SaaS */}
                <div className={cn(
                  "w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 flex flex-col items-center justify-center transition-all duration-1000 relative",
                  isAceso ? "opacity-100" : isOscilante ? "opacity-70" : "opacity-30"
                )}>
                  {/* Fundo Orgânico Sutil (Filtro de névoa) */}
                  <div className="absolute inset-0 bg-gold/5 rounded-full blur-md" />
                  
                  <div className={cn("relative z-10 transition-all duration-1000 filter drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]", config.color)}>
                    {React.cloneElement(t.icon as React.ReactElement, { className: "w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12" })}
                  </div>
                </div>
              </div>

              {/* Informações do Território (Fiel à Referência) */}
              <div className="flex flex-col items-center text-center mt-4">
                <span className="text-[11px] md:text-[13px] font-serif uppercase tracking-[0.3em] text-white/90">
                  {t.nome}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn("w-1.5 h-1.5 rounded-full", config.dotColor)} />
                  <span className={cn("text-[9px] md:text-[10px] uppercase tracking-widest font-bold", config.color)}>
                    {config.label}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legenda de Estados - Fiel à Referência */}
      <div className="mt-8 md:mt-16 w-full max-w-[600px] px-4 md:px-8 py-3 md:py-4 rounded-2xl md:rounded-full border border-white/5 bg-black/40 backdrop-blur-xl flex flex-wrap justify-center gap-4 md:gap-16">
        {Object.entries(ESTADOS_MAP).map(([nome, config]) => (
          <div key={nome} className="flex items-center gap-1.5 md:gap-2">
            <div className={cn("w-1.5 md:w-2 h-1.5 md:h-2 rounded-full shadow-lg", config.dotColor)} />
            <span className="text-[8px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] font-bold text-white/50">
              {config.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
