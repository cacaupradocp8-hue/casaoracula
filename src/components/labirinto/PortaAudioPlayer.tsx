import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PortaAudioPlayerProps {
  audioUrl: string;
  audioTitulo?: string | null;
  className?: string;
}

export function PortaAudioPlayer({ audioUrl, audioTitulo, className }: PortaAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!hasStarted) {
      setHasStarted(true);
      setIsLoading(true);
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Error playing audio:", error);
      }
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
    setProgress(value[0]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Lazy loading - don't load audio until first interaction
  const shouldLoadAudio = hasStarted;

  return (
    <div className={cn(
      "p-6 rounded-xl bg-gradient-to-br from-gold/5 via-background to-gold/10 border border-gold/20",
      className
    )}>
      {/* Audio element with lazy loading */}
      {shouldLoadAudio && (
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
      )}

      {/* Title */}
      {audioTitulo && (
        <p className="text-sm text-muted-foreground mb-4 text-center italic">
          {audioTitulo}
        </p>
      )}

      {/* Player controls */}
      <div className="flex items-center gap-4">
        {/* Play/Pause button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlay}
          disabled={isLoading && hasStarted}
          className="w-12 h-12 rounded-full bg-gold/20 hover:bg-gold/30 text-gold"
        >
          {isLoading && hasStarted ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </Button>

        {/* Progress section */}
        <div className="flex-1 space-y-1">
          {/* Progress slider */}
          <Slider
            value={[progress]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            disabled={!hasStarted || duration === 0}
            className="cursor-pointer"
          />
          
          {/* Time display */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{hasStarted ? formatTime(progress) : "0:00"}</span>
            <span>{duration > 0 ? formatTime(duration) : "--:--"}</span>
          </div>
        </div>

        {/* Volume toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          disabled={!hasStarted}
          className="text-muted-foreground hover:text-foreground"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Contemplative message */}
      {!hasStarted && (
        <p className="text-xs text-muted-foreground text-center mt-4 italic">
          Pressione para escutar
        </p>
      )}
    </div>
  );
}
