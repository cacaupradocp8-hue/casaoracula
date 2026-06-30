import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface AmbientAudioPlayerProps {
  /** destino key on clube_v3_station_audios. Defaults to 'ferramenta_ambiente'. */
  destino?: string;
  /** Optional explicit url; overrides DB lookup. */
  url?: string;
  label?: string;
}

/**
 * Floating, discreet ambient audio pill.
 * Autoplays muted (per browser policy), unmutes on first user interaction.
 * Shows a small reminder so the user can disable it at any time.
 */
export const AmbientAudioPlayer = ({
  destino = 'ferramenta_ambiente',
  url,
  label = 'Som ambiente',
}: AmbientAudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [src, setSrc] = useState<string | null>(url ?? null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (url) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('clube_v3_station_audios')
        .select('audio_url')
        .eq('destino', destino)
        .eq('status', 'ativo')
        .order('display_order', { ascending: true })
        .limit(1);
      if (!cancelled && data && data[0]?.audio_url) setSrc(data[0].audio_url);
    })();
    return () => {
      cancelled = true;
    };
  }, [destino, url]);

  // Try muted autoplay once we have a source.
  useEffect(() => {
    if (!src || !audioRef.current) return;
    const el = audioRef.current;
    el.volume = 0.25;
    el.muted = true;
    el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [src]);

  // Unmute on first user interaction.
  useEffect(() => {
    if (!src) return;
    const unmuteOnce = () => {
      const el = audioRef.current;
      if (el && el.muted) {
        el.muted = false;
        setMuted(false);
        el.play().then(() => setPlaying(true)).catch(() => {});
      }
      window.removeEventListener('pointerdown', unmuteOnce);
      window.removeEventListener('keydown', unmuteOnce);
    };
    window.addEventListener('pointerdown', unmuteOnce, { once: true });
    window.addEventListener('keydown', unmuteOnce, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unmuteOnce);
      window.removeEventListener('keydown', unmuteOnce);
    };
  }, [src]);

  if (!src) return null;

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.muted || el.paused) {
      el.muted = false;
      el.play().then(() => {
        setMuted(false);
        setPlaying(true);
      }).catch(() => {});
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  const active = playing && !muted;

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />
      <div
        className={cn(
          'fixed bottom-4 right-4 z-40',
          'flex items-center gap-3 px-4 py-2.5 rounded-full',
          'bg-midnight/80 backdrop-blur-md border border-gold/20',
          'shadow-lg shadow-black/40 text-white/80 text-xs',
          'transition-all hover:border-gold/40'
        )}
        role="region"
        aria-label="Controle de som ambiente"
      >
        <button
          onClick={toggle}
          className="flex items-center gap-2 group"
          aria-label={active ? 'Silenciar som ambiente' : 'Ativar som ambiente'}
        >
          <span
            className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center transition-colors',
              active ? 'bg-gold/15 text-gold' : 'bg-white/5 text-white/50'
            )}
          >
            {active ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </span>
          <span className="font-serif italic tracking-wide hidden sm:inline">
            {active ? `${label} · clique para silenciar` : `${label} ativado`}
          </span>
          <span className="font-serif italic sm:hidden">{label}</span>
        </button>
      </div>
    </>
  );
};

export default AmbientAudioPlayer;
