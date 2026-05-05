import React, { useState, useRef } from 'react';
import { Play, Pause, CheckCircle2, AlertCircle } from 'lucide-react';
import { StationAudioV3, UserProgressV3, useUpdateProgress } from '@/hooks/useClubeV3';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AudioBlockProps {
  stationId: string;
  audios: StationAudioV3[];
  progress: UserProgressV3 | null;
}

export function AudioBlock({ stationId, audios, progress }: AudioBlockProps) {
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState<Record<string, number>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const updateProgress = useUpdateProgress();
  const { toast } = useToast();

  const handlePlay = (audio: StationAudioV3) => {
    if (currentPlayingId === audio.id) {
      audioRef.current?.pause();
      setCurrentPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = audio.audio_url;
        audioRef.current.play().catch(e => {
          console.error("Audio play error", e);
          toast({
            variant: "destructive",
            title: "Erro ao carregar áudio",
            description: "Não foi possível reproduzir este arquivo."
          });
        });
        setCurrentPlayingId(audio.id);
      }
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current && currentPlayingId) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setPlaybackProgress(prev => ({ ...prev, [currentPlayingId]: p }));
      
      // Mark as completed if > 90%
      if (p > 90 && !progress?.audio_completed) {
        updateProgress.mutate({ stationId, field: 'audio_completed', value: true });
      }
    }
  };

  const onEnded = () => {
    setCurrentPlayingId(null);
    // Auto-advance logic could go here
  };

  return (
    <div className="space-y-6 bg-midnight/40 border border-gold/20 rounded-3xl p-6 md:p-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-serif text-gold/90">Áudios da Estação</h3>
        {progress?.audio_completed && (
          <div className="flex items-center gap-2 text-gold text-[10px] font-bold uppercase tracking-widest">
            <CheckCircle2 className="w-3 h-3" />
            Concluído
          </div>
        )}
      </div>

      <div className="space-y-3">
        {audios.map((audio, index) => {
          const isPlaying = currentPlayingId === audio.id;
          const p = playbackProgress[audio.id] || 0;

          return (
            <div 
              key={audio.id}
              className={cn(
                "group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300",
                isPlaying ? "bg-gold/10 border-gold/40" : "bg-midnight/20 border-border/5 hover:border-gold/20"
              )}
            >
              <span className="text-[10px] font-mono text-muted-foreground/40 w-4">
                {(index + 1).toString().padStart(2, '0')}
              </span>

              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "w-10 h-10 rounded-full shrink-0 transition-all",
                  isPlaying ? "bg-gold text-midnight hover:bg-gold/80" : "bg-gold/5 text-gold hover:bg-gold/20"
                )}
                onClick={() => handlePlay(audio)}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </Button>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground/90 truncate">{audio.title}</p>
                {isPlaying && (
                  <div className="mt-2 space-y-1">
                    <Progress value={p} className="h-0.5 bg-gold/5" />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {audios.length === 0 && (
          <div className="text-center py-6">
            <AlertCircle className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground/40 italic">Nenhum áudio disponível nesta estação.</p>
          </div>
        )}
      </div>

      <audio 
        ref={audioRef} 
        onTimeUpdate={onTimeUpdate} 
        onEnded={onEnded}
        className="hidden" 
      />
    </div>
  );
}
