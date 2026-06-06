import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatAudioTime } from '@/lib/audioUtils';
import { motion } from 'framer-motion';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

interface AudioRitualPlayerProps {
  audioUrl: string | null | undefined;
  titulo?: string;
  tipo?: string;
  funcao?: string;
  duracao?: string;
  className?: string;
}

export function AudioRitualPlayer({
  audioUrl,
  titulo,
  tipo,
  funcao,
  duracao,
  className,
}: AudioRitualPlayerProps) {
  const {
    audioRef,
    isPlaying,
    isLoading,
    progress,
    duration,
    hasError,
    resolvedUrl,
    isValid,
    togglePlay,
    handleSeek
  } = useAudioPlayer({ audioUrl });

  if (!isValid || !resolvedUrl || hasError) {
    return (
      <div className="p-12 text-center border border-white/5 rounded-[2.5rem] bg-white/[0.02] backdrop-blur-sm">
        <p className="text-white/20 text-sm italic font-serif">Escuta ainda não integrada ao mapa.</p>
      </div>
    );
  }


  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "relative flex flex-col items-center gap-8 py-10 border border-white/10 rounded-[2.5rem] bg-white/[0.03] backdrop-blur-md transition-all duration-500 hover:bg-white/[0.06] hover:border-gold/20 group", 
        className
      )}
    >
      <audio ref={audioRef} src={resolvedUrl} preload="metadata" />

      {/* Header do Áudio */}
      <div className="text-center space-y-2 z-10 w-full px-8">
        {tipo && (
          <div className="flex items-center justify-center gap-2">
            <span className="w-1 h-1 rounded-full bg-gold/40" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold/70 font-bold block">{tipo}</span>
            <span className="w-1 h-1 rounded-full bg-gold/40" />
          </div>
        )}
        {titulo && (
          <h3 className="font-display text-2xl text-white tracking-tight leading-tight group-hover:text-gold/90 transition-colors">
            {titulo}
          </h3>
        )}
        {funcao && <p className="text-[12px] text-white/40 italic font-serif max-w-[200px] mx-auto leading-relaxed">{funcao}</p>}
      </div>

      {/* Disco Mini */}
      <div className="relative">
        <motion.div
          animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={isPlaying ? { duration: 12, repeat: Infinity, ease: "linear" } : { duration: 0.8 }}
          className={cn(
            "relative w-40 h-40 rounded-full shadow-2xl overflow-hidden",
            "border-4 border-white/10 p-1 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 shadow-xl",
            isPlaying && "shadow-[0_0_40px_rgba(196,165,74,0.1)] border-gold/20"
          )}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold/40 via-gold/10 to-gold/40 border border-gold/40 flex items-center justify-center shadow-inner">
               <div className="w-2.5 h-2.5 rounded-full bg-black/80" />
            </div>
          </div>
        </motion.div>
        
        {/* Hover Play Icon Overlay */}
        {!isPlaying && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-gold/80 flex items-center justify-center">
              <Play className="w-6 h-6 text-midnight fill-midnight ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="w-full max-w-[260px] space-y-5 px-6">
        <div className="space-y-3">
          <Slider
            value={[progress]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
          />
          <div className="flex justify-between text-[10px] tabular-nums text-white/30 font-mono font-bold tracking-widest">
            <span>{formatAudioTime(progress)}</span>
            <span>{duracao || (duration > 0 ? formatAudioTime(duration) : '--:--')}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <button 
            onClick={togglePlay} 
            className="w-14 h-14 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center hover:bg-gold hover:text-midnight hover:border-transparent transition-all duration-300 shadow-lg group/btn"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-gold" />
            ) : isPlaying ? (
              <Pause className="w-6 h-6 text-gold group-hover/btn:text-midnight fill-current" />
            ) : (
              <Play className="w-6 h-6 text-gold group-hover/btn:text-midnight fill-current ml-1" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
