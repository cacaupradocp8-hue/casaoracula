import React from 'react';
import { motion } from 'framer-motion';
import { Headphones, Play, Pause, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatAudioTime } from '@/lib/audioUtils';
import { Slider } from '@/components/ui/slider';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

interface EscutaPremiumProps {
  audioUrl: string | null | undefined;
  titulo?: string;
  tipo?: string;
  funcao?: string;
  duracao?: string;
  imagemEscuta?: string;
  className?: string;
}

export function EscutaPremium({
  audioUrl,
  titulo,
  tipo,
  funcao,
  duracao,
  imagemEscuta,
  className,
}: EscutaPremiumProps) {
  const {
    audioRef,
    isPlaying,
    isLoading,
    progress,
    duration,
    hasError,
    resolvedUrl,
    togglePlay,
    handleSeek
  } = useAudioPlayer({ audioUrl });

  if (!resolvedUrl || hasError) return null;


  return (
    <div className={cn("relative w-full max-w-5xl mx-auto py-20 px-6 overflow-hidden rounded-[3rem]", className)}>
      {/* Background with Blur & Image */}
      <div className="absolute inset-0 z-0">
        {imagemEscuta ? (
          <img src={imagemEscuta} alt="" className="w-full h-full object-cover opacity-20 mix-blend-luminosity scale-110" />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-midnight via-midnight/90 to-midnight" />
        )}
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-midnight/80" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      <audio ref={audioRef} src={resolvedUrl} preload="metadata" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-12">
        {/* Header imersivo */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-full bg-gold/5 border border-gold/10 text-gold mb-2">
              <Headphones className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold/60 font-bold">{tipo || 'Escuta Ritual'}</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-white tracking-tighter max-w-3xl mx-auto">
            {titulo}
          </h2>
          {funcao && <p className="font-serif italic text-white/40 text-lg max-w-xl mx-auto leading-relaxed">{funcao}</p>}
        </motion.div>

        {/* Arte Central */}
        <div className="relative group cursor-pointer" onClick={togglePlay}>
          <motion.div
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={isPlaying ? { duration: 20, repeat: Infinity, ease: "linear" } : { duration: 0.8 }}
            className={cn(
              "w-64 h-64 md:w-80 md:h-80 rounded-full p-2 border border-white/10 relative",
              "bg-gradient-to-br from-zinc-900 via-black to-zinc-900 shadow-2xl",
              isPlaying && "shadow-[0_0_80px_rgba(196,165,74,0.1)]"
            )}
          >
            {/* Vinil Texture Effect */}
            <div className="absolute inset-0 rounded-full border border-white/5 opacity-50" style={{ 
              backgroundImage: 'repeating-radial-gradient(circle, transparent 0, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)' 
            }} />
            
            <div className="w-full h-full rounded-full overflow-hidden relative">
               {imagemEscuta ? (
                  <img src={imagemEscuta} alt="" className="w-full h-full object-cover opacity-60" />
               ) : (
                 <div className="w-full h-full bg-gold/5" />
               )}
               <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
            </div>

            {/* Centro */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-midnight/90 border border-gold/30 flex items-center justify-center shadow-inner">
                <div className="w-3 h-3 rounded-full bg-gold/40" />
              </div>
            </div>
          </motion.div>

          {/* Botão flutuante Play/Pause */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-20 h-20 rounded-full bg-gold/90 text-black flex items-center justify-center shadow-[0_0_30px_rgba(196,165,74,0.4)] backdrop-blur-md"
            >
              {isLoading ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-8 h-8 fill-current" />
              ) : (
                <Play className="w-8 h-8 fill-current ml-1" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Controles de Progresso */}
        <div className="w-full max-w-xl space-y-6">
          <div className="space-y-2">
            <Slider
              value={[progress]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="py-4"
            />
            <div className="flex justify-between text-[11px] font-mono tracking-widest text-white/40 uppercase tabular-nums">
              <span>{formatAudioTime(progress)}</span>
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-gold/30" />
                <span>{duracao || (duration > 0 ? formatAudioTime(duration) : '--:--')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
