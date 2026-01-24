import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { 
  Headphones, 
  Home, 
  ChevronRight, 
  AlertTriangle, 
  Play, 
  Pause, 
  Volume2,
  VolumeX 
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface AudioNarracao {
  id: string;
  titulo: string;
  descricao: string | null;
  file_path: string;
  duracao_segundos: number | null;
}

export default function AudiosNarracao() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Record<string, number>>({});
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  // Fetch audios with category 'Narração Padrão Oracular'
  const { data: audios, isLoading } = useQuery({
    queryKey: ['audios-narracao'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audio_assets')
        .select('id, titulo, descricao, file_path, duracao_segundos')
        .eq('categoria', 'Narração Padrão Oracular')
        .eq('publicado', true)
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as AudioNarracao[];
    },
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = (audio: AudioNarracao) => {
    const audioEl = audioRefs.current[audio.id];
    
    if (!audioEl) {
      // Create audio element
      const newAudio = new Audio();
      
      // Get public URL for the audio file
      const { data: urlData } = supabase.storage.from('audios').getPublicUrl(audio.file_path);
      newAudio.src = urlData.publicUrl;
      newAudio.volume = isMuted ? 0 : volume / 100;
      
      newAudio.ontimeupdate = () => {
        setCurrentTime(prev => ({ ...prev, [audio.id]: newAudio.currentTime }));
      };
      
      newAudio.onended = () => {
        setPlayingId(null);
        setCurrentTime(prev => ({ ...prev, [audio.id]: 0 }));
      };
      
      audioRefs.current[audio.id] = newAudio;
      newAudio.play();
      setPlayingId(audio.id);
      
      // Stop other audios
      Object.entries(audioRefs.current).forEach(([id, el]) => {
        if (id !== audio.id) {
          el.pause();
        }
      });
      
      return;
    }

    if (playingId === audio.id) {
      audioEl.pause();
      setPlayingId(null);
    } else {
      // Stop other audios
      Object.values(audioRefs.current).forEach(el => el.pause());
      audioEl.play();
      setPlayingId(audio.id);
    }
  };

  const handleSeek = (audioId: string, value: number[], duration: number) => {
    const audioEl = audioRefs.current[audioId];
    if (audioEl) {
      const newTime = (value[0] / 100) * duration;
      audioEl.currentTime = newTime;
      setCurrentTime(prev => ({ ...prev, [audioId]: newTime }));
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    Object.values(audioRefs.current).forEach(el => {
      el.volume = newVolume / 100;
    });
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    
    Object.values(audioRefs.current).forEach(el => {
      el.volume = newMuted ? 0 : volume / 100;
    });
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/narroterapia" className="hover:text-foreground transition-colors">
            Narroterapia Oracular™
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Áudios de Narração</span>
        </nav>

        <SectionHeader
          title="Áudios – Narração Padrão Oracular™"
          subtitle="Áudios para treino da facilitadora"
          icon={<Headphones className="w-5 h-5" />}
          className="mb-6"
        />

        {/* Fixed Warning */}
        <Alert className="mb-6 border-destructive/50 bg-destructive/10">
          <AlertTriangle className="w-4 h-4 text-destructive" />
          <AlertDescription className="text-destructive">
            <strong>Não enviar ou reproduzir para clientes.</strong>
            <br />
            Este áudio é exclusivo para treino da facilitadora.
          </AlertDescription>
        </Alert>

        {/* Volume Control */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Volume2 className="w-5 h-5 text-gold" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="flex-1 max-w-[200px]"
              />
              <span className="text-xs text-muted-foreground w-8">
                {isMuted ? 0 : volume}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !audios || audios.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Headphones className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Nenhum áudio de narração cadastrado ainda
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                A administradora pode adicionar áudios em Admin → Áudios
                <br />
                com categoria "Narração Padrão Oracular"
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {audios.map((audio) => {
              const isPlaying = playingId === audio.id;
              const time = currentTime[audio.id] || 0;
              const duration = audio.duracao_segundos || 0;
              const progress = duration > 0 ? (time / duration) * 100 : 0;

              return (
                <Card key={audio.id} className={cn(
                  'transition-all',
                  isPlaying && 'border-gold/50 shadow-md'
                )}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-base font-display">
                          {audio.titulo}
                        </CardTitle>
                        {audio.descricao && (
                          <CardDescription className="text-sm mt-1">
                            {audio.descricao}
                          </CardDescription>
                        )}
                      </div>
                      <Button
                        variant={isPlaying ? 'secondary' : 'outline'}
                        size="icon"
                        className={cn(
                          'shrink-0',
                          isPlaying && 'bg-gold/10 border-gold/50'
                        )}
                        onClick={() => handlePlayPause(audio)}
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4 text-gold" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Slider
                        value={[progress]}
                        onValueChange={(v) => handleSeek(audio.id, v, duration)}
                        max={100}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{formatTime(time)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Info Note */}
        <div className="mt-8 p-4 rounded-lg bg-muted/30 border border-border/50 text-center">
          <p className="text-xs text-muted-foreground">
            Os áudios são para treino pessoal da facilitadora.
            <br />
            Não estão disponíveis para download ou compartilhamento.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
