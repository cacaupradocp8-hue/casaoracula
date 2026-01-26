import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioCardProps {
  id: string;
  title: string;
  porta?: string | null;
  coverImageUrl?: string | null;
  audioUrl: string;
  currentPlayingId: string | null;
  onPlay: (id: string) => void;
  onPause: () => void;
}

export function AudioCard({
  id,
  title,
  porta,
  coverImageUrl,
  audioUrl,
  currentPlayingId,
  onPlay,
  onPause,
}: AudioCardProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const isThisPlaying = currentPlayingId === id && isPlaying;

  // Pause this audio if another one starts playing
  useEffect(() => {
    if (currentPlayingId !== id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  }, [currentPlayingId, id, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      setIsPlaying(true);
      onPlay(id);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onPause();
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [id, onPlay, onPause]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      onPause();
    } else {
      audio.play();
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="group relative rounded-2xl bg-card border border-border/50 p-5 transition-all hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5">
      {/* Cover Image with Animation */}
      <div className="flex flex-col items-center mb-4">
        <div
          className={cn(
            "relative w-28 h-28 rounded-xl overflow-hidden transition-all duration-300",
            // Halo effect when playing
            isThisPlaying && "audio-card-halo"
          )}
        >
          {/* Halo ring - pseudo element via wrapper */}
          <div
            className={cn(
              "absolute inset-0 rounded-xl transition-all duration-500",
              isThisPlaying && "ring-2 ring-gold/40 ring-offset-2 ring-offset-background"
            )}
          />
          
          {/* Cover image with pulse animation */}
          <div
            className={cn(
              "w-full h-full bg-muted flex items-center justify-center",
              isThisPlaying && "audio-card-pulse"
            )}
          >
            {coverImageUrl ? (
              <img
                src={coverImageUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                <Volume2 className="w-8 h-8 text-gold/60" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Title & Porta */}
      <div className="text-center mb-4">
        <h3 className="font-medium text-foreground line-clamp-2 mb-1">
          {title}
        </h3>
        {porta && (
          <p className="text-xs text-gold/80 font-medium">
            {porta}
          </p>
        )}
      </div>

      {/* Audio Player */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="space-y-3">
        {/* Progress bar */}
        <div className="space-y-1">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{duration > 0 ? formatTime(duration) : '--:--'}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>

          <Button
            size="icon"
            onClick={togglePlay}
            className={cn(
              "h-11 w-11 rounded-full transition-all",
              isThisPlaying
                ? "bg-gold text-black hover:bg-gold/90"
                : "bg-gold/20 text-gold hover:bg-gold/30"
            )}
          >
            {isThisPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </Button>

          {/* Spacer for symmetry */}
          <div className="h-8 w-8" />
        </div>
      </div>

      {/* Ethical notice */}
      <p className="mt-4 text-[10px] text-muted-foreground/70 text-center italic border-t border-border/30 pt-3">
        Áudio de treino — não usar com clientes.
      </p>
    </div>
  );
}
