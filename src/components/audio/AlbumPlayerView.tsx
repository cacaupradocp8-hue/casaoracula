// ============================================
// Album Player Page — Full track list + player
// ============================================

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Play, Pause, SkipBack, SkipForward, CheckCircle2, Circle,
  Music, Disc3, RotateCcw, RotateCw
} from 'lucide-react';
import { useAudioTracks, type AudioTrack } from '@/hooks/useAudioAlbums';
import { useAudioProgress, type AudioProgress } from '@/hooks/useAudioProgress';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const RATES = [1, 1.25, 1.5, 2];

function formatTime(s: number): string {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

// ─── Full Player ────────────────────────────
function FullPlayer() {
  const { state, togglePlay, seek, seekRelative, setPlaybackRate, markCompleted } = useAudioPlayer();
  const { toast } = useToast();
  const [rateIdx, setRateIdx] = useState(0);

  if (!state.track) return null;

  const cycleRate = () => {
    const next = (rateIdx + 1) % RATES.length;
    setRateIdx(next);
    setPlaybackRate(RATES[next]);
  };

  const handleComplete = async () => {
    await markCompleted();
    toast({ title: 'Faixa concluída ✓' });
  };

  return (
    <Card className="bg-muted/30 border-primary/20">
      <CardContent className="p-4 space-y-4">
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">{state.track.titulo}</p>
          <Badge variant="outline" className="text-[10px] mt-1">{state.track.tipo}</Badge>
        </div>

        {/* Progress slider */}
        <div className="space-y-1">
          <Slider
            value={[state.currentTime]}
            max={state.duration || 100}
            step={1}
            onValueChange={([v]) => seek(v)}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{formatTime(state.currentTime)}</span>
            <span>{formatTime(state.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0" onClick={() => seekRelative(-10)}>
            <RotateCcw className="w-4 h-4" />
          </Button>

          <Button variant="default" size="sm" className="w-12 h-12 p-0 rounded-full" onClick={togglePlay}>
            {state.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </Button>

          <Button variant="ghost" size="sm" className="w-10 h-10 p-0" onClick={() => seekRelative(10)}>
            <RotateCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Rate + Complete */}
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" className="text-xs h-7 px-3" onClick={cycleRate}>
            {RATES[rateIdx]}x
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-7 gap-1" onClick={handleComplete}>
            <CheckCircle2 className="w-3 h-3" /> Concluída
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Track Item ─────────────────────────────
function TrackItem({ track, progress }: { track: AudioTrack; progress?: AudioProgress }) {
  const { state, play } = useAudioPlayer();
  const isActive = state.track?.id === track.id;

  const status = progress?.concluido
    ? 'concluido'
    : progress && progress.posicao_segundos > 0
    ? 'andamento'
    : 'pendente';

  const statusIcon = status === 'concluido'
    ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
    : status === 'andamento'
    ? <Circle className="w-4 h-4 text-amber-500 fill-amber-500/20" />
    : <Circle className="w-4 h-4 text-muted-foreground" />;

  const handleClick = () => {
    const startAt = progress && !progress.concluido ? progress.posicao_segundos : 0;
    play(track, startAt);
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`w-full text-left p-3 rounded-lg border transition-colors ${
        isActive
          ? 'border-primary/50 bg-primary/5'
          : 'border-border hover:border-primary/30 hover:bg-muted/30'
      }`}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground font-mono w-5 text-center shrink-0">{track.ordem}</span>

        {isActive && state.isPlaying ? (
          <div className="flex items-end gap-0.5 h-4 w-4 shrink-0">
            <span className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: '40%' }} />
            <span className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: '70%', animationDelay: '150ms' }} />
            <span className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: '50%', animationDelay: '300ms' }} />
          </div>
        ) : (
          <div className="shrink-0">{statusIcon}</div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{track.titulo}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Badge variant="outline" className="text-[9px] px-1.5 py-0">{track.tipo}</Badge>
            {track.tags?.map(t => (
              <Badge key={t} variant="secondary" className="text-[9px] px-1.5 py-0">{t}</Badge>
            ))}
            {track.duracao_segundos && (
              <span className="text-[10px] text-muted-foreground">{formatTime(track.duracao_segundos)}</span>
            )}
          </div>
        </div>

        <Play className="w-4 h-4 text-muted-foreground shrink-0" />
      </div>
    </motion.button>
  );
}

// ─── Main Album View ────────────────────────
interface AlbumPlayerViewProps {
  albumId: string;
  titulo: string;
  descricao?: string | null;
  capaUrl?: string | null;
}

export function AlbumPlayerView({ albumId, titulo, descricao, capaUrl }: AlbumPlayerViewProps) {
  const { data: tracks, isLoading } = useAudioTracks(albumId);
  const trackIds = useMemo(() => (tracks || []).map(t => t.id), [tracks]);
  const { data: progressList } = useAudioProgress(trackIds);
  const { state } = useAudioPlayer();

  const progressMap = useMemo(() => {
    const m: Record<string, AudioProgress> = {};
    (progressList || []).forEach(p => { m[p.track_id] = p; });
    return m;
  }, [progressList]);

  // Find "continue listening" track
  const continueTrack = useMemo(() => {
    if (!tracks || !progressList) return null;
    const inProgress = tracks.find(t => {
      const p = progressMap[t.id];
      return p && !p.concluido && p.posicao_segundos > 0;
    });
    return inProgress || null;
  }, [tracks, progressList, progressMap]);

  const completedCount = progressList?.filter(p => p.concluido).length || 0;

  if (isLoading) {
    return <div className="text-sm text-muted-foreground text-center py-8">Carregando faixas…</div>;
  }

  return (
    <div className="space-y-4">
      {/* Album header */}
      <div className="text-center space-y-2">
        {capaUrl && (
          <img src={capaUrl} alt={titulo} className="w-24 h-24 rounded-lg mx-auto object-cover shadow-md" />
        )}
        <h3 className="text-base font-semibold text-foreground">{titulo}</h3>
        {descricao && <p className="text-xs text-muted-foreground">{descricao}</p>}
        <p className="text-[10px] text-muted-foreground">
          {completedCount}/{tracks?.length || 0} faixas concluídas
        </p>
      </div>

      {/* Continue listening */}
      {continueTrack && (
        <ContinueListeningCard track={continueTrack} progress={progressMap[continueTrack.id]} />
      )}

      {/* Active player */}
      {state.track && trackIds.includes(state.track.id) && <FullPlayer />}

      {/* Track list */}
      <div className="space-y-1.5">
        {(tracks || []).map(track => (
          <TrackItem key={track.id} track={track} progress={progressMap[track.id]} />
        ))}
      </div>
    </div>
  );
}

function ContinueListeningCard({ track, progress }: { track: AudioTrack; progress: AudioProgress }) {
  const { play } = useAudioPlayer();

  return (
    <Card className="bg-primary/5 border-primary/20 cursor-pointer" onClick={() => play(track, progress.posicao_segundos)}>
      <CardContent className="p-3 flex items-center gap-3">
        <Play className="w-5 h-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-primary font-medium">Continuar ouvindo</p>
          <p className="text-sm font-medium text-foreground truncate">{track.titulo}</p>
        </div>
        <span className="text-[10px] text-muted-foreground">{formatTime(progress.posicao_segundos)}</span>
      </CardContent>
    </Card>
  );
}
