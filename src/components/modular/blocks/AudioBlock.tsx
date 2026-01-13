import { useState, useRef, useEffect } from 'react';
import { ContentBlock, AudioContent } from '@/types/modular';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioBlockProps {
  block: ContentBlock;
}

export function AudioBlock({ block }: AudioBlockProps) {
  const content = block.content as AudioContent;
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  if (!content.url) {
    return null;
  }

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
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

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = value[0];
    setVolume(value[0]);
  };

  const handleRestart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="animate-fade-in">
      {block.titulo && (
        <h3 className="text-xl font-semibold text-foreground mb-4 text-center">{block.titulo}</h3>
      )}
      
      <div className="glass rounded-2xl p-6 max-w-xl mx-auto">
        {/* Cover Image */}
        {content.coverImage && (
          <div className="mb-4 flex justify-center">
            <div className="w-32 h-32 rounded-xl overflow-hidden shadow-lg">
              <img 
                src={content.coverImage} 
                alt={content.title || 'Audio cover'} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Title & Artist */}
        {(content.title || content.artist) && (
          <div className="text-center mb-4">
            {content.title && (
              <p className="font-semibold text-foreground">{content.title}</p>
            )}
            {content.artist && (
              <p className="text-sm text-muted-foreground">{content.artist}</p>
            )}
          </div>
        )}

        {/* Hidden audio element */}
        <audio 
          ref={audioRef} 
          src={content.url} 
          autoPlay={content.autoplay}
          loop={content.loop}
        />

        {/* Progress bar */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRestart}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>

          <Button 
            variant="gold" 
            size="icon" 
            onClick={togglePlay}
            className="w-12 h-12 rounded-full"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </Button>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMute}
              className="text-muted-foreground hover:text-foreground"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <Slider
              value={[volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
