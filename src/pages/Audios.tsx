import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { 
  Headphones, 
  Loader2, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  SkipBack,
  Music,
  Home,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioAsset {
  id: string;
  titulo: string;
  descricao: string | null;
  file_path: string;
  duracao_segundos: number | null;
  capa_url: string | null;
  categoria: string | null;
  portal_minimo: string;
}

export default function Audios() {
  const [audios, setAudios] = useState<AudioAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentAudio, setCurrentAudio] = useState<AudioAsset | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchAudios();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const fetchAudios = async () => {
    const { data, error } = await supabase
      .from('audio_assets')
      .select('*')
      .eq('publicado', true)
      .order('ordem');

    if (!error && data) {
      setAudios(data);
    }
    setLoading(false);
  };

  const getAudioUrl = (filePath: string) => {
    const { data } = supabase.storage.from('audios').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handlePlay = (audio: AudioAsset) => {
    if (currentAudio?.id === audio.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentAudio(audio);
      setIsPlaying(true);
      setCurrentTime(0);
    }
  };

  const handleAudioLoaded = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      audioRef.current.play();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const groupedAudios = audios.reduce((acc, audio) => {
    const cat = audio.categoria || 'Geral';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(audio);
    return acc;
  }, {} as Record<string, AudioAsset[]>);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-32">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Áudios</span>
        </nav>

        <SectionHeader
          title="Biblioteca de Áudios"
          subtitle="Meditações, rituais e práticas simbólicas"
          icon={<Headphones className="w-5 h-5" />}
        />

        {audios.length === 0 ? (
          <Card className="mt-8">
            <CardContent className="py-12 text-center">
              <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Nenhum áudio disponível no momento.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8 mt-8">
            {Object.entries(groupedAudios).map(([categoria, categoryAudios]) => (
              <div key={categoria}>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Badge variant="outline">{categoria}</Badge>
                  <span className="text-muted-foreground text-sm">
                    ({categoryAudios.length} {categoryAudios.length === 1 ? 'áudio' : 'áudios'})
                  </span>
                </h2>

                <div className="grid gap-4">
                  {categoryAudios.map((audio) => {
                    const isActive = currentAudio?.id === audio.id;
                    const isThisPlaying = isActive && isPlaying;

                    return (
                      <Card 
                        key={audio.id}
                        className={cn(
                          'transition-all cursor-pointer hover:border-gold/50',
                          isActive && 'border-gold ring-1 ring-gold/50'
                        )}
                        onClick={() => handlePlay(audio)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            {/* Cover / Play Button */}
                            <div className={cn(
                              'w-14 h-14 rounded-lg flex items-center justify-center shrink-0',
                              audio.capa_url ? 'bg-cover bg-center' : 'bg-muted',
                              isActive && 'ring-2 ring-gold'
                            )}
                            style={audio.capa_url ? { backgroundImage: `url(${audio.capa_url})` } : {}}
                            >
                              {!audio.capa_url && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={cn(
                                    'w-10 h-10 rounded-full',
                                    isActive && 'bg-gold text-black hover:bg-gold/90'
                                  )}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePlay(audio);
                                  }}
                                >
                                  {isThisPlaying ? (
                                    <Pause className="w-5 h-5" />
                                  ) : (
                                    <Play className="w-5 h-5 ml-0.5" />
                                  )}
                                </Button>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{audio.titulo}</p>
                              {audio.descricao && (
                                <p className="text-sm text-muted-foreground truncate">
                                  {audio.descricao}
                                </p>
                              )}
                            </div>

                            {/* Duration */}
                            <div className="text-sm text-muted-foreground">
                              {audio.duracao_segundos 
                                ? formatTime(audio.duracao_segundos)
                                : '--:--'}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Audio Element */}
        {currentAudio && (
          <audio
            ref={audioRef}
            src={getAudioUrl(currentAudio.file_path)}
            onLoadedMetadata={handleAudioLoaded}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleAudioEnded}
          />
        )}

        {/* Fixed Player Bar */}
        {currentAudio && (
          <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border p-4 z-50">
            <div className="container mx-auto max-w-4xl">
              <div className="flex items-center gap-4">
                {/* Cover */}
                <div 
                  className="w-12 h-12 rounded bg-muted shrink-0 bg-cover bg-center"
                  style={currentAudio.capa_url ? { backgroundImage: `url(${currentAudio.capa_url})` } : {}}
                >
                  {!currentAudio.capa_url && (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{currentAudio.titulo}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {formatTime(currentTime)}
                    </span>
                    <Slider
                      value={[currentTime]}
                      min={0}
                      max={duration || 100}
                      step={1}
                      onValueChange={handleSeek}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground">
                      {formatTime(duration)}
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleRestart}
                  >
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    className="h-10 w-10 rounded-full bg-gold text-black hover:bg-gold/90"
                    onClick={() => handlePlay(currentAudio)}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
