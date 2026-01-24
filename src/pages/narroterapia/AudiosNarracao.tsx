import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
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
  VolumeX,
  CheckCircle2,
  Circle,
  DoorOpen,
  ClipboardPen
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useNarroterapiaEstudos } from '@/hooks/useNarroterapiaEstudos';
import { CartografiaReacaoModal } from '@/components/narroterapia/CartografiaReacaoModal';

interface AudioNarracao {
  id: string;
  titulo: string;
  descricao: string | null;
  file_path: string;
  duracao_segundos: number | null;
  porta_psiquica: string | null;
}

export default function AudiosNarracao() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Record<string, number>>({});
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [showCartografia, setShowCartografia] = useState(false);
  const [selectedAudioId, setSelectedAudioId] = useState<string | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  
  const { isStudied, toggleStudied, isPending } = useNarroterapiaEstudos();

  // Fetch audios with category 'Narração Padrão Oracular'
  const { data: audios, isLoading } = useQuery({
    queryKey: ['audios-narracao'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audio_assets')
        .select('id, titulo, descricao, file_path, duracao_segundos, porta_psiquica')
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

  const openCartografia = (audioId: string) => {
    setSelectedAudioId(audioId);
    setShowCartografia(true);
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
          <span className="text-foreground">Ofício da Voz</span>
        </nav>

        <SectionHeader
          title="Ofício da Voz Oracular™"
          subtitle="Treino da facilitadora na Narração Padrão Oracular™"
          icon={<Headphones className="w-5 h-5" />}
          className="mb-6"
        />

        {/* Fixed Warning - Exact text from specification */}
        <Alert className="mb-6 border-destructive/50 bg-destructive/10">
          <AlertTriangle className="w-4 h-4 text-destructive" />
          <AlertDescription className="text-destructive text-sm">
            Este áudio é destinado exclusivamente ao treino da facilitadora.
            <br />
            Não deve ser enviado ou reproduzido para clientes.
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
              const studied = isStudied(audio.id);

              return (
                <Card key={audio.id} className={cn(
                  'transition-all',
                  isPlaying && 'border-gold/50 shadow-md',
                  studied && 'border-sage/30'
                )}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-base font-display">
                            {audio.titulo}
                          </CardTitle>
                          {studied && (
                            <Badge variant="secondary" className="text-xs gap-1 bg-sage/10 text-sage-light">
                              <CheckCircle2 className="w-3 h-3" />
                              Estudado
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {audio.porta_psiquica && (
                            <div className="flex items-center gap-1 text-xs text-gold/80">
                              <DoorOpen className="w-3 h-3" />
                              {audio.porta_psiquica}
                            </div>
                          )}
                          {audio.descricao && (
                            <CardDescription className="text-xs">
                              {audio.descricao}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                          onClick={() => toggleStudied(audio.id)}
                          disabled={isPending}
                        >
                          {studied ? (
                            <CheckCircle2 className="w-4 h-4 text-sage" />
                          ) : (
                            <Circle className="w-4 h-4 text-muted-foreground" />
                          )}
                        </Button>
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
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
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
                    
                    {/* Register Reaction Button */}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="w-full gap-2 text-xs"
                      onClick={() => openCartografia(audio.id)}
                    >
                      <ClipboardPen className="w-3 h-3" />
                      Registrar Reação Simbólica
                    </Button>
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

        {/* Cartografia Modal */}
        <CartografiaReacaoModal
          isOpen={showCartografia}
          onClose={() => {
            setShowCartografia(false);
            setSelectedAudioId(null);
          }}
          audioId={selectedAudioId || undefined}
        />
      </div>
    </AppLayout>
  );
}
