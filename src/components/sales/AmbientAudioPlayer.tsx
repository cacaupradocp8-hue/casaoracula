import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Slider } from '@/components/ui/slider';

const AMBIENT_KEYS = [
  'vitrine_ambient_audio_url',
  'vitrine_ambient_audio_ativo',
  'vitrine_ambient_audio_volume',
];

export function AmbientAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(30);
  const [showVolume, setShowVolume] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ['vitrine-ambient-settings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('app_settings')
        .select('key, value')
        .in('key', AMBIENT_KEYS);
      const map: Record<string, string> = {};
      data?.forEach((s) => (map[s.key] = s.value));
      return map;
    },
    staleTime: 10 * 60 * 1000,
  });

  const isActive = settings?.vitrine_ambient_audio_ativo === 'true';
  const audioUrl = settings?.vitrine_ambient_audio_url?.trim() || '';
  const defaultVolume = Number(settings?.vitrine_ambient_audio_volume ?? '30');

  useEffect(() => {
    setVolume(defaultVolume);
  }, [defaultVolume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

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

  return (
    <>
      <audio ref={audioRef} src={audioUrl} loop preload="none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
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
          className="w-11 h-11 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-[hsl(40,35%,60%)]/40 transition-all duration-300 shadow-lg"
          title={isPlaying ? 'Pausar áudio ambiente' : 'Tocar áudio ambiente'}
        >
          {isPlaying ? (
            <Volume2 className="w-4.5 h-4.5" />
          ) : (
            <Music className="w-4.5 h-4.5" />
          )}
        </button>
      </motion.div>
    </>
  );
}
