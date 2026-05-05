import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { useClubeCicloDetalhe, type ClubeEscuta } from '@/hooks/useClubeLivro';
import { useAudioProgress } from '@/hooks/useAudioProgress';
import { getPublicAudioUrl, formatAudioTime } from '@/lib/audioUtils';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Headphones, Play, Pause, Loader2, SkipForward, SkipBack, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Estrutura editorial das 5 faixas (Aula-Álbum Oracular)
const FAIXA_META: Record<string, { numero: number; tempo: string; funcao: string }> = {
  'Abertura do Campo':       { numero: 1, tempo: '2–3 min',  funcao: 'Preparação da escuta' },
  'Aula Falada':             { numero: 2, tempo: '18–25 min', funcao: 'Eixo simbólico' },
  'Aplicação Profissional':  { numero: 3, tempo: '10–12 min', funcao: 'Uso clínico' },
  'Integração Oracular':     { numero: 4, tempo: '5–7 min',   funcao: 'Pergunta-mãe e gesto' },
  'Fechamento Aberto':       { numero: 5, tempo: '2–3 min',   funcao: 'Campo permanece' },
};

function getMeta(titulo: string, ordem: number) {
  return FAIXA_META[titulo] ?? { numero: ordem || 0, tempo: '', funcao: '' };
}

export default function ClubeEscutaImersiva() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cicloId = searchParams.get('ciclo');

  const { ciclo, escutas: cicloEscutas, isLoading: loadingCiclo } = useClubeCicloDetalhe(cicloId || undefined);

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

  // IMPORTANTE: incluir TODAS as escutas (mesmo sem audio_url) para mostrar a estrutura da Aula-Álbum
  const escutas: ClubeEscuta[] = cicloId
    ? (cicloEscutas || []).filter(e => e.tipo === 'audio')
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

  // Selecionar primeira faixa com áudio disponível como inicial
  const firstPlayable = useMemo(() => escutas.find(e => !!e.audio_url), [escutas]);
  const [currentId, setCurrentId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentId && firstPlayable) setCurrentId(firstPlayable.id);
  }, [firstPlayable, currentId]);

  const current = escutas.find(e => e.id === currentId) || null;

  const escutaIds = escutas.map(e => e.id);
  const { isCompleted } = useAudioProgress(escutaIds);
  const isLoading = cicloId ? loadingCiclo : loadingAssets;

  const handleNext = useCallback(() => {
    if (!current) return;
    const idx = escutas.findIndex(e => e.id === current.id);
    const next = escutas.slice(idx + 1).find(e => !!e.audio_url);
    if (next) setCurrentId(next.id);
  }, [current, escutas]);

  const handlePrev = useCallback(() => {
    if (!current) return;
    const idx = escutas.findIndex(e => e.id === current.id);
    const prev = [...escutas.slice(0, idx)].reverse().find(e => !!e.audio_url);
    if (prev) setCurrentId(prev.id);
  }, [current, escutas]);

  return (
    <AppLayout>
      <ResponsiveContainer size="default" className="py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-border/40 shrink-0"
            onClick={() => navigate(cicloId ? `/clube?ciclo=${cicloId}` : '/clube')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="h-px w-6 bg-gold/40" />
              <span className="text-[10px] tracking-[0.4em] uppercase text-gold/70 font-bold">Aula-Álbum Oracular</span>
            </div>
            <h1 className="font-display text-2xl md:text-4xl text-foreground tracking-tight leading-tight truncate">
              {ciclo?.titulo || 'Escuta Contemplativa'}
            </h1>
            {ciclo?.autor_livro && (
              <p className="text-muted-foreground/60 text-xs font-serif italic mt-1">
                {ciclo.autor_livro}
              </p>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center gap-6 py-32">
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-16 h-16 rounded-full border border-gold/20 flex items-center justify-center bg-gold/5"
            >
              <Headphones className="w-6 h-6 text-gold/60" />
            </motion.div>
            <p className="text-gold/40 text-xs uppercase tracking-[0.3em] font-bold">Afinando a frequência…</p>
          </div>
        ) : escutas.length === 0 ? (
          <div className="text-center py-32 space-y-4">
            <Headphones className="w-12 h-12 text-muted-foreground/20 mx-auto" />
            <p className="text-muted-foreground/60 font-serif italic">Nenhuma faixa cadastrada nesta estação.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-6 lg:gap-10">
            {/* TRACKLIST — Spotify style */}
            <aside className="space-y-1.5">
              <div className="flex items-center justify-between px-2 mb-3">
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 font-bold">
                  Faixas
                </span>
                <span className="text-[10px] text-muted-foreground/40 tabular-nums">
                  {escutas.filter(e => !!e.audio_url).length}/{escutas.length}
                </span>
              </div>
              {escutas.map((escuta) => {
                const meta = getMeta(escuta.titulo, escuta.ordem);
                const isActive = current?.id === escuta.id;
                const hasAudio = !!escuta.audio_url;
                const done = isCompleted(escuta.id);
                return (
                  <button
                    key={escuta.id}
                    onClick={() => hasAudio && setCurrentId(escuta.id)}
                    disabled={!hasAudio}
                    className={cn(
                      "w-full text-left rounded-xl px-4 py-3 flex items-center gap-3 transition-all border",
                      isActive
                        ? "bg-gold/8 border-gold/30"
                        : "bg-card/40 border-border/20 hover:border-border/40 hover:bg-card/60",
                      !hasAudio && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {/* Número / status */}
                    <div className={cn(
                      "shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-mono tabular-nums",
                      isActive ? "bg-gold/15 text-gold" :
                      done ? "bg-emerald-500/10 text-emerald-400/80" :
                      hasAudio ? "bg-muted/40 text-foreground/70" :
                      "bg-muted/20 text-muted-foreground/40"
                    )}>
                      {done ? <Check className="w-3.5 h-3.5" /> :
                       !hasAudio ? <AlertCircle className="w-3.5 h-3.5" /> :
                       isActive ? <Play className="w-3.5 h-3.5 ml-0.5" /> :
                       String(meta.numero).padStart(2, '0')}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm font-medium truncate leading-tight",
                        isActive ? "text-gold" : "text-foreground/85"
                      )}>
                        {escuta.titulo}
                      </p>
                      <p className="text-[10.5px] text-muted-foreground/55 truncate mt-0.5">
                        {meta.funcao || escuta.descricao || '—'}
                      </p>
                    </div>

                    <span className="shrink-0 text-[10px] text-muted-foreground/45 tabular-nums">
                      {!hasAudio ? 'pendente' :
                       escuta.duracao_segundos ? formatAudioTime(escuta.duracao_segundos) :
                       meta.tempo}
                    </span>
                  </button>
                );
              })}
            </aside>

            {/* PLAYER */}
            <section className="lg:sticky lg:top-24 self-start">
              {current ? (
                <PlayerEditorial
                  escuta={current}
                  onNext={handleNext}
                  onPrev={handlePrev}
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-border/30 bg-card/30 p-10 text-center">
                  <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground/70 font-serif italic">
                    Áudios ainda não publicados para este ciclo.
                  </p>
                  <p className="text-xs text-muted-foreground/40 mt-2">
                    A estrutura da Aula-Álbum está reservada — as faixas aparecerão aqui assim que forem disponibilizadas.
                  </p>
                </div>
              )}
            </section>
          </div>
        )}
      </ResponsiveContainer>
    </AppLayout>
  );
}

// ── Player editorial (não fullscreen) ──
function PlayerEditorial({
  escuta,
  onNext,
  onPrev,
}: {
  escuta: ClubeEscuta;
  onNext: () => void;
  onPrev: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const resolvedUrl = useMemo(() => getPublicAudioUrl(escuta.audio_url), [escuta.audio_url]);
  const meta = getMeta(escuta.titulo, escuta.ordem);

  // Reset ao trocar de faixa
  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
    setIsLoading(true);
    setHasError(false);
  }, [escuta.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onMeta = () => { setDuration(audio.duration || 0); setIsLoading(false); };
    const onCanPlay = () => setIsLoading(false);
    const onTime = () => setProgress(audio.currentTime);
    const onEnded = () => { setIsPlaying(false); onNext(); };
    const onError = () => { setIsLoading(false); setHasError(true); };
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
  }, [escuta.id, onNext]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else {
      try { await audio.play(); setIsPlaying(true); }
      catch (e) { console.error('Audio play failed:', e); setHasError(true); }
    }
  }, [isPlaying]);

  const handleSeek = useCallback((v: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = v[0];
    setProgress(v[0]);
  }, []);

  return (
    <div className="rounded-2xl bg-gradient-to-br from-card/80 via-card/40 to-background/60 border border-border/30 p-7 md:p-10 backdrop-blur-sm">
      <audio ref={audioRef} src={resolvedUrl || ''} preload="metadata" />

      {/* Cabeçalho da faixa */}
      <div className="flex items-start gap-5 mb-8">
        <motion.div
          animate={isPlaying ? { scale: [1, 1.04, 1], opacity: [0.7, 1, 0.7] } : { scale: 1, opacity: 0.6 }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-gold/15 via-mystic/10 to-background border border-gold/15 flex items-center justify-center"
        >
          <span className="font-display text-2xl md:text-3xl text-gold/80 tabular-nums">
            {String(meta.numero).padStart(2, '0')}
          </span>
        </motion.div>
        <div className="flex-1 min-w-0 pt-1">
          <p className="text-[10px] uppercase tracking-[0.35em] text-gold/60 font-bold mb-2">
            Faixa {meta.numero} · {meta.tempo}
          </p>
          <h2 className="font-display text-xl md:text-2xl text-foreground leading-tight">
            {escuta.titulo}
          </h2>
          {(escuta.descricao || meta.funcao) && (
            <p className="text-xs md:text-sm text-muted-foreground/70 font-serif italic mt-2 leading-relaxed">
              {escuta.descricao || meta.funcao}
            </p>
          )}
        </div>
      </div>

      {/* Erro / sem áudio */}
      {hasError && (
        <div className="flex items-center gap-2 text-xs text-destructive/80 bg-destructive/8 border border-destructive/20 rounded-lg px-3 py-2 mb-5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Não foi possível carregar este áudio. Verifique se o arquivo foi publicado.</span>
        </div>
      )}

      {/* Progresso */}
      <div className="space-y-2 mb-7">
        <Slider
          value={[progress]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          disabled={!resolvedUrl || hasError}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground/65 font-body tabular-nums">
          <span>{formatAudioTime(progress)}</span>
          <span>{duration > 0 ? formatAudioTime(duration) : '--:--'}</span>
        </div>
      </div>

      {/* Controles */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={onPrev}
          className="p-2 text-muted-foreground/60 hover:text-foreground transition-colors"
          aria-label="Faixa anterior"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        <button
          onClick={togglePlay}
          disabled={isLoading || hasError || !resolvedUrl}
          className={cn(
            "relative w-14 h-14 rounded-full flex items-center justify-center",
            "bg-gold/10 border border-gold/25 text-gold",
            "hover:bg-gold/15 hover:border-gold/40 active:scale-95",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            "transition-all duration-300",
            isPlaying && "shadow-[0_0_30px_hsl(var(--gold)/0.15)]"
          )}
        >
          {isLoading && resolvedUrl && !hasError ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>

        <button
          onClick={onNext}
          className="p-2 text-muted-foreground/60 hover:text-foreground transition-colors"
          aria-label="Próxima faixa"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
