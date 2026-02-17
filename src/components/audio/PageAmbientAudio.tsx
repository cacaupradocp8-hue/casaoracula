import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music, Pause } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PageAmbientAudioProps {
  /** The settings key prefix, e.g. "entry" will look for entry_audio_url, entry_audio_ativo, entry_audio_volume */
  settingsPrefix: string;
  /** If true, attempts to auto-play on first user interaction */
  autoPlay?: boolean;
  /** Position of the floating button */
  position?: 'bottom-right' | 'bottom-left';
}

export function PageAmbientAudio({
  settingsPrefix,
  autoPlay = true,
  position = 'bottom-right',
}: PageAmbientAudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(30);
  const [showVolume, setShowVolume] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const keys = [
    `${settingsPrefix}_audio_url`,
    `${settingsPrefix}_audio_ativo`,
    `${settingsPrefix}_audio_volume`,
  ];

  const { data: settings } = useQuery({
    queryKey: ['ambient-audio-settings', settingsPrefix],
    queryFn: async () => {
      const { data } = await supabase
        .from('app_settings')
        .select('key, value')
        .in('key', keys);
      const map: Record<string, string> = {};
      data?.forEach((s) => (map[s.key] = s.value));
      return map;
    },
    staleTime: 10 * 60 * 1000,
  });

  const isActive = settings?.[`${settingsPrefix}_audio_ativo`] === 'true';
  const audioUrl = settings?.[`${settingsPrefix}_audio_url`]?.trim() || '';
  const defaultVolume = Number(settings?.[`${settingsPrefix}_audio_volume`] ?? '30');

  useEffect(() => {
    setVolume(defaultVolume);
  }, [defaultVolume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Auto-play on first user interaction with the page
  useEffect(() => {
    if (!autoPlay || !audioUrl || !isActive || hasInteracted) return;

    const handleInteraction = () => {
      setHasInteracted(true);
      const audio = audioRef.current;
      if (audio) {
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    };

    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });
    document.addEventListener('scroll', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
    };
  }, [autoPlay, audioUrl, isActive, hasInteracted]);

  if (!isActive || !audioUrl) return null;

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const positionClass = position === 'bottom-left' ? 'left-6' : 'right-6';

  return (
    <>
      <audio ref={audioRef} src={audioUrl} loop preload="none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className={`fixed bottom-6 ${positionClass} z-50 flex items-center gap-2`}
        onMouseEnter={() => setShowVolume(true)}
        onMouseLeave={() => setShowVolume(false)}
      >
        <AnimatePresence>
          {showVolume && isPlaying && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 120 }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-background/80 backdrop-blur-md border border-border rounded-full px-3 py-2">
                <Slider
                  value={[volume]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={([v]) => setVolume(v)}
                  className="w-full"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={togglePlay}
          className="w-11 h-11 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-300 shadow-lg"
          title={isPlaying ? 'Pausar áudio' : 'Tocar áudio'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Music className="w-4 h-4" />
          )}
        </button>
      </motion.div>
    </>
  );
}
