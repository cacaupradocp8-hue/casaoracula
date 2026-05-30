import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Headphones, Loader2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatAudioTime, getPublicAudioUrl, isValidAudioUrl } from '@/lib/audioUtils';
import { motion, AnimatePresence } from 'framer-motion';

interface AudioRitualPlayerProps {
  audioUrl: string | null | undefined;
  titulo?: string;
  className?: string;
}

export function AudioRitualPlayer({
  audioUrl,
  titulo,
  className,
}: AudioRitualPlayerProps) {
  const resolvedUrl = getPublicAudioUrl(audioUrl);
  const isValid = isValidAudioUrl(resolvedUrl);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onCanPlay = () => setIsLoading(false);
    const onLoadStart = () => setIsLoading(true);
    const onMeta = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const onTime = () => setProgress(audio.currentTime);
    const onEnded = () => setIsPlaying(false);
    const onError = () => {
      setIsLoading(false);
      setHasError(true);
    };

    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('loadstart', onLoadStart);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('loadstart', onLoadStart);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (e) {
        console.error("Erro ao reproduzir áudio:", e);
      }
    }
  }, [isPlaying]);

  const handleSeek = useCallback((v: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = v[0];
    setProgress(v[0]);
  }, []);

  if (!isValid || !resolvedUrl || hasError) {
    return (
      <div className="p-8 text-center border border-white/5 rounded-3xl bg-white/[0.02] backdrop-blur-sm">
        <p className="text-muted-foreground text-sm italic">Não foi possível carregar esta escuta ritualística.</p>
      </div>
    );
  }

  return (
    <div className={cn("relative flex flex-col items-center gap-10 py-8", className)}>
      <audio ref={audioRef} src={resolvedUrl} preload="metadata" />

      {/* Título da Obra */}
      {titulo && (
        <div className="text-center space-y-2 z-10">
          <h3 className="font-display text-2xl md:text-3xl text-foreground tracking-tight max-w-md mx-auto">
            {titulo}
          </h3>
          <div className="flex items-center justify-center gap-2 text-gold/60 text-[10px] tracking-[0.2em] uppercase">
            <span className="w-8 h-px bg-gold/20" />
            Escuta Ritualística
            <span className="w-8 h-px bg-gold/20" />
          </div>
        </div>
      )}

      {/* Disco de Vinil */}
      <div className="relative group">
        {/* Halo Luminoso Dourado */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: [0.3, 0.6, 0.3], 
                scale: [1, 1.1, 1],
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute inset-0 rounded-full blur-[60px]"
              style={{
                background: 'radial-gradient(circle, hsl(var(--gold) / 0.4) 0%, transparent 70%)'
              }}
            />
          )}
        </AnimatePresence>

        {/* O Disco */}
        <motion.div
          animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={isPlaying ? { duration: 14, repeat: Infinity, ease: "linear" } : { duration: 0.5 }}
          className={cn(
            "relative w-48 h-48 md:w-64 md:h-64 rounded-full shadow-2xl overflow-hidden",
            "border-4 border-white/10 p-1",
            "bg-gradient-to-br from-zinc-900 via-black to-zinc-900",
            isPlaying && "shadow-[0_0_50px_rgba(196,165,74,0.15)]"
          )}
        >
          {/* Sulcos do Vinil (CSS Rings) */}
          <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-40 pointer-events-none">
             {[...Array(8)].map((_, i) => (
               <div 
                 key={i} 
                 className="absolute rounded-full border border-white/5" 
                 style={{ width: `${(i + 1) * 12.5}%`, height: `${(i + 1) * 12.5}%` }}
               />
             ))}
          </div>

          {/* Brilho do Vinil (Reflexo) */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none rotate-45" />

          {/* Centro do Disco (Label) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-gold/30 via-gold/10 to-gold/30 border border-gold/40 flex items-center justify-center shadow-inner relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
               {/* Centro Central (Furo) */}
               <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-black shadow-inner z-20" />
               <Headphones className="absolute w-6 h-6 md:w-8 md:h-8 text-gold/40 z-10 animate-pulse" />
               
               {/* Decorative rotation for label */}
               <div className="absolute inset-0 opacity-20 border-2 border-dashed border-gold/40 rounded-full animate-[spin_20s_linear_infinite]" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Controles de Áudio */}
      <div className="w-full max-w-sm space-y-6 z-10 px-4">
        {/* Barra de Progresso */}
        <div className="space-y-2">
          <Slider
            value={[progress]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-[10px] tabular-nums font-body text-foreground/40 tracking-wider">
            <span>{formatAudioTime(progress)}</span>
            <span>{duration > 0 ? formatAudioTime(duration) : '--:--'}</span>
          </div>
        </div>

        {/* Botões Centrais */}
        <div className="flex items-center justify-center gap-8">
          <button 
            onClick={() => { if(audioRef.current) audioRef.current.currentTime -= 10 }}
            className="p-2 text-foreground/30 hover:text-gold/60 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlay}
            disabled={isLoading}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500",
              "bg-gold/10 border border-gold/20 text-gold hover:bg-gold/20 hover:border-gold/40 shadow-gold/10",
              isPlaying && "shadow-[0_0_30px_rgba(196,165,74,0.2)] scale-110",
              "active:scale-95"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-6 h-6 fill-gold/20" />
            ) : (
              <Play className="w-6 h-6 ml-1 fill-gold/20" />
            )}
          </button>

          <div className="w-9" /> {/* Spacer for symmetry */}
        </div>
      </div>
    </div>
  );
}
