import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ClubeAudioCardImersivo } from '@/components/clube/ClubeAudioCardImersivo';
import { useClubeCicloDetalhe, type ClubeEscuta } from '@/hooks/useClubeLivro';
import { useAudioProgress } from '@/hooks/useAudioProgress';
import { getPublicAudioUrl, formatAudioTime } from '@/lib/audioUtils';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Headphones, Play, Pause, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ImmersiveBreathingScene } from '@/components/audio/ImmersiveBreathingScene';

export default function ClubeEscutaImersiva() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cicloId = searchParams.get('ciclo');
  const [selectedEscuta, setSelectedEscuta] = useState<ClubeEscuta | null>(null);

  const { escutas: cicloEscutas, isLoading: loadingCiclo } = useClubeCicloDetalhe(cicloId || undefined);

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
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const resolvedUrl = getPublicAudioUrl(escuta.audio_url);

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
      transition={{ duration: 1.2 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-background"
    >
      <audio ref={audioRef} src={resolvedUrl || ''} preload="metadata" />

      {/* Immersive breathing background with mandala */}
      <ImmersiveBreathingScene isPlaying={isPlaying} />

      {/* Back button — very discreet */}
      <button
        onClick={onBack}
        className="absolute top-5 left-5 z-20 p-2.5 text-muted-foreground/20 hover:text-foreground/50 transition-colors duration-500"
        aria-label="Voltar"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      {/* Content — minimal, centered below mandala */}
      <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-sm px-6 mt-32 md:mt-40">
        {/* Title — small, understated */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-center space-y-1.5"
        >
          <h1 className="font-display text-base md:text-lg text-foreground/80 tracking-wider leading-relaxed">
            {escuta.titulo}
          </h1>
          {escuta.descricao && (
            <p className="text-[11px] text-muted-foreground/35 italic font-body">
              {escuta.descricao}
            </p>
          )}
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="w-full space-y-2"
        >
          <Slider
            value={[progress]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground/30 font-body tabular-nums">
            <span>{formatAudioTime(progress)}</span>
            <span>{duration > 0 ? formatAudioTime(duration) : '--:--'}</span>
          </div>
        </motion.div>

        {/* Play/Pause — single central button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className={cn(
              "relative w-16 h-16 rounded-full flex items-center justify-center",
              "bg-gold/6 border border-gold/12 text-gold/70",
              "hover:bg-gold/10 hover:border-gold/20",
              "active:scale-95 transition-all duration-500",
              isPlaying && "shadow-[0_0_40px_hsl(var(--gold)/0.08)]"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-gold/40" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
