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
    <div className="relative w-full aspect-square max-w-[500px] mx-auto flex items-center justify-center py-20">
      {/* Background Cartography Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 500 500">
        <defs>
          <radialGradient id="lineGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(212,175,55,0.4)" />
            <stop offset="100%" stopColor="rgba(212,175,55,0)" />
          </radialGradient>
        </defs>
        {TERRITORIOS.map((_, i) => {
          const angle = (i * 60 - 90) * (Math.PI / 180);
          const x2 = 250 + Math.cos(angle) * 180;
          const y2 = 250 + Math.sin(angle) * 180;
          return (
            <motion.line
              key={`line-${i}`}
              x1="250" y1="250" x2={x2} y2={y2}
              stroke="url(#lineGradient)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: i * 0.2 }}
            />
          );
        })}
        <motion.circle
          cx="250" cy="250" r="180"
          stroke="rgba(212,175,55,0.1)"
          fill="none"
          strokeWidth="1"
          strokeDasharray="4 8"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      {/* Center: A Loba */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-20 w-32 h-32 rounded-full bg-midnight/80 border border-gold/40 backdrop-blur-xl flex flex-col items-center justify-center shadow-[0_0_60px_rgba(212,175,55,0.15)]"
      >
        <div className="relative">
          <img 
            src="/src/assets/logo-casa-icon-new.png" 
            alt="Loba" 
            className="w-16 h-16 object-contain filter drop-shadow-[0_0_12px_rgba(212,175,55,0.6)]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://lovable-project.s3.amazonaws.com/loba-icon.png";
            }}
          />
        </div>
        <span className="text-[10px] uppercase tracking-[0.3em] font-black text-gold mt-3">A Loba</span>
        
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none overflow-visible">
          <circle cx="64" cy="64" r="70" fill="none" stroke="rgba(212,175,55,0.1)" strokeWidth="0.5" />
          <circle cx="64" cy="64" r="85" fill="none" stroke="rgba(212,175,55,0.05)" strokeWidth="0.5" />
        </svg>
      </motion.div>
      
      {TERRITORIOS.map((t, i) => {
        const angle = (i * 60 - 90) * (Math.PI / 180);
        const radius = 180;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const estado = estados[t.id] || 'Oscilante';

        const isAceso = estado === 'Aceso';
        const isSoterrado = estado === 'Soterrado' || estado === 'Exausto';

        return (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{ opacity: 1, x, y }}
            transition={{ delay: i * 0.15, duration: 1.2, ease: "circOut" }}
            className="absolute z-10"
          >
            <div className="flex flex-col items-center group relative">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className={cn(
                  "w-24 h-24 rounded-full flex flex-col items-center justify-center p-3 text-center transition-all duration-700 relative overflow-hidden",
                  "bg-midnight/40 border backdrop-blur-md",
                  isAceso ? "border-gold/60 shadow-[0_0_40px_rgba(212,175,55,0.3)]" : "border-white/10",
                  isSoterrado && "opacity-50 grayscale"
                )}
              >
                {/* Territory Icon with visual states */}
                <div className="relative z-10 flex flex-col items-center">
                  {t.id === 'corpo' && <span className={cn("text-2xl mb-1", isAceso ? "text-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]" : "text-white/40")}>❤️</span>}
                  {t.id === 'intuicao' && <span className={cn("text-2xl mb-1", isAceso ? "text-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]" : "text-white/40")}>🌙</span>}
                  {t.id === 'desejo' && <span className={cn("text-2xl mb-1", isAceso ? "text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]" : "text-white/40")}>🔥</span>}
                  {t.id === 'limites' && <span className={cn("text-2xl mb-1", isAceso ? "text-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]" : "text-white/40")}>🛡️</span>}
                  {t.id === 'criatividade' && <span className={cn("text-2xl mb-1", isAceso ? "text-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]" : "text-white/40")}>🌿</span>}
                  {t.id === 'vitalidade' && <span className={cn("text-2xl mb-1", isAceso ? "text-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]" : "text-white/40")}>🐾</span>}
                </div>
                
                <span className={cn(
                  "text-[8px] font-black uppercase tracking-[0.2em] relative z-10",
                  isAceso ? "text-gold" : "text-white/40"
                )}>{t.nome}</span>
                
                <span className={cn(
                  "text-[7px] uppercase tracking-[0.1em] font-black mt-1 relative z-10",
                  isAceso ? "text-gold/60" : "text-white/20"
                )}>• {estado}</span>
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

