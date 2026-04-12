import { Headphones, Clock, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ClubeAudioCardImersivoProps {
  id: string;
  titulo: string;
  descricao?: string;
  capaUrl?: string | null;
  duracaoSegundos?: number;
  concluido?: boolean;
  onClick: () => void;
  index?: number;
}

export function ClubeAudioCardImersivo({
  titulo,
  descricao,
  capaUrl,
  duracaoSegundos,
  concluido,
  onClick,
  index = 0,
}: ClubeAudioCardImersivoProps) {
  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
    >
      <button
        onClick={onClick}
        className={cn(
          "group relative w-full text-left rounded-2xl overflow-hidden",
          "bg-card/40 backdrop-blur-sm border border-border/30",
          "hover:border-gold/30 hover:bg-card/60",
          "transition-all duration-500 ease-out",
          "focus:outline-none focus:ring-1 focus:ring-gold/20"
        )}
      >
        <div className="flex items-center gap-4 p-4 md:p-5">
          {/* Cover / Mandala */}
          <div className={cn(
            "relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0",
            "bg-gradient-to-br from-gold/10 via-background to-mystic/10",
            "border border-gold/10",
            "group-hover:border-gold/25 transition-colors duration-500"
          )}>
            {capaUrl ? (
              <img src={capaUrl} alt={titulo} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gold/20 flex items-center justify-center"
                >
                  <Headphones className="w-4 h-4 md:w-5 md:h-5 text-gold/50" />
                </motion.div>
              </div>
            )}
            {/* Play overlay on hover */}
            <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Play className="w-6 h-6 text-gold fill-gold/20" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <h3 className={cn(
              "font-display text-sm md:text-base text-foreground leading-tight",
              "group-hover:text-gold transition-colors duration-300",
              "line-clamp-2"
            )}>
              {titulo}
            </h3>
            {descricao && (
              <p className="text-xs text-muted-foreground/60 line-clamp-1">{descricao}</p>
            )}
            <div className="flex items-center gap-3">
              {duracaoSegundos && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground/50 uppercase tracking-wider">
                  <Clock className="w-3 h-3" />
                  {formatDuration(duracaoSegundos)}
                </span>
              )}
              {concluido && (
                <span className="text-[10px] text-emerald-400/70 uppercase tracking-wider">
                  ✦ ouvido
                </span>
              )}
            </div>
          </div>

          {/* Subtle arrow */}
          <div className="flex-shrink-0 text-muted-foreground/20 group-hover:text-gold/40 transition-colors duration-300">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Bottom glow line on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/0 to-transparent group-hover:via-gold/30 transition-all duration-700" />
      </button>
    </motion.div>
  );
}
