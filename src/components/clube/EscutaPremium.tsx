import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Headphones, Play, Pause, Loader2, RotateCcw, RotateCw, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatAudioTime } from '@/lib/audioUtils';
import { Slider } from '@/components/ui/slider';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EscutaPremiumProps {
  audioUrl: string | null | undefined;
  titulo?: string;
  tipo?: string;
  funcao?: string;
  duracao?: string;
  imagemEscuta?: string;
  className?: string;
  autoPlay?: boolean;
  onEnded?: () => void;
}

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const DISCO_CASA_ORACULA_URL = "/__l5e/assets-v1/6890f537-199d-46e1-9f3c-0c52f74c483f/disco-vinil-premium.png";

export function EscutaPremium({
  audioUrl,
  titulo,
  tipo,
  funcao,
  duracao,
  imagemEscuta,
  className,
  autoPlay,
  onEnded,
}: EscutaPremiumProps) {
  const [playbackRate, setPlaybackRate] = useState(1);
  const discoImageUrl = imagemEscuta || DISCO_CASA_ORACULA_URL;
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

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !onEnded) return;
    audio.addEventListener('ended', onEnded);
    return () => audio.removeEventListener('ended', onEnded);
  }, [onEnded, resolvedUrl]);

  React.useEffect(() => {
    if (!autoPlay || !resolvedUrl) return;
    const audio = audioRef.current;
    if (!audio) return;
    const tryPlay = () => audio.play().catch(() => {});
    if (audio.readyState >= 2) tryPlay();
    else audio.addEventListener('loadeddata', tryPlay, { once: true });
    return () => audio.removeEventListener('loadeddata', tryPlay);
  }, [autoPlay, resolvedUrl]);

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

  const changePlaybackRate = useCallback((rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  }, []);

  if (!audioUrl) return null;

  // Handle Spotify Embed
  if (audioUrl.includes('spotify.com')) {
    let embedUrl = audioUrl;
    if (!audioUrl.includes('/embed/')) {
      embedUrl = audioUrl.replace('open.spotify.com/', 'open.spotify.com/embed/');
    }

    return (
      <div className={cn("w-full max-w-2xl mx-auto py-8 px-4", className)}>
        <iframe
          style={{ borderRadius: '12px' }}
          src={embedUrl}
          width="100%"
          height="352"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="shadow-2xl"
        ></iframe>
      </div>
    );
  }

  if (!resolvedUrl || hasError) return null;

  return (
    <div className={cn("relative w-full max-w-2xl mx-auto py-8 px-4", className)}>
      <audio ref={audioRef} src={resolvedUrl} preload="metadata" />

      <div className="flex flex-col items-center space-y-8">
        {/* Vinyl Record */}
        <div className="relative group cursor-pointer" onClick={togglePlay}>
          {/* Anel luminoso sutil — destaca o disco do fundo escuro */}
          <div className="absolute -inset-2 rounded-full ring-1 ring-gold/25 shadow-[0_0_30px_rgba(212,175,55,0.18)] pointer-events-none z-0" />
          <div className="absolute -inset-8 rounded-full bg-gold/5 blur-2xl pointer-events-none z-0" />
          
          <motion.div
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={isPlaying ? { duration: 15, repeat: Infinity, ease: "linear" } : { duration: 1.2, ease: "easeOut" }}
            className={cn(
              "w-44 h-44 xs:w-52 xs:h-52 sm:w-64 sm:h-64 md:w-[26rem] md:h-[26rem] rounded-full p-1 relative z-10",
              "bg-[#0a0a0a] shadow-[0_0_80px_rgba(0,0,0,0.8),0_0_40px_rgba(212,175,55,0.3)] md:shadow-[0_0_120px_rgba(0,0,0,1),0_0_60px_rgba(212,175,55,0.4)] overflow-hidden",
              "border-[6px] xs:border-[8px] md:border-[12px] border-[#1a1a1a] ring-1 md:ring-2 ring-gold/20"
            )}

          >

            <img
              src={discoImageUrl}
              alt=""
              className="absolute inset-0 w-full h-full rounded-full object-cover z-0"
            />
            <div className="absolute inset-0 rounded-full bg-black/10 z-10 pointer-events-none" />
            
            {/* Vinil Texture Effect - Fine lines */}
            <div className="absolute inset-0 rounded-full pointer-events-none z-20 opacity-15" style={{ 
              backgroundImage: 'repeating-radial-gradient(circle, transparent 0, transparent 2px, rgba(255,255,255,0.04) 2px, rgba(255,255,255,0.04) 3px)' 
            }} />
            
            {/* Golden Rim Internal - Dynamic reflection */}
            <div className="absolute inset-0 rounded-full border-[1px] border-gold/40 z-20 pointer-events-none shadow-[inset_0_0_20px_rgba(212,175,55,0.2)]" />
            <div className="absolute inset-2 rounded-full border-[0.5px] border-white/5 z-20 pointer-events-none" />

            <div className="w-full h-full rounded-full overflow-hidden relative flex items-center justify-center">
              {/* Shine/Reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 z-10 pointer-events-none" />
              <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,rgba(212,175,55,0.1),transparent)] z-10 pointer-events-none animate-[spin_10s_linear_infinite]" />

              {/* Inner Hole - Integrated into the disk */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                <div className="w-4 h-4 rounded-full bg-[#1a1a1a] border border-gold/40 shadow-[inset_0_0_4px_rgba(212,175,55,0.3)] relative flex items-center justify-center">
                  {/* Inner dot removed as per user request */}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Playback Status */}
        <div className="text-center space-y-4 pt-6">
          <div className="flex items-center justify-center gap-2 md:gap-4 text-gold text-[8px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.5em] font-black">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gold animate-ping shadow-[0_0_12px_rgba(212,175,55,1)]" />
            REPRODUZINDO AGORA
          </div>

          {titulo && (
            <h3 className="text-white font-display font-black tracking-widest text-3xl md:text-5xl uppercase opacity-95 leading-tight bg-gradient-to-b from-white to-gold/60 bg-clip-text text-transparent">
              {titulo}
            </h3>
          )}

        </div>

        {/* Progress Slider */}
        <div className="w-full max-w-md space-y-3 px-6">
          <Slider
            value={[progress]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="py-2 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono tracking-widest text-white/40 uppercase tabular-nums">
            <span>{formatAudioTime(progress)}</span>
            <span>{duracao || (duration > 0 ? formatAudioTime(duration) : '--:--')}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 md:gap-10 w-full max-w-md relative">
          <div className="absolute left-0 -translate-x-full pr-4 hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex flex-col items-center gap-1 text-white/40 hover:text-gold transition-colors">
                  <Gauge className="w-5 h-5" />
                  <span className="text-[8px] font-bold">{playbackRate}x</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="bg-[#0a0a0a] border-white/10 text-white min-w-[80px]">
                {PLAYBACK_SPEEDS.map((speed) => (
                  <DropdownMenuItem 
                    key={speed}
                    onClick={() => changePlaybackRate(speed)}
                    className={cn(
                      "text-xs justify-center hover:bg-gold/10 hover:text-gold cursor-pointer",
                      playbackRate === speed && "text-gold bg-gold/5"
                    )}
                  >
                    {speed}x
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <button 
            onClick={skipBackward}
            className="text-white/50 hover:text-gold transition-all hover:scale-110 active:scale-90"
            title="Voltar 15s"
          >
            <div className="relative">
              <RotateCcw className="w-7 h-7" />
              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold mt-0.5">15</span>
            </div>
          </button>

          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(212,175,55,0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlay}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-all border border-white/10 shadow-lg",
              "bg-white/5 text-gold/80 hover:bg-white/10 hover:border-gold/30"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-7 h-7 fill-current" />
            ) : (
              <Play className="w-7 h-7 fill-current ml-1" />
            )}
          </motion.button>

          <button 
            onClick={skipForward}
            className="text-white/50 hover:text-gold transition-all hover:scale-110 active:scale-90"
            title="Avançar 15s"
          >
            <div className="relative">
              <RotateCw className="w-7 h-7" />
              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold mt-0.5">15</span>
            </div>
          </button>

          <div className="md:hidden mt-4">
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 text-white/40 hover:text-gold transition-colors px-2.5 py-1 rounded-full border border-white/10 whitespace-nowrap shrink-0">
                  <Gauge className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider leading-none">{playbackRate}x</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="bg-[#0a0a0a] border-white/10 text-white min-w-[80px]">
                {PLAYBACK_SPEEDS.map((speed) => (
                  <DropdownMenuItem 
                    key={speed}
                    onClick={() => changePlaybackRate(speed)}
                    className={cn(
                      "text-xs justify-center hover:bg-gold/10 hover:text-gold cursor-pointer",
                      playbackRate === speed && "text-gold bg-gold/5"
                    )}
                  >
                    {speed}x
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

      </div>
    </div>
  );
}

