import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Play, Pause, Volume2, VolumeX, Loader2,
  BookOpen, Briefcase, Users, Maximize2, X, Minimize2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SoundWaveVisualizer } from './SoundWaveVisualizer';
import { formatAudioTime } from '@/lib/audioUtils';
import { getPublicAudioUrl, isValidAudioUrl } from '@/lib/audioUtils';
import { motion, AnimatePresence } from 'framer-motion';

type PlayerPhase = 'ritual' | 'playing' | 'insight';

interface AudioOracularProps {
  audioUrl: string | null | undefined;
  titulo?: string;
  subtitulo?: string;
  className?: string;
  onSaveInsight?: (texto: string, destino: 'psique' | 'oficio' | 'comunidade') => void;
  hideInsight?: boolean;
  compact?: boolean;
}

export function AudioOracular({
  audioUrl,
  titulo,
  subtitulo,
  className,
  onSaveInsight,
  hideInsight = false,
  compact = false,
}: AudioOracularProps) {
  const resolvedUrl = getPublicAudioUrl(audioUrl);
  const isValid = isValidAudioUrl(resolvedUrl);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [phase, setPhase] = useState<PlayerPhase>(compact ? 'playing' : 'ritual');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [insightText, setInsightText] = useState('');
  const [insightSaved, setInsightSaved] = useState(false);
  const [isImmersive, setIsImmersive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setBreathPhase(prev => prev === 'inhale' ? 'exhale' : 'inhale');
    }, 3000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onCanPlay = () => setIsLoading(false);
    const onLoadStart = () => setIsLoading(true);
    const onMeta = () => { setDuration(audio.duration); setIsLoading(false); };
    const onTime = () => setProgress(audio.currentTime);
    const onEnded = () => {
      setIsPlaying(false);
      if (!hideInsight) setPhase('insight');
      if (isImmersive && hideInsight) setIsImmersive(false);
    };
    const onError = () => setIsLoading(false);
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
  }, [hideInsight, isImmersive]);

  useEffect(() => {
    if (isImmersive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isImmersive]);

  const startRitual = useCallback(() => {
    setPhase('playing');
    setTimeout(() => {
      audioRef.current?.play().then(() => setIsPlaying(true)).catch(console.error);
    }, 600);
  }, []);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else { try { await audio.play(); setIsPlaying(true); } catch (e) { console.error(e); } }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleSeek = useCallback((v: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = v[0];
    setProgress(v[0]);
  }, []);

  const handleSaveInsight = useCallback((destino: 'psique' | 'oficio' | 'comunidade') => {
    if (!insightText.trim()) return;
    onSaveInsight?.(insightText.trim(), destino);
    setInsightSaved(true);
    setTimeout(() => setInsightSaved(false), 3000);
  }, [insightText, onSaveInsight]);

  const enterImmersive = useCallback(() => {
    setIsImmersive(true);
    if (phase === 'ritual') startRitual();
  }, [phase, startRitual]);

  const exitImmersive = useCallback(() => { setIsImmersive(false); }, []);

  if (!isValid || !resolvedUrl) return null;

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  // ── Refined Orb ──
  const OrbBackground = ({ scale = 1 }: { scale?: number }) => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <motion.div
        animate={{
          scale: isPlaying ? (breathPhase === 'inhale' ? 1.15 * scale : 0.95 * scale) : 0.9 * scale,
          opacity: isPlaying ? (breathPhase === 'inhale' ? 0.4 : 0.2) : 0.1,
        }}
        transition={{ duration: 3, ease: 'easeInOut' }}
        className="rounded-full blur-3xl"
        style={{
          width: `${16 * scale}rem`,
          height: `${16 * scale}rem`,
          background: 'radial-gradient(circle, hsl(var(--gold) / 0.2) 0%, hsl(var(--mystic) / 0.08) 60%, transparent 100%)',
        }}
      />
      {/* Inner ring */}
      <motion.div
        animate={{
          scale: isPlaying ? (breathPhase === 'exhale' ? 1.08 : 0.96) : 0.94,
          opacity: isPlaying ? 0.3 : 0.08,
        }}
        transition={{ duration: 3, ease: 'easeInOut' }}
        className="absolute rounded-full border border-gold/10"
        style={{ width: `${8 * scale}rem`, height: `${8 * scale}rem` }}
      />
    </div>
  );

  // ── Player Controls ──
  const PlayerControls = ({ immersive = false }: { immersive?: boolean }) => (
    <div className={cn(
      "flex flex-col items-center gap-5",
      immersive ? "max-w-md mx-auto w-full px-6" : "w-full"
    )}>
      {/* Title */}
      {titulo && (
        <div className="text-center space-y-1">
          <h3 className={cn(
            "font-display text-foreground tracking-wide leading-tight",
            immersive ? "text-xl md:text-2xl" : "text-base"
          )}>
            {titulo}
          </h3>
          {subtitulo && (
            <p className={cn(
              "text-muted-foreground italic",
              immersive ? "text-sm" : "text-xs"
            )}>
              {subtitulo}
            </p>
          )}
        </div>
      )}

      {/* Breathing cue */}
      <AnimatePresence>
        {isPlaying && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 0.5, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-[10px] tracking-[0.35em] uppercase text-gold/40 select-none"
          >
            {breathPhase === 'inhale' ? '· inspire ·' : '· expire ·'}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Sound wave */}
      <SoundWaveVisualizer
        isPlaying={isPlaying}
        className={cn(immersive ? "h-16 md:h-20" : "h-10")}
      />

      {/* Progress bar */}
      <div className="w-full space-y-1.5">
        <Slider
          value={[progress]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground/60 font-body tabular-nums px-0.5">
          <span>{formatAudioTime(progress)}</span>
          <span>{duration > 0 ? formatAudioTime(duration) : '--:--'}</span>
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleMute}
          className="p-2 text-muted-foreground/50 hover:text-gold/70 transition-colors"
          aria-label={isMuted ? 'Ativar som' : 'Silenciar'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={togglePlay}
          disabled={isLoading}
          className={cn(
            "relative rounded-full flex items-center justify-center transition-all duration-300",
            "bg-gold/10 border border-gold/20 text-gold hover:bg-gold/20 hover:border-gold/30",
            "active:scale-95",
            immersive ? "w-16 h-16" : "w-12 h-12",
            isPlaying && "shadow-[0_0_20px_hsl(var(--gold)/0.15)]"
          )}
          aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
        >
          {isLoading ? (
            <Loader2 className={cn("animate-spin text-gold/60", immersive ? "w-5 h-5" : "w-4 h-4")} />
          ) : isPlaying ? (
            <Pause className={cn("text-gold", immersive ? "w-5 h-5" : "w-4 h-4")} />
          ) : (
            <Play className={cn("text-gold ml-0.5", immersive ? "w-5 h-5" : "w-4 h-4")} />
          )}
        </button>

        {!immersive ? (
          <button
            onClick={enterImmersive}
            className="p-2 text-muted-foreground/50 hover:text-gold/70 transition-colors"
            aria-label="Modo imersivo"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={exitImmersive}
            className="p-2 text-muted-foreground/50 hover:text-gold/70 transition-colors"
            aria-label="Sair do modo imersivo"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  // ── Immersive Portal ──
  const ImmersiveOverlay = () => createPortal(
    <AnimatePresence>
      {isImmersive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
        >
          <button
            onClick={exitImmersive}
            className="absolute top-5 right-5 z-10 p-2 text-muted-foreground/40 hover:text-foreground/60 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <OrbBackground scale={1.6} />

          <div className="relative z-10 w-full flex flex-col items-center justify-center min-h-screen py-16">
            <PlayerControls immersive />
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );

  // ── Insight Phase ──
  const InsightPhase = () => (
    <motion.div
      key="insight"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-4 py-2"
    >
      <div className="text-center space-y-1.5">
        <div className="w-8 h-8 mx-auto rounded-full border border-gold/20 flex items-center justify-center mb-2">
          <div className="w-2 h-2 rounded-full bg-gold/30" />
        </div>
        <h3 className="font-display text-base text-foreground">
          O que emergiu desta escuta?
        </h3>
      </div>

      <Textarea
        value={insightText}
        onChange={(e) => setInsightText(e.target.value)}
        placeholder="Escreva livremente..."
        className="min-h-[80px] bg-background/30 border-gold/10 text-foreground placeholder:text-muted-foreground/40 font-body text-sm resize-none focus:border-gold/20 w-full"
      />

      {insightSaved ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gold/70 italic"
        >
          ✦ Insight registrado
        </motion.p>
      ) : (
        <div className="flex flex-col gap-1.5 w-full">
          {[
            { key: 'psique' as const, icon: BookOpen, label: 'Jardim da Psique' },
            { key: 'oficio' as const, icon: Briefcase, label: 'Jardim do Ofício' },
            { key: 'comunidade' as const, icon: Users, label: 'Canteiro da Comunidade' },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => handleSaveInsight(key)}
              disabled={!insightText.trim()}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground/70 hover:text-gold/80 hover:bg-gold/5 border border-transparent hover:border-gold/10 transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => { setPhase('playing'); setInsightText(''); }}
        className="text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors mt-1"
      >
        ← Voltar ao player
      </button>
    </motion.div>
  );

  return (
    <>
      <div className={cn(
        "relative w-full max-w-lg mx-auto rounded-xl overflow-hidden",
        "bg-card/60 backdrop-blur-sm",
        "border border-border/50",
        className
      )}>
        {(phase !== 'ritual' || compact) && (
          <audio ref={audioRef} src={resolvedUrl} preload="metadata" />
        )}

        {!isImmersive && <OrbBackground />}

        {/* Subtle top progress line */}
        {phase === 'playing' && duration > 0 && (
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-border/30">
            <motion.div
              className="h-full bg-gold/40"
              style={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        <div className="relative z-10 p-6">
          <AnimatePresence mode="wait">
            {phase === 'ritual' && !compact && (
              <motion.div
                key="ritual"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center text-center gap-5 py-6"
              >
                {/* Minimal breathing circle */}
                <motion.div
                  animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-14 h-14 rounded-full border border-gold/20 flex items-center justify-center"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-gold/30" />
                </motion.div>

                {titulo && (
                  <h3 className="font-display text-lg text-foreground tracking-wide leading-tight">
                    {titulo}
                  </h3>
                )}
                {subtitulo && (
                  <p className="text-xs text-muted-foreground/60 italic">{subtitulo}</p>
                )}

                <p className="text-muted-foreground/50 text-xs font-body max-w-[16rem] leading-relaxed">
                  Respire um instante antes de ouvir.
                </p>

                <div className="flex flex-col items-center gap-2.5 pt-1">
                  <button
                    onClick={startRitual}
                    className="px-6 py-2.5 rounded-full text-sm font-display tracking-wider bg-gold/10 border border-gold/20 text-gold hover:bg-gold/15 hover:border-gold/30 transition-all active:scale-95"
                  >
                    Iniciar Escuta
                  </button>
                  <button
                    onClick={enterImmersive}
                    className="flex items-center gap-1.5 text-[10px] text-muted-foreground/40 hover:text-gold/50 transition-colors tracking-wide uppercase"
                  >
                    <Maximize2 className="w-3 h-3" />
                    Modo imersivo
                  </button>
                </div>
              </motion.div>
            )}

            {phase === 'playing' && !isImmersive && (
              <motion.div
                key="playing"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <PlayerControls />
              </motion.div>
            )}

            {phase === 'insight' && !hideInsight && <InsightPhase />}
          </AnimatePresence>
        </div>
      </div>

      <ImmersiveOverlay />
    </>
  );
}
