// ============================================
// Mini Player — Fixed bottom bar when audio playing
// ============================================

import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function MiniPlayer() {
  let playerCtx: ReturnType<typeof useAudioPlayer> | null = null;
  try {
    playerCtx = useAudioPlayer();
  } catch {
    return null;
  }
  const { state, togglePlay, pause } = playerCtx;

  if (!state.track) return null;

  const progress = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        exit={{ y: 80 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg"
      >
        {/* Progress bar */}
        <div className="h-0.5 bg-muted w-full">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex items-center gap-3 px-4 py-2.5 max-w-3xl mx-auto">
          <Button variant="ghost" size="sm" className="w-9 h-9 p-0 shrink-0" onClick={togglePlay}>
            {state.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-foreground">{state.track.titulo}</p>
            <p className="text-[10px] text-muted-foreground">{formatTime(state.currentTime)} / {formatTime(state.duration)}</p>
          </div>

          {/* Playing indicator */}
          {state.isPlaying && (
            <div className="flex items-end gap-0.5 h-4">
              <span className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: '40%', animationDelay: '0ms' }} />
              <span className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: '70%', animationDelay: '150ms' }} />
              <span className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: '50%', animationDelay: '300ms' }} />
              <span className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: '90%', animationDelay: '100ms' }} />
            </div>
          )}

          <Button variant="ghost" size="sm" className="w-7 h-7 p-0 shrink-0 text-muted-foreground" onClick={pause}>
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function formatTime(s: number): string {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}
