import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface AmbientPlayerProps {
  audioUrl: string | null;
  autoPlay?: boolean;
  showControls?: boolean;
  initialVolume?: number;
}

export function AmbientPlayer({ 
  audioUrl, 
  autoPlay = true, 
  showControls = true,
  initialVolume = 0.3
}: AmbientPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(initialVolume);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Create audio element when URL is available
  useEffect(() => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    // Handle autoplay after user interaction
    const handleFirstInteraction = () => {
      if (autoPlay && !hasInteracted) {
        setHasInteracted(true);
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Autoplay blocked, user will need to click
        });
      }
      document.removeEventListener('click', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      audio.pause();
      audio.src = '';
    };
  }, [audioUrl, autoPlay]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setHasInteracted(true);
      }).catch(console.error);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  if (!audioUrl || !showControls) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-50"
      onMouseEnter={() => setShowVolumeSlider(true)}
      onMouseLeave={() => setShowVolumeSlider(false)}
    >
      <div className="flex items-center gap-2">
        {/* Volume slider - appears on hover */}
        <AnimatePresence>
          {showVolumeSlider && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 100 }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-card/80 backdrop-blur-sm rounded-full px-3 py-2 border border-border/50">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  onValueChange={handleVolumeChange}
                  max={1}
                  step={0.05}
                  className="w-20"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main control button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={isPlaying ? toggleMute : togglePlay}
          className="h-12 w-12 rounded-full bg-card/60 backdrop-blur-sm border border-border/50 hover:bg-card/80 hover:border-gold/30 transition-all"
        >
          {!isPlaying ? (
            <Music className="h-5 w-5 text-muted-foreground" />
          ) : isMuted ? (
            <VolumeX className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Volume2 className="h-5 w-5 text-gold" />
          )}
        </Button>
      </div>

      {/* Hint for first interaction */}
      {!hasInteracted && audioUrl && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute -top-8 right-0 text-xs text-muted-foreground whitespace-nowrap"
        >
          Clique para ativar o som
        </motion.p>
      )}
    </motion.div>
  );
}
