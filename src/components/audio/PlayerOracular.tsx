import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, Loader2, BookOpen, Briefcase, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SoundWaveVisualizer } from './SoundWaveVisualizer';
import { formatAudioTime } from '@/lib/audioUtils';
import { motion, AnimatePresence } from 'framer-motion';

type PlayerPhase = 'ritual' | 'playing' | 'insight';

interface PlayerOracularProps {
  audioUrl: string;
  titulo?: string;
  subtitulo?: string;
  className?: string;
  /** Called when user saves an insight */
  onSaveInsight?: (texto: string, destino: 'psique' | 'oficio' | 'comunidade') => void;
  /** Hide insight phase entirely */
  hideInsight?: boolean;
}

export function PlayerOracular({
  audioUrl,
  titulo,
  subtitulo,
  className,
  onSaveInsight,
  hideInsight = false,
}: PlayerOracularProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [phase, setPhase] = useState<PlayerPhase>('ritual');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [insightText, setInsightText] = useState('');
  const [insightSaved, setInsightSaved] = useState(false);

  // Audio event listeners
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
    };

    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('loadstart', onLoadStart);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('loadstart', onLoadStart);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnded);
    };
  }, [hideInsight]);

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

  return (
    <div className={cn(
      "relative w-full max-w-xl mx-auto rounded-2xl overflow-hidden",
      "bg-gradient-to-br from-midnight via-card to-midnight-light",
      "border border-gold/10 shadow-2xl",
      className
    )}>
      {/* Audio element (always mounted for preload) */}
      {phase !== 'ritual' && (
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
      )}

      {/* Breathing mandala background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div
          className={cn(
            "w-64 h-64 rounded-full",
            "bg-gradient-to-br from-mystic/15 via-gold/8 to-mystic-dark/10",
            "blur-2xl",
            isPlaying ? "animate-[breathe-oracular_6s_ease-in-out_infinite]" : "opacity-30"
          )}
        />
      </div>

      {/* Inner sacred geometry rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={cn(
          "w-40 h-40 rounded-full border border-gold/10",
          isPlaying && "animate-[breathe-oracular_6s_ease-in-out_infinite]"
        )} style={{ animationDelay: '0.5s' }} />
        <div className={cn(
          "absolute w-28 h-28 rounded-full border border-mystic/10",
          isPlaying && "animate-[breathe-oracular_6s_ease-in-out_infinite]"
        )} style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 p-8">
        <AnimatePresence mode="wait">
          {/* ======= RITUAL PHASE ======= */}
          {phase === 'ritual' && (
            <motion.div
              key="ritual"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center text-center space-y-6 py-8"
            >
              {/* Mandala symbol */}
              <div className="w-20 h-20 rounded-full border-2 border-gold/30 flex items-center justify-center animate-[breathe-oracular_6s_ease-in-out_infinite]">
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

              <Button
                onClick={startRitual}
                className="bg-gradient-to-r from-gold/90 to-gold-dark border border-gold/30 text-primary-foreground hover:scale-105 transition-transform px-8 py-3 rounded-full font-display text-base tracking-wider"
              >
                Iniciar Escuta
              </Button>
            </motion.div>
          )}

          {/* ======= PLAYING PHASE ======= */}
          {phase === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Title */}
              {titulo && (
                <div className="text-center">
                  <h3 className="font-display text-lg text-foreground tracking-wide">{titulo}</h3>
                  {subtitulo && <p className="text-xs text-muted-foreground mt-1 italic">{subtitulo}</p>}
                </div>
              )}

              {/* Sound wave */}
              <SoundWaveVisualizer isPlaying={isPlaying} className="h-14" />

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
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>

                <Button
                  onClick={togglePlay}
                  disabled={isLoading}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-gold/90 to-gold-dark border border-gold/30 text-primary-foreground hover:scale-105 transition-transform shadow-lg shadow-gold/20"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </Button>

                <div className="w-10" /> {/* spacer for symmetry */}
              </div>
            </motion.div>
          )}

          {/* ======= INSIGHT PHASE ======= */}
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
                  <Button
                    onClick={() => handleSaveInsight('psique')}
                    disabled={!insightText.trim()}
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground hover:text-gold hover:bg-gold/5 border border-transparent hover:border-gold/15 transition-all"
                  >
                    <BookOpen className="w-4 h-4" />
                    Salvar no Jardim da Psique
                  </Button>
                  <Button
                    onClick={() => handleSaveInsight('oficio')}
                    disabled={!insightText.trim()}
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground hover:text-gold hover:bg-gold/5 border border-transparent hover:border-gold/15 transition-all"
                  >
                    <Briefcase className="w-4 h-4" />
                    Salvar no Jardim do Ofício
                  </Button>
                  <Button
                    onClick={() => handleSaveInsight('comunidade')}
                    disabled={!insightText.trim()}
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground hover:text-gold hover:bg-gold/5 border border-transparent hover:border-gold/15 transition-all"
                  >
                    <Users className="w-4 h-4" />
                    Compartilhar no Canteiro da Comunidade
                  </Button>
                </div>
              )}

              <div className="text-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setPhase('playing'); setInsightText(''); }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  ← Voltar ao player
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
