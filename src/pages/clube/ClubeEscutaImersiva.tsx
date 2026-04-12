import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ClubeAudioCardImersivo } from '@/components/clube/ClubeAudioCardImersivo';
import { useClubeCicloDetalhe, type ClubeEscuta } from '@/hooks/useClubeLivro';
import { useAudioProgress } from '@/hooks/useAudioProgress';
import { getPublicAudioUrl, isValidAudioUrl, formatAudioTime } from '@/lib/audioUtils';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Headphones, Play, Pause, Volume2, VolumeX, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function ClubeEscutaImersiva() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cicloId = searchParams.get('ciclo');
  const [selectedEscuta, setSelectedEscuta] = useState<ClubeEscuta | null>(null);

  // Try to get escutas from ciclo, or fallback to audio_assets
  const { escutas: cicloEscutas, isLoading: loadingCiclo } = useClubeCicloDetalhe(cicloId || undefined);

  // Fallback: audio_assets for clube
  const { data: audioAssets, isLoading: loadingAssets } = useQuery({
    queryKey: ['clube-audio-assets'],
    queryFn: async () => {
      const { data } = await supabase
        .from('audio_assets')
        .select('*')
        .eq('publicado', true)
        .order('ordem', { ascending: true });
      return data || [];
    },
    enabled: !cicloId,
  });

  // Normalize to a common shape
  const escutas: ClubeEscuta[] = cicloId
    ? (cicloEscutas || []).filter(e => e.tipo === 'audio' && e.audio_url)
    : (audioAssets || []).map((a: any) => ({
        id: a.id,
        ciclo_id: '',
        titulo: a.titulo,
        descricao: a.descricao,
        tipo: 'audio' as const,
        audio_url: a.file_path,
        duracao_segundos: a.duracao_segundos,
        ordem: a.ordem || 0,
        ativo: true,
      }));

  const escutaIds = escutas.map(e => e.id);
  const { isCompleted } = useAudioProgress(escutaIds);
  const isLoading = cicloId ? loadingCiclo : loadingAssets;

  if (selectedEscuta) {
    return (
      <PlayerImersivo
        escuta={selectedEscuta}
        onBack={() => setSelectedEscuta(null)}
      />
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen px-4 py-10 md:py-16 max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/clube')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display text-2xl md:text-3xl text-foreground tracking-wide">
              Escuta Contemplativa
            </h1>
            <p className="text-muted-foreground/60 text-sm tracking-wide">
              {escutas.length} áudio{escutas.length !== 1 ? 's' : ''} disponíve{escutas.length !== 1 ? 'is' : 'l'}
            </p>
          </div>
        </div>

        {/* Audio list */}
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 py-20">
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center"
            >
              <Headphones className="w-5 h-5 text-gold/40" />
            </motion.div>
            <p className="text-muted-foreground/40 text-sm">Carregando áudios…</p>
          </div>
        ) : escutas.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <Headphones className="w-10 h-10 text-muted-foreground/30 mx-auto" />
            <p className="text-muted-foreground/50 text-sm">Nenhum áudio disponível.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {escutas.map((escuta, i) => (
              <ClubeAudioCardImersivo
                key={escuta.id}
                id={escuta.id}
                titulo={escuta.titulo}
                descricao={escuta.descricao}
                duracaoSegundos={escuta.duracao_segundos}
                concluido={isCompleted(escuta.id)}
                onClick={() => setSelectedEscuta(escuta)}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

// ── Immersive Full-Screen Player ──
function PlayerImersivo({ escuta, onBack }: { escuta: ClubeEscuta; onBack: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');

  const resolvedUrl = getPublicAudioUrl(escuta.audio_url);

  // Breathing cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathPhase(prev => prev === 'inhale' ? 'exhale' : 'inhale');
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onMeta = () => { setDuration(audio.duration); setIsLoading(false); };
    const onCanPlay = () => setIsLoading(false);
    const onTime = () => setProgress(audio.currentTime);
    const onEnded = () => setIsPlaying(false);
    const onError = () => setIsLoading(false);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    return () => {
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center overflow-hidden"
    >
      <audio ref={audioRef} src={resolvedUrl || ''} preload="metadata" />

      {/* Close button */}
      <button
        onClick={onBack}
        className="absolute top-5 right-5 z-20 p-2.5 text-muted-foreground/30 hover:text-foreground/60 transition-colors"
        aria-label="Voltar"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Background orb layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Outer glow */}
        <motion.div
          animate={{
            scale: breathPhase === 'inhale' ? 1.15 : 0.9,
            opacity: isPlaying ? (breathPhase === 'inhale' ? 0.25 : 0.1) : 0.06,
          }}
          transition={{ duration: 3.5, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] md:w-[36rem] md:h-[36rem] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, hsl(var(--gold) / 0.15) 0%, hsl(var(--mystic) / 0.06) 50%, transparent 100%)',
          }}
        />
        {/* Inner ring */}
        <motion.div
          animate={{
            scale: breathPhase === 'exhale' ? 1.1 : 0.94,
            opacity: isPlaying ? 0.25 : 0.08,
          }}
          transition={{ duration: 3.5, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-56 md:h-56 rounded-full border border-gold/10"
        />
        {/* Core dot */}
        <motion.div
          animate={{
            scale: breathPhase === 'inhale' ? 1.2 : 0.85,
            opacity: isPlaying ? 0.5 : 0.15,
          }}
          transition={{ duration: 3.5, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gold/30"
        />
        {/* Second ring */}
        <motion.div
          animate={{
            scale: breathPhase === 'inhale' ? 1.05 : 0.97,
            opacity: isPlaying ? 0.12 : 0.04,
          }}
          transition={{ duration: 4, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 rounded-full border border-gold/5"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md px-6">
        {/* Breathing cue */}
        <AnimatePresence>
          {isPlaying && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="text-[10px] tracking-[0.4em] uppercase text-gold/35 select-none"
            >
              {breathPhase === 'inhale' ? '· inspire ·' : '· expire ·'}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Title */}
        <div className="text-center space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-display text-xl md:text-2xl text-foreground tracking-wide leading-relaxed"
          >
            {escuta.titulo}
          </motion.h1>
          {escuta.descricao && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-xs text-muted-foreground/50 italic"
            >
              {escuta.descricao}
            </motion.p>
          )}
        </div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-full space-y-2"
        >
          <Slider
            value={[progress]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground/40 font-body tabular-nums">
            <span>{formatAudioTime(progress)}</span>
            <span>{duration > 0 ? formatAudioTime(duration) : '--:--'}</span>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex items-center gap-6"
        >
          <button
            onClick={toggleMute}
            className="p-2 text-muted-foreground/40 hover:text-gold/60 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={togglePlay}
            disabled={isLoading}
            className={cn(
              "relative w-16 h-16 rounded-full flex items-center justify-center",
              "bg-gold/8 border border-gold/15 text-gold",
              "hover:bg-gold/15 hover:border-gold/25",
              "active:scale-95 transition-all duration-300",
              isPlaying && "shadow-[0_0_30px_hsl(var(--gold)/0.12)]"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-gold/50" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>

          {/* Spacer for symmetry */}
          <div className="p-2 w-8" />
        </motion.div>
      </div>
    </motion.div>
  );
}
