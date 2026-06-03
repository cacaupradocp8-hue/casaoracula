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
      <div className="p-8 text-center border border-white/5 rounded-3xl bg-white/[0.02] backdrop-blur-sm">
        <p className="text-muted-foreground text-sm italic">Áudio ainda não vinculado.</p>
      </div>
    );
  }


  return (
    <div className={cn("relative flex flex-col items-center gap-6 py-6 border border-white/5 rounded-[2rem] bg-white/[0.02] backdrop-blur-sm", className)}>
      <audio ref={audioRef} src={resolvedUrl} preload="metadata" />

      {/* Header do Áudio */}
      <div className="text-center space-y-1 z-10 w-full px-6">
        {tipo && <span className="text-[9px] uppercase tracking-[0.2em] text-gold/60 font-bold block">{tipo}</span>}
        {titulo && (
          <h3 className="font-display text-lg text-foreground tracking-tight">
            {titulo}
          </h3>
        )}
        {funcao && <p className="text-[11px] text-white/40 italic font-serif">{funcao}</p>}
      </div>

      {/* Disco */}
      <div className="relative">
        <motion.div
          animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={isPlaying ? { duration: 14, repeat: Infinity, ease: "linear" } : { duration: 0.5 }}
          className={cn(
            "relative w-32 h-32 rounded-full shadow-2xl overflow-hidden",
            "border-4 border-white/10 p-1 bg-gradient-to-br from-zinc-900 via-black to-zinc-900",
            isPlaying && "shadow-[0_0_50px_rgba(196,165,74,0.15)]"
          )}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/30 via-gold/10 to-gold/30 border border-gold/40 flex items-center justify-center">
               <div className="w-2 h-2 rounded-full bg-black" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Controles */}
      <div className="w-full max-w-[240px] space-y-4 px-4">
        <Slider
          value={[progress]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
        />
        <div className="flex justify-between text-[9px] tabular-nums text-foreground/40 font-mono">
          <span>{formatAudioTime(progress)}</span>
          <span>{duracao || (duration > 0 ? formatAudioTime(duration) : '--:--')}</span>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center hover:bg-gold/20 transition-all">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-gold" /> : isPlaying ? <Pause className="w-5 h-5 text-gold fill-gold" /> : <Play className="w-5 h-5 text-gold fill-gold ml-1" />}
          </button>
        </div>
      </div>
    </div>
  );
}
