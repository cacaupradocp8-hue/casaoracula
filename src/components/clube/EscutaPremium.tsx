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
}

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export function EscutaPremium({
  audioUrl,
  titulo,
  tipo,
  funcao,
  duracao,
  imagemEscuta,
  className,
}: EscutaPremiumProps) {
  const [playbackRate, setPlaybackRate] = useState(1);
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
          {/* External Golden Glow */}
          <div className="absolute -inset-8 bg-gold/10 rounded-full blur-[60px] z-0 opacity-40 group-hover:opacity-60 transition-opacity" />
          
          <motion.div
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={isPlaying ? { duration: 15, repeat: Infinity, ease: "linear" } : { duration: 1.2, ease: "easeOut" }}
            className={cn(
              "w-64 h-64 md:w-[22rem] md:h-[22rem] rounded-full p-1 relative z-10",
              "bg-[#0a0a0a] shadow-[0_0_80px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.15)] overflow-hidden",
              "border-[8px] border-[#1a1a1a]"
            )}
          >
            {/* Vinil Texture Effect - Fine lines */}
            <div className="absolute inset-0 rounded-full pointer-events-none z-20 opacity-30" style={{ 
              backgroundImage: 'repeating-radial-gradient(circle, transparent 0, transparent 1px, rgba(255,255,255,0.05) 1px, rgba(255,255,255,0.05) 2px)' 
            }} />
            
            {/* Golden Rim Internal - Dynamic reflection */}
            <div className="absolute inset-0 rounded-full border-[1px] border-gold/40 z-20 pointer-events-none shadow-[inset_0_0_20px_rgba(212,175,55,0.2)]" />
            <div className="absolute inset-2 rounded-full border-[0.5px] border-white/5 z-20 pointer-events-none" />

            <div className="w-full h-full rounded-full overflow-hidden relative bg-zinc-950">
              {/* Shine/Reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/10 z-10 pointer-events-none" />
              
              {/* The Central Art (Station Image) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[48%] h-[48%] rounded-full overflow-hidden border border-gold/30 z-30 bg-[#020617] relative shadow-2xl">
                  {imagemEscuta ? (
                    <img 
                      src={imagemEscuta} 
                      alt="" 
                      className="w-full h-full object-cover opacity-90 scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gold/20 to-[#020617] flex items-center justify-center">
                      <Headphones className="w-8 h-8 text-gold/30" />
                    </div>
                  )}
                  {/* Inner Hole - Subtle and Deep (No white spot) */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-black border border-white/5 shadow-inner z-40" />
                    {/* Removed the central dot that was appearing as a white spot */}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Playback Status */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-gold/60 text-[10px] uppercase tracking-[0.4em] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
            REPRODUZINDO AGORA
          </div>
          <h3 className="text-white font-serif italic text-xl md:text-2xl opacity-90 leading-tight">
            {titulo || "Travessia guiada em áudio"}
          </h3>
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
                <button className="flex items-center gap-2 text-white/40 hover:text-gold transition-colors px-3 py-1 rounded-full border border-white/10">
                  <Gauge className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{playbackRate}x</span>
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

        {/* Info Card - Matching the image exactly */}
        <div className="w-full max-w-sm bg-gradient-to-b from-white/10 to-transparent border border-white/10 rounded-2xl p-6 flex gap-5 items-start backdrop-blur-md shadow-2xl">
          <div className="w-14 h-14 rounded-xl border border-gold/30 flex items-center justify-center shrink-0 bg-[#020617]/40 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gold/5 animate-pulse" />
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gold/70 z-10">
              <path d="M20 5V10M20 30V35M5 20H10M30 20H35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M10 10L14 14M26 26L30 30M30 10L26 14M14 26L10 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M8 20C8 13.3726 13.3726 8 20 8C26.6274 8 32 13.3726 32 20C32 26.6274 26.6274 32 20 32C13.3726 32 8 26.6274 8 20Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M20 15V20H25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="space-y-1.5 pt-1">
            <h4 className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold flex items-center gap-2">
              ORIENTAÇÃO DA CASA
              <span className="w-10 h-px bg-gold/30" />
            </h4>
            <p className="text-white/80 text-xs font-serif leading-relaxed italic">
              Ouça primeiro o áudio da estação. Depois, siga para a leitura simbólica e registre sua percepção no Jardim.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

