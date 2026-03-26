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
  /** Skip ritual phase, go straight to player */
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

  // Breathing cycle sync (6s total: 3s in, 3s out)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setBreathPhase(prev => prev === 'inhale' ? 'exhale' : 'inhale');
    }, 3000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Audio events
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

  // Lock body scroll in immersive mode
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
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try { await audio.play(); setIsPlaying(true); } catch (e) { console.error(e); }
    }
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

  const exitImmersive = useCallback(() => {
    setIsImmersive(false);
  }, []);

  if (!isValid || !resolvedUrl) return null;

  // ── Mandala Background ──
  const MandalaBackground = ({ large = false }: { large?: boolean }) => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {/* Main glow */}
      <div className={cn(
        "rounded-full",
        "bg-gradient-to-br from-mystic/15 via-gold/8 to-mystic-dark/10",
        "blur-3xl transition-all duration-[3000ms]",
        large ? "w-96 h-96" : "w-64 h-64",
        isPlaying
          ? breathPhase === 'inhale'
            ? "scale-110 opacity-80"
            : "scale-100 opacity-50"
          : "opacity-20 scale-95"
      )} />
      {/* Sacred geometry rings */}
      <div className={cn(
        "absolute rounded-full border border-gold/10 transition-all duration-[3000ms]",
        large ? "w-60 h-60" : "w-40 h-40",
        isPlaying && breathPhase === 'inhale' ? "scale-105 opacity-100" : "scale-100 opacity-40"
      )} />
      <div className={cn(
        "absolute rounded-full border border-mystic/10 transition-all duration-[3000ms]",
        large ? "w-44 h-44" : "w-28 h-28",
        isPlaying && breathPhase === 'exhale' ? "scale-110 opacity-80" : "scale-100 opacity-30"
      )} />
      <div className={cn(
        "absolute rounded-full border border-gold/5 transition-all duration-[3000ms]",
        large ? "w-80 h-80" : "w-52 h-52",
        isPlaying && breathPhase === 'inhale' ? "scale-105 opacity-60" : "scale-100 opacity-10"
      )} />
    </div>
  );

  // ── Playing Controls (shared between inline and immersive) ──
  const PlayerControls = ({ immersive = false }: { immersive?: boolean }) => (
    <div className={cn("space-y-6", immersive && "max-w-lg mx-auto w-full px-6")}>
      {/* Title */}
      {titulo && (
        <div className="text-center">
          <h3 className={cn(
            "font-display text-foreground tracking-wide",
            immersive ? "text-2xl md:text-3xl" : "text-lg"
          )}>
            {titulo}
          </h3>
          {subtitulo && (
            <p className={cn(
              "text-muted-foreground mt-1 italic",
              immersive ? "text-sm md:text-base" : "text-xs"
            )}>
              {subtitulo}
            </p>
          )}
        </div>
      )}

      {/* Breathing indicator */}
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <span className={cn(
            "text-xs tracking-[0.3em] uppercase text-gold/50 transition-opacity duration-[2000ms]",
            breathPhase === 'inhale' ? 'opacity-80' : 'opacity-30'
          )}>
            {breathPhase === 'inhale' ? 'inspire' : 'expire'}
          </span>
        </motion.div>
      )}

      {/* Sound wave */}
      <SoundWaveVisualizer
        isPlaying={isPlaying}
        className={cn(immersive ? "h-20 md:h-24" : "h-14")}
      />

      {/* Progress */}
      <div className="space-y-2">
        <Slider
          value={[progress]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground font-body">
          <span>{formatAudioTime(progress)}</span>
          <span>{duration > 0 ? formatAudioTime(duration) : '--:--'}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-5">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="text-muted-foreground hover:text-gold transition-colors"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>

        <Button
          onClick={togglePlay}
          disabled={isLoading}
          className={cn(
            "rounded-full bg-gradient-to-br from-gold/90 to-gold-dark border border-gold/30 text-primary-foreground hover:scale-105 transition-transform shadow-lg shadow-gold/20",
            immersive ? "w-20 h-20" : "w-14 h-14"
          )}
        >
          {isLoading ? (
            <Loader2 className={cn("animate-spin", immersive ? "w-7 h-7" : "w-5 h-5")} />
          ) : isPlaying ? (
            <Pause className={cn(immersive ? "w-7 h-7" : "w-5 h-5")} />
          ) : (
            <Play className={cn("ml-0.5", immersive ? "w-7 h-7" : "w-5 h-5")} />
          )}
        </Button>

        {!immersive ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={enterImmersive}
            className="text-muted-foreground hover:text-gold transition-colors"
            title="Modo imersivo"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={exitImmersive}
            className="text-muted-foreground hover:text-gold transition-colors"
          >
            <Minimize2 className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );

  // ── Immersive Fullscreen Overlay ──
  const ImmersiveOverlay = () => createPortal(
    <AnimatePresence>
      {isImmersive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(180deg, hsl(206 44% 6%) 0%, hsl(206 44% 10%) 50%, hsl(206 44% 8%) 100%)' }}
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={exitImmersive}
            className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground"
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Mandala background */}
          <MandalaBackground large />

          {/* Content */}
          <div className="relative z-10 w-full flex flex-col items-center justify-center min-h-screen py-12">
            <PlayerControls immersive />
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );

  return (
    <>
      <div className={cn(
        "relative w-full max-w-xl mx-auto rounded-2xl overflow-hidden",
        "bg-gradient-to-br from-midnight via-card to-midnight-light",
        "border border-gold/10 shadow-2xl",
        className
      )}>
        {/* Audio element */}
        {(phase !== 'ritual' || compact) && (
          <audio ref={audioRef} src={resolvedUrl} preload="metadata" />
        )}

        {/* Background mandala (inline) */}
        {!isImmersive && <MandalaBackground />}

        <div className="relative z-10 p-8">
          <AnimatePresence mode="wait">
            {/* ═══ RITUAL PHASE ═══ */}
            {phase === 'ritual' && !compact && (
              <motion.div
                key="ritual"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center text-center space-y-6 py-8"
              >
                {/* Mandala symbol */}
                <div className="w-20 h-20 rounded-full border-2 border-gold/30 flex items-center justify-center animate-breathe-oracular">
                  <div className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-gold/50" />
                  </div>
                </div>

                {titulo && (
                  <h3 className="font-display text-xl text-foreground tracking-wide">
                    {titulo}
                  </h3>
                )}
                {subtitulo && (
                  <p className="text-sm text-muted-foreground italic">{subtitulo}</p>
                )}

                <p className="text-muted-foreground/80 text-sm font-body max-w-xs leading-relaxed">
                  Respire um instante antes de ouvir.
                </p>

                <div className="flex flex-col items-center gap-3">
                  <Button
                    onClick={startRitual}
                    className="bg-gradient-to-r from-gold/90 to-gold-dark border border-gold/30 text-primary-foreground hover:scale-105 transition-transform px-8 py-3 rounded-full font-display text-base tracking-wider"
                  >
                    Iniciar Escuta
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={enterImmersive}
                    className="text-xs text-muted-foreground/60 hover:text-gold gap-1.5"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    Ouvir em modo imersivo
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ═══ PLAYING PHASE ═══ */}
            {phase === 'playing' && !isImmersive && (
              <motion.div
                key="playing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <PlayerControls />
              </motion.div>
            )}

            {/* ═══ INSIGHT PHASE ═══ */}
            {phase === 'insight' && !hideInsight && (
              <motion.div
                key="insight"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-5 py-4"
              >
                <div className="text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full border border-gold/30 flex items-center justify-center mb-3">
                    <div className="w-3 h-3 rounded-full bg-gold/40" />
                  </div>
                  <h3 className="font-display text-lg text-foreground">
                    Que insight surgiu durante esta escuta?
                  </h3>
                </div>

                <Textarea
                  value={insightText}
                  onChange={(e) => setInsightText(e.target.value)}
                  placeholder="Escreva livremente o que emergiu..."
                  className="min-h-[100px] bg-background/50 border-gold/15 text-foreground placeholder:text-muted-foreground/50 font-body text-sm resize-none focus:border-gold/30"
                />

                {insightSaved ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-sm text-gold italic"
                  >
                    ✦ Insight registrado com cuidado
                  </motion.p>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button onClick={() => handleSaveInsight('psique')} disabled={!insightText.trim()} variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-gold hover:bg-gold/5 border border-transparent hover:border-gold/15 transition-all">
                      <BookOpen className="w-4 h-4" />Salvar no Jardim da Psique
                    </Button>
                    <Button onClick={() => handleSaveInsight('oficio')} disabled={!insightText.trim()} variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-gold hover:bg-gold/5 border border-transparent hover:border-gold/15 transition-all">
                      <Briefcase className="w-4 h-4" />Salvar no Jardim do Ofício
                    </Button>
                    <Button onClick={() => handleSaveInsight('comunidade')} disabled={!insightText.trim()} variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-gold hover:bg-gold/5 border border-transparent hover:border-gold/15 transition-all">
                      <Users className="w-4 h-4" />Compartilhar no Canteiro da Comunidade
                    </Button>
                  </div>
                )}

                <div className="text-center pt-2">
                  <Button variant="ghost" size="sm" onClick={() => { setPhase('playing'); setInsightText(''); }} className="text-xs text-muted-foreground hover:text-foreground">
                    ← Voltar ao player
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Immersive fullscreen portal */}
      <ImmersiveOverlay />
    </>
  );
}
