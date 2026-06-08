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
    <div className={cn("relative w-full max-w-6xl mx-auto py-16 md:py-24 px-6 overflow-hidden rounded-[3rem] shadow-3xl border border-white/5", className)}>
      {/* Background with Blur & Image */}
      <div className="absolute inset-0 z-0">
        {imagemEscuta ? (
          <img src={imagemEscuta} alt="" className="w-full h-full object-cover opacity-10 mix-blend-luminosity scale-110 blur-xl transition-opacity duration-1000" />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-[#020617] via-[#0A0A0B] to-[#020617]" />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)]" />
        <div className="absolute inset-0 backdrop-blur-[4px]" />
      </div>

      <audio ref={audioRef} src={resolvedUrl} preload="metadata" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Text Info */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-10 text-center lg:text-left"
        >
          <div className="space-y-4">
            <div className="flex flex-col lg:items-start items-center gap-2">
              <div className="p-4 rounded-2xl bg-gold/10 border border-gold/20 text-gold mb-4 shadow-inner">
                <Headphones className="w-6 h-6" />
              </div>
              <span className="text-[11px] uppercase tracking-[0.5em] text-gold/60 font-bold">{tipo || 'Escuta Ritual'}</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl text-white tracking-tighter leading-none">
              {titulo}
            </h2>
            {funcao && <p className="font-serif italic text-white/60 text-xl md:text-2xl leading-relaxed">{funcao}</p>}
          </div>

          {/* Desktop Controls (Progress only) */}
          <div className="hidden lg:block w-full max-w-md space-y-6">
            <div className="space-y-4">
              <Slider
                value={[progress]}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                className="py-4"
              />
              <div className="flex justify-between text-[12px] font-mono tracking-widest text-white/30 uppercase tabular-nums font-bold">
                <span>{formatAudioTime(progress)}</span>
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold/40 animate-pulse" />
                  <span>{duracao || (duration > 0 ? formatAudioTime(duration) : '--:--')}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Central Art & Big Play Button */}
        <div className="flex flex-col items-center justify-center space-y-12">
          <div className="relative group cursor-pointer" onClick={togglePlay}>
            {/* Visualizer Aura (Simulated) */}
            <motion.div 
              animate={isPlaying ? { scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] } : { scale: 1, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -inset-10 bg-gold/20 rounded-full blur-[60px] z-0"
            />

            <motion.div
              animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={isPlaying ? { duration: 15, repeat: Infinity, ease: "linear" } : { duration: 1.2, ease: "easeOut" }}
              className={cn(
                "w-72 h-72 md:w-[450px] md:h-[450px] rounded-full p-3 border-2 border-white/10 relative z-10",
                "bg-gradient-to-br from-zinc-900 via-black to-zinc-900 shadow-3xl overflow-hidden",
                isPlaying && "border-gold/30"
              )}
            >
              {/* Vinil Texture Effect */}
              <div className="absolute inset-0 rounded-full border border-white/5 opacity-40 pointer-events-none" style={{ 
                backgroundImage: 'repeating-radial-gradient(circle, transparent 0, transparent 3px, rgba(255,255,255,0.03) 3px, rgba(255,255,255,0.03) 6px)' 
              }} />
              
              <div className="w-full h-full rounded-full overflow-hidden relative">
                {imagemEscuta ? (
                    <img src={imagemEscuta} alt="" className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gold/10 to-transparent" />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70" />
              </div>

              {/* Centro do Disco */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-midnight/95 border border-gold/30 flex items-center justify-center shadow-inner">
                  <div className="w-4 h-4 rounded-full bg-gold/60" />
                </div>
              </div>
            </motion.div>

            {/* Float Play Button */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <motion.button 
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gold text-midnight flex items-center justify-center shadow-[0_0_50px_rgba(196,165,74,0.6)]"
              >
                {isLoading ? (
                  <Loader2 className="w-10 h-10 md:w-14 md:h-14 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-10 h-10 md:w-14 md:h-14 fill-current" />
                ) : (
                  <Play className="w-10 h-10 md:w-14 md:h-14 fill-current ml-2" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile Only Controls */}
          <div className="lg:hidden w-full max-w-sm space-y-4">
            <Slider
              value={[progress]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="py-4"
            />
            <div className="flex justify-between text-[10px] font-mono tracking-widest text-white/40 uppercase font-bold">
              <span>{formatAudioTime(progress)}</span>
              <span>{duracao || (duration > 0 ? formatAudioTime(duration) : '--:--')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
