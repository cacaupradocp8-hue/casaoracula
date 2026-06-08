import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Headphones, Play, Pause, Loader2, RotateCcw, RotateCw } from 'lucide-react';
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

  const skipForward = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 15, duration);
    }
  }, [duration]);

  const skipBackward = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 15, 0);
    }
  }, []);

  if (!resolvedUrl || hasError) return null;

  return (
    <div className={cn("relative w-full max-w-2xl mx-auto py-8 px-4", className)}>
      <audio ref={audioRef} src={resolvedUrl} preload="metadata" />

      <div className="flex flex-col items-center space-y-10">
        {/* Vinyl Record */}
        <div className="relative group cursor-pointer" onClick={togglePlay}>
          {/* External Golden Glow */}
          <div className="absolute -inset-4 bg-gold/20 rounded-full blur-[40px] z-0 opacity-50 group-hover:opacity-70 transition-opacity" />
          
          <motion.div
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={isPlaying ? { duration: 15, repeat: Infinity, ease: "linear" } : { duration: 1.2, ease: "easeOut" }}
            className={cn(
              "w-64 h-64 md:w-80 md:h-80 rounded-full p-1 relative z-10",
              "bg-[#0a0a0a] shadow-[0_0_60px_rgba(0,0,0,0.8),0_0_20px_rgba(212,175,55,0.2)] overflow-hidden",
              "border-[6px] border-[#1a1a1a]"
            )}
          >
            {/* Vinil Texture Effect */}
            <div className="absolute inset-0 rounded-full pointer-events-none z-20" style={{ 
              backgroundImage: 'repeating-radial-gradient(circle, transparent 0, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)' 
            }} />
            
            {/* Golden Rim Internal */}
            <div className="absolute inset-[2px] rounded-full border border-gold/30 z-20 pointer-events-none opacity-50" />

            <div className="w-full h-full rounded-full overflow-hidden relative bg-zinc-900">
              {/* Shine/Reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/10 z-10 pointer-events-none" />
              
              {/* The Central Art (Station Image) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[45%] h-[45%] rounded-full overflow-hidden border-2 border-gold/40 z-30 bg-[#020617] relative">
                  {imagemEscuta ? (
                    <img 
                      src={imagemEscuta} 
                      alt="" 
                      className="w-full h-full object-cover opacity-80"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gold/20 to-transparent flex items-center justify-center">
                      <Headphones className="w-8 h-8 text-gold/40" />
                    </div>
                  )}
                  {/* Inner Hole */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-[#020617] border border-gold/20 shadow-inner z-40" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Playback Status */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2 text-gold/60 text-[10px] uppercase tracking-[0.3em] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            Reproduzindo Agora
          </div>
          <h3 className="text-white font-serif italic text-lg opacity-80">{titulo || "Travessia guiada em áudio"}</h3>
        </div>

        {/* Progress Slider */}
        <div className="w-full max-w-md space-y-2 px-4">
          <Slider
            value={[progress]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="py-2"
          />
          <div className="flex justify-between text-[10px] font-mono tracking-widest text-white/30 uppercase tabular-nums font-bold">
            <span>{formatAudioTime(progress)}</span>
            <span>{duracao || (duration > 0 ? formatAudioTime(duration) : '--:--')}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 md:gap-10">
          <button 
            onClick={skipBackward}
            className="text-white/40 hover:text-gold transition-colors"
          >
            <RotateCcw className="w-6 h-6" />
            <span className="text-[8px] block mt-1">15</span>
          </button>

          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlay}
            className="w-20 h-20 rounded-full bg-transparent border-2 border-gold/40 text-gold flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.1)] group hover:border-gold hover:bg-gold/5 transition-all"
          >
            {isLoading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
          </motion.button>

          <button 
            onClick={skipForward}
            className="text-white/40 hover:text-gold transition-colors"
          >
            <RotateCw className="w-6 h-6" />
            <span className="text-[8px] block mt-1">15</span>
          </button>
        </div>

        {/* Info Card */}
        <div className="w-full max-w-sm bg-gold/5 border border-gold/10 rounded-2xl p-6 flex gap-4 items-start">
          <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </div>
          <div className="space-y-1">
            <h4 className="text-gold text-[10px] uppercase tracking-[0.2em] font-bold">Orientação da Casa</h4>
            <p className="text-white/60 text-xs font-serif leading-relaxed italic">
              Ouça primeiro o áudio da estação. Depois, siga para a leitura simbólica e registre sua percepção no Jardim.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

