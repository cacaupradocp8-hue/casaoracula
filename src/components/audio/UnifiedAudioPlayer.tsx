import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Play, Pause, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isValidAudioUrl, getPublicAudioUrl, formatAudioTime } from '@/lib/audioUtils';

export interface UnifiedAudioPlayerProps {
  audioUrl: string | null | undefined;
  title?: string;
  coverImage?: string | null;
  size?: 'sm' | 'md' | 'lg';
  showTitle?: boolean;
  className?: string;
  onError?: () => void;
}

export function UnifiedAudioPlayer({
  audioUrl,
  title,
  coverImage,
  size = 'md',
  showTitle = true,
  className,
  onError,
}: UnifiedAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Resolve the audio URL
  const resolvedUrl = getPublicAudioUrl(audioUrl);
  const isValid = isValidAudioUrl(resolvedUrl);

  // Don't render if URL is invalid
  if (!isValid || !resolvedUrl) {
    return null;
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    };
    const handleError = () => {
      setHasError(true);
      onError?.();
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
    };
  }, [onError]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => setHasError(true));
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

  // Error state
  if (hasError) {
    return (
      <Card className={cn("p-4 bg-muted/30", className)}>
        <div className="flex items-center gap-3 text-muted-foreground">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">Não foi possível carregar o áudio</span>
        </div>
      </Card>
    );
  }

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
  };

  const buttonSizes = {
    sm: 'h-9 w-9',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return (
    <Card className={cn("bg-card/50 border-border/50", sizeClasses[size], className)}>
      <audio ref={audioRef} src={resolvedUrl} preload="metadata" />

      <div className="flex items-center gap-4">
        {/* Cover Image (optional) */}
        {coverImage && (
          <div className={cn(
            "rounded-lg overflow-hidden shrink-0 bg-muted",
            size === 'sm' ? 'w-10 h-10' : size === 'md' ? 'w-12 h-12' : 'w-16 h-16'
          )}>
            <img
              src={coverImage}
              alt={title || 'Áudio'}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex-1 min-w-0 space-y-2">
          {/* Title */}
          {showTitle && title && (
            <p className="text-sm font-medium text-foreground truncate">
              {title}
            </p>
          )}

          {/* Progress */}
          <div className="space-y-1">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatAudioTime(currentTime)}</span>
              <span>{duration > 0 ? formatAudioTime(duration) : '--:--'}</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
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
              buttonSizes[size],
              "rounded-full transition-all",
              isPlaying
                ? "bg-gold text-black hover:bg-gold/90"
                : "bg-gold/20 text-gold hover:bg-gold/30"
            )}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
